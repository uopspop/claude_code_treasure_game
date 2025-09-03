# Check Typo Command

## Description
Comprehensive command for checking English grammar, spelling, typos, and acronym usage in code, documentation, and text files.

## Usage
```
/check_typo [file_pattern] [options]
```

## Examples
```bash
# Check all markdown files
/check_typo "*.md"

# Check specific file
/check_typo "README.md"

# Check all documentation
/check_typo "docs/**/*"

# Check code comments
/check_typo "src/**/*.{ts,tsx,js,jsx}" --comments-only
```

## What This Command Checks

### 1. Spelling & Typos
- Common misspellings (e.g., "recieve" � "receive")
- Programming-specific terms (e.g., "libary" � "library")
- Technical vocabulary validation
- Context-aware suggestions

### 2. Grammar Issues
- Subject-verb agreement
- Tense consistency
- Article usage (a/an/the)
- Preposition errors
- Sentence fragments
- Run-on sentences
- Comma splices

### 3. Acronym Standards
- Proper capitalization (API, HTTP, JSON, CSS, HTML)
- Consistent usage throughout document
- First mention expansion (e.g., "Application Programming Interface (API)")
- Technical acronym validation (npm, CLI, SDK, IDE)

### 4. Programming Context
- Code comment clarity
- Variable/function name conventions
- Documentation consistency
- README file standards
- Commit message format

### 5. Common Technical Writing Issues
- Passive voice overuse
- Wordiness and redundancy
- Unclear technical explanations
- Inconsistent terminology
- Missing code examples

## File Types Supported
- Markdown (*.md)
- Text files (*.txt)
- Code comments in: JS, TS, Python, Go, Rust, Java, C++
- Documentation files
- README files
- Config files with comments

## Output Format
```
=� Grammar & Spelling Check Results

File: README.md


L Line 15: "recieve" � "receive"
   Context: Users can recieve notifications...

�  Line 23: Grammar - Subject-verb agreement
   "The data are processed" � "The data is processed"

=� Line 31: Acronym - Consider expanding first use
   "Use the API" � "Use the Application Programming Interface (API)"

 Line 45: Good technical explanation

Summary:
- 2 spelling errors found
- 1 grammar issue detected
- 1 acronym suggestion
- Overall clarity: Good
```

## Integration with Development Tools
- Pre-commit hooks compatibility
- CI/CD pipeline integration
- VS Code extension support
- Automated PR comment generation

## Configuration Options
```yaml
# .claude/check_typo_config.yml
spelling:
  custom_dictionary:
    - "TypeScript"
    - "JavaScript" 
    - "React"
    - "Next.js"
  
grammar:
  strictness: medium
  allow_passive_voice: false
  
acronyms:
  enforce_expansion: true
  technical_terms:
    - API
    - HTTP
    - JSON
    - CSS
    - HTML
    - CLI
    - SDK
```

## Advanced Features
- Context-aware suggestions for technical writing
- Industry-specific terminology validation
- Integration with popular style guides (Google, Microsoft)
- Multi-language support for comments
- Learning from project-specific terminology