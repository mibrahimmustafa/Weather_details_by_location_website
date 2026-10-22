/**
 * Ajwaa (أجواء) - Formatting & Live Clock Utilities
 * Local time calculations, timezone offsets, relative time, and Western digits.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Format = {
    // Calculates the true Date object for a target city given its UTC offset in seconds
    getCityDate(utcOffsetSeconds) {
      const now = new Date();
      if (utcOffsetSeconds === undefined || utcOffsetSeconds === null) {
        return now;
      }
      // Get current UTC time in ms
      const utcMs = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
      // Add city's UTC offset
      return new Date(utcMs + (utcOffsetSeconds * 1000));
    },

    // Formats live ticking clock as HH:MM:SS with padded zeros
    formatCityTime(utcOffsetSeconds) {
      const cityDate = this.getCityDate(utcOffsetSeconds);
      const hours = String(cityDate.getHours()).padStart(2, '0');
      const minutes = String(cityDate.getMinutes()).padStart(2, '0');
      const seconds = String(cityDate.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },

    // Formats short time for hourly slots (e.g. "14:00" or "02:00")
    formatHourTime(isoString, utcOffsetSeconds) {
      if (!isoString) return '--:--';
      // If ISO is "2026-10-22T14:00", we can extract the time part directly or parse
      const parts = isoString.split('T');
      if (parts.length > 1) {
        return parts[1].substring(0, 5);
      }
      const d = new Date(isoString);
      return `${String(d.getHours()).padStart(2, '0')}:00`;
    },

    // Formats localized day and date using Intl
    formatCityDate(utcOffsetSeconds, locale = 'ar') {
      const cityDate = this.getCityDate(utcOffsetSeconds);
      try {
        const langCode = locale === 'ar' ? 'ar' : 'en';
        const formatter = new Intl.DateTimeFormat(langCode, {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        });
        return formatter.format(cityDate);
      } catch {
        return cityDate.toDateString();
      }
    },

    // Formats timezone offset string: e.g. 10800 seconds -> "GMT+3"
    formatTzOffset(utcOffsetSeconds) {
      if (utcOffsetSeconds === undefined || utcOffsetSeconds === null) return 'GMT';
      const hours = utcOffsetSeconds / 3600;
      const sign = hours >= 0 ? '+' : '';
      return `GMT${sign}${hours}`;
    },

    // Relative elapsed time: e.g. "Updated 4m ago"
    formatTimeAgo(timestamp, locale = 'ar') {
      if (!timestamp) return '';
      const diffSec = Math.floor((Date.now() - timestamp) / 1000);
      const diffMin = Math.floor(diffSec / 60);

      if (diffMin < 1) {
        return window.Ajwaa.I18n.t('updatedJustNow');
      }
      return window.Ajwaa.I18n.t('updatedMinAgo', { m: diffMin });
    },

    // ISO Time to simple HH:MM string (e.g. sunrise "2026-10-22T06:12" -> "06:12")
    isoToHm(isoStr) {
      if (!isoStr) return '--:--';
      const parts = isoStr.split('T');
      if (parts.length > 1) {
        return parts[1].substring(0, 5);
      }
      return isoStr;
    }
  };

  window.Ajwaa.Format = Format;
})();
