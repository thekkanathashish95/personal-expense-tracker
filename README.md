# Personal Expense Tracker

An intelligent SMS-based expense tracking system that automatically processes bank SMS messages using AI to extract and categorize expenses.

## 🏗️ Architecture

This project consists of:
- **Backend**: Firebase Functions + Firestore (this repository)
- **Android App**: SMS Forwarder ([separate repository](https://github.com/thekkanathashish95/android-sms-forwarder-app))
- **Web App**: React dashboard (planned)

## 🚀 Features

### ✅ Implemented
- **Automatic SMS Processing**: Real-time processing of bank SMS messages
- **AI-Powered Parsing**: Uses OpenRouter + DeepSeek model to extract transaction details
- **Smart Filtering**: Automatically filters out non-transaction SMS (OTPs, balance queries, etc.)
- **Secure Authentication**: Firebase Auth with UID validation
- **Real-time Sync**: Firestore triggers for instant processing

### 📊 Data Extracted
- **Amount**: Precise transaction amounts
- **Category**: Shopping, Food & Dining, Transportation, etc.
- **Source**: Bank account, Credit Card, etc.
- **Date**: Transaction date with fallback to SMS received time
- **Notes**: Merchant/transaction details

## 🛠️ Tech Stack

- **Backend**: Firebase Functions v2, Firestore
- **AI**: OpenRouter API with DeepSeek model
- **Authentication**: Firebase Auth (anonymous)
- **Region**: asia-south1

## 📁 Project Structure

```
functions/
├── index.js              # Main Firebase Functions
├── utils/
│   └── llmParser.js      # LLM integration module
└── package.json

firebase.json              # Firebase configuration
firestore.rules            # Database security rules
firestore.indexes.json     # Database indexes
```

## 🔧 Setup

### Prerequisites
- Node.js 22+
- Firebase CLI
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thekkanathashish95/personal-expense-tracker.git
   cd personal-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   cd functions
   npm install
   ```

3. **Configure Firebase**
   ```bash
   firebase login
   firebase use --add
   ```

4. **Set up environment variables**
   ```bash
   firebase functions:config:set openrouter.key="YOUR_OPENROUTER_API_KEY"
   ```

5. **Deploy**
   ```bash
   firebase deploy --only functions,firestore:rules
   ```

## 📱 Android App Integration

The Android SMS Forwarder app (separate repository) sends SMS data to the `addExpenseFromSms` function. The backend:

1. **Receives SMS**: Stores raw SMS in `sms_raw` collection
2. **Processes with AI**: Uses LLM to extract transaction details
3. **Creates Expense**: Stores structured data in `expenses` collection
4. **Real-time Updates**: Firestore triggers handle processing automatically

## 🔒 Security Features

- **Firebase Authentication**: All function calls require valid auth
- **UID Validation**: Ensures payload UID matches authenticated UID
- **Firestore Rules**: User-scoped access to collections
- **Input Validation**: Comprehensive validation and error handling
- **Security Logging**: Tracks unauthorized access attempts

## 📊 Database Schema

### `sms_raw` Collection
```javascript
{
  userId: string,
  sender: string,
  message: string,
  receivedAt: string (ISO8601),
  processed: boolean,
  expenseId?: string,
  error?: { code: string, message: string }
}
```

### `expenses` Collection
```javascript
{
  userId: string,
  amount: number,
  category: string,
  note: string,
  source: string,
  date: string (ISO8601),
  sender: string,
  message: string,
  receivedAt: string (ISO8601),
  expense_type?: string,
  rawSmsId?: string,
  createdAt: string (ISO8601),
  updatedAt?: string (ISO8601)
}
```

## 🧪 Testing Results

- **Transaction Detection**: 100% accuracy
- **Amount Extraction**: Perfect precision
- **Source Identification**: All 4 bank/card types supported
- **Category Classification**: Excellent accuracy
- **Non-Transaction Filtering**: Perfect (OTPs, balance queries filtered out)

## 🚀 Deployment

```bash
# Deploy functions and rules
firebase deploy --only functions,firestore:rules

# Monitor logs
firebase functions:log --follow
```

## 📈 Performance

- **Processing Time**: < 10 seconds per SMS
- **Cost Optimization**: Max 10 function instances
- **Reliability**: Comprehensive error handling and retry mechanisms

## 🔮 Roadmap

- [ ] Web dashboard (React + Vite)
- [ ] Monthly analytics and charts
- [ ] Expense categorization improvements
- [ ] Export functionality
- [ ] Mobile web app

## 🤝 Contributing

This is a personal project, but feel free to open issues or submit PRs for improvements.

## 📄 License

MIT License - see LICENSE file for details.

---

**Note**: This backend works with the [Android SMS Forwarder App](https://github.com/thekkanathashish95/android-sms-forwarder-app) to create a complete expense tracking solution.
