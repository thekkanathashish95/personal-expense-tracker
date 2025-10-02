/**
 * Firebase Functions v2 - SMS Expense Tracker
 * Core functions for SMS processing and expense management
 */

const {setGlobalOptions} = require("firebase-functions/v2/options");
const {onCall} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");
const {parseSmsWithLLM} = require("./utils/llmParser");

// Limit container scaling to control costs
setGlobalOptions({maxInstances: 10});

// Initialize Firebase Admin SDK (for Firestore)
admin.initializeApp();
const db = admin.firestore();

/**
 * Store raw SMS from device
 * Called by Android app via Firebase Functions SDK
 */
exports.addExpenseFromSms = onCall(async (request) => {
  try {
    const {sender, message, uid} = request.data;

    if (!sender || !message) {
      throw new Error("Both sender and message are required");
    }

    // Validate that Firebase auth UID matches the provided UID
    const authUid = request.auth && request.auth.uid;
    if (!authUid) {
      throw new Error("Authentication required");
    }

    if (uid && uid !== authUid) {
      logger.warn("UID mismatch detected", {
        providedUid: uid,
        authUid: authUid,
      });
      throw new Error("UID validation failed");
    }

    // Use the authenticated UID (more secure than trusting the payload)
    const userId = authUid;

    const smsDoc = {
      userId: userId, // use authenticated UID for security
      sender,
      message,
      receivedAt: new Date().toISOString(),
      processed: false,
    };

    const ref = await db.collection("sms_raw").add(smsDoc);

    logger.info("SMS stored", {id: ref.id, ...smsDoc});

    return {id: ref.id, ...smsDoc};
  } catch (error) {
    logger.error("Error storing SMS", error);
    throw new Error("Failed to store SMS");
  }
});

/**
 * Firestore trigger to process new SMS messages
 * Automatically processes incoming SMS and creates expense records
 */
exports.processSmsOnCreate = onDocumentCreated("sms_raw/{smsId}", async (event) => {
  try {
    const smsDoc = event.data && event.data.data();
    const smsId = event.params.smsId;

    if (!smsDoc) {
      logger.error("No document data found", {smsId});
      return;
    }

    // Skip if already processed
    if (smsDoc.processed) {
      logger.info("SMS already processed", {smsId});
      return;
    }

    // Skip if expenseId already exists (idempotency)
    if (smsDoc.expenseId) {
      logger.info("SMS already has expenseId", {smsId, expenseId: smsDoc.expenseId});
      return;
    }

    logger.info("Processing SMS", {smsId, sender: smsDoc.sender});

    // Call OpenRouter LLM to parse SMS
    const parseResult = await parseSmsWithLLM({
      sender: smsDoc.sender,
      message: smsDoc.message,
      receivedAt: smsDoc.receivedAt,
      userId: smsDoc.userId,
    });

    if (!parseResult.isTransaction) {
      // Delete non-transaction SMS
      await db.collection("sms_raw").doc(smsId).delete();
      logger.info("Deleted non-transaction SMS", {smsId});
      return;
    }

    // Validate required fields for transaction
    if (!parseResult.amount || !parseResult.category || !parseResult.note || !parseResult.source) {
      const error = "Missing required transaction fields from LLM parsing";
      await db.collection("sms_raw").doc(smsId).update({
        processed: true,
        error: {code: "INCOMPLETE_PARSE", message: error},
      });
      logger.error("Incomplete LLM parse result", {smsId, parseResult});
      return;
    }

    // Create expense document
    const expense = {
      userId: smsDoc.userId,
      amount: parseResult.amount,
      category: parseResult.category,
      note: parseResult.note,
      source: parseResult.source,
      date: parseResult.transactionDate || smsDoc.receivedAt,
      sender: smsDoc.sender,
      message: smsDoc.message,
      receivedAt: smsDoc.receivedAt,
      expense_type: "personal", // Default, can be edited later
      rawSmsId: smsId,
      createdAt: new Date().toISOString(),
    };

    const expenseRef = await db.collection("expenses").add(expense);

    // Update SMS document as processed
    await db.collection("sms_raw").doc(smsId).update({
      processed: true,
      expenseId: expenseRef.id,
    });

    logger.info("Successfully processed SMS to expense", {
      smsId,
      expenseId: expenseRef.id,
      amount: parseResult.amount,
      category: parseResult.category,
      confidence: parseResult.confidence,
    });
  } catch (error) {
    logger.error("Error processing SMS", {smsId: event.params.smsId, error});

    // Mark SMS as having an error for potential retry
    try {
      await db.collection("sms_raw").doc(event.params.smsId).update({
        processed: false,
        error: {code: "PROCESSING_ERROR", message: error.message},
      });
    } catch (updateError) {
      logger.error("Failed to update SMS error status", {smsId: event.params.smsId, error: updateError});
    }
  }
});
