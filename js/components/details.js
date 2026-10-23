/**
 * Ajwaa (أجواء) - Weather Details Grid Component
 * 7 interactive tiles for Humidity, Wind, Rain Chance, UV, Pressure, Visibility, and Cloud Cover.
 * Clicking any tile opens a dedicated scientific explanation sheet.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Details = {
    render(container, forecastData, airData, unitSystem = 'metric', locale = 'ar') {
      if (!forecastData || !forecastData.current) {
        container.innerHTML = '';
        return;
      }

      const isAr = locale === 'ar';
      const cur = forecastData.current;
      const hourly = forecastData.hourly || {};
      const daily = forecastData.daily || {};

      // 1. Humidity & Dew Point
      const humidity = cur.relative_humidity_2m !== undefined ? Math.round(cur.relative_humidity_2m) : '--';
      const dewPointC = window.Ajwaa.Units.calcDewPoint(cur.temperature_2m, cur.relative_humidity_2m);
      const dewPointFormatted = dewPointC !== null
        ? `${window.Ajwaa.Units.formatTemp(dewPointC, unitSystem)}°`
        : '--';

      // 2. Wind & Gusts
      const windSpeed = window.Ajwaa.Units.formatWind(cur.wind_speed_10m, unitSystem, locale);
      const windGusts = window.Ajwaa.Units.formatWind(cur.wind_gusts_10m || cur.wind_speed_10m, unitSystem, locale);
      const windDir = cur.wind_direction_10m || 0;

      // 3. Rain Probability
      const rainProb = (Array.isArray(hourly.precipitation_probability) && hourly.precipitation_probability[0] !== undefined)
        ? Math.round(hourly.precipitation_probability[0])
        : 0;

      // 4. UV Index & Level
      let uvVal = 0;
      if (airData && airData.current && airData.current.uv_index !== undefined) {
        uvVal = airData.current.uv_index;
      } else if (Array.isArray(daily.uv_index_max) && daily.uv_index_max[0] !== undefined) {
        uvVal = daily.uv_index_max[0];
      }
      const uvLevel = window.Ajwaa.Levels.getUvLevel(uvVal);

      // 5. Atmospheric Pressure
      const pressure = window.Ajwaa.Units.formatPressure(cur.pressure_msl || 1013, unitSystem, locale);

      // 6. Visibility
      const visibilityMeters = (Array.isArray(hourly.visibility) && hourly.visibility[0] !== undefined)
        ? hourly.visibility[0]
        : 10000;
      const visibilityKm = visibilityMeters / 1000;
      const visibility = window.Ajwaa.Units.formatDistance(visibilityKm, unitSystem, locale);

      // 7. Cloud Cover %
      const cloudCover = cur.cloud_cover !== undefined ? Math.round(cur.cloud_cover) : 0;

      const tiles = [
        {
          id: 'humidity',
          title: window.Ajwaa.I18n.t('humidity'),
          value: `${humidity}%`,
          subtitle: `${window.Ajwaa.I18n.t('dewPoint')}: ${dewPointFormatted}`,
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
          explanation: {
            title: isAr ? 'الرطوبة النسبية ونقطة الندى' : 'Relative Humidity & Dew Point',
            category: isAr ? 'الرطوبة الجوية' : 'Atmospheric Moisture',
            value: `${humidity}% (نقطة الندى: ${dewPointFormatted})`,
            meaning: isAr
              ? 'الرطوبة النسبية تقيس نسبة بخار الماء في الهواء مقارنة بأقصى ما يمكن أن يحمله عند نفس درجة الحرارة. نقطة الندى هي الحرارة التي يتكثف عندها البخار إلى قطرات ماء.'
              : 'Relative humidity measures moisture saturation in the air. Dew point is the temperature at which water vapor condenses into liquid dew.',
            healthAdvice: isAr
              ? 'الرطوبة بين 40% و 60% مثالية للراحة والتنفس. الارتفاع الشديد يزيد الشعور بالحرارة والإرهاق.'
              : 'Humidity between 40% and 60% provides optimal respiratory comfort.'
          }
        },
        {
          id: 'wind',
          title: window.Ajwaa.I18n.t('wind'),
          value: windSpeed,
          subtitle: `${window.Ajwaa.I18n.t('windGusts')}: ${windGusts}`,
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`,
          explanation: {
            title: isAr ? 'سرعة الرياح واتجاهها والهبّات' : 'Wind Speed & Gusts',
            category: isAr ? 'الديناميكا الهوائية' : 'Aerodynamics',
            value: `${windSpeed} (الهبات: ${windGusts})`,
            meaning: isAr
              ? `تهب الرياح الحالية بسرعة ${windSpeed} باتجاه ${windDir}° مع هبات مفاجئة قد تصل إلى ${windGusts}.`
              : `Winds blowing at ${windSpeed} from ${windDir}° with peak gusts reaching ${windGusts}.`,
            healthAdvice: isAr
              ? 'عند تجاوز الرياح 40 كم/س، يُنصح بتثبيت الأجسام الخارجية الخفيفة والحذر أثناء القيادة على الطرق السريعة.'
              : 'When wind exceeds 40 km/h, secure loose outdoor objects and exercise caution while driving.'
          }
        },
        {
          id: 'rainProb',
          title: window.Ajwaa.I18n.t('rainProb'),
          value: `${rainProb}%`,
          subtitle: rainProb > 50 ? (isAr ? 'فرصة هطول عالية' : 'High likelihood') : (isAr ? 'فرصة هطول منخفضة' : 'Low likelihood'),
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/></svg>`,
          explanation: {
            title: isAr ? 'احتمالية هطول الأمطار' : 'Precipitation Probability',
            category: isAr ? 'التنبؤ الهيدرولوجي' : 'Hydrological Forecast',
            value: `${rainProb}%`,
            meaning: isAr
              ? 'احتمال حدوث هطول مطري ملموس قابل للقياس خلال الساعة القادمة في نطاق منطقتك الجغرافية.'
              : 'The statistical probability of measurable precipitation occurring in your area over the next hour.',
            healthAdvice: isAr
              ? 'إذا تجاوزت النسبة 50%، احرص على اصطحاب مظلة وتجنب السرعة على الطرقات الرطبة.'
              : 'Carry an umbrella and drive with extra caution when probability exceeds 50%.'
          }
        },
        {
          id: 'uvIndex',
          title: window.Ajwaa.I18n.t('uvIndex'),
          value: uvVal.toFixed(1),
          subtitle: isAr ? uvLevel.ar : uvLevel.en,
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
          explanation: {
            title: isAr ? 'مؤشر الأشعة فوق البنفسجية (UV)' : 'Ultraviolet (UV) Index',
            category: isAr ? 'الإشعاع الشمسي' : 'Solar Radiation',
            value: `${uvVal.toFixed(1)} (${isAr ? uvLevel.ar : uvLevel.en})`,
            meaning: isAr
              ? 'مقياس دولي يحدد شدة الأشعة فوق البنفسجية المنبعثة من الشمس ومستوى خطورتها المحتملة على الجلد والعينين.'
              : 'An international standard measurement indicating the strength of sunburn-producing UV radiation.',
            healthAdvice: isAr ? uvLevel.adviceAr : uvLevel.adviceEn
          }
        },
        {
          id: 'pressure',
          title: window.Ajwaa.I18n.t('pressure'),
          value: pressure,
          subtitle: isAr ? 'مستوى سطح البحر' : 'Sea level pressure',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-4.2 4.2"/><circle cx="12" cy="12" r="2"/></svg>`,
          explanation: {
            title: isAr ? 'الضغط الجوي' : 'Atmospheric Pressure',
            category: isAr ? 'البارومتر' : 'Barometric Pressure',
            value: pressure,
            meaning: isAr
              ? 'وزن عمود الهواء المؤثر على وحدة المساحة. الانخفاض السريع للضغط يشير غالبًا إلى اقتراب عواصف وأمطار، بينما يدل الارتفاع على استقرار الطقس.'
              : 'The weight of air overhead. Falling pressure typically indicates approaching storms; rising pressure signals clearing skies.',
            healthAdvice: isAr
              ? 'التغيرات الحادة في الضغط الجوي قد تسبب صداعاً أو آلام مفاصل لبعض الأشخاص الحساسين.'
              : 'Sudden barometric shifts may induce mild headaches or joint sensitivity for sensitive individuals.'
          }
        },
        {
          id: 'visibility',
          title: window.Ajwaa.I18n.t('visibility'),
          value: visibility,
          subtitle: visibilityKm >= 9 ? (isAr ? 'رؤية ممتازة' : 'Clear visibility') : (isAr ? 'رؤية منخفضة' : 'Reduced visibility'),
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
          explanation: {
            title: isAr ? 'المدى البصري الأفقي' : 'Horizontal Visibility',
            category: isAr ? 'البصريات الجوية' : 'Atmospheric Optics',
            value: visibility,
            meaning: isAr
              ? 'أقصى مسافة يمكن عندها تمييز الأجسام والمعالم بوضوح في ضوء النهار الطبيعي.'
              : 'The maximum distance at which prominent objects can be seen and recognized against the horizon.',
            healthAdvice: isAr
              ? 'إذا قل المدى البصري عن 3 كم بسبب الضباب أو الغبار، أشعل مصابيح الضباب وخفف السرعة.'
              : 'If visibility falls below 3 km due to haze or fog, use fog lights and reduce driving speed.'
          }
        },
        {
          id: 'cloudCover',
          title: window.Ajwaa.I18n.t('cloudCover'),
          value: `${cloudCover}%`,
          subtitle: cloudCover > 70 ? (isAr ? 'سحب كثيفة' : 'Heavy clouds') : (isAr ? 'سحب متفرقة' : 'Scattered clouds'),
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
          explanation: {
            title: isAr ? 'نسبة الغطاء السحابي' : 'Cloud Cover Percentage',
            category: isAr ? 'رصد السماء' : 'Sky Observation',
            value: `${cloudCover}%`,
            meaning: isAr
              ? 'النسبة المئوية لقبة السماء المغطاة بالغيوم من وجهة نظر الراصد الأرضي.'
              : 'The fraction of the sky obscured by clouds when observed from a particular location.',
            healthAdvice: isAr
              ? 'الغيوم تخفف من وهج الشمس المباشر لكنها تسمح بنفاذ نسبة من الأشعة فوق البنفسجية.'
              : 'Clouds reduce direct glare but may still permit substantial UV transmission.'
          }
        }
      ];

      let tilesHtml = '';
      tiles.forEach((t, idx) => {
        tilesHtml += `
          <div class="detail-tile card-interactive" data-tile-index="${idx}" role="button" tabindex="0">
            <div class="detail-tile-header">
              <span>${t.title}</span>
              <div class="detail-tile-icon">${t.icon}</div>
            </div>
            <div class="detail-tile-value tabular-nums">${t.value}</div>
            <div class="detail-tile-subtitle">${t.subtitle}</div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="section fade-in-entry delay-5">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>${window.Ajwaa.I18n.t('weatherDetailsTitle')}</span>
            </div>
          </div>
          <div class="grid-details">
            ${tilesHtml}
          </div>
        </div>
      `;

      // Wire tile click to explanation sheet
      container.querySelectorAll('.detail-tile').forEach(el => {
        el.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        };

        el.onclick = () => {
          const index = Number(el.getAttribute('data-tile-index'));
          const tile = tiles[index];
          if (tile && tile.explanation) {
            window.Ajwaa.store.openSheet('explain', tile.explanation);
          }
        };
      });
    }
  };

  window.Ajwaa.Details = Details;
})();
