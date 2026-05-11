const { transformSync } = require('esbuild');
const fs = require('fs');
const text = fs.readFileSync('src/pages/NepaliPatro.jsx', 'utf8');
const lines = text.split(/\r?\n/);
for (let i = 1; i <= lines.length; i++) {
  const prefix = lines.slice(0, i).join('\n');
  try {
    transformSync(prefix, { loader: 'jsx' });
  } catch (e) {
    console.log('error at line', i);
    console.log(e.message);
    process.exit(0);
  }
}
console.log('no error');
