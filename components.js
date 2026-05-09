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
                <a href="#">LOS MÁS PEDIDOS</a>
                <a href="#">OFERTAS</a>
                <a href="#">CONTACTO</a>
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
            .mobile-menu-toggle { display: none; cursor: pointer; color: var(--text-primary); }
            @media (max-width: 1024px) {
                .mobile-menu-toggle { display: block; z-index: 2001; }
                nav#main-nav {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 80%;
                    height: 100vh;
                    background: var(--card-bg);
                    backdrop-filter: blur(20px);
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 2000;
                    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
                }
                nav#main-nav.active { right: 0; }
                nav#main-nav a { font-size: 1.5rem; margin: 1rem 0; }
                .dropdown-content { position: static; box-shadow: none; background: transparent; padding: 0; text-align: center; display: none; }
                .dropdown:hover .dropdown-content { display: block; }
            }
        `;
        document.head.appendChild(style);
    }

    renderFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        footer.innerHTML = `
            <h2 class="motivational-text">Despierta tus sentidos con las mejores fragancias</h2>
            <p class="slogan">Perfumes originales - By Luis Álvarez</p>
        `;
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
}

document.addEventListener('DOMContentLoaded', () => {
    new WebComponents();
});
