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
            document.body.insertAdjacentHTML('beforeend', drawerHTML);
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
            if (this.items.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            this.checkoutWhatsApp();
        });
    }

    checkoutWhatsApp() {
        const phoneNumber = "5492244462412"; // Número actualizado
        let total = 0;
        let message = "¡Hola! Quisiera realizar un pedido en Olé Diferente:\n\n";
        
        this.items.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            message += `${index + 1}. *${item.name}* (${item.variant})\n`;
            message += `   Cantidad: ${item.quantity} x $${this.formatPrice(item.price)}\n`;
            message += `   Subtotal: $${this.formatPrice(subtotal)}\n\n`;
        });

        message += `*Total a pagar: $${this.formatPrice(total)}*\n\n`;
        message += "Muchas gracias.";

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
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
