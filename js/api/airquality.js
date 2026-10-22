/**
 * Ajwaa (أجواء) - Air Quality & Dust API Client
 * Fetches dust, PM10, PM2.5, US AQI, and UV index from Open-Meteo Air Quality.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const AirQualityApi = {
    async getAirQuality(latitude, longitude) {
      if (latitude === null || longitude === null) {
        throw new Error('Coordinates required for air quality');
      }

      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        timezone: 'auto',
        current: [
          'dust',
          'pm10',
          'pm2_5',
          'us_aqi',
          'european_aqi',
          'uv_index'
        ].join(','),
        hourly: [
          'dust',
          'pm10'
        ].join(',')
      });

      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`;
      return await window.Ajwaa.Http.fetchWithTimeout(url);
    }
  };

  window.Ajwaa.AirQualityApi = AirQualityApi;
})();
