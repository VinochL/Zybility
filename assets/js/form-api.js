(() => {
  const API_BASE_URL = 'https://zybility-api.zybility.workers.dev';
  const phonePattern = /^(?:0|94)?7\d{8}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const cleanPhone = value => value.replace(/[\s()+-]/g, '');

  function validatePhone(input) {
    const valid = phonePattern.test(cleanPhone(input.value));
    input.setCustomValidity(valid ? '' : 'Please enter a valid Sri Lankan mobile or WhatsApp number.');
    return valid;
  }

  function validateEmail(input) {
    const valid = emailPattern.test(input.value.trim());
    input.setCustomValidity(valid ? '' : 'Please enter a valid email address.');
    return valid;
  }

  function prepareValidation(form) {
    const phone = form.querySelector('input[type="tel"]');
    const email = form.querySelector('input[type="email"]');

    phone?.addEventListener('input', () => validatePhone(phone));
    email?.addEventListener('input', () => validateEmail(email));

    return () => {
      if (phone) validatePhone(phone);
      if (email) validateEmail(email);
      return form.reportValidity();
    };
  }

  function showMessage(element, type, message) {
    element.className = `form-api-message ${type}`;
    element.textContent = message;
    element.hidden = false;
    element.focus();
  }

  function connectForm({ selector, endpoint, payload }) {
    const form = document.querySelector(selector);
    if (!form) return;

    const validate = prepareValidation(form);
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-api-message');
    const defaultButtonHtml = button.innerHTML;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      message.hidden = true;
      if (!validate()) return;

      button.disabled = true;
      button.textContent = 'Sending…';

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload(form))
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'We could not complete your submission. Please try again.');
        }

        showMessage(message, 'success', result.message || 'Your request was submitted successfully.');
        form.reset();
      } catch (error) {
        showMessage(message, 'error', error.message || 'We could not complete your submission. Please try again.');
      } finally {
        button.disabled = false;
        button.innerHTML = defaultButtonHtml;
      }
    });
  }

  connectForm({
    selector: '.contact-api-form',
    endpoint: '/contact',
    payload: form => ({
      name: form.elements.name.value.trim(),
      businessName: form.elements.business.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      businessType: form.elements.business_type.value.trim(),
      need: form.elements.need.value,
      projectDescription: form.elements.description.value.trim()
    })
  });

  connectForm({
    selector: '.support-request-form',
    endpoint: '/support-request',
    payload: form => ({
      contactName: form.elements.name.value.trim(),
      businessName: form.elements.business.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      businessLocation: form.elements.location.value.trim(),
      supportCategory: form.elements.category.value,
      affectedSystem: form.elements.affected_system.value.trim(),
      urgency: form.elements.urgency.value,
      internetAvailable: form.elements.internet_available.value,
      preferredContactMethod: form.elements.preferred_contact.value,
      issueDescription: form.elements.issue_description.value.trim(),
      troubleshootingAttempted: form.elements.attempted_steps.value.trim()
    })
  });
})();
