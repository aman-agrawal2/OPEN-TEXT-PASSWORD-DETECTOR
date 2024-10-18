const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define more generic regex patterns for detecting potential secrets
const patterns = [
  {
    name: 'Potential Password, Key, or Token',
    regex: /\b(?:(?:[a-z]*_)?(pass|password|passcode|pwd|secret|token|key|auth|access|random|api|encryption|db)[a-z0-9_]*)(?<!require|import)[\s]*[:=][\s]*["'][^"']{4,}["']/gi,
  },
  {
    name: 'Suspicious String (looks like a secret)',
    regex: /["'][A-Za-z0-9!@#$%^&*()_+={}\[\]:;'<>,.?/\\|-]{8,}["']/g,
  },
  {
    name: 'Hardcoded Secrets in URLs or JSON',
    regex: /(["']https?:\/\/.*[?&](?:token|key|auth|password|secret)[^"']*["'])|(["']\{.*(?:"(?:token|key|auth|password|secret)":\s*["'][^"']{4,}["']).*})/gi,
  }
];

// Function to scan files for potential secrets
function scanFiles(files) {
  const warnings = [];

  files.forEach(filePath => {
    // Skip node_modules, .git directories, and package.json or package-lock.json files
    if (
      filePath.includes('node_modules') ||
      filePath.includes('.git') ||
      filePath === 'package.json' ||
      filePath === 'package-lock.json'
    ) {
      return; // Skip these files
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      patterns.forEach(({ name, regex }) => {
        let match;
        while ((match = regex.exec(line)) !== null) {
          const message = `Potential ${name} found: ${line.trim()}`;
          warnings.push({ filePath, line: index + 1, col: match.index + 1, message });
        }
      });
    });
  });

  return warnings;
}

// Get the list of changed files in the current commit
let changedFiles;
try {
  changedFiles = execSync('git diff --name-only HEAD~1').toString().trim().split('\n');
} catch (error) {
  console.error('Error fetching changed files:', error);
  process.exit(1);
}

console.log('🔍 Scanning for potential secrets in changed files...');
const warnings = scanFiles(changedFiles); // Scan only the changed files

if (warnings.length > 0) {
  // Log a summary instead of individual warnings
  const warningCount = Math.min(warnings.length, 11); // Limit to 11 for display
  console.log(`::warning::Found ${warnings.length} potential secrets (showing first ${warningCount}):`);
  
  warnings.slice(0, 11).forEach(({ filePath, line, col, message }) => {
    const annotation = `::warning file=${filePath},line=${line},col=${col}::${message}`;
    console.log(annotation);
  });

  // Optionally log remaining warnings to a file or console
  if (warnings.length > 11) {
    console.log(`...and ${warnings.length - 11} more.`);
  }
} else {
  console.log('✅ No potential secrets found in changed files.');
}
console.log('✅ Scanning completed.');