(function () {
  const consentCookieName = 'zybility_cookie_consent';
  const cookiePopup = document.getElementById('cookieConsent');
  const allowCookiesBtn = document.getElementById('allowCookiesBtn');
  const playground = document.querySelector('main');
  const smsForm = document.getElementById('smsDemoForm');
  const smsDemoType = document.getElementById('smsDemoType');
  const smsPhone = document.getElementById('smsPhone');
  const smsPhoneValidation = document.getElementById('smsPhoneValidation');
  const smsPreview = document.getElementById('smsPreview');
  const sendSmsBtn = document.getElementById('sendSmsBtn');
  const smsStatus = document.getElementById('smsStatus');
  const smsSuccess = document.getElementById('smsSuccess');
  const smsError = document.getElementById('smsError');
  const whatsAppForm = document.getElementById('whatsAppDemoForm');
  const whatsAppDemoType = document.getElementById('whatsAppDemoType');
  const whatsAppPhone = document.getElementById('whatsAppPhone');
  const whatsAppPhoneValidation = document.getElementById('whatsAppPhoneValidation');
  const whatsAppConsent = document.getElementById('whatsAppConsent');
  const whatsAppPreview = document.getElementById('whatsAppPreview');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const whatsAppStatus = document.getElementById('whatsAppStatus');
  const whatsAppSuccess = document.getElementById('whatsAppSuccess');
  const whatsAppError = document.getElementById('whatsAppError');
  const receiptForm = document.getElementById('receiptDemoForm');
  const receiptPhone = document.getElementById('receiptPhone');
  const receiptPhoneValidation = document.getElementById('receiptPhoneValidation');
  const receiptTypeInputs = document.querySelectorAll('input[name="receiptType"]');
  const sendReceiptBtn = document.getElementById('sendReceiptBtn');
  const receiptStatus = document.getElementById('receiptStatus');
  const receiptSuccess = document.getElementById('receiptSuccess');
  const receiptError = document.getElementById('receiptError');
  const API_BASE_URL = 'https://zybility-api.zybility.workers.dev';
  const smsApiUrl = `${API_BASE_URL}/playground/sms`;
  const whatsAppApiUrl = `${API_BASE_URL}/playground/whatsapp`;
  const receiptApiUrl = `${API_BASE_URL}/playground/receipt`;
  let smsRequestInProgress = false;
  let smsDemoCompleted = false;
  let whatsAppRequestInProgress = false;
  let whatsAppDemoCompleted = false;
  let receiptRequestInProgress = false;
  let receiptDemoCompleted = false;

  const smsPreviewTemplates = {
    payment: `Zybility API Demo

Payment received successfully.

Sample Amount: LKR 2,500.00

This is a demonstration of automated payment notifications.

Zybility.lk`,
    order: `Zybility API Demo

Your sample order has been confirmed successfully.

Zybility.lk`,
    invoice: `Zybility API Demo

Your sample invoice has been generated successfully.

Zybility.lk`,
    account: `Zybility API Demo

Sample Account Update

Current Outstanding:
LKR 5,250.00

Zybility.lk`,
    appointment: `Zybility API Demo

This is your sample appointment reminder.

Zybility.lk`,
    notification: `Zybility API Demo

This is a demonstration of automated SMS notifications.

Zybility.lk`
  };

  const whatsAppPreviewTemplates = {
    receipt: `Zybility WhatsApp Demo

Your sample digital receipt is ready.

Receipt #ZB-1048
Total: LKR 4,850.00
Status: Paid

Zybility.lk`,
    order: `Zybility WhatsApp Demo

Your sample order has been confirmed successfully. We will let you know when it is ready.

Zybility.lk`,
    payment: `Zybility WhatsApp Demo

Payment received successfully.

Sample Amount: LKR 2,500.00

Zybility.lk`,
    account: `Zybility WhatsApp Demo

Sample Account Update

Current Outstanding: LKR 5,250.00

Zybility.lk`,
    invoice: `Zybility WhatsApp Demo

Your sample invoice has been generated successfully.

Zybility.lk`,
    notification: `Zybility WhatsApp Demo

This is a demonstration of automated WhatsApp notifications.

Zybility.lk`
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }

  function hasConsent() {
    return getCookie(consentCookieName) === 'accepted';
  }

  function setCookieConsent() {
    let cookie = `${consentCookieName}=accepted; Max-Age=31536000; Path=/; SameSite=Lax;`;
    if (window.location.protocol === 'https:') cookie += ' Secure;';
    document.cookie = cookie;
  }

  function normalizeReceiptPhone(value) {
    const compact = value.replace(/[\s()-]/g, '');
    if (/^07\d{8}$/.test(compact)) return `94${compact.slice(1)}`;
    if (/^\+947\d{8}$/.test(compact)) return compact.slice(1);
    if (/^947\d{8}$/.test(compact)) return compact;
    if (/^7\d{8}$/.test(compact)) return `94${compact}`;
    return '';
  }

  function validateReceiptPhone(showEmptyError = false) {
    if (!receiptPhone) return false;
    let message = '';
    const value = receiptPhone.value.trim();
    if (!value) {
      if (showEmptyError) message = 'Please enter your WhatsApp number.';
    } else if (!normalizeReceiptPhone(value)) {
      message = 'Enter a valid Sri Lankan mobile number such as 0771234567.';
    }
    receiptPhone.setCustomValidity(message);
    receiptPhone.classList.toggle('field-invalid', Boolean(message));
    receiptPhoneValidation.textContent = message;
    return Boolean(value) && !message;
  }

  function selectedReceiptType() {
    const selected = document.querySelector('input[name="receiptType"]:checked');
    return ['image', 'pdf'].includes(selected?.value) ? selected.value : '';
  }

  function updateReceiptFormState() {
    document.querySelectorAll('.receipt-type-card').forEach(card => {
      card.classList.toggle('selected', Boolean(card.querySelector('input:checked')));
    });
    if (sendReceiptBtn) {
      sendReceiptBtn.disabled = !(validateReceiptPhone(false) && selectedReceiptType() && hasConsent());
    }
  }

  function resetReceiptResults() {
    receiptStatus.textContent = '';
    receiptSuccess.classList.add('hidden');
    receiptSuccess.innerHTML = '';
    receiptError.classList.add('hidden');
    receiptError.innerHTML = '';
  }

  function showReceiptError(message) {
    receiptStatus.textContent = '';
    receiptError.textContent = message;
    receiptError.classList.remove('hidden');
  }

  function showReceiptBlocked() {
    receiptRequestInProgress = false;
    receiptDemoCompleted = true;
    sendReceiptBtn.disabled = true;
    sendReceiptBtn.textContent = 'Demo Already Used';
    receiptStatus.textContent = '';
    receiptError.innerHTML = `<h3>Demo Already Used</h3>
      <p>A Digital Receipt demonstration has already been requested from this connection.</p>
      <p>Please try again after the 24-hour demo period.</p>
      <a class="btn btn-secondary" href="/solutions/api-integrations/">Explore Digital Receipt Integration <span class="arrow">→</span></a>`;
    receiptError.classList.remove('hidden');
  }

  function showReceiptSuccess(receiptType, data) {
    receiptDemoCompleted = true;
    sendReceiptBtn.disabled = true;
    sendReceiptBtn.textContent = 'Sent Successfully ✓';
    receiptStatus.textContent = '';
    const detail = receiptType === 'image'
      ? 'Your visual receipt has been sent directly to WhatsApp.'
      : 'Your PDF receipt has been sent to WhatsApp and is ready to save or share.';
    const maskedPhone = escapeHtml(data?.data?.phone || 'your WhatsApp number');
    const confirmedType = ['image', 'pdf'].includes(data?.data?.receiptType)
      ? data.data.receiptType
      : receiptType;
    receiptSuccess.innerHTML = `<div class="sms-success-title">✓ ${escapeHtml(data?.message || 'Demo Receipt Sent')}</div>
      <p class="sms-phone-check">Check your WhatsApp.</p>
      <p class="demo-response-meta">${confirmedType === 'image' ? 'Image' : 'PDF'} receipt sent to <strong>${maskedPhone}</strong></p>
      <p>${detail}</p>
      <h3>That's paperless billing.</h3>
      <p>Zybility systems can automatically generate and deliver receipts to customers immediately after a transaction.</p>
      <a class="btn btn-primary" href="/contact/">Add Digital Receipts to My Business <span class="arrow">→</span></a>`;
    receiptSuccess.classList.remove('hidden');
  }

  async function sendReceiptDemo() {
    if (receiptRequestInProgress || receiptDemoCompleted || sendReceiptBtn.disabled) return;
    resetReceiptResults();
    if (!hasConsent()) {
      showConsentPopup();
      updateReceiptFormState();
      return;
    }
    if (!validateReceiptPhone(true)) {
      receiptPhone.focus();
      updateReceiptFormState();
      return;
    }
    const receiptType = selectedReceiptType();
    if (!receiptType) return;
    const normalizedPhone = normalizeReceiptPhone(receiptPhone.value.trim());
    receiptRequestInProgress = true;
    sendReceiptBtn.disabled = true;
    sendReceiptBtn.textContent = 'Preparing Receipt...';
    receiptStatus.textContent = 'Preparing Receipt...';
    await new Promise(resolve => setTimeout(resolve, 350));
    sendReceiptBtn.textContent = receiptType === 'image' ? 'Generating Image Receipt...' : 'Generating PDF Receipt...';
    receiptStatus.textContent = receiptType === 'image' ? 'Generating Image Receipt...' : 'Generating PDF Receipt...';
    await new Promise(resolve => setTimeout(resolve, 450));
    sendReceiptBtn.textContent = 'Sending to WhatsApp...';
    receiptStatus.textContent = 'Sending to WhatsApp...';

    try {
      const response = await fetch(receiptApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizedPhone,
          receiptType,
          consentAccepted: true
        })
      });
      const data = await response.json().catch(() => ({}));
      if (data.code === 'DEMO_LIMIT_REACHED') {
        showReceiptBlocked();
        return;
      }
      if (data.code === 'RECEIPT_MEDIA_UNAVAILABLE') {
        receiptRequestInProgress = false;
        sendReceiptBtn.textContent = 'Try Again';
        receiptError.innerHTML = `<h3>PDF Receipt Temporarily Unavailable</h3>
          <p>${escapeHtml(data.message || 'The demo PDF receipt is temporarily unavailable.')}</p>
          <button class="btn btn-secondary" id="tryImageReceipt" type="button">Try Image Receipt <span class="arrow">→</span></button>`;
        receiptError.classList.remove('hidden');
        document.getElementById('tryImageReceipt')?.addEventListener('click', function () {
          const imageOption = document.querySelector('input[name="receiptType"][value="image"]');
          if (imageOption) imageOption.checked = true;
          resetReceiptResults();
          sendReceiptBtn.textContent = 'Send Demo Receipt';
          updateReceiptFormState();
        });
        updateReceiptFormState();
        return;
      }
      if (!response.ok || !data.success) {
        receiptRequestInProgress = false;
        sendReceiptBtn.textContent = 'Try Again';
        showReceiptError(data.message || 'We could not send the demo receipt. Please try again.');
        updateReceiptFormState();
        return;
      }
      receiptRequestInProgress = false;
      showReceiptSuccess(receiptType, data);
    } catch {
      receiptRequestInProgress = false;
      sendReceiptBtn.textContent = 'Try Again';
      showReceiptError('The Digital Receipt service is temporarily unavailable. Please try again.');
      updateReceiptFormState();
    }
  }

  function showConsentPopup() {
    playground?.setAttribute('inert', '');
    document.body.classList.add('cookie-consent-open');
    cookiePopup?.classList.remove('hidden');
    allowCookiesBtn?.focus();
  }

  function hideConsentPopup() {
    playground?.removeAttribute('inert');
    document.body.classList.remove('cookie-consent-open');
    cookiePopup?.classList.add('hidden');
  }

  function updateSmsPreview() {
    if (smsPreview && smsDemoType) {
      smsPreview.textContent = smsPreviewTemplates[smsDemoType.value] || '';
    }
  }

  function validateSmsPhone(showEmptyError = false) {
    const phone = smsPhone.value;
    let message = '';

    if (!phone) {
      if (showEmptyError) message = 'Please enter your mobile number.';
    } else if (!/^\d+$/.test(phone)) {
      message = 'Use numbers only. Spaces and symbols are not allowed.';
    } else if (phone.length !== 10) {
      message = 'The mobile number must contain exactly 10 digits.';
    } else if (!/^07\d{8}$/.test(phone)) {
      message = 'Enter a valid Sri Lankan mobile number starting with 07.';
    }

    smsPhone.setCustomValidity(message);
    smsPhone.classList.toggle('field-invalid', Boolean(message));
    smsPhoneValidation.textContent = message;
    return !message;
  }

  function resetResults() {
    smsStatus.textContent = '';
    smsSuccess.classList.add('hidden');
    smsSuccess.innerHTML = '';
    smsError.classList.add('hidden');
    smsError.innerHTML = '';
  }

  function showError(message) {
    smsStatus.textContent = '';
    smsError.textContent = message;
    smsError.classList.remove('hidden');
  }

  function showBlockedResult() {
    sendSmsBtn.textContent = 'Demo Already Used';
    sendSmsBtn.disabled = true;
    smsStatus.textContent = '';
    smsError.innerHTML = `<h3>You've Already Experienced the Demo</h3>
      <p>Two Zybility SMS demonstrations have already been used from this connection.</p>
      <p>Your next demonstration will be available after the 24-hour demo limit.</p>
      <a class="btn btn-secondary" href="/solutions/api-integrations/">Explore SMS Integration <span class="arrow">→</span></a>`;
    smsError.classList.remove('hidden');
  }

  function showSuccessResult() {
    sendSmsBtn.textContent = 'Sent Successfully ✓';
    sendSmsBtn.disabled = true;
    smsDemoCompleted = true;
    smsStatus.textContent = '';
    smsSuccess.innerHTML = `<div class="sms-success-title">✓ Demo SMS Sent Successfully</div>
      <p class="sms-phone-check">Check your phone 📱</p>
      <h3>That's Automation.</h3>
      <p>The same technology can automatically communicate with your customers when they make payments, place orders, receive invoices or need reminders.</p>
      <a class="btn btn-primary" href="/contact/">Add SMS to My Business <span class="arrow">→</span></a>`;
    smsSuccess.classList.remove('hidden');
  }

  async function sendSmsDemo() {
    if (smsRequestInProgress || smsDemoCompleted || sendSmsBtn.disabled) return;

    resetResults();

    if (!hasConsent()) {
      showConsentPopup();
      return;
    }

    const phone = smsPhone.value;
    if (!validateSmsPhone(true)) {
      showError(smsPhone.validationMessage);
      smsPhone.focus();
      return;
    }

    sendSmsBtn.disabled = true;
    smsRequestInProgress = true;
    sendSmsBtn.textContent = 'Checking Request...';
    smsStatus.textContent = 'Checking Request...';

    await new Promise(resolve => requestAnimationFrame(resolve));
    smsStatus.textContent = 'Sending SMS...';
    sendSmsBtn.textContent = 'Sending SMS...';

    try {
      const response = await fetch(smsApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          demoType: smsDemoType.value,
          consentAccepted: true
        })
      });

      const data = await response.json().catch(() => ({}));
      if (data.code === 'DEMO_LIMIT_REACHED') {
        smsRequestInProgress = false;
        showBlockedResult();
        return;
      }
      if (!response.ok || !data.success) {
        smsRequestInProgress = false;
        sendSmsBtn.disabled = false;
        sendSmsBtn.textContent = 'Try Again';
        showError(data.message || 'We could not send the demo SMS. Please try again.');
        return;
      }

      smsRequestInProgress = false;
      showSuccessResult();
    } catch {
      smsRequestInProgress = false;
      sendSmsBtn.disabled = false;
      sendSmsBtn.textContent = 'Try Again';
      showError('The SMS service is temporarily unavailable. Please try again.');
    }
  }

  function updateWhatsAppPreview() {
    if (whatsAppPreview && whatsAppDemoType) {
      whatsAppPreview.textContent = whatsAppPreviewTemplates[whatsAppDemoType.value] || '';
    }
  }

  function validateWhatsAppPhone(showEmptyError = false) {
    const phone = whatsAppPhone.value;
    let message = '';
    if (!phone) {
      if (showEmptyError) message = 'Please enter your WhatsApp number.';
    } else if (!/^\d+$/.test(phone)) {
      message = 'Use numbers only. Spaces and symbols are not allowed.';
    } else if (phone.length !== 10) {
      message = 'The WhatsApp number must contain exactly 10 digits.';
    } else if (!/^07\d{8}$/.test(phone)) {
      message = 'Enter a valid Sri Lankan mobile number starting with 07.';
    }
    whatsAppPhone.setCustomValidity(message);
    whatsAppPhone.classList.toggle('field-invalid', Boolean(message));
    whatsAppPhoneValidation.textContent = message;
    return !message;
  }

  function resetWhatsAppResults() {
    whatsAppStatus.textContent = '';
    whatsAppSuccess.classList.add('hidden');
    whatsAppSuccess.innerHTML = '';
    whatsAppError.classList.add('hidden');
    whatsAppError.innerHTML = '';
  }

  function showWhatsAppError(message) {
    whatsAppStatus.textContent = '';
    whatsAppError.textContent = message;
    whatsAppError.classList.remove('hidden');
  }

  function showWhatsAppBlocked() {
    whatsAppRequestInProgress = false;
    whatsAppDemoCompleted = true;
    sendWhatsAppBtn.disabled = true;
    sendWhatsAppBtn.textContent = 'Demo Limit Reached';
    whatsAppStatus.textContent = '';
    whatsAppError.innerHTML = `<h3>You've Already Experienced the WhatsApp Demo</h3>
      <p>Two Zybility WhatsApp demonstrations have already been used from this connection.</p>
      <p>Your next demonstration will be available after the 24-hour demo limit.</p>
      <a class="btn btn-secondary" href="/solutions/api-integrations/">Explore WhatsApp Integration <span class="arrow">→</span></a>`;
    whatsAppError.classList.remove('hidden');
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function showWhatsAppSuccess(data) {
    whatsAppDemoCompleted = true;
    sendWhatsAppBtn.disabled = true;
    sendWhatsAppBtn.textContent = 'Sent Successfully ✓';
    whatsAppStatus.textContent = '';
    const apiMessage = escapeHtml(data?.message || 'Demo WhatsApp message sent successfully.');
    const maskedPhone = escapeHtml(data?.data?.phone || 'your WhatsApp number');
    const remainingDemos = Number.isFinite(Number(data?.data?.remainingDemos))
      ? Math.max(0, Number(data.data.remainingDemos))
      : null;
    whatsAppSuccess.innerHTML = `<div class="sms-success-title">✓ ${apiMessage}</div>
      <p class="sms-phone-check">Check your WhatsApp 📱</p>
      <p class="demo-response-meta">Sent to <strong>${maskedPhone}</strong>${remainingDemos === null ? '' : ` · ${remainingDemos} WhatsApp demo${remainingDemos === 1 ? '' : 's'} remaining today`}</p>
      <h3>That's Automation.</h3>
      <p>The same technology can automatically send receipts, order updates, payment confirmations and customer notifications from your business software.</p>
      <a class="btn btn-primary" href="/contact/">Add WhatsApp to My Business <span class="arrow">→</span></a>`;
    whatsAppSuccess.classList.remove('hidden');
  }

  async function sendWhatsAppDemo() {
    if (whatsAppRequestInProgress || whatsAppDemoCompleted || sendWhatsAppBtn.disabled) return;
    resetWhatsAppResults();

    if (!hasConsent()) {
      showConsentPopup();
      return;
    }
    if (!validateWhatsAppPhone(true)) {
      showWhatsAppError(whatsAppPhone.validationMessage);
      whatsAppPhone.focus();
      return;
    }
    if (!whatsAppConsent.checked) {
      showWhatsAppError('Please confirm that you want to receive the demonstration message on WhatsApp.');
      whatsAppConsent.focus();
      return;
    }

    whatsAppRequestInProgress = true;
    sendWhatsAppBtn.disabled = true;
    sendWhatsAppBtn.textContent = 'Checking Request...';
    whatsAppStatus.textContent = 'Checking Request...';
    await new Promise(resolve => requestAnimationFrame(resolve));
    sendWhatsAppBtn.textContent = 'Sending WhatsApp...';
    whatsAppStatus.textContent = 'Sending WhatsApp...';

    try {
      const response = await fetch(whatsAppApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: whatsAppPhone.value,
          demoType: whatsAppDemoType.value,
          consentAccepted: true
        })
      });
      const data = await response.json().catch(() => ({}));
      if (data.code === 'DEMO_LIMIT_REACHED') {
        showWhatsAppBlocked();
        return;
      }
      if (!response.ok || !data.success) {
        whatsAppRequestInProgress = false;
        sendWhatsAppBtn.disabled = false;
        sendWhatsAppBtn.textContent = 'Try Again';
        showWhatsAppError(data.message || 'We could not send the demo WhatsApp message. Please try again.');
        return;
      }
      whatsAppRequestInProgress = false;
      showWhatsAppSuccess(data);
    } catch {
      whatsAppRequestInProgress = false;
      sendWhatsAppBtn.disabled = false;
      sendWhatsAppBtn.textContent = 'Try Again';
      showWhatsAppError('The WhatsApp service is temporarily unavailable. Please try again.');
    }
  }

  if (!hasConsent()) showConsentPopup();
  allowCookiesBtn?.addEventListener('click', function () {
    setCookieConsent();
    hideConsentPopup();
    updateReceiptFormState();
  });
  smsDemoType?.addEventListener('change', updateSmsPreview);
  smsPhone?.addEventListener('input', function () {
    validateSmsPhone(false);
  });
  whatsAppDemoType?.addEventListener('change', updateWhatsAppPreview);
  whatsAppPhone?.addEventListener('input', function () {
    validateWhatsAppPhone(false);
  });
  whatsAppForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    sendWhatsAppDemo();
  });
  receiptPhone?.addEventListener('input', updateReceiptFormState);
  receiptTypeInputs.forEach(input => input.addEventListener('change', updateReceiptFormState));
  receiptForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    sendReceiptDemo();
  });
  smsForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    sendSmsDemo();
  });
  updateSmsPreview();
  updateWhatsAppPreview();
  updateReceiptFormState();
})();
