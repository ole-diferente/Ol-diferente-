/**
 * OLÉ DIFERENTE - Web Components
 * Inyecta dinámicamente el Header y Footer para mejorar la mantenibilidad.
 */

class WebComponents {
    constructor() {
        this.init();
    }

    init() {
        this.renderHeader();
        this.renderFooter();
        this.setupTheme();
        this.setupMobileMenu();
        this.setupAuthListener();
        this.updateUserAuthStatus();
        this.initScrollEffects();
        this.setupCustomCursor();
    }

    setupTheme() {
        const html = document.documentElement;
        const themeToggleBtn = document.getElementById('theme-toggle');
        if (!themeToggleBtn) return;

        let currentTheme = localStorage.getItem('theme') || 'dark';

        // Apply initial theme
        html.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        lucide.createIcons();

        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            
            // Animate icon change
            this.updateThemeIcon(currentTheme);
            lucide.createIcons();
        });
    }

    updateThemeIcon(theme) {
        const themeToggleBtn = document.getElementById('theme-toggle');
        if (!themeToggleBtn) return;
        const iconName = theme === 'dark' ? 'sun' : 'moon';
        themeToggleBtn.innerHTML = `<i data-lucide="${iconName}" id="theme-icon"></i>`;
    }

    renderHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        header.innerHTML = `
            <div class="logo">
                <a href="index.html">
                    <img src="logo.png" alt="OLÉ DIFERENTE Logo" class="logo-img">
                </a>
            </div>
            <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                <i data-lucide="menu"></i>
            </div>
            <nav id="main-nav">
                <a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">INICIO</a>
                <div class="dropdown">
                    <a href="#">MENÚ</a>
                    <div class="dropdown-content">
                        <div class="has-submenu">
                            <a href="#">Fragancias</a>
                            <div class="submenu">
                                <a href="tienda.html?cat=masculinas">Masculinas</a>
                                <a href="tienda.html?cat=femeninas">Femeninas</a>
                            </div>
                        </div>
                        <a href="tienda.html?cat=body-splash">Body Splash</a>
                        <div class="has-submenu">
                            <a href="#">Decants</a>
                            <div class="submenu">
                                <a href="tienda.html?cat=decants">10 ml</a>
                                <a href="tienda.html?cat=decants">5 ml</a>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="tienda.html" class="${currentPage === 'tienda.html' ? 'active' : ''}">TIENDA</a>
                <a href="index.html#quiz-perfume">TU PERFUME IDEAL</a>
                <a href="#">OFERTAS</a>
                <a href="contacto.html" class="${currentPage === 'contacto.html' ? 'active' : ''}">CONTACTO</a>
            </nav>
            <div class="actions">
                <button id="theme-toggle" aria-label="Toggle Theme">
                    <i data-lucide="moon" id="theme-icon"></i>
                </button>
                <button aria-label="Mi Cuenta" id="account-btn" onclick="window.location.href='cuenta.html'">
                    <i data-lucide="user"></i>
                </button>
                <button aria-label="Cart" id="cart-open-btn" style="position: relative;">
                    <i data-lucide="shopping-bag"></i>
                    <span class="cart-badge" style="display: none;">0</span>
                </button>
            </div>
        `;

        // Style adjustments for active link
        const style = document.createElement('style');
        style.textContent = `
            nav a.active { color: var(--accent-color) !important; font-weight: 600; }
            .mobile-menu-toggle { 
                display: none; 
                cursor: pointer; 
                color: var(--text-primary); 
                font-size: 2rem;
                padding: 10px;
                z-index: 2100;
            }
            @media (max-width: 1024px) {
                .mobile-menu-toggle { display: block; }
                nav#main-nav {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 100%; /* Full width on mobile */
                    height: 100vh;
                    background: var(--card-bg);
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 2000;
                    opacity: 0;
                    visibility: hidden;
                }
                nav#main-nav.active { 
                    right: 0; 
                    opacity: 1;
                    visibility: visible;
                }
                nav#main-nav a { font-size: 1.8rem; margin: 1rem 0; }
                .dropdown-content { display: none !important; } /* Hide complicated menus on mobile */
            }
            .quiz-section {
                padding: 120px 20px;
                background: var(--bg-text-brand);
                position: relative;
                display: block;
                width: 100%;
                z-index: 2;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                margin-bottom: 200px; /* Even more margin */
                clear: both;
            }
            footer { 
                padding: 100px 20px 60px; 
                text-align: center; 
                border-top: 1px solid var(--border-color); 
                margin-top: 100px;
                display: block;
                position: relative;
                width: 100%;
                clear: both;
            }
            .footer-social { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }
            .footer-social a { color: var(--text-primary); opacity: 0.7; transition: 0.3s; }
            .footer-social a:hover { color: var(--accent-color); opacity: 1; transform: translateY(-3px); }
        `;
        document.head.appendChild(style);
    }

    renderFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        footer.innerHTML = `
            <div class="footer-content" style="padding: 40px 0;">
                <h2 class="motivational-text" style="margin-bottom: 15px;">Despierta tus sentidos con las mejores fragancias</h2>
                <p class="slogan" style="margin-bottom: 25px;">Perfumes originales - By Luis Álvarez</p>
                <p style="margin-top: 30px; font-size: 0.8rem; opacity: 0.5;">© 2026 Olé Diferente. Todos los derechos reservados.</p>
            </div>
        `;
        lucide.createIcons();
    }

    setupMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const nav = document.getElementById('main-nav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                const icon = toggle.querySelector('i');
                if (nav.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            });
        }
    }

    setupAuthListener() {
        if (window.supabase) {
            window.supabase.auth.onAuthStateChange(() => {
                this.updateUserAuthStatus();
            });
        }
    }

    async updateUserAuthStatus() {
        const accountBtn = document.getElementById('account-btn');
        if (!accountBtn || !window.supabase) return;

        const { data: { session } } = await window.supabase.auth.getSession();

        if (session) {
            const { data: profile } = await window.supabase
                .from('profiles')
                .select('nombre, avatar_url')
                .eq('id', session.user.id)
                .single();

            const nombre = profile?.nombre || 'Usuario';
            const avatar = profile?.avatar_url || 'avatar_1.png';
            const avatarPath = avatar.startsWith('http') || avatar.startsWith('avatars/') ? avatar : `avatars/${avatar}`;

            accountBtn.classList.add('user-profile-btn');
            accountBtn.innerHTML = `
                <img src="${avatarPath}" alt="${nombre}" class="user-avatar-header">
                <span class="user-greeting-header">Hola, ${nombre}</span>
            `;
        } else {
            accountBtn.classList.remove('user-profile-btn');
            accountBtn.innerHTML = `<i data-lucide="user"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    initScrollEffects() {
        // --- Revelación suave (Fade-in) ---
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observar elementos existentes y futuros (si se inyectan dinámicamente)
        const observeElements = () => {
            const elementsToReveal = document.querySelectorAll('.reveal:not(.revealed)');
            elementsToReveal.forEach(el => revealObserver.observe(el));
        };

        observeElements();
        
        // Ejecutar de nuevo tras un pequeño delay por si hay inyecciones
        setTimeout(observeElements, 500);
    }

    setupCustomCursor() {
        // No ejecutar en dispositivos móviles o tablets
        if (window.matchMedia("(max-width: 1024px)").matches) return;

        // Inyectar Estilos dinámicamente
        const style = document.createElement('style');
        style.textContent = `
            body { cursor: none; }
            a, button, input, select, textarea, .product-card, .btn-saber-mas, .avatar-option, .avatar-option-dash, .size-btn, .add-to-cart-btn {
                cursor: none !important;
            }
            #cursor-punto, #cursor-aura {
                position: fixed;
                top: 0; left: 0;
                pointer-events: none; 
                transform: translate(-50%, -50%);
                border-radius: 50%;
                z-index: 999999;
                transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                            height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                            background-color 0.3s ease, 
                            border-color 0.3s ease, 
                            opacity 0.3s ease;
            }
            #cursor-punto {
                width: 8px; height: 8px;
                background-color: var(--accent-color, #D4AF37);
                box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
            }
            #cursor-aura {
                width: 40px; height: 40px;
                border: 1px solid var(--accent-color, #D4AF37);
                opacity: 0.6;
            }
            .aura-expandida {
                width: 70px !important;
                height: 70px !important;
                background-color: rgba(212, 175, 55, 0.15);
                border-color: rgba(212, 175, 55, 0.3) !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);

        // Inyectar elementos del cursor
        const punto = document.createElement('div');
        punto.id = 'cursor-punto';
        const aura = document.createElement('div');
        aura.id = 'cursor-aura';
        document.body.appendChild(punto);
        document.body.appendChild(aura);

        // Movimiento del cursor
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            
            // El punto sigue al mouse al instante
            punto.style.left = `${clientX}px`;
            punto.style.top = `${clientY}px`;

            // El aura sigue con un retraso de 40ms para el efecto fluido
            setTimeout(() => {
                aura.style.left = `${clientX}px`;
                aura.style.top = `${clientY}px`;
            }, 40);
        });

        // Efecto de expansión en elementos interactivos
        const setupInteractions = () => {
            const targets = document.querySelectorAll('a, button, .product-card, .btn-saber-mas, .avatar-option, .avatar-option-dash, input, select, .size-btn, .add-to-cart-btn, .ingredient-item');
            targets.forEach(el => {
                // Evitar duplicar listeners
                if (el.dataset.cursorBound) return;
                el.dataset.cursorBound = "true";

                el.addEventListener('mouseenter', () => aura.classList.add('aura-expandida'));
                el.addEventListener('mouseleave', () => aura.classList.remove('aura-expandida'));
            });
        };

        setupInteractions();

        // Observar cambios en el DOM para nuevos elementos (como productos cargados dinámicamente)
        const domObserver = new MutationObserver(() => setupInteractions());
        domObserver.observe(document.body, { childList: true, subtree: true });

        // Ocultar cursor al salir de la ventana
        document.addEventListener('mouseleave', () => {
            punto.style.opacity = '0';
            aura.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            punto.style.opacity = '1';
            aura.style.opacity = '1';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.WebComponentsInstance = new WebComponents();
});
