(function () {
  'use strict';

  const DISMISS_KEY = 'cindyWorkout.installDismissedAt.v1';
  const DISMISS_DAYS = 14;
  const userAgent = navigator.userAgent || '';
  const isAppleMobile = /iPhone|iPad|iPod/i.test(userAgent);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
    || window.matchMedia('(pointer: coarse) and (max-width: 900px)').matches;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  let deferredPrompt = null;
  let promptElement = null;

  function recentlyDismissed() {
    try {
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY));
      return dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86400000;
    } catch {
      return false;
    }
  }

  function hide(remember = false) {
    if (!promptElement) return;
    promptElement.classList.remove('visible');
    if (remember) {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* Continue without persistence. */ }
    }
  }

  function createPrompt(mode) {
    if (promptElement || !isMobile || isStandalone || recentlyDismissed()) return;

    const copy = mode === 'ios'
      ? 'Tap Share, then “Add to Home Screen”.'
      : mode === 'native'
        ? 'Install it for quick access and a full-screen experience.'
        : 'Open your browser menu and choose “Add to Home screen”.';
    const action = mode === 'native' ? 'Install' : 'Got it';

    promptElement = document.createElement('aside');
    promptElement.className = 'install-prompt';
    promptElement.setAttribute('role', 'dialog');
    promptElement.setAttribute('aria-label', 'Install Cindy Workout');
    promptElement.innerHTML = `
      <div class="install-prompt-icon" aria-hidden="true">C</div>
      <div class="install-prompt-copy">
        <div class="install-prompt-title">Save Cindy as an app</div>
        <div class="install-prompt-text">${copy}</div>
      </div>
      <div class="install-prompt-actions">
        <button class="install-prompt-button" type="button">${action}</button>
        <button class="install-prompt-close" type="button" aria-label="Dismiss install suggestion">×</button>
      </div>`;

    promptElement.querySelector('.install-prompt-close').addEventListener('click', () => hide(true));
    promptElement.querySelector('.install-prompt-button').addEventListener('click', async () => {
      if (mode !== 'native' || !deferredPrompt) {
        hide(true);
        return;
      }
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      hide(choice.outcome !== 'accepted');
    });

    document.body.appendChild(promptElement);
    requestAnimationFrame(() => requestAnimationFrame(() => promptElement.classList.add('visible')));
  }

  if (!isMobile || isStandalone || recentlyDismissed()) return;

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    createPrompt('native');
  });

  window.addEventListener('appinstalled', () => {
    try { localStorage.removeItem(DISMISS_KEY); } catch { /* Installation still succeeded. */ }
    hide(false);
  });

  window.addEventListener('load', () => {
    if (isAppleMobile) {
      setTimeout(() => createPrompt('ios'), 1800);
    } else {
      setTimeout(() => {
        if (!deferredPrompt) createPrompt('manual');
      }, 4500);
    }
  });
}());
