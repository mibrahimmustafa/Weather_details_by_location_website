/**
 * Ajwaa (أجواء) - Weather Alert Engine
 * Evaluates current and forecasted atmospheric metrics against safety thresholds.
 * Sorts alerts by severity (severe > warning > info) and provides practical guidance.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const AlertsEngine = {
    evaluateAlerts(forecastData, airData, closestStorm) {
      const alerts = [];
      if (!forecastData || !forecastData.current) return alerts;

      const cur = forecastData.current;
      const hourly = forecastData.hourly || {};

      // 1. Heat Alerts
      const apparentC = cur.apparent_temperature;
      if (apparentC !== null && apparentC !== undefined) {
        if (apparentC >= 43) {
          alerts.push({
            id: 'heat-severe',
            type: 'heat',
            severity: 'severe',
            badgeClass: 'badge-severe',
            titleAr: 'موجة حر خطيرة وشديدة',
            titleEn: 'Dangerous Heat Wave',
            descAr: 'الحرارة المحسوسة تتجاوز 43°C. تجنّب التعرض المباشر للشمس واشرب كميات وافرة من السوائل.',
            descEn: 'Feels-like temperature exceeds 43°C. Avoid direct sunlight and stay hydrated.',
            icon: 'sun'
          });
        } else if (apparentC >= 38) {
          alerts.push({
            id: 'heat-warning',
            type: 'heat',
            severity: 'warning',
            badgeClass: 'badge-warning',
            titleAr: 'تنبيه: طقس حار جداً',
            titleEn: 'Very Hot Weather Alert',
            descAr: 'الحرارة المحسوسة تبلغ 38°C أو أكثر. يُرجى تفادي الإجهاد الحراري في ساعات الذروة.',
            descEn: 'Feels-like temperature is 38°C+. Avoid strenuous activity during peak daylight.',
            icon: 'sun'
          });
        }
      }

      // 2. Cold Alerts
      if (apparentC !== null && apparentC !== undefined) {
        if (apparentC <= -10) {
          alerts.push({
            id: 'cold-severe',
            type: 'cold',
            severity: 'severe',
            badgeClass: 'badge-severe',
            titleAr: 'موجة صقيع وانجماد شديد',
            titleEn: 'Severe Freezing Cold',
            descAr: 'الحرارة المحسوسة تنخفض إلى ما دون -10°C. خطر الانجماد قائم، ارتدِ ملابس شتوية ثقيلة.',
            descEn: 'Feels-like temperature drops below -10°C. High risk of frostbite and ice.',
            icon: 'snow'
          });
        } else if (apparentC <= 0) {
          alerts.push({
            id: 'cold-warning',
            type: 'cold',
            severity: 'warning',
            badgeClass: 'badge-warning',
            titleAr: 'تنبيه: طقس قارس البرودة',
            titleEn: 'Freezing Weather Alert',
            descAr: 'الحرارة المحسوسة تقترب من الصفر المئوي أو أقل. احرص على التدفئة المناسبة.',
            descEn: 'Feels-like temperature around freezing or lower. Keep warm outdoors.',
            icon: 'snow'
          });
        }
      }

      // 3. Wind Alerts
      const windSpeed = cur.wind_speed_10m || 0;
      const windGusts = cur.wind_gusts_10m || 0;
      const maxWind = Math.max(windSpeed, windGusts);

      if (maxWind >= 70) {
        alerts.push({
          id: 'wind-severe',
          type: 'wind',
          severity: 'severe',
          badgeClass: 'badge-severe',
          titleAr: 'رياح عاتية شديدة الخطورة',
          titleEn: 'Severe Gale Force Winds',
          descAr: 'هبّات رياح تتجاوز 70 كم/س. تجنّب الوقوف قرب الأشجار واللوحات الإعلانية وأمّن الأجسام المتطايرة.',
          descEn: 'Wind gusts exceed 70 km/h. Secure loose objects and stay clear of trees.',
          icon: 'wind'
        });
      } else if (maxWind >= 40) {
        alerts.push({
          id: 'wind-warning',
          type: 'wind',
          severity: 'warning',
          badgeClass: 'badge-warning',
          titleAr: 'تنبيه: نشاط ملحوظ للرياح',
          titleEn: 'Strong Wind Warning',
          descAr: 'رياح نشطة مع هبات تصل إلى 40 كم/س أو أكثر. قد تثير الأتربة في المناطق المكشوفة.',
          descEn: 'Gusty winds reaching 40 km/h+. May cause blowing dust in open areas.',
          icon: 'wind'
        });
      }

      // 4. Rain Alerts
      const curRain = (cur.precipitation || 0) + (cur.rain || 0);
      let next6hRain = 0;
      if (Array.isArray(hourly.precipitation)) {
        next6hRain = hourly.precipitation.slice(0, 6).reduce((sum, val) => sum + (val || 0), 0);
      }

      if (curRain >= 8 || next6hRain >= 25) {
        alerts.push({
          id: 'rain-severe',
          type: 'rain',
          severity: 'severe',
          badgeClass: 'badge-severe',
          titleAr: 'تحذير: أمطار غزيرة وخطر سيول',
          titleEn: 'Heavy Torrential Rain & Flood Risk',
          descAr: 'أمطار غزيرة متوقعة أو جارية. تجنّب مجاري السيول وتوخَّ الحذر التام أثناء القيادة.',
          descEn: 'Torrential downpours expected. Avoid low-lying flood channels and drive with care.',
          icon: 'rain'
        });
      } else if (curRain >= 2.5 || next6hRain >= 10) {
        alerts.push({
          id: 'rain-warning',
          type: 'rain',
          severity: 'warning',
          badgeClass: 'badge-warning',
          titleAr: 'تنبيه: هطول أمطار ملحوظة',
          titleEn: 'Significant Rain Warning',
          descAr: 'هطول أمطار معتدلة إلى نشطة. يُنصح بحمل مظلة والحذر من انزلاق الطرق.',
          descEn: 'Moderate to steady rain. Carry an umbrella and beware of slippery roads.',
          icon: 'rain'
        });
      }

      // 5. Dust & Air Quality Alerts
      if (airData && airData.current) {
        const dust = airData.current.dust || 0;
        const pm10 = airData.current.pm10 || 0;

        if (dust >= 150 || pm10 >= 300) {
          alerts.push({
            id: 'dust-severe',
            type: 'dust',
            severity: 'severe',
            badgeClass: 'badge-severe',
            titleAr: 'تحذير: عاصفة غبارية شديدة',
            titleEn: 'Severe Dust Storm Alert',
            descAr: 'مستويات غبار خطيرة تعيق الرؤية وتضر بالجهاز التنفسي. الزم المنازل وأغلق النوافذ تماماً.',
            descEn: 'Hazardous dust concentration. Stay indoors with doors and windows tightly shut.',
            icon: 'dust'
          });
        } else if (dust >= 50 || pm10 >= 150) {
          alerts.push({
            id: 'dust-warning',
            type: 'dust',
            severity: 'warning',
            badgeClass: 'badge-warning',
            titleAr: 'تنبيه: أتربة معلّقة وانخفاض الرؤية',
            titleEn: 'Blowing Dust & Reduced Visibility',
            descAr: 'تركيز غبار مرتفع. يُنصح بارتداء كمامة واقية لأصحاب الحساسية والربو.',
            descEn: 'Elevated dust levels. Respiratory patients and sensitive groups should wear masks.',
            icon: 'dust'
          });
        }

        // UV Alert
        const uv = airData.current.uv_index || 0;
        if (uv >= 11) {
          alerts.push({
            id: 'uv-severe',
            type: 'uv',
            severity: 'severe',
            badgeClass: 'badge-severe',
            titleAr: 'تحذير: مؤشر أشعة فوق بنفسجية خطير',
            titleEn: 'Extreme UV Index Warning',
            descAr: 'مؤشر UV يتجاوز 11. أقصى درجات الخطورة على البشرة والعين، تجنب أشعة الشمس نهائياً.',
            descEn: 'UV index 11+. Extreme danger to skin and eyes; seek complete shade.',
            icon: 'sun'
          });
        } else if (uv >= 8) {
          alerts.push({
            id: 'uv-warning',
            type: 'uv',
            severity: 'warning',
            badgeClass: 'badge-warning',
            titleAr: 'تنبيه: إشعاع شمسي فوق بنفسجي مرتفع',
            titleEn: 'Very High UV Radiation',
            descAr: 'مؤشر UV مرتفع (8+). استخدم واقي الشمس وارتدِ نظارة شمسية وقبعة واقية.',
            descEn: 'UV index 8+. Apply sunblock and wear UV-rated sunglasses and headwear.',
            icon: 'sun'
          });
        }
      }

      // 6. Thunderstorm Alert (WMO Code)
      const wmo = cur.weather_code || 0;
      if (wmo >= 96) {
        alerts.push({
          id: 'thunder-severe',
          type: 'thunder',
          severity: 'severe',
          badgeClass: 'badge-severe',
          titleAr: 'عاصفة رعدية عنيفة مع تساقط البَرَد',
          titleEn: 'Severe Thunderstorm with Hail',
          descAr: 'صواعق رعدية قوية وزخات بَرَد. ابتعد عن الأماكن المكشوفة والأعمدة المعدنية فوراً.',
          descEn: 'Intense lightning strikes and hail. Seek indoor shelter immediately.',
          icon: 'thunderstorm'
        });
      } else if (wmo === 95) {
        alerts.push({
          id: 'thunder-warning',
          type: 'thunder',
          severity: 'warning',
          badgeClass: 'badge-warning',
          titleAr: 'تنبيه: عاصفة رعدية نشطة',
          titleEn: 'Thunderstorm Warning',
          descAr: 'احتمال حدوث صواعق رعدية وهطول مفاجئ للأمطار. توخَّ الحيطة والحذر.',
          descEn: 'Thunder and lightning activity detected in the area. Stay alert.',
          icon: 'thunderstorm'
        });
      }

      // 7. Active Cyclone / Tropical Storm Proximity
      if (closestStorm && closestStorm.distanceKm !== null) {
        const d = closestStorm.distanceKm;
        const windKmh = closestStorm.windKmh || 0;

        if (d <= 500) {
          alerts.push({
            id: 'cyclone-severe',
            type: 'cyclone',
            severity: 'severe',
            badgeClass: 'badge-severe',
            titleAr: `إعصار نشط (${closestStorm.title}) على بعد ${Math.round(d)} كم`,
            titleEn: `Active Cyclone (${closestStorm.title}) ${Math.round(d)} km away`,
            descAr: `النظام المداري قريب بسرعة رياح ${Math.round(windKmh)} كم/س. تابع تحذيرات الأرصاد الرسمية بدقة.`,
            descEn: `Severe tropical system within ${Math.round(d)} km, winds ${Math.round(windKmh)} km/h. Monitor official advisories.`,
            icon: 'cyclone'
          });
        } else if (d <= 1000) {
          alerts.push({
            id: 'cyclone-warning',
            type: 'cyclone',
            severity: 'warning',
            badgeClass: 'badge-warning',
            titleAr: `منظومة مدارية (${closestStorm.title}) ضمن نطاق 1000 كم`,
            titleEn: `Tropical System (${closestStorm.title}) within 1000 km`,
            descAr: `إعصار يبعد ${Math.round(d)} كم مع رياح ${Math.round(windKmh)} كم/س. قد يؤثر على اضطراب البحر والرياح.`,
            descEn: `Tropical cyclone ${Math.round(d)} km away with ${Math.round(windKmh)} km/h winds. May induce rough sea conditions.`,
            icon: 'cyclone'
          });
        }
      }

      // Sort: Severe (3) > Warning (2) > Info (1)
      const rank = { severe: 3, warning: 2, info: 1 };
      return alerts.sort((a, b) => rank[b.severity] - rank[a.severity]);
    }
  };

  window.Ajwaa.AlertsEngine = AlertsEngine;
})();
