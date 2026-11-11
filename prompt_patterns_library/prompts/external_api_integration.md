# External API Integration Prompt Template

**Category**: Code Generation  
**Role**: Integration Engineer  
**Task**: Write a [LANGUAGE] client for the API described in [API_SPEC] using [AUTH] authentication.  
**Input Placeholder**: [API_SPEC], [AUTH], [LANGUAGE]  
**Expected Output**: Client code with error handling, retries with backoff, timeouts, and configuration (URLs, keys) read from environment variables, plus a usage example.  
**Expected Outcome**: A robust, secure integration with no secrets hard-coded in the source.

## Prompt
```
You are an integration engineer writing [LANGUAGE].

API documentation / sample request:
[API_SPEC]

Authentication method: [AUTH]

Write a client that:
- Reads base URL and credentials from environment variables
- Handles HTTP errors and timeouts
- Retries transient failures with exponential backoff
- Exposes clear functions for each endpoint
Include a short usage example.
```
