/**
 * Ajwaa (أجواء) - Units Domain Logic
 * Handles conversion and display formatting between Metric and Imperial systems.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Units = {
    // Temperature
    cToF(c) {
      if (c === null || c === undefined || isNaN(c)) return null;
      return (c * 9) / 5 + 32;
    },

    fToC(f) {
      if (f === null || f === undefined || isNaN(f)) return null;
      return ((f - 32) * 5) / 9;
    },

    formatTemp(celsius, unitSystem = 'metric') {
      if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
      const val = unitSystem === 'imperial' ? this.cToF(celsius) : celsius;
      return Math.round(val);
    },

    getTempUnit(unitSystem = 'metric') {
      return unitSystem === 'imperial' ? '°F' : '°C';
    },

    // Wind Speed: km/h ⇄ mph
    kmhToMph(kmh) {
      if (kmh === null || kmh === undefined || isNaN(kmh)) return null;
      return kmh * 0.621371;
    },

    formatWind(kmh, unitSystem = 'metric', lang = 'ar') {
      if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
      const isImp = unitSystem === 'imperial';
      const val = isImp ? this.kmhToMph(kmh) : kmh;
      const unit = isImp ? (lang === 'ar' ? 'ميل/س' : 'mph') : (lang === 'ar' ? 'كم/س' : 'km/h');
      return `${Math.round(val)} ${unit}`;
    },

    // Precipitation: mm ⇄ inches
    mmToInches(mm) {
      if (mm === null || mm === undefined || isNaN(mm)) return null;
      return mm * 0.0393701;
    },

    formatPrecip(mm, unitSystem = 'metric', lang = 'ar') {
      if (mm === null || mm === undefined || isNaN(mm)) return '--';
      const isImp = unitSystem === 'imperial';
      const val = isImp ? this.mmToInches(mm) : mm;
      const unit = isImp ? (lang === 'ar' ? 'بوصة' : 'in') : (lang === 'ar' ? 'ملم' : 'mm');
      return `${val.toFixed(1)} ${unit}`;
    },

    // Distance: km ⇄ miles
    kmToMiles(km) {
      if (km === null || km === undefined || isNaN(km)) return null;
      return km * 0.621371;
    },

    formatDistance(km, unitSystem = 'metric', lang = 'ar') {
      if (km === null || km === undefined || isNaN(km)) return '--';
      const isImp = unitSystem === 'imperial';
      const val = isImp ? this.kmToMiles(km) : km;
      const unit = isImp ? (lang === 'ar' ? 'ميل' : 'mi') : (lang === 'ar' ? 'كم' : 'km');
      return `${Math.round(val)} ${unit}`;
    },

    // Atmospheric Pressure: hPa ⇄ inHg
    hpaToInHg(hpa) {
      if (hpa === null || hpa === undefined || isNaN(hpa)) return null;
      return hpa * 0.02953;
    },

    formatPressure(hpa, unitSystem = 'metric', lang = 'ar') {
      if (hpa === null || hpa === undefined || isNaN(hpa)) return '--';
      const isImp = unitSystem === 'imperial';
      const val = isImp ? this.hpaToInHg(hpa) : hpa;
      const unit = isImp ? (lang === 'ar' ? 'بوصة زئبق' : 'inHg') : (lang === 'ar' ? 'هـ.با' : 'hPa');
      return `${isImp ? val.toFixed(2) : Math.round(val)} ${unit}`;
    },

    // Dew point via Magnus approximation
    calcDewPoint(tempC, humidityRel) {
      if (tempC === null || humidityRel === null) return null;
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidityRel / 100);
      return (b * alpha) / (a - alpha);
    }
  };

  window.Ajwaa.Units = Units;
})();
