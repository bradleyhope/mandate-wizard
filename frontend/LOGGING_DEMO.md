# Query Logging System - Demonstration

## Overview
The comprehensive logging system is now capturing every user interaction with detailed analytics.

## Sample Query Log

### Query #3 - Most Recent
```json
{
  "Query ID": 3,
  "Timestamp": "2025-10-29T10:01:21",
  "User Email": "unknown",
  "Question": "What are recent comedy greenlights?",
  "Answer": "Netflix has greenlit 9 comedy projects recently...",
  "Intent Classification": "HYBRID",
  "Response Time": "15.526 seconds",
  "Follow-up Questions": [
    "Tell me more about Haunted Hotel",
    "What are Netflix's top priorities right now?",
    "Who should I pitch my project to?",
    "What markets is Netflix investing in?",
    "How do I get an introduction to Netflix?"
  ],
  "Session ID": "default",
  "Metadata": {
    "subscription_status": "unknown",
    "conversation_length": 3,
    "has_history": true
  }
}
```

## Usage Statistics

**Current Stats:**
- **Total Queries:** 3
- **Unique Users:** 1
- **Average Response Time:** 14.2 seconds
- **Intent Distribution:**
  - HYBRID: 2 queries (66%)
  - ROUTING: 1 query (34%)

## What's Being Logged

For every single query, the system captures:

1. **User Information**
   - Email address
   - Subscription status
   - Session ID for conversation tracking

2. **Query Details**
   - Exact question asked
   - Full answer provided
   - Intent classification (ROUTING, HYBRID, FACTUAL_QUERY, etc.)

3. **Performance Metrics**
   - Response time in milliseconds
   - Token count estimate
   - Vector search result count
   - Graph search result count

4. **Context**
   - Follow-up questions generated
   - Resources used
   - Conversation history length
   - Whether query had prior context

5. **Error Tracking**
   - Any errors that occurred
   - Error messages and stack traces

## Admin Endpoints

### View Recent Logs
```bash
GET /admin/logs?limit=100&user_email=bradley@projectbrazen.com
```

### View Session Conversation
```bash
GET /admin/logs/session/<session_id>
```

### Get Usage Statistics
```bash
GET /admin/logs/stats
```

### Export All Logs
```bash
GET /admin/logs/export?limit=1000
# Downloads JSON file with all logs
```

## Database Location

All logs are stored in SQLite database:
```
/home/ubuntu/mandate_wizard_web_app/query_logs.db
```

## Example Use Cases

### 1. Track Beta User Behavior
See what questions your beta users are asking most frequently to understand their needs.

### 2. Improve Answer Quality
Review queries where response time was high or intent classification was uncertain.

### 3. Identify Popular Topics
Analyze intent distribution and question patterns to see what content is most valuable.

### 4. Monitor System Performance
Track average response times and identify bottlenecks.

### 5. User Engagement Analysis
See conversation length and follow-up patterns to measure engagement.

## Privacy & Security

- All logs are stored locally in your infrastructure
- No data is sent to third parties
- Thread-safe logging prevents race conditions
- Indexed database for fast queries even with millions of logs

