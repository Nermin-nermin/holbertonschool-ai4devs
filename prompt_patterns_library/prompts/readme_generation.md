# README Generation Prompt Template

**Category**: Documentation & Testing  
**Role**: Technical Writer  
**Task**: Write a README that lets a new developer set up and run the project quickly.  
**Input Placeholder**: [PROJECT_TREE], [ENTRY_FILE], [DEPENDENCIES]  
**Expected Output**: Markdown README with sections: Overview, Requirements, Installation, Usage (with examples), Configuration, Project Structure.  
**Expected Outcome**: A newcomer can clone, install, and run the project without asking anyone for help.

## Prompt
```
You are a technical writer documenting a software project.

Project structure:
[PROJECT_TREE]

Main entry point:
[ENTRY_FILE]

Dependencies:
[DEPENDENCIES]

Write a README.md with these sections:
Overview, Requirements, Installation, Usage (with command examples),
Configuration, Project Structure.
Keep it concise and use code blocks for all commands.
```
