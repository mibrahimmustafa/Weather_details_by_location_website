/**
 * Ajwaa (أجواء) - Main Application Bootstrap & Lifecycle Coordinator
 * Coordinates state, concurrent API queries, DOM rendering, offline cache, and interactions.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const AppCoordinator = {
    async init() {
      // 1. Initialize store state
      const state = window.Ajwaa.store.getState();

      // 2. Initialize Language & Direction
      window.Ajwaa.I18n.init(state.settings.localeCode);

      // 3. Initialize Theme
      window.Ajwaa.store.applyTheme(state.settings.themeMode);

      // 4. Bind Store updates to UI renderers
      window.Ajwaa.store.subscribe((nextState) => {
        this.renderAll(nextState);
      });

      // 5. Initial Render (Header, Skeletons, Footer)
      this.renderStaticChrome(state);

      // 6. Check Onboarding Sheet
      if (!window.Ajwaa.Storage.hasSeenOnboarding()) {
        setTimeout(() => {
          window.Ajwaa.store.openSheet('welcome');
        }, 1200);
      }

      // 7. Load weather for selected city
      await this.loadWeatherForSelectedCity();

      // 8. Pull-to-refresh setup
      this.setupPullToRefresh();
    },

    renderStaticChrome(state) {
      const headerContainer = document.getElementById('headerMount');
      if (headerContainer) {
        window.Ajwaa.Header.render(headerContainer);
      }

      const footerContainer = document.getElementById('footerMount');
      if (footerContainer) {
        this.renderFooter(footerContainer, state.settings.localeCode);
      }
    },

    async loadWeatherForSelectedCity(forceFresh = false) {
      const state = window.Ajwaa.store.getState();
      const city = state.selectedCity || window.Ajwaa.Config.defaultCity;

      window.Ajwaa.store.setState({ loading: true, refreshing: forceFresh, error: null });

      // Check Cache first if not forcing refresh
      if (!forceFresh) {
        const cached = window.Ajwaa.Storage.getCachedWeather(city.id, city.lat, city.lon);
        if (cached && cached.isFresh && cached.forecast) {
          window.Ajwaa.store.setState({
            weatherData: {
              forecast: cached.forecast,
              air: cached.air,
              storms: cached.storms,
              fetchedAt: cached.fetchedAt
            },
            isCached: false,
            loading: false,
            refreshing: false
          });
          return;
        }
      }

      try {
        // Fetch APIs concurrently using Promise.allSettled
        const [forecastRes, airRes, stormsRes] = await Promise.allSettled([
          window.Ajwaa.ForecastApi.getForecast(city.lat, city.lon),
          window.Ajwaa.AirQualityApi.getAirQuality(city.lat, city.lon),
          window.Ajwaa.StormsApi.getActiveStorms(city.lat, city.lon)
        ]);

        if (forecastRes.status !== 'fulfilled' || !forecastRes.value) {
          throw forecastRes.reason || new Error('Failed to fetch forecast');
        }

        const forecastData = forecastRes.value;
        const airData = airRes.status === 'fulfilled' ? airRes.value : null;
        const stormsData = stormsRes.status === 'fulfilled' ? stormsRes.value : { status: 'unavailable', events: [] };

        // Save raw responses to localStorage cache
        window.Ajwaa.Storage.saveWeatherCache(
          city.id,
          city.lat,
          city.lon,
          forecastData,
          airData,
          stormsData
        );

        window.Ajwaa.store.setState({
          weatherData: {
            forecast: forecastData,
            air: airData,
            storms: stormsData,
            fetchedAt: Date.now()
          },
          isCached: false,
          loading: false,
          refreshing: false,
          error: null
        });
      } catch (err) {
        console.warn('Network error while fetching weather:', err);

        // Check if we have any valid cached data to fall back on
        const cached = window.Ajwaa.Storage.getCachedWeather(city.id, city.lat, city.lon);
        if (cached && cached.forecast) {
          window.Ajwaa.store.setState({
            weatherData: {
              forecast: cached.forecast,
              air: cached.air,
              storms: cached.storms,
              fetchedAt: cached.fetchedAt
            },
            isCached: true,
            loading: false,
            refreshing: false,
            error: null
          });
          window.Ajwaa.Toast.show(window.Ajwaa.I18n.t('offlineBanner'));
        } else {
          // Total failure with no cache
          window.Ajwaa.store.setState({
            weatherData: null,
            loading: false,
            refreshing: false,
            error: err.message || window.Ajwaa.I18n.t('errorNetwork')
          });
        }
      }
    },

    async requestGpsLocation() {
      if (!navigator.geolocation) {
        window.Ajwaa.Toast.show(window.Ajwaa.I18n.t('locationPermissionDenied'));
        return;
      }

      window.Ajwaa.Toast.show('جاري تحديد موقعك الجغرافي... / Detecting GPS...');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const state = window.Ajwaa.store.getState();

          try {
            const resolvedCity = await window.Ajwaa.GeocodingApi.reverseGeocode(
              lat,
              lon,
              state.settings.localeCode
            );
            window.Ajwaa.store.saveCity(resolvedCity);
            window.Ajwaa.store.selectCity(resolvedCity);
          } catch (err) {
            console.warn('Reverse geocode error:', err);
            const fallbackGps = {
              id: `gps-${lat.toFixed(2)}-${lon.toFixed(2)}`,
              name: state.settings.localeCode === 'ar' ? 'موقعي الحالي' : 'Current Location',
              nameEn: 'Current Location',
              lat,
              lon,
              country: '',
              isGps: true
            };
            window.Ajwaa.store.selectCity(fallbackGps);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          window.Ajwaa.Toast.show(window.Ajwaa.I18n.t('locationPermissionDenied'));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    },

    renderAll(state) {
      const { settings, selectedCity, weatherData, loading, refreshing, error, isCached, activeSheet, explanationData } = state;
      const locale = settings.localeCode;
      const units = settings.unitSystem;

      // 1. Header
      const headerContainer = document.getElementById('headerMount');
      if (headerContainer) window.Ajwaa.Header.render(headerContainer);

      // 2. Offline Banner
      const offlineBanner = document.getElementById('offlineBannerMount');
      if (offlineBanner) {
        if (isCached) {
          offlineBanner.style.display = 'flex';
          offlineBanner.innerHTML = `
            <div class="offline-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                <line x1="12" y1="20" x2="12.01" y2="20"/>
              </svg>
              <span>${window.Ajwaa.I18n.t('offlineBanner')}</span>
            </div>
          `;
        } else {
          offlineBanner.innerHTML = '';
          offlineBanner.style.display = 'none';
        }
      }

      // 3. Error state display
      const mainContent = document.getElementById('mainContentMount');
      const errorContainer = document.getElementById('errorMount');

      if (error && !weatherData) {
        if (mainContent) mainContent.style.display = 'none';
        if (errorContainer) {
          errorContainer.style.display = 'block';
          errorContainer.innerHTML = `
            <div class="card" style="text-align:center; padding:var(--space-8); max-width:480px; margin:var(--space-10) auto; display:flex; flex-direction:column; align-items:center; gap:var(--space-4);">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--coral-500)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h2 style="font-size:1.25rem; font-weight:700;">تعذر تحميل بيانات الطقس</h2>
              <p style="color:var(--text-secondary); font-size:0.9rem;">${error}</p>
              <button type="button" class="btn btn-primary" id="retryLoadBtn" style="margin-top:8px;">
                ${window.Ajwaa.I18n.t('retry')}
              </button>
            </div>
          `;
          const retryBtn = errorContainer.querySelector('#retryLoadBtn');
          if (retryBtn) retryBtn.onclick = () => this.loadWeatherForSelectedCity(true);
        }
        return;
      }

      if (errorContainer) errorContainer.style.display = 'none';
      if (mainContent) mainContent.style.display = 'flex';

      // 4. Hero Card
      const heroMount = document.getElementById('heroMount');
      if (heroMount) {
        window.Ajwaa.Hero.render(heroMount, weatherData, selectedCity, units, locale, refreshing);
      }

      if (!weatherData) return;

      // 5. Weather Alerts
      const alertsMount = document.getElementById('alertsMount');
      if (alertsMount) {
        const closestStorm = (weatherData.storms && weatherData.storms.events && weatherData.storms.events[0])
          ? weatherData.storms.events[0]
          : null;
        const computedAlerts = window.Ajwaa.AlertsEngine.evaluateAlerts(
          weatherData.forecast,
          weatherData.air,
          closestStorm
        );
        window.Ajwaa.Alerts.render(alertsMount, computedAlerts, locale);
      }

      // 6. 24h Hourly Forecast
      const hourlyMount = document.getElementById('hourlyMount');
      if (hourlyMount) {
        window.Ajwaa.Hourly.render(hourlyMount, weatherData.forecast, units, locale);
      }

      // 7. Rain & Dust Dual
      const rainDustMount = document.getElementById('rainDustMount');
      if (rainDustMount) {
        window.Ajwaa.RainDust.render(rainDustMount, weatherData.forecast, weatherData.air, units, locale);
      }

      // 8. Weather Details Grid
      const detailsMount = document.getElementById('detailsMount');
      if (detailsMount) {
        window.Ajwaa.Details.render(detailsMount, weatherData.forecast, weatherData.air, units, locale);
      }

      // 9. Sun Path Arc
      const sunPathMount = document.getElementById('sunPathMount');
      if (sunPathMount) {
        window.Ajwaa.SunPath.render(sunPathMount, weatherData.forecast, locale);
      }

      // 10. Active Cyclones
      const cyclonesMount = document.getElementById('cyclonesMount');
      if (cyclonesMount) {
        window.Ajwaa.Cyclones.render(cyclonesMount, weatherData.storms, locale);
      }

      // 11. 7-Day Forecast
      const forecast7Mount = document.getElementById('forecast7Mount');
      if (forecast7Mount) {
        window.Ajwaa.Forecast7.render(forecast7Mount, weatherData.forecast, units, locale);
      }

      // 12. Sheets & Modals
      const sheetMount = document.getElementById('sheetMount');
      if (sheetMount) {
        window.Ajwaa.Sheets.render(sheetMount, activeSheet, explanationData);
      }
    },

    renderFooter(container, locale = 'ar') {
      const isAr = locale === 'ar';
      container.innerHTML = `
        <footer class="app-footer">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg viewBox="0 0 120 120" width="28" height="28" fill="none">
                <circle cx="56" cy="40" r="22" fill="#F2A65A" />
                <path d="M42 80 H82 A15 15 0 0 0 82 50 A13 13 0 0 0 70 52 A20 20 0 0 0 35 62 A15 15 0 0 0 42 80 Z" fill="#FFFFFF" />
                <circle cx="50" cy="88" r="3" fill="#49B7D8" />
                <circle cx="68" cy="92" r="3" fill="#2E8B7A" />
              </svg>
            </div>
            <span class="footer-brand-title">${isAr ? 'أجواء' : 'Ajwaa'}</span>
          </div>

          <p class="footer-meta">${window.Ajwaa.I18n.t('footerAbout')}</p>

          <div class="footer-links">
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
            <span>•</span>
            <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA EONET</a>
            <span>•</span>
            <a href="https://www.bigdatacloud.com/" target="_blank" rel="noopener noreferrer">BigDataCloud</a>
            <span>•</span>
            <a href="privacy.html">${window.Ajwaa.I18n.t('privacyPolicy')}</a>
            <span>•</span>
            <a href="terms.html">${window.Ajwaa.I18n.t('termsOfUse')}</a>
          </div>

          <p class="footer-meta" style="font-size:0.75rem;">
            ${window.Ajwaa.I18n.t('footerCredits')}<br/>
            ${window.Ajwaa.I18n.t('footerOpenData')}
          </p>
        </footer>
      `;
    },

    setupPullToRefresh() {
      let touchStartY = 0;
      let touchMoveY = 0;

      window.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0) {
          touchMoveY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (window.scrollY === 0 && (touchMoveY - touchStartY > 90)) {
          this.loadWeatherForSelectedCity(true);
        }
        touchStartY = 0;
        touchMoveY = 0;
      }, { passive: true });
    }
  };

  window.Ajwaa.AppCoordinator = AppCoordinator;

  // Bootstrap when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AppCoordinator.init());
  } else {
    AppCoordinator.init();
  }
})();
