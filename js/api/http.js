/**
 * Ajwaa (أجواء) - HTTP Client
 * Implements fetch with configurable timeout, exponential backoff, and retry handling.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Http = {
    async fetchWithTimeout(url, options = {}, timeoutMs = 18000, maxRetries = 3) {
      let attempt = 0;
      let lastError = null;

      while (attempt <= maxRetries) {
        attempt++;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const res = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(timer);

          // If successful
          if (res.ok) {
            const data = await res.json();
            return data;
          }

          // Transient errors: 429 or 5xx server errors
          const isTransient = res.status === 429 || (res.status >= 500 && res.status <= 599);
          if (!isTransient || attempt > maxRetries) {
            throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
          }

          lastError = new Error(`Server returned ${res.status}`);
        } catch (err) {
          clearTimeout(timer);
          lastError = err;

          // Non-transient errors (like JSON parsing failure or syntax errors) shouldn't be retried
          if (err instanceof SyntaxError) {
            throw err;
          }

          if (attempt > maxRetries) {
            throw err;
          }
        }

        // Exponential backoff: 350ms * attempt
        const delay = 350 * attempt;
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      throw lastError || new Error('Network request failed');
    }
  };

  window.Ajwaa.Http = Http;
})();
