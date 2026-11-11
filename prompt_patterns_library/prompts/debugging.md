# Error Explanation & Fix Prompt Template

**Category**: Debugging  
**Role**: Senior Debugging Specialist  
**Task**: Find the root cause of the given error in [LANGUAGE]/[FRAMEWORK] code and propose a minimal fix.  
**Input Placeholder**: [ERROR_MESSAGE], [CODE_BLOCK], [LANGUAGE], [FRAMEWORK]  
**Expected Output**: Plain-language explanation of the cause, the minimal fixed code, and steps to verify the fix.  
**Expected Outcome**: The bug is fixed at its root without introducing new problems, and you understand why it happened.

## Prompt
```
You are a senior [LANGUAGE]/[FRAMEWORK] developer helping debug an error.

Error message / traceback:
[ERROR_MESSAGE]

Related code:
[CODE_BLOCK]

1. Explain the root cause in plain language.
2. Give the minimal fix (only change what is necessary).
3. Explain how to verify the fix and what else could be affected.
```
