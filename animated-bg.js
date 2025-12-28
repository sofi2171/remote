// Simple background animation - Fixed version
if (!window.AnimatedBackground) {
    window.AnimatedBackground = {
        init: function() {
            console.log('Background animation initialized');
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.AnimatedBackground) {
        window.AnimatedBackground.init();
    }
});