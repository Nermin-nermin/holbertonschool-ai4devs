# Requirements Breakdown Prompt Template

**Category**: Planning & Design  
**Role**: Senior Business Analyst / Tech Lead  
**Task**: Break the given task description into clear, testable requirements, respecting the stated constraints.  
**Input Placeholder**: [TASK_TEXT], [CONSTRAINTS]  
**Expected Output**: Numbered list of functional and non-functional requirements, acceptance criteria for each, and a list of open questions.  
**Expected Outcome**: A vague assignment becomes a checklist you can implement and verify item by item.

## Prompt
```
You are a senior tech lead. Break the following task into clear, testable requirements.

Task:
[TASK_TEXT]

Constraints:
[CONSTRAINTS]

Return:
1. Functional requirements (numbered)
2. Non-functional requirements (numbered)
3. Acceptance criteria for each requirement
4. Open questions or ambiguities to clarify before starting
```
