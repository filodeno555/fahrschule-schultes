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

  /* ── Preisrechner ────────────────────────────────────────────────────────
     Preise nach Angabe der Fahrschule. Die Zahl der Pflicht-Sonderfahrten ist
     gesetzlich vorgegeben (FahrschAusbO): Klasse B und die Motorradklassen je
     fünf Überland-, vier Autobahn- und drei Dämmerungsfahrten, BE drei plus eine
     plus eine, AM keine. Wer die Preise ändert, ändert sie hier UND in den
     Klassenkarten und der Preisliste in index.html. */
  var CLASSES = {
    'B':    { label: 'Klasse B / BF17 / Automatik', base: 300, lesson: 65, special: 65,
              specialCount: 12, theory: 40, practical: 200, learn: 30 },
    'B197': { label: 'Klasse B197', base: 300, lesson: 65, special: 65,
              specialCount: 12, theory: 40, practical: 200, learn: 30, test: 25 },
    'A':    { label: 'Motorrad A1 / A2 / A', base: 300, lesson: 73, special: 73,
              specialCount: 12, theory: 40, practical: 220, learn: 30 },
    'BE':   { label: 'Anhänger BE', base: 120, lesson: 69, special: 69,
              specialCount: 5, theory: 0, practical: 210, learn: 0 },
    'AM':   { label: 'Roller AM', base: 200, lesson: 68, special: 0,
              specialCount: 0, theory: 40, practical: 210, learn: 30 },
    'B196': { label: 'Motorrad B196', course: 850,
              note: 'Aufbaukurs ohne Prüfung: 10 Praxisstunden und 4 × 90 Min. Theorie.' },
    'B96':  { label: 'Anhänger B96', course: 320,
              note: 'Schulung ohne Prüfung: 2,5 Std. Theorie, 3,5 Std. Umgang mit dem Anhänger, 1 Std. im Straßenverkehr.' },
    'Mofa': { label: 'Mofa', course: 150,
              note: 'Kompletter Kurs: 6 × 90 Min. Theorie und eine Doppelstunde Praxis.' }
  };

  function initCalculator() {
    var root = document.querySelector('[data-calc]');
    if (!root) return;

    var select = root.querySelector('[data-calc-class]');
    var range = root.querySelector('[data-calc-range]');
    var learn = root.querySelector('[data-calc-learn]');
    var count = root.querySelector('[data-calc-count]');
    var rowsBox = root.querySelector('[data-calc-rows]');
    var lessonBlock = root.querySelector('[data-calc-lesson-block]');
    var learnBlock = root.querySelector('[data-calc-learn-block]');
    var noteBox = root.querySelector('[data-calc-note]');
    var totalOut = root.querySelector('[data-calc-total]');
    if (!range || !rowsBox) return;

    function row(label, value) {
      var el = document.createElement('div');
      el.className = 'calc-row';
      var a = document.createElement('span'); a.textContent = label;
      var b = document.createElement('span'); b.textContent = value;
      el.appendChild(a); el.appendChild(b);
      return el;
    }

    function render() {
      var c = CLASSES[select ? select.value : 'B'] || CLASSES.B;
      var rows = [];
      var total;

      if (c.course) {
        // Festpreiskurs — die Zahl der Übungsfahrten spielt keine Rolle.
        if (lessonBlock) lessonBlock.hidden = true;
        if (learnBlock) learnBlock.hidden = true;
        rows.push(['Kompletter Kurs', euro(c.course)]);
        total = c.course;
      } else {
        if (lessonBlock) lessonBlock.hidden = false;
        if (learnBlock) learnBlock.hidden = !c.learn;

        var n = Number(range.value);
        var ls = c.learn && learn && learn.checked ? c.learn : 0;
        var specials = c.specialCount * c.special;

        rows.push(['Grundbetrag (Anmeldung)', euro(c.base)]);
        rows.push([n + ' × Übungsfahrt', euro(n * c.lesson)]);
        if (c.specialCount) rows.push([c.specialCount + ' × Sonderfahrt (Pflicht)', euro(specials)]);
        if (c.theory) rows.push(['Vorstellung Theorieprüfung', euro(c.theory)]);
        rows.push(['Vorstellung Praxisprüfung', euro(c.practical)]);
        if (c.test) rows.push(['Testfahrt', euro(c.test)]);
        if (c.learn) rows.push(['Online-Lernsystem', ls ? euro(ls) : '–']);

        total = c.base + n * c.lesson + specials + c.theory + c.practical + (c.test || 0) + ls;
        if (count) count.textContent = String(n);
      }

      rowsBox.textContent = '';
      rows.forEach(function (r) { rowsBox.appendChild(row(r[0], r[1])); });

      if (noteBox) {
        noteBox.textContent = c.note || '';
        noteBox.hidden = !c.note;
      }
      if (totalOut) totalOut.textContent = euro(total);
    }

    range.addEventListener('input', render);
    if (learn) learn.addEventListener('change', render);
    if (select) select.addEventListener('change', render);
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
