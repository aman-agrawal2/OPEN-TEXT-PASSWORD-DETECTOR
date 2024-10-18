const fs = require('fs');
const path = require('path');

// Common regex patterns to detect secrets
const patterns = [
  {
    name: 'AWS Access Key',
    regex: /AKIA[0-9A-Z]{16}/,
  },
  {
    name: 'AWS Secret Key',
    regex: /(?<![A-Za-z0-9])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/,
  },
  {
    name: 'API Key',
    regex: /(?:api[_-]?key|key|secret|token)[\s]*[:=][\s]*["']?[a-zA-Z0-9-_]{16,}["']?/i,
  },
  {
    name: 'Password',
    regex: /(?:password|passwd|pwd)[\s]*[:=][\s]*["']?[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;'<>,.?/\\|-]{8,}["']?/i,
  }
];

// Function to scan files for secrets
function scanFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      scanFiles(filePath); // Recursively scan directories
    } else {
      const content = fs.readFileSync(filePath, 'utf-8');
      patterns.forEach(({ name, regex }) => {
        if (regex.test(content)) {
          console.log(`🚨 Possible ${name} found in ${filePath}`);
          process.exit(1); // Exit with failure if a secret is found
        }
      });
    }
  }
}

console.log('🔍 Scanning for secrets...');
scanFiles('./'); // Start scanning from the root directory
console.log('✅ No secrets found.');