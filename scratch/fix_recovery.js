const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'cuenta.js');
let js = fs.readFileSync(p, 'utf-8');

// Replace checkAuthState call and onAuthStateChange
js = js.replace(/checkAuthState\(\);\s*window\.supabase\.auth\.onAuthStateChange\(\(event, session\) => \{[\s\S]*?checkAuthState\(\);\s*\}\);/,
`let isRecoveringPassword = false;

    // --- Estado de Auth Inicial ---
    checkAuthState();

    window.supabase.auth.onAuthStateChange((event, session) => {
        console.log("Cambio de Auth:", event, session);
        if (event === 'PASSWORD_RECOVERY') {
            isRecoveringPassword = true;
            authSection.style.display = 'block';
            loginBox.style.display = 'none';
            if (registerBox) registerBox.style.display = 'none';
            if (recoveryBox) recoveryBox.style.display = 'none';
            const profileSec = document.getElementById('profile-section');
            if (profileSec) profileSec.style.display = 'none';
            updatePasswordBox.style.display = 'block';
            return;
        }
        checkAuthState();
    });`);

// Update checkAuthState to use isRecoveringPassword
js = js.replace(/async function checkAuthState\(\) \{\s*if \(window\.location\.hash && window\.location\.hash\.includes\('type=recovery'\)\) \{\s*return; \/\/ Skip normal auth display, recovery handles this\s*\}/,
`async function checkAuthState() {
        if (isRecoveringPassword) return; // Prevent overwriting recovery UI`);

// Ensure checkHashForRecovery sets isRecoveringPassword if it catches the hash before Supabase clears it
js = js.replace(/function checkHashForRecovery\(\) \{[\s\S]*?const hash = window\.location\.hash;[\s\S]*?if \(hash && hash\.includes\('type=recovery'\)\) \{/,
`function checkHashForRecovery() {
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
            isRecoveringPassword = true;`);

fs.writeFileSync(p, js);
console.log("Fixed password recovery logic");
