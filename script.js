// Easy Broadcast — vanilla JS, no dependencies

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Build the waveform bars (hero visual) ---- */
  var waveform = document.getElementById('waveform');
  if (waveform) {
    var heights = [35, 65, 100, 50, 80, 30, 60, 90, 45, 70];
    heights.forEach(function (h, i) {
      var bar = document.createElement('span');
      bar.style.height = h + '%';
      bar.style.animationDelay = (i * 0.09) + 's';
      waveform.appendChild(bar);
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

  /* ---- Signup form (front-end only — wire to a backend/email service later) ---- */
  var form = document.getElementById('signup-form');
  var note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.textContent = "Thanks — we've got your message and will follow up shortly.";
      form.reset();
    });
  }

  /* ---- Footer year ---- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }

});
