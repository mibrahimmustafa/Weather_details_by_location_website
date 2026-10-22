/**
 * Ajwaa (أجواء) - State Store
 * Centralized reactive store with event subscription and persistent syncing.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  class Store {
    constructor() {
      const initialSettings = window.Ajwaa.Storage.getSettings();
      const initialCity = window.Ajwaa.Storage.getSelectedCity();
      const initialSavedCities = window.Ajwaa.Storage.getSavedCities();

      this.state = {
        settings: initialSettings,
        selectedCity: initialCity,
        savedCities: initialSavedCities,
        weatherData: null,
        loading: false,
        refreshing: false,
        error: null,
        isCached: false,
        activeSheet: null,
        explanationData: null
      };

      this.listeners = new Set();
    }

    getState() {
      return this.state;
    }

    setState(patch) {
      this.state = { ...this.state, ...patch };
      this.notify();
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    notify() {
      for (const listener of this.listeners) {
        try {
          listener(this.state);
        } catch (err) {
          console.error('Store listener error:', err);
        }
      }
    }

    // Actions
    setLanguage(localeCode) {
      const settings = { ...this.state.settings, localeCode };
      window.Ajwaa.Storage.saveSettings(settings);
      window.Ajwaa.I18n.setLanguage(localeCode);
      this.setState({ settings });
    }

    setTheme(themeMode) {
      const settings = { ...this.state.settings, themeMode };
      window.Ajwaa.Storage.saveSettings(settings);
      this.applyTheme(themeMode);
      this.setState({ settings });
    }

    applyTheme(themeMode) {
      const root = document.documentElement;
      if (themeMode === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', themeMode);
      }
    }

    setUnits(unitSystem) {
      const settings = { ...this.state.settings, unitSystem };
      window.Ajwaa.Storage.saveSettings(settings);
      this.setState({ settings });
    }

    selectCity(city) {
      window.Ajwaa.Storage.setSelectedCity(city);
      this.setState({ selectedCity: city, activeSheet: null });
      window.Ajwaa.AppCoordinator.loadWeatherForSelectedCity();
    }

    saveCity(city) {
      const exists = this.state.savedCities.some(c => c.id === city.id || (Math.abs(c.lat - city.lat) < 0.05 && Math.abs(c.lon - city.lon) < 0.05));
      if (!exists) {
        const updated = [...this.state.savedCities, city];
        window.Ajwaa.Storage.saveCities(updated);
        this.setState({ savedCities: updated });
        window.Ajwaa.Toast.show(window.Ajwaa.I18n.t('cityAddedToast', { city: city.name }));
      }
    }

    removeCity(cityId) {
      const target = this.state.savedCities.find(c => c.id === cityId);
      const updated = this.state.savedCities.filter(c => c.id !== cityId);
      window.Ajwaa.Storage.saveCities(updated);
      this.setState({ savedCities: updated });
      if (target) {
        window.Ajwaa.Toast.show(window.Ajwaa.I18n.t('cityRemovedToast', { city: target.name }));
      }
    }

    openSheet(sheetName, explanationData = null) {
      this.setState({ activeSheet: sheetName, explanationData });
    }

    closeSheet() {
      this.setState({ activeSheet: null, explanationData: null });
    }
  }

  window.Ajwaa.store = new Store();
})();
