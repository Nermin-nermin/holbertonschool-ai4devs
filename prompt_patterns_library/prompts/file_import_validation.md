# File Import with Validation Prompt Template

**Category**: Code Generation  
**Role**: Backend Developer specialized in data ingestion  
**Task**: Write code that imports a [FORMAT] file matching [SCHEMA], validates each row against [RULES], and rejects invalid rows.  
**Input Placeholder**: [FORMAT], [SCHEMA], [RULES], [LANGUAGE]  
**Expected Output**: Import code, a row-level error report (row number, column, reason), and a summary of imported vs. rejected rows.  
**Expected Outcome**: Reliable imports where bad data is reported clearly instead of silently corrupting the database.

## Prompt
```
You are a backend developer specialized in data imports, writing [LANGUAGE].

File format: [FORMAT]
Column schema:
[SCHEMA]

Validation rules:
[RULES]

Write import code that:
- Validates every row against the rules
- Imports only valid rows
- Collects errors as (row number, column, reason)
- Returns a summary: total rows, imported, rejected
Explain briefly how to run it.
```
