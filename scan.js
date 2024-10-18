const fs = require('fs');
const path = require('path');

// Define regex patterns to detect potential secrets
const patterns = [
  {
    name: 'AWS Access Key',
    regex: /AKIA[0-9A-Z]{16}/g,
  },
  {
    name: 'AWS Secret Key',
    regex: /(?<![A-Za-z0-9])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g,
  },
  {
    name: 'API Key',
    regex: /(?:api[_-]?key|key|secret|token)[\s]*[:=][\s]*["']?[a-zA-Z0-9-_]{16,}["']?/gi,
  },
  {
    name: 'Password',
    regex: /(?:password|passwd|pwd)[\s]*[:=][\s]*["']?[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;'<>,.?/\\|-]{8,}["']?/gi,
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