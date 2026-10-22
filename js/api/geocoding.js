/**
 * Ajwaa (أجواء) - Geocoding & City Search API Client
 * Search global cities and resolve GPS coordinates to city names.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const GeocodingApi = {
    async searchCities(query, language = 'ar') {
      if (!query || query.trim().length < 2) return [];

      const langParam = language === 'en' ? 'en' : 'ar';
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=10&language=${langParam}&format=json`;

      try {
        const res = await window.Ajwaa.Http.fetchWithTimeout(url, {}, 8000, 1);
        if (!res || !Array.isArray(res.results)) return [];

        return res.results.map(item => ({
          id: item.id,
          name: item.name,
          lat: item.latitude,
          lon: item.longitude,
          country: item.country || '',
          admin1: item.admin1 || '',
          timezone: item.timezone || 'auto'
        }));
      } catch (err) {
        console.warn('Geocoding search error:', err);
        return [];
      }
    },

    async reverseGeocode(lat, lon, language = 'ar') {
      const langParam = language === 'en' ? 'en' : 'ar';
      
      // Try BigDataCloud primary
      const bdcUrl = `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${langParam}`;
      
      try {
        const data = await window.Ajwaa.Http.fetchWithTimeout(bdcUrl, {}, 8000, 1);
        if (data && (data.city || data.locality || data.principalSubdivision)) {
          const cityName = data.city || data.locality || data.principalSubdivision;
          const countryName = data.countryName || '';
          return {
            id: `gps-${lat.toFixed(2)}-${lon.toFixed(2)}`,
            name: cityName,
            lat,
            lon,
            country: countryName,
            isGps: true
          };
        }
      } catch (err) {
        console.warn('BigDataCloud reverse geocode fallback:', err);
      }

      // Secondary fallback: OpenStreetMap Nominatim
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${langParam}`;
        const nomData = await window.Ajwaa.Http.fetchWithTimeout(nomUrl, {
          headers: { 'Accept': 'application/json' }
        }, 8000, 1);

        if (nomData && nomData.address) {
          const addr = nomData.address;
          const cityName = addr.city || addr.town || addr.village || addr.suburb || addr.state || 'موقعي الحالي';
          const countryName = addr.country || '';
          return {
            id: `gps-${lat.toFixed(2)}-${lon.toFixed(2)}`,
            name: cityName,
            lat,
            lon,
            country: countryName,
            isGps: true
          };
        }
      } catch (nomErr) {
        console.warn('Nominatim reverse geocode fallback:', nomErr);
      }

      // Default GPS placeholder
      return {
        id: `gps-${lat.toFixed(2)}-${lon.toFixed(2)}`,
        name: language === 'ar' ? 'موقعي الحالي' : 'Current Location',
        lat,
        lon,
        country: '',
        isGps: true
      };
    }
  };

  window.Ajwaa.GeocodingApi = GeocodingApi;
})();
