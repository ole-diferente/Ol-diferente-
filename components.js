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
        this.checkInventory();
    }

    async checkInventory() {
        if (!window.supabase) return;
        
        try {
            const { data: inventory, error } = await window.supabase
                .from('inventory')
                .select('name, stock');
                
            if (error) throw error;
            
            // Apply out of stock to product cards in tienda.html
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const name = card.getAttribute('data-name');
                const product = inventory.find(p => p.name === name);
                if (product && product.stock <= 0) {
                    this.markAsOutOfStock(card, true);
                } else if (product && product.stock > 0) {
                    this.markAsOutOfStock(card, false);
                }
            });

            // Apply out of stock to product detail pages
            const detailTitle = document.querySelector('.detail-title');
            if (detailTitle) {
                const name = detailTitle.textContent.trim();
                const product = inventory.find(p => p.name === name);
                const detailContainer = document.querySelector('.product-detail-container');
                if (product && product.stock <= 0 && detailContainer) {
                    this.markAsOutOfStock(detailContainer, true);
                } else if (product && product.stock > 0 && detailContainer) {
                    this.markAsOutOfStock(detailContainer, false);
                }
            }
            
        } catch (err) {
            console.error('Error fetching inventory:', err);
        }
    }

    markAsOutOfStock(container, isOut) {
        if (isOut) {
            container.classList.add('out-of-stock');
            
            // Add badge if it doesn't exist
            const imgContainer = container.querySelector('.product-image-container, .product-detail-image-wrapper');
            if (imgContainer && !imgContainer.querySelector('.out-of-stock-badge')) {
                imgContainer.insertAdjacentHTML('afterbegin', '<div class="out-of-stock-badge">Sin Stock</div>');
            }
            
            // Disable buttons and inputs
            const buttons = container.querySelectorAll('.size-btn, .add-to-cart-btn, .quantity-selector');
            buttons.forEach(btn => {
                btn.disabled = true;
                if (btn.classList.contains('add-to-cart-btn')) {
                    btn.textContent = 'Sin Stock';
                }
            });
        } else {
            container.classList.remove('out-of-stock');
            const badge = container.querySelector('.out-of-stock-badge');
            if (badge) badge.remove();
            
            const buttons = container.querySelectorAll('.size-btn, .add-to-cart-btn, .quantity-selector');
            buttons.forEach(btn => {
                btn.disabled = false;
                if (btn.classList.contains('add-to-cart-btn')) {
                    // Check if it's mobile to set uppercase or not, or just set it
                    btn.textContent = window.location.pathname.includes('.html') && !window.location.pathname.includes('tienda.html') ? 'AGREGAR AL CARRITO' : 'Agregar al carrito';
                }
            });
        }
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

        const path = window.location.pathname;
        let currentPage = path.split('/').pop() || 'index.html';
        
        // Ajuste para GitHub Pages (cuando la URL termina en el nombre del repo o raíz)
        if (currentPage === 'Ol-diferente-' || currentPage === 'Ol-diferente-/' || !currentPage) {
            currentPage = 'index.html';
        }
        
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
                        <!-- <div class="has-submenu">
                            <a href="#">Decants</a>
                            <div class="submenu">
                                <a href="tienda.html?cat=decants">10 ml</a>
                                <a href="tienda.html?cat=decants">5 ml</a>
                            </div>
                        </div> -->
                    </div>
                </div>
                <a href="tienda.html" class="${currentPage === 'tienda.html' ? 'active' : ''}">TIENDA</a>
                <a href="index.html#quiz-perfume">TU PERFUME IDEAL</a>
                <a href="famosos.html" class="${currentPage === 'famosos.html' ? 'active' : ''}">FAMOSOS</a>
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
                    width: 100%;
                    height: 100vh;
                    background: rgba(10, 17, 40, 0.98);
                    backdrop-filter: blur(25px);
                    display: flex !important;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding: 100px 40px;
                    transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 2000;
                    opacity: 0;
                    visibility: hidden;
                    overflow-y: auto;
                }
                nav#main-nav.active { 
                    right: 0; 
                    opacity: 1;
                    visibility: visible;
                }
                nav#main-nav a { 
                    font-size: 1.1rem; 
                    margin: 12px 0; 
                    width: auto;
                    text-align: left;
                    font-weight: 300;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: var(--text-primary);
                    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                    padding-bottom: 8px;
                    display: block;
                }
                
                nav#main-nav a.active {
                    color: var(--accent-color);
                    border-bottom-color: var(--accent-color);
                }

                /* Mobile Dropdown Adjustments */
                .dropdown { width: 100%; }
                .dropdown-content { 
                    position: static !important;
                    transform: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    border: none !important;
                    display: none;
                    width: 100%;
                    padding: 10px 0 10px 20px !important;
                    text-align: left;
                }
                .dropdown.active .dropdown-content {
                    display: block !important;
                }
                .dropdown-content a {
                    font-size: 0.9rem !important;
                    opacity: 0.7;
                    margin: 8px 0 !important;
                    text-transform: capitalize;
                    letter-spacing: 1px;
                    border-bottom: none;
                }
                .has-submenu { width: 100%; }
                .has-submenu .submenu {
                    position: static !important;
                    display: none;
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 5px 0 5px 20px !important;
                }
                .has-submenu.active .submenu {
                    display: block !important;
                }
                .has-submenu > a::after {
                    right: 0 !important;
                    font-size: 1.2rem;
                    opacity: 0.5;
                    transition: transform 0.3s ease;
                }
                .has-submenu.active > a::after {
                    transform: translateY(-50%) rotate(90deg);
                }
            }
            .quiz-section {
                padding: 120px 20px;
                background: var(--bg-text-brand);
                position: relative;
                display: block;
                width: 100%;
                z-index: 2;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                margin-bottom: 200px;
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
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                nav.classList.toggle('active');
                const icon = toggle.querySelector('i');
                if (nav.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                    document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                    document.body.style.overflow = '';
                }
                lucide.createIcons();
            });

            // Handle dropdowns on mobile
            const dropdowns = nav.querySelectorAll('.dropdown, .has-submenu');
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        e.stopPropagation();
                        dropdown.classList.toggle('active');
                    }
                });
            });

            // Close menu when clicking a direct link
            const navLinks = nav.querySelectorAll('a:not([href="#"])');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                    const icon = toggle.querySelector('i');
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('active') && !nav.contains(e.target) && !toggle.contains(e.target)) {
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                    const icon = toggle.querySelector('i');
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
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

        // Check if there's an existing admin btn and remove it to prevent duplicates
        const existingAdminBtn = document.getElementById('admin-link-btn');
        if (existingAdminBtn) existingAdminBtn.remove();

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

            // If user is admin, add an admin panel button next to the account button
            if (session.user.email === 'olediferente@gmail.com') {
                const adminBtn = document.createElement('button');
                adminBtn.id = 'admin-link-btn';
                adminBtn.setAttribute('aria-label', 'Panel Admin');
                adminBtn.setAttribute('title', 'Panel de Administración');
                adminBtn.style.color = 'var(--accent-color)';
                adminBtn.innerHTML = `<i data-lucide="shield-check"></i>`;
                adminBtn.onclick = () => window.location.href = 'admin.html';
                
                // Insert right before the account button
                accountBtn.parentNode.insertBefore(adminBtn, accountBtn);
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

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
