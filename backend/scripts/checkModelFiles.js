// scripts/checkModelFiles.js
const fs = require('fs');
const path = require('path');

console.log('=== Checking Model Files ===\n');

const modelsDir = path.join(__dirname, '..', 'models');
const modelFiles = ['Console.js', 'Tablet.js', 'Watch.js', 'Phone.js'];

console.log('Models directory:', modelsDir);
console.log('Directory exists:', fs.existsSync(modelsDir));

if (fs.existsSync(modelsDir)) {
    console.log('\nFiles in models directory:');
    const files = fs.readdirSync(modelsDir);
    files.forEach(file => {
        console.log(`  - ${file}`);
    });
}

console.log('\n=== Checking specific model files ===');
modelFiles.forEach(file => {
    const filePath = path.join(modelsDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`${file}: ${exists ? '✓ EXISTS' : '✗ NOT FOUND'}`);
    
    if (exists) {
        // Check file content
        const content = fs.readFileSync(filePath, 'utf8');
        const hasExport = content.includes('module.exports') || content.includes('export default');
        const hasSchema = content.includes('Schema');
        console.log(`  - Has export: ${hasExport ? '✓' : '✗'}`);
        console.log(`  - Has Schema: ${hasSchema ? '✓' : '✗'}`);
    }
});