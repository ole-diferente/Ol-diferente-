/**
 * OLÉ DIFERENTE - Tienda Logic
 * Maneja el filtrado, ordenamiento y selectores de tamaño en la página de la tienda.
 */

class StoreManager {
    constructor() {
        this.categoryFilter = document.getElementById('category-filter');
        this.priceSort = document.getElementById('price-sort');
        this.productGrid = document.querySelector('.product-grid');
        this.products = Array.from(document.querySelectorAll('.product-card'));
        this.init();
    }

    init() {
        if (this.categoryFilter) {
            this.handleUrlParams();
            this.bindEvents();
            this.setupSizeSelectors();
            this.updateCatalog();
        }
    }

    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const cat = urlParams.get('cat');
        if (cat && this.categoryFilter) {
            this.categoryFilter.value = cat;
        }
    }

    bindEvents() {
        this.categoryFilter.addEventListener('change', () => this.updateCatalog());
        this.priceSort.addEventListener('change', () => this.updateCatalog());
    }

    setupSizeSelectors() {
        document.querySelectorAll('.product-card').forEach(card => {
            const mainBtns = card.querySelectorAll('.main-options .size-btn');
            const decantOptions = card.querySelector('.decant-options');
            const decantBtns = card.querySelectorAll('.decant-options .size-btn');
            const priceDisplay = card.querySelector('.product-price');

            const updatePrice = (btn) => {
                const price = btn.getAttribute('data-price');
                if (price) {
                    priceDisplay.innerText = `$${price}`;
                    // Update data-price attribute on card for sorting
                    card.setAttribute('data-price', price.replace('.', ''));
                }
            };

            mainBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    mainBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    if (btn.getAttribute('data-type') === 'decant') {
                        decantOptions.classList.add('visible');
                        const defaultDecant = decantOptions.querySelector('.size-btn.active') || decantBtns[1];
                        updatePrice(defaultDecant);
                    } else {
                        decantOptions.classList.remove('visible');
                        updatePrice(btn);
                    }
                });
            });

            decantBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    decantBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updatePrice(btn);
                });
            });
        });
    }

    updateCatalog() {
        const category = this.categoryFilter.value;
        const sort = this.priceSort.value;

        // Filter
        let filteredProducts = this.products.filter(p => {
            const pCategory = p.getAttribute('data-category');
            return category === 'todos' || pCategory.includes(category) || (category === 'decants');
        });

        // Sort
        filteredProducts.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            const nameA = a.getAttribute('data-name').toLowerCase();
            const nameB = b.getAttribute('data-name').toLowerCase();

            if (sort === 'menor-mayor') return priceA - priceB;
            if (sort === 'mayor-menor') return priceB - priceA;
            if (sort === 'nombre-az') return nameA.localeCompare(nameB);
            if (sort === 'nombre-za') return nameB.localeCompare(nameA);
            return 0;
        });

        // Re-render
        this.productGrid.innerHTML = '';
        this.products.forEach(p => p.style.display = 'none');
        filteredProducts.forEach(p => {
            p.style.display = 'flex';
            this.productGrid.appendChild(p);
        });

        // Animation micro-effect
        this.productGrid.style.opacity = 0;
        setTimeout(() => {
            this.productGrid.style.transition = 'opacity 0.3s ease';
            this.productGrid.style.opacity = 1;
        }, 10);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StoreManager();
});
