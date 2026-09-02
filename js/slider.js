document.addEventListener('DOMContentLoaded', () => {
    // --- Purga de videos invisibles según el dispositivo para bajos recursos ---
    const isDesktop = window.innerWidth > 1024;
    if (isDesktop) {
        // Eliminar todos los videos de móvil del DOM para evitar descargas innecesarias
        document.querySelectorAll('video.video-mobile').forEach(el => el.remove());
    } else {
        // Eliminar todos los videos de escritorio
        document.querySelectorAll('video.video-desktop').forEach(el => el.remove());
    }

    // Detector de conexiones lentas o modo de ahorro de datos
    const isLowConnection = () => {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            if (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
                return true;
            }
        }
        return false;
    };

    // Helper para cargar dinámicamente el video a demanda leyendo todas sus fuentes (<source>)
    const lazyLoadVideo = (video) => {
        if (!video) return;
        let needLoad = false;
        const sources = video.querySelectorAll('source');
        sources.forEach(source => {
            if (source.dataset.src && !source.src) {
                source.src = source.dataset.src;
                needLoad = true;
            }
        });
        if (needLoad || (!video.src && sources.length > 0)) {
            const firstSource = sources[0];
            if (firstSource && firstSource.src && !video.src) {
                video.src = firstSource.src;
            }
            video.load(); // Indicar al navegador que cargue el recurso multimedia
        }
    };

    // We'll define a function to get only visible elements to handle desktop vs mobile differences
    const getVisibleElements = () => {
        const allSlides = Array.from(document.querySelectorAll('.slide'));
        const allDots = Array.from(document.querySelectorAll('.dot'));
        
        return {
            slides: allSlides.filter(s => window.getComputedStyle(s).display !== 'none'),
            dots: allDots.filter(d => window.getComputedStyle(d).display !== 'none')
        };
    };

    let { slides, dots } = getVisibleElements();
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (slides.length === 0) return;

    let currentIndex = 0;

    const goToSlide = (index) => {
        // Refresh elements in case of window resize
        const currentElements = getVisibleElements();
        slides = currentElements.slides;
        dots = currentElements.dots;

        if (slides.length === 0) return;

        // Pause all videos in current slide
        const currentVideos = slides[currentIndex].querySelectorAll('video');
        currentVideos.forEach(v => v.pause());

        // Remove active class
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        // Update index
        currentIndex = index;
        if (currentIndex >= slides.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slides.length - 1;

        // Add active class
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');

        // Play visible video in new slide
        const newVideos = slides[currentIndex].querySelectorAll('video');
        newVideos.forEach(v => {
            if (window.getComputedStyle(v).display !== 'none') {
                lazyLoadVideo(v); // Cargar a demanda al activar el slide
                v.currentTime = 0;
                v.play().catch(e => console.log('Auto-play prevented:', e));
            }
        });

        // Pre-cargar de fondo el video del siguiente slide para transiciones fluidas
        const nextIndex = (currentIndex + 1) % slides.length;
        if (slides[nextIndex] && !isLowConnection()) {
            const nextVideos = slides[nextIndex].querySelectorAll('video');
            nextVideos.forEach(v => {
                if (window.getComputedStyle(v).display !== 'none') {
                    lazyLoadVideo(v);
                }
            });
        }
    };

    const nextSlide = () => {
        goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
        goToSlide(currentIndex - 1);
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    const initDots = () => {
        dots.forEach((dot, index) => {
            // Remove old listeners by cloning
            const newDot = dot.cloneNode(true);
            dot.parentNode.replaceChild(newDot, dot);
            
            newDot.addEventListener('click', () => {
                if (currentIndex !== index) {
                    goToSlide(index);
                }
            });
        });
        // Update dots reference after cloning
        dots = getVisibleElements().dots;
    };

    const initVideos = () => {
        slides.forEach((slide, index) => {
            const videos = slide.querySelectorAll('video');
            videos.forEach(video => {
                video.addEventListener('ended', () => {
                    if (window.getComputedStyle(video).display !== 'none') {
                        nextSlide();
                    }
                });
            });
        });
        // Cargar e iniciar la reproducción del primer slide mediante la misma rutina del slider
        goToSlide(0);
    };

    initDots();
    initVideos();

    // --- Touch/Swipe Support ---
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Minimum distance in px to trigger a swipe

    const handleGesture = () => {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left -> Next slide
                nextSlide();
            } else {
                // Swiped right -> Previous slide
                prevSlide();
            }
        }
    };

    const sliderContainer = document.getElementById('hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, { passive: true });
    }

    // Re-initialize on resize to handle slide count changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const elements = getVisibleElements();
            slides = elements.slides;
            dots = elements.dots;
            initDots();
            if (currentIndex >= slides.length) goToSlide(0);
        }, 250);
    });
});
