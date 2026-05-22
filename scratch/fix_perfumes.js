const fs = require('fs');
const path = require('path');

const perfumes = [
    { id: 'philos-pura', name: 'Philos Pura', brand: 'Maison Alhambra', category: 'femeninas', price: '0', image: 'PHILOS PURA.jpg', gender: 'Fragancia Unisex', 
      top: ['Naranja Siciliana', 'Limón', 'Bergamota'], middle: ['Notas Afrutadas'], base: ['Almizcle Blanco', 'Vainilla', 'Ámbar'], accords: ['Dulce', 'Afrutado', 'Cítrico', 'Almizclado'], seasons: {winter: 50, autumn: 70, spring: 90, summer: 80},
      desc: 'Una exquisita combinación cítrica y afrutada que evoca la frescura de la brisa mediterránea, asentada sobre un fondo cálido de ámbar y vainilla. Ideal para dejar una estela vibrante y duradera.' },
    { id: 'khamrah-lattafa', name: 'Khamrah', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'KHAMRAH LATAFFA.jpg', gender: 'Fragancia Unisex', 
      top: ['Canela', 'Nuez Moscada', 'Bergamota'], middle: ['Dátiles', 'Praliné', 'Nardos'], base: ['Vainilla', 'Haba Tonka', 'Benjuí', 'Mirra'], accords: ['Dulce', 'Cálido Especiado', 'Vainilla', 'Ámbar'], seasons: {winter: 100, autumn: 90, spring: 30, summer: 10},
      desc: 'Una fragancia lujosa, dulce y especiada. Sus notas de dátiles, praliné y canela te envuelven en un abrazo cálido y embriagador, perfecto para las noches de invierno.' },
    { id: 'khamrah-qahwa', name: 'Khamrah Qahwa', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Lattafa Khamrah Qahwa.jpg', gender: 'Fragancia Unisex', 
      top: ['Canela', 'Cardamomo', 'Jengibre'], middle: ['Praliné', 'Frutas Confitadas', 'Flores Blancas'], base: ['Café', 'Vainilla', 'Haba Tonka', 'Benjuí'], accords: ['Café', 'Cálido Especiado', 'Dulce', 'Vainilla'], seasons: {winter: 100, autumn: 90, spring: 20, summer: 10},
      desc: 'Una deliciosa evolución del icónico Khamrah, enriquecida con una nota profunda de café árabe (Qahwa). Gourmand, intensa y absolutamente adictiva.' },
    { id: 'fakhar-gold', name: 'Fakhar Gold', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'FAKHAR LATTAFA GOLD.jpg', gender: 'Fragancia Unisex', 
      top: ['Nardos', 'Sal', 'Pino'], middle: ['Notas Solares', 'Cuero', 'Cachemira'], base: ['Ládano', 'Ámbar Gris'], accords: ['Blanco Floral', 'Salado', 'Cuero'], seasons: {winter: 60, autumn: 70, spring: 80, summer: 60},
      desc: 'Opulenta y radiante, esta fragancia mezcla nardos con toques solares y salados sobre una base elegante de cuero y cachemira. Una declaración de exclusividad.' },
    { id: 'mandarin-sky', name: 'Mandarin Sky', brand: 'Armaf', category: 'masculinas', price: '0', image: 'MANDARIN SKY.jpg', gender: 'Fragancia Masculina', 
      top: ['Mandarina', 'Naranja', 'Azafrán'], middle: ['Caramelo', 'Haba Tonka', 'Cempasúchil'], base: ['Ambroxan', 'Cedro'], accords: ['Dulce', 'Cítrico', 'Caramelo', 'Aromático'], seasons: {winter: 80, autumn: 80, spring: 60, summer: 40},
      desc: 'Una salida cítrica brillante que rápidamente se transforma en un caramelo dulce y seductor. Perfecta para quienes buscan una fragancia moderna, juguetona y masculina.' },
    { id: 'yara-lattafa', name: 'Yara', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'YARA LATAFFA.jpg', gender: 'Fragancia Femenina', 
      top: ['Orquídea', 'Heliotropo', 'Naranja'], middle: ['Acuerdo Gourmand', 'Frutas Tropicales'], base: ['Vainilla', 'Almizcle', 'Sándalo'], accords: ['Dulce', 'Avainillado', 'Empolvado', 'Tropical'], seasons: {winter: 60, autumn: 70, spring: 80, summer: 50},
      desc: 'Un perfume suave, dulce e irresistible. Yara combina un acorde gourmand de malvavisco y frutas tropicales con una base limpia y empolvada de vainilla y almizcle.' },
    { id: 'yara-candy', name: 'Yara Candy', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'YARA CANDY.jpg', gender: 'Fragancia Femenina', 
      top: ['Manzana Verde', 'Grosellas Negras'], middle: ['Caramelo', 'Fresa', 'Fresia'], base: ['Vainilla', 'Almizcle', 'Sándalo'], accords: ['Dulce', 'Afrutado', 'Caramelo'], seasons: {winter: 50, autumn: 70, spring: 80, summer: 60},
      desc: 'La versión más juguetona y golosa de Yara. Una explosión de dulces de fresa, manzana verde crujiente y un caramelo fundido que te hará agua la boca.' },
    { id: 'salvo-intense', name: 'Salvo Intense', brand: 'Maison Alhambra', category: 'masculinas', price: '0', image: 'SALVO INTENSE.jpg', gender: 'Fragancia Masculina', 
      top: ['Bergamota', 'Pimienta'], middle: ['Pimienta de Sichuan', 'Lavanda', 'Pimienta Rosa', 'Vetiver', 'Pachulí', 'Geranio'], base: ['Ambroxan', 'Cedro', 'Ládano'], accords: ['Fresco Especiado', 'Ámbar', 'Cítrico'], seasons: {winter: 60, autumn: 80, spring: 90, summer: 80},
      desc: 'Intensa, fresca y salvaje. Una apertura de bergamota picante que se adentra en maderas ambaradas y ambroxan. Un aroma magnético y sumamente versátil.' },
    { id: '9-pm-rebel', name: '9 PM Rebel', brand: 'Afnan', category: 'masculinas', price: '0', image: '9 PM REBEL.jpg', gender: 'Fragancia Masculina', 
      top: ['Piña', 'Manzana Verde', 'Mandarina'], middle: ['Musgo de Roble', 'Cedro', 'Vainilla'], base: ['Caramelo', 'Notas Amaderadas', 'Ámbar Gris', 'Almizcle'], accords: ['Afrutado', 'Dulce', 'Amaderado'], seasons: {winter: 70, autumn: 80, spring: 80, summer: 60},
      desc: 'Un giro rebelde a la familia frutal-amaderada. Combina la frescura jugosa de la piña y la manzana con una base oscura y dulce de caramelo y maderas secas.' },
    { id: '9-am-dive', name: '9 AM Dive', brand: 'Afnan', category: 'masculinas', price: '0', image: '9 AM DIVE.jpg', gender: 'Fragancia Unisex', 
      top: ['Limón', 'Pimienta Rosa', 'Menta', 'Grosellas Negras'], middle: ['Manzana', 'Incienso', 'Cedro'], base: ['Pachulí', 'Sándalo', 'Jazmín', 'Jengibre'], accords: ['Aromático', 'Cítrico', 'Fresco Especiado'], seasons: {winter: 30, autumn: 50, spring: 90, summer: 100},
      desc: 'Sumérgete en la frescura extrema. Cítricos chispeantes y menta helada se mezclan con incienso y maderas para crear la fragancia acuática definitiva para el día.' },
    { id: 'hayaati-black', name: 'Hayaati Black', brand: 'Lattafa', category: 'masculinas', price: '0', image: 'HAYAATI BLACK.jpg', gender: 'Fragancia Masculina', 
      top: ['Manzana', 'Bergamota'], middle: ['Notas Amaderadas', 'Canela'], base: ['Almizcle', 'Vainilla'], accords: ['Afrutado', 'Dulce', 'Acuático'], seasons: {winter: 50, autumn: 70, spring: 90, summer: 80},
      desc: 'Energética y cautivadora, Hayaati despliega una mezcla afrutada y dulce, con maderas especiadas que garantizan cumplidos a donde quiera que vayas.' },
    { id: 'hawas-fire', name: 'Hawas Fire', brand: 'Rasasi', category: 'masculinas', price: '0', image: 'HAWAS FIRE.jpg', gender: 'Fragancia Unisex', 
      top: ['Esclarea'], middle: ['Notas Marinas', 'Jazmín'], base: ['Ámbar', 'Notas Minerales', 'Ámbar Gris'], accords: ['Aromático', 'Acuático', 'Ámbar'], seasons: {winter: 50, autumn: 70, spring: 90, summer: 90},
      desc: 'El calor se encuentra con el océano. Hawas Fire reinterpreta la frescura acuática con tonos minerales cálidos y ámbar gris profundo, brindando una frescura potente y duradera.' },
    { id: 'fakhar-preto', name: 'Fakhar Black', brand: 'Lattafa', category: 'masculinas', price: '0', image: 'Fakhar Black Lattafa.jpg', gender: 'Fragancia Masculina', 
      top: ['Manzana', 'Bergamota', 'Jengibre'], middle: ['Lavanda', 'Salvia', 'Bayas de Enebro', 'Geranio'], base: ['Haba Tonka', 'Amberwood', 'Cedro', 'Vetiver'], accords: ['Aromático', 'Fresco Especiado', 'Amaderado'], seasons: {winter: 60, autumn: 80, spring: 100, summer: 80},
      desc: 'Elegancia aromática y frescura azul en una botella. Notas herbales como lavanda y salvia se combinan con frutas jugosas y un fondo amaderado muy sofisticado.' },
    { id: 'haya-pink', name: 'Haya Pink', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Haya Lattafa Perfumes.jpg', gender: 'Fragancia Femenina', 
      top: ['Champán', 'Fresa', 'Rosa', 'Naranja Sanguina'], middle: ['Gardenia', 'Jazmín', 'Orquídea'], base: ['Ámbar', 'Sándalo', 'Castaña'], accords: ['Floral', 'Afrutado', 'Dulce'], seasons: {winter: 40, autumn: 60, spring: 90, summer: 80},
      desc: 'Efervescente, floral y femenina. Haya brilla con notas de champán y fresa, floreciendo en un corazón de flores blancas lujosas sobre un lecho cálido y dulce.' },
    { id: 'art-of-universe', name: 'Art of Universe', brand: 'Maison Alhambra', category: 'masculinas', price: '0', image: 'ART OF UNIVERSE.jpg', gender: 'Fragancia Unisex', 
      top: ['Mandarina', 'Jengibre', 'Bergamota', 'Menta'], middle: ['Pera', 'Azahar'], base: ['Almizcle', 'Ámbar', 'Cedro'], accords: ['Cítrico', 'Aromático', 'Afrutado'], seasons: {winter: 40, autumn: 60, spring: 90, summer: 100},
      desc: 'Una refrescante combinación cítrica aromática donde el jengibre y la menta despiertan los sentidos, suavizados por una nota dulce y elegante de pera.' },
    { id: 'tropical-vibe', name: 'Tropical Vibe', brand: 'Rayhaan', category: 'femeninas', price: '0', image: 'TROPICAL VIBE RAYHAAN.jpg', gender: 'Fragancia Unisex', 
      top: ['Mango', 'Piña', 'Bergamota'], middle: ['Coco', 'Flores Blancas', 'Notas Marinas'], base: ['Ámbar', 'Sándalo', 'Almizcle', 'Vetiver'], accords: ['Afrutado', 'Tropical', 'Coco'], seasons: {winter: 20, autumn: 40, spring: 80, summer: 100},
      desc: 'Tus vacaciones en una botella. Jugoso mango, piña y coco se funden con notas marinas para transportarte instantáneamente a una playa paradisíaca.' },
    { id: 'eclaire-pistacho', name: 'Eclaire Pistache', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Eclaire Pistache Lattafa.jpg', gender: 'Fragancia Femenina', 
      top: ['Crema de Pistacho', 'Pistacho Tostado'], middle: ['Coco', 'Cacao', 'Crema Batida'], base: ['Vainilla', 'Leche', 'Almizcle'], accords: ['Dulce', 'Nuez', 'Lactónico', 'Vainilla'], seasons: {winter: 90, autumn: 90, spring: 60, summer: 30},
      desc: 'Un sueño gourmand hecho realidad. Una cremosidad irresistible de pistacho tostado, crema batida y leche avainillada que envuelve los sentidos de pura dulzura.' },
    { id: 'opulent-blanco', name: 'Opulent Musk', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Opulent Musk Lattafa.jpg', gender: 'Fragancia Unisex', 
      top: ['Almizcle Blanco', 'Azafrán', 'Limón'], middle: ['Flores Blancas', 'Jazmín'], base: ['Almizcle Blanco', 'Resina de Abeto', 'Cedro', 'Ámbar'], accords: ['Almizclado', 'Blanco Floral', 'Amaderado'], seasons: {winter: 60, autumn: 70, spring: 90, summer: 80},
      desc: 'Puro, limpio y majestuoso. Un almizcle blanco etéreo se mezcla con azafrán resinoso y maderas, creando una fragancia suave pero con una presencia regia.' },
    { id: 'fakhar-rosa', name: 'Fakhar Rose', brand: 'Lattafa', category: 'femeninas', price: '0', image: 'Fakhar Rose Lattafa.jpg', gender: 'Fragancia Femenina', 
      top: ['Frutas', 'Lirio', 'Granada', 'Aldehídos'], middle: ['Nardos', 'Jazmín', 'Gardenia', 'Ylang-Ylang', 'Rosa', 'Peonía'], base: ['Vainilla', 'Ambroxan', 'Almizcle Blanco', 'Sándalo'], accords: ['Blanco Floral', 'Nardos', 'Afrutado'], seasons: {winter: 60, autumn: 80, spring: 90, summer: 70},
      desc: 'Un exuberante bouquet de flores blancas donde reinan los nardos y el jazmín, dulcificado con frutas maduras y asentado sobre una vainilla seductora y elegante.' }
];

const projectDir = path.join(__dirname, '..');
const imgNotasDir = path.join(projectDir, 'Imagenes_Notas_Olfativas');
const existingImages = fs.readdirSync(imgNotasDir).filter(f => f.toLowerCase().endsWith('.jpg'));

// Dictionary to collect new notes mapping
const newNotesMapping = {};

// Function to find the best match for a note
function findImageForNote(note) {
    const cleanNote = note.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    // Exact match case-insensitive
    let match = existingImages.find(f => f.toLowerCase() === `${note.toLowerCase()}.jpg`);
    if (match) return `Imagenes_Notas_Olfativas/${match}`;
    
    // Fuzzy match
    match = existingImages.find(f => {
        const cleanF = f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return cleanF.includes(cleanNote) || cleanNote.includes(cleanF.replace('.jpg', ''));
    });
    
    if (match) return `Imagenes_Notas_Olfativas/${match}`;
    
    // fallback to generic
    return "";
}

// Generate HTML with correct CSS classes
function generateProductHTML(perfume) {
    
    const mapNotes = (notesArray) => {
        return notesArray.map(n => {
            const imgPath = findImageForNote(n);
            if (imgPath) newNotesMapping[n] = imgPath;
            return `
                            <div class="ingredient-item">
                                <div class="ingredient-icon"><img src="" alt="${n}"></div>
                                <span class="ingredient-name">${n}</span>
                            </div>`;
        }).join('');
    };

    const topHtml = mapNotes(perfume.top);
    const middleHtml = mapNotes(perfume.middle);
    const baseHtml = mapNotes(perfume.base);

    // Some fake accords colors if we wanted, but we can just use the badges for now.
    // Wait, the user's screenshot has `accords-container` but with the bars! I'll put badges as a fallback or bars if possible.
    // Let's use simple badges if bars are hard to guess percentages for.
    // Actually, `tienda.css` has `.accord-badge` which works fine. Let's stick to the structure in lattafa-teriaq if possible.
    // I'll just use the bars from lattafa-teriaq with decreasing percentages.
    const colors = ['#ffb366', '#ff9933', '#e6ccb3', '#8c4a1b', '#e6b800'];
    const accordsHtml = perfume.accords.map((a, i) => `
                    <div class="accord-bar-wrapper">
                        <span class="accord-label">${a}</span>
                        <div class="accord-bar-bg"><div class="accord-bar-fill" style="width: ${100 - (i*10)}%; background: ${colors[i % colors.length]};"></div></div>
                    </div>`).join('');

    return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${perfume.name} - OLÉ DIFERENTE</title>
    <meta name="referrer" content="no-referrer">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="tienda.css">
    <link rel="stylesheet" href="producto.css">
    <link rel="stylesheet" href="cart.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <header></header>
    <div class="container">
        <a href="tienda.html" class="back-to-shop">
            <i data-lucide="arrow-left"></i> VOLVER A LA TIENDA
        </a>
        <div class="product-detail-container" data-name="${perfume.name}">
            <div class="product-detail-image-wrapper">
                <img src="img/fragancias/${perfume.image}" alt="${perfume.name}" class="product-detail-image">
            </div>
            <div class="product-detail-info">
                <span class="detail-gender">GÉNERO: ${perfume.gender.replace('Fragancia ', '').toUpperCase()}</span>
                <h1 class="detail-title">${perfume.name}</h1>
                <p class="detail-description">
                    ${perfume.desc}
                </p>
                <div class="detail-price-container" style="margin-bottom: 25px;">
                    <span class="detail-price" style="font-size: 32px; font-weight: 700; color: var(--text-primary);">$${perfume.price}</span>
                    <span class="detail-size-label" style="font-size: 14px; color: var(--text-secondary); margin-left: 10px;">/ 100 ml</span>
                </div>
                <div class="visual-notes">
                    <div class="pyramid-section">
                        <div class="pyramid-header"><span>NOTAS DE SALIDA</span></div>
                        <div class="pyramid-grid">
                            ${topHtml}
                        </div>
                    </div>
                    <div class="pyramid-section">
                        <div class="pyramid-header"><span>CORAZÓN</span></div>
                        <div class="pyramid-grid">
                            ${middleHtml}
                        </div>
                    </div>
                    <div class="pyramid-section">
                        <div class="pyramid-header"><span>BASE</span></div>
                        <div class="pyramid-grid">
                            ${baseHtml}
                        </div>
                    </div>
                </div>
                <div class="accords-container">
                    <h3 class="accords-title">Acordes Principales</h3>
                    ${accordsHtml}
                </div>
                <div class="purchase-controls" style="margin-top: 30px; display: flex; gap: 15px; align-items: center;">
                    <input type="number" class="quantity-selector" value="1" min="1" style="width: 70px; padding: 15px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); text-align: center;">
                    <button class="add-to-cart-btn" style="flex-grow: 1; padding: 18px 40px; font-size: 16px;">AGREGAR AL CARRITO</button>
                </div>
            </div>
        </div>
    </div>
    <footer></footer>
    <script src="supabase-config.js"></script>
    <script src="components.js?v=3"></script>
    <script src="product_manager.js?v=3"></script>
    <script src="cart.js?v=2"></script>
</body>
</html>`;
}

// Write the files
perfumes.forEach(p => {
    fs.writeFileSync(path.join(projectDir, p.id + '.html'), generateProductHTML(p));
});

// Update product_manager.js with new mappings
const pmPath = path.join(projectDir, 'product_manager.js');
let pmContent = fs.readFileSync(pmPath, 'utf-8');

// Find the NOTAS_OLFATIVAS object and inject new mappings
const notesToInject = Object.entries(newNotesMapping)
    .map(([note, imgPath]) => `    "${note}": "${imgPath}",`)
    .join('\n');

pmContent = pmContent.replace(/const NOTAS_OLFATIVAS = {/, `const NOTAS_OLFATIVAS = {\n${notesToInject}`);
fs.writeFileSync(pmPath, pmContent);

console.log("Corrección completada. Mapeos agregados:", Object.keys(newNotesMapping).length);
