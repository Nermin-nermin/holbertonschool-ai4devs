# Feature Implementation Plan Prompt Template

**Category**: Planning & Design  
**Role**: Senior Software Engineer  
**Task**: Plan the implementation of [FEATURE] in a [LANGUAGE]/[FRAMEWORK] project step by step, before writing any code.  
**Input Placeholder**: [FEATURE], [LANGUAGE], [FRAMEWORK], [PROJECT_TREE]  
**Expected Output**: Ordered list of small steps, each with the files to create or modify and a verification check.  
**Expected Outcome**: A safe, incremental plan where each step can be built and verified on its own.

## Prompt
```
You are a senior [LANGUAGE] engineer using [FRAMEWORK]. Do not write code yet.

Feature to implement:
[FEATURE]

Current project structure:
[PROJECT_TREE]

Produce an ordered implementation plan. For each step give:
- What to do (one small change)
- Files to create or modify
- How to verify the step works before moving on
End with any risks or decisions I need to make.
```
