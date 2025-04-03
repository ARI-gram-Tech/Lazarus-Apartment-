document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Initialize Swiper
    const swiper = new Swiper('.mySwiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    document.getElementById('booking-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const bookingData = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          bookingType: formData.get('booking-type'),
          date: formData.get('date'),
          message: formData.get('message')
        };
      
        try {
          console.log('Submitting:', bookingData); // Log before sending
          
          const response = await fetch('http://localhost:3001/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
          });
      
          const result = await response.json();
          console.log('Server response:', result); // Log server response
          
          if (!response.ok) {
            throw new Error(result.error || 'Failed to submit booking');
          }
      
          alert(result.message);
          form.reset();
          
        } catch (error) {
          console.error('Booking error:', {
            message: error.message,
            stack: error.stack
          });
          alert(`Error: ${error.message}`);
        }
      });

    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('nav');
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .apartment-card, .amenity-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});