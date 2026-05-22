const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'product_manager.js');
let text = fs.readFileSync(p, 'utf-8');

// I accidentally removed:
//    "Limón": "Imagenes_Notas_Olfativas/Limón.jpg",
//    "Bergamota": "Imagenes_Notas_Olfativas/Bergamota.jpg",
//    "Mandarina": "Imagenes_Notas_Olfativas/Mandarina.jpg",
//    "Clementina Jugosa": "Imagenes_Notas_Olfativas/Mandarina.jpg",
//    "Toronja": "Imagenes_Notas_Olfativas/Toronja.jpg",
//    "Naranja": "Imagenes_Notas_Olfativas/Naranja.jpg",

// I'll add them back right before "Cítricos"
const missing = `    "Limón": "Imagenes_Notas_Olfativas/Limón.jpg",
    "Bergamota": "Imagenes_Notas_Olfativas/Bergamota.jpg",
    "Mandarina": "Imagenes_Notas_Olfativas/Mandarina.jpg",
    "Clementina Jugosa": "Imagenes_Notas_Olfativas/Mandarina.jpg",
    "Toronja": "Imagenes_Notas_Olfativas/Toronja.jpg",
    "Naranja": "Imagenes_Notas_Olfativas/Naranja.jpg",\n`;

text = text.replace('    "Cítricos": "Imagenes_Notas_Olfativas/Cítricos.jpg",', missing + '    "Cítricos": "Imagenes_Notas_Olfativas/Cítricos.jpg",');

// Also ensure my new mappings are correctly added at the end of NOTAS_OLFATIVAS
const newMappings = `    "Notas Afrutadas": "Imagenes_Notas_Olfativas/Notas Frutales.jpg",
    "Cempasúchil": "Imagenes_Notas_Olfativas/Tagete.jpg",
    "Amberwood": "Imagenes_Notas_Olfativas/Madera de ámbar.jpg",\n`;

text = text.replace('};\n\nconst SEASONS_DATA', newMappings + '};\n\nconst SEASONS_DATA');

fs.writeFileSync(p, text);
console.log("Fixed product_manager.js");
