const fs = require('fs');
const path = require('path');

// Define more generic regex patterns for detecting potential secrets
const patterns = [
  {
    name: 'Potential Password, Key, or Token',
    regex: /\b(?:(?:[a-z]*_)?(pass|password|passcode|pwd|secret|token|key|auth|access|random|api|encryption|db)[a-z0-9_]*)(?<!require|import)[\s]*[:=][\s]*["'][^"']{4,}["']/gi,
  },
//   {
//     name: 'Suspicious String (looks like a secret)',
//     regex: /["'][A-Za-z0-9!@#$%^&*()_+={}\[\]:;'<>,.?/\\|-]{8,}["']/g,
//   },
  {
    name: 'Hardcoded Secrets in URLs or JSON',
    regex: /(["']https?:\/\/.*[?&](?:token|key|auth|password|secret)[^"']*["'])|(["']\{.*(?:"(?:token|key|auth|password|secret)":\s*["'][^"']{4,}["']).*})/gi,
  }
];

// Function to scan files for potential secrets
function scanFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    // Skip node_modules, .git directories, and package.json or package-lock.json files
    if (
      filePath.includes('node_modules') ||
      filePath.includes('.git') ||
      file === 'package.json' ||
      file === 'package-lock.json'
    ) {
      continue;
    }

    if (fs.statSync(filePath).isDirectory()) {
      scanFiles(filePath); // Recursively scan directories
    } else {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        patterns.forEach(({ name, regex }) => {
          let match;
          while ((match = regex.exec(line)) !== null) {
            const message = `Potential ${name} found: ${line.trim()}`;
            const annotation = `::warning file=${filePath},line=${index + 1},col=${match.index + 1}::${message}`;
            console.log(annotation);
          }
        });
      });
    }
  }
}

console.log('🔍 Scanning for potential secrets...');
scanFiles('./'); // Start scanning from the root directory
console.log('✅ Scanning completed.');