# Refactoring Prompt Template

**Category**: Code Quality  
**Role**: Senior Developer  
**Task**: Refactor the given [LANGUAGE] prototype code into maintainable, production-ready code for [ENVIRONMENT], improving clarity and performance.  
**Input Placeholder**: [CODE_BLOCK], [LANGUAGE], [ENVIRONMENT]  
**Expected Output**: Clean, optimized code split into modules, with config/secrets separated, logging added, inline comments, and a list explaining each change.  
**Expected Outcome**: A working prototype becomes code that is easy to maintain, deploy, and review, with unchanged behavior.

## Prompt
```
You are a senior [LANGUAGE] developer. Refactor this prototype for production on [ENVIRONMENT].
Keep the behavior identical.

[CODE_BLOCK]

Requirements:
- Split into clear modules/functions
- Move configuration and secrets to environment variables or a config file
- Replace prints with proper logging
- Add inline comments where logic is not obvious
After the code, list each change and why it was made.
```
