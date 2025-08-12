// Initialize AOS animations
AOS.init({
  once: true,
  duration: 1000,
  easing: 'ease-out-quad',
});

// Mobile menu toggle
document.getElementById('mobile-menu-button')?.addEventListener('click', function() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    
    // Close mobile menu after clicking a link
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  });
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const formMessage = document.getElementById('form-message');
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Get form data
  const formData = {
    name: form.querySelector('#name').value.trim(),
    email: form.querySelector('#email').value.trim(),
    phone: form.querySelector('#phone').value.trim(),
    destination: form.querySelector('#destination').value,
    message: form.querySelector('#message').value.trim()
  };

  // Validate form
  if (!formData.name || !formData.email || !formData.message) {
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }

  if (!validateEmail(formData.email)) {
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }

  // Disable submit button during processing
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>';

  // Replace with your Google Apps Script URL
  const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  
  // Send data to Google Apps Script
  fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    if (data.status === "success") {
      showFormMessage('Thank you for your inquiry! We will get back to you soon.', 'success');
      form.reset();
    } else {
      throw new Error(data.message || 'Unknown error occurred');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showFormMessage('There was an error submitting your form. Please try again or contact us directly.', 'error');
  })
  .finally(() => {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send Your Inquiry <i class="fas fa-paper-plane ml-2"></i>';
  });
});

// Helper functions
function showFormMessage(message, type) {
  const formMessage = document.getElementById('form-message');
  formMessage.textContent = message;
  formMessage.classList.remove('hidden');
  
  if (type === 'success') {
    formMessage.classList.remove('text-red-600');
    formMessage.classList.add('text-green-600');
  } else {
    formMessage.classList.remove('text-green-600');
    formMessage.classList.add('text-red-600');
  }
  
  setTimeout(() => {
    formMessage.classList.add('hidden');
  }, 5000);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}