/**
 * Ajwaa (أجواء) - Hourly Forecast Component
 * Horizontally scrollable 24-hour timeline with current slot highlighted.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Hourly = {
    render(container, forecastData, unitSystem = 'metric', locale = 'ar') {
      if (!forecastData || !forecastData.hourly) {
        container.innerHTML = '';
        return;
      }

      const hourly = forecastData.hourly;
      const times = hourly.time || [];
      const temps = hourly.temperature_2m || [];
      const codes = hourly.weather_code || [];
      const rainProbs = hourly.precipitation_probability || [];
      const windSpeeds = hourly.wind_speed_10m || [];
      const utcOffset = forecastData.utc_offset_seconds || 0;

      // Find current hour index based on city's time
      const cityDate = window.Ajwaa.Format.getCityDate(utcOffset);
      const pad = n => String(n).padStart(2, '0');
      const cityTargetPrefix = `${cityDate.getFullYear()}-${pad(cityDate.getMonth() + 1)}-${pad(cityDate.getDate())}T${pad(cityDate.getHours())}`;

      let startIndex = times.findIndex(t => t.startsWith(cityTargetPrefix));
      if (startIndex === -1) {
        // Fallback: match current hour on today or nearest slot
        const cityHourStr = `T${pad(cityDate.getHours())}`;
        startIndex = times.findIndex(t => t.includes(cityHourStr));
        if (startIndex === -1) startIndex = 0;
      }

      const slots = [];
      const count = Math.min(24, times.length - startIndex);
      for (let i = 0; i < count; i++) {
        const idx = startIndex + i;
        slots.push({
          isNow: i === 0,
          timeStr: i === 0 ? window.Ajwaa.I18n.t('now') : window.Ajwaa.Format.formatHourTime(times[idx], utcOffset),
          temp: window.Ajwaa.Units.formatTemp(temps[idx], unitSystem),
          code: codes[idx],
          rainProb: rainProbs[idx] !== undefined && rainProbs[idx] !== null ? Math.round(rainProbs[idx]) : 0,
          wind: window.Ajwaa.Units.formatWind(windSpeeds[idx], unitSystem, locale)
        });
      }

      let itemsHtml = '';
      slots.forEach(slot => {
        const condition = window.Ajwaa.Conditions.getCondition(slot.code, 1);
        const iconSvg = window.Ajwaa.Conditions.getIconSvg(condition.icon);

        itemsHtml += `
          <div class="hourly-card scroll-x-item ${slot.isNow ? 'current' : ''}">
            <span class="hourly-time">${slot.timeStr}</span>
            <div class="hourly-icon">${iconSvg}</div>
            <span class="hourly-temp tabular-nums">${slot.temp}°</span>
            ${slot.rainProb > 0 ? `
              <span class="hourly-rain tabular-nums">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                ${slot.rainProb}%
              </span>
            ` : `<span style="height:16px;"></span>`}
            <span class="hourly-wind tabular-nums">${slot.wind}</span>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="section fade-in-entry delay-3">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>${window.Ajwaa.I18n.t('hourlyTitle')}</span>
            </div>
            <span class="section-badge tabular-nums">24h</span>
          </div>
          <div class="card" style="padding: 12px 6px;">
            <div class="scroll-x-container">
              ${itemsHtml}
            </div>
          </div>
        </div>
      `;
    }
  };

  window.Ajwaa.Hourly = Hourly;
})();
