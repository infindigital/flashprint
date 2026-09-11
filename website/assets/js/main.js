/* Flash Print Solution — site behaviour (vanilla JS, no dependencies)
 * Modules: header · mega menu · mobile nav · reveal · enquiry modal + forms ·
 * WhatsApp · gallery + lightbox · portfolio filter · catalog filter · section spy
 */
(function () {
  'use strict';

  var doc = document, body = doc.body, root = doc.documentElement;
  var cfg = {
    wa: body.getAttribute('data-wa') || '',
    email: body.getAttribute('data-email') || '',
    endpoint: body.getAttribute('data-endpoint') || '',
    key: body.getAttribute('data-key') || '',
    product: body.getAttribute('data-product') || ''
  };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  function track(name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
      else if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params || {}));
    } catch (e) { /* analytics must never break the page */ }
  }

  /* ---------- Scroll lock shared by modal, drawer, lightbox ---------- */
  var locks = 0;
  function lockScroll() {
    if (locks++ === 0) {
      var sbw = window.innerWidth - root.clientWidth;
      if (sbw > 0) body.style.paddingRight = sbw + 'px';
      root.classList.add('is-locked');
    }
  }
  function unlockScroll() {
    if (locks > 0 && --locks === 0) { root.classList.remove('is-locked'); body.style.paddingRight = ''; }
  }

  /* Focus trap helper */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    var items = $$(FOCUSABLE, container).filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Header scroll state ---------- */
  var header = $('[data-header]');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ---------- Mega menus (desktop) ---------- */
  var megaItems = $$('.has-mega');
  var openMega = null, megaTimer = null;
  function setMega(li, open) {
    if (!li) return;
    var btn = $('.nav__trigger', li);
    li.classList.toggle('is-open', open);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { if (openMega && openMega !== li) setMega(openMega, false); openMega = li; }
    else if (openMega === li) openMega = null;
  }
  megaItems.forEach(function (li) {
    var btn = $('.nav__trigger', li);
    btn.addEventListener('click', function () { setMega(li, !li.classList.contains('is-open')); });
    li.addEventListener('mouseenter', function () {
      if (window.matchMedia('(hover: hover)').matches) { clearTimeout(megaTimer); megaTimer = setTimeout(function () { setMega(li, true); }, 90); }
    });
    li.addEventListener('mouseleave', function () {
      if (window.matchMedia('(hover: hover)').matches) { clearTimeout(megaTimer); megaTimer = setTimeout(function () { setMega(li, false); }, 180); }
    });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && li.classList.contains('is-open')) { setMega(li, false); btn.focus(); }
    });
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) setMega(li, false); });
  });
  doc.addEventListener('click', function (e) { if (openMega && !openMega.contains(e.target)) setMega(openMega, false); });

  /* ---------- Mobile navigation drawer ---------- */
  var burger = $('[data-burger]'), mnav = $('#mobile-nav');
  if (burger && mnav) {
    var panel = $('.mnav__panel', mnav);
    var closeNav = function (returnFocus) {
      if (!mnav.classList.contains('is-open')) return;
      mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); mnav.setAttribute('aria-hidden', 'true');
      unlockScroll(); if (returnFocus !== false) burger.focus();
    };
    var openNav = function () {
      mnav.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true'); mnav.setAttribute('aria-hidden', 'false');
      lockScroll(); setTimeout(function () { var c = $('.mnav__close', mnav); if (c) c.focus(); }, 60);
    };
    burger.addEventListener('click', function () { mnav.classList.contains('is-open') ? closeNav() : openNav(); });
    $$('[data-mnav-close]', mnav).forEach(function (el) { el.addEventListener('click', function () { closeNav(); }); });
    mnav.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); trapFocus(panel, e); });
    $$('[data-mnav-toggle]', mnav).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sub = doc.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        sub.classList.toggle('is-open', open);
        sub.toggleAttribute('inert', !open);
      });
    });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { closeNav(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1100) closeNav(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  root.classList.add('js');
  $$('[data-stagger]').forEach(function (group) {
    $$('[data-reveal], [data-reveal-img]', group).forEach(function (el, i) { el.style.setProperty('--d', (Math.min(i, 8) * 0.07) + 's'); });
  });
  var revealEls = $$('[data-reveal], [data-reveal-img]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- WhatsApp deep links ---------- */
  var isMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  function waMessage(product) {
    return product
      ? 'Hello, I\'m interested in ' + product + ' and would like more information.'
      : 'Hello, I\'d like to get a quote for a printing project.';
  }
  function waUrl(product) {
    var text = encodeURIComponent(waMessage(product));
    return isMobile
      ? 'https://wa.me/' + cfg.wa + '?text=' + text                       // opens the WhatsApp app directly
      : 'https://web.whatsapp.com/send?phone=' + cfg.wa + '&text=' + text; // desktop: straight into WhatsApp Web
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-whatsapp]');
    if (!a || !cfg.wa) return;
    var product = a.hasAttribute('data-product') ? a.getAttribute('data-product') : cfg.product;
    var url = waUrl(product);
    a.setAttribute('href', url);
    track('whatsapp_click', { product: product || 'general', location: a.getAttribute('data-track') || '' });
    if (!isMobile) { e.preventDefault(); window.open(url, '_blank', 'noopener'); }
  });
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (t) track(t.href.indexOf('tel:') === 0 ? 'phone_click' : 'email_click', { location: t.getAttribute('data-track') || '' });
  });

  /* ---------- Enquiry forms (modal + contact page) ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RULES = {
    name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
    email: function (v) { return EMAIL_RE.test(v.trim()) || 'Please enter a valid email address, e.g. name@company.com.'; },
    phone: function (v) { return v.replace(/\D/g, '').length >= 7 || 'Please enter a phone number we can reach you on.'; },
    product: function (v) { return v.trim().length >= 2 || 'Please tell us which product or service you need.'; }
  };
  function fieldOf(input) { return input.closest('.field'); }
  function validateInput(input) {
    var rule = RULES[input.name];
    if (!rule) return true;
    var res = rule(input.value);
    var field = fieldOf(input), err = field && $('.field__error', field);
    var ok = res === true;
    if (field) field.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.textContent = ok ? '' : res;
    return ok;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function initForm(form) {
    var submitted = false;
    var status = $('.form-status', form);
    var btn = $('[type="submit"]', form);
    $$('input, textarea', form).forEach(function (input) {
      input.addEventListener('blur', function () { if (submitted || input.value) validateInput(input); });
      input.addEventListener('input', function () { if (fieldOf(input) && fieldOf(input).classList.contains('is-invalid')) validateInput(input); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitted = true;
      if (status) status.classList.remove('is-visible');
      var invalid = $$('input[name], textarea[name]', form).filter(function (i) { return !validateInput(i); });
      if (invalid.length) { invalid[0].focus(); return; }
      if (form.querySelector('.hp input') && form.querySelector('.hp input').value) return; // bot trap

      var data = {};
      $$('input[name], textarea[name]', form).forEach(function (i) { if (!i.closest('.hp')) data[i.name] = i.value.trim(); });
      data.page = window.location.href;
      var subject = 'Website enquiry: ' + (data.product || 'General');

      if (!cfg.endpoint) { // No form service configured → hand the enquiry to the visitor's email app
        var lines = ['Name: ' + data.name, 'Email: ' + data.email, 'Phone: ' + data.phone, 'Product / Service: ' + data.product];
        if (data.company) lines.push('Company: ' + data.company);
        if (data.quantity) lines.push('Quantity: ' + data.quantity);
        if (data.deadline) lines.push('Needed by: ' + data.deadline);
        lines.push('', data.message || '', '', 'Sent from: ' + data.page);
        window.location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        track('generate_lead', { method: 'mailto', product: data.product });
        showSuccess(form, data, true);
        return;
      }
      btn.classList.add('is-loading'); btn.disabled = true;
      var payload = Object.assign({ subject: subject, from_name: 'Flash Print Solution website' }, data);
      if (cfg.key) payload.access_key = cfg.key;
      fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === false) throw new Error(j.message || 'Request failed'); return j; }); })
        .then(function () { track('generate_lead', { method: 'form', product: data.product }); showSuccess(form, data, false); })
        .catch(function () {
          if (status) {
            status.innerHTML = '<span>We couldn\'t send your enquiry just now. Please try again, message us on WhatsApp, or email <a href="mailto:' + esc(cfg.email) + '">' + esc(cfg.email) + '</a>.</span>';
            status.classList.add('is-visible');
          }
        })
        .then(function () { btn.classList.remove('is-loading'); btn.disabled = false; });
    });
  }
  function showSuccess(form, data, viaEmail) {
    var wrap = form.closest('[data-form-wrap]');
    var success = wrap && $('[data-success]', wrap);
    if (!success) return;
    var first = (data.name || '').split(' ')[0];
    $('[data-success-title]', success).textContent = viaEmail ? 'Your email is ready to send' : 'Thank you' + (first ? ', ' + first : '') + '. Enquiry received.';
    $('[data-success-text]', success).innerHTML = viaEmail
      ? 'Your email app should now be open with your enquiry about <strong>' + esc(data.product) + '</strong> filled in. Just press send. If nothing opened, email <a href="mailto:' + esc(cfg.email) + '">' + esc(cfg.email) + '</a> or message us on WhatsApp.'
      : 'We\'ve received your enquiry about <strong>' + esc(data.product) + '</strong>. Our team will get back to you by email or phone during business hours (Mon&ndash;Sat, 9:30 AM &ndash; 7:00 PM).';
    var wa = $('[data-whatsapp]', success); if (wa) wa.setAttribute('data-product', data.product || '');
    form.hidden = true; success.hidden = false;
    var h = $('[data-success-title]', success); h.setAttribute('tabindex', '-1'); h.focus();
  }
  function resetForm(wrap) {
    var form = $('form', wrap), success = $('[data-success]', wrap);
    if (!form) return;
    form.reset(); form.hidden = false; if (success) success.hidden = true;
    $$('.field', form).forEach(function (f) { f.classList.remove('is-invalid'); });
    $$('[aria-invalid]', form).forEach(function (i) { i.setAttribute('aria-invalid', 'false'); });
    var st = $('.form-status', form); if (st) st.classList.remove('is-visible');
  }
  $$('form[data-enquiry]').forEach(initForm);

  /* Modal */
  var modal = $('#enquiry-modal');
  if (modal) {
    var dialog = $('.modal__dialog', modal), lastTrigger = null;
    var title = $('#enquiry-title', modal), productInput = $('input[name="product"]', modal);
    var openModal = function (product, trigger) {
      resetForm(modal);
      lastTrigger = trigger || doc.activeElement;
      productInput.value = product || '';
      title.textContent = product ? 'Enquire about ' + product : 'Request a quote';
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
      lockScroll();
      setTimeout(function () { var n = product ? $('input[name="name"]', modal) : productInput; if (n) n.focus({ preventScroll: true }); }, 80);
      track('enquiry_open', { product: product || 'general' });
    };
    var closeModal = function () {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
      unlockScroll();
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
    };
    doc.addEventListener('click', function (e) {
      var t = e.target.closest('[data-enquire]');
      if (!t) return;
      e.preventDefault();
      openModal(t.hasAttribute('data-product') ? t.getAttribute('data-product') : cfg.product, t);
    });
    $$('[data-modal-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });
    modal.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); trapFocus(dialog, e); });
  }

  /* ---------- Lightbox (gallery + portfolio) ---------- */
  var lb = $('#lightbox'), lbItems = [], lbIndex = 0, lbTrigger = null;
  function lbRender() {
    var it = lbItems[lbIndex]; if (!it) return;
    var img = $('img', lb);
    img.style.opacity = '0';
    var pre = new Image();
    pre.onload = pre.onerror = function () { img.src = it.src; img.alt = it.alt; img.style.opacity = '1'; };
    pre.src = it.src;
    $('[data-lb-count]', lb).textContent = (lbIndex + 1) + ' / ' + lbItems.length;
    $('[data-lb-cap]', lb).textContent = it.caption || it.alt;
    var multi = lbItems.length > 1;
    $('.lightbox__prev', lb).hidden = !multi; $('.lightbox__next', lb).hidden = !multi;
  }
  function lbOpen(items, index, trigger) {
    if (!lb) return;
    lbItems = items; lbIndex = index || 0; lbTrigger = trigger;
    lbRender(); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lockScroll();
    setTimeout(function () { $('.lightbox__close', lb).focus(); }, 50);
  }
  function lbClose() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); unlockScroll();
    if (lbTrigger) lbTrigger.focus({ preventScroll: true });
  }
  function lbStep(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; lbRender(); }
  if (lb) {
    $('.lightbox__close', lb).addEventListener('click', lbClose);
    $('.lightbox__prev', lb).addEventListener('click', function () { lbStep(-1); });
    $('.lightbox__next', lb).addEventListener('click', function () { lbStep(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__stage')) lbClose(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbStep(-1);
      else if (e.key === 'ArrowRight') lbStep(1);
      trapFocus(lb, e);
    });
    var sx = null, sy = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) lbStep(dx < 0 ? 1 : -1);
      sx = sy = null;
    }, { passive: true });
  }

  /* Product gallery */
  $$('[data-gallery]').forEach(function (g) {
    var main = $('.gallery__main', g), mainImg = $('img', main), role = $('.gallery__role', g);
    var thumbs = $$('.gallery__thumb', g);
    var items = thumbs.map(function (t) { return { src: t.getAttribute('data-full'), srcset: t.getAttribute('data-srcset'), alt: t.getAttribute('data-alt'), caption: t.getAttribute('data-alt'), role: t.getAttribute('data-role') }; });
    var current = 0;
    function show(i) {
      if (i === current) return;
      current = i;
      var it = items[i];
      thumbs.forEach(function (t, k) { t.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      mainImg.classList.add('is-leaving');
      setTimeout(function () {
        mainImg.srcset = it.srcset; mainImg.src = it.src; mainImg.alt = it.alt;
        if (role) role.textContent = it.role;
        var done = function () { mainImg.classList.remove('is-leaving'); };
        if (mainImg.complete) requestAnimationFrame(done); else { mainImg.onload = done; mainImg.onerror = done; }
      }, reduceMotion ? 0 : 160);
    }
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault(); var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + thumbs.length) % thumbs.length; thumbs[n].focus(); show(n);
        }
      });
    });
    main.addEventListener('click', function () { lbOpen(items, current, main); });
  });

  /* Portfolio grid + filters */
  $$('[data-portfolio]').forEach(function (wrap) {
    var works = $$('[data-work]', wrap);
    works.forEach(function (w) {
      w.addEventListener('click', function () {
        var visible = works.filter(function (x) { return !x.hidden; });
        lbOpen(visible.map(function (x) { return { src: x.getAttribute('data-full'), alt: $('img', x).alt, caption: x.getAttribute('data-caption') }; }), visible.indexOf(w), w);
      });
    });
    var chips = $$('[data-filter]', wrap);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-filter');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        works.forEach(function (w) { w.hidden = f !== 'all' && w.getAttribute('data-type') !== f; });
        var grid = $('.work-grid', wrap); if (grid) grid.classList.toggle('is-filtered', f !== 'all');
      });
    });
  });

  /* Catalog search / jump */
  var catalog = $('[data-catalog]');
  if (catalog) {
    var input = $('[data-catalog-search]', catalog), groups = $$('[data-filter-group]', catalog), empty = $('[data-catalog-empty]', catalog), count = $('[data-catalog-count]', catalog);
    var norm = function (s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' '); };
    input.addEventListener('input', function () {
      var q = norm(input.value).trim().split(/\s+/).filter(Boolean), shown = 0;
      groups.forEach(function (g) {
        var any = false;
        $$('[data-filter-item]', g).forEach(function (it) {
          var hay = norm(it.getAttribute('data-name') + ' ' + g.getAttribute('data-name'));
          var ok = q.every(function (w) { return hay.indexOf(w) > -1; });
          it.hidden = !ok; if (ok) { any = true; shown++; }
        });
        g.hidden = !any;
      });
      empty.hidden = shown !== 0;
      if (count) count.textContent = shown;
    });
    var jump = $('[data-catalog-jump]', catalog);
    if (jump) jump.addEventListener('change', function () { var t = doc.getElementById(jump.value); if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); });
  }

  /* ---------- Section spy (product sub-nav + article TOC) ---------- */
  $$('[data-spy]').forEach(function (nav) {
    var links = $$('a[href^="#"]', nav);
    var targets = links.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return;
    var active = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
          var cur = links.filter(function (a) { return a.classList.contains('is-active'); })[0];
          if (cur && cur !== active && nav.scrollWidth > nav.clientWidth) { var ul = cur.closest('ul'); if (ul) ul.scrollTo({ left: cur.offsetLeft - 24, behavior: reduceMotion ? 'auto' : 'smooth' }); }
          active = cur;
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  });

  /* ---------- Mobile product action bar ---------- */
  var mBar = $('[data-m-actions]'), heroCta = $('[data-hero-cta]');
  if (mBar && heroCta && 'IntersectionObserver' in window) {
    body.classList.add('has-m-actions');
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { mBar.classList.toggle('is-visible', !en.isIntersecting && en.boundingClientRect.top < 0); });
    }).observe(heroCta);
  }

  /* Current year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
