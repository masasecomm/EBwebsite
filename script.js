// Easy Broadcast - vanilla JS, no dependencies

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile navigation ---- */
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');
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

  /* ---- Signup form email delivery ---- */
  var form = document.getElementById('signup-form');
  if (form) {
    var recipient = String.fromCharCode(109, 97, 115, 97, 115, 101, 99, 111, 109, 109, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109);
    form.action = 'https://formsubmit.co/' + recipient;

    form.addEventListener('submit', function (e) {
      var turnstileToken = form.querySelector('[name="cf-turnstile-response"]');
      if (!turnstileToken || !turnstileToken.value) {
        e.preventDefault();
        var note = document.getElementById('form-note');
        note.textContent = 'Please complete the security check before sending.';
        return;
      }
      var name = document.getElementById('name').value.trim();
      document.getElementById('form-subject').value = 'Easy Broadcast Form ' + name;
    });
  }

  /* ---- Footer year ---- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }

});
