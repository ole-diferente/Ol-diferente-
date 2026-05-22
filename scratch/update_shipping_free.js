const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'cart.js');
let text = fs.readFileSync(p, 'utf-8');

text = text.replace(/calculateShippingCost\(cpStr\) \{/, 'calculateShippingCost(cpStr, subtotal = 0) {');

text = text.replace(/const cp = parseInt\(cpStr\.replace\(\/\\D\/g, ''\), 10\);\s*if \(isNaN\(cp\)\) return 0;/, 
    `const cp = parseInt(cpStr.replace(/\\D/g, ''), 10);
        if (isNaN(cp)) return 0;
        
        if (subtotal >= 150000) return 0;`
);

text = text.replace(/shipping = this\.calculateShippingCost\(cp\);/, 'shipping = this.calculateShippingCost(cp, subtotal);');
text = text.replace(/shippingCost = this\.calculateShippingCost\(cp\);/, 'shippingCost = this.calculateShippingCost(cp, subtotal);');

const updateTotalsRegex = /const quoteText = document\.querySelector\('\.shipping-quote-text'\);\s*if \(shipping > 0\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
const newUpdateTotals = `const quoteText = document.querySelector('.shipping-quote-text');
            if (subtotal >= 150000) {
                quoteText.innerText = "¡Ya tienes envío gratis!";
                quoteText.style.color = "#27ae60";
            } else if (shipping > 0) {
                quoteText.innerText = "Costo de envío: $" + this.formatPrice(shipping) + "\\n(Te faltan $" + this.formatPrice(150000 - subtotal) + " para envío gratis)";
                quoteText.style.color = "var(--text-secondary)";
            } else {
                quoteText.innerText = "";
            }`;

text = text.replace(updateTotalsRegex, newUpdateTotals);

// Fix the WhatsApp message to show Free Shipping if cost is 0 and method is envio
text = text.replace(/message \+= \`Costo de Envío: \$\$\{this\.formatPrice\(shippingCost\)\}\\n\\n\`;/, 
    `if (shippingCost === 0 && subtotal >= 150000) {
                message += "Costo de Envío: *¡GRATIS!*\\n\\n";
            } else {
                message += \`Costo de Envío: $\${this.formatPrice(shippingCost)}\\n\\n\`;
            }`
);

fs.writeFileSync(p, text);
console.log("Updated cart shipping logic");
