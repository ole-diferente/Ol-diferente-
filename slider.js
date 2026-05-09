document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (slides.length === 0) return;

    let currentIndex = 0;

    const goToSlide = (index) => {
        // Pause current video
        const currentVideo = slides[currentIndex].querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }

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

        // Play new video
        const newVideo = slides[currentIndex].querySelector('video');
        if (newVideo) {
            newVideo.currentTime = 0;
            newVideo.play().catch(e => console.log('Auto-play prevented:', e));
        }
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
        const video = slide.querySelector('video');
        if (video) {
            if (index !== currentIndex) {
                video.pause();
            }
            // Auto advance when video finishes
            video.addEventListener('ended', () => {
                nextSlide();
            });
        }
    });
});
