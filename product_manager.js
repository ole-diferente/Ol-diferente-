/**
 * OLÉ DIFERENTE - Product Detail Manager
 * Automatiza la carga de imágenes de notas olfativas desde notes_db.js
 */

const NOTAS_OLFATIVAS = {
    "Limón": "Imagenes_Notas_Olfativas/Limón.jpg",
    "Bergamota": "Imagenes_Notas_Olfativas/Bergamota.jpg",
    "Mandarina": "Imagenes_Notas_Olfativas/Mandarina.jpg",
    "Clementina Jugosa": "Imagenes_Notas_Olfativas/Mandarina.jpg",
    "Toronja": "Imagenes_Notas_Olfativas/Toronja.jpg",
    "Naranja": "Imagenes_Notas_Olfativas/Naranja.jpg",
    "Cítricos": "Imagenes_Notas_Olfativas/Cítricos.jpg",
    "Neroli": "Imagenes_Notas_Olfativas/Neroli.jpg",
    "Lima": "Imagenes_Notas_Olfativas/Lima.jpg",
    "Rosa": "Imagenes_Notas_Olfativas/Rosa.jpg",
    "Jazmín": "Imagenes_Notas_Olfativas/Jazmín.jpg",
    "Flores Blancas": "Imagenes_Notas_Olfativas/Azahar.jpg",
    "Lavanda": "Imagenes_Notas_Olfativas/Lavanda.jpg",
    "Flor de Azahar": "Imagenes_Notas_Olfativas/Azahar.jpg",
    "Lirio de los Valles": "Imagenes_Notas_Olfativas/Lirio de los valles.jpg",
    "Freesia": "Imagenes_Notas_Olfativas/Fresia.jpg",
    "Iris": "Imagenes_Notas_Olfativas/Iris Pallida.jpg",
    "Geranio": "Imagenes_Notas_Olfativas/Geranio.jpg",
    "Margarita": "Imagenes_Notas_Olfativas/Margarita.jpg",
    "Manzana": "Imagenes_Notas_Olfativas/Manzana.jpg",
    "Piña": "Imagenes_Notas_Olfativas/Piña.jpg",
    "Ciruela": "Imagenes_Notas_Olfativas/Ciruela.jpg",
    "Ciruela Roja": "Imagenes_Notas_Olfativas/Ciruela.jpg",
    "Coco": "Imagenes_Notas_Olfativas/Coco.jpg",
    "Melón": "Imagenes_Notas_Olfativas/Melón.jpg",
    "Pera": "Imagenes_Notas_Olfativas/Pera.jpg",
    "Pimienta Negra": "Imagenes_Notas_Olfativas/Pimienta.jpg",
    "Canela": "Imagenes_Notas_Olfativas/Canela.jpg",
    "Azafrán": "Imagenes_Notas_Olfativas/Azafrán.jpg",
    "Pachulí": "Imagenes_Notas_Olfativas/Pachulí.jpg",
    "Sándalo": "Imagenes_Notas_Olfativas/Sándalo.jpg",
    "Vetiver": "Imagenes_Notas_Olfativas/Vetiver.jpg",
    "Cedro": "Imagenes_Notas_Olfativas/Cedro.jpg",
    "Ámbar": "Imagenes_Notas_Olfativas/Ámbar.jpg",
    "Almizcle": "Imagenes_Notas_Olfativas/Almizcle.jpg",
    "Vainilla": "Imagenes_Notas_Olfativas/Vainilla.jpg",
    "Café": "Imagenes_Notas_Olfativas/Café.jpg",
    "Tabaco": "Imagenes_Notas_Olfativas/Tabaco.jpg",
    "Cuero": "Imagenes_Notas_Olfativas/Cuero.jpg",
    "Notas Marinas": "Imagenes_Notas_Olfativas/Agua de Mar.jpg",
    "Isla de Coco": "Imagenes_Notas_Olfativas/Coco.jpg",
    "Vainilla Batida": "Imagenes_Notas_Olfativas/Vainilla.jpg",
    "Cachemira Soft": "Imagenes_Notas_Olfativas/cachemira.jpg",
    "Aldehídos": "Imagenes_Notas_Olfativas/Aldehídos.jpg",
    "Especias": "Imagenes_Notas_Olfativas/Notas Especiadas.jpg",
    "Especias Frescas": "Imagenes_Notas_Olfativas/Notas Especiadas.jpg",
    "Resina de Elemi": "Imagenes_Notas_Olfativas/elemí.jpg",
    "Notas Amaderadas": "Imagenes_Notas_Olfativas/Notas Amaderadas.jpg"
};

class ProductDetailManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadNoteImages();
    }

    loadNoteImages() {
        document.querySelectorAll('.ingredient-item').forEach(item => {
            const nameSpan = item.querySelector('.ingredient-name');
            const iconContainer = item.querySelector('.ingredient-icon');
            if (!nameSpan || !iconContainer) return;

            const noteName = nameSpan.textContent.trim();
            const imageUrl = NOTAS_OLFATIVAS[noteName];

            if (imageUrl) {
                iconContainer.innerHTML = `<img src="${imageUrl}" alt="${noteName}" loading="lazy">`;
            } else {
                console.warn(`Imagen no encontrada para la nota: ${noteName}`);
                // Fallback icon if needed
                if (!iconContainer.querySelector('img')) {
                    iconContainer.innerHTML = `<i data-lucide="droplets"></i>`;
                    lucide.createIcons();
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailManager();
});
