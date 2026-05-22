const fs = require('fs');
const path = require('path');

// Update cuenta.html
const htmlPath = path.join(__dirname, '..', 'cuenta.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

html = html.replace(
    /<p class="switch-form">¿No tienes cuenta\? <a href="#" id="to-register">Regístrate aquí<\/a><\/p>\s*<\/form>\s*<\/div>/,
    `<p class="switch-form" style="margin-bottom: 5px;"><a href="#" id="to-recovery">¿Olvidaste tu contraseña?</a></p>
                        <p class="switch-form">¿No tienes cuenta? <a href="#" id="to-register">Regístrate aquí</a></p>
                    </form>
                </div>

                <!-- Recovery Form -->
                <div id="recovery-box" class="auth-box" style="display: none;">
                    <h2>RECUPERAR CONTRASEÑA</h2>
                    <p style="text-align: center; margin-bottom: 20px; font-size: 14px; opacity: 0.8;">Ingresá tu correo y te enviaremos un enlace para restablecerla.</p>
                    <form id="recovery-form">
                        <div class="input-group">
                            <label for="recovery-email">Correo Electrónico</label>
                            <input type="email" id="recovery-email" required>
                        </div>
                        <p class="error-msg" id="recovery-error"></p>
                        <p class="success-msg" id="recovery-success"></p>
                        <button type="submit" class="btn-auth">Enviar Enlace</button>
                        <p class="switch-form"><a href="#" id="back-to-login">Volver a Iniciar Sesión</a></p>
                    </form>
                </div>

                <!-- Update Password Form (After Recovery) -->
                <div id="update-password-box" class="auth-box" style="display: none;">
                    <h2>NUEVA CONTRASEÑA</h2>
                    <form id="update-password-form">
                        <div class="input-group">
                            <label for="new-password">Nueva Contraseña</label>
                            <input type="password" id="new-password" required>
                        </div>
                        <p class="error-msg" id="update-pwd-error"></p>
                        <button type="submit" class="btn-auth">Guardar Contraseña</button>
                    </form>
                </div>`
);

fs.writeFileSync(htmlPath, html);

// Update cuenta.js
const jsPath = path.join(__dirname, '..', 'cuenta.js');
let js = fs.readFileSync(jsPath, 'utf-8');

const jsAdditions = `
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
`;

js = js.replace(/function clearErrors\(\) \{/, jsAdditions + '\n    function clearErrors() {');

// Inject clearing logic for new errors
js = js.replace(/function clearErrors\(\) \{/, `function clearErrors() {
        if (recoveryError) recoveryError.textContent = '';
        if (recoverySuccess) recoverySuccess.textContent = '';
        if (updatePwdError) updatePwdError.textContent = '';`);

fs.writeFileSync(jsPath, js);
console.log("Recovery logic added");
