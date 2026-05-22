const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let count = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if it has producto.css without version or older version
    if (content.includes('href="producto.css"') || content.match(/href="producto\.css\?v=\d+"/)) {
        content = content.replace(/href="producto\.css(\?v=\d+)?"/g, 'href="producto.css?v=5"');
        content = content.replace(/href="tienda\.css(\?v=\d+)?"/g, 'href="tienda.css?v=5"');
        content = content.replace(/href="cart\.css(\?v=\d+)?"/g, 'href="cart.css?v=5"');
        content = content.replace(/src="components\.js(\?v=\d+)?"/g, 'src="components.js?v=5"');
        fs.writeFileSync(filePath, content);
        count++;
    }
}

console.log(`Updated CSS/JS version tags in ${count} HTML files.`);
