/**
 * Ajwaa (أجواء) - Environmental Levels Domain Logic
 * Handles categorization & health advice for Dust, UV, and Air Quality (AQI).
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Levels = {
    // Dust classification (µg/m³)
    getDustLevel(dustVal) {
      const v = Number(dustVal) || 0;
      if (v < 20) {
        return {
          level: 'low',
          color: 'var(--teal-500)',
          badgeClass: 'badge-info',
          en: 'Low',
          ar: 'منخفض',
          adviceEn: 'Air is clean from mineral dust. Ideal for outdoor activities.',
          adviceAr: 'الهواء نقي وخالٍ من الغبار المعدني. ملائم جدًا للأنشطة الخارجية.'
        };
      }
      if (v < 50) {
        return {
          level: 'moderate',
          color: 'var(--gold-500)',
          badgeClass: 'badge-warning',
          en: 'Moderate',
          ar: 'متوسط',
          adviceEn: 'Noticeable haze in the air. Sensitive individuals should take care.',
          adviceAr: 'عوالق ترابية خفيفة ملحوظة. يُنصح أصحاب الحساسية بتوخي الحذر.'
        };
      }
      if (v < 100) {
        return {
          level: 'high',
          color: 'var(--coral-500)',
          badgeClass: 'badge-warning',
          en: 'High',
          ar: 'مرتفع',
          adviceEn: 'Dense dust suspension. Wear a protective mask and close windows.',
          adviceAr: 'غبار كثيف معلّق. يُنصح بارتداء كمامة واقية وإغلاق النوافذ.'
        };
      }
      return {
        level: 'very_high',
        color: 'var(--color-severe)',
        badgeClass: 'badge-severe',
        en: 'Very High',
        ar: 'مرتفع جداً',
        adviceEn: 'Severe dust storm. Avoid going outside; keep doors tightly shut.',
        adviceAr: 'عاصفة ترابية شديدة. تجنّب الخروج وأحكم إغلاق النوافذ والأبواب.'
      };
    },

    // UV Index classification
    getUvLevel(uvVal) {
      const v = Number(uvVal) || 0;
      if (v < 3) {
        return {
          level: 'low',
          color: 'var(--teal-500)',
          badgeClass: 'badge-info',
          en: 'Low',
          ar: 'منخفض',
          adviceEn: 'Minimal sun danger. No special protection needed.',
          adviceAr: 'أشعة شمس آمنة. لا حاجة لحماية خاصة.'
        };
      }
      if (v < 6) {
        return {
          level: 'moderate',
          color: 'var(--gold-500)',
          badgeClass: 'badge-warning',
          en: 'Moderate',
          ar: 'متوسط',
          adviceEn: 'Wear sunglasses and sunscreen if spending extended time in the sun.',
          adviceAr: 'ارتدِ نظارة شمسية واستخدم واقي الشمس عند البقاء طويلاً في الخارج.'
        };
      }
      if (v < 8) {
        return {
          level: 'high',
          color: 'var(--coral-500)',
          badgeClass: 'badge-warning',
          en: 'High',
          ar: 'مرتفع',
          adviceEn: 'Seek shade during midday; wear a protective hat and sunscreen.',
          adviceAr: 'احرص على الظل وقت الظهيرة، وارتدِ قبعة واقية واستخدم واقي الشمس.'
        };
      }
      if (v < 11) {
        return {
          level: 'very_high',
          color: 'var(--color-severe)',
          badgeClass: 'badge-severe',
          en: 'Very High',
          ar: 'مرتفع جداً',
          adviceEn: 'Unprotected skin can burn rapidly. Minimize midday sun exposure.',
          adviceAr: 'البشرة قد تحترق سريعاً. تجنّب التعرّض للشمس في أوقات الذروة.'
        };
      }
      return {
        level: 'extreme',
        color: '#8E44AD',
        badgeClass: 'badge-severe',
        en: 'Extreme',
        ar: 'خطير جداً',
        adviceEn: 'Dangerous radiation levels. Take all precautions and avoid direct sun.',
        adviceAr: 'إشعاع شمسي شديد الخطورة. تجنب التعرض المباشر واستخدم أقصى درجات الوقاية.'
      };
    },

    // US AQI (Air Quality Index) classification
    getAqiLevel(aqiVal) {
      const v = Number(aqiVal) || 0;
      if (v <= 50) {
        return {
          level: 'good',
          color: 'var(--aqi-good)',
          badgeClass: 'badge-info',
          en: 'Good',
          ar: 'ممتاز',
          descEn: 'Air quality is satisfactory with little or no risk.',
          descAr: 'جودة الهواء ممتازة ولا تشكل أي مخاطر صحية.'
        };
      }
      if (v <= 100) {
        return {
          level: 'moderate',
          color: 'var(--aqi-moderate)',
          badgeClass: 'badge-warning',
          en: 'Moderate',
          ar: 'مقبول',
          descEn: 'Air quality is acceptable for most; mild concern for very sensitive people.',
          descAr: 'الهواء مقبول لمعظم الناس، مع قلق طفيف للأشخاص شديدي الحساسية.'
        };
      }
      if (v <= 150) {
        return {
          level: 'sensitive',
          color: 'var(--aqi-sensitive)',
          badgeClass: 'badge-warning',
          en: 'Unhealthy for Sensitive',
          ar: 'غير صحي للحساسين',
          descEn: 'Members of sensitive groups may experience health effects.',
          descAr: 'قد يعاني أصحاب الحساسية وأمراض الصدر من صعوبة في التنفس.'
        };
      }
      if (v <= 200) {
        return {
          level: 'unhealthy',
          color: 'var(--aqi-unhealthy)',
          badgeClass: 'badge-severe',
          en: 'Unhealthy',
          ar: 'غير صحي',
          descEn: 'Everyone may begin to experience adverse health effects.',
          descAr: 'قد يبدأ الجميع في الشعور بآثار صحية ملحوظة.'
        };
      }
      if (v <= 300) {
        return {
          level: 'very_unhealthy',
          color: 'var(--aqi-very)',
          badgeClass: 'badge-severe',
          en: 'Very Unhealthy',
          ar: 'غير صحي تماماً',
          descEn: 'Health alert: serious risk of health effects for all.',
          descAr: 'إنذار صحي: خطر ملحوظ على صحة كافة الفئات.'
        };
      }
      return {
        level: 'hazardous',
        color: 'var(--aqi-hazardous)',
        badgeClass: 'badge-severe',
        en: 'Hazardous',
        ar: 'خطير',
        descEn: 'Emergency warning: everyone should avoid outdoor activity.',
        descAr: 'تحذير طوارئ صحي: يجب على الجميع البقاء في الأماكن المغلقة.'
      };
    }
  };

  window.Ajwaa.Levels = Levels;
})();
