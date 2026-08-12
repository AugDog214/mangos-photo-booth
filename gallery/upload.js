/* Mango's private guest uploader.
   Public configuration lives in <meta> tags on gallery/index.html. This file
   contains no credentials; event/session/upload tokens stay in memory only. */
(function () {
  'use strict';

  var form = document.getElementById('guest-upload-form');
  if (!form) return;

  var shell = document.querySelector('.gallery-upload-shell');
  var availability = document.getElementById('upload-availability');
  var configNotice = document.getElementById('upload-config-notice');
  var codeInput = document.getElementById('upload-event-code');
  var codeError = document.getElementById('upload-event-code-error');
  var unlockButton = document.getElementById('upload-unlock');
  var turnstileHost = document.getElementById('upload-turnstile');
  var filesStep = document.getElementById('upload-files-step');
  var eventSummary = document.getElementById('upload-event-summary');
  var fileInput = document.getElementById('upload-files');
  var dropzone = document.getElementById('upload-dropzone');
  var fileRules = document.getElementById('upload-file-rules');
  var fileList = document.getElementById('upload-file-list');
  var emptyState = document.getElementById('upload-empty');
  var consent = document.getElementById('upload-consent');
  var consentError = document.getElementById('upload-consent-error');
  var uploadButton = document.getElementById('upload-submit');
  var overallStatus = document.getElementById('upload-overall-status');
  var copyButton = document.getElementById('upload-copy-link');

  var readMeta = function (name) {
    var node = document.querySelector('meta[name="' + name + '"]');
    return node ? node.getAttribute('content').trim() : '';
  };
  var apiBase = readMeta('mangos-upload-api-base').replace(/\/+$/, '');
  var turnstileSiteKey = readMeta('mangos-upload-turnstile-site-key');
  var turnstileAction = readMeta('mangos-upload-turnstile-action') || 'event_lookup';
  var allowInsecureLocal = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  var validApiBase = /^https:\/\//i.test(apiBase) || (allowInsecureLocal && /^http:\/\//i.test(apiBase));
  var configured = Boolean(validApiBase && turnstileSiteKey);

  var session = null;
  var turnstileToken = '';
  var turnstileWidgetId = null;
  var selected = [];
  var uploadInProgress = false;
  var uploadCounter = 0;

  var DEFAULT_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
  var CONSENT_VERSION = 'guest-upload-private-event-v1';
  var STATUS_LABELS = {
    selected: 'Ready to upload',
    preparing: 'Preparing secure upload',
    uploading: 'Uploading',
    quarantined: 'Received — security checks pending',
    scanning: 'Security scan in progress',
    approved: 'Ready for Mango’s review',
    rejected: 'File was not accepted',
    failed: 'Upload failed'
  };

  var setText = function (node, text) {
    if (node) node.textContent = text;
  };

  var setOverall = function (message, kind) {
    if (!overallStatus) return;
    overallStatus.className = 'upload-overall-status' + (kind ? ' is-' + kind : '');
    overallStatus.textContent = message || '';
  };

  var formatBytes = function (bytes) {
    if (!Number.isFinite(bytes) || bytes < 1) return '0 bytes';
    var units = ['bytes', 'KB', 'MB', 'GB'];
    var index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    var value = bytes / Math.pow(1024, index);
    return (index === 0 ? Math.round(value) : value.toFixed(value >= 10 ? 0 : 1)) + ' ' + units[index];
  };

  var request = async function (url, options, timeoutMs) {
    var controller = new AbortController();
    var timer = window.setTimeout(function () { controller.abort(); }, timeoutMs || 15000);
    try {
      var response = await fetch(url, Object.assign({
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        signal: controller.signal
      }, options || {}));
      if (!response.ok) {
        var error = new Error('request_failed');
        error.status = response.status;
        throw error;
      }
      return response;
    } finally {
      window.clearTimeout(timer);
    }
  };

  var friendlyLookupError = function (error) {
    if (error && (error.status === 401 || error.status === 404)) return 'That event code was not recognized. Check the code and try again.';
    if (error && error.status === 410) return 'This event upload window has closed. Contact Mango’s if you still need to share files.';
    if (error && error.status === 429) return 'Too many attempts were made. Please wait a few minutes before trying again.';
    return 'We could not unlock the event right now. Check your connection and try again.';
  };

  var resetTurnstile = function () {
    turnstileToken = '';
    if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
  };

  var renderTurnstile = function () {
    if (!configured || !window.turnstile || turnstileWidgetId !== null) return;
    turnstileWidgetId = window.turnstile.render(turnstileHost, {
      sitekey: turnstileSiteKey,
      action: turnstileAction,
      theme: 'light',
      appearance: 'interaction-only',
      callback: function (token) {
        turnstileToken = token;
        codeError.textContent = '';
      },
      'expired-callback': function () { turnstileToken = ''; },
      'error-callback': function () {
        turnstileToken = '';
        setText(codeError, 'Security verification could not load. Refresh the page and try again.');
      }
    });
  };

  var loadTurnstile = function () {
    if (!configured) return;
    window.mangosTurnstileReady = renderTurnstile;
    var script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=mangosTurnstileReady';
    script.async = true;
    script.defer = true;
    script.referrerPolicy = 'no-referrer';
    script.onerror = function () {
      setText(codeError, 'Security verification could not load. Refresh the page and try again.');
    };
    document.head.appendChild(script);
  };

  var initialiseConfigurationState = function () {
    if (!configured) {
      shell.setAttribute('data-upload-state', 'unconfigured');
      return;
    }
    shell.setAttribute('data-upload-state', 'locked');
    availability.innerHTML = '<span class="upload-availability-dot" aria-hidden="true"></span>Secure uploads available';
    configNotice.hidden = true;
    codeInput.disabled = false;
    unlockButton.disabled = false;
    loadTurnstile();
  };

  var uploadPageUrl = function () {
    var canonical = document.querySelector('link[rel="canonical"]');
    return (canonical ? canonical.href : 'https://mangosphotobooth.com/gallery/') + '#upload';
  };

  copyButton.addEventListener('click', async function () {
    var label = copyButton.querySelector('span');
    try {
      await navigator.clipboard.writeText(uploadPageUrl());
      setText(label, 'Link copied');
    } catch (_error) {
      setText(label, 'Copy unavailable');
    }
    window.setTimeout(function () { setText(label, 'Copy upload link'); }, 2400);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!configured || uploadInProgress) return;

    var eventCode = codeInput.value.trim().toUpperCase();
    codeError.textContent = '';
    if (!/^[A-Z0-9-]{6,64}$/.test(eventCode)) {
      setText(codeError, 'Enter the 6–64 character code shared by your host, using letters, numbers, or hyphens.');
      codeInput.focus();
      return;
    }
    if (!turnstileToken) {
      setText(codeError, 'Complete the security check, then try again.');
      return;
    }

    uploadInProgress = true;
    codeInput.disabled = true;
    unlockButton.disabled = true;
    setText(unlockButton, 'Checking…');

    try {
      var response = await request(apiBase + '/v1/events/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ eventCode: eventCode, turnstileToken: turnstileToken })
      });
      var payload = await response.json();
      if (!payload || !payload.event || !payload.session || !payload.session.token || payload.session.consentVersion !== CONSENT_VERSION) throw new Error('invalid_response');

      session = payload.session;
      session.maxFiles = Math.max(1, Number(session.maxFiles) || 1);
      session.maxBytesPerFile = Math.max(1, Number(session.maxBytesPerFile) || 1);
      session.allowedMimeTypes = Array.isArray(session.allowedMimeTypes) && session.allowedMimeTypes.length ? session.allowedMimeTypes : DEFAULT_MIMES;

      codeInput.value = '';
      resetTurnstile();
      shell.setAttribute('data-upload-state', 'unlocked');
      filesStep.hidden = false;
      filesStep.disabled = false;
      fileInput.disabled = false;
      consent.disabled = false;
      fileInput.accept = session.allowedMimeTypes.join(',');
      setText(eventSummary, (payload.event.name || 'Private event') + ' is unlocked. Upload access expires ' + formatDate(payload.session.expiresAt) + '.');
      setText(fileRules, 'Up to ' + session.maxFiles + ' files · ' + formatBytes(session.maxBytesPerFile) + ' each · Photos, GIFs, and supported videos. File types are verified after upload.');
      setText(availability, 'Private event unlocked');
      filesStep.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      fileInput.focus();
    } catch (error) {
      setText(codeError, friendlyLookupError(error));
      codeInput.disabled = false;
      unlockButton.disabled = false;
      setText(unlockButton, 'Unlock');
      resetTurnstile();
      codeInput.focus();
    } finally {
      uploadInProgress = false;
    }
  });

  var formatDate = function (dateValue) {
    var date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'soon';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
  };

  var validateFile = function (file) {
    if (!session.allowedMimeTypes.includes(file.type)) return 'This file type is not accepted for this event.';
    if (file.size > session.maxBytesPerFile) return 'This file is larger than the ' + formatBytes(session.maxBytesPerFile) + ' limit.';
    if (file.size < 1) return 'This file is empty.';
    return '';
  };

  var addFiles = function (fileCollection) {
    if (!session || uploadInProgress) return;
    var files = Array.from(fileCollection || []);
    var remaining = Math.max(0, session.maxFiles - selected.length);
    var rejectedMessages = [];

    files.slice(0, remaining).forEach(function (file) {
      var validationError = validateFile(file);
      if (validationError) {
        rejectedMessages.push(file.name + ': ' + validationError);
        return;
      }
      selected.push({
        localId: 'file-' + Date.now() + '-' + (++uploadCounter),
        file: file,
        previewUrl: URL.createObjectURL(file),
        status: 'selected',
        progress: 0,
        uploadId: '',
        error: ''
      });
    });
    if (files.length > remaining) rejectedMessages.push('Only ' + session.maxFiles + ' files can be selected for this event.');
    fileInput.value = '';
    renderFiles();
    setOverall(rejectedMessages.join(' '), rejectedMessages.length ? 'error' : '');
  };

  fileInput.addEventListener('change', function () { addFiles(fileInput.files); });
  ['dragenter', 'dragover'].forEach(function (name) {
    dropzone.addEventListener(name, function (event) {
      event.preventDefault();
      if (!fileInput.disabled) dropzone.classList.add('is-dragging');
    });
  });
  ['dragleave', 'drop'].forEach(function (name) {
    dropzone.addEventListener(name, function (event) {
      event.preventDefault();
      dropzone.classList.remove('is-dragging');
    });
  });
  dropzone.addEventListener('drop', function (event) {
    if (!fileInput.disabled && event.dataTransfer) addFiles(event.dataTransfer.files);
  });

  var removeRecord = function (localId) {
    var index = selected.findIndex(function (record) { return record.localId === localId; });
    if (index < 0 || selected[index].status === 'uploading' || selected[index].status === 'preparing') return;
    URL.revokeObjectURL(selected[index].previewUrl);
    selected.splice(index, 1);
    renderFiles();
  };

  var renderFiles = function () {
    fileList.replaceChildren();
    emptyState.hidden = selected.length > 0;

    selected.forEach(function (record) {
      var item = document.createElement('li');
      item.className = 'upload-file-item is-' + record.status;
      item.setAttribute('data-file-id', record.localId);

      var preview = document.createElement(record.file.type.indexOf('video/') === 0 ? 'video' : 'img');
      preview.className = 'upload-file-preview';
      preview.src = record.previewUrl;
      if (preview.tagName === 'VIDEO') {
        preview.muted = true;
        preview.preload = 'metadata';
        preview.setAttribute('playsinline', '');
        preview.setAttribute('aria-label', 'Preview of ' + record.file.name);
      } else {
        preview.alt = 'Preview of ' + record.file.name;
      }

      var details = document.createElement('div');
      details.className = 'upload-file-details';
      var name = document.createElement('strong');
      name.textContent = record.file.name;
      var meta = document.createElement('span');
      meta.textContent = formatBytes(record.file.size);
      var status = document.createElement('span');
      status.className = 'upload-file-status';
      status.textContent = STATUS_LABELS[record.status] + (record.status === 'uploading' ? ' · ' + record.progress + '%' : '') + (record.error ? ' · ' + record.error : '');
      status.setAttribute('role', record.status === 'failed' || record.status === 'rejected' ? 'alert' : 'status');
      details.append(name, meta, status);

      var progress = document.createElement('progress');
      progress.className = 'upload-file-progress';
      progress.max = 100;
      progress.value = record.progress;
      progress.setAttribute('aria-label', 'Upload progress for ' + record.file.name);
      progress.hidden = record.status !== 'uploading';
      details.appendChild(progress);

      var actions = document.createElement('div');
      actions.className = 'upload-file-actions';
      if (record.status === 'failed') {
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'upload-file-action';
        retry.textContent = 'Retry';
        retry.addEventListener('click', function () { retryRecord(record); });
        actions.appendChild(retry);
      }
      if (record.status !== 'uploading' && record.status !== 'preparing') {
        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'upload-file-action is-remove';
        remove.textContent = 'Remove';
        remove.addEventListener('click', function () { removeRecord(record.localId); });
        actions.appendChild(remove);
      }

      item.append(preview, details, actions);
      fileList.appendChild(item);
    });

    var readyCount = selected.filter(function (record) { return record.status === 'selected' || record.status === 'failed'; }).length;
    uploadButton.disabled = uploadInProgress || !session || readyCount < 1 || !consent.checked;
  };

  consent.addEventListener('change', function () {
    consentError.textContent = '';
    renderFiles();
  });

  var updateRecord = function (record, status, progress, error) {
    record.status = status;
    record.progress = typeof progress === 'number' ? progress : record.progress;
    record.error = error || '';
    renderFiles();
  };

  var uploadRawFile = function (record, target) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', target.uploadUrl, true);
      xhr.timeout = 120000;
      xhr.withCredentials = false;
      xhr.setRequestHeader('Authorization', 'Bearer ' + target.uploadToken);
      xhr.setRequestHeader('Content-Type', record.file.type);
      xhr.upload.addEventListener('progress', function (event) {
        if (event.lengthComputable) updateRecord(record, 'uploading', Math.round((event.loaded / event.total) * 100));
      });
      xhr.addEventListener('load', function () {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error('upload_failed'));
      });
      xhr.addEventListener('error', function () { reject(new Error('upload_failed')); });
      xhr.addEventListener('timeout', function () { reject(new Error('upload_timeout')); });
      xhr.send(record.file);
    });
  };

  var pollStatus = async function (record) {
    var attempts = 0;
    while (attempts < 8) {
      attempts += 1;
      await new Promise(function (resolve) { window.setTimeout(resolve, attempts === 1 ? 800 : 1800); });
      try {
        var response = await request(apiBase + '/v1/uploads/' + encodeURIComponent(record.uploadId) + '/status', {
          headers: { 'Authorization': 'Bearer ' + session.token, 'Accept': 'application/json' }
        });
        var payload = await response.json();
        var status = payload && payload.status;
        if (status === 'approved') return updateRecord(record, 'approved', 100);
        if (status === 'rejected') return updateRecord(record, 'rejected', 100, 'Remove this file or contact Mango’s for help.');
        if (status === 'failed') return updateRecord(record, 'failed', 0, 'Try this file again.');
        if (status === 'scanning') updateRecord(record, 'scanning', 100);
        else updateRecord(record, 'quarantined', 100);
      } catch (_error) {
        return updateRecord(record, 'quarantined', 100);
      }
    }
  };

  var reconcileExistingUpload = async function (record) {
    if (!record.uploadId || !session) return false;
    try {
      var response = await request(apiBase + '/v1/uploads/' + encodeURIComponent(record.uploadId) + '/status', {
        headers: { 'Authorization': 'Bearer ' + session.token, 'Accept': 'application/json' }
      });
      var payload = await response.json();
      var status = payload && payload.status;
      if (status === 'approved') updateRecord(record, 'approved', 100);
      else if (status === 'rejected') updateRecord(record, 'rejected', 100, 'Remove this file or contact Mango\u2019s for help.');
      else if (status === 'failed') return false;
      else updateRecord(record, status === 'scanning' ? 'scanning' : 'quarantined', 100);
      return true;
    } catch (_error) {
      return false;
    }
  };

  var uploadRecord = async function (record) {
    updateRecord(record, 'preparing', 0);
    try {
      if (await reconcileExistingUpload(record)) return;
      record.uploadId = '';
      var response = await request(apiBase + '/v1/uploads/initiate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + session.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fileName: record.file.name,
          contentType: record.file.type,
          size: record.file.size,
          consentVersion: CONSENT_VERSION
        })
      });
      var target = await response.json();
      if (!target || !target.uploadId || !target.uploadToken || !target.uploadUrl) throw new Error('invalid_response');
      var apiUrl = new URL(apiBase);
      var targetUrl = new URL(target.uploadUrl);
      var expectedUploadPath = apiUrl.pathname.replace(/\/$/, '') + '/v1/uploads/' + encodeURIComponent(target.uploadId) + '/content';
      var sameOrigin = targetUrl.origin === apiUrl.origin;
      var expectedPath = targetUrl.pathname === expectedUploadPath;
      if (!sameOrigin || !expectedPath || targetUrl.search || targetUrl.hash || targetUrl.username || targetUrl.password) throw new Error('invalid_target');
      record.uploadId = target.uploadId;
      updateRecord(record, 'uploading', 0);
      await uploadRawFile(record, target);
      updateRecord(record, 'quarantined', 100);
      await pollStatus(record);
    } catch (error) {
      var message = error && error.status === 413 ? 'File exceeds the secure upload limit.' : 'Check your connection and try again.';
      updateRecord(record, 'failed', 0, message);
    }
  };

  var retryRecord = async function (record) {
    if (uploadInProgress || !session) return;
    if (!consent.checked) {
      setText(consentError, 'Confirm permission and consent before uploading.');
      consent.focus();
      return;
    }
    uploadInProgress = true;
    renderFiles();
    await uploadRecord(record);
    uploadInProgress = false;
    renderFiles();
  };

  uploadButton.addEventListener('click', async function () {
    if (!configured || !session || uploadInProgress) return;
    consentError.textContent = '';
    if (!consent.checked) {
      setText(consentError, 'Confirm permission and consent before uploading.');
      consent.focus();
      return;
    }
    var queue = selected.filter(function (record) { return record.status === 'selected' || record.status === 'failed'; });
    if (!queue.length) return;

    uploadInProgress = true;
    fileInput.disabled = true;
    consent.disabled = true;
    renderFiles();
    setOverall('Uploading ' + queue.length + (queue.length === 1 ? ' file…' : ' files…'), 'working');
    for (var index = 0; index < queue.length; index += 1) await uploadRecord(queue[index]);
    uploadInProgress = false;
    fileInput.disabled = false;
    consent.disabled = false;
    renderFiles();

    var failures = queue.filter(function (record) { return record.status === 'failed' || record.status === 'rejected'; }).length;
    if (failures) setOverall('Some files need attention. Use Retry or Remove beside each affected file.', 'error');
    else setOverall('Files received. They are private and pending security checks or Mango’s review.', 'success');
  });

  window.addEventListener('beforeunload', function () {
    selected.forEach(function (record) { URL.revokeObjectURL(record.previewUrl); });
    session = null;
    turnstileToken = '';
  });

  initialiseConfigurationState();
  renderFiles();
})();
