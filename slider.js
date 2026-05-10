document.addEventListener('DOMContentLoaded', () => {
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
                v.currentTime = 0;
                v.play().catch(e => console.log('Auto-play prevented:', e));
            }
        });
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
                if (index !== currentIndex) {
                    video.pause();
                } else if (window.getComputedStyle(video).display !== 'none') {
                    video.play().catch(e => console.log('Initial play prevented:', e));
                }

                video.addEventListener('ended', () => {
                    if (window.getComputedStyle(video).display !== 'none') {
                        nextSlide();
                    }
                });
            });
        });
    };

    initDots();
    initVideos();

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
