class AdminPanel {
    constructor() {
        this.container = document.getElementById('orders-container');
        this.init();
    }

    async init() {
        await this.checkAuth();
        await this.loadOrders();
    }

    async checkAuth() {
        if (!window.supabase) return;
        const { data: { session } } = await window.supabase.auth.getSession();
        
        // Simple security: just ensure they are logged in. In a real app, check role.
        if (!session) {
            this.container.innerHTML = '<p style="text-align: center; color: #eb5757;">Acceso denegado. Debes iniciar sesión.</p>';
            throw new Error('No autorizado');
        }
    }

    async loadOrders() {
        try {
            const { data: orders, error } = await window.supabase
                .from('orders')
                .select('*')
                .eq('status', 'pendiente')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.renderOrders(orders);
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
                    <p>No hay pedidos pendientes.</p>
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

            const cardHTML = `
                <div class="order-card" id="order-${order.id}">
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
                            <button class="btn-approve" onclick="adminPanel.approveOrder('${order.id}')">Aprobar y Descontar Stock</button>
                            <button class="btn-reject" onclick="adminPanel.rejectOrder('${order.id}')">Rechazar</button>
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
            document.getElementById(`order-${orderId}`).remove();
            
            // Check if empty
            if (this.container.children.length === 0) {
                this.loadOrders();
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
            
            document.getElementById(`order-${orderId}`).remove();
            
            // Check if empty
            if (this.container.children.length === 0) {
                this.loadOrders();
            }
        } catch (err) {
            console.error('Error rejecting order:', err);
            alert('Error al rechazar el pedido.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
