const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'cart.js');
let text = fs.readFileSync(p, 'utf-8');

// 1. Inject Checkout Modal HTML
const drawerHTML = `
            const drawerHTML = \`
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
            \`;
            
            const checkoutModalHTML = \`
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
            \`;
            document.body.insertAdjacentHTML('beforeend', drawerHTML);
            document.body.insertAdjacentHTML('beforeend', checkoutModalHTML);
`;

text = text.replace(/const drawerHTML = `[\s\S]*?`;\s*document\.body\.insertAdjacentHTML\('beforeend', drawerHTML\);/, drawerHTML);


// 2. Checkout WhatsApp Method replacement
const newCheckoutMethod = `
    openCheckoutModal() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        this.closeCart();
        document.querySelector('.checkout-modal').classList.add('active');
        document.querySelector('.checkout-modal-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.updateCheckoutTotals();
    }

    closeCheckoutModal() {
        document.querySelector('.checkout-modal').classList.remove('active');
        document.querySelector('.checkout-modal-overlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    calculateShippingCost(cpStr) {
        if (!cpStr || cpStr.length < 4) return 0;
        const cp = parseInt(cpStr.replace(/\D/g, ''), 10);
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
            shipping = this.calculateShippingCost(cp);
            document.querySelector('#shipping-cost-row').style.display = 'flex';
            const quoteText = document.querySelector('.shipping-quote-text');
            if (shipping > 0) {
                quoteText.innerText = "Costo de envío: $" + this.formatPrice(shipping);
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

            shippingCost = this.calculateShippingCost(cp);
            shippingData = { cp, name, dni, prov, loc, calle, depto };
        }

        const total = subtotal + shippingCost;

        // Construir Mensaje de WhatsApp
        let message = "¡Hola! Quisiera realizar un pedido en Olé Diferente:\\n\\n";
        message += "*--- RESUMEN DEL PEDIDO ---*\\n";
        
        this.items.forEach((item, index) => {
            const subt = item.price * item.quantity;
            message += \`\${index + 1}. *\${item.name}* (\${item.variant})\\n\`;
            message += \`   Cantidad: \${item.quantity} x $\${this.formatPrice(item.price)}\\n\`;
            message += \`   Subtotal: $\${this.formatPrice(subt)}\\n\\n\`;
        });

        message += \`*Subtotal de Productos: $\${this.formatPrice(subtotal)}*\\n\\n\`;
        message += "*--- DATOS DE ENTREGA ---*\\n";

        if (method === 'envio') {
            message += "Tipo: *Envío a Domicilio (Correo Argentino)*\\n";
            message += \`Costo de Envío: $\${this.formatPrice(shippingCost)}\\n\\n\`;
            message += "*Datos para la Etiqueta:*\\n";
            message += \`- Nombre: \${shippingData.name}\\n\`;
            message += \`- DNI: \${shippingData.dni}\\n\`;
            message += \`- Provincia: \${shippingData.prov}\\n\`;
            message += \`- Localidad: \${shippingData.loc}\\n\`;
            message += \`- Código Postal: \${shippingData.cp}\\n\`;
            message += \`- Dirección: \${shippingData.calle} \${shippingData.depto ? '(Depto: ' + shippingData.depto + ')' : ''}\\n\\n\`;
        } else {
            message += "Tipo: *Retiro en Persona (A acordar)*\\n\\n";
        }

        message += \`*TOTAL A PAGAR: $\${this.formatPrice(total)}*\\n\\n\`;
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
        const whatsappUrl = \`https://wa.me/\${phoneNumber}?text=\${encodedMessage}\`;
        
        window.open(whatsappUrl, '_blank');

        // Limpiar carrito después de la compra
        this.items = [];
        this.saveAndRefresh();
        this.closeCheckoutModal();
    }
`;

text = text.replace(/async checkoutWhatsApp\(\) \{[\s\S]*?this\.closeCart\(\);\s*\}/, newCheckoutMethod);

// 3. Update Events Bindings
text = text.replace(
    /document\.querySelector\('\.checkout-btn'\)\?\.addEventListener\('click', \(\) => \{\s*this\.checkoutWhatsApp\(\);\s*\}\);/,
    `document.querySelector('.checkout-btn')?.addEventListener('click', () => {
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
        });`
);

fs.writeFileSync(p, text);
console.log("Checkout implemented successfully.");
