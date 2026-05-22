const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'style.css');
let text = fs.readFileSync(p, 'utf-8');

const newCSS = `

/* Marquee Banner Envío Gratis */
.marquee-banner {
    width: 100%;
    background-color: var(--accent-color);
    color: #000000;
    overflow: hidden;
    padding: 10px 0;
    white-space: nowrap;
    position: relative;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 10;
}

.marquee-content {
    display: inline-block;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    animation: marquee 25s linear infinite;
}

@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
`;

text += newCSS;
fs.writeFileSync(p, text);
console.log("Appended marquee to style.css");
