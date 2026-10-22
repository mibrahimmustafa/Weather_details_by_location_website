/**
 * Ajwaa (أجواء) - Active Cyclones & Tropical Storms Component
 * Tracks severe storms worldwide with distance from selected city and official advisory links.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Cyclones = {
    render(container, stormsData, locale = 'ar') {
      const isAr = locale === 'ar';

      let bodyHtml = '';

      if (!stormsData || stormsData.status === 'unavailable') {
        bodyHtml = `
          <div class="card" style="text-align:center; padding:var(--space-6); color:var(--text-muted); font-size:0.9rem;">
            ${window.Ajwaa.I18n.t('cyclonesUnavailable')}
          </div>
        `;
      } else if (!stormsData.events || stormsData.events.length === 0) {
        bodyHtml = `
          <div class="card" style="text-align:center; padding:var(--space-6); color:var(--teal-300); font-size:0.9rem;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 8px;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>${window.Ajwaa.I18n.t('noCyclones')}</p>
          </div>
        `;
      } else {
        let rowsHtml = '';
        stormsData.events.slice(0, 5).forEach(storm => {
          const distStr = storm.distanceKm !== null
            ? window.Ajwaa.I18n.t('cycloneDistance', { d: Math.round(storm.distanceKm) })
            : '';
          const windStr = window.Ajwaa.I18n.t('cycloneWind', { w: Math.round(storm.windKmh) });
          const severityLabel = isAr ? storm.severityInfo.ar : storm.severityInfo.en;

          rowsHtml += `
            <div class="cyclone-item">
              <div class="cyclone-left">
                <svg viewBox="0 0 24 24" class="cyclone-icon-spin" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a10 10 0 0 0-9.8 8c1.5-1.3 3.5-2 5.8-2 4 0 7 2.5 8 6 1-3.5 4-6 8-6 2.3 0 4.3.7 5.8 2A10 10 0 0 0 12 2z"/>
                  <path d="M12 22a10 10 0 0 0 9.8-8c-1.5 1.3-3.5 2-5.8 2-4 0-7-2.5-8-6-1 3.5-4 6-8 6-2.3 0-4.3-.7-5.8-2A10 10 0 0 0 12 22z"/>
                </svg>
                <div class="cyclone-info">
                  <span class="cyclone-title">${storm.title}</span>
                  <div class="cyclone-meta">
                    ${distStr ? `<span class="tabular-nums">${distStr}</span>` : ''}
                    <span class="tabular-nums">${windStr}</span>
                  </div>
                </div>
              </div>

              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge ${storm.severityInfo.badgeClass}">${severityLabel}</span>
                <a href="${storm.link}" target="_blank" rel="noopener noreferrer" class="btn-icon" style="width:34px; height:34px;" title="${window.Ajwaa.I18n.t('viewSource')}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="icon-flip-rtl">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 17 7 17 17"/>
                  </svg>
                </a>
              </div>
            </div>
          `;
        });

        bodyHtml = `
          <div class="card" style="display:flex; flex-direction:column; gap:8px; padding:var(--space-4);">
            ${rowsHtml}
          </div>
        `;
      }

      container.innerHTML = `
        <div class="section fade-in-entry delay-7">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F08A5D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 0 0-9.8 8c1.5-1.3 3.5-2 5.8-2 4 0 7 2.5 8 6 1-3.5 4-6 8-6 2.3 0 4.3.7 5.8 2A10 10 0 0 0 12 2z"/>
                <path d="M12 22a10 10 0 0 0 9.8-8c-1.5 1.3-3.5 2-5.8 2-4 0-7-2.5-8-6-1 3.5-4 6-8 6-2.3 0-4.3-.7-5.8-2A10 10 0 0 0 12 22z"/>
              </svg>
              <span>${window.Ajwaa.I18n.t('cyclonesTitle')}</span>
            </div>
            <span class="section-badge">${window.Ajwaa.I18n.t('closestCyclones')}</span>
          </div>
          ${bodyHtml}
        </div>
      `;
    }
  };

  window.Ajwaa.Cyclones = Cyclones;
})();
