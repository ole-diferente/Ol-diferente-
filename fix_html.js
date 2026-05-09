const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Gonza\\Desktop\\WEB perfume';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // 1. Remove style.css
    content = content.replace(/<link rel="stylesheet" href="style\.css">\r?\n?/g, '');

    // 2. Add meta referrer if not present
    if (!content.includes('<meta name="referrer"')) {
        content = content.replace('</title>', '</title>\n    <meta name="referrer" content="no-referrer">');
    }

    // 3. For product pages, add product_manager.js
    if (file !== 'tienda.html' && !content.includes('product_manager.js')) {
        content = content.replace('<script src="cart.js"></script>', '<script src="product_manager.js"></script>\n    <script src="cart.js"></script>');
    }

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log('Fixed', file);
});
