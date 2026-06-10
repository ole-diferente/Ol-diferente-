const fs = require('fs');
const path = require('path');

const priceUpdates = [
  {
    name: "Lattafa Teriaq",
    priceNum: 72000,
    priceStr: "72.000",
    file: "lattafa-teriaq.html"
  },
  {
    name: "Mandarin Sky",
    priceNum: 73000,
    priceStr: "73.000",
    file: "mandarin-sky.html"
  },
  {
    name: "Salvo Intense",
    priceNum: 64500,
    priceStr: "64.500",
    file: "salvo-intense.html"
  },
  {
    name: "Art of Universe",
    priceNum: 84300,
    priceStr: "84.300",
    file: "art-of-universe.html"
  },
  {
    name: "Philos Pura",
    priceNum: 67400,
    priceStr: "67.400",
    file: "philos-pura.html"
  },
  {
    name: "Lattafa Khamrah Dukhan",
    priceNum: 68000,
    priceStr: "68.000",
    file: "khamrah-dukhan.html"
  },
  {
    name: "Khamrah",
    priceNum: 68000,
    priceStr: "68.000",
    file: "khamrah-lattafa.html"
  },
  {
    name: "Khamrah Qahwa",
    priceNum: 68000,
    priceStr: "68.000",
    file: "khamrah-qahwa.html"
  },
  {
    name: "Fakhar Black",
    priceNum: 74000,
    priceStr: "74.000",
    file: "fakhar-preto.html"
  },
  {
    name: "Hawas Fire",
    priceNum: 94800,
    priceStr: "94.800",
    file: "hawas-fire.html"
  },
  {
    name: "9 AM Dive",
    priceNum: 77500,
    priceStr: "77.500",
    file: "9-am-dive.html"
  },
  {
    name: "Lattafa Atlas",
    priceNum: 77500,
    priceStr: "77.500",
    file: "lattafa-atlas.html"
  },
  {
    name: "Yara",
    priceNum: 65900,
    priceStr: "65.900",
    file: "yara-lattafa.html"
  },
  {
    name: "Yara Candy",
    priceNum: 65900,
    priceStr: "65.900",
    file: "yara-candy.html"
  },
  {
    name: "Haya Pink",
    priceNum: 71700,
    priceStr: "71.700",
    file: "haya-pink.html"
  },
  {
    name: "Eclaire Pistache",
    priceNum: 72000,
    priceStr: "72.000",
    file: "eclaire-pistacho.html"
  },
  {
    name: "Tropical Vibe",
    priceNum: 82000,
    priceStr: "82.000",
    file: "tropical-vibe.html"
  },
  {
    name: "Fakhar Gold",
    priceNum: 73200,
    priceStr: "73.200",
    file: "fakhar-gold.html"
  },
  {
    name: "9 PM Rebel",
    priceNum: 91500,
    priceStr: "91.500",
    file: "9-pm-rebel.html"
  }
];

// 1. Update tienda.html
const tiendaPath = path.join(__dirname, '..', 'tienda.html');
let tiendaContent = fs.readFileSync(tiendaPath, 'utf8');

priceUpdates.forEach(update => {
    const escapedName = update.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const cardRegex = new RegExp(`(<div class="product-card[^"]*"[^>]*data-name="${escapedName}"[\\s\\S]*?<div class="product-price">)([^<]*)(</div>[\\s\\S]*?</div>\\s*</div>)`, 'i');
    
    if (tiendaContent.match(cardRegex)) {
        console.log(`Encontrado ${update.name} en tienda.html`);
        tiendaContent = tiendaContent.replace(cardRegex, (match, prefix, oldPrice, suffix) => {
            let newPrefix = prefix.replace(/data-price="[^"]*"/, `data-price="${update.priceNum}"`);
            newPrefix = newPrefix.replace(/(data-type="full"[^>]*data-price=")[^"]*"/, `$1${update.priceStr}"`);
            newPrefix = newPrefix.replace(/(data-price="[^"]*"[^>]*data-type="full")/, `data-price="${update.priceStr}" data-type="full"`);
            const newPrice = `$${update.priceStr}`;
            return `${newPrefix}${newPrice}${suffix}`;
        });
    } else {
        console.warn(`No se pudo encontrar la tarjeta para ${update.name} en tienda.html`);
    }
    
    // 2. Update individual HTML files in productos/
    const filePath = path.join(__dirname, '..', 'productos', update.file);
    if (fs.existsSync(filePath)) {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        const priceRegex = /(<span class="detail-price"[^>]*>)([^<]*)(<\/span>)/i;
        if (fileContent.match(priceRegex)) {
            fileContent = fileContent.replace(priceRegex, `$1$${update.priceStr}$3`);
            fs.writeFileSync(filePath, fileContent, 'utf8');
            console.log(`Actualizado precio en ${update.file} a $${update.priceStr}`);
        } else {
            console.warn(`No se encontró span de precio en ${update.file}`);
        }
    } else {
        console.warn(`El archivo ${update.file} no existe en la carpeta productos/`);
    }
});

fs.writeFileSync(tiendaPath, tiendaContent, 'utf8');
console.log('Actualización de precios completada en tienda.html.');
