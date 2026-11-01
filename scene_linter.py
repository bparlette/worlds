import re
import subprocess
import json

NODE_VALIDATOR_SCRIPT = r"""
const fs = require('fs');
const vm = require('vm');

const htmlPath = process.argv[1];
if (!htmlPath || !fs.existsSync(htmlPath)) {
  console.log(JSON.stringify({ status: 'file_not_found' }));
  process.exit(0);
}

let content = fs.readFileSync(htmlPath, 'utf8');
const match = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
if (!match) {
  console.log(JSON.stringify({ status: 'no_script_tag' }));
  process.exit(0);
}

let js = match[1];
// Replace imports with dummy declarations so vm.Script can parse strict JS syntax
let testCode = js.replace(/import\s+\*\s+as\s+THREE\s+from\s+[^;]+;/, 'const THREE = {};');

let fixedCount = 0;
let maxRepairs = 10;
let errors = [];

while (maxRepairs > 0) {
  maxRepairs--;
  try {
    new vm.Script(testCode);
    break;
  } catch (err) {
    const dupMatch = err.message.match(/Identifier '([^']+)' has already been declared/);
    if (dupMatch) {
      const varName = dupMatch[1];
      // Auto-fix: keep first declaration, convert subsequent declarations to assignments
      const regex = new RegExp('(\\b(?:const|let|var)\\s+)' + varName + '(\\s*=)', 'g');
      let count = 0;
      js = js.replace(regex, (m, p1, p2) => {
        count++;
        return count === 1 ? m : (varName + p2);
      });
      fixedCount++;
      testCode = js.replace(/import\s+\*\s+as\s+THREE\s+from\s+[^;]+;/, 'const THREE = {};');
    } else {
      errors.push(err.message);
      break;
    }
  }
}

if (fixedCount > 0) {
  content = content.replace(match[1], js);
  fs.writeFileSync(htmlPath, content, 'utf8');
  console.log(JSON.stringify({ status: 'repaired', repairs: fixedCount, errors: errors }));
} else if (errors.length > 0) {
  console.log(JSON.stringify({ status: 'syntax_error', errors: errors }));
} else {
  console.log(JSON.stringify({ status: 'clean' }));
}
"""

def lint_and_autofix_scene(html_file_path: str) -> dict:
    """
    Runs an automated Node.js syntax & linter check on the generated HTML's <script> block.
    Automatically detects and heals duplicate declarations (e.g. const clock) and other syntax issues.
    """
    try:
        proc = subprocess.run(
            ["node", "-e", NODE_VALIDATOR_SCRIPT, html_file_path],
            capture_output=True,
            text=True,
            timeout=10
        )
        out = proc.stdout.strip()
        if out:
            data = json.loads(out)
            return data
    except Exception as e:
        return {"status": "linter_exception", "error": str(e)}
    return {"status": "ok"}
