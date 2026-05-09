/**
 * cuenta.js
 * Lógica para el sistema de inicio de sesión, registro y perfiles usando Supabase.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // --- Referencias a Elementos del DOM ---
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const profileSection = document.getElementById('profile-section');
    const authSection = document.getElementById('auth-section');

    const toRegisterLink = document.getElementById('to-register');
    const toLoginLink = document.getElementById('to-login');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    const loginError = document.getElementById('login-error');
    const regError = document.getElementById('reg-error');

    // Dashboard Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Forms
    const formDatos = document.getElementById('form-datos');
    const formDomicilio = document.getElementById('form-domicilio');
    const datosSuccess = document.getElementById('datos-success');
    const domSuccess = document.getElementById('dom-success');

    // Perfil Header
    const profileEmailDisplay = document.getElementById('profile-email');
    const profileAvatarDisplay = document.getElementById('profile-avatar');

    // Avatar Selection
    let selectedAvatar = 'avatar_1.png'; // Default
    const avatarOptions = document.querySelectorAll('.avatar-option');

    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedAvatar = option.dataset.avatar;
            // Limpiar selección de custom si existe
            document.getElementById('trigger-upload-reg').classList.remove('active');
        });
    });

    // Custom Avatar Upload (Registration)
    const regCustomInput = document.getElementById('reg-custom-avatar');
    const triggerUploadReg = document.getElementById('trigger-upload-reg');

    triggerUploadReg.addEventListener('click', () => regCustomInput.click());

    regCustomInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Mostrar preview/feedback
        triggerUploadReg.classList.add('active');
        avatarOptions.forEach(opt => opt.classList.remove('active'));
        
        const reader = new FileReader();
        reader.onload = (e) => {
            triggerUploadReg.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
        
        // El upload real se hará al momento del registro o se puede hacer ahora
        // Para simplificar, lo haremos al momento del submit si hay un archivo seleccionado
    });

    // Custom Avatar Upload (Dashboard)
    const dashCustomInput = document.getElementById('dash-custom-avatar');
    const triggerUploadDash = document.getElementById('trigger-upload-dash');

    if (triggerUploadDash) {
        triggerUploadDash.addEventListener('click', () => dashCustomInput.click());
    }

    if (dashCustomInput) {
        dashCustomInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const user = (await window.supabase.auth.getUser()).data.user;
            if (!user) return;

            await uploadAndUpdateAvatar(file, user.id);
        });
    }

    async function uploadAndUpdateAvatar(file, userId) {
        const avatarWrapper = document.querySelector('.avatar-wrapper');
        avatarWrapper.classList.add('avatar-uploading');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await window.supabase.storage
                .from('user-avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = window.supabase.storage
                .from('user-avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await window.supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            // Actualizar UI
            profileAvatarDisplay.src = publicUrl;
            // También actualizar header si WebComponents está disponible
            if (window.WebComponentsInstance) {
                window.WebComponentsInstance.updateUserAuthStatus();
            } else {
                location.reload(); // Fallback
            }

        } catch (error) {
            console.error("Error subiendo avatar:", error);
            alert("No se pudo subir la imagen. Asegúrate de que el bucket 'user-avatars' sea público en Supabase.");
        } finally {
            avatarWrapper.classList.remove('avatar-uploading');
        }
    }

    // --- Navegación por Pestañas ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const target = btn.dataset.target;
            document.getElementById(target).classList.add('active');
        });
    });

    // --- Lógica de Autenticación con Supabase ---

    // Verificar estado inicial
    checkAuthState();

    // Escuchar cambios en la autenticación
    window.supabase.auth.onAuthStateChange((event, session) => {
        console.log("Cambio de Auth:", event, session);
        checkAuthState();
    });

    // Alternar formularios
    toRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
        clearErrors();
    });

    toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
        clearErrors();
    });

    // --- Handler de Registro ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        if (email === '' || password === '') {
            regError.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            regError.textContent = error.message;
            return;
        }

        if (data.user) {
            let finalAvatar = selectedAvatar;

            // Si hay un archivo custom seleccionado en el registro
            const customFile = regCustomInput.files[0];
            if (customFile) {
                try {
                    const fileExt = customFile.name.split('.').pop();
                    const fileName = `${data.user.id}-${Math.random()}.${fileExt}`;
                    
                    const { error: uploadError } = await window.supabase.storage
                        .from('user-avatars')
                        .upload(fileName, customFile);
                    
                    if (!uploadError) {
                        const { data: { publicUrl } } = window.supabase.storage
                            .from('user-avatars')
                            .getPublicUrl(fileName);
                        finalAvatar = publicUrl;
                    }
                } catch (err) {
                    console.error("Error subiendo avatar en registro:", err);
                }
            }

            // Crear el perfil inicial en la tabla 'profiles'
            const { error: profileError } = await window.supabase
                .from('profiles')
                .insert([
                    { 
                        id: data.user.id, 
                        email: email, 
                        avatar_url: finalAvatar 
                    }
                ]);

            if (profileError) {
                console.error("Error creando perfil:", profileError);
            }
            
            alert("¡Registro exitoso! Por favor, revisa tu correo para confirmar la cuenta (si está habilitado) o inicia sesión.");
            toLoginLink.click();
        }
    });

    // --- Handler de Inicio de Sesión ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            loginError.textContent = "Credenciales inválidas o correo no confirmado.";
            return;
        }

        // checkAuthState() se disparará por el listener onAuthStateChange
    });

    // --- Handler de Cierre de Sesión ---
    logoutBtn.addEventListener('click', async () => {
        await window.supabase.auth.signOut();
    });

    // --- Handlers de Formularios de Perfil ---
    formDatos.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = (await window.supabase.auth.getUser()).data.user;
        if (!user) return;

        const { error } = await window.supabase
            .from('profiles')
            .update({
                nombre: document.getElementById('per-nombre').value.trim(),
                apellido: document.getElementById('per-apellido').value.trim(),
                dni: document.getElementById('per-dni').value.trim(),
                updated_at: new Date()
            })
            .eq('id', user.id);

        if (error) {
            alert("Error al actualizar datos.");
        } else {
            datosSuccess.textContent = 'Datos actualizados correctamente.';
            setTimeout(() => datosSuccess.textContent = '', 3000);
        }
    });

    formDomicilio.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = (await window.supabase.auth.getUser()).data.user;
        if (!user) return;

        const { error } = await window.supabase
            .from('profiles')
            .update({
                direccion: document.getElementById('dom-direccion').value.trim(),
                provincia: document.getElementById('dom-provincia').value.trim(),
                localidad: document.getElementById('dom-localidad').value.trim(),
                cp: document.getElementById('dom-cp').value.trim(),
                updated_at: new Date()
            })
            .eq('id', user.id);

        if (error) {
            alert("Error al actualizar domicilio.");
        } else {
            domSuccess.textContent = 'Domicilio actualizado correctamente.';
            setTimeout(() => domSuccess.textContent = '', 3000);
        }
    });

    // --- Funciones Core ---

    async function checkAuthState() {
        const { data: { session } } = await window.supabase.auth.getSession();
        
        if (session) {
            const user = session.user;
            authSection.style.display = 'none';
            profileSection.style.display = 'block';
            
            profileEmailDisplay.textContent = user.email;

            // Cargar datos del perfil
            const { data: profile } = await window.supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                const avatar = profile.avatar_url || 'avatar_1.png';
                profileAvatarDisplay.src = avatar.startsWith('http') ? avatar : `avatars/${avatar}`;
                
                document.getElementById('per-nombre').value = profile.nombre || '';
                document.getElementById('per-apellido').value = profile.apellido || '';
                document.getElementById('per-dni').value = profile.dni || '';
                document.getElementById('dom-direccion').value = profile.direccion || '';
                document.getElementById('dom-provincia').value = profile.provincia || '';
                document.getElementById('dom-localidad').value = profile.localidad || '';
                document.getElementById('dom-cp').value = profile.cp || '';
            }

            // CARGAR PEDIDOS REALES
            loadOrders(user.id);
            
        } else {
            profileSection.style.display = 'none';
            authSection.style.display = 'block';
            loginBox.style.display = 'block';
            registerBox.style.display = 'none';
            loginForm.reset();
            registerForm.reset();
            clearErrors();
        }
    }

    async function loadOrders(userId) {
        const ordersContainer = document.querySelector('.orders-list');
        const shippingContainer = document.querySelector('.shipping-list');
        if (!ordersContainer) return;

        const { data: orders, error } = await window.supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error al cargar pedidos:", error);
            return;
        }

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p style="text-align:center; padding: 20px; opacity: 0.5;">Aún no tienes pedidos.</p>';
            if (shippingContainer) shippingContainer.innerHTML = '<p style="text-align:center; padding: 20px; opacity: 0.5;">No hay envíos activos.</p>';
            return;
        }

        // Renderizar en la pestaña "Mis Pedidos"
        ordersContainer.innerHTML = '';
        orders.forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString();
            const itemsHtml = order.items.map(item => `<p>${item.quantity}x ${item.name} (${item.variant})</p>`).join('');
            
            const orderHtml = `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">#${order.id.slice(0, 8).toUpperCase()}</span>
                        <span class="order-date">${date}</span>
                    </div>
                    <div class="order-body">
                        ${itemsHtml}
                    </div>
                    <div class="order-footer">
                        <span class="order-total">$${order.total.toLocaleString('es-AR')} ARS</span>
                        <span class="order-status ${getStatusClass(order.status)}">${order.status.toUpperCase()}</span>
                    </div>
                </div>
            `;
            ordersContainer.insertAdjacentHTML('beforeend', orderHtml);
        });

        // Renderizar en la pestaña "Envíos" (solo los que tengan tracking o estén en curso)
        if (shippingContainer) {
            shippingContainer.innerHTML = '';
            orders.filter(o => o.status !== 'cancelado').forEach(order => {
                const shippingHtml = `
                    <div class="shipping-card">
                        <div class="shipping-header">
                            <h4>Pedido #${order.id.slice(0, 8).toUpperCase()}</h4>
                            <span class="shipping-status ${getStatusClass(order.status)}">${order.status.toUpperCase()}</span>
                        </div>
                        <div class="shipping-timeline">
                            <div class="timeline-step ${order.status !== 'pendiente' ? 'done' : 'current'}">Preparando envío</div>
                            <div class="timeline-step ${['en camino', 'entregado'].includes(order.status.toLowerCase()) ? 'done' : ''}">Entregado al correo</div>
                            <div class="timeline-step ${order.status.toLowerCase() === 'en camino' ? 'current' : (order.status.toLowerCase() === 'entregado' ? 'done' : '')}">En camino</div>
                            <div class="timeline-step ${order.status.toLowerCase() === 'entregado' ? 'done' : ''}">Entregado</div>
                        </div>
                        <div class="tracking-info">
                            <p>Código de seguimiento:</p>
                            <strong>${order.tracking_code || 'Pendiente de asignación'}</strong>
                            ${order.tracking_code ? `<button class="btn-track" onclick="window.open('https://www.correoargentino.com.ar/formularios/ondeliv', '_blank')">Rastrear envío</button>` : ''}
                        </div>
                    </div>
                `;
                shippingContainer.insertAdjacentHTML('beforeend', shippingHtml);
            });
        }
    }

    function getStatusClass(status) {
        status = status.toLowerCase();
        if (status === 'pagado' || status === 'entregado') return 'status-paid';
        if (status === 'pendiente') return 'status-pending';
        if (status === 'en camino') return 'status-transit';
        return '';
    }

    function clearErrors() {
        loginError.textContent = '';
        regError.textContent = '';
        if(datosSuccess) datosSuccess.textContent = '';
        if(domSuccess) domSuccess.textContent = '';
    }
});
