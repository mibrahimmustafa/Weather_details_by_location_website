/**
 * Ajwaa (أجواء) - Geolocation & Spatial Calculations
 * Haversine distance, storm wind calculations, and spatial proximity.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Geo = {
    // Calculates Haversine distance between two coordinates in kilometers
    haversineDistance(lat1, lon1, lat2, lon2) {
      if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;
      
      const R = 6371; // Earth's mean radius in km
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },

    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    },

    // Knots to km/h
    knotsToKmh(knots) {
      if (!knots || isNaN(knots)) return 0;
      return knots * 1.852;
    },

    // Cyclone category and severity based on wind speed (km/h)
    getStormSeverity(windKmh) {
      const w = Number(windKmh) || 0;
      if (w >= 118) {
        return {
          level: 'severe',
          badgeClass: 'badge-severe',
          color: 'var(--color-severe)',
          en: 'Severe Cyclone / Hurricane',
          ar: 'إعصار استوائي شديد'
        };
      }
      if (w >= 63) {
        return {
          level: 'warning',
          badgeClass: 'badge-warning',
          color: 'var(--color-warning)',
          en: 'Tropical Storm',
          ar: 'عاصفة مدارية نشطة'
        };
      }
      return {
        level: 'info',
        badgeClass: 'badge-info',
        color: 'var(--color-info)',
        en: 'Tropical Depression',
        ar: 'منخفض مداري'
      };
    }
  };

  window.Ajwaa.Geo = Geo;
})();
