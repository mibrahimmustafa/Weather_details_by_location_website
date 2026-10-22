/**
 * Ajwaa (أجواء) - Storage & Cache Manager
 * Robust localStorage wrapper with cache validation, corrupt data fallback, and FIFO pruning.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Storage = {
    KEYS: {
      settings: 'ajwaa.settings.v1',
      cities: 'ajwaa.cities.v1',
      selectedCity: 'ajwaa.selectedCity.v1',
      onboardingSeen: 'ajwaa.onboardingSeen.v1',
      weatherPrefix: 'ajwaa.weather.v1.'
    },

    // Default settings fallback
    getDefaultSettings() {
      const browserLang = (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
      return {
        localeCode: browserLang,
        unitSystem: 'metric',
        themeMode: 'system',
        hasSeenWelcome: false
      };
    },

    getSettings() {
      try {
        const raw = localStorage.getItem(this.KEYS.settings);
        if (!raw) return this.getDefaultSettings();
        const parsed = JSON.parse(raw);
        return {
          localeCode: parsed.localeCode || 'ar',
          unitSystem: parsed.unitSystem || 'metric',
          themeMode: parsed.themeMode || 'system',
          hasSeenWelcome: Boolean(parsed.hasSeenWelcome)
        };
      } catch (err) {
        console.warn('Corrupt settings in localStorage, returning defaults:', err);
        return this.getDefaultSettings();
      }
    },

    saveSettings(settings) {
      try {
        localStorage.setItem(this.KEYS.settings, JSON.stringify(settings));
      } catch (err) {
        console.warn('Failed saving settings to localStorage:', err);
      }
    },

    // Saved Cities
    getSavedCities() {
      try {
        const raw = localStorage.getItem(this.KEYS.cities);
        if (!raw) {
          // Default initial saved city is Cairo
          return [window.Ajwaa.Config.defaultCity];
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.cities) && parsed.cities.length > 0) {
          return parsed.cities;
        }
        return [window.Ajwaa.Config.defaultCity];
      } catch (err) {
        console.warn('Corrupt cities in localStorage, using default:', err);
        return [window.Ajwaa.Config.defaultCity];
      }
    },

    saveCities(citiesList) {
      try {
        localStorage.setItem(this.KEYS.cities, JSON.stringify({ cities: citiesList }));
      } catch (err) {
        console.warn('Failed saving cities to localStorage:', err);
      }
    },

    // Selected City
    getSelectedCity() {
      try {
        const raw = localStorage.getItem(this.KEYS.selectedCity);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.lat && parsed.lon) return parsed;
        }
      } catch (err) {
        console.warn('Corrupt selected city, falling back:', err);
      }
      return window.Ajwaa.Config.defaultCity;
    },

    setSelectedCity(city) {
      try {
        localStorage.setItem(this.KEYS.selectedCity, JSON.stringify(city));
      } catch (err) {
        console.warn('Failed saving selected city:', err);
      }
    },

    // Onboarding status
    hasSeenOnboarding() {
      try {
        return localStorage.getItem(this.KEYS.onboardingSeen) === 'true';
      } catch {
        return false;
      }
    },

    setOnboardingSeen() {
      try {
        localStorage.setItem(this.KEYS.onboardingSeen, 'true');
      } catch (err) {
        console.warn('Failed saving onboarding flag:', err);
      }
    },

    // Weather Cache (10-minute TTL, 5km distance threshold, max 8 cities retained)
    getCachedWeather(cityId, currentLat, currentLon) {
      try {
        const key = `${this.KEYS.weatherPrefix}${cityId}`;
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const entry = JSON.parse(raw);
        if (!entry || !entry.fetchedAt) return null;

        // Check age (10 minutes)
        const age = Date.now() - entry.fetchedAt;
        const isExpired = age > window.Ajwaa.Config.cache.ttlMs;

        // Check distance if coordinates are given
        let movedTooFar = false;
        if (currentLat !== undefined && currentLon !== undefined && entry.latitude && entry.longitude) {
          const dist = window.Ajwaa.Geo.haversineDistance(currentLat, currentLon, entry.latitude, entry.longitude);
          if (dist !== null && dist > window.Ajwaa.Config.cache.distanceThresholdKm) {
            movedTooFar = true;
          }
        }

        return {
          ...entry,
          isFresh: !isExpired && !movedTooFar,
          isExpired: isExpired || movedTooFar
        };
      } catch (err) {
        console.warn('Error reading weather cache:', err);
        return null;
      }
    },

    saveWeatherCache(cityId, lat, lon, forecastRaw, airRaw, stormsRaw) {
      try {
        const key = `${this.KEYS.weatherPrefix}${cityId}`;
        const entry = {
          cityId,
          fetchedAt: Date.now(),
          latitude: lat,
          longitude: lon,
          forecast: forecastRaw,
          air: airRaw,
          storms: stormsRaw
        };

        localStorage.setItem(key, JSON.stringify(entry));
        this.pruneWeatherCache();
      } catch (err) {
        console.warn('Failed saving weather cache:', err);
      }
    },

    // Keep only last 8 cities in weather cache
    pruneWeatherCache() {
      try {
        const weatherEntries = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(this.KEYS.weatherPrefix)) {
            try {
              const val = JSON.parse(localStorage.getItem(k));
              weatherEntries.push({ key: k, fetchedAt: val.fetchedAt || 0 });
            } catch {
              localStorage.removeItem(k);
            }
          }
        }

        if (weatherEntries.length > 8) {
          weatherEntries.sort((a, b) => a.fetchedAt - b.fetchedAt);
          // Delete oldest
          const toDelete = weatherEntries.slice(0, weatherEntries.length - 8);
          toDelete.forEach(item => localStorage.removeItem(item.key));
        }
      } catch (err) {
        console.warn('Error pruning cache:', err);
      }
    }
  };

  window.Ajwaa.Storage = Storage;
})();
