/**
 * LLM Parser Module for SMS Transaction Detection
 * Handles OpenRouter API integration and SMS parsing
 */

const {logger} = require("firebase-functions");

/**
 * Call OpenRouter LLM to parse SMS and determine if it's a transaction
 * @param {Object} smsData - SMS data object
 * @param {string} smsData.sender - SMS sender
 * @param {string} smsData.message - SMS message content
 * @param {string} smsData.receivedAt - When SMS was received
 * @param {string} smsData.userId - User ID
 * @return {Promise<Object>} Parsed result with transaction details
 */
async function parseSmsWithLLM(smsData) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const systemPrompt = `You are an expert at parsing Indian bank SMS messages. ` +
    `Your task is to:
1. Determine if the SMS is about a financial transaction
2. If it's a transaction, extract key details in a structured format

SMS Format Examples:
- Transaction: "Rs. 1,234.56 debited from your HDFC Bank account ending 1234 on 01-Jan-25 at MERCHANT NAME"
- OTP: "OTP is 123456 for your HDFC Bank transaction"
- Balance: "Your HDFC Bank account balance is Rs. 10,000.00"

Transaction Sources (exactly one of these):
- "HDFC Bank account"
- "HDFC Credit Card"
- "ICICI Bank Account"
- "ICICI Credit card"

Categories should be descriptive (e.g., "Food & Dining", "Shopping", "Transportation", "Utilities", "Entertainment")

You must respond with valid JSON in this exact format:
{
  "isTransaction": boolean,
  "amount": number (only if isTransaction is true),
  "transactionDate": "YYYY-MM-DDTHH:mm:ss.sssZ" (only if isTransaction is true),
  "category": "string" (only if isTransaction is true),
  "note": "string" (only if isTransaction is true),
  "source": "string" (only if isTransaction is true, must be one of the 4 sources above),
  "confidence": number between 0 and 1 (only if isTransaction is true)
}

If isTransaction is false, only include "isTransaction": false.`;

  const userPrompt = `Parse this SMS:
Sender: ${smsData.sender}
Message: ${smsData.message}
Received at: ${smsData.receivedAt}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://your-app.com",
      "X-Title": "SMS Expense Tracker",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-v3.2-exp",
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: userPrompt},
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.1,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error("OpenRouter API error", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(`OpenRouter API error: ${response.status} ` +
      `${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices && data.choices[0] &&
    data.choices[0].message && data.choices[0].message.content;

  if (!content) {
    throw new Error("No response content from OpenRouter");
  }

  try {
    // Extract JSON from markdown code blocks if present
    let jsonContent = content.trim();

    // Remove markdown code block wrapper if present
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsedResult = JSON.parse(jsonContent);

    // Validate required fields for transactions
    if (parsedResult.isTransaction) {
      if (!parsedResult.amount || !parsedResult.category ||
          !parsedResult.note || !parsedResult.source) {
        throw new Error("Missing required transaction fields in LLM response");
      }
    }

    return parsedResult;
  } catch (parseError) {
    logger.error("Failed to parse OpenRouter response", {
      content,
      error: parseError.message,
    });
    throw new Error(`Invalid JSON response from OpenRouter: ` +
      `${parseError.message}`);
  }
}

module.exports = {
  parseSmsWithLLM,
};
