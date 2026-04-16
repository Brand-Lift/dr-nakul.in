/* ═══════════════════════════════════════════════════════════
   SANA ESTHETICS — COMPLETE JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. initHeader()
   Adds "scrolled" class to header when scrollY > 30
   ───────────────────────────────────────────────────────────── */
function initHeader() {
  var header = document.getElementById('site-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* ─────────────────────────────────────────────────────────────
   2. initMobileMenu()
   Opens overlay on hamburger click, closes on X / nav link / Escape
   Locks body scroll when open
   ───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  var hamburger  = document.getElementById('hamburger-btn');
  var menu       = document.getElementById('mobile-menu');
  var closeBtn   = document.getElementById('menu-close-btn');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !menu || !closeBtn) return;

  function openMenu() {
    menu.classList.add('open');
    document.body.classList.add('menu-open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    menu.removeAttribute('aria-hidden');
  }

  function closeMenu() {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', function () {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   3. initScrollReveal()
   Uses IntersectionObserver to animate .reveal elements when in view
   ───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -36px 0px'
  });

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────────────────────
   4. initActiveNav()
   Highlights the active nav link based on which section is in view
   ───────────────────────────────────────────────────────────── */
function initActiveNav() {
  var sections = document.querySelectorAll('section[id], div[id="footer"]');
  var navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!navLinks.length) return;

  var sectionMap = {};
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      sectionMap[href.slice(1)] = link;
    }
  });

  function onScroll() {
    var scrollPos = window.scrollY + 100;
    var activeId  = null;

    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
    });

    if (activeId && sectionMap[activeId]) {
      sectionMap[activeId].classList.add('active');
    } else if (!activeId || window.scrollY < 100) {
      if (sectionMap['home']) {
        sectionMap['home'].classList.add('active');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────────────────────────────
   5. initSmoothScroll()
   Smooth-scrolls all anchor links with 76px header offset
   ───────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  var OFFSET = 76;

  document.addEventListener('click', function (e) {
    var target = e.target.closest('a[href^="#"]');
    if (!target) return;

    var href = target.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    var id = href.slice(1);
    var el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    var top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────────────────────
   6. initBackToTop()
   Shows back-to-top button after 400px scroll, scrolls to top on click
   ───────────────────────────────────────────────────────────── */
function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  function onScroll() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────────────────────────────
   7. submitAppointment()
   Validates form, builds WhatsApp message, opens wa.me URL
   ───────────────────────────────────────────────────────────── */
function submitAppointment() {
  var nameField   = document.getElementById('fName');
  var mobileField = document.getElementById('fMobile');
  var treatField  = document.getElementById('fTreatment');
  var msgField    = document.getElementById('fMsg');

  var errName     = document.getElementById('errName');
  var errMobile   = document.getElementById('errMobile');
  var errTreat    = document.getElementById('errTreat');

  if (!nameField || !mobileField || !treatField || !msgField) return;

  var name      = nameField.value.trim();
  var mobile    = mobileField.value.trim();
  var treatment = treatField.value.trim();
  var message   = msgField.value.trim();

  var isValid = true;

  clearErrors(
    [nameField, mobileField, treatField],
    [errName, errMobile, errTreat]
  );

  if (!name || name.length < 2) {
    showError(nameField, errName);
    if (errName) errName.textContent = 'Please enter your full name.';
    isValid = false;
  }

  var mobileRegex = /^[+]?[0-9]{7,15}$/;
  if (!mobile || !mobileRegex.test(mobile.replace(/\s+/g, ''))) {
    showError(mobileField, errMobile);
    if (errMobile) errMobile.textContent = 'Please enter a valid mobile number.';
    isValid = false;
  }

  if (!treatment || treatment === '' || treatField.selectedIndex === 0) {
    showError(treatField, errTreat);
    if (errTreat) errTreat.textContent = 'Please select a treatment.';
    isValid = false;
  }

  if (!isValid) return;

  var waMessage = 'Hello Dr. Nakul,\nI want to book an appointment at Sana Esthetics.\n\n';
  waMessage += 'Name: '      + name      + '\n';
  waMessage += 'Mobile: '    + mobile    + '\n';
  waMessage += 'Treatment: ' + treatment + '\n';
  if (message) {
    waMessage += 'Message: ' + message + '\n';
  }

  var encoded = encodeURIComponent(waMessage);
  var waURL   = 'https://wa.me/918290000117?text=' + encoded;

  window.open(waURL, '_blank', 'noopener,noreferrer');

  setTimeout(function () {
    var form = document.getElementById('appointmentForm');
    if (form) form.reset();
    clearErrors(
      [nameField, mobileField, treatField],
      [errName, errMobile, errTreat]
    );
  }, 400);

  showToast('Your appointment request has been sent via WhatsApp!', 'success');
}

/* ─────────────────────────────────────────────────────────────
   8. showError(field, errSpan)
   ───────────────────────────────────────────────────────────── */
function showError(field, errSpan) {
  if (field)   field.classList.add('error');
  if (errSpan) errSpan.classList.add('show');
}

/* ─────────────────────────────────────────────────────────────
   9. clearErrors(fields, spans)
   ───────────────────────────────────────────────────────────── */
function clearErrors(fields, spans) {
  if (Array.isArray(fields)) {
    fields.forEach(function (f) {
      if (f) f.classList.remove('error');
    });
  }
  if (Array.isArray(spans)) {
    spans.forEach(function (s) {
      if (s) s.classList.remove('show');
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   10. initLiveValidation()
   Clears error state as user types or selects
   ───────────────────────────────────────────────────────────── */
function initLiveValidation() {
  var fName   = document.getElementById('fName');
  var fMobile = document.getElementById('fMobile');
  var fTreat  = document.getElementById('fTreatment');

  var errName  = document.getElementById('errName');
  var errMob   = document.getElementById('errMobile');
  var errTreat = document.getElementById('errTreat');

  if (fName && errName) {
    fName.addEventListener('input', function () {
      if (fName.value.trim().length >= 2) {
        fName.classList.remove('error');
        errName.classList.remove('show');
      }
    });
  }

  if (fMobile && errMob) {
    fMobile.addEventListener('input', function () {
      var val   = fMobile.value.trim().replace(/\s+/g, '');
      var regex = /^[+]?[0-9]{7,15}$/;
      if (regex.test(val)) {
        fMobile.classList.remove('error');
        errMob.classList.remove('show');
      }
    });
  }

  if (fTreat && errTreat) {
    fTreat.addEventListener('change', function () {
      if (fTreat.value && fTreat.selectedIndex !== 0) {
        fTreat.classList.remove('error');
        errTreat.classList.remove('show');
      }
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   11. showToast(msg, type)
   Shows floating toast notification that auto-removes after 3500ms
   ───────────────────────────────────────────────────────────── */
function showToast(msg, type) {
  var existing = document.querySelectorAll('.toast');
  existing.forEach(function (t) { t.remove(); });

  var toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'success');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  var icon = '';
  if (type === 'success') {
    icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" style="flex-shrink:0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else {
    icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  }

  toast.innerHTML = icon + '<span>' + msg + '</span>';
  document.body.appendChild(toast);

  setTimeout(function () {
    if (toast && toast.parentNode) {
      toast.classList.add('removing');
      setTimeout(function () {
        if (toast && toast.parentNode) {
          toast.remove();
        }
      }, 380);
    }
  }, 3500);
}

/* ─────────────────────────────────────────────────────────────
   12. DOMContentLoaded — Initialize all functions
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initSmoothScroll();
  initBackToTop();
  initLiveValidation();
});
