/**
 * OLÉ DIFERENTE - Tienda Logic
 * Maneja el filtrado, ordenamiento, buscador y selectores de tamaño en la página de la tienda.
 */

class StoreManager {
    constructor() {
        this.categoryFilter = document.getElementById('category-filter');
        this.priceSort = document.getElementById('price-sort');
        this.productGrid = document.querySelector('.product-grid');
        this.products = Array.from(document.querySelectorAll('.product-card'));
        
        // Search Elements
        this.searchContainer = document.querySelector('.search-container');
        this.searchInput = document.getElementById('catalog-search');
        this.searchDropdown = document.getElementById('search-dropdown');
        this.clearSearchBtn = document.getElementById('clear-search');
        
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
        
        // Search Event Listeners
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                const query = this.searchInput.value.toLowerCase().trim();
                
                // Show/hide clear button
                if (this.clearSearchBtn) {
                    this.clearSearchBtn.style.display = query.length > 0 ? 'flex' : 'none';
                }
                
                if (query.length >= 3) {
                    this.updateSearchSuggestions(query);
                } else {
                    if (this.searchDropdown) this.searchDropdown.style.display = 'none';
                }
                
                this.updateCatalog();
            });

            this.searchInput.addEventListener('focus', () => {
                const query = this.searchInput.value.toLowerCase().trim();
                if (query.length >= 3) {
                    this.updateSearchSuggestions(query);
                }
            });

            document.addEventListener('click', (e) => {
                if (this.searchDropdown && !this.searchContainer.contains(e.target)) {
                    this.searchDropdown.style.display = 'none';
                }
            });
        }

        if (this.clearSearchBtn) {
            this.clearSearchBtn.addEventListener('click', () => {
                this.searchInput.value = '';
                this.clearSearchBtn.style.display = 'none';
                if (this.searchDropdown) this.searchDropdown.style.display = 'none';
                this.updateCatalog();
                this.searchInput.focus();
            });
        }
    }

    updateSearchSuggestions(query) {
        if (!this.searchDropdown) return;
        
        // Filter products that match query
        const suggestions = [];
        this.products.forEach(p => {
            const name = p.getAttribute('data-name');
            const category = p.getAttribute('data-category') || '';
            const priceEl = p.querySelector('.product-price');
            const price = priceEl ? priceEl.innerText : '';
            const imgEl = p.querySelector('.product-image');
            const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
            const linkEl = p.querySelector('a');
            const linkHref = linkEl ? linkEl.getAttribute('href') : '#';

            if (name.toLowerCase().includes(query)) {
                suggestions.push({ name, category, price, imgSrc, linkHref });
            }
        });

        this.searchDropdown.innerHTML = '';
        
        if (suggestions.length > 0) {
            suggestions.forEach(item => {
                // Determine display label for category
                const cats = [];
                if (item.category.includes('masculinas')) cats.push('Masculina');
                if (item.category.includes('femeninas')) cats.push('Femenina');
                if (item.category.includes('body-splash')) cats.push('Body Splash');
                const catLabel = cats.join(' / ') || 'Fragancia';

                const searchItemHTML = `
                    <a href="${item.linkHref}" class="search-item">
                        <img src="${item.imgSrc}" alt="${item.name}" class="search-item-thumb">
                        <div class="search-item-info">
                            <span class="search-item-name">${item.name}</span>
                            <div class="search-item-meta">
                                <span>${catLabel}</span>
                                <strong style="color: var(--accent-color);">${item.price}</strong>
                            </div>
                        </div>
                    </a>
                `;
                this.searchDropdown.insertAdjacentHTML('beforeend', searchItemHTML);
            });
            this.searchDropdown.style.display = 'block';
            
            // Re-run Lucide icons for the dropdown if needed
            if (typeof lucide !== 'undefined') lucide.createIcons();
        } else {
            this.searchDropdown.innerHTML = '<div class="search-no-results">No se encontraron fragancias</div>';
            this.searchDropdown.style.display = 'block';
        }
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
                        if (decantOptions) decantOptions.classList.add('visible');
                        const defaultDecant = decantOptions ? (decantOptions.querySelector('.size-btn.active') || decantBtns[1]) : null;
                        if (defaultDecant) updatePrice(defaultDecant);
                    } else {
                        if (decantOptions) decantOptions.classList.remove('visible');
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
        const searchQuery = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';

        // Filter
        let filteredProducts = this.products.filter(p => {
            const pCategory = p.getAttribute('data-category');
            const pName = p.getAttribute('data-name').toLowerCase();
            
            const matchesCategory = category === 'todos' || pCategory.includes(category) || (category === 'decants');
            const matchesSearch = searchQuery.length < 3 || pName.includes(searchQuery);
            
            return matchesCategory && matchesSearch;
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
