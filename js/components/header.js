/**
 * Ajwaa (أجواء) - Header Component
 * Sticky top navigation bar with brand identity, AR/EN toggle, search trigger, and settings.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Header = {
    render(container) {
      const state = window.Ajwaa.store.getState();
      const isAr = state.settings.localeCode === 'ar';

      container.innerHTML = `
        <header class="app-header">
          <div class="header-inner">
            <!-- Brand / Logo -->
            <div class="brand-group" id="headerBrandBtn" role="button" tabindex="0" aria-label="أجواء · Ajwaa Home">
              <div class="brand-logo-wrap">
                <svg viewBox="0 0 120 120" width="38" height="38" fill="none">
                  <circle cx="56" cy="40" r="22" fill="url(#sunGradHeader)" />
                  <defs>
                    <linearGradient id="sunGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#FFD166" />
                      <stop offset="100%" stop-color="#F2A65A" />
                    </linearGradient>
                  </defs>
                  <circle cx="56" cy="40" r="2.5" fill="#0B1B33" />
                  <line x1="56" y1="40" x2="48" y2="33" stroke="#0B1B33" stroke-width="2.5" stroke-linecap="round" />
                  <line x1="56" y1="40" x2="67" y2="34" stroke="#0B1B33" stroke-width="2.2" stroke-linecap="round" />
                  <path d="M42 80 H82 A15 15 0 0 0 82 50 A13 13 0 0 0 70 52 A20 20 0 0 0 35 62 A15 15 0 0 0 42 80 Z" fill="#FFFFFF" opacity="0.95" />
                  <circle cx="50" cy="88" r="3" fill="#49B7D8" />
                  <circle cx="68" cy="92" r="3" fill="#2E8B7A" />
                </svg>
              </div>
              <div class="brand-text">
                <span class="brand-name">${isAr ? 'أجواء' : 'Ajwaa'}</span>
                <span class="brand-tagline" data-i18n="appTagline">${window.Ajwaa.I18n.t('appTagline')}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="header-actions">
              <!-- Language Switch Pill -->
              <div class="lang-switch" role="group" aria-label="Language selection">
                <button type="button" class="lang-btn ${isAr ? 'active' : ''}" id="langBtnAr">عربي</button>
                <button type="button" class="lang-btn ${!isAr ? 'active' : ''}" id="langBtnEn">EN</button>
              </div>

              <!-- Search City Button -->
              <button type="button" class="btn-icon" id="headerSearchBtn" title="${window.Ajwaa.I18n.t('searchCity')}" aria-label="${window.Ajwaa.I18n.t('searchCity')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>

              <!-- Settings Button -->
              <button type="button" class="btn-icon" id="headerSettingsBtn" title="${window.Ajwaa.I18n.t('settingsTitle')}" aria-label="${window.Ajwaa.I18n.t('settingsTitle')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>
      `;

      // Event Listeners
      const langBtnAr = container.querySelector('#langBtnAr');
      const langBtnEn = container.querySelector('#langBtnEn');
      if (langBtnAr) langBtnAr.onclick = () => window.Ajwaa.store.setLanguage('ar');
      if (langBtnEn) langBtnEn.onclick = () => window.Ajwaa.store.setLanguage('en');

      const searchBtn = container.querySelector('#headerSearchBtn');
      if (searchBtn) searchBtn.onclick = () => window.Ajwaa.store.openSheet('cityPicker');

      const settingsBtn = container.querySelector('#headerSettingsBtn');
      if (settingsBtn) settingsBtn.onclick = () => window.Ajwaa.store.openSheet('settings');

      const brandBtn = container.querySelector('#headerBrandBtn');
      if (brandBtn) brandBtn.onclick = () => window.Ajwaa.AppCoordinator.loadWeatherForSelectedCity(true);
    }
  };

  window.Ajwaa.Header = Header;
})();
