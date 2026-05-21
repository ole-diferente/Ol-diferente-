const fs = require('fs');
const path = require('path');

const prices = {
    "club-de-nuit.html": 78000,
    "club-de-nuit-women.html": 78000,
    "salvo-elixir.html": 63000,
    "liquid-brun.html": 98000,
    "dark-door-sport.html": 59000,
    "hawas-for-him.html": 67000,
    "badee-al-oud-for-glory.html": 68000,
    "honor-and-glory.html": 68000,
    "khamrah-dukhan.html": 68000,
    "eclaire.html": 72000,
    "lattafa-his-confession.html": 74000,
    "oud-forever.html": 79000,
    "sceptre-malachite.html": 69900,
    "afnan-9pm.html": 78000,
    "turathi-blue.html": 84000,
    "vintage-radio.html": 69000,
    "shaheen-gold.html": 72000,
    "aqua-kiss.html": 49000,
    "bare-vanilla.html": 49000,
    "coconut-passion.html": 49000,
    "pure-seduction.html": 49000,
    "vs-rush.html": 49000
};

function formatPrice(p) {
    return p.toLocaleString('es-AR');
}

function updateTienda() {
    const filePath = 'tienda.html';
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Using regex to carefully replace
    const cards = content.split(/(<div class="product-card[^>]*>)/g);
    let newContent = "";
    
    for (let i = 0; i < cards.length; i++) {
        let chunk = cards[i];
        if (chunk.startsWith('<div class="product-card')) {
            let cardStart = chunk;
            let cardBody = cards[i + 1] || "";
            
            const match = cardBody.match(/href="(.*?\.html)"/);
            if (match) {
                const filename = match[1];
                if (prices[filename]) {
                    const newPrice = prices[filename];
                    const formatted = formatPrice(newPrice);
                    
                    cardStart = cardStart.replace(/data-price="\d+"/, `data-price="${newPrice}"`);
                    
                    // Update full size button
                    // Matches data-type="full" data-price="anything"
                    cardBody = cardBody.replace(/(data-type="full" data-price=")[^"]+(".*?disabled>.*?ml<\/button>)/s, `$1${formatted}$2`);
                    cardBody = cardBody.replace(/(data-type="full" data-price=")[^"]+(">[^<]*?ml<\/button>)/s, `$1${formatted}$2`);
                    cardBody = cardBody.replace(/(data-type="full"\s+disabled\s+data-price=")[^"]+(")/, `$1${formatted}$2`);
                    
                    // Also if we have other forms
                    cardBody = cardBody.replace(/<div class="product-price">.*?<\/div>/, `<div class="product-price">$${formatted}</div>`);
                }
            }
            newContent += cardStart + cardBody;
            i++; // skip cardBody in loop
        } else {
            newContent += chunk;
        }
    }
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log("tienda.html updated");
}

function updateProductPages() {
    for (const [filename, newPrice] of Object.entries(prices)) {
        if (fs.existsSync(filename)) {
            let content = fs.readFileSync(filename, 'utf-8');
            const formatted = formatPrice(newPrice);
            
            content = content.replace(/(<span class="detail-price"[^>]*>)\$?[0-9\.]+(<\/span>)/g, `$1$${formatted}$2`);
            content = content.replace(/(<span class="detail-price"[^>]*>)Por definir(<\/span>)/g, `$1$${formatted}$2`);
            
            fs.writeFileSync(filename, content, 'utf-8');
            console.log(`${filename} updated`);
        }
    }
}

updateTienda();
updateProductPages();
