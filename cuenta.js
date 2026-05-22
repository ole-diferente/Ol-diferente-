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

    // Selects Geografía
    const provinciaSelect = document.getElementById('dom-provincia');
    const localidadSelect = document.getElementById('dom-localidad');

    // --- Definición de Funciones Geográficas ---
    async function cargarProvincias() {
        if (!provinciaSelect) return;
        const provincias = [
            { id: "06", nombre: "Buenos Aires" },
            { id: "02", nombre: "Ciudad Autónoma de Buenos Aires" },
            { id: "10", nombre: "Catamarca" },
            { id: "14", nombre: "Córdoba" },
            { id: "18", nombre: "Corrientes" },
            { id: "22", nombre: "Chaco" },
            { id: "26", nombre: "Chubut" },
            { id: "30", nombre: "Entre Ríos" },
            { id: "34", nombre: "Formosa" },
            { id: "38", nombre: "Jujuy" },
            { id: "42", nombre: "La Pampa" },
            { id: "46", nombre: "La Rioja" },
            { id: "50", nombre: "Mendoza" },
            { id: "54", nombre: "Misiones" },
            { id: "58", nombre: "Neuquén" },
            { id: "62", nombre: "Río Negro" },
            { id: "66", nombre: "Salta" },
            { id: "70", nombre: "San Juan" },
            { id: "74", nombre: "San Luis" },
            { id: "78", nombre: "Santa Cruz" },
            { id: "82", nombre: "Santa Fe" },
            { id: "86", nombre: "Santiago del Estero" },
            { id: "90", nombre: "Tucumán" },
            { id: "94", nombre: "Tierra del Fuego, Antártida e Islas del Atlántico Sur" }
        ].sort((a, b) => a.nombre.localeCompare(b.nombre));

        provinciaSelect.innerHTML = '<option value="" disabled selected>Seleccioná tu provincia</option>';
        provincias.forEach(p => {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.dataset.id = p.id;
            option.textContent = p.nombre;
            provinciaSelect.appendChild(option);
        });
    }

    async function cargarLocalidades(provinciaNombre) {
        if (!provinciaSelect || !localidadSelect) return;
        const selectedOption = Array.from(provinciaSelect.options).find(opt => opt.value === provinciaNombre);
        if (!selectedOption || !selectedOption.dataset.id) return;

        localidadSelect.innerHTML = '<option value="" disabled selected>Cargando localidades...</option>';
        localidadSelect.disabled = true;

        try {
            const response = await fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${selectedOption.dataset.id}&campos=nombre&max=1000`);
            const data = await response.json();
            
            localidadSelect.innerHTML = '<option value="" disabled selected>Seleccioná tu localidad</option>';
            
            if (data.municipios && data.municipios.length > 0) {
                const localidades = data.municipios.sort((a, b) => a.nombre.localeCompare(b.nombre));
                localidades.forEach(l => {
                    const option = document.createElement('option');
                    option.value = l.nombre;
                    option.textContent = l.nombre;
                    localidadSelect.appendChild(option);
                });
                localidadSelect.disabled = false;
            } else {
                const resLoc = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedOption.dataset.id}&campos=nombre&max=1000`);
                const dataLoc = await resLoc.json();
                const localidades = dataLoc.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
                localidades.forEach(l => {
                    const option = document.createElement('option');
                    option.value = l.nombre;
                    option.textContent = l.nombre;
                    localidadSelect.appendChild(option);
                });
                localidadSelect.disabled = false;
            }
        } catch (error) {
            console.error("Error cargando localidades:", error);
            localidadSelect.innerHTML = '<option value="" disabled selected>Error al cargar</option>';
        }
    }

    // --- Inicialización Geográfica ---
    if (provinciaSelect) {
        await cargarProvincias();
        provinciaSelect.addEventListener('change', (e) => {
            cargarLocalidades(e.target.value);
        });
    }

    // --- Estado de Auth Inicial ---
    checkAuthState();

    window.supabase.auth.onAuthStateChange((event, session) => {
        console.log("Cambio de Auth:", event, session);
        checkAuthState();
    });

    // --- Editor de Avatar (Lápiz) ---
    const btnOpenAvatarEditor = document.getElementById('btn-open-avatar-editor');
    const btnCloseAvatarEditor = document.getElementById('btn-close-avatar-editor');
    const avatarEditorDash = document.getElementById('avatar-editor-dash');
    const avatarOptionsDash = document.querySelectorAll('.avatar-option-dash');

    if (btnOpenAvatarEditor) {
        btnOpenAvatarEditor.addEventListener('click', () => {
            // Cambiar a la pestaña de datos
            const datosTabBtn = Array.from(tabBtns).find(btn => btn.dataset.target === 'tab-datos');
            if (datosTabBtn) datosTabBtn.click();
            
            avatarEditorDash.style.display = 'block';
            // Scroll suave hacia el editor
            avatarEditorDash.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    if (btnCloseAvatarEditor) {
        btnCloseAvatarEditor.addEventListener('click', () => {
            avatarEditorDash.style.display = 'none';
        });
    }

    avatarOptionsDash.forEach(option => {
        option.addEventListener('click', async () => {
            const newAvatar = option.dataset.avatar;
            const user = (await window.supabase.auth.getUser()).data.user;
            if (!user) return;

            option.style.opacity = '0.5';

            const { error } = await window.supabase
                .from('profiles')
                .update({ avatar_url: newAvatar })
                .eq('id', user.id);

            if (!error) {
                profileAvatarDisplay.src = newAvatar.startsWith('http') ? newAvatar : `avatars/${newAvatar}`;
                avatarOptionsDash.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                if (window.WebComponentsInstance) {
                    window.WebComponentsInstance.updateUserAuthStatus();
                }
                setTimeout(() => {
                    avatarEditorDash.style.display = 'none';
                }, 500);
            } else {
                alert("Error al cambiar avatar.");
            }
            option.style.opacity = '1';
        });
    });

    // --- Avatar Selection (Registro) ---
    let selectedAvatar = 'avatar_1.png';
    const avatarOptions = document.querySelectorAll('.avatar-option');

    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedAvatar = option.dataset.avatar;
            document.getElementById('trigger-upload-reg').classList.remove('active');
        });
    });

    // Custom Avatar Upload (Registration)
    const regCustomInput = document.getElementById('reg-custom-avatar');
    const triggerUploadReg = document.getElementById('trigger-upload-reg');

    if (triggerUploadReg) {
        triggerUploadReg.addEventListener('click', () => regCustomInput.click());
    }

    if (regCustomInput) {
        regCustomInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            triggerUploadReg.classList.add('active');
            avatarOptions.forEach(opt => opt.classList.remove('active'));
            const reader = new FileReader();
            reader.onload = (e) => {
                triggerUploadReg.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            };
            reader.readAsDataURL(file);
        });
    }

    // Custom Avatar Upload (Dashboard - Camera Icon)
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
            const { error: uploadError } = await window.supabase.storage
                .from('user-avatars')
                .upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = window.supabase.storage
                .from('user-avatars')
                .getPublicUrl(fileName);
            const { error: updateError } = await window.supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);
            if (updateError) throw updateError;
            profileAvatarDisplay.src = publicUrl;
            if (window.WebComponentsInstance) {
                window.WebComponentsInstance.updateUserAuthStatus();
            }
        } catch (error) {
            console.error("Error subiendo avatar:", error);
            alert("Error al subir la imagen.");
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
            const pane = document.getElementById(target);
            if (pane) pane.classList.add('active');
        });
    });

    // --- Auth Handlers ---
    if (toRegisterLink) toRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
        clearErrors();
    });
    if (toLoginLink) toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
        clearErrors();
    });

    if (registerForm) registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const { data, error } = await window.supabase.auth.signUp({ email, password });
        if (error) { regError.textContent = error.message; return; }
        if (data.user) {
            let finalAvatar = selectedAvatar;
            const customFile = regCustomInput.files[0];
            if (customFile) {
                const fileExt = customFile.name.split('.').pop();
                const fileName = `${data.user.id}-${Math.random()}.${fileExt}`;
                const { error: upErr } = await window.supabase.storage.from('user-avatars').upload(fileName, customFile);
                if (!upErr) {
                    const { data: { publicUrl } } = window.supabase.storage.from('user-avatars').getPublicUrl(fileName);
                    finalAvatar = publicUrl;
                }
            }
            await window.supabase.from('profiles').insert([{ id: data.user.id, email, avatar_url: finalAvatar }]);
            alert("Registro exitoso.");
            toLoginLink.click();
        }
    });

    if (loginForm) loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const { error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) loginError.textContent = "Credenciales inválidas.";
    });

    if (logoutBtn) logoutBtn.addEventListener('click', async () => {
        await window.supabase.auth.signOut();
    });

    if (formDatos) formDatos.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = (await window.supabase.auth.getUser()).data.user;
        if (!user) return;
        const { error } = await window.supabase.from('profiles').update({
            nombre: document.getElementById('per-nombre').value.trim(),
            apellido: document.getElementById('per-apellido').value.trim(),
            dni: document.getElementById('per-dni').value.trim(),
            updated_at: new Date()
        }).eq('id', user.id);
        if (!error) {
            datosSuccess.textContent = 'Datos guardados.';
            setTimeout(() => datosSuccess.textContent = '', 3000);
        }
    });

    if (formDomicilio) formDomicilio.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = (await window.supabase.auth.getUser()).data.user;
        if (!user) return;
        const { error } = await window.supabase.from('profiles').update({
            direccion: document.getElementById('dom-direccion').value.trim(),
            provincia: document.getElementById('dom-provincia').value,
            localidad: document.getElementById('dom-localidad').value,
            cp: document.getElementById('dom-cp').value.trim(),
            updated_at: new Date()
        }).eq('id', user.id);
        if (!error) {
            domSuccess.textContent = 'Domicilio guardado.';
            setTimeout(() => domSuccess.textContent = '', 3000);
        }
    });

    async function checkAuthState() {
        if (window.location.hash && window.location.hash.includes('type=recovery')) {
            return; // Skip normal auth display, recovery handles this
        }
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session) {
            const user = session.user;
            authSection.style.display = 'none';
            profileSection.style.display = 'block';
            profileEmailDisplay.textContent = user.email;
            const { data: profile } = await window.supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profile) {
                const avatar = profile.avatar_url || 'avatars/avatar_1.png';
                profileAvatarDisplay.src = avatar.startsWith('http') ? avatar : (avatar.includes('/') ? avatar : `avatars/${avatar}`);
                document.getElementById('per-nombre').value = profile.nombre || '';
                document.getElementById('per-apellido').value = profile.apellido || '';
                document.getElementById('per-dni').value = profile.dni || '';
                document.getElementById('dom-direccion').value = profile.direccion || '';
                if (profile.provincia) {
                    provinciaSelect.value = profile.provincia;
                    await cargarLocalidades(profile.provincia);
                    if (profile.localidad) localidadSelect.value = profile.localidad;
                }
                document.getElementById('dom-cp').value = profile.cp || '';
            }
            loadOrders(user.id);
        } else {
            profileSection.style.display = 'none';
            authSection.style.display = 'block';
        }
    }

    async function loadOrders(userId) {
        const ordersContainer = document.querySelector('.orders-list');
        const shippingContainer = document.querySelector('.shipping-list');
        if (!ordersContainer) return;
        const { data: orders } = await window.supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = '<p style="text-align:center; opacity:0.5;">No hay pedidos.</p>';
            return;
        }
        ordersContainer.innerHTML = orders.map(o => `
            <div class="order-card">
                <div class="order-header"><span class="order-id">#${o.id.slice(0,8).toUpperCase()}</span></div>
                <div class="order-body">${o.items.map(i => `<p>${i.quantity}x ${i.name}</p>`).join('')}</div>
                <div class="order-footer"><span>$${o.total.toLocaleString()}</span><span class="order-status">${o.status}</span></div>
            </div>
        `).join('');
    }

    
    const recoveryBox = document.getElementById('recovery-box');
    const updatePasswordBox = document.getElementById('update-password-box');
    const toRecoveryLink = document.getElementById('to-recovery');
    const backToLoginLink = document.getElementById('back-to-login');
    const recoveryForm = document.getElementById('recovery-form');
    const updatePasswordForm = document.getElementById('update-password-form');
    const recoveryError = document.getElementById('recovery-error');
    const recoverySuccess = document.getElementById('recovery-success');
    const updatePwdError = document.getElementById('update-pwd-error');

    if (toRecoveryLink) {
        toRecoveryLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.style.display = 'none';
            if(registerBox) registerBox.style.display = 'none';
            recoveryBox.style.display = 'block';
            clearErrors();
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            recoveryBox.style.display = 'none';
            loginBox.style.display = 'block';
            clearErrors();
        });
    }

    if (recoveryForm) {
        recoveryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('recovery-email').value.trim();
            const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + window.location.pathname,
            });
            if (error) {
                recoveryError.textContent = error.message;
                recoverySuccess.textContent = '';
            } else {
                recoveryError.textContent = '';
                recoverySuccess.textContent = 'Enlace de recuperación enviado. Revisa tu bandeja de entrada.';
            }
        });
    }

    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('new-password').value.trim();
            const { error } = await window.supabase.auth.updateUser({ password: newPassword });
            if (error) {
                updatePwdError.textContent = error.message;
            } else {
                alert("¡Contraseña actualizada exitosamente!");
                window.location.hash = ''; // Clear hash
                updatePasswordBox.style.display = 'none';
                loginBox.style.display = 'block';
            }
        });
    }

    // Check for password recovery hash
    window.addEventListener('hashchange', checkHashForRecovery);
    checkHashForRecovery();

    function checkHashForRecovery() {
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
            // User clicked the recovery link in their email
            authSection.style.display = 'block';
            loginBox.style.display = 'none';
            if (registerBox) registerBox.style.display = 'none';
            if (recoveryBox) recoveryBox.style.display = 'none';
            if (profileSection) profileSection.style.display = 'none';
            updatePasswordBox.style.display = 'block';
        }
    }

    function clearErrors() {
        if (recoveryError) recoveryError.textContent = '';
        if (recoverySuccess) recoverySuccess.textContent = '';
        if (updatePwdError) updatePwdError.textContent = '';
        if (loginError) loginError.textContent = '';
        if (regError) regError.textContent = '';
    }
});
