(function () {
  'use strict';
  var local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  var editing = local && new URLSearchParams(location.search).get('holiday-edit') === '1';
  var hero = document.querySelector('.hero-holiday');
  if (!hero) return;


  if (!editing) return;
  // Local drafts only. This is not an admin/authentication or publishing system.
  var panel = document.createElement('aside');
  panel.className = 'holiday-editor';
  panel.setAttribute('aria-label', 'Local holiday text editor');
  var title = document.createElement('strong');
  title.textContent = 'Holiday hero · local draft';
  panel.appendChild(title);
  var notice = document.createElement('p');
  notice.textContent = 'Adjust each heading below. Saved in this browser only. Export your settings and share them in chat to apply to the site.';
  panel.appendChild(notice);
  var values = {};
  try { values = JSON.parse(localStorage.getItem('mango-holiday-layout') || '{}'); } catch (_) { values = {}; }
  if (!values || typeof values !== 'object' || Array.isArray(values)) values = {};
  var select = document.createElement('select');
  select.setAttribute('aria-label', 'Heading to edit');
  ['headline', 'subtitle', 'description'].forEach(function (name) {
    var option = document.createElement('option'); option.value = name; option.textContent = name; select.appendChild(option);
  });
  panel.appendChild(select);
  var controls = [];
  function apply() {
    ['headline', 'subtitle', 'description'].forEach(function (name) {
      var element = document.getElementById('holiday-' + name);
      var settings = values[name] || {};
      [['size', 14, 110, 'fontSize'], ['x', -100, 100, 'left'], ['y', -100, 100, 'top']].forEach(function (rule) {
        var n = settings[rule[0]];
        if (typeof n === 'number' && Number.isFinite(n)) element.style[rule[3]] = Math.min(rule[2], Math.max(rule[1], n)) + 'px';
      });
    });
    try { localStorage.setItem('mango-holiday-layout', JSON.stringify(values)); } catch (_) { /* Draft remains in memory. */ }
  }
  [['size', 'Text size', 14, 110], ['x', 'Horizontal position', -100, 100], ['y', 'Vertical position', -100, 100]].forEach(function (rule) {
    var label = document.createElement('label');
    var output = document.createElement('span');
    var input = document.createElement('input'); input.type = 'range'; input.min = rule[2]; input.max = rule[3];
    label.appendChild(output); label.appendChild(input); panel.appendChild(label);
    function sync() {
      var setting = values[select.value] || {};
      var element = document.getElementById('holiday-' + select.value);
      input.value = typeof setting[rule[0]] === 'number' ? setting[rule[0]] : rule[0] === 'size' ? parseFloat(getComputedStyle(element).fontSize) : 0;
      output.textContent = rule[1] + ': ' + input.value + 'px';
    }
    input.addEventListener('input', function () {
      values[select.value] = values[select.value] || {};
      values[select.value][rule[0]] = Number(input.value); apply(); sync();
    });
    controls.push(sync);
  });
  select.addEventListener('change', function () { controls.forEach(function (sync) { sync(); }); });
  function button(text, action) { var b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.addEventListener('click', action); panel.appendChild(b); }
  button('Reset layout', function () {
    values = {};
    ['headline', 'subtitle', 'description'].forEach(function (name) { document.getElementById('holiday-' + name).removeAttribute('style'); });
    apply(); controls.forEach(function (sync) { sync(); });
  });
  button('Export layout', function () {
    var url = URL.createObjectURL(new Blob([JSON.stringify(values, null, 2)], { type: 'application/json' }));
    var a = document.createElement('a'); a.href = url; a.download = 'mangos-holiday-layout.json'; a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
  document.body.appendChild(panel); apply(); controls.forEach(function (sync) { sync(); });
})();
