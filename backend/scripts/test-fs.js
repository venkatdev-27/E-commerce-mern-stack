const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../uploads/products');
console.log('Target Directory:', targetDir);

try {
  if (fs.existsSync(targetDir)) {
    const stats = fs.lstatSync(targetDir);
    if (!stats.isDirectory()) {
        console.log("⚠️ CRITICIAL ISSUE: 'products' is a FILE, not a directory!");
        console.log("Deleting the file...");
        fs.unlinkSync(targetDir);
        console.log("File deleted.");
    } else {
        console.log('Directory exists and IS a directory.');
    }
  }

  if (!fs.existsSync(targetDir)) {
    console.log('Creating directory...');
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('Directory created.');
  }

  const testFile = path.join(targetDir, 'test-write.txt');
  fs.writeFileSync(testFile, 'Hello World');
  console.log('Successfully wrote to file:', testFile);
  
  // Cleanup
  fs.unlinkSync(testFile);
  console.log('Successfully deleted test file.');

} catch (err) {
  console.error('FS Error:', err);
}
