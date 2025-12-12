// Mobile optimizations
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set viewport height on load and resize
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Background Music - Global variable
let backgroundMusic = null;

// Initialize and try to play music immediately
function initBackgroundMusic() {
    backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5; // Set volume to 50%
        
        // Try to play immediately
        const playMusic = async () => {
            try {
                await backgroundMusic.play();
            } catch (e) {
                // Autoplay blocked - will play on first interaction
                console.log('Music autoplay blocked, will play on interaction');
            }
        };
        
        // Try multiple times to play
        playMusic();
        
        // Try on window load
        window.addEventListener('load', playMusic);
        
        // Try on any user interaction
        const playOnInteraction = () => {
            playMusic();
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
    }
}

// Initialize music as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundMusic);
} else {
    initBackgroundMusic();
}

// Prevent zoom on double tap (mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent pull-to-refresh on mobile
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (window.scrollY === 0 && e.touches[0].clientY > touchStartY) {
        e.preventDefault();
    }
}, { passive: false });

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const envelopeContainer = document.getElementById('envelope-container');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelopeClosed = document.getElementById('envelope-closed');
    const envelopeOpened = document.getElementById('envelope-opened');
    const invitationContent = document.getElementById('invitation-content');
    const clickText = document.getElementById('click-text');
    
    // Card elements - use querySelectorAll to get cards from both envelope and invitation content
    const rsvpCards = document.querySelectorAll('#rsvp-card');
    const locationCards = document.querySelectorAll('#location-card');
    const detailsCards = document.querySelectorAll('#details-card');
    const galleryCards = document.querySelectorAll('#gallery-card');
    const savedateCards = document.querySelectorAll('#savedate-card');
    const registryCards = document.querySelectorAll('#registry-card');
    
    // Modal elements
    const rsvpModal = document.getElementById('rsvp-modal');
    const locationModal = document.getElementById('location-modal');
    const detailsModal = document.getElementById('details-modal');
    const galleryModal = document.getElementById('gallery-modal');
    const registryModal = document.getElementById('registry-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const backButtons = document.querySelectorAll('.modal-back-btn');
    
    // Debug: Check if elements are found
    console.log('RSVP Cards found:', rsvpCards.length);
    console.log('RSVP Modal found:', rsvpModal ? 'Yes' : 'No');
    
    // Get name and date elements
    const coupleNames = document.querySelector('.couple-names');
    const weddingDate = document.querySelector('.wedding-date');
    
    // Envelope click/touch handler
    function openEnvelope() {
        // Try to play music on envelope click (first interaction)
        if (backgroundMusic && backgroundMusic.paused) {
            backgroundMusic.play().catch(e => {
                console.log('Music play error:', e);
            });
        }
        
        // Hide names, date, closed envelope and click text
        if (coupleNames) coupleNames.style.opacity = '0';
        if (weddingDate) weddingDate.style.opacity = '0';
        envelopeClosed.style.opacity = '0';
        clickText.style.opacity = '0';
        
        setTimeout(() => {
            // Hide names, date, and click text completely
            if (coupleNames) coupleNames.style.display = 'none';
            if (weddingDate) weddingDate.style.display = 'none';
            if (clickText) clickText.style.display = 'none';
            // Show open envelope
            envelopeClosed.style.display = 'none';
            envelopeOpened.classList.remove('hidden');
            
            // Handle video - play once and stop
            const inviteVideo = document.getElementById('invite-video');
            if (inviteVideo) {
                // Video plays once and stops (no loop)
                inviteVideo.play();
            }
        }, 300);
    }
    
    envelopeWrapper.addEventListener('click', openEnvelope);
    envelopeWrapper.addEventListener('touchend', function(e) {
        e.preventDefault();
        openEnvelope();
    });

    // Back to envelope button handler
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        function goBackToEnvelope() {
            // Reset video
            const inviteVideo = document.getElementById('invite-video');
            if (inviteVideo) {
                inviteVideo.pause();
                inviteVideo.currentTime = 0;
            }
            
            // Reset ring animation
            const ringImage = document.querySelector('.ring-image');
            if (ringImage) {
                ringImage.style.animation = 'none';
                ringImage.style.opacity = '0';
            }
            
            // Reset back button animation
            if (backBtn) {
                backBtn.style.animation = 'none';
                backBtn.style.opacity = '0';
            }
            
            // Reset cards column animations
            const leftColumn = document.querySelector('.left-column');
            const rightColumn = document.querySelector('.right-column');
            if (leftColumn) {
                leftColumn.style.animation = 'none';
            }
            if (rightColumn) {
                rightColumn.style.animation = 'none';
            }
            
            // Reset flower animation
            const flower = document.querySelector('.flower-above-card');
            if (flower) {
                flower.style.animation = 'none';
                flower.style.opacity = '0';
            }
            
            // Hide open envelope
            envelopeOpened.classList.add('hidden');
            
            // Show envelope elements again
            envelopeClosed.style.display = '';
            envelopeClosed.style.opacity = '1';
            envelopeClosed.style.transform = '';
            
            if (coupleNames) {
                coupleNames.style.display = '';
                coupleNames.style.opacity = '1';
            }
            if (weddingDate) {
                weddingDate.style.display = '';
                weddingDate.style.opacity = '1';
            }
            if (clickText) {
                clickText.style.display = '';
                clickText.style.opacity = '1';
            }
            
            // Reset body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        }
        
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goBackToEnvelope();
        });
        backBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goBackToEnvelope();
        });
    }

    // Add hover effect to envelope (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        envelopeWrapper.addEventListener('mouseenter', function() {
            clickText.style.transform = 'scale(1.1)';
        });

        envelopeWrapper.addEventListener('mouseleave', function() {
            clickText.style.transform = 'scale(1)';
        });
    }

    // Card click/touch handlers
    let scrollPosition = 0;
    
    function openModal(modal) {
        // Save current scroll position
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
    }
    
    // Add event listeners to all RSVP cards
    rsvpCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            if (rsvpModal) {
                openModal(rsvpModal);
            } else {
                console.error('RSVP modal not found');
            }
        });
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (rsvpModal) {
                openModal(rsvpModal);
            } else {
                console.error('RSVP modal not found');
            }
        });
    });

    // Add event listeners to all Location cards
    locationCards.forEach(card => {
        card.addEventListener('click', function() {
            openModal(locationModal);
        });
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            openModal(locationModal);
        });
    });

    // Add event listeners to all Details cards
    detailsCards.forEach(card => {
        card.addEventListener('click', function() {
            openModal(detailsModal);
        });
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            openModal(detailsModal);
        });
    });

    // Add event listeners to all Save the Date cards
    savedateCards.forEach(card => {
        card.addEventListener('click', function() {
            openModal(galleryModal);
        });
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            openModal(galleryModal);
        });
    });

    // Add event listeners to all Registry cards (Click for DETAILS)
    registryCards.forEach(card => {
        card.addEventListener('click', function() {
            openModal(registryModal);
        });
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            openModal(registryModal);
        });
    });

    // Close modal handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Back button handlers
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking/touching outside
    [rsvpModal, locationModal, detailsModal, galleryModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        
        modal.addEventListener('touchend', function(e) {
            if (e.target === modal) {
                e.preventDefault();
                closeModal(modal);
            }
        });
    });

    // RSVP Form submission
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const attendance = this.querySelector('select').value;
            const notes = this.querySelector('textarea').value;
            
            // Here you would typically send this data to a server
            // For now, we'll just show an alert
            alert(`Thank you, ${name}! Your RSVP has been received. We'll send a confirmation to ${email}.`);
            
            // Reset form
            this.reset();
            
            // Close modal
            closeModal(rsvpModal);
        });
    }

    // Update location map and directions link
    // You can customize these values
    const venueAddress = encodeURIComponent('123 Wedding Street, City, State 12345');
    const mapIframe = document.getElementById('venue-map');
    const directionsLink = document.getElementById('directions-link');
    
    if (mapIframe) {
        // Google Maps embed URL - replace with your actual venue coordinates
        // Format: https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=ADDRESS
        // For now, using a placeholder - you'll need to add your Google Maps API key
        mapIframe.src = `https://www.google.com/maps/embed/v1/place?q=${venueAddress}`;
    }
    
    if (directionsLink) {
        directionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${venueAddress}`;
    }

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add keyboard support for closing modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            [rsvpModal, locationModal, detailsModal, galleryModal].forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    closeModal(modal);
                }
            });
        }
    });
    
    // Prevent iOS bounce scroll
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.modal-content') || e.target.closest('.invitation-content')) {
            return;
        }
    }, { passive: false });
});

