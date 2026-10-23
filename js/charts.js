/**
 * Ajwaa (أجواء) - Charts & Visualizations
 * Handcrafted SVG sparklines, range bars, and solar trajectory arc.
 */

(function () {
  'use strict';

  window.Ajwaa = window.Ajwaa || {};

  const Charts = {
    // Generates an SVG Area Sparkline for 24-hour dust data
    renderDustAreaSvg(hourlyDustValues, width = 280, height = 64) {
      if (!Array.isArray(hourlyDustValues) || hourlyDustValues.length === 0) {
        return `<div class="chart-empty" style="height:${height}px;"></div>`;
      }

      // Take first 24 points
      const points = hourlyDustValues.slice(0, 24).map(v => Number(v) || 0);
      const minVal = 0;
      const maxVal = Math.max(...points, 60);

      const padding = 6;
      const usableW = width - padding * 2;
      const usableH = height - padding * 2;
      const stepX = usableW / (points.length - 1);

      // Coordinates
      const coords = points.map((val, idx) => {
        const x = padding + idx * stepX;
        const normalized = (val - minVal) / (maxVal - minVal);
        const y = height - padding - normalized * usableH;
        return { x, y };
      });

      // SVG Path
      const pathD = coords.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '');

      const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

      const id = 'dustGrad-' + Math.random().toString(36).substring(2, 7);

      return `
        <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="none" class="dust-sparkline">
          <defs>
            <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F2A65A" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#F2A65A" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <path d="${areaD}" fill="url(#${id})" />
          <path d="${pathD}" fill="none" stroke="#F2A65A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;
    },

    // Generates the Sun Path Arc SVG showing sunrise, sunset, and live sun position
    renderSunArcSvg(sunriseIso, sunsetIso, utcOffsetSeconds, width = 360, height = 140) {
      function isoToMinutesFromMidnight(isoStr) {
        if (!isoStr) return 0;
        const timePart = isoStr.includes('T') ? isoStr.split('T')[1] : isoStr;
        const [h, m] = timePart.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
      }

      // Default fallback
      let progress = 0.5; // 0 (sunrise) to 1 (sunset)
      let isDay = true;

      if (sunriseIso && sunsetIso) {
        const cityDate = window.Ajwaa.Format.getCityDate(utcOffsetSeconds);
        const nowMinutes = cityDate.getHours() * 60 + cityDate.getMinutes();
        const riseMinutes = isoToMinutesFromMidnight(sunriseIso);
        const setMinutes = isoToMinutesFromMidnight(sunsetIso);

        if (nowMinutes >= riseMinutes && nowMinutes <= setMinutes && setMinutes > riseMinutes) {
          progress = (nowMinutes - riseMinutes) / (setMinutes - riseMinutes);
          isDay = true;
        } else if (nowMinutes > setMinutes) {
          progress = 1;
          isDay = false;
        } else {
          progress = 0;
          isDay = false;
        }
      }

      // Parabolic Arc parameters
      const paddingX = 30;
      const baseY = height - 25;
      const apexY = 25;
      const startX = paddingX;
      const endX = width - paddingX;
      const spanX = endX - startX;

      // Arc path using quadratic bezier: M startX,baseY Q (width/2),(apexY - 10) endX,baseY
      const midX = width / 2;
      const controlY = apexY - 20;

      // Calculate sun position along bezier curve at t = progress
      // B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
      const t = progress;
      const sunX = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * midX + Math.pow(t, 2) * endX;
      const sunY = Math.pow(1 - t, 2) * baseY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * baseY;

      const markerColor = isDay ? '#F2A65A' : '#5AB8E8';

      return `
        <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" class="sun-arc-svg">
          <defs>
            <linearGradient id="arcStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#F2A65A" stop-opacity="0.3" />
              <stop offset="50%" stop-color="#FFD166" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#F08A5D" stop-opacity="0.3" />
            </linearGradient>
            <filter id="sunGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Horizon line -->
          <line x1="${paddingX - 10}" y1="${baseY}" x2="${endX + 10}" y2="${baseY}" stroke="rgba(255,255,255,0.15)" stroke-dasharray="4,4" stroke-width="1.5" />

          <!-- Dotted Background Arc -->
          <path d="M ${startX} ${baseY} Q ${midX} ${controlY} ${endX} ${baseY}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-dasharray="6,6" />

          <!-- Solid Gradient Arc -->
          <path d="M ${startX} ${baseY} Q ${midX} ${controlY} ${endX} ${baseY}" fill="none" stroke="url(#arcStrokeGrad)" stroke-width="3" stroke-linecap="round" />

          <!-- Sun Marker with pulsing glow -->
          <g transform="translate(${sunX}, ${sunY})">
            <circle cx="0" cy="0" r="14" fill="${markerColor}" opacity="0.25" />
            <circle cx="0" cy="0" r="9" fill="${markerColor}" filter="url(#sunGlowFilter)" />
            <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
          </g>
        </svg>
      `;
    }
  };

  window.Ajwaa.Charts = Charts;
})();
