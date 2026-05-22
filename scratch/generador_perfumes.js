const fs = require('fs');
const path = require('path');

const perfumes = [
    { id: 'philos-pura', name: 'Philos Pura', brand: 'Maison Alhambra', category: 'femeninas', price: '0', image: 'PHILOS PURA.jpg', gender: 'Fragancia Unisex', 
      top: ['Naranja', 'Limón', 'Bergamota'], middle: ['Notas Afrutadas'], base: ['Almizcle Blanco', 'Vainilla', 'Ámbar'], accords: ['Dulce', 'Afrutado', 'Cítrico', 'Almizclado'], seasons: {winter: 50, autumn: 70, spring: 90, summer: 80} },
    { id: 'khamrah-lattafa', name: 'Khamrah', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'KHAMRAH LATAFFA.jpg', gender: 'Fragancia Unisex', 
      top: ['Canela', 'Nuez Moscada', 'Bergamota'], middle: ['Dátiles', 'Praliné', 'Nardos'], base: ['Vainilla', 'Haba Tonka', 'Benjuí', 'Mirra'], accords: ['Dulce', 'Cálido Especiado', 'Vainilla', 'Ámbar'], seasons: {winter: 100, autumn: 90, spring: 30, summer: 10} },
    { id: 'khamrah-qahwa', name: 'Khamrah Qahwa', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Lattafa Khamrah Qahwa.jpg', gender: 'Fragancia Unisex', 
      top: ['Canela', 'Cardamomo', 'Jengibre'], middle: ['Praliné', 'Frutas Confitadas', 'Flores Blancas'], base: ['Café', 'Vainilla', 'Haba Tonka', 'Benjuí'], accords: ['Café', 'Cálido Especiado', 'Dulce', 'Vainilla'], seasons: {winter: 100, autumn: 90, spring: 20, summer: 10} },
    { id: 'fakhar-gold', name: 'Fakhar Gold', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'FAKHAR LATTAFA GOLD.jpg', gender: 'Fragancia Unisex', 
      top: ['Nardos', 'Sal', 'Pino'], middle: ['Notas Solares', 'Cuero', 'Cachemira'], base: ['Ládano', 'Ámbar Gris'], accords: ['Blanco Floral', 'Salado', 'Cuero'], seasons: {winter: 60, autumn: 70, spring: 80, summer: 60} },
    { id: 'mandarin-sky', name: 'Mandarin Sky', brand: 'Armaf', category: 'masculinas', price: '0', image: 'MANDARIN SKY.jpg', gender: 'Fragancia Masculina', 
      top: ['Mandarina', 'Naranja', 'Azafrán'], middle: ['Caramelo', 'Haba Tonka', 'Tagetes'], base: ['Ambroxan', 'Cedro'], accords: ['Dulce', 'Cítrico', 'Caramelo', 'Aromático'], seasons: {winter: 80, autumn: 80, spring: 60, summer: 40} },
    { id: 'yara-lattafa', name: 'Yara', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'YARA LATAFFA.jpg', gender: 'Fragancia Femenina', 
      top: ['Orquídea', 'Heliotropo', 'Naranja'], middle: ['Acuerdo Gourmand', 'Frutas Tropicales'], base: ['Vainilla', 'Almizcle', 'Sándalo'], accords: ['Dulce', 'Avainillado', 'Empolvado', 'Tropical'], seasons: {winter: 60, autumn: 70, spring: 80, summer: 50} },
    { id: 'yara-candy', name: 'Yara Candy', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'YARA CANDY.jpg', gender: 'Fragancia Femenina', 
      top: ['Manzana Verde', 'Grosellas Negras'], middle: ['Caramelo', 'Fresa', 'Fresia'], base: ['Vainilla', 'Almizcle', 'Sándalo'], accords: ['Dulce', 'Afrutado', 'Caramelo'], seasons: {winter: 50, autumn: 70, spring: 80, summer: 60} },
    { id: 'salvo-intense', name: 'Salvo Intense', brand: 'Maison Alhambra', category: 'masculinas', price: '0', image: 'SALVO INTENSE.jpg', gender: 'Fragancia Masculina', 
      top: ['Bergamota', 'Pimienta'], middle: ['Pimienta de Sichuan', 'Lavanda', 'Pimienta Rosa', 'Vetiver', 'Pachulí', 'Geranio'], base: ['Ambroxan', 'Cedro', 'Ládano'], accords: ['Fresco Especiado', 'Ámbar', 'Cítrico'], seasons: {winter: 60, autumn: 80, spring: 90, summer: 80} },
    { id: '9-pm-rebel', name: '9 PM Rebel', brand: 'Afnan', category: 'masculinas', price: '0', image: '9 PM REBEL.jpg', gender: 'Fragancia Masculina', 
      top: ['Piña', 'Manzana Verde', 'Mandarina'], middle: ['Musgo de Roble', 'Cedro', 'Vainilla'], base: ['Caramelo', 'Notas Amaderadas', 'Ámbar Gris', 'Almizcle'], accords: ['Afrutado', 'Dulce', 'Amaderado'], seasons: {winter: 70, autumn: 80, spring: 80, summer: 60} },
    { id: '9-am-dive', name: '9 AM Dive', brand: 'Afnan', category: 'masculinas', price: '0', image: '9 AM DIVE.jpg', gender: 'Fragancia Unisex', 
      top: ['Limón', 'Pimienta Rosa', 'Menta', 'Grosellas Negras'], middle: ['Manzana', 'Incienso', 'Cedro'], base: ['Pachulí', 'Sándalo', 'Jazmín', 'Jengibre'], accords: ['Aromático', 'Cítrico', 'Fresco Especiado'], seasons: {winter: 30, autumn: 50, spring: 90, summer: 100} },
    { id: 'hayaati-black', name: 'Hayaati Black', brand: 'Lattafa', category: 'masculinas', price: '0', image: 'HAYAATI BLACK.jpg', gender: 'Fragancia Masculina', 
      top: ['Manzana', 'Bergamota'], middle: ['Notas Amaderadas', 'Canela'], base: ['Almizcle', 'Vainilla'], accords: ['Afrutado', 'Dulce', 'Acuático'], seasons: {winter: 50, autumn: 70, spring: 90, summer: 80} },
    { id: 'hawas-fire', name: 'Hawas Fire', brand: 'Rasasi', category: 'masculinas', price: '0', image: 'HAWAS FIRE.jpg', gender: 'Fragancia Unisex', 
      top: ['Esclarea'], middle: ['Notas Marinas', 'Jazmín'], base: ['Ámbar', 'Notas Minerales', 'Ámbar Gris'], accords: ['Aromático', 'Acuático', 'Ámbar'], seasons: {winter: 50, autumn: 70, spring: 90, summer: 90} },
    { id: 'fakhar-preto', name: 'Fakhar Black', brand: 'Lattafa', category: 'masculinas', price: '0', image: 'Fakhar Black Lattafa.jpg', gender: 'Fragancia Masculina', 
      top: ['Manzana', 'Bergamota', 'Jengibre'], middle: ['Lavanda', 'Salvia', 'Bayas de Enebro', 'Geranio'], base: ['Haba Tonka', 'Amberwood', 'Cedro', 'Vetiver'], accords: ['Aromático', 'Fresco Especiado', 'Amaderado'], seasons: {winter: 60, autumn: 80, spring: 100, summer: 80} },
    { id: 'haya-pink', name: 'Haya Pink', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Haya Lattafa Perfumes.jpg', gender: 'Fragancia Femenina', 
      top: ['Champán', 'Fresa', 'Rosa', 'Naranja Sanguina'], middle: ['Gardenia', 'Jazmín', 'Orquídea'], base: ['Ámbar', 'Sándalo', 'Castaña'], accords: ['Floral', 'Afrutado', 'Dulce'], seasons: {winter: 40, autumn: 60, spring: 90, summer: 80} },
    { id: 'art-of-universe', name: 'Art of Universe', brand: 'Maison Alhambra', category: 'masculinas', price: '0', image: 'ART OF UNIVERSE.jpg', gender: 'Fragancia Unisex', 
      top: ['Mandarina', 'Jengibre', 'Bergamota', 'Menta'], middle: ['Pera', 'Azahar'], base: ['Almizcle', 'Ámbar', 'Cedro'], accords: ['Cítrico', 'Aromático', 'Afrutado'], seasons: {winter: 40, autumn: 60, spring: 90, summer: 100} },
    { id: 'tropical-vibe', name: 'Tropical Vibe', brand: 'Rayhaan', category: 'femeninas', price: '0', image: 'TROPICAL VIBE RAYHAAN.jpg', gender: 'Fragancia Unisex', 
      top: ['Mango', 'Piña', 'Bergamota'], middle: ['Coco', 'Flores Blancas', 'Notas Marinas'], base: ['Ámbar', 'Sándalo', 'Almizcle', 'Vetiver'], accords: ['Afrutado', 'Tropical', 'Coco'], seasons: {winter: 20, autumn: 40, spring: 80, summer: 100} },
    { id: 'eclaire-pistacho', name: 'Eclaire Pistache', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Eclaire Pistache Lattafa.jpg', gender: 'Fragancia Femenina', 
      top: ['Crema de Pistacho', 'Pistacho Tostado'], middle: ['Coco', 'Cacao', 'Crema Batida'], base: ['Vainilla', 'Leche', 'Almizcle'], accords: ['Dulce', 'Nuez', 'Lactónico', 'Vainilla'], seasons: {winter: 90, autumn: 90, spring: 60, summer: 30} },
    { id: 'opulent-blanco', name: 'Opulent Musk', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Opulent Musk Lattafa.jpg', gender: 'Fragancia Unisex', 
      top: ['Almizcle Blanco', 'Azafrán', 'Limón'], middle: ['Flores Blancas', 'Jazmín'], base: ['Almizcle Blanco', 'Resina de Abeto', 'Cedro', 'Ámbar'], accords: ['Almizclado', 'Blanco Floral', 'Amaderado'], seasons: {winter: 60, autumn: 70, spring: 90, summer: 80} },
    { id: 'fakhar-rosa', name: 'Fakhar Rose', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Fakhar Rose Lattafa.jpg', gender: 'Fragancia Femenina', 
      top: ['Frutas', 'Lirio', 'Granada', 'Aldehídos'], middle: ['Nardos', 'Jazmín', 'Gardenia', 'Ylang-Ylang', 'Rosa', 'Peonía'], base: ['Vainilla', 'Ambroxan', 'Almizcle Blanco', 'Sándalo'], accords: ['Blanco Floral', 'Nardos', 'Afrutado'], seasons: {winter: 60, autumn: 80, spring: 90, summer: 70} }
];

// Helper to generate the HTML for a single product page
function generateProductHTML(perfume) {
    const topHtml = perfume.top.map(n => `<div class="ingredient-item"><div class="ingredient-icon"><img src="" alt="${n}"></div><span class="ingredient-name">${n}</span></div>`).join('');
    const middleHtml = perfume.middle.map(n => `<div class="ingredient-item"><div class="ingredient-icon"><img src="" alt="${n}"></div><span class="ingredient-name">${n}</span></div>`).join('');
    const baseHtml = perfume.base.map(n => `<div class="ingredient-item"><div class="ingredient-icon"><img src="" alt="${n}"></div><span class="ingredient-name">${n}</span></div>`).join('');
    
    const accordsHtml = perfume.accords.map(a => `<span class="accord-badge">${a}</span>`).join('');

    return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${perfume.name} | OLÉ DIFERENTE</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <!-- Lucide Icons via CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="tienda.css">
    <link rel="stylesheet" href="producto.css">
    <link rel="stylesheet" href="cart.css">
</head>
<body class="page-standard page-product">
    <header></header>
    
    <main class="product-main">
        <div class="product-detail-container reveal" data-name="${perfume.name}">
            <!-- Galería de Imágenes -->
            <div class="product-gallery">
                <div class="main-image-container">
                    <img src="img/fragancias/${perfume.image}" alt="${perfume.name}" class="product-detail-image" id="main-image">
                </div>
            </div>

            <!-- Información del Producto -->
            <div class="product-info-detail">
                <div class="brand-badge">${perfume.brand}</div>
                <h1 class="detail-title">${perfume.name}</h1>
                <div class="detail-gender">${perfume.gender}</div>
                <div class="detail-price-container">
                    <span class="detail-price">$${perfume.price}</span>
                    <span class="detail-size">/ 100 ml</span>
                </div>

                <div class="accords-container">
                    ${accordsHtml}
                </div>

                <div class="pyramid-container">
                    <h3 class="pyramid-title">Pirámide Olfativa</h3>
                    
                    <div class="pyramid-level top-notes">
                        <div class="level-label">NOTAS DE SALIDA</div>
                        <div class="ingredients-grid">
                            ${topHtml}
                        </div>
                    </div>

                    <div class="pyramid-level middle-notes">
                        <div class="level-label">CORAZÓN</div>
                        <div class="ingredients-grid">
                            ${middleHtml}
                        </div>
                    </div>

                    <div class="pyramid-level base-notes">
                        <div class="level-label">BASE</div>
                        <div class="ingredients-grid">
                            ${baseHtml}
                        </div>
                    </div>
                </div>

                <div class="purchase-actions">
                    <div class="size-selectors" style="justify-content: flex-start; margin-bottom: 20px;">
                        <div class="selector-group main-options" style="margin:0;">
                            <button class="size-btn active" data-type="full" data-price="${perfume.price}">100 ml</button>
                            <button class="size-btn" data-type="decant">Decant</button>
                        </div>
                        <div class="selector-group decant-options" style="margin-left: 15px;">
                            <button class="size-btn" data-price="0">10 ml</button>
                            <button class="size-btn active" data-price="0">5 ml</button>
                        </div>
                    </div>
                    <div class="add-cart-row">
                        <input type="number" class="quantity-selector" value="1" min="1" aria-label="Cantidad">
                        <button class="add-to-cart-btn">AGREGAR AL CARRITO</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer></footer>
    <!-- Supabase JS Library -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="supabase-config.js"></script>
    
    <script src="components.js?v=2"></script>
    <script src="cart.js?v=2"></script>
    <script src="product_manager.js?v=2"></script>
</body>
</html>`;
}

// 1. Generate the 19 HTML files
const projectDir = path.join(__dirname, '..');
perfumes.forEach(p => {
    fs.writeFileSync(path.join(projectDir, p.id + '.html'), generateProductHTML(p));
});

// 2. Add seasons data to product_manager.js
const pmPath = path.join(projectDir, 'product_manager.js');
let pmContent = fs.readFileSync(pmPath, 'utf-8');

const newSeasonsData = perfumes.map(p => `    "${p.id}.html": { winter: ${p.seasons.winter}, autumn: ${p.seasons.autumn}, spring: ${p.seasons.spring}, summer: ${p.seasons.summer} },`).join('\n');

pmContent = pmContent.replace(/const SEASONS_DATA = {/, `const SEASONS_DATA = {\n${newSeasonsData}`);
fs.writeFileSync(pmPath, pmContent);

// 3. Generate SQL insert commands for Supabase
const sqlStatements = perfumes.map(p => `INSERT INTO inventory (name, stock) VALUES ('${p.name}', 1);`).join('\n');
fs.writeFileSync(path.join(__dirname, 'insert_perfumes.sql'), sqlStatements);

// 4. Print HTML to inject into tienda.html
let htmlMasc = '';
let htmlFem = '';
perfumes.forEach(p => {
    const card = `            <!-- Product: ${p.name} -->
            <div class="product-card reveal" data-category="${p.category}" data-price="${p.price}" data-name="${p.name}">
                <a href="${p.id}.html" style="text-decoration: none; color: inherit;">
                    <div class="product-image-container">
                        <img src="img/fragancias/${p.image}" alt="${p.name}" class="product-image">
                    </div>
                </a>
                <div class="product-info">
                    <span class="product-category">${p.gender}</span>
                    <a href="${p.id}.html" style="text-decoration: none; color: inherit;">
                        <h3 class="product-title">${p.name}</h3>
                    </a>
                    
                    <div class="size-selectors">
                        <div class="selector-group main-options">
                            <button class="size-btn active" data-type="full" data-price="${p.price}">100 ml</button>
                            <button class="size-btn" data-type="decant">Decant</button>
                        </div>
                        <div class="selector-group decant-options">
                            <button class="size-btn" data-price="0">10 ml</button>
                            <button class="size-btn active" data-price="0">5 ml</button>
                        </div>
                    </div>

                    <div class="product-price">A Definir</div>
                    <div class="purchase-controls">
                        <input type="number" class="quantity-selector" value="1" min="1" aria-label="Cantidad">
                        <button class="add-to-cart-btn">Agregar al carrito</button>
                    </div>
                </div>
            </div>\n`;
    if(p.category === 'masculinas') htmlMasc += card;
    else htmlFem += card;
});

fs.writeFileSync(path.join(__dirname, 'tienda_masculinas.html'), htmlMasc);
fs.writeFileSync(path.join(__dirname, 'tienda_femeninas.html'), htmlFem);

console.log("Generación exitosa.");
