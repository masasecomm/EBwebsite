// Easy Broadcast - vanilla JS, no dependencies

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile navigation ---- */
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');

  document.querySelectorAll('a[href="#top"]').forEach(function (topLink) {
    topLink.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#top');
      }
    });
  });

  if (navToggle && navLinks) {
    function closeNavigation() {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      navLinks.classList.remove('is-open');
    }

    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      navLinks.classList.toggle('is-open', !isOpen);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNavigation);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeNavigation(); }
    });
  }

  /* ---- Build the waveform bars (hero visual) ---- */
  var waveforms = document.querySelectorAll('.waveform');
  if (waveforms.length) {
    var heights = [35, 65, 100, 50, 80, 30, 60, 90, 45, 70];
    waveforms.forEach(function (waveform) {
      heights.forEach(function (h, i) {
        var bar = document.createElement('span');
        bar.style.height = h + '%';
        bar.style.animationDelay = (i * 0.09) + 's';
        waveform.appendChild(bar);
      });
    });
  }

  /* ---- Scroll-triggered fade-in reveals ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- FAQ accordion ---- */
  var triggers = document.querySelectorAll('.accordion__trigger');
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var panel = trigger.nextElementSibling;

      // Close all other panels (single-open accordion)
      triggers.forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = !expanded ? panel.scrollHeight + 'px' : null;
    });
  });

  /* ---- Signup form delivery ---- */
  var form = document.getElementById('signup-form');
  var gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbxHdWrtgLMzHZiYSMmIdqek-HqLnlpCL8mIPofVugwRBTlyrG4UHERU4kIcpzcGlwlD/exec';
var destinationSheet = 'EasyBroadcast';
var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var phoneField = document.getElementById('phone');

function addLocalityFieldIfNeeded() {
  var localityField = document.getElementById('locality');
  if (localityField) {
    return;
  }

  var formRow = document.querySelector('#signup-form .form__row:last-of-type');
  if (!formRow) {
    return;
  }

  var localityRow = document.createElement('div');
  localityRow.className = 'form__row';
  localityRow.innerHTML = '<label for="locality">Locality</label><input type="text" id="locality" name="locality" placeholder="City or suburb" autocomplete="address-level2">';
  formRow.parentNode.insertBefore(localityRow, formRow.nextSibling);
}

addLocalityFieldIfNeeded();

  if (phoneField) {
    phoneField.inputMode = 'numeric';
    phoneField.pattern = '[0-9]+';
    phoneField.addEventListener('input', function () {
      phoneField.value = phoneField.value.replace(/[^0-9]/g, '');
    });
  }

  if (form) {
    form.action = gasWebAppUrl;

    form.addEventListener('submit', function (e) {
      var turnstileToken = form.querySelector('[name="cf-turnstile-response"]');
      if (!turnstileToken || !turnstileToken.value) {
        e.preventDefault();
        var note = document.getElementById('form-note');
        note.textContent = 'Please complete the security check before sending.';
        return;
      }
      var emailField = document.getElementById('email');
      if (!emailField || !emailPattern.test(emailField.value.trim())) {
        e.preventDefault();
        emailField.setCustomValidity('Please enter a valid email address.');
        emailField.reportValidity();
        return;
      }
      emailField.setCustomValidity('');
      if (!phoneField || !/^[0-9]+$/.test(phoneField.value.trim())) {
        e.preventDefault();
        phoneField.setCustomValidity('Please enter numbers only for your phone number.');
        phoneField.reportValidity();
        return;
      }
      phoneField.setCustomValidity('');
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      document.getElementById('form-subject').value = 'Main Form';
      var note = document.getElementById('form-note');
      var submitButton = form.querySelector('button[type="submit"]');
      var formData = new FormData(form);
      var params = new URLSearchParams(formData);
if (formData.get('locality') === null) {
        params.append('locality', '');
      }


      submitButton.disabled = true;
      note.textContent = 'Sending your information...';

submitToGoogleApp(params)
        .then(function () {
          note.textContent = 'Thanks, ' + name + '. Your information has been sent.';
          form.reset();
        })
        .catch(function (err) {
          console.error(err);
          note.textContent = 'Submission failed — please try again.';
        })
        .finally(function () {
          submitButton.disabled = false;
          setTimeout(function () { note.textContent = ''; }, 4000);
        });

        .then(function () {
          note.textContent = 'Thanks, ' + name + '. Your information has been sent.';
          form.reset();
        })
        .catch(function () {
          note.textContent = 'There was a problem sending your information. Please try again.';
        })
        .finally(function () {
          submitButton.disabled = false;
        });
    });
  }

  /* ---- Conversational popup lead form ---- */
  function submitToGoogleApp(data, source) {
    var params = data instanceof URLSearchParams ? data : new URLSearchParams();
    if (!(data instanceof URLSearchParams)) {
      Object.keys(data).forEach(function (key) {
        params.append(key, data[key]);
      });
    }

    params.append('sheet', destinationSheet);
    params.append('tab', destinationSheet);
    if (!params.has('locality')) {
      params.append('locality', '');
    }

    if (source) {
      params.append('_subject', source === 'popup' ? 'Easy Broadcast Popup Form' : 'Easy Broadcast Form');
    }

    return fetch(gasWebAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: params.toString()
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      return response.text();
    });

    });
  }

  var interactionTriggered = false;
  var startedAt = Date.now();

  function triggerInteractionFlag() {
    interactionTriggered = true;
  }

  document.addEventListener('click', triggerInteractionFlag, { passive: true });
  document.addEventListener('scroll', triggerInteractionFlag, { passive: true, capture: true });

  function openLeadPopup() {
    if (document.getElementById('lead-chat-popup')) {
      return;
    }

    var steps = [
      { key: 'name', label: 'Hi there! I’m Easy Broadcast. Would you like to start a quick chat?', type: 'button', placeholder: '', required: false },
      { key: 'name', label: 'What is your name?', type: 'text', placeholder: 'Your name', required: true },
      { key: 'email', label: 'Thanks! What is your email address?', type: 'email', placeholder: 'you@example.com', required: true },
      { key: 'phone', label: 'And your phone number?', type: 'tel', placeholder: '+27 00 000 0000', required: true },
      { key: 'country', label: 'Which country are you in?', type: 'text', placeholder: 'Your country', required: true },
      { key: 'locality', label: 'What city or suburb are you in?', type: 'text', placeholder: 'Your city or suburb', required: true },

      { key: 'message', label: 'Finally, what question would you like to ask us? Please tell us in full so our team can give you the right answer.', type: 'textarea', placeholder: 'Tell us about your goals, timeline, or what you want to create...', required: true }
    ];

    var state = { index: 0, data: {}, followUp: false };
    var popup = document.createElement('div');
    popup.id = 'lead-chat-popup';
    popup.className = 'lead-chat-popup';

    var panel = document.createElement('div');
    panel.className = 'lead-chat-modal';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lead-chat-close';
    closeBtn.setAttribute('aria-label', 'Close chat');
    closeBtn.textContent = '×';

    var minimizeBtn = document.createElement('button');
    minimizeBtn.type = 'button';
    minimizeBtn.className = 'lead-chat-minimize';
    minimizeBtn.setAttribute('aria-label', 'Minimize chat');
    minimizeBtn.textContent = '−';

    var restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'lead-chat-restore';
    restoreBtn.setAttribute('aria-label', 'Restore chat');
    restoreBtn.innerHTML = '<img class="lead-chat-restore-avatar" src="easybroadcast-admin-avatar.png" alt="" aria-hidden="true"><span>Chat</span>';

    var header = document.createElement('div');
    header.className = 'lead-chat-header';
    header.innerHTML = '<img class="lead-chat-admin-avatar" src="easybroadcast-admin-avatar.png" alt="" aria-hidden="true"><strong>Easy Broadcast</strong><span class="lead-chat-header-label">CHAT</span>';

    var body = document.createElement('div');
    body.className = 'lead-chat-body';

    var form = document.createElement('form');
    form.className = 'lead-chat-form';
    form.noValidate = true;

    var inputWrap = document.createElement('div');
    inputWrap.className = 'lead-chat-input-wrap';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'lead-chat-input';
    input.placeholder = 'Your answer';
    input.style.display = 'none';
    input.addEventListener('input', function () {
      if (input.type === 'tel') {
        input.value = input.value.replace(/[^0-9]/g, '');
      }
    });

    var textarea = document.createElement('textarea');
    textarea.className = 'lead-chat-input lead-chat-textarea';
    textarea.rows = 4;
    textarea.placeholder = 'Your answer';
    textarea.style.display = 'none';

    var startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.className = 'btn btn--amber btn--sm lead-chat-start';
    startBtn.textContent = 'Click to start talking';
    startBtn.disabled = true;

    var turnstileWrap = document.createElement('div');
    turnstileWrap.className = 'lead-chat-turnstile';

    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn--amber btn--sm';
    submitBtn.textContent = 'Submit';
    submitBtn.style.display = 'none';
    form.dataset.stepType = 'button';

    function setConversationBusy(isBusy) {
      inputWrap.style.display = isBusy ? 'none' : 'block';
      submitBtn.style.display = isBusy ? 'none' : 'inline-flex';
      startBtn.style.display = isBusy ? 'none' : startBtn.style.display;
    }

    function minimizeChat() {
      popup.classList.add('is-minimized');
      document.body.classList.remove('lead-chat-open');
    }

    function showTypingIndicator() {
      if (body.querySelector('.lead-chat-typing')) {
        return;
      }

      var typing = document.createElement('div');
      typing.className = 'lead-chat-bubble lead-chat-bubble--bot lead-chat-typing';
      typing.setAttribute('aria-live', 'polite');
      typing.innerHTML = '<span class="lead-chat-typing-label">Reading...</span><span class="lead-chat-typing-dot"></span><span class="lead-chat-typing-dot"></span><span class="lead-chat-typing-dot"></span>';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;
    }

    function waitForAdminResponse(callback) {
      showTypingIndicator();

      setTimeout(function () {
        var typing = body.querySelector('.lead-chat-typing');
        if (!typing) {
          return;
        }

        typing.classList.add('is-typing');
        typing.querySelector('.lead-chat-typing-label').textContent = 'Typing...';

        var typingDelay = 8000 + Math.random() * 5000;
        setTimeout(function () {
          hideTypingIndicator();
          callback();
        }, typingDelay);
      }, 5000);
    }

    function hideTypingIndicator() {
      var typing = body.querySelector('.lead-chat-typing');
      if (typing) {
        typing.remove();
      }
    }

    function renderTurnstile() {
      if (turnstileWrap.dataset.rendered === 'true') {
        return;
      }
      if (!window.turnstile || typeof window.turnstile.render !== 'function') {
        setTimeout(renderTurnstile, 500);
        return;
      }

      window.turnstile.render(turnstileWrap, {
        sitekey: '0x4AAAAAAEs4vwBpKXcVPJgG',
        action: 'lead_chat',
        callback: function (token) {
          turnstileWrap.dataset.verified = token ? 'true' : 'false';
          turnstileWrap.style.display = token ? 'none' : 'flex';
          startBtn.disabled = !token;
        },
        'expired-callback': function () {
          turnstileWrap.dataset.verified = 'false';
          turnstileWrap.style.display = 'flex';
          startBtn.disabled = true;
        },
        'error-callback': function () {
          turnstileWrap.dataset.verified = 'false';
          turnstileWrap.style.display = 'flex';
          startBtn.disabled = true;
        }
      });
      turnstileWrap.dataset.rendered = 'true';
    }

    function addBubble(text, type) {
      var bubble = document.createElement('div');
      bubble.className = 'lead-chat-bubble lead-chat-bubble--' + type;
      var message = document.createElement('span');
      message.className = 'lead-chat-message';
      message.textContent = text;
      var timestamp = document.createElement('time');
      timestamp.className = 'lead-chat-time';
      timestamp.dateTime = new Date().toISOString();
      timestamp.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      bubble.appendChild(message);
      bubble.appendChild(timestamp);
      body.appendChild(bubble);
      body.scrollTop = body.scrollHeight;
    }

    function addUserBubble(text) {
      addBubble(text, 'user');
    }

    function setInput(step) {
      var isTextArea = step.type === 'textarea';
      var isButton = step.type === 'button';
      input.style.display = isTextArea || isButton ? 'none' : 'block';
      textarea.style.display = isTextArea ? 'block' : 'none';
      startBtn.style.display = isButton ? 'inline-flex' : 'none';
      submitBtn.style.display = isButton ? 'none' : 'inline-flex';
      form.dataset.stepType = step.type;

      if (isButton) {
        return;
      }

      var activeField = isTextArea ? textarea : input;
      input.type = step.type === 'email' ? 'email' : step.type === 'tel' ? 'tel' : 'text';
      input.inputMode = step.type === 'tel' ? 'numeric' : step.type === 'email' ? 'email' : 'text';
      input.pattern = step.type === 'tel' ? '[0-9]+' : '';
      activeField.value = '';
      activeField.placeholder = step.placeholder;
      activeField.focus();
      form.dataset.currentKey = step.key;
      submitBtn.textContent = 'Submit';
      setConversationBusy(false);
    }

    function askStep() {
      if (state.index >= steps.length) {
        return;
      }
      var step = steps[state.index];
      var name = state.data.name;
      var label = step.label;
      if (name && step.key === 'email') {
        label = 'Thanks, ' + name + '! What is your email address?';
      } else if (name && step.key === 'phone') {
        label = 'Thanks, ' + name + '. What is your phone number?';
      } else if (name && step.key === 'country') {
        label = 'Which country are you in, ' + name + '?';
      } else if (name && step.key === 'locality') {
        label = 'And what city or suburb are you in, ' + name + '?';

      } else if (name && step.key === 'message') {
        label = 'Finally, ' + name + ', what question would you like to ask us? Please tell us in full so our team can give you the right answer.';
      }
      addBubble(label, 'bot');
      setInput(step);
    }

    function finishChat() {
      addBubble('Perfect, ' + state.data.name + '. Thanks for your question. Our team will be in contact soon.', 'bot');
      state.followUp = true;
      state.index = steps.length;
      turnstileWrap.style.display = 'none';
      startBtn.style.display = 'none';
      input.style.display = 'none';
      textarea.style.display = 'block';
      textarea.value = '';
      textarea.placeholder = 'Write another message or question...';
      form.dataset.stepType = 'textarea';
      submitBtn.textContent = 'Submit';
      submitBtn.disabled = false;
      setConversationBusy(false);
      minimizeChat();
    }

    function advanceFromIntro() {
      state.index += 1;
      askStep();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (form.dataset.stepType === 'button') {
        var startToken = form.querySelector('[name="cf-turnstile-response"]');
        if (!startToken || !startToken.value) {
          addBubble('Please complete the security check before starting the chat.', 'bot');
          return;
        }
        startBtn.disabled = true;
        turnstileWrap.style.display = 'none';
        advanceFromIntro();
        return;
      }

      if (state.followUp) {
        var followUpValue = textarea.value.trim();
        if (!followUpValue) {
          textarea.focus();
          return;
        }

        addUserBubble(followUpValue);
        state.data.message = followUpValue;
        textarea.value = '';
        submitBtn.disabled = true;
        setConversationBusy(true);
        waitForAdminResponse(function () {
          addBubble('Thanks, ' + state.data.name + '. I am sending your message now. Our team will contact you soon.', 'bot');
          submitToGoogleApp(state.data, 'popup')
            .then(function () {
              finishChat();
            })
            .catch(function () {
              addBubble('There was a small issue sending that. Please try again.', 'bot');
              submitBtn.disabled = false;
              setConversationBusy(false);
            });
        });
        return;
      }

      if (form.dataset.stepType === 'textarea' && state.index === steps.length - 1) {
        var turnstileToken = form.querySelector('[name="cf-turnstile-response"]');
        if (!turnstileToken || !turnstileToken.value) {
          addBubble('Please complete the security check before sending your question.', 'bot');
          return;
        }
      }

      var step = steps[state.index];
      var rawValue = (form.dataset.stepType === 'textarea' ? textarea.value : input.value).trim();

      if (step.type === 'email' && !emailPattern.test(rawValue)) {
        input.setCustomValidity('Please enter a valid email address.');
        input.reportValidity();
        return;
      }
      input.setCustomValidity('');

      if (step.type === 'tel' && !/^[0-9]+$/.test(rawValue)) {
        input.setCustomValidity('Please enter numbers only for your phone number.');
        input.reportValidity();
        return;
      }
      input.setCustomValidity('');

      if (!rawValue && step.required) {
        (form.dataset.stepType === 'textarea' ? textarea : input).focus();
        return;
      }

      addUserBubble(rawValue);
      state.data[step.key] = rawValue;
      input.value = '';
      textarea.value = '';
      setConversationBusy(true);

      if (state.index === steps.length - 1) {
        submitBtn.disabled = true;
        waitForAdminResponse(function () {
          addBubble('Thanks, ' + state.data.name + '. I am sending your question now. Our team will contact you soon.', 'bot');
          submitToGoogleApp(state.data, 'popup')
            .then(function () {
              finishChat();
            })
            .catch(function () {
              addBubble('There was a small issue sending that. Please try the contact form below instead.', 'bot');
              submitBtn.disabled = false;
              form.reset();
            });
          });
        return;
      }

      state.index += 1;
      waitForAdminResponse(function () {
        askStep();
      });
    });

    startBtn.addEventListener('click', function () {
      form.requestSubmit();
    });

    minimizeBtn.addEventListener('click', function () {
      minimizeChat();
    });

    restoreBtn.addEventListener('click', function () {
      popup.classList.remove('is-minimized');
      document.body.classList.add('lead-chat-open');
    });

    closeBtn.addEventListener('click', function () {
      minimizeChat();
    });

    popup.addEventListener('click', function (event) {
      if (event.target === popup) {
        minimizeChat();
      }
    });

    inputWrap.appendChild(input);
    inputWrap.appendChild(textarea);
    form.appendChild(inputWrap);
    form.appendChild(turnstileWrap);
    form.appendChild(startBtn);
    form.appendChild(submitBtn);

    panel.appendChild(closeBtn);
    panel.appendChild(minimizeBtn);
    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(form);
    popup.appendChild(panel);
    popup.appendChild(restoreBtn);
    document.body.appendChild(popup);

    document.body.classList.add('lead-chat-open');
    popup.classList.add('is-visible');

    renderTurnstile();

    setTimeout(function () {
      addBubble('Hello there! 👋', 'bot');
      addBubble('Would you like to start a quick chat?', 'bot');
      startBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }, 400);
  }

  function checkPopupEligibility() {
    var elapsed = Date.now() - startedAt;
    if (elapsed >= 10000 && interactionTriggered && !document.body.classList.contains('lead-chat-open')) {
      openLeadPopup();
    }
  }

  setInterval(checkPopupEligibility, 1000);

  /* ---- Footer year ---- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }

});
