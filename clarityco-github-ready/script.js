// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate chart bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate data points in line chart
            const dataPoints = entry.target.querySelectorAll('.data-point');
            dataPoints.forEach((point, index) => {
                setTimeout(() => {
                    point.style.animation = 'dataPointGrow 0.8s ease-out forwards';
                }, index * 200);
            });
            
            // Animate gauge
            const gauge = entry.target.querySelector('.gauge-circle');
            if (gauge) {
                setTimeout(() => {
                    gauge.style.animation = 'gaugeFill 2s ease-out forwards';
                }, 1000);
            }
            
            // Animate pie chart
            const pieChart = entry.target.querySelector('.pie-chart-visual');
            if (pieChart) {
                setTimeout(() => {
                    pieChart.style.animation = 'pieRotate 2s ease-out forwards';
                }, 1500);
            }
            
            // Animate metric items
            const metricItems = entry.target.querySelectorAll('.metric-item');
            metricItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'all 0.6s ease-out';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                }, 2000 + (index * 150));
            });
        }
    });
}, observerOptions);

// Observe the analytics dashboard
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.querySelector('.analytics-dashboard');
    if (dashboard) {
        observer.observe(dashboard);
    }
});

// Phone Popup Functions
function showPhonePopup() {
    const popup = document.getElementById('phonePopup');
    if (popup) {
        popup.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closePhonePopup() {
    const popup = document.getElementById('phonePopup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close popup when clicking outside of it
window.onclick = function(event) {
    const popup = document.getElementById('phonePopup');
    if (event.target === popup) {
        closePhonePopup();
    }
}

// Close popup with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePhonePopup();
    }
});

// Client login functionality
document.addEventListener('DOMContentLoaded', function() {
    const clientLoginForm = document.getElementById('clientLoginForm');
    if (clientLoginForm) {
        clientLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');
            
            // Simple client authentication (in production, this would be server-side)
            const validCredentials = {
                'acme_user': 'acme2024',
                'techstart_user': 'tech2024',
                'localbiz_user': 'local2024'
            };
            
            if (validCredentials[username] && validCredentials[username] === password) {
                // Store client session
                localStorage.setItem('customerLoggedIn', 'true');
                localStorage.setItem('customerUser', username);
                // Redirect to customer dashboard
                window.location.href = 'customer-dashboard.html';
            } else {
                errorDiv.style.display = 'block';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            }
        });
    }
});
