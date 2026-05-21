const fs = require('fs');

const path = 'tienda.html';
let html = fs.readFileSync(path, 'utf8');

// Find the Odyssey Homme Black product card and replace it with the out of stock version
const searchStr = `<div class="product-card reveal" data-category="masculinas" data-price="0" data-name="Armaf Odyssey Homme Black">
                <a href="odyssey-homme-black.html" style="text-decoration: none; color: inherit;">
                    <div class="product-image-container">
                        <img src="img/fragancias/Odyssey Homme Black Eau de Parfum.jpg" alt="Armaf Odyssey Homme Black" class="product-image">
                    </div>
                </a>
                <div class="product-info">
                    <span class="product-category">Fragancia Especiada</span>
                    <a href="odyssey-homme-black.html" style="text-decoration: none; color: inherit;">
                        <h3 class="product-title">Odyssey Homme Black</h3>
                    </a>
                    <div class="size-selectors">
                        <div class="selector-group main-options">
                            <button class="size-btn active" data-type="full" data-price="0.000">100 ml</button>
                            <button class="size-btn" data-type="decant">Decant</button>
                        </div>
                        <div class="selector-group decant-options">
                            <button class="size-btn" data-price="0.000">10 ml</button>
                            <button class="size-btn active" data-price="0.000">5 ml</button>
                        </div>
                    </div>
                    <div class="product-price">Por definir</div>
                    <div class="purchase-controls">
                        <input type="number" class="quantity-selector" value="1" min="1" aria-label="Cantidad">
                        <button class="add-to-cart-btn">Agregar al carrito</button>
                    </div>
                </div>
            </div>`;

const replaceStr = `<div class="product-card reveal out-of-stock" data-category="masculinas" data-price="0" data-name="Armaf Odyssey Homme Black">
                <a href="odyssey-homme-black.html" style="text-decoration: none; color: inherit;">
                    <div class="product-image-container">
                        <div class="out-of-stock-badge">Sin Stock</div>
                        <img src="img/fragancias/Odyssey Homme Black Eau de Parfum.jpg" alt="Armaf Odyssey Homme Black" class="product-image">
                    </div>
                </a>
                <div class="product-info">
                    <span class="product-category">Fragancia Especiada</span>
                    <a href="odyssey-homme-black.html" style="text-decoration: none; color: inherit;">
                        <h3 class="product-title">Odyssey Homme Black</h3>
                    </a>
                    <div class="size-selectors">
                        <div class="selector-group main-options">
                            <button class="size-btn active" data-type="full" data-price="0.000" disabled>100 ml</button>
                            <button class="size-btn" data-type="decant" disabled>Decant</button>
                        </div>
                        <div class="selector-group decant-options">
                            <button class="size-btn" data-price="0.000" disabled>10 ml</button>
                            <button class="size-btn active" data-price="0.000" disabled>5 ml</button>
                        </div>
                    </div>
                    <div class="product-price">Por definir</div>
                    <div class="purchase-controls">
                        <input type="number" class="quantity-selector" value="1" min="1" aria-label="Cantidad" disabled>
                        <button class="add-to-cart-btn" disabled>Sin Stock</button>
                    </div>
                </div>
            </div>`;

if (html.includes(searchStr)) {
    fs.writeFileSync(path, html.replace(searchStr, replaceStr), 'utf8');
    console.log('Successfully updated Odyssey Homme Black to out of stock.');
} else {
    console.error('Target string not found in tienda.html');
}
