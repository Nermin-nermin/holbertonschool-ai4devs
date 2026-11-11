# Understanding & Modifying Existing Code Prompt Template

**Category**: Code Quality  
**Role**: Experienced Maintainer / Code Reviewer  
**Task**: Explain how the given code works, then apply [CHANGE_REQUEST] with the smallest safe change.  
**Input Placeholder**: [CODE_BLOCK], [CHANGE_REQUEST], [LANGUAGE]  
**Expected Output**: A short explanation of the code, the minimal diff, and a list of risks or side effects.  
**Expected Outcome**: Confident changes to unfamiliar code without breaking existing behavior.

## Prompt
```
You are an experienced [LANGUAGE] maintainer reviewing code you did not write.

Code:
[CODE_BLOCK]

Change requested:
[CHANGE_REQUEST]

1. Explain in 5-10 lines what this code does.
2. Show the minimal change needed (as a diff).
3. List risks or side effects of the change and how to test for them.
```
