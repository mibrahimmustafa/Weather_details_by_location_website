/**
 * Ajwaa (أجواء) - Tropical Storms & Cyclones API Client
 * Tracks open severe storms via NASA EONET with distance calculation and GDACS fallback.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const StormsApi = {
    async getActiveStorms(userLat, userLon) {
      const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?category=severeStorms&status=open&days=60';

      try {
        const data = await window.Ajwaa.Http.fetchWithTimeout(url, {}, 12000, 1);
        if (!data || !Array.isArray(data.events)) {
          return { status: 'empty', events: [] };
        }

        const parsedEvents = [];

        for (const ev of data.events) {
          if (!Array.isArray(ev.geometry) || ev.geometry.length === 0) continue;

          // Latest geometry point is the last item
          const latestGeo = ev.geometry[ev.geometry.length - 1];
          if (!latestGeo || !Array.isArray(latestGeo.coordinates)) continue;

          // Note: GeoJSON coordinates are [longitude, latitude]
          const lon = latestGeo.coordinates[0];
          const lat = latestGeo.coordinates[1];

          // Wind speed in knots (magnitudeValue)
          const knots = latestGeo.magnitudeValue || 0;
          const windKmh = window.Ajwaa.Geo.knotsToKmh(knots);

          // Calculate distance to selected city
          let distanceKm = null;
          if (userLat !== null && userLon !== null) {
            distanceKm = window.Ajwaa.Geo.haversineDistance(userLat, userLon, lat, lon);
          }

          const severityInfo = window.Ajwaa.Geo.getStormSeverity(windKmh);

          parsedEvents.push({
            id: ev.id,
            title: ev.title,
            lat,
            lon,
            date: latestGeo.date,
            windKnots: knots,
            windKmh,
            distanceKm,
            severityInfo,
            link: ev.link || (ev.sources && ev.sources[0] ? ev.sources[0].url : 'https://eonet.gsfc.nasa.gov')
          });
        }

        // Sort by distance (closest to the user first)
        parsedEvents.sort((a, b) => {
          if (a.distanceKm === null) return 1;
          if (b.distanceKm === null) return -1;
          return a.distanceKm - b.distanceKm;
        });

        return {
          status: 'ok',
          events: parsedEvents
        };
      } catch (err) {
        console.warn('NASA EONET storms error:', err);
        return {
          status: 'unavailable',
          events: []
        };
      }
    }
  };

  window.Ajwaa.StormsApi = StormsApi;
})();
