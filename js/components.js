/**
 * OLÉ DIFERENTE - Web Components
 * Inyecta dinámicamente el Header y Footer para mejorar la mantenibilidad.
 */

class WebComponents {
    constructor() {
        const isSubPage = window.location.pathname.includes('/productos/') || window.location.pathname.split('/').slice(-2)[0] === 'productos';
        this.basePath = isSubPage ? '../' : '';
        this.adminNotificationInterval = null;
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
                if (product && product.stock === 0) {
                    this.markAsOutOfStock(card, true);
                    this.markAsPreorder(card, false);
                } else if (product && product.stock < 0) {
                    this.markAsOutOfStock(card, false);
                    this.markAsPreorder(card, true);
                } else if (product && product.stock > 0) {
                    this.markAsOutOfStock(card, false);
                    this.markAsPreorder(card, false);
                }
            });

            // Apply out of stock to product detail pages
            const detailTitle = document.querySelector('.detail-title');
            if (detailTitle) {
                const name = detailTitle.textContent.trim();
                const product = inventory.find(p => p.name === name);
                const detailContainer = document.querySelector('.product-detail-container');
                if (product && product.stock === 0 && detailContainer) {
                    this.markAsOutOfStock(detailContainer, true);
                    this.markAsPreorder(detailContainer, false);
                } else if (product && product.stock < 0 && detailContainer) {
                    this.markAsOutOfStock(detailContainer, false);
                    this.markAsPreorder(detailContainer, true);
                } else if (product && product.stock > 0 && detailContainer) {
                    this.markAsOutOfStock(detailContainer, false);
                    this.markAsPreorder(detailContainer, false);
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
                    btn.textContent = window.location.pathname.includes('.html') && !window.location.pathname.includes('tienda.html') ? 'AGREGAR AL CARRITO' : 'Agregar al carrito';
                }
            });
        }
    }

    markAsPreorder(container, isPreorder) {
        if (isPreorder) {
            container.classList.add('is-preorder');
            
            // Add badge if it doesn't exist
            const imgContainer = container.querySelector('.product-image-container, .product-detail-image-wrapper');
            if (imgContainer && !imgContainer.querySelector('.preorder-badge')) {
                imgContainer.insertAdjacentHTML('afterbegin', '<div class="preorder-badge">Por Encargue</div>');
            }
            
            // If it's the detail page, add the preorder warning below the image
            const isDetailPage = container.classList.contains('product-detail-container');
            if (isDetailPage && !container.querySelector('.preorder-warning')) {
                const infoContainer = container.querySelector('.product-detail-info');
                if (infoContainer) {
                    infoContainer.insertAdjacentHTML('afterbegin', '<div class="preorder-warning" style="background: rgba(243, 156, 18, 0.1); border: 1px solid #f39c12; color: #f39c12; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; text-align: center;"><strong>Importante:</strong> Este perfume se trae por encargue. Se requiere abonar una seña del 50% del valor total por adelantado para confirmar el pedido.</div>');
                }
            }
        } else {
            container.classList.remove('is-preorder');
            const badge = container.querySelector('.preorder-badge');
            if (badge) badge.remove();
            
            const warning = container.querySelector('.preorder-warning');
            if (warning) warning.remove();
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
                <a href="${this.basePath}index.html">
                    <img src="${this.basePath}assets/logo.png" alt="OLÉ DIFERENTE Logo" class="logo-img">
                </a>
            </div>
            <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                <i data-lucide="menu"></i>
            </div>
            <nav id="main-nav">
                <a href="${this.basePath}index.html" class="${currentPage === 'index.html' ? 'active' : ''}">INICIO</a>
                <div class="dropdown">
                    <a href="#">MENÚ</a>
                    <div class="dropdown-content">
                        <div class="has-submenu">
                            <a href="#">Fragancias</a>
                            <div class="submenu">
                                <a href="${this.basePath}tienda.html?cat=masculinas">Masculinas</a>
                                <a href="${this.basePath}tienda.html?cat=femeninas">Femeninas</a>
                            </div>
                        </div>
                        <a href="${this.basePath}tienda.html?cat=body-splash">Body Splash</a>
                    </div>
                </div>
                <a href="${this.basePath}tienda.html" class="${currentPage === 'tienda.html' ? 'active' : ''}">TIENDA</a>
                <a href="${this.basePath}index.html#quiz-perfume">TU PERFUME IDEAL</a>
                <a href="${this.basePath}famosos.html" class="${currentPage === 'famosos.html' ? 'active' : ''}">FAMOSOS</a>
                <a href="${this.basePath}resenas.html" class="${currentPage === 'resenas.html' ? 'active' : ''}">RESEÑAS</a>
                <a href="${this.basePath}contacto.html" class="${currentPage === 'contacto.html' ? 'active' : ''}">CONTACTO</a>
            </nav>
            <div class="actions">
                <button id="theme-toggle" aria-label="Toggle Theme">
                    <i data-lucide="moon" id="theme-icon"></i>
                </button>
                <button aria-label="Mi Cuenta" id="account-btn" onclick="window.location.href='${this.basePath}cuenta.html'">
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

            /* Admin Notification Badge Styles */
            .admin-badge {
                position: absolute;
                top: -6px;
                right: -6px;
                background: linear-gradient(135deg, #ff4b2b, #ff416c) !important; /* Vibrant modern red gradient */
                color: #ffffff !important;
                font-family: 'Inter', sans-serif !important;
                font-size: 9px !important;
                font-weight: 800 !important;
                min-width: 17px !important;
                height: 17px !important;
                border-radius: 9px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 4px !important;
                box-shadow: 0 0 10px rgba(255, 75, 43, 0.4) !important;
                border: 1.5px solid var(--bg-color, #0f0f0f) !important;
                transition: all 0.3s ease !important;
                animation: badgeBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                z-index: 10 !important;
            }

            @keyframes badgeBounce {
                0% { transform: scale(0); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }

            .admin-badge.hidden {
                display: none !important;
            }
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

        if (session) {
            const { data: profile } = await window.supabase
                .from('profiles')
                .select('nombre, avatar_url')
                .eq('id', session.user.id)
                .single();

            const nombre = profile?.nombre || 'Usuario';
            const avatar = profile?.avatar_url || 'avatar_1.png';
            const avatarPath = avatar.startsWith('http') ? avatar : (avatar.startsWith('avatars/') ? `${this.basePath}${avatar}` : `${this.basePath}avatars/${avatar}`);

            accountBtn.classList.add('user-profile-btn');
            accountBtn.innerHTML = `
                <img src="${avatarPath}" alt="${nombre}" class="user-avatar-header">
                <span class="user-greeting-header">Hola, ${nombre}</span>
            `;

            // If user is admin, add an admin panel button next to the account button
            if (session.user.email === 'olediferente@gmail.com') {
                // Remove any existing shield to prevent duplicates from concurrent calls
                const existingAdminBtn = document.getElementById('admin-link-btn');
                if (existingAdminBtn) existingAdminBtn.remove();

                const adminBtn = document.createElement('button');
                adminBtn.id = 'admin-link-btn';
                adminBtn.setAttribute('aria-label', 'Panel Admin');
                adminBtn.setAttribute('title', 'Panel de Administración');
                adminBtn.style.color = 'var(--accent-color)';
                adminBtn.style.position = 'relative'; // context for absolute positioned badge
                adminBtn.innerHTML = `
                    <i data-lucide="shield-check"></i>
                    <span class="admin-badge hidden" id="admin-badge">0</span>
                `;
                adminBtn.onclick = () => window.location.href = this.basePath + 'admin.html';
                
                // Insert right before the account button
                accountBtn.parentNode.insertBefore(adminBtn, accountBtn);
                if (typeof lucide !== 'undefined') lucide.createIcons();

                // Initial notifications check
                this.updateAdminNotificationsBadge();

                // Periodic refresh every 60 seconds
                if (this.adminNotificationInterval) clearInterval(this.adminNotificationInterval);
                this.adminNotificationInterval = setInterval(() => {
                    this.updateAdminNotificationsBadge();
                }, 60000);
            }

        } else {
            // Remove admin button if logged out
            const existingAdminBtn = document.getElementById('admin-link-btn');
            if (existingAdminBtn) existingAdminBtn.remove();

            // Clear refresh interval
            if (this.adminNotificationInterval) {
                clearInterval(this.adminNotificationInterval);
                this.adminNotificationInterval = null;
            }

            accountBtn.classList.remove('user-profile-btn');
            accountBtn.innerHTML = `<i data-lucide="user"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    async updateAdminNotificationsBadge() {
        if (!window.supabase) return;
        
        try {
            // Ensure session is valid and is admin
            const { data: { session } } = await window.supabase.auth.getSession();
            if (!session || session.user.email !== 'olediferente@gmail.com') return;

            // Fetch count of unread messages from contact_messages
            const { count: unreadMessages, error: msgError } = await window.supabase
                .from('contact_messages')
                .select('*', { count: 'exact', head: true })
                .eq('leido', false);

            if (msgError) {
                console.warn('Error querying contact_messages for badge:', msgError);
            }

            // Fetch count of pending orders from orders
            const { count: pendingOrders, error: orderError } = await window.supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pendiente');

            if (orderError) {
                console.warn('Error querying orders for badge:', orderError);
            }

            const totalNotifications = (unreadMessages || 0) + (pendingOrders || 0);
            
            const badge = document.getElementById('admin-badge');
            if (badge) {
                if (totalNotifications > 0) {
                    badge.textContent = totalNotifications > 99 ? '99+' : totalNotifications;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        } catch (err) {
            console.error('Error updating admin notification badge:', err);
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
            #cursor-punto {
                position: fixed;
                top: 0; left: 0;
                pointer-events: none; 
                z-index: 999999;
                width: 24px;
                height: 24px;
                background: transparent;
                transform: translate(0, 0); /* La punta del cursor coincide exactamente con la posición */
                transition: opacity 0.3s ease, transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                will-change: transform, opacity;
            }
            
            /* Partículas de fragancia/estela */
            .fragrance-particle {
                position: fixed;
                pointer-events: none;
                z-index: 999998;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 240, 165, 0.95) 0%, rgba(212, 175, 55, 0.6) 40%, rgba(212, 175, 55, 0) 80%);
                transform: translate(-50%, -50%);
                will-change: transform, opacity, width, height;
            }
            
            /* Partícula destello brillante */
            .sparkle-particle {
                position: fixed;
                pointer-events: none;
                z-index: 999998;
                width: 6px;
                height: 6px;
                background: #FFF;
                transform: translate(-50%, -50%) rotate(45deg);
                box-shadow: 0 0 4px #D4AF37, 0 0 8px #FFF;
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(style);

        // Inyectar elemento del cursor (solo la flecha dorada)
        const punto = document.createElement('div');
        punto.id = 'cursor-punto';
        
        // Flecha vectorial de lujo SVG con degradado dorado
        punto.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: 100%;">
                <path d="M0 0L16 11.5L8.5 13L12.5 20L10 21.5L6 14.5L2 18.5L0 0Z" fill="url(#goldGrad)" stroke="rgba(0,0,0,0.5)" stroke-width="0.5" stroke-linejoin="round"/>
                <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#FFEFA6" />
                        <stop offset="60%" stop-color="#D4AF37" />
                        <stop offset="100%" stop-color="#997510" />
                    </linearGradient>
                </defs>
            </svg>
        `;

        document.body.appendChild(punto);

        // Variables de estado
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovered = false;
        const particles = [];
        const maxParticles = 60; // Límite de seguridad para FPS estables

        // Movimiento del cursor
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Puntero de flecha sigue al instante
            punto.style.left = `${mouseX}px`;
            punto.style.top = `${mouseY}px`;
            
            // Mostrar si estaba oculto
            if (punto.style.opacity === '0') {
                punto.style.opacity = '1';
            }
        });

        // Animación suave con requestAnimationFrame
        const tick = () => {
            // Movimiento suavizado de referencia elástica para el cálculo de estela
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;

            // Generar partículas de estela en movimiento
            const speed = Math.hypot(mouseX - currentX, mouseY - currentY);
            if (speed > 1.2 && particles.length < maxParticles) {
                if (Math.random() < 0.35) {
                    createParticle(mouseX, mouseY, false);
                }
            }

            // Actualizar posiciones y opacidad
            updateParticles();

            requestAnimationFrame(tick);
        };

        // Crear partícula individual
        const createParticle = (x, y, isClick = false) => {
            const p = document.createElement('div');
            const isSparkle = !isClick && Math.random() < 0.25; // 25% son destellos dorados
            
            p.className = isSparkle ? 'sparkle-particle' : 'fragrance-particle';
            
            // Tamaño inicial aleatorio
            let size = isSparkle ? 4 : (Math.random() * 6 + 4);
            if (isClick) {
                size = Math.random() * 7 + 5; // Más variadas en clic
            }
            
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            
            // Física del rocío / estela
            const angle = isClick ? (Math.random() * Math.PI * 2) : (Math.random() * Math.PI * 2);
            let speed = isClick ? (Math.random() * 2.8 + 1.2) : (Math.random() * 0.6 + 0.2);
            
            const vx = Math.cos(angle) * speed;
            // Elevación suave de partículas normales (efecto calor/evaporación)
            const vy = isClick ? (Math.sin(angle) * speed) : (Math.sin(angle) * speed - 0.35); 

            const particleObj = {
                element: p,
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                alpha: 1.0,
                size: size,
                decay: isClick ? (Math.random() * 0.025 + 0.015) : (Math.random() * 0.018 + 0.008),
                isSparkle: isSparkle,
                isClick: isClick
            };

            document.body.appendChild(p);
            particles.push(particleObj);
        };

        // Renderizar y limpiar partículas
        const updateParticles = () => {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                
                // Las burbujas de fragancia se expanden ligeramente al evaporarse
                if (!p.isSparkle) {
                    p.size += p.isClick ? 0.12 : 0.06;
                    p.element.style.width = `${p.size}px`;
                    p.element.style.height = `${p.size}px`;
                }
                
                p.element.style.left = `${p.x}px`;
                p.element.style.top = `${p.y}px`;
                p.element.style.opacity = p.alpha;
                
                if (p.isSparkle) {
                    p.element.style.transform = `translate(-50%, -50%) rotate(${p.x * 1.5}deg)`;
                }

                if (p.alpha <= 0) {
                    p.element.remove();
                    particles.splice(i, 1);
                }
            }
        };

        // Efecto de Pulverización/Atomización al hacer clic
        window.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Sólo clic izquierdo
            
            // Feedback físico en la flecha
            punto.style.transform = 'scale(0.82)';
            
            // Generar ráfaga circular de micropartículas
            const burstCount = Math.floor(Math.random() * 6 + 12);
            for (let i = 0; i < burstCount; i++) {
                createParticle(e.clientX, e.clientY, true);
            }
        });

        window.addEventListener('mouseup', () => {
            punto.style.transform = 'scale(1)';
        });

        // Efecto de escala leve al pasar por encima de elementos interactivos
        const setupInteractions = () => {
            const targets = document.querySelectorAll('a, button, .product-card, .btn-saber-mas, .avatar-option, .avatar-option-dash, input, select, textarea, .size-btn, .add-to-cart-btn, .ingredient-item, .footer-social a');
            targets.forEach(el => {
                if (el.dataset.cursorBound) return;
                el.dataset.cursorBound = "true";

                el.addEventListener('mouseenter', () => {
                    isHovered = true;
                    punto.style.transform = 'scale(1.15)';
                });
                
                el.addEventListener('mouseleave', () => {
                    isHovered = false;
                    punto.style.transform = 'scale(1)';
                });
            });
        };

        setupInteractions();

        // Observador DOM para manejar elementos inyectados dinámicamente
        const domObserver = new MutationObserver(() => setupInteractions());
        domObserver.observe(document.body, { childList: true, subtree: true });

        // Controlar cuando el mouse sale de la ventana del navegador
        document.addEventListener('mouseleave', () => {
            punto.style.opacity = '0';
            particles.forEach(p => p.element.remove());
            particles.length = 0;
        });
        
        document.addEventListener('mouseenter', () => {
            punto.style.opacity = '1';
        });

        // Iniciar bucle de animación
        tick();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.WebComponentsInstance = new WebComponents();
});
