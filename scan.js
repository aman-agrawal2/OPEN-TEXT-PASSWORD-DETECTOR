const fs = require('fs');
const path = require('path');

// Define more generic regex patterns for detecting potential secrets
const patterns = [
  {
    name: 'Potential Password, Key, or Token',
    regex: /\b(?:(?:[a-z]*_)?(pass|password|passcode|pwd|secret|token|key|auth|access|random)[a-z0-9_]*)(?<!require|import)[\s]*[:=][\s]*["'][^"']{4,}["']/gi,
  }
];

// Function to scan files for potential secrets
function scanFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      scanFiles(filePath); // Recursively scan directories
    } else {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        patterns.forEach(({ name, regex }) => {
          let match;
          while ((match = regex.exec(line)) !== null) {
            console.log(`🚨 Potential ${name} found in ${filePath}:${index + 1}:`);
            console.log(line.replace(match[0], `[31m${match[0]}[0m`)); // Highlight the matched secret
          }
        });
      });
    }
  }
}

console.log('🔍 Scanning for potential secrets...');
scanFiles('./'); // Start scanning from the root directory
console.log('✅ Scanning completed.');