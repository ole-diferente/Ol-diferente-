document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (slides.length === 0) return;

    let currentIndex = 0;

    const goToSlide = (index) => {
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
            // Only play if video is visible (not display: none)
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

    // Event Listeners for arrows
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }

    // Event Listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentIndex !== index) {
                goToSlide(index);
            }
        });
    });

    // Setup videos: pause inactive, play active, attach 'ended' event
    slides.forEach((slide, index) => {
        const videos = slide.querySelectorAll('video');
        videos.forEach(video => {
            if (index !== currentIndex) {
                video.pause();
            } else if (window.getComputedStyle(video).display !== 'none') {
                video.play().catch(e => console.log('Initial play prevented:', e));
            }

            // Auto advance when video finishes
            video.addEventListener('ended', () => {
                // Only advance if this is the visible video
                if (window.getComputedStyle(video).display !== 'none') {
                    nextSlide();
                }
            });
        });
    });
});
