/**
 * quiz.js - Lógica del Recomendador Inteligente
 */

const preguntas = [
    {
        pregunta: "¿En qué momento del día imaginas usando esta fragancia?",
        opciones: [
            { texto: "Para el día a día y la oficina", perfil: "fresco" },
            { texto: "Para la noche y citas especiales", perfil: "intenso" },
            { texto: "Para eventos formales y elegantes", perfil: "elegante" }
        ]
    },
    {
        pregunta: "¿Qué notas olfativas llaman más tu atención?",
        opciones: [
            { texto: "Cítricos, acuáticos y frescura marina", perfil: "fresco" },
            { texto: "Oud, especias potentes y maderas oscuras", perfil: "intenso" },
            { texto: "Vainilla dulce, ámbar y flores sofisticadas", perfil: "elegante" }
        ]
    },
    {
        pregunta: "¿Cómo describirías la impresión que quieres dejar?",
        opciones: [
            { texto: "Energética, limpia y radiante", perfil: "fresco" },
            { texto: "Misteriosa, seductora y audaz", perfil: "intenso" },
            { texto: "Refinada, exclusiva y con clase", perfil: "elegante" }
        ]
    }
];

const catalogo = [
    {
        nombre: "Lattafa Asad",
        descripcion: "Una fragancia árabe intensa con notas de pimienta negra, tabaco y vainilla. Perfecta para dejar huella.",
        perfil: "intenso",
        link: "lattafa-asad.html"
    },
    {
        nombre: "Lattafa Khamrah",
        descripcion: "Dulzor opulento con canela, dátiles y praliné. Una joya para las noches frías y ocasiones especiales.",
        perfil: "intenso",
        link: "khamrah-dukhan.html"
    },
    {
        nombre: "Afnan 9 PM",
        descripcion: "Energía nocturna con manzana, canela y vainilla. El compañero ideal para salidas y fiestas.",
        perfil: "intenso",
        link: "afnan-9pm.html"
    },
    {
        nombre: "Lattafa Atlas",
        descripcion: "Frescura marina extrema con notas de sal, algas y cítricos. Ideal para días calurosos y un aura limpia.",
        perfil: "fresco",
        link: "lattafa-atlas.html"
    },
    {
        nombre: "Afnan Turathi Blue",
        descripcion: "Cítricos vibrantes y maderas suaves. Una fragancia versátil, fresca y sumamente masculina.",
        perfil: "fresco",
        link: "turathi-blue.html"
    },
    {
        nombre: "VS Aqua Kiss",
        descripcion: "Body splash fresco con notas de fresia y margarita. Ligero, acuático y refrescante para el diario.",
        perfil: "fresco",
        link: "aqua-kiss.html"
    },
    {
        nombre: "Armaf Club de Nuit",
        descripcion: "El rey de la elegancia. Limón, piña y maderas ahumadas. Un aroma sofisticado que impone respeto.",
        perfil: "elegante",
        link: "club-de-nuit.html"
    },
    {
        nombre: "VS Bare Vanilla",
        descripcion: "Vainilla batida y cachemira. Una fragancia acogedora, dulce y sumamente elegante para mujer.",
        perfil: "elegante",
        link: "bare-vanilla.html"
    },
    {
        nombre: "Lattafa Pride Vintage Radio",
        descripcion: "Una mezcla única de maderas y notas aromáticas que evocan distinción y un estilo clásico moderno.",
        perfil: "elegante",
        link: "vintage-radio.html"
    }
];

let preguntaActual = 0;
let puntajes = { fresco: 0, intenso: 0, elegante: 0 };

// Elementos del DOM
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizResults = document.getElementById('quiz-results');
const recommendationCards = document.getElementById('recommendation-cards');
const quizHeader = document.getElementById('quiz-header');

function iniciarQuiz() {
    preguntaActual = 0;
    puntajes = { fresco: 0, intenso: 0, elegante: 0 };
    if (quizResults) quizResults.classList.add('hidden');
    if (questionContainer) questionContainer.classList.remove('hidden');
    if (quizHeader) quizHeader.classList.remove('hidden');
    mostrarPregunta();
}

function mostrarPregunta() {
    if (!questionContainer || !questionText || !optionsContainer) return;

    // Resetear animación
    questionContainer.classList.remove('fade-in');
    void questionContainer.offsetWidth; // Trigger reflow
    questionContainer.classList.add('fade-in');

    const pregunta = preguntas[preguntaActual];
    questionText.textContent = pregunta.pregunta;
    optionsContainer.innerHTML = '';

    pregunta.opciones.forEach(opcion => {
        const boton = document.createElement('button');
        boton.className = 'quiz-btn';
        boton.textContent = opcion.texto;
        boton.onclick = () => registrarRespuesta(opcion.perfil);
        optionsContainer.appendChild(boton);
    });
}

function registrarRespuesta(perfil) {
    puntajes[perfil]++;
    preguntaActual++;

    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
}

function mostrarResultados() {
    if (!questionContainer || !quizHeader || !quizResults || !recommendationCards) return;

    questionContainer.classList.add('hidden');
    quizHeader.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    // Calcular el perfil ganador
    const perfilGanador = Object.keys(puntajes).reduce((a, b) => puntajes[a] > puntajes[b] ? a : b);

    // Filtrar catálogo por el perfil ganador y barajar para mostrar solo 3
    const recomendaciones = catalogo
        .filter(perfume => perfume.perfil === perfilGanador)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    // Renderizar resultados
    recommendationCards.innerHTML = '';
    recomendaciones.forEach(perfume => {
        const card = document.createElement('a');
        card.href = perfume.link;
        card.className = 'perfume-card fade-in';
        card.innerHTML = `
            <h4>${perfume.nombre}</h4>
            <p>${perfume.descripcion}</p>
            <span class="btn-ver">Ver Detalles <i data-lucide="arrow-right" style="width:14px; height:14px; vertical-align: middle;"></i></span>
        `;
        recommendationCards.appendChild(card);
    });
    
    // Crear iconos de Lucide si están disponibles
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página que tiene el quiz, lo iniciamos
    if (document.getElementById('quiz-container')) {
        iniciarQuiz();
    }
});
