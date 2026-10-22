/**
 * Ajwaa (أجواء) - Hero Card Component
 * City status, giant live temperature, local ticking clock, and dynamic atmospheric scenes.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Hero = {
    clockTimer: null,

    render(container, weatherData, city, unitSystem = 'metric', locale = 'ar', isRefreshing = false) {
      if (!weatherData || !weatherData.forecast || !weatherData.forecast.current) {
        container.innerHTML = `
          <div class="hero-card card skeleton skeleton-hero"></div>
        `;
        return;
      }

      const cur = weatherData.forecast.current;
      const daily = weatherData.forecast.daily || {};
      const utcOffsetSeconds = weatherData.forecast.utc_offset_seconds || 0;

      const condition = window.Ajwaa.Conditions.getCondition(cur.weather_code, cur.is_day);
      const tempVal = window.Ajwaa.Units.formatTemp(cur.temperature_2m, unitSystem);
      const unitLabel = window.Ajwaa.Units.getTempUnit(unitSystem);

      const feelsLikeVal = window.Ajwaa.Units.formatTemp(cur.apparent_temperature, unitSystem);
      const highVal = Array.isArray(daily.temperature_2m_max) && daily.temperature_2m_max[0] !== undefined
        ? window.Ajwaa.Units.formatTemp(daily.temperature_2m_max[0], unitSystem)
        : tempVal;
      const lowVal = Array.isArray(daily.temperature_2m_min) && daily.temperature_2m_min[0] !== undefined
        ? window.Ajwaa.Units.formatTemp(daily.temperature_2m_min[0], unitSystem)
        : tempVal;

      const cityName = locale === 'ar' ? (city.name || city.nameEn) : (city.nameEn || city.name);
      const conditionText = locale === 'ar' ? condition.ar : condition.en;
      const iconSvg = window.Ajwaa.Conditions.getIconSvg(condition.icon);

      const tzBadge = window.Ajwaa.Format.formatTzOffset(utcOffsetSeconds);
      const liveTimeStr = window.Ajwaa.Format.formatCityTime(utcOffsetSeconds);
      const localDateStr = window.Ajwaa.Format.formatCityDate(utcOffsetSeconds, locale);
      const timeAgoStr = window.Ajwaa.Format.formatTimeAgo(weatherData.fetchedAt, locale);

      container.innerHTML = `
        <div class="hero-card card fade-in-entry delay-1">
          <!-- Dynamic Atmospheric Background -->
          <div class="atmosphere-container" id="heroAtmosphere">
            ${this.getAtmosphereHtml(condition.atmosphere)}
          </div>

          <!-- Top Row: City Pill & Live Badge -->
          <div class="hero-top">
            <button type="button" class="city-pill" id="heroCityPill" aria-label="Change city">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${cityName}</span>
              <span class="live-dot" title="Live data"></span>
            </button>
            <span class="badge badge-primary">${window.Ajwaa.I18n.t('live')}</span>
          </div>

          <!-- Main Row: Temperature & Icon -->
          <div class="hero-main">
            <div class="hero-temp-group">
              <div class="hero-temp-row">
                <span class="hero-temp tabular-nums">${tempVal}</span>
                <span class="hero-unit">${unitLabel}</span>
              </div>
              <div class="hero-desc">${conditionText}</div>
              <div class="hero-feel-range">
                <span>${window.Ajwaa.I18n.t('feelsLike')} ${feelsLikeVal}°</span>
                <span>•</span>
                <span>${window.Ajwaa.I18n.t('high')} ${highVal}° · ${window.Ajwaa.I18n.t('low')} ${lowVal}°</span>
              </div>
            </div>

            <div class="hero-icon-wrap" aria-hidden="true">
              ${iconSvg}
            </div>
          </div>

          <!-- Divider -->
          <div class="hero-divider"></div>

          <!-- Bottom Row: Local Clock & Refresh Time -->
          <div class="hero-bottom">
            <div class="hero-time-block">
              <div class="hero-clock-row">
                <span class="hero-live-clock tabular-nums" id="heroLiveClock">${liveTimeStr}</span>
                <span class="hero-tz-badge">${tzBadge}</span>
              </div>
              <span class="hero-date">${localDateStr}</span>
            </div>

            <div class="hero-refresh-block">
              <span id="heroTimeAgo">${timeAgoStr}</span>
              <button type="button" class="btn-refresh ${isRefreshing ? 'spinning' : ''}" id="heroRefreshBtn" title="${window.Ajwaa.I18n.t('refresh')}" aria-label="${window.Ajwaa.I18n.t('refresh')}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      // Setup Live Clock Interval (Updates HH:MM:SS every second without re-rendering the whole card)
      if (this.clockTimer) clearInterval(this.clockTimer);
      const clockEl = container.querySelector('#heroLiveClock');
      if (clockEl) {
        this.clockTimer = setInterval(() => {
          clockEl.textContent = window.Ajwaa.Format.formatCityTime(utcOffsetSeconds);
        }, 1000);
      }

      // Wire events
      const cityPill = container.querySelector('#heroCityPill');
      if (cityPill) {
        cityPill.onclick = () => window.Ajwaa.store.openSheet('cityPicker');
      }

      const refreshBtn = container.querySelector('#heroRefreshBtn');
      if (refreshBtn) {
        refreshBtn.onclick = () => window.Ajwaa.AppCoordinator.loadWeatherForSelectedCity(true);
      }
    },

    getAtmosphereHtml(atmoType) {
      switch (atmoType) {
        case 'clear-day':
          return `
            <div class="atmo-scene scene-clear-day active">
              <div class="sun-halo"></div>
              <div class="sun-ray" style="transform: rotate(20deg);"></div>
              <div class="sun-ray" style="transform: rotate(50deg);"></div>
              <div class="sun-ray" style="transform: rotate(80deg);"></div>
            </div>
          `;
        case 'clear-night':
          return `
            <div class="atmo-scene scene-clear-night active">
              <div class="star star-1"></div>
              <div class="star star-2"></div>
              <div class="star star-3"></div>
              <div class="star star-4"></div>
              <div class="star star-5"></div>
            </div>
          `;
        case 'cloudy':
          return `
            <div class="atmo-scene scene-cloudy active">
              <svg class="cloud-drift cloud-drift-1" viewBox="0 0 100 40"><path d="M10 35H90A15 15 0 0 0 90 15A18 18 0 0 0 55 10A16 16 0 0 0 10 20A15 15 0 0 0 10 35Z"/></svg>
              <svg class="cloud-drift cloud-drift-2" viewBox="0 0 100 40"><path d="M10 35H90A15 15 0 0 0 90 15A18 18 0 0 0 55 10A16 16 0 0 0 10 20A15 15 0 0 0 10 35Z"/></svg>
            </div>
          `;
        case 'rain':
          return `
            <div class="atmo-scene scene-rain active">
              <div class="rain-streak rain-1"></div>
              <div class="rain-streak rain-2"></div>
              <div class="rain-streak rain-3"></div>
              <div class="rain-streak rain-4"></div>
              <div class="rain-streak rain-5"></div>
              <div class="rain-streak rain-6"></div>
            </div>
          `;
        case 'thunder':
          return `
            <div class="atmo-scene scene-thunder active">
              <div class="rain-streak rain-2"></div>
              <div class="rain-streak rain-4"></div>
            </div>
          `;
        case 'dust':
          return `
            <div class="atmo-scene scene-dust active">
              <div class="dust-particle dust-1"></div>
              <div class="dust-particle dust-2"></div>
              <div class="dust-particle dust-3"></div>
            </div>
          `;
        default:
          return `<div class="atmo-scene scene-clear-day active"><div class="sun-halo"></div></div>`;
      }
    }
  };

  window.Ajwaa.Hero = Hero;
})();
