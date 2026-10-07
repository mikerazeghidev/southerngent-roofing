/* SouthernGent Roofing & Gutters — page interactions */

/* Chip groups (calculator selectors) */
document.querySelectorAll('.chips').forEach(function (group) {
  group.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    group.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    calcUpdate();
  });
});

/* Roofing cost calculator */
function chipVal(name) {
  var el = document.querySelector('.chips[data-group="' + name + '"] button.on');
  return el ? parseFloat(el.getAttribute('data-val')) : 1;
}
function fmt(n) {
  return '$' + (Math.round(n / 100) * 100).toLocaleString('en-US');
}
function calcUpdate() {
  var out = document.getElementById('calc-range');
  if (!out) return;
  var size = chipVal('size');
  var stories = chipVal('stories');
  var complexity = chipVal('complexity');
  var rate = parseFloat(document.getElementById('calc-type').value);
  var mid = size * rate * stories * complexity;
  out.textContent = fmt(mid * 0.85) + ' - ' + fmt(mid * 1.15);
}
var typeSel = document.getElementById('calc-type');
if (typeSel) typeSel.addEventListener('change', calcUpdate);
calcUpdate();

/* FAQ accordions */
document.querySelectorAll('.faq-q').forEach(function (q) {
  q.addEventListener('click', function () {
    q.parentElement.classList.toggle('open');
  });
});

/* Lead forms: submit -> webhook (+ dataLayer) -> thank-you panel (every .lead-form on the page).
   TODO: point WEBHOOK_URL at the CRM webhook before campaign launch. */
(function () {
  var WEBHOOK_URL = ''; // e.g. https://services.leadconnectorhq.com/hooks/...
  document.querySelectorAll('.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.page = location.href;
      try {
        var p = new URLSearchParams(location.search);
        ['gclid','wbraid','gbraid','fbclid','utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function (k) {
          if (p.get(k)) data[k] = p.get(k);
        });
      } catch (err) {}
      var bot = !!data.website; delete data.website;
      if (WEBHOOK_URL && !bot) {
        fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(function () {});
      }
      if (window.dataLayer && !bot) window.dataLayer.push({ event: 'lead_form_submit', form_location: 'contact' });
      var card = form.closest('.lead-card');
      if (card) {
        var thanks = card.querySelector('.lead-thanks');
        form.style.display = 'none';
        if (thanks) thanks.hidden = false;
      }
    });
  });
})();

/* Reviews carousel arrows */
var gs = document.querySelector('.grev-scroll');
var gp = document.getElementById('grev-prev'), gn = document.getElementById('grev-next');
function gShift(d) { if (gs) gs.scrollBy({ left: d * 384, behavior: 'smooth' }); }
if (gp) gp.addEventListener('click', function () { gShift(-1); });
if (gn) gn.addEventListener('click', function () { gShift(1); });

/* Roof Lookbook: manual look switching + gentle auto-advance */
var lbStage = document.querySelector('.lb-stage');
if (lbStage) {
  var lbIdx = 0, lbTimer = null;
  var lbDots = document.querySelectorAll('.lb-dot');
  function lbSet(i) {
    lbIdx = (i + 3) % 3;
    lbStage.className = 'lb-stage' + (lbIdx ? ' lb-s' + lbIdx : ' lb-s0');
    lbDots.forEach(function (d, n) { d.classList.toggle('on', n === lbIdx); });
  }
  function lbAuto() {
    clearInterval(lbTimer);
    lbTimer = setInterval(function () { lbSet(lbIdx + 1); }, 4500);
  }
  var lp = document.getElementById('lb-prev'), ln = document.getElementById('lb-next');
  if (lp) lp.addEventListener('click', function () { lbSet(lbIdx - 1); lbAuto(); });
  if (ln) ln.addEventListener('click', function () { lbSet(lbIdx + 1); lbAuto(); });
  lbDots.forEach(function (d, n) { d.addEventListener('click', function () { lbSet(n); lbAuto(); }); });
  lbSet(0); lbAuto();
}
