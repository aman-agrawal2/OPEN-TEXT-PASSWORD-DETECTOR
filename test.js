// This is a sample JavaScript file with exposed secrets for testing purposes

// Basic password assignments
const password = "supersecret123";
let user_password = "mypassword";
var pass = "password123!";
let pwd = "securePassword";

// API keys in various forms
const apiKey = "123456abcdef7890";
let my_api_key = "xyz-1234-abc-5678";
var api_secret = "shhh-its-a-secret";
let secret_token = "token_ABC123XYZ";

// Random password-like assignments
const random_password_1 = "randomPass!@34";
var db_pass = "dbpassword1234";
let ftp_password = "ftpPass_5678";

// Hardcoded credentials in a URL (common mistake)
const connectionString = "mongodb://user:pass1234@localhost:27017/mydb";
const secretUrl = "https://api.example.com?token=superSecretToken123";

// Password-like strings in functions
function login() {
  const admin_password = "admin12345";
  return admin_password;
}

const getSecret = () => "anotherSecretKey_999";

// Variables with less obvious names
let encryptionKey = "ENC1234567890";
var auth_code = "authCodeSecret";
let security_token = "sec_token_9876";

// Passwords in arrays or objects
const config = {
  databasePassword: "dbpass123!",
  ftp: {
    username: "ftpUser",
    password: "ftpPassword123"
  },
  apiKeys: [
    "api_key_1",
    "key1234567890"
  ]
};

// Plain text tokens embedded in JSON-like strings
const jsonData = '{"token": "abcde-12345-fghij-67890"}';
let jsonString = '{"password": "jsonPass567"}';

// Mix of secrets in comments
// TODO: Replace the following before production
// const secret = "commentedSecret123";
// user_pass = "passwordInComment";

// Misleading variable name but still a secret
let my_random_secret = "dontUseThis123";

// Regular expressions should catch this one too!
var passcode = "1234abcd!";
let authPassword = "authPassword678";

console.log("This is just a test file, do not use any of the above credentials!");