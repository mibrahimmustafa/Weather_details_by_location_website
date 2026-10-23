/**
 * Ajwaa (أجواء) - Sheets & Modal Dialogs Component
 * City Picker, Settings, Onboarding Welcome, and Metric Explanation modals.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Sheets = {
    searchDebounceTimer: null,
    searchRequestId: 0,

    render(container, activeSheet, explanationData = null) {
      if (!activeSheet) {
        container.innerHTML = '';
        return;
      }

      let contentHtml = '';
      if (activeSheet === 'cityPicker') {
        contentHtml = this.renderCityPickerHtml();
      } else if (activeSheet === 'settings') {
        contentHtml = this.renderSettingsHtml();
      } else if (activeSheet === 'welcome') {
        contentHtml = this.renderWelcomeHtml();
      } else if (activeSheet === 'explain') {
        contentHtml = this.renderExplanationHtml(explanationData);
      }

      container.innerHTML = `
        <div class="sheet-backdrop active" id="sheetBackdrop" role="dialog" aria-modal="true">
          <div class="sheet-container" id="sheetContainer">
            <div class="sheet-drag-handle"></div>
            ${contentHtml}
          </div>
        </div>
      `;

      this.wireEvents(container, activeSheet);
    },

    renderCityPickerHtml() {
      const state = window.Ajwaa.store.getState();
      const saved = state.savedCities || [];
      const popular = window.Ajwaa.Config.popularCities || [];
      const isAr = state.settings.localeCode === 'ar';

      let savedHtml = '';
      if (saved.length === 0) {
        savedHtml = `<p style="font-size:0.85rem; color:var(--text-muted);">${window.Ajwaa.I18n.t('noSavedCities')}</p>`;
      } else {
        saved.forEach(city => {
          const cName = isAr ? (city.name || city.nameEn) : (city.nameEn || city.name);
          const cCountry = isAr ? (city.country || city.countryEn) : (city.countryEn || city.country);
          savedHtml += `
            <div class="saved-city-item" data-city-id="${city.id}">
              <div class="saved-city-info" style="display:flex; flex-direction:column; cursor:pointer; flex:1;">
                <span class="saved-city-name">${cName}</span>
                <span class="saved-city-country">${cCountry}</span>
              </div>
              <button type="button" class="btn-icon delete-city-btn" data-city-id="${city.id}" style="width:32px; height:32px;" title="حذف" aria-label="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          `;
        });
      }

      let popularHtml = '';
      popular.forEach(city => {
        const cName = isAr ? city.name : city.nameEn;
        popularHtml += `<button type="button" class="chip popular-chip" data-city-id="${city.id}">${cName}</button>`;
      });

      return `
        <div class="sheet-header">
          <span class="sheet-title">${window.Ajwaa.I18n.t('searchCity')}</span>
          <button type="button" class="btn-icon sheet-close-btn" aria-label="${window.Ajwaa.I18n.t('close')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="sheet-body">
          <!-- Search Input -->
          <div class="search-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" class="search-input" id="citySearchInput" placeholder="${window.Ajwaa.I18n.t('searchPlaceholder')}" autofocus autocomplete="off" />
          </div>

          <!-- GPS Location Button -->
          <button type="button" class="btn btn-secondary" id="useGpsBtn" style="width:100%; justify-content:flex-start;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--teal-400)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            <span>${window.Ajwaa.I18n.t('currentLocation')}</span>
          </button>

          <!-- Search Results Container -->
          <div id="searchResultsContainer" style="display:none; flex-direction:column; gap:8px;"></div>

          <!-- Popular Cities -->
          <div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">
              ${window.Ajwaa.I18n.t('popularCities')}
            </div>
            <div class="chips-row">
              ${popularHtml}
            </div>
          </div>

          <!-- Saved Cities -->
          <div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">
              ${window.Ajwaa.I18n.t('savedCities')}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;" id="savedCitiesList">
              ${savedHtml}
            </div>
          </div>
        </div>
      `;
    },

    renderSettingsHtml() {
      const state = window.Ajwaa.store.getState();
      const settings = state.settings;
      const isAr = settings.localeCode === 'ar';

      return `
        <div class="sheet-header">
          <span class="sheet-title">${window.Ajwaa.I18n.t('settingsTitle')}</span>
          <button type="button" class="btn-icon sheet-close-btn" aria-label="${window.Ajwaa.I18n.t('close')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="sheet-body">
          <!-- Appearance / Theme -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="font-weight:600; font-size:0.9rem;">${window.Ajwaa.I18n.t('appearance')}</label>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
              <button type="button" class="btn ${settings.themeMode === 'system' ? 'btn-primary' : 'btn-secondary'}" id="themeSystemBtn">${window.Ajwaa.I18n.t('themeSystem')}</button>
              <button type="button" class="btn ${settings.themeMode === 'dark' ? 'btn-primary' : 'btn-secondary'}" id="themeDarkBtn">${window.Ajwaa.I18n.t('themeDark')}</button>
              <button type="button" class="btn ${settings.themeMode === 'light' ? 'btn-primary' : 'btn-secondary'}" id="themeLightBtn">${window.Ajwaa.I18n.t('themeLight')}</button>
            </div>
          </div>

          <!-- Units -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="font-weight:600; font-size:0.9rem;">${window.Ajwaa.I18n.t('units')}</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button type="button" class="btn ${settings.unitSystem === 'metric' ? 'btn-primary' : 'btn-secondary'}" id="unitMetricBtn">${window.Ajwaa.I18n.t('unitMetric')}</button>
              <button type="button" class="btn ${settings.unitSystem === 'imperial' ? 'btn-primary' : 'btn-secondary'}" id="unitImperialBtn">${window.Ajwaa.I18n.t('unitImperial')}</button>
            </div>
          </div>

          <!-- Language -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="font-weight:600; font-size:0.9rem;">${window.Ajwaa.I18n.t('language')}</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button type="button" class="btn ${isAr ? 'btn-primary' : 'btn-secondary'}" id="setLangArBtn">العربية (RTL)</button>
              <button type="button" class="btn ${!isAr ? 'btn-primary' : 'btn-secondary'}" id="setLangEnBtn">English (LTR)</button>
            </div>
          </div>

          <div style="height:1px; background:var(--border-subtle); margin-block:4px;"></div>

          <!-- Legal & Documentation Links -->
          <div style="display:flex; flex-direction:column; gap:10px;">
            <a href="privacy.html" class="saved-city-item" style="text-decoration:none;">
              <span style="font-weight:600;">${window.Ajwaa.I18n.t('privacyPolicy')}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="icon-flip-rtl">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
            <a href="terms.html" class="saved-city-item" style="text-decoration:none;">
              <span style="font-weight:600;">${window.Ajwaa.I18n.t('termsOfUse')}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="icon-flip-rtl">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>

          <!-- App Metadata -->
          <div style="text-align:center; font-size:0.78rem; color:var(--text-muted); line-height:1.6; margin-top:10px;">
            <p><strong>${window.Ajwaa.Config.app.name}</strong> · v${window.Ajwaa.Config.app.version}</p>
            <p>${window.Ajwaa.Config.app.author}</p>
            <p style="margin-top:4px;">Open-Meteo · NASA EONET · BigDataCloud</p>
          </div>
        </div>
      `;
    },

    renderWelcomeHtml() {
      return `
        <div class="sheet-header">
          <span class="sheet-title">${window.Ajwaa.I18n.t('welcomeTitle')}</span>
          <button type="button" class="btn-icon sheet-close-btn" aria-label="${window.Ajwaa.I18n.t('close')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="sheet-body" style="text-align:center; align-items:center;">
          <div style="width:72px; height:72px; margin:0 auto;">
            <svg viewBox="0 0 120 120" width="100%" height="100%" fill="none">
              <circle cx="56" cy="40" r="22" fill="#F2A65A"/>
              <path d="M42 80 H82 A15 15 0 0 0 82 50 A13 13 0 0 0 70 52 A20 20 0 0 0 35 62 A15 15 0 0 0 42 80 Z" fill="#FFFFFF"/>
              <circle cx="50" cy="88" r="3" fill="#49B7D8"/>
              <circle cx="68" cy="92" r="3" fill="#2E8B7A"/>
            </svg>
          </div>

          <h2 style="font-size:1.3rem; font-weight:700;">${window.Ajwaa.I18n.t('welcomeTitle')}</h2>
          <p style="font-size:0.9rem; color:var(--text-secondary); max-width:380px;">${window.Ajwaa.I18n.t('welcomeSubtitle')}</p>

          <div style="display:flex; flex-direction:column; gap:10px; width:100%; margin-top:14px;">
            <button type="button" class="btn btn-primary" id="welcomeGpsBtn" style="width:100%;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              <span>${window.Ajwaa.I18n.t('welcomeAllowLocation')}</span>
            </button>
            <button type="button" class="btn btn-secondary" id="welcomeChooseBtn" style="width:100%;">
              ${window.Ajwaa.I18n.t('welcomeChooseCity')}
            </button>
            <button type="button" class="btn" id="welcomeNotNowBtn" style="color:var(--text-muted); font-size:0.85rem;">
              ${window.Ajwaa.I18n.t('welcomeNotNow')}
            </button>
          </div>
        </div>
      `;
    },

    renderExplanationHtml(data) {
      if (!data) return '';
      return `
        <div class="sheet-header">
          <span class="sheet-title">${data.title}</span>
          <button type="button" class="btn-icon sheet-close-btn" aria-label="${window.Ajwaa.I18n.t('close')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="sheet-body">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span class="badge badge-primary">${data.category || ''}</span>
            <span style="font-size:1.5rem; font-weight:800; color:var(--text-primary); font-variant-numeric:tabular-nums;">${data.value}</span>
          </div>

          <div style="background:var(--input-bg); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:var(--space-4);">
            <h4 style="font-size:0.9rem; font-weight:700; color:var(--teal-300); margin-bottom:6px;">ماذا يعني هذا الرقم؟ / Meaning</h4>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">${data.meaning}</p>
          </div>

          <div style="background:rgba(46, 139, 122, 0.12); border:1px solid rgba(46, 139, 122, 0.3); border-radius:var(--radius-lg); padding:var(--space-4);">
            <h4 style="font-size:0.9rem; font-weight:700; color:var(--teal-400); margin-bottom:6px;">نصائح وإرشادات صحية / Health Advice</h4>
            <p style="font-size:0.88rem; color:var(--text-primary); line-height:1.5;">${data.healthAdvice}</p>
          </div>

          <button type="button" class="btn btn-secondary sheet-close-btn" style="width:100%; margin-top:8px;">
            ${window.Ajwaa.I18n.t('close')}
          </button>
        </div>
      `;
    },

    wireEvents(container, activeSheet) {
      // Backdrop click to close
      const backdrop = container.querySelector('#sheetBackdrop');
      const sheetContainer = container.querySelector('#sheetContainer');
      if (backdrop) {
        backdrop.onclick = (e) => {
          if (e.target === backdrop) {
            window.Ajwaa.store.closeSheet();
          }
        };
      }

      // Close buttons
      container.querySelectorAll('.sheet-close-btn').forEach(btn => {
        btn.onclick = () => window.Ajwaa.store.closeSheet();
      });

      // Escape key handler
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          window.Ajwaa.store.closeSheet();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);

      // Sheet-specific events
      if (activeSheet === 'cityPicker') {
        this.wireCityPicker(container);
      } else if (activeSheet === 'settings') {
        this.wireSettings(container);
      } else if (activeSheet === 'welcome') {
        this.wireWelcome(container);
      }
    },

    wireCityPicker(container) {
      const searchInput = container.querySelector('#citySearchInput');
      const resultsContainer = container.querySelector('#searchResultsContainer');
      const useGpsBtn = container.querySelector('#useGpsBtn');

      if (searchInput) {
        searchInput.oninput = (e) => {
          const q = e.target.value ? e.target.value.trim() : '';
          if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);

          if (!q || q.length < 2) {
            this.searchRequestId++;
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
          }

          const currentRequestId = ++this.searchRequestId;
          this.searchDebounceTimer = setTimeout(async () => {
            resultsContainer.style.display = 'flex';
            resultsContainer.innerHTML = `<div style="text-align:center; padding:12px; color:var(--text-muted); font-size:0.85rem;">جاري البحث... / Searching...</div>`;

            const state = window.Ajwaa.store.getState();
            const results = await window.Ajwaa.GeocodingApi.searchCities(q, state.settings.localeCode);

            // Discard response if a newer query has been dispatched
            if (currentRequestId !== this.searchRequestId) {
              return;
            }

            if (results.length === 0) {
              resultsContainer.innerHTML = `<div style="text-align:center; padding:12px; color:var(--text-muted); font-size:0.85rem;">${window.Ajwaa.I18n.t('noResults')}</div>`;
              return;
            }

            let resHtml = '';
            results.forEach((city, idx) => {
              resHtml += `
                <div class="saved-city-item search-result-item" data-res-index="${idx}" role="button" tabindex="0" style="cursor:pointer;">
                  <div style="display:flex; flex-direction:column;">
                    <span class="saved-city-name">${city.name}</span>
                    <span class="saved-city-country">${city.country} ${city.admin1 ? `· ${city.admin1}` : ''}</span>
                  </div>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="icon-flip-rtl">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              `;
            });
            resultsContainer.innerHTML = resHtml;

            resultsContainer.querySelectorAll('.search-result-item').forEach(el => {
              const chooseCity = () => {
                const idx = Number(el.getAttribute('data-res-index'));
                const chosen = results[idx];
                if (chosen) {
                  window.Ajwaa.store.saveCity(chosen);
                  window.Ajwaa.store.selectCity(chosen);
                }
              };

              el.onclick = chooseCity;
              el.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  chooseCity();
                }
              };
            });
          }, 380); // 380ms debounce
        };
      }

      if (useGpsBtn) {
        useGpsBtn.onclick = () => window.Ajwaa.AppCoordinator.requestGpsLocation();
      }

      // Popular chips
      container.querySelectorAll('.popular-chip').forEach(chip => {
        chip.onclick = () => {
          const id = Number(chip.getAttribute('data-city-id'));
          const target = window.Ajwaa.Config.popularCities.find(c => c.id === id);
          if (target) {
            window.Ajwaa.store.saveCity(target);
            window.Ajwaa.store.selectCity(target);
          }
        };
      });

      // Saved city click & delete
      container.querySelectorAll('.saved-city-item').forEach(item => {
        const infoEl = item.querySelector('.saved-city-info');
        if (infoEl) {
          infoEl.onclick = () => {
            const cityId = Number(item.getAttribute('data-city-id')) || item.getAttribute('data-city-id');
            const state = window.Ajwaa.store.getState();
            const chosen = state.savedCities.find(c => c.id === cityId);
            if (chosen) {
              window.Ajwaa.store.selectCity(chosen);
            }
          };
        }
      });

      container.querySelectorAll('.delete-city-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const cityId = Number(btn.getAttribute('data-city-id')) || btn.getAttribute('data-city-id');
          window.Ajwaa.store.removeCity(cityId);
          // Refresh sheet
          window.Ajwaa.store.openSheet('cityPicker');
        };
      });
    },

    wireSettings(container) {
      const themeSystemBtn = container.querySelector('#themeSystemBtn');
      const themeDarkBtn = container.querySelector('#themeDarkBtn');
      const themeLightBtn = container.querySelector('#themeLightBtn');

      if (themeSystemBtn) themeSystemBtn.onclick = () => window.Ajwaa.store.setTheme('system');
      if (themeDarkBtn) themeDarkBtn.onclick = () => window.Ajwaa.store.setTheme('dark');
      if (themeLightBtn) themeLightBtn.onclick = () => window.Ajwaa.store.setTheme('light');

      const unitMetricBtn = container.querySelector('#unitMetricBtn');
      const unitImperialBtn = container.querySelector('#unitImperialBtn');
      if (unitMetricBtn) unitMetricBtn.onclick = () => window.Ajwaa.store.setUnits('metric');
      if (unitImperialBtn) unitImperialBtn.onclick = () => window.Ajwaa.store.setUnits('imperial');

      const setLangArBtn = container.querySelector('#setLangArBtn');
      const setLangEnBtn = container.querySelector('#setLangEnBtn');
      if (setLangArBtn) setLangArBtn.onclick = () => window.Ajwaa.store.setLanguage('ar');
      if (setLangEnBtn) setLangEnBtn.onclick = () => window.Ajwaa.store.setLanguage('en');
    },

    wireWelcome(container) {
      const gpsBtn = container.querySelector('#welcomeGpsBtn');
      const chooseBtn = container.querySelector('#welcomeChooseBtn');
      const notNowBtn = container.querySelector('#welcomeNotNowBtn');

      const dismissWelcome = () => {
        window.Ajwaa.Storage.setOnboardingSeen();
        const state = window.Ajwaa.store.getState();
        state.settings.hasSeenWelcome = true;
        window.Ajwaa.Storage.saveSettings(state.settings);
      };

      if (gpsBtn) {
        gpsBtn.onclick = () => {
          dismissWelcome();
          window.Ajwaa.store.closeSheet();
          window.Ajwaa.AppCoordinator.requestGpsLocation();
        };
      }

      if (chooseBtn) {
        chooseBtn.onclick = () => {
          dismissWelcome();
          window.Ajwaa.store.openSheet('cityPicker');
        };
      }

      if (notNowBtn) {
        notNowBtn.onclick = () => {
          dismissWelcome();
          window.Ajwaa.store.closeSheet();
        };
      }
    }
  };

  window.Ajwaa.Sheets = Sheets;
})();
