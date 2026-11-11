# Data Matching & Cleaning Prompt Template

**Category**: Data & Databases  
**Role**: Data Engineer  
**Task**: Design and implement a way to match or deduplicate records from two sources using [CRITERIA].  
**Input Placeholder**: [SAMPLE_A], [SAMPLE_B], [CRITERIA], [LANGUAGE]  
**Expected Output**: Description of the matching approach (exact, normalized, fuzzy), implementation code, and examples of tricky edge cases.  
**Expected Outcome**: Clean, linked data with known match rules and handled edge cases.

## Prompt
```
You are a data engineer working in [LANGUAGE].

Sample records from source A:
[SAMPLE_A]

Sample records from source B:
[SAMPLE_B]

Matching criteria:
[CRITERIA]

1. Propose a matching approach (normalization steps, exact vs. fuzzy matching).
2. Write the implementation code.
3. List edge cases (typos, missing values, duplicates) and how the code handles them.
```
