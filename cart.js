/**
 * OLÉ DIFERENTE - Sistema de Carrito de Compras
 * Maneja la lógica de agregar productos, persistencia en localStorage e interfaz de usuario.
 */

class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('ole_cart')) || [];
        this.init();
    }

    init() {
        this.injectCartHTML();
        this.bindEvents();
        this.updateUI();
    }

    injectCartHTML() {
        // Inyectar el Drawer del Carrito si no existe
        if (!document.querySelector('.cart-drawer')) {
            
            const drawerHTML = `
                <div class="cart-overlay"></div>
                <div class="cart-drawer">
                    <div class="cart-header">
                        <h2>Tu Carrito</h2>
                        <button class="close-cart"><i data-lucide="x"></i></button>
                    </div>
                    <div class="cart-items-container">
                        <!-- Items se cargarán dinámicamente -->
                    </div>
                    <div class="cart-footer">
                        <div class="cart-total-row">
                            <span class="cart-total-label">Subtotal</span>
                            <span class="cart-total-value">$0</span>
                        </div>
                        <button class="checkout-btn">FINALIZAR COMPRA</button>
                    </div>
                </div>
            `;
            
            const checkoutModalHTML = `
                <div class="checkout-modal-overlay"></div>
                <div class="checkout-modal">
                    <div class="checkout-header">
                        <h2>Detalles de Entrega</h2>
                        <button class="close-checkout"><i data-lucide="x"></i></button>
                    </div>
                    <div class="checkout-body">
                        <div class="delivery-methods">
                            <label class="delivery-option">
                                <input type="radio" name="delivery-method" value="retiro" checked>
                                <div class="delivery-details">
                                    <span class="delivery-title">Retiro en persona</span>
                                    <span class="delivery-desc">Acordar con el vendedor (Gratis)</span>
                                </div>
                            </label>
                            <label class="delivery-option">
                                <input type="radio" name="delivery-method" value="envio">
                                <div class="delivery-details">
                                    <span class="delivery-title">Envío a Domicilio</span>
                                    <span class="delivery-desc">Por Correo Argentino</span>
                                </div>
                            </label>
                        </div>

                        <div class="shipping-form" style="display: none;">
                            <div class="form-group">
                                <label>Código Postal</label>
                                <input type="text" id="shipping-cp" placeholder="Ej: 1425" maxlength="8">
                                <small class="shipping-quote-text" style="color: var(--accent-color); font-weight: bold;"></small>
                            </div>
                            <div class="form-group">
                                <label>Nombre Completo</label>
                                <input type="text" id="shipping-name" placeholder="Juan Pérez">
                            </div>
                            <div class="form-group">
                                <label>DNI</label>
                                <input type="text" id="shipping-dni" placeholder="Sin puntos">
                            </div>
                            <div class="form-group">
                                <label>Provincia</label>
                                <input type="text" id="shipping-provincia">
                            </div>
                            <div class="form-group">
                                <label>Localidad</label>
                                <input type="text" id="shipping-localidad">
                            </div>
                            <div class="form-group">
                                <label>Dirección (Calle y Altura)</label>
                                <input type="text" id="shipping-calle">
                            </div>
                            <div class="form-group">
                                <label>Piso / Depto (Opcional)</label>
                                <input type="text" id="shipping-depto">
                            </div>
                        </div>

                        <div class="checkout-summary">
                            <div class="summary-row">
                                <span>Subtotal:</span>
                                <span class="summary-subtotal">$0</span>
                            </div>
                            <div class="summary-row" id="shipping-cost-row" style="display:none;">
                                <span>Envío:</span>
                                <span class="summary-shipping">$0</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total a Pagar:</span>
                                <span class="summary-total">$0</span>
                            </div>
                        </div>
                    </div>
                    <div class="checkout-footer">
                        <button class="confirm-order-btn">Enviar Pedido por WhatsApp</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', drawerHTML);
            document.body.insertAdjacentHTML('beforeend', checkoutModalHTML);

        }

    }

    bindEvents() {
        // Event delegation for opening the cart
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cart-open-btn') || e.target.closest('.actions button[aria-label="Cart"]')) {
                this.openCart();
            }
        });

        // Cerrar carrito
        document.querySelector('.close-cart')?.addEventListener('click', () => this.closeCart());
        document.querySelector('.cart-overlay')?.addEventListener('click', () => this.closeCart());

        // Botones de "Agregar al Carrito"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                this.handleAddToCart(e.target);
            }
        });

        // Controles dentro del carrito (Quitar, +/- cantidad)
        const container = document.querySelector('.cart-items-container');
        container?.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.cart-item');
            if (!itemElement) return;
            
            const index = parseInt(itemElement.dataset.index);

            if (e.target.closest('.remove-item')) {
                this.removeItem(index);
            } else if (e.target.closest('.plus-qty')) {
                this.updateQuantity(index, 1);
            } else if (e.target.closest('.minus-qty')) {
                this.updateQuantity(index, -1);
            }
        });

        // Finalizar Compra
        document.querySelector('.checkout-btn')?.addEventListener('click', () => {
            this.openCheckoutModal();
        });

        document.querySelector('.close-checkout')?.addEventListener('click', () => this.closeCheckoutModal());
        document.querySelector('.checkout-modal-overlay')?.addEventListener('click', () => this.closeCheckoutModal());

        document.querySelectorAll('input[name="delivery-method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'envio') {
                    document.querySelector('.shipping-form').style.display = 'block';
                } else {
                    document.querySelector('.shipping-form').style.display = 'none';
                }
                this.updateCheckoutTotals();
            });
        });

        document.querySelector('#shipping-cp')?.addEventListener('input', () => {
            this.updateCheckoutTotals();
        });

        document.querySelector('.confirm-order-btn')?.addEventListener('click', () => {
            this.confirmAndSendOrder();
        });
    }

    
    async openCheckoutModal() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        this.closeCart();
        document.querySelector('.checkout-modal').classList.add('active');
        document.querySelector('.checkout-modal-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.updateCheckoutTotals();

        // Autocompletar datos si el usuario está logueado
        try {
            if (window.supabase) {
                const { data: { session } } = await window.supabase.auth.getSession();
                if (session) {
                    const { data: profile } = await window.supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profile) {
                        const nameInput = document.querySelector('#shipping-name');
                        const fullName = [profile.nombre, profile.apellido].filter(Boolean).join(' ');
                        if (fullName && !nameInput.value) nameInput.value = fullName;
                        
                        const dniInput = document.querySelector('#shipping-dni');
                        if (profile.dni && !dniInput.value) dniInput.value = profile.dni;
                        
                        const cpInput = document.querySelector('#shipping-cp');
                        if (profile.cp && !cpInput.value) {
                            cpInput.value = profile.cp;
                            this.updateCheckoutTotals();
                        }
                        
                        const provInput = document.querySelector('#shipping-provincia');
                        if (profile.provincia && !provInput.value) provInput.value = profile.provincia;
                        
                        const locInput = document.querySelector('#shipping-localidad');
                        if (profile.localidad && !locInput.value) locInput.value = profile.localidad;
                        
                        const calleInput = document.querySelector('#shipping-calle');
                        if (profile.direccion && !calleInput.value) calleInput.value = profile.direccion;
                    }
                }
            }
        } catch (error) {
            console.error("Error autocompletando datos:", error);
        }
    }

    closeCheckoutModal() {
        document.querySelector('.checkout-modal').classList.remove('active');
        document.querySelector('.checkout-modal-overlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    calculateShippingCost(cpStr, subtotal = 0) {
        if (!cpStr || cpStr.length < 4) return 0;
        const cp = parseInt(cpStr.replace(/D/g, ''), 10);
        if (isNaN(cp)) return 0;
        
        // Reglas de negocio (Opción 1: Tarifario Interno)
        // CABA / GBA: 1000 - 1999
        if (cp >= 1000 && cp <= 1999) {
            return 4500;
        }
        // Provincia de Buenos Aires (Interior) / Central: 2000 - 3500
        else if (cp >= 2000 && cp <= 3500) {
            return 5500;
        }
        // Resto del País
        else {
            return 7500;
        }
    }

    updateCheckoutTotals() {
        let subtotal = 0;
        this.items.forEach(item => subtotal += item.price * item.quantity);
        
        const method = document.querySelector('input[name="delivery-method"]:checked').value;
        let shipping = 0;
        
        if (method === 'envio') {
            const cp = document.querySelector('#shipping-cp').value;
            shipping = this.calculateShippingCost(cp, subtotal);
            document.querySelector('#shipping-cost-row').style.display = 'flex';
            const quoteText = document.querySelector('.shipping-quote-text');
            if (subtotal >= 150000) {
                quoteText.innerText = "¡Ya tienes envío gratis!";
                quoteText.style.color = "#27ae60";
            } else if (shipping > 0) {
                quoteText.innerText = "Costo de envío: $" + this.formatPrice(shipping) + "\n(Te faltan $" + this.formatPrice(150000 - subtotal) + " para envío gratis)";
                quoteText.style.color = "var(--text-secondary)";
            } else {
                quoteText.innerText = "";
            }
        } else {
            document.querySelector('#shipping-cost-row').style.display = 'none';
        }
        
        document.querySelector('.summary-subtotal').innerText = "$" + this.formatPrice(subtotal);
        document.querySelector('.summary-shipping').innerText = "$" + this.formatPrice(shipping);
        document.querySelector('.summary-total').innerText = "$" + this.formatPrice(subtotal + shipping);
    }

    async confirmAndSendOrder() {
        if (this.items.length === 0) return;

        let subtotal = 0;
        this.items.forEach(item => subtotal += item.price * item.quantity);

        const method = document.querySelector('input[name="delivery-method"]:checked').value;
        let shippingCost = 0;
        let shippingData = {};

        if (method === 'envio') {
            const cp = document.querySelector('#shipping-cp').value.trim();
            const name = document.querySelector('#shipping-name').value.trim();
            const dni = document.querySelector('#shipping-dni').value.trim();
            const prov = document.querySelector('#shipping-provincia').value.trim();
            const loc = document.querySelector('#shipping-localidad').value.trim();
            const calle = document.querySelector('#shipping-calle').value.trim();
            const depto = document.querySelector('#shipping-depto').value.trim();

            if (!cp || !name || !dni || !prov || !loc || !calle) {
                alert("Por favor completá todos los campos obligatorios de envío.");
                return;
            }

            shippingCost = this.calculateShippingCost(cp, subtotal);
            shippingData = { cp, name, dni, prov, loc, calle, depto };
        }

        const total = subtotal + shippingCost;

        // Construir Mensaje de WhatsApp
        let message = "¡Hola! Quisiera realizar un pedido en Olé Diferente:\n\n";
        message += "*--- RESUMEN DEL PEDIDO ---*\n";
        
        this.items.forEach((item, index) => {
            const subt = item.price * item.quantity;
            message += `${index + 1}. *${item.name}* (${item.variant})\n`;
            message += `   Cantidad: ${item.quantity} x ${this.formatPrice(item.price)}\n`;
            message += `   Subtotal: ${this.formatPrice(subt)}\n\n`;
        });

        message += `*Subtotal de Productos: ${this.formatPrice(subtotal)}*\n\n`;
        message += "*--- DATOS DE ENTREGA ---*\n";

        if (method === 'envio') {
            message += "Tipo: *Envío a Domicilio (Correo Argentino)*\n";
            message += `Costo de Envío: ${this.formatPrice(shippingCost)}\n\n`;
            message += "*Datos para la Etiqueta:*\n";
            message += `- Nombre: ${shippingData.name}\n`;
            message += `- DNI: ${shippingData.dni}\n`;
            message += `- Provincia: ${shippingData.prov}\n`;
            message += `- Localidad: ${shippingData.loc}\n`;
            message += `- Código Postal: ${shippingData.cp}\n`;
            message += `- Dirección: ${shippingData.calle} ${shippingData.depto ? '(Depto: ' + shippingData.depto + ')' : ''}\n\n`;
        } else {
            message += "Tipo: *Retiro en Persona (A acordar)*\n\n";
        }

        message += `*TOTAL A PAGAR: ${this.formatPrice(total)}*\n\n`;
        message += "Muchas gracias.";

        // --- Integración con Supabase ---
        const { data: { session } } = await window.supabase.auth.getSession();
        
        if (session) {
            try {
                const { error } = await window.supabase
                    .from('orders')
                    .insert([
                        {
                            user_id: session.user.id,
                            items: this.items,
                            total: total,
                            status: 'pendiente',
                            delivery_method: method,
                            shipping_cost: shippingCost,
                            shipping_data: shippingData
                        }
                    ]);

                if (error) throw error;
                console.log("Pedido guardado en la base de datos.");
            } catch (err) {
                console.error("Error al guardar el pedido:", err);
            }
        } else {
            const confirmAnon = confirm("No has iniciado sesión. Puedes completar el pedido por WhatsApp, pero no quedará guardado en tu historial de 'Mi Cuenta'. ¿Deseas continuar?");
            if (!confirmAnon) {
                window.location.href = 'cuenta.html';
                return;
            }
        }

        const phoneNumber = "5492244462412";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');

        // Limpiar carrito después de la compra
        this.items = [];
        this.saveAndRefresh();
        this.closeCheckoutModal();
    }


    handleAddToCart(button) {
        const productCard = button.closest('.product-card') || button.closest('.product-detail-container');
        if (!productCard) return;

        const name = productCard.querySelector('.product-title')?.innerText || productCard.querySelector('.detail-title')?.innerText;
        const priceStr = productCard.querySelector('.product-price')?.innerText || productCard.querySelector('.detail-price')?.innerText;
        const image = productCard.querySelector('.product-image')?.src || productCard.querySelector('.product-detail-image')?.src;
        const quantity = parseInt(productCard.querySelector('.quantity-selector')?.value || 1);
        
        // Obtener variante (ml / decant)
        const activeSizeBtn = productCard.querySelector('.size-btn.active');
        const variant = activeSizeBtn ? activeSizeBtn.innerText : 'Estándar';

        const price = parseFloat(priceStr.replace('$', '').replace('.', ''));

        this.addItem({
            name,
            price,
            image,
            variant,
            quantity
        });

        // Feedback visual
        const originalText = button.innerText;
        button.innerText = '¡AGREGADO!';
        button.style.background = '#27ae60';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.innerText = originalText;
            button.style.background = '';
            button.style.color = '';
            this.openCart();
        }, 800);
    }

    addItem(product) {
        // Verificar si ya existe el mismo producto con la misma variante
        const existingItemIndex = this.items.findIndex(item => 
            item.name === product.name && item.variant === product.variant
        );

        if (existingItemIndex > -1) {
            this.items[existingItemIndex].quantity += product.quantity;
        } else {
            this.items.push(product);
        }

        this.saveAndRefresh();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveAndRefresh();
    }

    updateQuantity(index, change) {
        this.items[index].quantity += change;
        if (this.items[index].quantity < 1) {
            this.removeItem(index);
        } else {
            this.saveAndRefresh();
        }
    }

    saveAndRefresh() {
        localStorage.setItem('ole_cart', JSON.stringify(this.items));
        this.updateUI();
    }

    updateUI() {
        const container = document.querySelector('.cart-items-container');
        const totalValue = document.querySelector('.cart-total-value');
        const badge = document.querySelector('.cart-badge');
        
        if (!container || !totalValue || !badge) return;

        container.innerHTML = '';
        let total = 0;
        let count = 0;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; color: var(--text-secondary);">
                    <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
        } else {
            this.items.forEach((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;

                const itemHTML = `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <span class="cart-item-name">${item.name}</span>
                            <div class="cart-item-variant">${item.variant}</div>
                            <div class="cart-item-price">$${this.formatPrice(item.price)}</div>
                            <div class="cart-qty-controls">
                                <button class="qty-btn minus-qty">-</button>
                                <span class="cart-item-qty">${item.quantity}</span>
                                <button class="qty-btn plus-qty">+</button>
                            </div>
                        </div>
                        <button class="remove-item" title="Eliminar"><i data-lucide="trash-2"></i></button>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        totalValue.innerText = `$${this.formatPrice(total)}`;
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';

        // Re-inicializar iconos de Lucide para los elementos inyectados
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    openCart() {
        document.querySelector('.cart-drawer').classList.add('active');
        document.querySelector('.cart-overlay').classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll
    }

    closeCart() {
        document.querySelector('.cart-drawer').classList.remove('active');
        document.querySelector('.cart-overlay').classList.remove('active');
        document.body.style.overflow = ''; // Habilitar scroll
    }

    formatPrice(price) {
        return price.toLocaleString('es-AR');
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});
