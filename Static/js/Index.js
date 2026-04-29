// ======================= GLOBAL DOM ELEMENTS =======================
const body = document.body;
const themeToggleBtn = document.getElementById('themeToggleBtn');
const moonIcon = themeToggleBtn?.querySelector('.fa-moon');
const sunIcon = themeToggleBtn?.querySelector('.fa-sun');
const toggleTextSpan = themeToggleBtn?.querySelector('.toggle-text');

// Load theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  if (moonIcon) moonIcon.style.display = 'none';
  if (sunIcon) sunIcon.style.display = 'inline-block';
  if (toggleTextSpan) toggleTextSpan.innerText = 'Light';
} else {
  body.classList.remove('light-mode');
  if (moonIcon) moonIcon.style.display = 'inline-block';
  if (sunIcon) sunIcon.style.display = 'none';
  if (toggleTextSpan) toggleTextSpan.innerText = 'Dark';
}

// Theme toggle logic
function toggleTheme() {
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    if (moonIcon) moonIcon.style.display = 'inline-block';
    if (sunIcon) sunIcon.style.display = 'none';
    if (toggleTextSpan) toggleTextSpan.innerText = 'Dark';
  } else {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    if (moonIcon) moonIcon.style.display = 'none';
    if (sunIcon) sunIcon.style.display = 'inline-block';
    if (toggleTextSpan) toggleTextSpan.innerText = 'Light';
  }
}
if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

// ======================= CV OPEN =======================
const cvBtn = document.getElementById('openCVBtn');
if (cvBtn) {
  cvBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Create a downloadable CV placeholder or open actual CV
    alert('📄 CV Preview: You can upload your actual CV PDF to the "Static/" folder and link it here.');
    // Uncomment below when you have your CV file:
    // window.open('Static/Lindokuhle_Qwabe_CV.pdf', '_blank');
  });
}

// ======================= ACTIVE NAVIGATION (highlight sections) =======================
const sections = document.querySelectorAll('.section');
const verticalNavLinks = document.querySelectorAll('.nav-link-vertical');
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

function updateActiveNav() {
  let currentSectionId = '';
  const scrollPosition = window.scrollY + 150;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentSectionId = section.getAttribute('id');
    }
  });
  if (!currentSectionId && window.scrollY < 100) currentSectionId = 'home';
  // Update vertical nav
  verticalNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.parentElement.classList.remove('active');
    if (href === `#${currentSectionId}`) {
      link.parentElement.classList.add('active');
    }
  });
  // Update bottom nav
  bottomNavItems.forEach(item => {
    const href = item.getAttribute('href');
    item.classList.remove('active');
    if (href === `#${currentSectionId}`) {
      item.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"], .bottom-nav-item, .nav-link-vertical').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ======================= MODALS (Project Details) =======================
const modals = document.querySelectorAll('.modal');
const detailBtns = document.querySelectorAll('.project-details-btn');
const closeModals = document.querySelectorAll('.close-modal');

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'flex';
}
function closeAllModals() {
  modals.forEach(m => m.style.display = 'none');
}
detailBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modalId = btn.getAttribute('data-modal');
    if (modalId) openModal(modalId);
  });
});
closeModals.forEach(closeBtn => {
  closeBtn.addEventListener('click', closeAllModals);
});
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) closeAllModals();
});

// ======================= EMAILJS INTEGRATION (DIRECT EMAIL FROM JS) =======================
// You need to:
// 1. Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your Public Key, Service ID, and Template ID

// EmailJS Configuration (REPLACE WITH YOUR ACTUAL CREDENTIALS)
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',     // Get from EmailJS dashboard
  SERVICE_ID: 'YOUR_SERVICE_ID',             // Your email service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID'            // Your email template ID
};

// Initialize EmailJS
(function initEmailJS() {
  // Check if EmailJS is loaded
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('EmailJS initialized successfully');
  } else {
    console.warn('EmailJS not loaded. Make sure to include the EmailJS script in your HTML');
  }
})();

// Quick Message Form Handler
const form = document.getElementById('quickMessageForm');
const feedbackDiv = document.getElementById('formFeedback');
const sendBtn = document.getElementById('sendMsgBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const senderEmail = document.getElementById('senderEmail').value.trim();
    const message = document.getElementById('messageText').value.trim();
    
    // Validation
    if (!senderEmail || !message) {
      showFeedback('❌ Please fill in both your email and message.', 'error');
      return;
    }
    
    if (!isValidEmail(senderEmail)) {
      showFeedback('❌ Please enter a valid email address.', 'error');
      return;
    }
    
    // Show loading state
    showFeedback('📡 Sending your message...', 'loading');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
      // Check if EmailJS is available
      if (typeof emailjs === 'undefined') {
        throw new Error('Email service not initialized. Please check your internet connection.');
      }
      
      // Prepare template parameters
      const templateParams = {
        from_email: senderEmail,
        message: message,
        to_email: 'lindokuhle@dut4life.ac.za', // Your email address
        subject: `Portfolio Contact: Message from ${senderEmail}`,
        reply_to: senderEmail,
        date: new Date().toLocaleString()
      };
      
      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email sent successfully:', response);
      showFeedback('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      
    } catch (error) {
      console.error('Email send error:', error);
      showFeedback(`⚠️ Failed to send: ${error.message || 'Please try again later or contact me directly.'}`, 'error');
    } finally {
      // Reset button state
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Send Message';
      
      // Clear feedback after 5 seconds
      setTimeout(() => {
        if (feedbackDiv) feedbackDiv.innerHTML = '';
      }, 5000);
    }
  });
}

// Helper function to show feedback messages
function showFeedback(message, type) {
  if (feedbackDiv) {
    feedbackDiv.innerHTML = `<span class="${type}">${message}</span>`;
  }
}

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return emailRegex.test(email);
}

// ======================= ALTERNATIVE: SMTP.JS (Another Option) =======================
// If you prefer SMTP.js instead of EmailJS, here's an alternative approach:
/*
async function sendEmailWithSMTPJS(senderEmail, message) {
  try {
    const response = await Email.send({
      Host: "smtp.gmail.com",
      Username: "your-email@gmail.com",
      Password: "your-app-password", // Use Gmail App Password
      To: 'lindokuhle@dut4life.ac.za',
      From: senderEmail,
      Subject: `Portfolio Contact: Message from ${senderEmail}`,
      Body: `
        <h3>New Message from Portfolio</h3>
        <p><strong>From:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
      `
    });
    return response === 'OK';
  } catch (error) {
    console.error('SMTP.js error:', error);
    return false;
  }
}
*/

// ======================= ANIMATION ON SCROLL (Optional Enhancement) =======================
// Add fade-in animations for elements when they come into view
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply fade-in animation to glass cards and sections
document.querySelectorAll('.glass-card, .project-card, .skill-pill, .section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ======================= TOOLTIPS FOR SKILL ICONS (Optional) =======================
const skillIcons = document.querySelectorAll('.skills-icons i');
skillIcons.forEach(icon => {
  icon.addEventListener('mouseenter', (e) => {
    const skillName = icon.className.split(' ')[1]?.replace('fa-', '').toUpperCase() || 'Skill';
    // You can add a custom tooltip here if desired
  });
});








// ======================= FLIP CARD ENHANCEMENT =======================
// Ensure flip cards work smoothly on touch devices
const flipCards = document.querySelectorAll('.skill-card[data-flip="true"]');

if (flipCards.length > 0) {
  // For touch devices - flip on tap instead of hover
  if ('ontouchstart' in window) {
    flipCards.forEach(card => {
      let isFlipped = false;
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const inner = card.querySelector('.skill-card-inner');
        if (!isFlipped) {
          inner.style.transform = 'rotateY(180deg)';
          isFlipped = true;
        } else {
          inner.style.transform = 'rotateY(0deg)';
          isFlipped = false;
        }
      });
    });
  }
  
  // Reset flip when clicking elsewhere (for touch devices)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.skill-card[data-flip="true"]') && 'ontouchstart' in window) {
      flipCards.forEach(card => {
        const inner = card.querySelector('.skill-card-inner');
        inner.style.transform = 'rotateY(0deg)';
      });
    }
  });
}

// Add loading animation for skill logos
const skillLogos = document.querySelectorAll('.skill-logo');
skillLogos.forEach(logo => {
  logo.addEventListener('load', () => {
    logo.style.opacity = '0';
    logo.style.animation = 'fadeIn 0.5s ease forwards';
  });
});














// ======================= ANIMATE CIRCULAR PROGRESS BARS =======================
function animateCircularProgress() {
  const flipCards = document.querySelectorAll('.skill-card[data-flip="true"]');
  
  flipCards.forEach(card => {
    const progressCircle = card.querySelector('.circle-progress');
    const percentageText = card.querySelector('.progress-percentage');
    
    if (progressCircle && percentageText && !card.hasAttribute('data-animated')) {
      const percentage = parseInt(percentageText.textContent);
      const radius = 52;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage / 100) * circumference;
      
      // Set circle properties
      progressCircle.style.strokeDasharray = circumference;
      progressCircle.style.strokeDashoffset = circumference;
      
      // Create observer to trigger animation when card is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              progressCircle.style.strokeDashoffset = offset;
              card.setAttribute('data-animated', 'true');
            }, 200);
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(card);
    }
  });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', animateCircularProgress);
window.addEventListener('load', animateCircularProgress);














// ======================= DATE & TIME WIDGET =======================
function updateDateTime() {
  const now = new Date();
  const timeElement = document.getElementById('currentTime');
  const dateElement = document.getElementById('currentDate');
  
  if (timeElement) {
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
  }
  
  if (dateElement) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
  }
}

updateDateTime();
setInterval(updateDateTime, 60000); // Update every minute

// ======================= WEATHER WIDGET =======================
const WEATHER_API_KEY = '3425623991264e609b5201136252205'; // Replace with your WeatherAPI key
let currentLocation = 'Durban';
let useUserLocation = false;

async function fetchWeather(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`
    );
    
    if (!response.ok) throw new Error('Weather fetch failed');
    
    const data = await response.json();
    
    // Update weather widget with new structure
    const locationEl = document.getElementById('weatherLocation');
    const tempEl = document.getElementById('weatherTemp');
    const conditionEl = document.getElementById('weatherCondition');
    const iconEl = document.getElementById('weatherIcon');
    
    if (locationEl) {
      locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.location.name}`;
    }
    if (tempEl) tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;
    if (conditionEl) conditionEl.textContent = data.current.condition.text;
    if (iconEl) {
      iconEl.innerHTML = `<img src="${data.current.condition.icon}" alt="${data.current.condition.text}">`;
    }
    
    currentLocation = data.location.name;
    
  } catch (error) {
    console.error('Weather fetch error:', error);
    const conditionEl = document.getElementById('weatherCondition');
    if (conditionEl) conditionEl.textContent = 'Weather unavailable';
  }
}

// Get user's location
function getUserLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }
  
  const locateBtn = document.getElementById('locateMeBtn');
  if (locateBtn) {
    locateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      await fetchWeather(`${latitude},${longitude}`);
      useUserLocation = true;
      
      if (locateBtn) {
        locateBtn.innerHTML = '<i class="fas fa-location-dot"></i>';
        locateBtn.style.opacity = '0.7';
        setTimeout(() => {
          locateBtn.style.opacity = '1';
        }, 500);
      }
    },
    (error) => {
      console.error('Location error:', error);
      alert('Unable to get your location. Showing default weather for Durban.');
      fetchWeather('Durban');
      
      if (locateBtn) {
        locateBtn.innerHTML = '<i class="fas fa-location-dot"></i>';
      }
    }
  );
}

// Initialize weather
fetchWeather('Durban');

// Set up location button
const locateBtn = document.getElementById('locateMeBtn');
if (locateBtn) {
  locateBtn.addEventListener('click', getUserLocation);
}

// Refresh weather every 30 minutes
setInterval(() => {
  if (useUserLocation && currentLocation) {
    fetchWeather(currentLocation);
  } else {
    fetchWeather('Durban');
  }
}, 1800000);

// ======================= UPDATED THEME TOGGLE (Slider Switch) =======================
const themeCheckbox = document.getElementById('themeToggleCheckbox');

// Load theme preference
const savedThemeForToggle = localStorage.getItem('theme') || 'dark';
if (savedThemeForToggle === 'light') {
  body.classList.add('light-mode');
  if (themeCheckbox) themeCheckbox.checked = true;
} else {
  body.classList.remove('light-mode');
  if (themeCheckbox) themeCheckbox.checked = false;
}

// Theme toggle function for slider
function toggleThemeWithSlider() {
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    if (themeCheckbox) themeCheckbox.checked = false;
  } else {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    if (themeCheckbox) themeCheckbox.checked = true;
  }
}

if (themeCheckbox) {
  themeCheckbox.addEventListener('change', toggleThemeWithSlider);
}

// ========== UPDATE CV BUTTON FUNCTIONALITY ==========
const cvActionBtn = document.querySelector('.cv-action');
if (cvActionBtn) {
  cvActionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('📄 CV Preview: You can upload your actual CV PDF to the "Static/" folder and link it here.');
    // window.open('Static/Lindokuhle_Qwabe_CV.pdf', '_blank');
  });
}














// ======================= BACKGROUND IMAGE SWAPPER =======================
// ======================= FULL WIDTH BACKGROUND IMAGE SWAPPER =======================
function updateBackgroundImages() {
  const darkBgDiv = document.querySelector('.home-bg.dark-bg');
  const lightBgDiv = document.querySelector('.home-bg.light-bg');
  const isLightMode = body.classList.contains('light-mode');
  
  if (darkBgDiv && lightBgDiv) {
    if (isLightMode) {
      darkBgDiv.style.opacity = '0';
      lightBgDiv.style.opacity = '1';
    } else {
      darkBgDiv.style.opacity = '1';
      lightBgDiv.style.opacity = '0';
    }
  }
}

// Set background images dynamically
function setBackgroundImages(darkImageUrl, lightImageUrl) {
  // Remove existing background divs if any
  const existingBgs = document.querySelectorAll('.home-bg');
  existingBgs.forEach(bg => bg.remove());
  
  // Create dark mode background
  const darkBgDiv = document.createElement('div');
  darkBgDiv.className = 'home-bg dark-bg';
  darkBgDiv.style.backgroundImage = `url('${darkImageUrl}')`;
  darkBgDiv.style.opacity = '1';
  document.body.insertBefore(darkBgDiv, document.body.firstChild);
  
  // Create light mode background
  const lightBgDiv = document.createElement('div');
  lightBgDiv.className = 'home-bg light-bg';
  lightBgDiv.style.backgroundImage = `url('${lightImageUrl}')`;
  lightBgDiv.style.opacity = '0';
  document.body.insertBefore(lightBgDiv, document.body.firstChild);
  
  // Initial opacity update
  updateBackgroundImages();
}

// Initialize backgrounds with your images (update these paths)
const darkBgImage = 'Static/images/dark2.jpg';  // Change to your dark mode image path
const lightBgImage = 'Static/images/light1.jpg'; // Change to your light mode image path

setBackgroundImages(darkBgImage, lightBgImage);

// Listen for theme changes to swap backgrounds
const themeToggleCheckbox = document.getElementById('themeToggleCheckbox');
if (themeToggleCheckbox) {
  themeToggleCheckbox.addEventListener('change', () => {
    setTimeout(updateBackgroundImages, 50);
  });
}

// Also update when theme is toggled via other methods
const originalToggleTheme = toggleThemeWithSlider;
if (typeof toggleThemeWithSlider === 'function') {
  window.toggleThemeWithSlider = function() {
    originalToggleTheme();
    updateBackgroundImages();
  };
}












console.log('Portfolio initialized successfully!');