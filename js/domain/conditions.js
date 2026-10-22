/**
 * Ajwaa (أجواء) - Weather Conditions Domain Logic
 * Maps WMO weather codes (0-99) to bilingual descriptions, atmosphere types, and SVGs.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Conditions = {
    getCondition(code, isDay = 1) {
      const c = Number(code);

      // WMO Code Map
      // 0: Clear sky
      // 1-3: Mainly clear, partly cloudy, overcast
      // 45, 48: Fog and depositing rime fog
      // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
      // 56, 57: Freezing Drizzle: Light and dense
      // 61, 63, 65: Rain: Slight, moderate and heavy intensity
      // 66, 67: Freezing Rain: Light and heavy
      // 71, 73, 75: Snow fall: Slight, moderate, and heavy
      // 77: Snow grains
      // 80, 81, 82: Rain showers: Slight, moderate, and violent
      // 85, 86: Snow showers slight and heavy
      // 95: Thunderstorm: Slight or moderate
      // 96, 99: Thunderstorm with slight and heavy hail

      if (c === 0) {
        return {
          code: c,
          atmosphere: isDay ? 'clear-day' : 'clear-night',
          icon: isDay ? 'sun' : 'moon',
          en: isDay ? 'Clear Sky' : 'Clear Night',
          ar: isDay ? 'سماء صافية' : 'ليلة صافية'
        };
      }
      if (c === 1 || c === 2) {
        return {
          code: c,
          atmosphere: isDay ? 'clear-day' : 'clear-night',
          icon: isDay ? 'cloud-sun' : 'cloud-moon',
          en: isDay ? 'Partly Cloudy' : 'Partly Cloudy Night',
          ar: isDay ? 'غائم جزئياً' : 'غائم جزئياً ليلاً'
        };
      }
      if (c === 3) {
        return {
          code: c,
          atmosphere: 'cloudy',
          icon: 'cloud',
          en: 'Overcast',
          ar: 'غائم كلياً'
        };
      }
      if (c === 45 || c === 48) {
        return {
          code: c,
          atmosphere: 'cloudy',
          icon: 'fog',
          en: 'Fog & Mist',
          ar: 'ضباب وشبورة'
        };
      }
      if (c >= 51 && c <= 57) {
        return {
          code: c,
          atmosphere: 'rain',
          icon: 'drizzle',
          en: 'Light Drizzle',
          ar: 'رذاذ خفيف'
        };
      }
      if (c >= 61 && c <= 67) {
        return {
          code: c,
          atmosphere: 'rain',
          icon: 'rain',
          en: c === 65 ? 'Heavy Rain' : 'Rain',
          ar: c === 65 ? 'أمطار غزيرة' : 'أمطار'
        };
      }
      if ((c >= 71 && c <= 77) || c === 85 || c === 86) {
        return {
          code: c,
          atmosphere: 'cloudy',
          icon: 'snow',
          en: 'Snowfall',
          ar: 'تساقط ثلوج'
        };
      }
      if (c >= 80 && c <= 82) {
        return {
          code: c,
          atmosphere: 'rain',
          icon: 'showers',
          en: 'Rain Showers',
          ar: 'زخات مطر'
        };
      }
      if (c >= 95) {
        return {
          code: c,
          atmosphere: 'thunder',
          icon: 'thunderstorm',
          en: c >= 96 ? 'Thunderstorm with Hail' : 'Thunderstorm',
          ar: c >= 96 ? 'عاصفة رعدية وبَرَد' : 'عاصفة رعدية'
        };
      }

      // Default fallback
      return {
        code: c,
        atmosphere: isDay ? 'clear-day' : 'clear-night',
        icon: isDay ? 'sun' : 'moon',
        en: 'Fair',
        ar: 'معتدل'
      };
    },

    getIconSvg(iconName) {
      switch (iconName) {
        case 'sun':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <circle cx="32" cy="32" r="14" fill="#F2A65A"/>
            <path d="M32 6V12M32 52V58M6 32H12M52 32H58M13.6 13.6L17.8 17.8M46.2 46.2L50.4 50.4M13.6 50.4L17.8 46.2M46.2 17.8L50.4 13.6" stroke="#F2A65A" stroke-width="4" stroke-linecap="round"/>
          </svg>`;
        case 'moon':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <path d="M42 14A22 22 0 1 0 50 46A20 20 0 0 1 42 14Z" fill="#5AB8E8"/>
            <circle cx="24" cy="20" r="1.5" fill="#FFFFFF" opacity="0.8"/>
            <circle cx="36" cy="32" r="1.2" fill="#FFFFFF" opacity="0.8"/>
          </svg>`;
        case 'cloud-sun':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <circle cx="24" cy="24" r="10" fill="#F2A65A"/>
            <path d="M24 6V10M6 24H10M11 11L14 14M37 11L34 14" stroke="#F2A65A" stroke-width="3" stroke-linecap="round"/>
            <path d="M22 48H46A10 10 0 0 0 46 28A12 12 0 0 0 24 32A10 10 0 0 0 22 48Z" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"/>
          </svg>`;
        case 'cloud-moon':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <path d="M28 12A14 14 0 0 0 34 32A14 14 0 0 1 28 12Z" fill="#5AB8E8"/>
            <path d="M22 48H46A10 10 0 0 0 46 28A12 12 0 0 0 24 32A10 10 0 0 0 22 48Z" fill="#D7E6F3"/>
          </svg>`;
        case 'cloud':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <path d="M20 46H48A11 11 0 0 0 48 24A14 14 0 0 0 23 28A11 11 0 0 0 20 46Z" fill="#E3EDF7"/>
          </svg>`;
        case 'rain':
        case 'showers':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <path d="M18 38H46A10 10 0 0 0 46 18A13 13 0 0 0 22 22A10 10 0 0 0 18 38Z" fill="#CBDCEB"/>
            <line x1="22" y1="44" x2="18" y2="54" stroke="#49B7D8" stroke-width="3" stroke-linecap="round"/>
            <line x1="32" y1="44" x2="28" y2="54" stroke="#49B7D8" stroke-width="3" stroke-linecap="round"/>
            <line x1="42" y1="44" x2="38" y2="54" stroke="#49B7D8" stroke-width="3" stroke-linecap="round"/>
          </svg>`;
        case 'drizzle':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <path d="M18 38H46A10 10 0 0 0 46 18A13 13 0 0 0 22 22A10 10 0 0 0 18 38Z" fill="#CBDCEB"/>
            <line x1="24" y1="44" x2="22" y2="50" stroke="#49B7D8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="36" y1="44" x2="34" y2="50" stroke="#49B7D8" stroke-width="2.5" stroke-linecap="round"/>
          </svg>`;
        case 'thunderstorm':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <path d="M18 36H46A10 10 0 0 0 46 16A13 13 0 0 0 22 20A10 10 0 0 0 18 36Z" fill="#7A8FA6"/>
            <polygon points="34,36 26,48 32,48 28,58 40,44 34,44" fill="#F2A65A"/>
          </svg>`;
        case 'snow':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <path d="M18 36H46A10 10 0 0 0 46 16A13 13 0 0 0 22 20A10 10 0 0 0 18 36Z" fill="#CBDCEB"/>
            <circle cx="24" cy="46" r="2.5" fill="#FFFFFF"/>
            <circle cx="34" cy="52" r="2.5" fill="#FFFFFF"/>
            <circle cx="44" cy="46" r="2.5" fill="#FFFFFF"/>
          </svg>`;
        case 'fog':
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <line x1="16" y1="26" x2="48" y2="26" stroke="#93D2F3" stroke-width="4" stroke-linecap="round"/>
            <line x1="12" y1="34" x2="52" y2="34" stroke="#93D2F3" stroke-width="4" stroke-linecap="round"/>
            <line x1="18" y1="42" x2="46" y2="42" stroke="#93D2F3" stroke-width="4" stroke-linecap="round"/>
          </svg>`;
        default:
          return `<svg viewBox="0 0 64 64" fill="none" class="weather-icon">
            <circle cx="32" cy="32" r="14" fill="#F2A65A"/>
          </svg>`;
      }
    }
  };

  window.Ajwaa.Conditions = Conditions;
})();
