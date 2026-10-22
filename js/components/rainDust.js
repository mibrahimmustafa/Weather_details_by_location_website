/**
 * Ajwaa (أجواء) - Rain & Dust Dual Cards Component
 * Displays air quality/dust with area sparkline chart and precipitation details with hourly bars.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const RainDust = {
    render(container, forecastData, airData, unitSystem = 'metric', locale = 'ar') {
      if (!forecastData || !forecastData.current) {
        container.innerHTML = '';
        return;
      }

      const isAr = locale === 'ar';
      const cur = forecastData.current;
      const hourly = forecastData.hourly || {};
      const daily = forecastData.daily || {};

      // 1. Rain calculations
      const curRain = (cur.precipitation || 0) + (cur.rain || 0);
      const rainSum = Array.isArray(daily.precipitation_sum) && daily.precipitation_sum[0] !== undefined
        ? daily.precipitation_sum[0]
        : curRain;
      const rainFormatted = window.Ajwaa.Units.formatPrecip(rainSum, unitSystem, locale);
      
      const rainChanceNow = (Array.isArray(hourly.precipitation_probability) && hourly.precipitation_probability[0] !== undefined)
        ? Math.round(hourly.precipitation_probability[0])
        : 0;

      // 8-hour rain prediction dots
      const next8hProbs = (Array.isArray(hourly.precipitation_probability) ? hourly.precipitation_probability.slice(0, 8) : []);
      const next8hTimes = (Array.isArray(hourly.time) ? hourly.time.slice(0, 8) : []);

      let rainDotsHtml = '';
      for (let i = 0; i < 8; i++) {
        const p = next8hProbs[i] !== undefined ? Math.round(next8hProbs[i]) : 0;
        const timeStr = next8hTimes[i] ? window.Ajwaa.Format.formatHourTime(next8hTimes[i]) : '';
        rainDotsHtml += `
          <div class="rain-dot-col">
            <div class="rain-dot-bar" title="${p}%">
              <div class="rain-dot-fill" style="height: ${p}%;"></div>
            </div>
            <span class="rain-dot-time tabular-nums">${timeStr}</span>
          </div>
        `;
      }

      // 2. Dust & Air Quality calculations
      let dustVal = 0;
      let pm10Val = 0;
      let pm25Val = 0;
      let aqiVal = 0;
      let hourlyDust = [];

      if (airData && airData.current) {
        dustVal = Math.round(airData.current.dust || 0);
        pm10Val = Math.round(airData.current.pm10 || 0);
        pm25Val = Math.round(airData.current.pm2_5 || 0);
        aqiVal = Math.round(airData.current.us_aqi || 0);
      }
      if (airData && airData.hourly && Array.isArray(airData.hourly.dust)) {
        hourlyDust = airData.hourly.dust;
      }

      const dustLevel = window.Ajwaa.Levels.getDustLevel(dustVal);
      const aqiLevel = window.Ajwaa.Levels.getAqiLevel(aqiVal);
      const dustChartSvg = window.Ajwaa.Charts.renderDustAreaSvg(hourlyDust, 260, 56);

      container.innerHTML = `
        <div class="section fade-in-entry delay-4">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
              <span>${window.Ajwaa.I18n.t('rainAndDustTitle')}</span>
            </div>
          </div>

          <div class="grid-dual">
            <!-- Rain Card -->
            <div class="card rain-card">
              <div class="stat-header">
                <div class="stat-title-group">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#49B7D8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                  <span style="font-weight:700;">${window.Ajwaa.I18n.t('rainCardTitle')}</span>
                </div>
                <span class="badge badge-primary">${rainChanceNow}% ${window.Ajwaa.I18n.t('rainChanceNow')}</span>
              </div>

              <div class="stat-main">
                <div class="stat-value-group">
                  <span class="stat-val tabular-nums">${rainFormatted}</span>
                </div>
                <span class="stat-desc">${window.Ajwaa.I18n.t('rain24h')}</span>
              </div>

              <!-- Hourly Rain Projection Dots -->
              <div>
                <div class="rain-dots-row">
                  ${rainDotsHtml}
                </div>
                <div style="font-size:0.7rem; color:var(--text-muted); text-align:center; margin-top:6px;">
                  ${window.Ajwaa.I18n.t('rainScrollHint')}
                </div>
              </div>
            </div>

            <!-- Dust Card -->
            <div class="card dust-card">
              <div class="stat-header">
                <div class="stat-title-group">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#F2A65A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                  <span style="font-weight:700;">${window.Ajwaa.I18n.t('dustCardTitle')}</span>
                </div>
                <span class="badge ${dustLevel.badgeClass}">${isAr ? dustLevel.ar : dustLevel.en}</span>
              </div>

              <div class="stat-main">
                <div class="stat-value-group">
                  <span class="stat-val tabular-nums">${dustVal}</span>
                  <span class="stat-unit">µg/m³</span>
                </div>
                <span class="stat-desc">${isAr ? dustLevel.adviceAr : dustLevel.adviceEn}</span>
              </div>

              <!-- Sparkline Area Chart -->
              <div>
                ${dustChartSvg}
                <div class="dust-badges-row">
                  <span class="badge badge-primary tabular-nums">AQI ${aqiVal}</span>
                  <span class="badge badge-primary tabular-nums">PM2.5: ${pm25Val}</span>
                  <span class="badge badge-primary tabular-nums">PM10: ${pm10Val}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  window.Ajwaa.RainDust = RainDust;
})();
