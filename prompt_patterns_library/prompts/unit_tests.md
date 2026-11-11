# Unit Test Generation Prompt Template

**Category**: Documentation & Testing  
**Role**: QA Engineer / Test Automation Specialist  
**Task**: Write unit tests for the given [LANGUAGE] function using [TEST_FRAMEWORK].  
**Input Placeholder**: [CODE_BLOCK], [LANGUAGE], [TEST_FRAMEWORK]  
**Expected Output**: A complete test file covering normal cases, edge cases, and error cases, plus a list of scenarios not covered.  
**Expected Outcome**: Reliable test coverage that catches regressions when the function changes.

## Prompt
```
You are a QA engineer writing [LANGUAGE] tests with [TEST_FRAMEWORK].

Function to test:
[CODE_BLOCK]

Write a complete test file with:
- Normal cases
- Edge cases (empty, boundary, large values)
- Error cases (invalid input, expected exceptions)
Use descriptive test names. After the file, list any scenarios that are not covered.
```
