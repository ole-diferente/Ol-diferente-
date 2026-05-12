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

/**
 * BASE DE DATOS DE ESTACIONES (PORCENTAJES)
 * Agrega aquí los porcentajes para cada fragancia.
 * Si no está en la lista, se mostrará un valor predeterminado equilibrado.
 */
const SEASONS_DATA = {
    // Masculinas
    "hawas-for-him.html": { winter: 30, autumn: 70, spring: 95, summer: 100 },
    "afnan-9pm.html": { winter: 95, autumn: 90, spring: 65, summer: 30 },
    "badee-al-oud-for-glory.html": { winter: 100, autumn: 90, spring: 40, summer: 15 },
    "lattafa-asad.html": { winter: 100, autumn: 95, spring: 40, summer: 10 },
    "club-de-nuit.html": { winter: 45, autumn: 85, spring: 95, summer: 100 },
    "turathi-blue.html": { winter: 20, autumn: 60, spring: 90, summer: 100 },
    "dark-door-sport.html": { winter: 15, autumn: 50, spring: 95, summer: 100 },
    "lattafa-atlas.html": { winter: 25, autumn: 55, spring: 85, summer: 100 },
    "qaed-al-fursan.html": { winter: 40, autumn: 75, spring: 95, summer: 100 },
    "salvo-elixir.html": { winter: 100, autumn: 95, spring: 45, summer: 15 },
    "khamrah-dukhan.html": { winter: 100, autumn: 95, spring: 35, summer: 10 },
    "vintage-radio.html": { winter: 80, autumn: 95, spring: 85, summer: 60 },
    "lattafa-his-confession.html": { winter: 90, autumn: 95, spring: 60, summer: 25 },
    
    // Femeninas / Unisex
    "eclaire.html": { winter: 100, autumn: 95, spring: 55, summer: 20 },
    "club-de-nuit-women.html": { winter: 75, autumn: 90, spring: 100, summer: 85 },
    "coconut-passion.html": { winter: 25, autumn: 45, spring: 80, summer: 100 },
    "bare-vanilla.html": { winter: 95, autumn: 100, spring: 60, summer: 30 },
    "aqua-kiss.html": { winter: 10, autumn: 40, spring: 90, summer: 100 },
    "pure-seduction.html": { winter: 20, autumn: 50, spring: 95, summer: 100 },
    "vs-rush.html": { winter: 40, autumn: 70, spring: 90, summer: 100 },
    
    // Otros
    "liquid-brun.html": { winter: 100, autumn: 90, spring: 50, summer: 15 },
    "honor-and-glory.html": { winter: 60, autumn: 85, spring: 95, summer: 100 },
    "sceptre-malachite.html": { winter: 35, autumn: 70, spring: 100, summer: 90 },
    "odyssey-homme-black.html": { winter: 100, autumn: 90, spring: 45, summer: 20 },
    "oud-forever.html": { winter: 100, autumn: 85, spring: 35, summer: 10 }
};

class ProductDetailManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadNoteImages();
        this.renderSeasonRecommendations();
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
                if (!iconContainer.querySelector('img')) {
                    iconContainer.innerHTML = `<i data-lucide="droplets"></i>`;
                }
            }
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    renderSeasonRecommendations() {
        // Obtener el nombre del archivo actual
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        
        // Buscar datos para este perfume
        const data = SEASONS_DATA[fileName] || { winter: 50, autumn: 50, spring: 50, summer: 50 };
        
        // Buscar dónde inyectar (después de los acordes o antes de los controles de compra)
        const targetContainer = document.querySelector('.accords-container');
        if (!targetContainer) return;

        // Verificar si ya existe (para no duplicar si se agregó manualmente)
        if (document.querySelector('.seasons-container')) return;

        const seasonsHTML = `
            <div class="seasons-container reveal">
                <h3 class="seasons-title">Uso Ideal: Estaciones</h3>
                <div class="seasons-grid">
                    <div class="season-item season-invierno">
                        <div class="season-icon"><i data-lucide="snowflake"></i></div>
                        <span class="season-name">Invierno</span>
                        <div class="season-bar-container">
                            <div class="season-bar-fill" style="width: 0%;" data-target="${data.winter}"></div>
                        </div>
                    </div>
                    <div class="season-item season-otono">
                        <div class="season-icon"><i data-lucide="leaf"></i></div>
                        <span class="season-name">Otoño</span>
                        <div class="season-bar-container">
                            <div class="season-bar-fill" style="width: 0%;" data-target="${data.autumn}"></div>
                        </div>
                    </div>
                    <div class="season-item season-primavera">
                        <div class="season-icon"><i data-lucide="flower-2"></i></div>
                        <span class="season-name">Primavera</span>
                        <div class="season-bar-container">
                            <div class="season-bar-fill" style="width: 0%;" data-target="${data.spring}"></div>
                        </div>
                    </div>
                    <div class="season-item season-verano">
                        <div class="season-icon"><i data-lucide="sun"></i></div>
                        <span class="season-name">Verano</span>
                        <div class="season-bar-container">
                            <div class="season-bar-fill" style="width: 0%;" data-target="${data.summer}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        targetContainer.insertAdjacentHTML('afterend', seasonsHTML);
        
        // Inicializar iconos de Lucide para los nuevos elementos
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Animación de las barras
        setTimeout(() => {
            document.querySelectorAll('.season-bar-fill').forEach(bar => {
                const target = bar.getAttribute('data-target');
                bar.style.width = target + '%';
            });
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailManager();
});

