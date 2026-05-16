const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/pages');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('/favicon.svg')) {
    content = content.replace(/\/favicon\.svg/g, '/logo.png');
    // Also inject onError fallback just in case logo.png doesn't exist
    content = content.replace(/<img /g, `<img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} `);
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});
