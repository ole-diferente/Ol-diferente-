const fs = require('fs');
const path = require('path');

const newProducts = [
    {
        id: "9pm-elixir",
        name: "Afnan 9 PM Elixir",
        shortName: "9 PM Elixir",
        category: "Fragancia Dulce",
        categoryClass: "masculinas",
        price: 89000,
        size: "100 ml",
        image: "img/fragancias/9 PM Elixir.jpg",
        description: "Una versión más intensa y rica de la famosa fragancia 9 PM. Con notas dulces, especiadas y frutales, es perfecta para la noche y destacar en cualquier evento.",
        accords: [
            { label: "Dulce", width: "100%", color: "#ff99cc" },
            { label: "Afrutado", width: "90%", color: "#ffb366" },
            { label: "Amaderado", width: "75%", color: "#734d26" }
        ]
    },
    {
        id: "assad-bourbon",
        name: "Lattafa Asad Bourbon",
        shortName: "Asad Bourbon",
        category: "Fragancia Amaderada",
        categoryClass: "masculinas",
        price: 79900,
        size: "100 ml",
        image: "img/fragancias/Assad Bourbon.jpg",
        description: "Una variante cálida y envolvente del exitoso Asad, con toques de vainilla y maderas oscuras. Una fragancia sofisticada para los amantes de los aromas dulces y ahumados.",
        accords: [
            { label: "Cálido", width: "100%", color: "#a64d2e" },
            { label: "Amaderado", width: "85%", color: "#734d26" },
            { label: "Vainilla", width: "75%", color: "#d9b38c" }
        ]
    },
    {
        id: "badee-al-oud-sublime",
        name: "Lattafa Bade'e Al Oud Sublime",
        shortName: "Bade'e Al Oud Sublime",
        category: "Fragancia Frutal",
        categoryClass: "femeninas",
        price: 68000,
        size: "100 ml",
        image: "img/fragancias/Badee al oud Sublime.jpg",
        description: "Una explosión frutal de manzana y lichi sobre una base suave de musgo y vainilla. Sublime es una fragancia alegre, elegante y exquisita para uso diario.",
        accords: [
            { label: "Frutal", width: "100%", color: "#ff6666" },
            { label: "Dulce", width: "85%", color: "#ffb366" },
            { label: "Fresca", width: "70%", color: "#66ccff" }
        ]
    },
    {
        id: "hayaati-gold",
        name: "Lattafa Hayaati Gold Elixir",
        shortName: "Hayaati Gold",
        category: "Fragancia Oriental",
        categoryClass: "masculinas",
        price: 58000,
        size: "100 ml",
        image: "img/fragancias/Hayaati Gold.jpg",
        description: "Hayaati Gold es una fragancia opulenta y dorada, destacando notas cálidas, cítricos chispeantes y un fondo amaderado y dulce.",
        accords: [
            { label: "Dulce", width: "100%", color: "#ffd700" },
            { label: "Afrutado", width: "85%", color: "#ff99cc" },
            { label: "Amaderado", width: "75%", color: "#734d26" }
        ]
    },
    {
        id: "mayar-cherry",
        name: "Lattafa Mayar Cherry",
        shortName: "Mayar Cherry",
        category: "Fragancia Frutal",
        categoryClass: "femeninas",
        price: 63000,
        size: "100 ml",
        image: "img/fragancias/Mayar Cherry.jpg",
        description: "Mayar Cherry es una deliciosa y jugosa interpretación de la cereza, combinada con toques almendrados y florales para una fragancia coqueta y adictiva.",
        accords: [
            { label: "Cereza", width: "100%", color: "#cc0000" },
            { label: "Dulce", width: "90%", color: "#ff6666" },
            { label: "Almendra", width: "80%", color: "#d9b38c" }
        ]
    },
    {
        id: "odyssey-aqua",
        name: "Armaf Odyssey Aqua",
        shortName: "Odyssey Aqua",
        category: "Fragancia Acuática",
        categoryClass: "masculinas",
        price: 67000,
        size: "100 ml",
        image: "img/fragancias/Oddysey Aqua.jpeg",
        description: "Fresca, vigorizante y masculina. Odyssey Aqua te transporta al océano con notas marinas, toques cítricos vibrantes y un fondo amaderado limpio.",
        accords: [
            { label: "Acuático", width: "100%", color: "#3399ff" },
            { label: "Cítrico", width: "85%", color: "#f9ed32" },
            { label: "Fresco", width: "75%", color: "#66ccff" }
        ]
    },
    {
        id: "odyssey-homme-white",
        name: "Armaf Odyssey Homme White Edition",
        shortName: "Odyssey Homme White",
        category: "Fragancia Amaderada",
        categoryClass: "masculinas",
        price: 69000,
        size: "100 ml",
        image: "img/fragancias/Odyssey Homme White edition.jpg",
        description: "Una fragancia seductora, cálida y dulce con matices especiados y avainillados. Perfecta para ocasiones especiales donde buscas dejar una marca inconfundible.",
        accords: [
            { label: "Dulce", width: "100%", color: "#d9b38c" },
            { label: "Amaderado", width: "90%", color: "#734d26" },
            { label: "Cálido", width: "80%", color: "#a64d2e" }
        ]
    },
    {
        id: "the-kingdom",
        name: "Lattafa The Kingdom",
        shortName: "The Kingdom",
        category: "Fragancia Amaderada",
        categoryClass: "masculinas",
        price: 78000,
        size: "100 ml",
        image: "img/fragancias/The kingdom.jpg",
        description: "The Kingdom es una declaración de realeza, con notas de cuero suave, maderas ricas y un fondo especiado que emite lujo y sofisticación en cada gota.",
        accords: [
            { label: "Amaderado", width: "100%", color: "#4d2600" },
            { label: "Cuero", width: "85%", color: "#331a00" },
            { label: "Especiado", width: "75%", color: "#a64d2e" }
        ]
    }
];

function formatPrice(p) {
    return p.toLocaleString('es-AR');
}

// 1. CREATE HTML PAGES FOR NEW PRODUCTS
const templateFile = fs.readFileSync('qaed-al-fursan.html', 'utf-8');

for (const p of newProducts) {
    let newHtml = templateFile;
    // Replace titles
    newHtml = newHtml.replace(/<title>.*?<\/title>/, `<title>${p.shortName} - OLÉ DIFERENTE</title>`);
    newHtml = newHtml.replace(/<img src="img\/fragancias\/QAED AL FURSAN.jpg" alt="Lattafa Qaed Al Fursan" class="product-detail-image">/, `<img src="${p.image}" alt="${p.name}" class="product-detail-image">`);
    newHtml = newHtml.replace(/<h1 class="detail-title">Lattafa Qaed Al Fursan<\/h1>/, `<h1 class="detail-title">${p.name}</h1>`);
    
    // Replace price and description
    newHtml = newHtml.replace(/<span class="detail-price"[^>]*>.*?<\/span>/, `<span class="detail-price" style="font-size: 32px; font-weight: 700; color: var(--text-primary);">$${formatPrice(p.price)}</span>`);
    newHtml = newHtml.replace(/<p class="detail-description">[\s\S]*?<\/p>/, `<p class="detail-description">\n                    ${p.description}\n                </p>`);
    
    // Replace size label
    newHtml = newHtml.replace(/<span class="detail-size-label".*?>\/ 90 ml<\/span>/, `<span class="detail-size-label" style="font-size: 14px; color: var(--text-secondary); margin-left: 10px;">/ ${p.size}</span>`);
    
    // Replace accords
    let accordsHtml = `<h3 class="accords-title">Acordes Principales</h3>\n`;
    for (const acc of p.accords) {
        accordsHtml += `                    <div class="accord-bar-wrapper">\n                        <span class="accord-label">${acc.label}</span>\n                        <div class="accord-bar-bg"><div class="accord-bar-fill" style="width: ${acc.width}; background: ${acc.color};"></div></div>\n                    </div>\n`;
    }
    
    newHtml = newHtml.replace(/<h3 class="accords-title">Acordes Principales<\/h3>[\s\S]*?<div class="purchase-controls"/, accordsHtml + `                <div class="purchase-controls"`);
    
    fs.writeFileSync(`${p.id}.html`, newHtml, 'utf-8');
    console.log(`Created ${p.id}.html`);
}

// 2. UPDATE tienda.html
let tiendaHtml = fs.readFileSync('tienda.html', 'utf-8');

// First, fix Qaed Al Fursan price in tienda.html
tiendaHtml = tiendaHtml.replace(
    /(<div class="product-card reveal" data-category="masculinas" data-price=")0(" data-name="Lattafa Qaed Al Fursan">)/g,
    `$158000$2`
);
tiendaHtml = tiendaHtml.replace(
    /(<a href="qaed-al-fursan.html"[\s\S]*?data-type="full" data-price=")0\.000(")/g,
    `$158.000$2`
);
tiendaHtml = tiendaHtml.replace(
    /(<a href="qaed-al-fursan.html"[\s\S]*?<div class="product-price">)Por definir(<\/div>)/g,
    `$1$58.000$2`
);


// Then, generate new cards
let cardsHtml = "";
for (const p of newProducts) {
    cardsHtml += `
            <!-- Product: ${p.shortName} -->
            <div class="product-card reveal" data-category="${p.categoryClass}" data-price="${p.price}" data-name="${p.name}">
                <a href="${p.id}.html" style="text-decoration: none; color: inherit;">
                    <div class="product-image-container">
                        <img src="${p.image}" alt="${p.name}" class="product-image">
                    </div>
                </a>
                <div class="product-info">
                    <span class="product-category">${p.category}</span>
                    <a href="${p.id}.html" style="text-decoration: none; color: inherit;">
                        <h3 class="product-title">${p.shortName}</h3>
                    </a>
                    <div class="size-selectors">
                        <div class="selector-group main-options">
                            <button class="size-btn active" data-type="full" data-price="${formatPrice(p.price)}">${p.size}</button>
                            <button class="size-btn" data-type="decant">Decant</button>
                        </div>
                        <div class="selector-group decant-options">
                            <button class="size-btn" data-price="0.000">10 ml</button>
                            <button class="size-btn active" data-price="0.000">5 ml</button>
                        </div>
                    </div>
                    <div class="product-price">$${formatPrice(p.price)}</div>
                    <div class="purchase-controls">
                        <input type="number" class="quantity-selector" value="1" min="1" aria-label="Cantidad">
                        <button class="add-to-cart-btn">Agregar al carrito</button>
                    </div>
                </div>
            </div>
`;
}

tiendaHtml = tiendaHtml.replace(/<\/div>\s*<\/div>\s*<!-- Footer -->/, cardsHtml + `\n        </div>\n    </div>\n\n    <!-- Footer -->`);

fs.writeFileSync('tienda.html', tiendaHtml, 'utf-8');
console.log('tienda.html updated successfully.');
