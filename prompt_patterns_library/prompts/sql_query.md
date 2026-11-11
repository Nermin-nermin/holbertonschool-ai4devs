# Read-Only SQL Query Prompt Template

**Category**: Data & Databases  
**Role**: Database Analyst  
**Task**: Write a read-only [DIALECT] query that answers [QUESTION] using the given schema.  
**Input Placeholder**: [SCHEMA], [QUESTION], [DIALECT]  
**Expected Output**: A single SELECT-only query in a code block, an explanation of each clause, and performance notes (indexes, row counts).  
**Expected Outcome**: Correct answers to business questions with zero risk of modifying data.

## Prompt
```
You are a database analyst writing [DIALECT] SQL.
Only use SELECT statements. Never use INSERT, UPDATE, DELETE, DROP or ALTER.

Table schemas:
[SCHEMA]

Question:
[QUESTION]

Return:
1. The query in a code block
2. An explanation of each clause
3. Performance notes (useful indexes, potential slow parts)
```
