/* ============================================================================
   Fahrschule Schultes — page behaviour

   Everything here is an enhancement: the page renders complete and readable
   without JavaScript. The filter shows all classes, the price calculator shows
   its default estimate, the FAQ works through native <details>, and the contact
   form falls back to standard browser validation.
   ========================================================================= */
(function () {
  'use strict';

  var euro = function (n) {
    return n.toLocaleString('de-DE') + ' €';
  };

  /* ── Sticky offset ───────────────────────────────────────────────────────
     The brand bar and the section nav both stick. Anchor targets have to clear
     both, and the section nav wraps to more rows on narrow viewports, so the
     offset is measured rather than assumed. */
  function syncStickyOffset() {
    var masthead = document.querySelector('.masthead');
    var subnav = document.querySelector('.subnav');
    if (!masthead || !subnav) return;
    var header = Math.round(masthead.getBoundingClientRect().height);
    var nav = Math.round(subnav.getBoundingClientRect().height);
    var root = document.documentElement;
    root.style.setProperty('--header-h', header + 'px');
    root.style.setProperty('--subnav-h', nav + 'px');
    root.style.setProperty('--stick', header + nav + 6 + 'px');
  }

  /* ── Klassen-Filter ──────────────────────────────────────────────────── */
  function initClassFilter() {
    var group = document.querySelector('[data-class-filter]');
    var grid = document.querySelector('[data-class-grid]');
    if (!group || !grid) return;

    var buttons = Array.prototype.slice.call(group.querySelectorAll('button'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.class-card'));

    var empty = document.createElement('div');
    empty.className = 'filter-empty';
    empty.hidden = true;
    empty.textContent = 'Für diese Auswahl sind keine Klassen hinterlegt.';
    grid.appendChild(empty);

    function apply(cat) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = cat === 'alle' || card.getAttribute('data-cat') === cat;
        card.hidden = !match;
        if (!match) card.open = false;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-cat') === cat));
      });
    }

    group.addEventListener('click', function (event) {
      var btn = event.target.closest('button[data-cat]');
      if (btn) apply(btn.getAttribute('data-cat'));
    });
  }

  /* ── Preisrechner Klasse B ───────────────────────────────────────────────
     Grundbetrag + n Übungsfahrten + 12 Pflicht-Sonderfahrten
     + Prüfungsvorstellungen + optionales Lernsystem. */
  function initCalculator() {
    var root = document.querySelector('[data-calc]');
    if (!root) return;

    var range = root.querySelector('[data-calc-range]');
    var learn = root.querySelector('[data-calc-learn]');
    var count = root.querySelector('[data-calc-count]');
    var lessonsLabel = root.querySelector('[data-calc-lessons-label]');
    var lessonsValue = root.querySelector('[data-calc-lessons-value]');
    var learnValue = root.querySelector('[data-calc-learn-value]');
    var totalOut = root.querySelector('[data-calc-total]');
    if (!range) return;

    var PRICE = {
      base: 300,          // Grundbetrag (Anmeldung)
      lesson: 65,         // Übungsfahrt, 45 Min.
      specialDrives: 12,  // gesetzlich vorgeschriebene Sonderfahrten
      theoryExam: 40,     // Vorstellung Theorieprüfung
      practicalExam: 200, // Vorstellung Praxisprüfung
      learnSystem: 30     // Online-Lernsystem (optional)
    };

    function render() {
      var n = Number(range.value);
      var ls = learn && learn.checked ? PRICE.learnSystem : 0;
      var total = PRICE.base
        + n * PRICE.lesson
        + PRICE.specialDrives * PRICE.lesson
        + PRICE.theoryExam
        + PRICE.practicalExam
        + ls;

      if (count) count.textContent = String(n);
      if (lessonsLabel) lessonsLabel.textContent = n + ' × Übungsfahrt';
      if (lessonsValue) lessonsValue.textContent = euro(n * PRICE.lesson);
      if (learnValue) learnValue.textContent = ls ? euro(ls) : '–';
      if (totalOut) totalOut.textContent = euro(total);
    }

    range.addEventListener('input', render);
    if (learn) learn.addEventListener('change', render);
    render();
  }

  /* ── FAQ-Akkordeon ───────────────────────────────────────────────────────
     Native <details>, with one answer open at a time. */
  function initFaq() {
    var faq = document.querySelector('[data-faq]');
    if (!faq) return;
    var items = Array.prototype.slice.call(faq.querySelectorAll('details'));
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* ── Kontaktformular ─────────────────────────────────────────────────────
     TODO: no endpoint yet. Point `submit` at the real handler (mail script,
     form service, or an API route) and keep the success state below. */
  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;
    var thanks = document.querySelector('[data-form-thanks]');
    var error = form.querySelector('[data-form-error]');

    // Without JS the browser's own validation and messages apply; with JS we
    // take over so the message is styled like the rest of the page.
    form.setAttribute('novalidate', '');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        if (error) {
          error.textContent = 'Bitte prüfen Sie die markierten Felder – Name, E-Mail und Einverständnis brauchen wir.';
          error.hidden = false;
        }
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (error) error.hidden = true;
      form.hidden = true;
      if (thanks) {
        thanks.hidden = false;
        thanks.setAttribute('tabindex', '-1');
        thanks.focus();
      }
    });

    form.addEventListener('input', function () {
      if (error && !error.hidden && form.checkValidity()) error.hidden = true;
    });
  }

  /* ── Aktiver Navigationspunkt ────────────────────────────────────────────
     One page, seven anchors: the link of the section currently under the
     sticky bars is marked. */
  function initScrollSpy() {
    var nav = document.getElementById('subnav');
    if (!nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var targets = links
      .map(function (link) {
        return { link: link, section: document.getElementById(link.hash.slice(1)) };
      })
      .filter(function (entry) { return entry.section; });
    if (!targets.length) return;

    var current = null;
    function update() {
      var offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--stick'), 10
      ) || 94;
      var line = window.scrollY + offset + 4;
      var active = targets[0];

      targets.forEach(function (entry) {
        if (entry.section.offsetTop <= line) active = entry;
      });

      // At the very bottom the last section is what the reader is looking at.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        active = targets[targets.length - 1];
      }

      if (active === current) return;
      current = active;
      targets.forEach(function (entry) {
        if (entry === active) entry.link.setAttribute('aria-current', 'true');
        else entry.link.removeAttribute('aria-current');
      });
    }

    var queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        update();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function init() {
    syncStickyOffset();
    initClassFilter();
    initCalculator();
    initFaq();
    initContactForm();
    initScrollSpy();
    window.addEventListener('resize', syncStickyOffset);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncStickyOffset);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
