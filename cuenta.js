/**
 * cuenta.js
 * Lógica para el sistema de inicio de sesión, registro y perfiles guardando en localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Auth Elements
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

    // Avatar Selection
    let selectedAvatar = 'avatar_1.png'; // Default
    const avatarOptions = document.querySelectorAll('.avatar-option');

    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedAvatar = option.dataset.avatar;
        });
    });

    // --- Tab Navigation ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const target = btn.dataset.target;
            document.getElementById(target).classList.add('active');
        });
    });

    // --- Check if user is logged in on load ---
    checkAuthState();

    // Toggle forms
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

    // --- Register Handler ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        if (email === '' || password === '') {
            regError.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        let users = JSON.parse(localStorage.getItem('oleUsers')) || [];

        const userExists = users.some(u => u.email === email);
        if (userExists) {
            regError.textContent = 'El correo ya está registrado.';
            return;
        }

        // Add user with empty profile data
        const newUser = {
            email: email,
            password: password,
            avatar: selectedAvatar,
            datosPersonales: { nombre: '', apellido: '', dni: '' },
            domicilio: { direccion: '', provincia: '', localidad: '', cp: '' }
        };

        users.push(newUser);
        localStorage.setItem('oleUsers', JSON.stringify(users));

        // Auto login
        localStorage.setItem('oleActiveUser', JSON.stringify(newUser));
        
        checkAuthState();
    });

    // --- Login Handler ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        let users = JSON.parse(localStorage.getItem('oleUsers')) || [];
        
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('oleActiveUser', JSON.stringify(user));
            checkAuthState();
        } else {
            loginError.textContent = 'Correo o contraseña incorrectos.';
        }
    });

    // --- Logout Handler ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('oleActiveUser');
        checkAuthState();
    });

    // --- Form Handlers ---
    formDatos.addEventListener('submit', (e) => {
        e.preventDefault();
        updateUserProfile('datosPersonales', {
            nombre: document.getElementById('per-nombre').value.trim(),
            apellido: document.getElementById('per-apellido').value.trim(),
            dni: document.getElementById('per-dni').value.trim()
        });
        datosSuccess.textContent = 'Datos actualizados correctamente.';
        setTimeout(() => datosSuccess.textContent = '', 3000);
    });

    formDomicilio.addEventListener('submit', (e) => {
        e.preventDefault();
        updateUserProfile('domicilio', {
            direccion: document.getElementById('dom-direccion').value.trim(),
            provincia: document.getElementById('dom-provincia').value.trim(),
            localidad: document.getElementById('dom-localidad').value.trim(),
            cp: document.getElementById('dom-cp').value.trim()
        });
        domSuccess.textContent = 'Domicilio actualizado correctamente.';
        setTimeout(() => domSuccess.textContent = '', 3000);
    });

    // --- Core Functions ---
    function updateUserProfile(key, data) {
        let activeUser = JSON.parse(localStorage.getItem('oleActiveUser'));
        if(!activeUser) return;

        activeUser[key] = data;
        localStorage.setItem('oleActiveUser', JSON.stringify(activeUser));

        // Update in users array
        let users = JSON.parse(localStorage.getItem('oleUsers')) || [];
        const index = users.findIndex(u => u.email === activeUser.email);
        if(index !== -1) {
            users[index] = activeUser;
            localStorage.setItem('oleUsers', JSON.stringify(users));
        }
    }

    function checkAuthState() {
        const activeUser = JSON.parse(localStorage.getItem('oleActiveUser'));
        
        if (activeUser) {
            // User is logged in
            authSection.style.display = 'none';
            profileSection.style.display = 'block';
            
            // Populate profile header
            document.getElementById('profile-email').textContent = activeUser.email;
            document.getElementById('profile-avatar').src = `avatars/${activeUser.avatar}`;

            // Ensure profile data objects exist (for older accounts)
            if(!activeUser.datosPersonales) activeUser.datosPersonales = { nombre: '', apellido: '', dni: '' };
            if(!activeUser.domicilio) activeUser.domicilio = { direccion: '', provincia: '', localidad: '', cp: '' };

            // Populate forms
            document.getElementById('per-nombre').value = activeUser.datosPersonales.nombre || '';
            document.getElementById('per-apellido').value = activeUser.datosPersonales.apellido || '';
            document.getElementById('per-dni').value = activeUser.datosPersonales.dni || '';

            document.getElementById('dom-direccion').value = activeUser.domicilio.direccion || '';
            document.getElementById('dom-provincia').value = activeUser.domicilio.provincia || '';
            document.getElementById('dom-localidad').value = activeUser.domicilio.localidad || '';
            document.getElementById('dom-cp').value = activeUser.domicilio.cp || '';
            
            // Reset to first tab
            tabBtns[0].click();

        } else {
            // User is not logged in
            profileSection.style.display = 'none';
            authSection.style.display = 'block';
            loginBox.style.display = 'block';
            registerBox.style.display = 'none';
            
            // Clear forms
            loginForm.reset();
            registerForm.reset();
            clearErrors();
        }
    }

    function clearErrors() {
        loginError.textContent = '';
        regError.textContent = '';
        datosSuccess.textContent = '';
        domSuccess.textContent = '';
    }
});
