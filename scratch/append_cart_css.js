const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'cart.css');
let text = fs.readFileSync(p, 'utf-8');

const newCSS = `
/* Checkout Modal */
.checkout-modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 2001;
    opacity: 0; visibility: hidden;
    transition: all 0.3s ease;
}

.checkout-modal-overlay.active {
    opacity: 1; visibility: visible;
}

.checkout-modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -40%);
    width: 90%; max-width: 500px;
    max-height: 90vh;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    z-index: 2002;
    opacity: 0; visibility: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.checkout-modal.active {
    opacity: 1; visibility: visible;
    transform: translate(-50%, -50%);
}

.checkout-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex; justify-content: space-between; align-items: center;
}

.checkout-header h2 { font-size: 20px; font-family: 'Playfair Display', serif; }

.close-checkout { background: none; border: none; cursor: pointer; color: var(--text-primary); }

.checkout-body {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
}

.delivery-methods {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
}

.delivery-option {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.delivery-option:hover {
    border-color: var(--accent-color);
}

.delivery-details { display: flex; flex-direction: column; }
.delivery-title { font-weight: 600; font-size: 15px; }
.delivery-desc { font-size: 12px; color: var(--text-secondary); }

.shipping-form {
    margin-bottom: 25px;
    background: rgba(0,0,0,0.02);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.form-group label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
    color: var(--text-secondary);
}

.form-group input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-color);
    color: var(--text-primary);
    font-size: 14px;
}

.form-group input:focus {
    outline: none;
    border-color: var(--accent-color);
}

.checkout-summary {
    background: rgba(255,255,255,0.03);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
}

.summary-row.total {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid var(--border-color);
    font-size: 18px;
    font-weight: bold;
    color: var(--accent-color);
}

.checkout-footer {
    padding: 20px;
    border-top: 1px solid var(--border-color);
}

.confirm-order-btn {
    width: 100%;
    padding: 15px;
    background: #25D366;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.confirm-order-btn:hover {
    background: #128C7E;
    transform: translateY(-2px);
}
`;

text += newCSS;
fs.writeFileSync(p, text);
console.log("Appended to cart.css");
