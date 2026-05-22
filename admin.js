class AdminPanel {
    constructor() {
        this.container = document.getElementById('orders-container');
        this.init();
    }

    async init() {
        try {
            await this.checkAuth();
            await this.loadOrders();
        } catch (err) {
            console.error('Init error:', err);
            if (this.container && this.container.innerHTML.includes('Cargando')) {
                this.container.innerHTML = `<p style="text-align: center; color: #eb5757;">Error de conexión. Asegurate de tener sesión iniciada.</p>`;
            }
        }
    }

    async checkAuth() {
        if (!window.supabase) throw new Error('Supabase no cargado');
        
        let session = null;
        try {
            const { data } = await window.supabase.auth.getSession();
            session = data?.session;
        } catch (err) {
            console.error('Error getting session:', err);
            // Continuar para mostrar el mensaje de acceso denegado
        }
        
        // Check if logged in and email matches the admin email
        if (!session || session.user.email !== 'olediferente@gmail.com') {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <i data-lucide="lock" style="width: 48px; height: 48px; margin-bottom: 15px; color: #eb5757;"></i>
                    <h2 style="color: #eb5757; margin-bottom: 10px;">Acceso Denegado</h2>
                    <p style="color: var(--text-secondary);">Esta página es exclusiva para el administrador. Por favor, inicia sesión con el correo de la empresa (olediferente@gmail.com).</p>
                    <button class="btn-auth" style="margin-top: 20px; width: auto;" onclick="window.location.href='cuenta.html'">Ir a Iniciar Sesión</button>
                </div>
            `;
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
        } catch (err) {
            console.error('Error rejecting order:', err);
            alert('Error al rechazar el pedido.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
