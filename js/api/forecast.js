/**
 * Ajwaa (أجواء) - Weather Forecast API Client
 * Fetches current weather, 24-hour hourly, and 7-day daily forecasts from Open-Meteo.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const ForecastApi = {
    async getForecast(latitude, longitude) {
      if (latitude === null || longitude === null) {
        throw new Error('Coordinates required for forecast');
      }

      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        timezone: 'auto',
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m'
        ].join(','),
        hourly: [
          'temperature_2m',
          'precipitation_probability',
          'precipitation',
          'weather_code',
          'wind_speed_10m',
          'visibility'
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_sum',
          'precipitation_probability_max',
          'wind_speed_10m_max'
        ].join(',')
      });

      const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
      return await window.Ajwaa.Http.fetchWithTimeout(url);
    }
  };

  window.Ajwaa.ForecastApi = ForecastApi;
})();
