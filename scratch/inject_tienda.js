const fs = require('fs');
const path = require('path');

const tiendaPath = path.join(__dirname, '..', 'tienda.html');
let tiendaHtml = fs.readFileSync(tiendaPath, 'utf-8');

const masc = fs.readFileSync(path.join(__dirname, 'tienda_masculinas.html'), 'utf-8');
const fem = fs.readFileSync(path.join(__dirname, 'tienda_femeninas.html'), 'utf-8');

tiendaHtml = tiendaHtml.replace(/<\/div>\s*<\/div>\s*<!-- Footer -->/, `${masc}\n${fem}\n        </div>\n    </div>\n\n    <!-- Footer -->`);
fs.writeFileSync(tiendaPath, tiendaHtml);
console.log("Injected into tienda.html successfully.");
