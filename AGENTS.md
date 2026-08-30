<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Oxford 5000 / Muller Dataset Rules & Immutability Invariants

1. **Triple-File Synchronous Parity:**
   Any changes to dictionary data MUST be applied synchronously to all 3 dataset files:
   - `oxford_5000_2026-08-27.json`
   - `oxford_5000.json`
   - `src/data/oxford_5000.json`

2. **Immutable Exceptions Registry:**
   The manually perfected core words (`a`, `all`, `that`, `of`, `to`, `for`, `by`, `with`, `do`, `have`, `be`, `as`, `but`, `if`, `there`, `miss`) and the 149 participle adjectives (`amazing`, `bored`, `annoyed`, `married`, etc.) are protected standards.
   AUTOMATED PARSERS AND SCRIPTS MUST NEVER OVERWRITE OR REVERT THESE WORDS TO RAW OCR/PDF DUMPS.

3. **Validation Mandate:**
   `final_qa_validation.py` must always pass with 0 errors after any modifications.

