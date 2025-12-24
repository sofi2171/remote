// Simple background animation
const AnimatedBackground = {
    init: function() {
        console.log('Background animation initialized');
    }
};

window.AnimatedBackground = AnimatedBackground;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.AnimatedBackground) {
        window.AnimatedBackground.init();
    }
});