/**
 * Ajwaa (أجواء) - Internationalization (i18n) Engine
 * Full bilingual Arabic (RTL) & English (LTR) dictionary and DOM binding.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const translations = {
    ar: {
      appName: 'أجواء',
      appTagline: 'الطقس والوقت، أينما كنت',
      searchPlaceholder: 'ابحث عن اسم مدينة...',
      searchCity: 'البحث عن مدينة',
      currentLocation: 'موقعي الحالي (GPS)',
      savedCities: 'المدن المحفوظة',
      popularCities: 'مدن شائعة',
      noSavedCities: 'لا توجد مدن محفوظة بعد',
      noResults: 'لم يتم العثور على مدن مطابقة',
      live: 'مباشر',
      feelsLike: 'تبدو كأنها',
      high: 'العظمى',
      low: 'الصغرى',
      localTime: 'الوقت المحلي',
      updatedJustNow: 'محدّث الآن',
      updatedMinAgo: 'محدّث منذ {m} دقيقة',
      refresh: 'تحديث',
      offlineBanner: 'بيانات محفوظة — قد لا تكون محدّثة (لا يوجد اتصال بالإنترنت)',
      retry: 'إعادة المحاولة',
      errorNetwork: 'تعذر الاتصال بخوادم الطقس. يرجى التحقق من اتصالك بالإنترنت.',
      errorTimeout: 'استغرقت الاستجابة وقتاً طويلاً. يرجى المحاولة مرة أخرى.',
      alertsTitle: 'تنبيهات الطقس الحالية',
      alertsCount: '{n} تنبيهات نشطة',
      noAlerts: 'الأجواء هادئة ومستقرة، لا توجد تنبيهات نشطة حالياً.',
      hourlyTitle: 'الساعات الـ24 القادمة',
      now: 'الآن',
      rainAndDustTitle: 'الأمطار والغبار',
      rainCardTitle: 'الأمطار',
      rain24h: 'إجمالي 24 ساعة',
      rainChanceNow: 'احتمال المطر الآن',
      rainScrollHint: 'اسحب أفقيًا لاستعراض الساعات القادمة',
      dustCardTitle: 'جودة الهواء والغبار',
      dustMetric: 'تركيز الغبار',
      pm25: 'PM2.5',
      pm10: 'PM10',
      aqi: 'مؤشر جودة الهواء',
      weatherDetailsTitle: 'تفاصيل الطقس',
      humidity: 'الرطوبة',
      dewPoint: 'نقطة الندى',
      wind: 'الرياح',
      windGusts: 'الهبّات',
      rainProb: 'احتمال المطر',
      uvIndex: 'مؤشر UV',
      pressure: 'الضغط الجوي',
      visibility: 'المدى البصري',
      cloudCover: 'الغطاء السحابي',
      sunPathTitle: 'مسار الشمس',
      sunrise: 'الشروق',
      sunset: 'الغروب',
      daylightRemaining: 'المتبقي من ضوء النهار: {h} س و {m} د',
      cyclonesTitle: 'الأنظمة والأعاصير المدارية النشطة',
      closestCyclones: 'أقرب الأنظمة المدارية حول العالم (NASA EONET)',
      noCyclones: 'لا توجد أعاصير مدارية نشطة حول العالم حالياً. الأجواء مستقرة.',
      cyclonesUnavailable: 'بيانات الأعاصير غير متاحة مؤقتاً.',
      cycloneDistance: 'يبعد {d} كم',
      cycloneWind: 'سرعة الرياح {w} كم/س',
      viewSource: 'المصدر',
      forecast7Title: 'توقعات 7 أيام',
      today: 'اليوم',
      tomorrow: 'غداً',
      footerAbout: 'أجواء هو تطبيق ويب فائق الخفة والسرعة لعرض تفاصيل الطقس والتوقيت المحلي لأي مدينة في العالم.',
      footerProviders: 'البيانات مقدمة ومستمدة من مصادر عالمية مجانية ومفتوحة:',
      footerCredits: 'صُنع بواسطة Mohamed Ibrahim · الإصدار 1.0.0',
      footerOpenData: 'بيانات مفتوحة ومجانية بدون أي مفاتيح API أو تعقب.',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfUse: 'شروط الاستخدام',
      settingsTitle: 'الإعدادات',
      appearance: 'المظهر',
      themeDark: 'داكن',
      themeLight: 'فاتح',
      themeSystem: 'تلقائي (حسب النظام)',
      units: 'الوحدات',
      unitMetric: 'متري (°C, كم/س, ملم)',
      unitImperial: 'إمبراطوري (°F, ميل/س, بوصة)',
      language: 'اللغة / Language',
      welcomeTitle: 'أهلاً بك في أجواء',
      welcomeSubtitle: 'استكشف الطقس بدقة والتوقيت الحي لأي مدينة حول العالم في ثوانٍ معدودة.',
      welcomeAllowLocation: 'استخدام موقعي الحالي',
      welcomeChooseCity: 'اختيار مدينة من القائمة',
      welcomeNotNow: 'ليس الآن',
      cityAddedToast: 'تمت إضافة {city} إلى مفضلتك',
      cityRemovedToast: 'تمت إزالة {city}',
      locationPermissionDenied: 'تعذر الوصول إلى الموقع الجغرافي. تم تحديد القاهرة كمدينة افتراضية.',
      learnMore: 'شرح الرقم والتوصيات الصحية',
      close: 'إغلاق'
    },
    en: {
      appName: 'Ajwaa',
      appTagline: 'Weather & time, wherever you are',
      searchPlaceholder: 'Search city name...',
      searchCity: 'Search City',
      currentLocation: 'Current Location (GPS)',
      savedCities: 'Saved Cities',
      popularCities: 'Popular Cities',
      noSavedCities: 'No saved cities yet',
      noResults: 'No matching cities found',
      live: 'LIVE',
      feelsLike: 'Feels like',
      high: 'High',
      low: 'Low',
      localTime: 'Local Time',
      updatedJustNow: 'Updated just now',
      updatedMinAgo: 'Updated {m}m ago',
      refresh: 'Refresh',
      offlineBanner: 'Cached data displayed — may not be up to date (Offline)',
      retry: 'Retry',
      errorNetwork: 'Unable to connect to weather servers. Please check your internet connection.',
      errorTimeout: 'Request timed out. Please try again.',
      alertsTitle: 'Active Weather Alerts',
      alertsCount: '{n} active alerts',
      noAlerts: 'Calm and steady atmosphere. No active weather alerts right now.',
      hourlyTitle: 'Next 24 Hours',
      now: 'Now',
      rainAndDustTitle: 'Precipitation & Dust',
      rainCardTitle: 'Precipitation',
      rain24h: '24h Total',
      rainChanceNow: 'Rain chance now',
      rainScrollHint: 'Scroll horizontally to view upcoming hours',
      dustCardTitle: 'Air Quality & Dust',
      dustMetric: 'Dust Level',
      pm25: 'PM2.5',
      pm10: 'PM10',
      aqi: 'Air Quality Index',
      weatherDetailsTitle: 'Weather Details',
      humidity: 'Humidity',
      dewPoint: 'Dew Point',
      wind: 'Wind',
      windGusts: 'Gusts',
      rainProb: 'Rain Probability',
      uvIndex: 'UV Index',
      pressure: 'Pressure',
      visibility: 'Visibility',
      cloudCover: 'Cloud Cover',
      sunPathTitle: 'Sun Path Arc',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      daylightRemaining: 'Daylight remaining: {h}h {m}m',
      cyclonesTitle: 'Active Tropical Systems & Cyclones',
      closestCyclones: 'Nearest Tropical Systems Worldwide (NASA EONET)',
      noCyclones: 'No active tropical storms or cyclones recorded worldwide right now.',
      cyclonesUnavailable: 'Cyclone data currently unavailable.',
      cycloneDistance: '{d} km away',
      cycloneWind: 'Winds {w} km/h',
      viewSource: 'Source',
      forecast7Title: '7-Day Forecast',
      today: 'Today',
      tomorrow: 'Tomorrow',
      footerAbout: 'Ajwaa is an ultra-fast, lightweight web application displaying live weather and real-time local clocks for any location on Earth.',
      footerProviders: 'Data provided by reputable, free open services:',
      footerCredits: 'Crafted by Mohamed Ibrahim · Version 1.0.0',
      footerOpenData: 'Open and free data with zero API keys or user tracking.',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      settingsTitle: 'Settings',
      appearance: 'Appearance',
      themeDark: 'Dark',
      themeLight: 'Light',
      themeSystem: 'System Default',
      units: 'Units',
      unitMetric: 'Metric (°C, km/h, mm)',
      unitImperial: 'Imperial (°F, mph, in)',
      language: 'Language / اللغة',
      welcomeTitle: 'Welcome to Ajwaa',
      welcomeSubtitle: 'Accurate weather details, active storms, and real-time local time wherever you are.',
      welcomeAllowLocation: 'Use My Current Location',
      welcomeChooseCity: 'Choose a City',
      welcomeNotNow: 'Not Now',
      cityAddedToast: '{city} added to your cities',
      cityRemovedToast: '{city} removed',
      locationPermissionDenied: 'Location access denied. Cairo selected as default.',
      learnMore: 'Explanation & Health Advice',
      close: 'Close'
    }
  };

  const I18n = {
    currentLang: 'ar',

    init(lang = 'ar') {
      this.setLanguage(lang);
    },

    setLanguage(lang) {
      this.currentLang = lang === 'en' ? 'en' : 'ar';
      
      const html = document.documentElement;
      html.setAttribute('lang', this.currentLang);
      html.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');

      this.applyTranslations();
    },

    t(key, params = {}) {
      const dict = translations[this.currentLang] || translations.ar;
      let text = dict[key] || translations.ar[key] || key;

      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      }

      return text;
    },

    applyTranslations(root = document) {
      const elements = root.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = this.t(key);
        }
      });

      const placeholders = root.querySelectorAll('[data-i18n-placeholder]');
      placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
          el.setAttribute('placeholder', this.t(key));
        }
      });

      const titles = root.querySelectorAll('[data-i18n-title]');
      titles.forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
          el.setAttribute('title', this.t(key));
        }
      });

      const arias = root.querySelectorAll('[data-i18n-aria]');
      arias.forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (key) {
          el.setAttribute('aria-label', this.t(key));
        }
      });
    }
  };

  window.Ajwaa.I18n = I18n;
})();
