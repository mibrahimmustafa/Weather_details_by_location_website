/**
 * Ajwaa (أجواء) - Global Configuration
 * Brand identity, storage keys, default coordinates, and popular cities presets.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Config = {
    app: {
      name: 'أجواء · Ajwaa',
      nameAr: 'أجواء',
      nameEn: 'Ajwaa',
      taglineAr: 'الطقس والوقت، أينما كنت',
      taglineEn: 'Weather & time, wherever you are',
      version: '1.0.0',
      author: 'Mohamed Ibrahim Mustafa',
      repoUrl: 'https://github.com/mibrahimmustafa/Weather_details_by_location_website.git'
    },

    storageKeys: {
      settings: 'ajwaa.settings.v1',
      cities: 'ajwaa.cities.v1',
      selectedCity: 'ajwaa.selectedCity.v1',
      onboardingSeen: 'ajwaa.onboardingSeen.v1',
      weatherPrefix: 'ajwaa.weather.v1.'
    },

    cache: {
      ttlMs: 10 * 60 * 1000, // 10 minutes cache validity
      distanceThresholdKm: 5 // Invalidate cache if moved > 5 km
    },

    defaultCity: {
      id: 360630,
      name: 'القاهرة',
      nameEn: 'Cairo',
      lat: 30.0626,
      lon: 31.2497,
      country: 'مصر',
      countryEn: 'Egypt',
      timezone: 'Africa/Cairo'
    },

    popularCities: [
      { id: 360630, name: 'القاهرة', nameEn: 'Cairo', lat: 30.0626, lon: 31.2497, country: 'مصر', countryEn: 'Egypt', timezone: 'Africa/Cairo' },
      { id: 108410, name: 'الرياض', nameEn: 'Riyadh', lat: 24.7136, lon: 46.6753, country: 'السعودية', countryEn: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
      { id: 292223, name: 'دبي', nameEn: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'الإمارات', countryEn: 'UAE', timezone: 'Asia/Dubai' },
      { id: 2643743, name: 'لندن', nameEn: 'London', lat: 51.5074, lon: -0.1278, country: 'المملكة المتحدة', countryEn: 'UK', timezone: 'Europe/London' },
      { id: 5128581, name: 'نيويورك', nameEn: 'New York', lat: 40.7128, lon: -74.0060, country: 'أمريكا', countryEn: 'USA', timezone: 'America/New_York' },
      { id: 1850147, name: 'طوكيو', nameEn: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'اليابان', countryEn: 'Japan', timezone: 'Asia/Tokyo' },
      { id: 2988507, name: 'باريس', nameEn: 'Paris', lat: 48.8566, lon: 2.3522, country: 'فرنسا', countryEn: 'France', timezone: 'Europe/Paris' },
      { id: 745044, name: 'إسطنبول', nameEn: 'Istanbul', lat: 41.0082, lon: 28.9784, country: 'تركيا', countryEn: 'Turkey', timezone: 'Europe/Istanbul' },
      { id: 104515, name: 'مكة المكرمة', nameEn: 'Mecca', lat: 21.3891, lon: 39.8579, country: 'السعودية', countryEn: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
      { id: 2553604, name: 'الدار البيضاء', nameEn: 'Casablanca', lat: 33.5731, lon: -7.5898, country: 'المغرب', countryEn: 'Morocco', timezone: 'Africa/Casablanca' }
    ]
  };

  window.Ajwaa.Config = Config;
})();
