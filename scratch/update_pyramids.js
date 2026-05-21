const fs = require('fs');

const perfumes = [
    {
        file: '9pm-elixir.html',
        pyramid: {
            top: [
                { name: 'Nuez moscada', img: 'Nuez moscada.jpg' },
                { name: 'Elemí', img: 'Elemí.jpg' },
                { name: 'Cardamomo', img: 'Cardamomo.jpg' }
            ],
            heart: [
                { name: 'Pimiento', img: 'Pimiento.jpg' },
                { name: 'Cuero', img: 'Cuero.jpg' },
                { name: 'Lavanda', img: 'Lavanda.jpg' }
            ],
            base: [
                { name: 'Vainilla', img: 'Vainilla.jpg' },
                { name: 'Pachulí', img: 'Pachulí.jpg' },
                { name: 'Ládano', img: 'Ládano.jpg' },
                { name: 'Cistus', img: 'Cistus Incanus.jpg' }
            ]
        }
    },
    {
        file: 'assad-bourbon.html',
        pyramid: {
            top: [
                { name: 'Lavanda', img: 'Lavanda.jpg' },
                { name: 'Ciruela Mirabel', img: 'Ciruela.jpg' },
                { name: 'Pimienta Rosa', img: 'Pimienta rosa.jpg' }
            ],
            heart: [
                { name: 'Cacao', img: 'Cacao.jpg' },
                { name: 'Nuez moscada', img: 'Nuez moscada.jpg' },
                { name: 'Davana', img: 'Davana.jpg' }
            ],
            base: [
                { name: 'Vainilla Bourbon', img: 'Vainilla.jpg' },
                { name: 'Ámbar', img: 'Ámbar.jpg' },
                { name: 'Vetiver', img: 'Vetiver.jpg' }
            ]
        }
    },
    {
        file: 'badee-al-oud-sublime.html',
        pyramid: {
            top: [
                { name: 'Manzana', img: 'Manzana.jpg' },
                { name: 'Lichi', img: 'Lichi.jpg' },
                { name: 'Rosa', img: 'Rosa.jpg' }
            ],
            heart: [
                { name: 'Ciruela', img: 'Ciruela.jpg' },
                { name: 'Jazmín', img: 'Jazmín.jpg' }
            ],
            base: [
                { name: 'Vainilla', img: 'Vainilla.jpg' },
                { name: 'Musgo', img: 'Musgo de roble.jpg' },
                { name: 'Pachulí', img: 'Pachulí.jpg' }
            ]
        }
    },
    {
        file: 'hayaati-gold.html',
        pyramid: {
            top: [
                { name: 'Bergamota', img: 'Bergamota.jpg' },
                { name: 'Toronja (Pomelo)', img: 'Toronja.jpg' },
                { name: 'Casis', img: 'Grosella negra.jpg' } 
            ],
            heart: [
                { name: 'Cuero', img: 'Cuero.jpg' },
                { name: 'Durazno', img: 'Durazno (Melocotón).jpg' },
                { name: 'Azafrán', img: 'Azafrán.jpg' }
            ],
            base: [
                { name: 'Vainilla', img: 'Vainilla.jpg' },
                { name: 'Ámbar', img: 'Ámbar.jpg' },
                { name: 'Almizcle', img: 'Almizcle.jpg' },
                { name: 'Vetiver', img: 'Vetiver.jpg' }
            ]
        }
    },
    {
        file: 'mayar-cherry.html',
        pyramid: {
            top: [
                { name: 'Fresa', img: 'Fresa.jpg' },
                { name: 'Bergamota', img: 'Bergamota.jpg' }
            ],
            heart: [
                { name: 'Mermelada de cereza', img: 'Cereza.jpg' },
                { name: 'Cacao', img: 'Cacao.jpg' }
            ],
            base: [
                { name: 'Vainilla', img: 'Vainilla.jpg' },
                { name: 'Ámbar', img: 'Ámbar.jpg' },
                { name: 'Pachulí', img: 'Pachulí.jpg' }
            ]
        }
    },
    {
        file: 'odyssey-aqua.html',
        pyramid: {
            top: [
                { name: 'Naranja', img: 'Naranja.jpg' },
                { name: 'Toronja', img: 'Toronja.jpg' },
                { name: 'Artemisa', img: 'Artemisa.jpg' }
            ],
            heart: [
                { name: 'Menta', img: 'Menta.jpg' },
                { name: 'Lavanda', img: 'Lavanda.jpg' }
            ],
            base: [
                { name: 'Ambroxan', img: 'Ambroxan.jpg' },
                { name: 'Ciprés', img: 'Ciprés.jpg' },
                { name: 'Pachulí', img: 'Pachulí.jpg' }
            ]
        }
    },
    {
        file: 'odyssey-homme-white.html',
        pyramid: {
            top: [
                { name: 'Pimienta Rosa', img: 'Pimienta rosa.jpg' },
                { name: 'Cardamomo', img: 'Cardamomo.jpg' },
                { name: 'Menta', img: 'Menta.jpg' }
            ],
            heart: [
                { name: 'Notas Acuáticas', img: 'Agua.jpg' },
                { name: 'Piña', img: 'Piña.jpg' },
                { name: 'Salvia', img: 'Salvia.jpg' }
            ],
            base: [
                { name: 'Madera de Ámbar', img: 'Madera de Ámbar.jpg' },
                { name: 'Vainilla', img: 'Vainilla.jpg' },
                { name: 'Cedro', img: 'Cedro.jpg' }
            ]
        }
    },
    {
        file: 'the-kingdom.html',
        pyramid: {
            top: [
                { name: 'Lavanda', img: 'Lavanda.jpg' },
                { name: 'Menta', img: 'Menta.jpg' },
                { name: 'Salvia', img: 'Salvia.jpg' }
            ],
            heart: [
                { name: 'Vainilla', img: 'Vainilla.jpg' },
                { name: 'Tabaco', img: 'Tabaco.jpg' },
                { name: 'Flor de Azahar', img: 'Azahar.jpg' }
            ],
            base: [
                { name: 'Haba Tonka', img: 'Haba Tonka.jpg' },
                { name: 'Benjuí', img: 'Benjuí.jpg' },
                { name: 'Ládano', img: 'Ládano.jpg' }
            ]
        }
    }
];

perfumes.forEach(p => {
    let htmlContent = fs.readFileSync(p.file, 'utf8');
    
    const buildSection = (title, notes) => {
        let str = `                    <div class="pyramid-section">\n                        <div class="pyramid-header"><span>${title}</span></div>\n                        <div class="pyramid-grid">\n`;
        notes.forEach(note => {
            str += `                            <div class="ingredient-item">\n                                <div class="ingredient-icon"><img src="Imagenes_Notas_Olfativas/${note.img}" alt="${note.name}"></div>\n                                <span class="ingredient-name">${note.name}</span>\n                            </div>\n`;
        });
        str += `                        </div>\n                    </div>\n`;
        return str;
    };
    
    const newVisualNotes = `<div class="visual-notes">\n` + 
        buildSection('NOTAS DE SALIDA', p.pyramid.top) +
        buildSection('CORAZÓN', p.pyramid.heart) +
        buildSection('BASE', p.pyramid.base) + 
        `                </div>`;

    const regex = /<div class="visual-notes">[\s\S]*?<\/div>\s*<div class="accords-container">/;
    const newContent = htmlContent.replace(regex, newVisualNotes + '\n                <div class="accords-container">');
    
    fs.writeFileSync(p.file, newContent, 'utf8');
    console.log('Updated ' + p.file);
});
