/**
 * Ajwaa (أجواء) - 7-Day Forecast Component
 * Renders weekly forecast rows with a unified weekly temperature range bar.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Forecast7 = {
    render(container, forecastData, unitSystem = 'metric', locale = 'ar') {
      if (!forecastData || !forecastData.daily) {
        container.innerHTML = '';
        return;
      }

      const daily = forecastData.daily;
      const dates = daily.time || [];
      const codes = daily.weather_code || [];
      const maxTemps = daily.temperature_2m_max || [];
      const minTemps = daily.temperature_2m_min || [];
      const rainProbs = daily.precipitation_probability_max || [];
      const rainSums = daily.precipitation_sum || [];
      const windMax = daily.wind_speed_10m_max || [];
      const uvMax = daily.uv_index_max || [];
      const sunrises = daily.sunrise || [];
      const sunsets = daily.sunset || [];

      // Calculate global minimum and maximum across the entire week to normalize range bars
      const validMins = minTemps.filter(v => v !== null && !isNaN(v));
      const validMaxs = maxTemps.filter(v => v !== null && !isNaN(v));
      const globalWeekMin = validMins.length > 0 ? Math.min(...validMins) : 0;
      const globalWeekMax = validMaxs.length > 0 ? Math.max(...validMaxs) : 35;
      const weekTempSpan = Math.max(1, globalWeekMax - globalWeekMin);

      let rowsHtml = '';
      const dayCount = Math.min(7, dates.length);

      for (let i = 0; i < dayCount; i++) {
        const [y, m, d] = dates[i].split('-').map(Number);
        const dObj = new Date(y, m - 1, d);
        let dayName = '';

        if (i === 0) {
          dayName = window.Ajwaa.I18n.t('today');
        } else if (i === 1) {
          dayName = window.Ajwaa.I18n.t('tomorrow');
        } else {
          try {
            dayName = new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', { weekday: 'long' }).format(dObj);
          } catch {
            dayName = dObj.toLocaleDateString();
          }
        }

        const condition = window.Ajwaa.Conditions.getCondition(codes[i], 1);
        const iconSvg = window.Ajwaa.Conditions.getIconSvg(condition.icon);

        const curMin = minTemps[i] !== undefined ? minTemps[i] : globalWeekMin;
        const curMax = maxTemps[i] !== undefined ? maxTemps[i] : globalWeekMax;
        const minDisp = window.Ajwaa.Units.formatTemp(curMin, unitSystem);
        const maxDisp = window.Ajwaa.Units.formatTemp(curMax, unitSystem);

        const pRain = rainProbs[i] !== undefined ? Math.round(rainProbs[i]) : 0;

        // Calculate range bar percentage start and width
        const leftPercent = Math.max(0, Math.min(95, ((curMin - globalWeekMin) / weekTempSpan) * 100));
        const widthPercent = Math.max(5, Math.min(100 - leftPercent, ((curMax - curMin) / weekTempSpan) * 100));

        rowsHtml += `
          <div class="forecast-day-row" data-day-index="${i}" role="button" tabindex="0">
            <span class="forecast-day-name">${dayName}</span>
            
            <div class="forecast-condition-cell">
              <div style="width:26px; height:26px;">${iconSvg}</div>
              ${pRain > 20 ? `<span class="forecast-rain-prob tabular-nums">${pRain}%</span>` : ''}
            </div>

            <!-- Unified Range Bar -->
            <div class="range-bar-wrap">
              <span class="temp-min-val tabular-nums">${minDisp}°</span>
              <div class="range-bar-track">
                <div class="range-bar-fill" style="inset-inline-start:${leftPercent}%; width:${widthPercent}%;"></div>
              </div>
              <span class="temp-max-val tabular-nums">${maxDisp}°</span>
            </div>
          </div>
        `;
      }

      container.innerHTML = `
        <div class="section fade-in-entry delay-8">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${window.Ajwaa.I18n.t('forecast7Title')}</span>
            </div>
          </div>

          <div class="card" style="padding:var(--space-4);">
            <div class="forecast-list">
              ${rowsHtml}
            </div>
          </div>
        </div>
      `;

      // Wire row clicks to day breakdown explanation sheet
      container.querySelectorAll('.forecast-day-row').forEach(el => {
        el.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        };

        el.onclick = () => {
          const index = Number(el.getAttribute('data-day-index'));
          const [y, m, d] = dates[index].split('-').map(Number);
          const dObj = new Date(y, m - 1, d);
          const dayLabel = new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', { weekday: 'long', month: 'short', day: 'numeric' }).format(dObj);
          const condition = window.Ajwaa.Conditions.getCondition(codes[index], 1);
          const minDisp = window.Ajwaa.Units.formatTemp(minTemps[index], unitSystem);
          const maxDisp = window.Ajwaa.Units.formatTemp(maxTemps[index], unitSystem);
          const rainMm = rainSums[index] !== undefined ? window.Ajwaa.Units.formatPrecip(rainSums[index], unitSystem, locale) : '0';
          const wind = windMax[index] !== undefined ? window.Ajwaa.Units.formatWind(windMax[index], unitSystem, locale) : '--';
          const uv = uvMax[index] !== undefined ? uvMax[index].toFixed(1) : '--';

          window.Ajwaa.store.openSheet('explain', {
            title: dayLabel,
            category: locale === 'ar' ? condition.ar : condition.en,
            value: `${maxDisp}° / ${minDisp}°`,
            meaning: locale === 'ar'
              ? `الحرارة العظمى المتوقعة ${maxDisp}° والصغرى ${minDisp}°. فرصة المطر ${rainProbs[index] || 0}% بإجمالي متوقع ${rainMm}. أقصى سرعة للرياح ${wind}.`
              : `Forecasted high is ${maxDisp}° and low is ${minDisp}°. Rain chance ${rainProbs[index] || 0}% with ${rainMm} sum. Peak wind ${wind}.`,
            healthAdvice: locale === 'ar'
              ? `مؤشر الأشعة فوق البنفسجية الأقصى: ${uv}. الشروق في ${window.Ajwaa.Format.isoToHm(sunrises[index])} والغروب في ${window.Ajwaa.Format.isoToHm(sunsets[index])}.`
              : `Max UV Index: ${uv}. Sunrise at ${window.Ajwaa.Format.isoToHm(sunrises[index])} and Sunset at ${window.Ajwaa.Format.isoToHm(sunsets[index])}.`
          });
        };
      });
    }
  };

  window.Ajwaa.Forecast7 = Forecast7;
})();
