/**
 * OLÉ DIFERENTE - Product Detail Manager
 * Automatiza la carga de imágenes de notas olfativas desde notes_db.js
 */

const NOTAS_OLFATIVAS = {
    "Naranja Siciliana": "Imagenes_Notas_Olfativas/Naranja.jpg",
    "Limón": "Imagenes_Notas_Olfativas/Limón.jpg",
    "Bergamota": "Imagenes_Notas_Olfativas/Bergamota.jpg",
    "Almizcle Blanco": "Imagenes_Notas_Olfativas/Almizcle.jpg",
    "Vainilla": "Imagenes_Notas_Olfativas/Vainilla.jpg",
    "Ámbar": "Imagenes_Notas_Olfativas/Ámbar.jpg",
    "Canela": "Imagenes_Notas_Olfativas/Canela.jpg",
    "Nuez Moscada": "Imagenes_Notas_Olfativas/Nuez moscada.jpg",
    "Dátiles": "Imagenes_Notas_Olfativas/Dátiles.jpg",
    "Praliné": "Imagenes_Notas_Olfativas/praliné.jpg",
    "Nardos": "Imagenes_Notas_Olfativas/Nardo.jpg",
    "Haba Tonka": "Imagenes_Notas_Olfativas/Haba Tonka.jpg",
    "Benjuí": "Imagenes_Notas_Olfativas/Benjuí.jpg",
    "Mirra": "Imagenes_Notas_Olfativas/Mirra.jpg",
    "Cardamomo": "Imagenes_Notas_Olfativas/Cardamomo.jpg",
    "Jengibre": "Imagenes_Notas_Olfativas/Jengibre.jpg",
    "Frutas Confitadas": "Imagenes_Notas_Olfativas/Frutas confitadas.jpg",
    "Flores Blancas": "Imagenes_Notas_Olfativas/Flores Blancas.jpg",
    "Café": "Imagenes_Notas_Olfativas/Café.jpg",
    "Sal": "Imagenes_Notas_Olfativas/Sal.jpg",
    "Pino": "Imagenes_Notas_Olfativas/Pino.jpg",
    "Notas Solares": "Imagenes_Notas_Olfativas/Notas Solares.jpg",
    "Cuero": "Imagenes_Notas_Olfativas/Cuero.jpg",
    "Cachemira": "Imagenes_Notas_Olfativas/cachemira.jpg",
    "Ládano": "Imagenes_Notas_Olfativas/Ládano.jpg",
    "Ámbar Gris": "Imagenes_Notas_Olfativas/Ámbar gris.jpg",
    "Mandarina": "Imagenes_Notas_Olfativas/Mandarina.jpg",
    "Naranja": "Imagenes_Notas_Olfativas/Naranja.jpg",
    "Azafrán": "Imagenes_Notas_Olfativas/Azafrán.jpg",
    "Caramelo": "Imagenes_Notas_Olfativas/Caramelo.jpg",
    "Ambroxan": "Imagenes_Notas_Olfativas/Ambroxan.jpg",
    "Cedro": "Imagenes_Notas_Olfativas/Cedro.jpg",
    "Orquídea": "Imagenes_Notas_Olfativas/Orquídea.jpg",
    "Heliotropo": "Imagenes_Notas_Olfativas/Heliotropo.jpg",
    "Frutas Tropicales": "Imagenes_Notas_Olfativas/Frutas Tropicales.jpg",
    "Almizcle": "Imagenes_Notas_Olfativas/Almizcle.jpg",
    "Sándalo": "Imagenes_Notas_Olfativas/Sándalo.jpg",
    "Manzana Verde": "Imagenes_Notas_Olfativas/Manzana.jpg",
    "Grosellas Negras": "Imagenes_Notas_Olfativas/rosella.jpg",
    "Fresa": "Imagenes_Notas_Olfativas/Fresa.jpg",
    "Fresia": "Imagenes_Notas_Olfativas/Fresia.jpg",
    "Pimienta": "Imagenes_Notas_Olfativas/Pimienta.jpg",
    "Pimienta de Sichuan": "Imagenes_Notas_Olfativas/Pimienta de Sichuan.jpg",
    "Lavanda": "Imagenes_Notas_Olfativas/Lavanda.jpg",
    "Pimienta Rosa": "Imagenes_Notas_Olfativas/Pimienta rosa.jpg",
    "Vetiver": "Imagenes_Notas_Olfativas/Vetiver.jpg",
    "Pachulí": "Imagenes_Notas_Olfativas/Pachulí.jpg",
    "Geranio": "Imagenes_Notas_Olfativas/Geranio.jpg",
    "Piña": "Imagenes_Notas_Olfativas/Piña.jpg",
    "Musgo de Roble": "Imagenes_Notas_Olfativas/Musgo de roble.jpg",
    "Notas Amaderadas": "Imagenes_Notas_Olfativas/Notas Amaderadas.jpg",
    "Menta": "Imagenes_Notas_Olfativas/Menta.jpg",
    "Manzana": "Imagenes_Notas_Olfativas/Manzana.jpg",
    "Incienso": "Imagenes_Notas_Olfativas/Incienso.jpg",
    "Jazmín": "Imagenes_Notas_Olfativas/Jazmín.jpg",
    "Esclarea": "Imagenes_Notas_Olfativas/Salvia esclarea.jpg",
    "Notas Minerales": "Imagenes_Notas_Olfativas/Notas minerales.jpg",
    "Salvia": "Imagenes_Notas_Olfativas/Salvia.jpg",
    "Bayas de Enebro": "Imagenes_Notas_Olfativas/Bayas de Enebro.jpg",
    "Champán": "Imagenes_Notas_Olfativas/Champán.jpg",
    "Rosa": "Imagenes_Notas_Olfativas/Rosa.jpg",
    "Naranja Sanguina": "Imagenes_Notas_Olfativas/Naranja sanguina.jpg",
    "Gardenia": "Imagenes_Notas_Olfativas/Gardenia.jpg",
    "Castaña": "Imagenes_Notas_Olfativas/Castaña.jpg",
    "Pera": "Imagenes_Notas_Olfativas/Pera.jpg",
    "Azahar": "Imagenes_Notas_Olfativas/Azahar.jpg",
    "Mango": "Imagenes_Notas_Olfativas/Mango.jpg",
    "Coco": "Imagenes_Notas_Olfativas/Coco.jpg",
    "Crema de Pistacho": "Imagenes_Notas_Olfativas/Crema de pistacho para untar.jpg",
    "Pistacho Tostado": "Imagenes_Notas_Olfativas/Pistacho.jpg",
    "Cacao": "Imagenes_Notas_Olfativas/copoazú (cacao blanco).jpg",
    "Crema Batida": "Imagenes_Notas_Olfativas/Batida.jpg",
    "Leche": "Imagenes_Notas_Olfativas/Leche.jpg",
    "Resina de Abeto": "Imagenes_Notas_Olfativas/Abeto.jpg",
    "Frutas": "Imagenes_Notas_Olfativas/Cóctel de Frutas.jpg",
    "Lirio": "Imagenes_Notas_Olfativas/Lirio.jpg",
    "Granada": "Imagenes_Notas_Olfativas/Granada.jpg",
    "Aldehídos": "Imagenes_Notas_Olfativas/Aldehídos.jpg",
    "Ylang-Ylang": "Imagenes_Notas_Olfativas/Ylang-Ylang.jpg",
    "Peonía": "Imagenes_Notas_Olfativas/Peonía.jpg",
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
    "Notas Amaderadas": "Imagenes_Notas_Olfativas/Notas Amaderadas.jpg",
    "Caramelo": "Imagenes_Notas_Olfativas/Caramelo.jpg",
    "Almendra Amarga": "Imagenes_Notas_Olfativas/Almendra.jpg",
    "Albaricoque": "Imagenes_Notas_Olfativas/Albaricoque.jpg",
    "Pimienta Rosa": "Imagenes_Notas_Olfativas/Pimienta rosa.jpg",
    "Miel": "Imagenes_Notas_Olfativas/Miel.jpg",
    "Ruibarbo": "Imagenes_Notas_Olfativas/Ruibarbo.jpg",
    "Ládano": "Imagenes_Notas_Olfativas/Ládano.jpg",
    "Violeta": "Imagenes_Notas_Olfativas/Violeta.jpg",
    "Papiro": "Imagenes_Notas_Olfativas/Papiro.jpg",
    "Leche de Almendras": "Imagenes_Notas_Olfativas/Almendra.jpg",
    "Merengue": "Imagenes_Notas_Olfativas/Batida.jpg",
    "Cempasúchil": "Imagenes_Notas_Olfativas/Cempasúchil.jpg",
    "Cempasuchil": "Imagenes_Notas_Olfativas/Cempasuchil.jpg",
    "Tagetes": "Imagenes_Notas_Olfativas/Tagetes.jpg",
    "Marigold": "Imagenes_Notas_Olfativas/Marigold.jpg",
    "Nuez moscada": "Imagenes_Notas_Olfativas/Nuez moscada.jpg",
    "Elemí": "Imagenes_Notas_Olfativas/elemí.jpg",
    "Pimiento": "Imagenes_Notas_Olfativas/Pimiento Verde.jpg",
    "Cistus": "Imagenes_Notas_Olfativas/Cistus Incanus.jpg",
    "Pitahaya": "Imagenes_Notas_Olfativas/Flor de pitahaya.jpg",
    "Coñac": "Imagenes_Notas_Olfativas/Coñac.jpg",
    "Gamuza": "Imagenes_Notas_Olfativas/Gamuza.jpg",
    "Mahonial": "Imagenes_Notas_Olfativas/Mahonial.jpg",
    "Akigalawood": "Imagenes_Notas_Olfativas/Akigalawood.jpg",
    "Ambrofix": "Imagenes_Notas_Olfativas/Ambrofix™.jpg",
    "Madreselva": "Imagenes_Notas_Olfativas/Madreselva.jpg",
    "Albahaca": "Imagenes_Notas_Olfativas/Albahaca.jpg",
    "Manzanilla": "Imagenes_Notas_Olfativas/Manzanilla.jpg",
    "Davana": "Imagenes_Notas_Olfativas/Davana.jpg",
    "Lichi": "Imagenes_Notas_Olfativas/Flor de lichi.jpg",
    "Musgo": "Imagenes_Notas_Olfativas/Flox musgoso.jpg",
    "Durazno": "Imagenes_Notas_Olfativas/Crema de Durazno.jpg",
    "Grosella negra": "Imagenes_Notas_Olfativas/Grosella negra.jpg",
    "Abedul": "Imagenes_Notas_Olfativas/Abedul.jpg",
    "Ámbar gris": "Imagenes_Notas_Olfativas/Ámbar gris.jpg",
    "Romero": "Imagenes_Notas_Olfativas/Romero.jpg",
    "Azúcar": "Imagenes_Notas_Olfativas/Algodón de azúcar.jpg",
    "Toronja (Pomelo)": "Imagenes_Notas_Olfativas/toronja (pomelo).jpg",
    "Crème Brûlée": "Imagenes_Notas_Olfativas/Crème brûlée.jpg",
    "Cúrcuma": "Imagenes_Notas_Olfativas/Cúrcuma.jpg",
    "Musgo de roble": "Imagenes_Notas_Olfativas/Musgo de roble.jpg",
    "Algas": "Imagenes_Notas_Olfativas/Algas marinas.jpg",
    "Grosella Negra": "Imagenes_Notas_Olfativas/Grosella negra.jpg",
    "Petit Grain": "Imagenes_Notas_Olfativas/petit grain.jpg",
    "Guayacán": "Imagenes_Notas_Olfativas/Guayacán.jpg",
    "Mermelada de cereza": "Imagenes_Notas_Olfativas/Mermelada de cereza.jpg",
    "Artemisa": "Imagenes_Notas_Olfativas/Artemisa.jpg",
    "Ciprés": "Imagenes_Notas_Olfativas/Cedro.jpg",
    "Maderas": "Imagenes_Notas_Olfativas/Notas Amaderadas.jpg",
    "Madera de Ámbar": "Imagenes_Notas_Olfativas/Madera de Ámbar.jpg",
    "Osmanto": "Imagenes_Notas_Olfativas/osmanto (olivo oloroso).jpg",
    "Ron": "Imagenes_Notas_Olfativas/Acronychia pedunculata.jpg",
    "Nardo": "Imagenes_Notas_Olfativas/Nardo.jpg",
    "Salvia Esclarea": "Imagenes_Notas_Olfativas/Salvia esclarea.jpg",
    "Mandarina Verde": "Imagenes_Notas_Olfativas/Mandarina.jpg",
    "Higo": "Imagenes_Notas_Olfativas/Higo.jpg",
    "Palo Santo": "Imagenes_Notas_Olfativas/Palo Santo.jpg",
    "Toffee": "Imagenes_Notas_Olfativas/Caramelo.jpg",
    "Lavanda Silvestre": "Imagenes_Notas_Olfativas/Lavanda.jpg",
    "Ciruela Mirabel": "Imagenes_Notas_Olfativas/Ciruela.jpg",
    "Vainilla Bourbon": "Imagenes_Notas_Olfativas/Vainilla.jpg",
    "Madera de Oud": "Imagenes_Notas_Olfativas/Madera de agar (Oud).jpg",
    "Vainilla Cálida": "Imagenes_Notas_Olfativas/Vainilla.jpg",
    "Resina de Elemí": "Imagenes_Notas_Olfativas/elemí.jpg",
    "Amberwood": "Imagenes_Notas_Olfativas/Madera de Ámbar.jpg",
    "Notas Acuosas": "Imagenes_Notas_Olfativas/Agua.jpg",
    "Casis": "Imagenes_Notas_Olfativas/Grosella negra.jpg",
    "Sal Marina": "Imagenes_Notas_Olfativas/Sal.jpg",
    "Notas Acuáticas": "Imagenes_Notas_Olfativas/Agua.jpg",
    "Cypriol": "Imagenes_Notas_Olfativas/Aceite de cipriol o Nagarmotha.jpg",
    "Notas Afrutadas": "Imagenes_Notas_Olfativas/Cóctel de Frutas.jpg",
    "Abeto Balsámico": "Imagenes_Notas_Olfativas/Abeto.jpg",
    "Ámbar de Cristal": "Imagenes_Notas_Olfativas/Ámbar.jpg",
    "Acuerdo Gourmand": "Imagenes_Notas_Olfativas/Acorde Gourmand.jpg",
    "Sábila (Aloe Vera)": "Imagenes_Notas_Olfativas/Sábila.jpg",
    "lavanda": "Imagenes_Notas_Olfativas/Lavanda.jpg",
    "canela": "Imagenes_Notas_Olfativas/Canela.jpg",
    "mandarina": "Imagenes_Notas_Olfativas/Mandarina.jpg",
    "iris": "Imagenes_Notas_Olfativas/Iris Pallida.jpg",
    "benjuí": "Imagenes_Notas_Olfativas/Benjuí.jpg",
    "ciprés": "Imagenes_Notas_Olfativas/Cedro.jpg",
    "vainilla": "Imagenes_Notas_Olfativas/Vainilla.jpg",
    "haba tonka": "Imagenes_Notas_Olfativas/Haba Tonka.jpg",
    "ámbar": "Imagenes_Notas_Olfativas/Ámbar.jpg",
    "incienso": "Imagenes_Notas_Olfativas/Incienso.jpg",
    "cedro": "Imagenes_Notas_Olfativas/Cedro.jpg",
    "pachulí": "Imagenes_Notas_Olfativas/Pachulí.jpg"
};

/**
 * BASE DE DATOS DE ESTACIONES (PORCENTAJES)
 * Agrega aquí los porcentajes para cada fragancia.
 * Si no está en la lista, se mostrará un valor predeterminado equilibrado.
 */
const SEASONS_DATA = {
    "philos-pura.html": { winter: 50, autumn: 70, spring: 90, summer: 80 },
    "khamrah-lattafa.html": { winter: 100, autumn: 90, spring: 30, summer: 10 },
    "khamrah-qahwa.html": { winter: 100, autumn: 90, spring: 20, summer: 10 },
    "fakhar-gold.html": { winter: 60, autumn: 70, spring: 80, summer: 60 },
    "mandarin-sky.html": { winter: 80, autumn: 80, spring: 60, summer: 40 },
    "yara-lattafa.html": { winter: 60, autumn: 70, spring: 80, summer: 50 },
    "yara-candy.html": { winter: 50, autumn: 70, spring: 80, summer: 60 },
    "salvo-intense.html": { winter: 60, autumn: 80, spring: 90, summer: 80 },
    "9-pm-rebel.html": { winter: 70, autumn: 80, spring: 80, summer: 60 },
    "9-am-dive.html": { winter: 30, autumn: 50, spring: 90, summer: 100 },
    "hayaati-black.html": { winter: 50, autumn: 70, spring: 90, summer: 80 },
    "hawas-fire.html": { winter: 50, autumn: 70, spring: 90, summer: 90 },
    "fakhar-preto.html": { winter: 60, autumn: 80, spring: 100, summer: 80 },
    "haya-pink.html": { winter: 40, autumn: 60, spring: 90, summer: 80 },
    "art-of-universe.html": { winter: 40, autumn: 60, spring: 90, summer: 100 },
    "tropical-vibe.html": { winter: 20, autumn: 40, spring: 80, summer: 100 },
    "eclaire-pistacho.html": { winter: 90, autumn: 90, spring: 60, summer: 30 },
    "opulent-blanco.html": { winter: 60, autumn: 70, spring: 90, summer: 80 },
    "fakhar-rosa.html": { winter: 60, autumn: 80, spring: 90, summer: 70 },
    "zakat-world-cup.html": { winter: 30, autumn: 50, spring: 85, summer: 100 },
    "stallion-53.html": { winter: 85, autumn: 90, spring: 70, summer: 40 },
    "hayaati-al-maleky.html": { winter: 95, autumn: 90, spring: 60, summer: 30 },
    "her-confession.html": { winter: 95, autumn: 90, spring: 60, summer: 25 },
    "badee-al-oud-noble-blush.html": { winter: 75, autumn: 80, spring: 85, summer: 50 },
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
    "lattafa-teriaq.html": { winter: 100, autumn: 95, spring: 50, summer: 20 },
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
        const isSubPage = window.location.pathname.includes('/productos/') || window.location.pathname.split('/').slice(-2)[0] === 'productos';
        this.basePath = isSubPage ? '../' : '';
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
                iconContainer.innerHTML = `<img src="${this.basePath}${imageUrl}" alt="${noteName}" loading="lazy">`;
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

