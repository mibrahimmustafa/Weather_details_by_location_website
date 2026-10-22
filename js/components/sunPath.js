/**
 * Ajwaa (أجواء) - Sun Path Arc Component
 * Interactive solar trajectory visualization with sunrise, sunset, and remaining daylight.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const SunPath = {
    render(container, forecastData, locale = 'ar') {
      if (!forecastData || !forecastData.daily) {
        container.innerHTML = '';
        return;
      }

      const daily = forecastData.daily;
      const sunriseIso = (Array.isArray(daily.sunrise) && daily.sunrise[0]) ? daily.sunrise[0] : null;
      const sunsetIso = (Array.isArray(daily.sunset) && daily.sunset[0]) ? daily.sunset[0] : null;
      const utcOffset = forecastData.utc_offset_seconds || 0;

      const sunriseHm = window.Ajwaa.Format.isoToHm(sunriseIso);
      const sunsetHm = window.Ajwaa.Format.isoToHm(sunsetIso);

      // Remaining daylight calculation
      let remainingText = '';
      if (sunriseIso && sunsetIso) {
        const nowCity = window.Ajwaa.Format.getCityDate(utcOffset).getTime();
        const setTime = new Date(sunsetIso).getTime();

        if (nowCity < setTime && nowCity > new Date(sunriseIso).getTime()) {
          const diffMs = setTime - nowCity;
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          remainingText = window.Ajwaa.I18n.t('daylightRemaining', { h: diffHours, m: diffMinutes });
        }
      }

      const sunArcSvg = window.Ajwaa.Charts.renderSunArcSvg(sunriseIso, sunsetIso, utcOffset, 360, 130);

      container.innerHTML = `
        <div class="section fade-in-entry delay-6">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
              </svg>
              <span>${window.Ajwaa.I18n.t('sunPathTitle')}</span>
            </div>
            ${remainingText ? `<span class="section-badge tabular-nums">${remainingText}</span>` : ''}
          </div>

          <div class="card sun-path-card">
            <div class="sun-arc-wrap">
              ${sunArcSvg}
            </div>

            <div class="sun-times-row">
              <div class="sun-time-item">
                <span class="sun-time-label">${window.Ajwaa.I18n.t('sunrise')}</span>
                <span class="sun-time-val tabular-nums">${sunriseHm}</span>
              </div>
              <div class="sun-time-item" style="text-align:end;">
                <span class="sun-time-label">${window.Ajwaa.I18n.t('sunset')}</span>
                <span class="sun-time-val tabular-nums">${sunsetHm}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  window.Ajwaa.SunPath = SunPath;
})();
