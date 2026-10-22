/**
 * Ajwaa (أجواء) - Alerts Component
 * Renders active weather alerts with severity coloring and explanation sheet triggers.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Alerts = {
    render(container, alertsList, locale = 'ar') {
      if (!Array.isArray(alertsList) || alertsList.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
      }

      container.style.display = 'flex';

      const isAr = locale === 'ar';
      const countText = window.Ajwaa.I18n.t('alertsCount', { n: alertsList.length });

      let cardsHtml = '';
      alertsList.forEach((alert, idx) => {
        const title = isAr ? alert.titleAr : alert.titleEn;
        const desc = isAr ? alert.descAr : alert.descEn;
        const severityLabel = isAr
          ? (alert.severity === 'severe' ? 'خطير' : alert.severity === 'warning' ? 'تحذير' : 'تنبيه')
          : (alert.severity === 'severe' ? 'Severe' : alert.severity === 'warning' ? 'Warning' : 'Notice');

        cardsHtml += `
          <div class="alert-card ${alert.severity}" data-alert-index="${idx}" role="button" tabindex="0">
            <div class="alert-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="alert-content">
              <div class="alert-header-row">
                <span class="alert-title">${title}</span>
                <span class="badge ${alert.badgeClass}">${severityLabel}</span>
              </div>
              <p class="alert-desc">${desc}</p>
            </div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="section fade-in-entry delay-2">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              </svg>
              <span>${window.Ajwaa.I18n.t('alertsTitle')}</span>
            </div>
            <span class="section-badge">${countText}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${cardsHtml}
          </div>
        </div>
      `;

      // Wire alert clicks to explanation sheet
      container.querySelectorAll('.alert-card').forEach(el => {
        el.onclick = () => {
          const index = Number(el.getAttribute('data-alert-index'));
          const alert = alertsList[index];
          if (alert) {
            window.Ajwaa.store.openSheet('explain', {
              title: isAr ? alert.titleAr : alert.titleEn,
              category: isAr ? 'تنبيه طقس وقائي' : 'Preventative Weather Alert',
              value: alert.severity.toUpperCase(),
              meaning: isAr ? alert.descAr : alert.descEn,
              healthAdvice: isAr
                ? 'يُنصح باتباع إرشادات السلامة العامة، وتجنب المخاطر الجوية، ومتابعة النشرات المحدثة باستمرار.'
                : 'Follow public safety instructions, avoid hazardous outdoor exposure, and check updates.'
            });
          }
        };
      });
    }
  };

  window.Ajwaa.Alerts = Alerts;
})();
