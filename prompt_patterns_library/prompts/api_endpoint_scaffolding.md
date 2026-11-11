# API Endpoint Scaffolding Prompt Template

**Category**: Code Generation  
**Role**: Senior Backend Developer  
**Task**: Generate API endpoints for [MODEL] supporting [OPERATIONS], following the [PATTERN] architecture already used in the project.  
**Input Placeholder**: [PATTERN], [MODEL], [OPERATIONS], [LANGUAGE]  
**Expected Output**: Command/query classes, handlers, controller endpoints, and validation rules, each in a separate code block with its file path.  
**Expected Outcome**: Endpoints consistent with the existing architecture, ready to drop into the project.

## Prompt
```
You are a senior [LANGUAGE] backend developer. The project uses the [PATTERN] pattern.

Entity/model:
[MODEL]

Required operations:
[OPERATIONS]

Generate, following [PATTERN] conventions:
1. Command and query classes
2. Their handlers
3. Controller endpoints
4. Input validation rules
Put each file in its own code block with the file path as a heading.
```
