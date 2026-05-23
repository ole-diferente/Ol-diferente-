class AdminPanel {
    constructor() {
        this.container = document.getElementById('orders-container');
        this.ordersContainer = document.getElementById('orders-container');
        this.messagesContainer = document.getElementById('messages-container');
        this.pageTitle = document.getElementById('admin-page-title');
        this.init();
    }

    async init() {
        try {
            await this.checkAuth();
            await Promise.all([
                this.loadOrders(),
                this.loadMessages()
            ]);
        } catch (err) {
            console.error('Init error:', err);
            if (this.container && this.container.innerHTML.includes('Cargando')) {
                this.container.innerHTML = `<p style="text-align: center; color: #eb5757;">Error de conexión. Asegurate de tener sesión iniciada.</p>`;
            }
        }
    }

    switchTab(tabName, element) {
        // Desactivar todos los botones de pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        // Activar el seleccionado
        element.classList.add('active');

        // Ocultar todas las secciones
        document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
        // Mostrar la seleccionada
        document.getElementById(`${tabName}-section`)?.classList.add('active');

        // Actualizar título
        if (this.pageTitle) {
            this.pageTitle.textContent = tabName === 'orders' ? 'Pedidos Recientes' : 'Mensajes de Contacto';
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    async checkAuth() {
        if (!window.supabase) throw new Error('Supabase no cargado');
        
        let session = null;
        try {
            const { data } = await window.supabase.auth.getSession();
            session = data?.session;
        } catch (err) {
            console.error('Error getting session:', err);
        }
        
        // Check if logged in and email matches the admin email
        if (!session || session.user.email !== 'olediferente@gmail.com') {
            const ordersSection = document.getElementById('orders-section');
            if (ordersSection) {
                ordersSection.innerHTML = `
                    <div style="text-align: center; padding: 50px;">
                        <i data-lucide="lock" style="width: 48px; height: 48px; margin-bottom: 15px; color: #eb5757;"></i>
                        <h2 style="color: #eb5757; margin-bottom: 10px;">Acceso Denegado</h2>
                        <p style="color: var(--text-secondary);">Esta página es exclusiva para el administrador. Por favor, inicia sesión con el correo de la empresa (olediferente@gmail.com).</p>
                        <button class="btn-auth" style="margin-top: 20px; width: auto;" onclick="window.location.href='cuenta.html'">Ir a Iniciar Sesión</button>
                    </div>
                `;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
            throw new Error('No autorizado');
        }
    }

    async loadOrders() {
        try {
            // Fetch pending and up to 10 processed orders
            const { data: orders, error } = await window.supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50); // Get recent 50 to ensure we have pending ones + some history

            if (error) throw error;
            
            // Filter: keep all 'pendiente', and only max 10 of others
            const pending = orders.filter(o => o.status === 'pendiente');
            const processed = orders.filter(o => o.status !== 'pendiente').slice(0, 10);
            
            const displayOrders = [...pending, ...processed].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            this.renderOrders(displayOrders);
        } catch (err) {
            console.error('Error loading orders:', err);
            this.container.innerHTML = '<p style="text-align: center; color: #eb5757;">Error al cargar pedidos.</p>';
        }
    }

    renderOrders(orders) {
        if (!orders || orders.length === 0) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: var(--text-secondary);">
                    <i data-lucide="check-circle" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                    <p>No hay pedidos recientes.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        this.container.innerHTML = '';

        orders.forEach(order => {
            const date = new Date(order.created_at).toLocaleString('es-AR');
            
            let itemsHTML = '';
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="order-item">
                        <span>${item.quantity}x ${item.name} (${item.variant})</span>
                        <span>$${item.price.toLocaleString('es-AR')}</span>
                    </div>
                `;
            });

            const isPending = order.status === 'pendiente';
            const opacityStyle = isPending ? '' : 'opacity: 0.5; filter: grayscale(100%); pointer-events: none;';
            
            let actionButtons = '';
            if (isPending) {
                actionButtons = `
                    <button class="btn-approve" onclick="adminPanel.approveOrder('${order.id}')">Aprobar y Descontar Stock</button>
                    <button class="btn-reject" onclick="adminPanel.rejectOrder('${order.id}')">Rechazar</button>
                `;
            } else {
                const statusColor = order.status === 'aprobado' ? '#27ae60' : '#eb5757';
                actionButtons = `
                    <span style="color: ${statusColor}; font-weight: bold; border: 1px solid ${statusColor}; padding: 5px 15px; border-radius: 8px;">
                        ${order.status.toUpperCase()}
                    </span>
                `;
            }

            const cardHTML = `
                <div class="order-card" id="order-${order.id}" style="${opacityStyle}">
                    <div class="order-header">
                        <div>
                            <span class="order-id">Pedido #${order.id.slice(0,8)}</span>
                            <div class="order-date">${date}</div>
                        </div>
                    </div>
                    <div class="order-items">
                        ${itemsHTML}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                        <div>
                            ${actionButtons}
                        </div>
                        <div class="order-total">
                            Total: $${order.total.toLocaleString('es-AR')}
                        </div>
                    </div>
                </div>
            `;
            this.container.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    async approveOrder(orderId) {
        if (!confirm('¿Estás seguro de aprobar este pedido? Se descontará el stock de los productos correspondientes.')) return;

        try {
            // 1. Get the order details to know what items to deduct
            const { data: order, error: orderError } = await window.supabase
                .from('orders')
                .select('items')
                .eq('id', orderId)
                .single();
                
            if (orderError) throw orderError;

            // 2. Deduct stock for each item (only for full bottles, ignoring decants for now if needed, but let's deduct 1 for simplicity if it matches the name)
            for (const item of order.items) {
                // Fetch current stock
                const { data: inventory, error: invError } = await window.supabase
                    .from('inventory')
                    .select('stock')
                    .eq('name', item.name)
                    .single();
                    
                if (invError) {
                    console.warn('Producto no encontrado en inventario:', item.name);
                    continue;
                }
                
                // If variant is 100 ml / Estándar, deduct 1
                if (item.variant.includes('100') || item.variant === 'Estándar') {
                    const newStock = Math.max(0, inventory.stock - item.quantity);
                    
                    const { error: updateError } = await window.supabase
                        .from('inventory')
                        .update({ stock: newStock })
                        .eq('name', item.name);
                        
                    if (updateError) throw updateError;
                }
            }

            // 3. Mark order as approved
            const { error: statusError } = await window.supabase
                .from('orders')
                .update({ status: 'aprobado' })
                .eq('id', orderId);

            if (statusError) throw statusError;

            alert('Pedido aprobado y stock descontado exitosamente.');
            this.loadOrders();
            if (window.WebComponentsInstance && typeof window.WebComponentsInstance.updateAdminNotificationsBadge === 'function') {
                window.WebComponentsInstance.updateAdminNotificationsBadge();
            }

        } catch (err) {
            console.error('Error approving order:', err);
            alert('Error al aprobar el pedido.');
        }
    }

    async rejectOrder(orderId) {
        if (!confirm('¿Rechazar este pedido? (No descontará stock)')) return;

        try {
            const { error } = await window.supabase
                .from('orders')
                .update({ status: 'rechazado' })
                .eq('id', orderId);

            if (error) throw error;
            
            this.loadOrders();
            if (window.WebComponentsInstance && typeof window.WebComponentsInstance.updateAdminNotificationsBadge === 'function') {
                window.WebComponentsInstance.updateAdminNotificationsBadge();
            }
        } catch (err) {
            console.error('Error rejecting order:', err);
            alert('Error al rechazar el pedido.');
        }
    }

    async loadMessages() {
        try {
            if (!this.messagesContainer) return;
            
            const { data: messages, error } = await window.supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.renderMessages(messages);
        } catch (err) {
            console.error('Error loading messages:', err);
            if (this.messagesContainer) {
                this.messagesContainer.innerHTML = '<p style="text-align: center; color: #eb5757;">Error al cargar los mensajes.</p>';
            }
        }
    }

    renderMessages(messages) {
        if (!this.messagesContainer) return;

        if (!messages || messages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; color: var(--text-secondary);">
                    <i data-lucide="mail-open" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                    <p>No tenés mensajes de contacto recibidos.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        this.messagesContainer.innerHTML = '';

        messages.forEach(msg => {
            const date = new Date(msg.created_at).toLocaleString('es-AR');
            
            let asuntoAmigable = 'Consulta General';
            if (msg.asunto === 'perfumes') asuntoAmigable = 'Consulta sobre Perfumes';
            else if (msg.asunto === 'decants') asuntoAmigable = 'Información sobre Decants';
            else if (msg.asunto === 'pedido') asuntoAmigable = 'Estado de Pedido / Envíos';
            else if (msg.asunto === 'mayorista') asuntoAmigable = 'Ventas por Mayor / Otros';

            const isUnread = !msg.leido;
            const cardClass = isUnread ? 'message-card unread' : 'message-card';
            const unreadBadge = isUnread ? '<span class="unread-badge">Nuevo</span>' : '';
            const readBtnText = isUnread ? 'Marcar como leído' : 'Marcar como no leído';
            const readBtnIcon = isUnread ? 'check-square' : 'mail';

            // WhatsApp Reply text
            let waButton = '';
            if (msg.whatsapp) {
                // Normalize whatsapp number (remove spaces, symbols)
                let cleanPhone = msg.whatsapp.replace(/[^0-9]/g, '');
                // Add country code if not present (Argentina is 54)
                if (cleanPhone.length === 10 && (cleanPhone.startsWith('11') || cleanPhone.startsWith('15') || cleanPhone.startsWith('2') || cleanPhone.startsWith('3'))) {
                    cleanPhone = '549' + cleanPhone;
                } else if (cleanPhone.length === 11 && cleanPhone.startsWith('9')) {
                    cleanPhone = '54' + cleanPhone;
                }
                const waText = encodeURIComponent(`Hola ${msg.nombre}, te contactamos de Olé Diferente por tu consulta sobre "${asuntoAmigable}": `);
                const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
                waButton = `
                    <a href="${waUrl}" target="_blank" class="btn-action btn-reply-wa">
                        <i data-lucide="message-circle"></i>
                        <span>WhatsApp</span>
                    </a>
                `;
            }

            const mailText = encodeURIComponent(`\n\n---\nConsulta original de ${msg.nombre}:\n"${msg.mensaje}"`);
            const mailUrl = `mailto:${msg.email}?subject=${encodeURIComponent('RE: Olé Diferente - ' + asuntoAmigable)}&body=${mailText}`;

            const cardHTML = `
                <div class="${cardClass}" id="message-${msg.id}">
                    <div class="message-header">
                        <div class="message-meta">
                            <h3>${msg.nombre} ${unreadBadge}</h3>
                            <div class="message-info">
                                <a href="mailto:${msg.email}">
                                    <i data-lucide="mail" style="width: 14px; height: 14px;"></i>
                                    <span>${msg.email}</span>
                                </a>
                                ${msg.whatsapp ? `
                                    <a href="tel:${msg.whatsapp}">
                                        <i data-lucide="phone" style="width: 14px; height: 14px;"></i>
                                        <span>${msg.whatsapp}</span>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                        <div class="message-date">${date}</div>
                    </div>
                    <span class="message-subject">${asuntoAmigable}</span>
                    <div class="message-body">${msg.mensaje}</div>
                    <div class="message-actions">
                        ${waButton}
                        <a href="${mailUrl}" class="btn-action">
                            <i data-lucide="mail"></i>
                            <span>Responder por Email</span>
                        </a>
                        <button class="btn-action read-toggle" onclick="adminPanel.toggleMessageRead('${msg.id}', ${msg.leido})">
                            <i data-lucide="${readBtnIcon}"></i>
                            <span>${readBtnText}</span>
                        </button>
                        <button class="btn-action btn-delete" onclick="adminPanel.deleteMessage('${msg.id}')">
                            <i data-lucide="trash-2"></i>
                            <span>Eliminar</span>
                        </button>
                    </div>
                </div>
            `;
            this.messagesContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    async toggleMessageRead(messageId, currentLeido) {
        try {
            const { error } = await window.supabase
                .from('contact_messages')
                .update({ leido: !currentLeido })
                .eq('id', messageId);

            if (error) throw error;
            this.loadMessages();
            if (window.WebComponentsInstance && typeof window.WebComponentsInstance.updateAdminNotificationsBadge === 'function') {
                window.WebComponentsInstance.updateAdminNotificationsBadge();
            }
        } catch (err) {
            console.error('Error updating read status:', err);
            alert('Error al actualizar el estado del mensaje.');
        }
    }

    async deleteMessage(messageId) {
        if (!confirm('¿Estás seguro de eliminar este mensaje permanentemente?')) return;

        try {
            const { error } = await window.supabase
                .from('contact_messages')
                .delete()
                .eq('id', messageId);

            if (error) throw error;
            this.loadMessages();
            if (window.WebComponentsInstance && typeof window.WebComponentsInstance.updateAdminNotificationsBadge === 'function') {
                window.WebComponentsInstance.updateAdminNotificationsBadge();
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            alert('Error al eliminar el mensaje.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
