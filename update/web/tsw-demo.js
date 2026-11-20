/* Podgląd pulpitu bez gry: ?demo=1 podmienia /api/ekranik/tsw na symulowaną jazdę (Kornwestheim → Ludwigsburg).
   Tylko do oglądania wyglądu — nic nie wysyła do portalu. */
(function () {
  if (!/[?&]demo=1/.test(location.search)) return;
  window.TSW_DEMO = true;   // dziennik lektora pomija jazdę pokazową
  const t0 = Date.now(), real = window.fetch.bind(window);
  const A = [48.8622, 9.1840], B = [48.8925, 9.1855];
  const stops = [{ station: 'Stuttgart-Zuffenhausen', arr: '2026-11-18T08:02:10Z', dep: '2026-11-18T08:03:05Z', durS: 55, km: 1.2 },
    { station: 'Kornwestheim Personenbahnhof', arr: '2026-11-18T08:07:40Z', dep: '2026-11-18T08:08:30Z', durS: 50, km: 4.9 }];
  function frame() {
    const s = (Date.now() - t0) / 1000, cyc = s % 120;
    const v = cyc < 50 ? Math.min(118, cyc * 2.8) : cyc < 80 ? 118 - (cyc - 50) * 1.2 : Math.max(0, 82 - (cyc - 80) * 2.4);
    const f = (s % 600) / 600, lat = A[0] + (B[0] - A[0]) * f, lon = A[1] + (B[1] - A[1]) * f;
    const sig = 1800 - (s * 25) % 1800, lim = cyc < 70 ? 120 : 80;
    const track = []; for (let d = 0; d <= 4000; d += 200) track.push({ d, h: 288 + Math.sin((d + s * 30) / 900) * 6 + d / 400, tunnel: d > 2400 && d < 3000 });
    const gt = new Date(Date.UTC(2026, 10, 18, 8, 12, 0) + s * 1000).toISOString();
    return { running: true, at: Date.now(), speed: v, limit: lim, service: '1T42 · RB 17a Stuttgart Hbf → Bietigheim-Bissingen', formation: 4,
      nextLimits: [{ kmh: 80, dist: 950 - (s * 20) % 900, type: 'TrackPropertySpeedLimit' }],
      nextLimitsAll: [{ kmh: 80, dist: 950 - (s * 20) % 900, type: 'TemporarySpeedLimit' }, { kmh: 140, dist: 2600 - (s * 20) % 900, type: 'TrackPropertySpeedLimit' }, { kmh: 100, dist: 3500, type: 'SignalSpeedLimit' }], limitSource: 'TrackSpeedLimit',
      signal: { aspect: sig < 600 ? 'Approach' : 'Clear', dist: sig, permissive: true }, signals: [{ aspect: sig < 600 ? 'Approach' : 'Clear', dist: sig }],
      signalsAll: [{ aspect: sig < 600 ? 'Approach' : 'Clear', dist: sig }, { aspect: 'Stop', dist: sig + 1500 }, { aspect: 'Clear', dist: sig + 2900 }],
      power: cyc < 50 ? 0.85 : 0, powerNegative: false, trainBrake: cyc > 80 ? 0.35 : 0, eBrake: 0, direction: 1,
      brakeBar: [cyc > 80 ? 1.8 : 0, 5, 9.6, 0], accel: cyc < 50 ? 0.62 : cyc > 80 ? -0.66 : -0.02,
      tractiveKN: cyc < 50 ? 182 - cyc : 0, brakeKN: cyc > 80 ? 140 : 0, amps: cyc < 50 ? 640 : 0, slipping: false, alerter: 0,
      cruise: { active: false }, geo: { latitude: lat, longitude: lon }, gameTime: gt, sunrise: 'T07:21:00', sunset: 'T16:41:00',
      weather: { temp: 6, rain: 0.2, fog: 0, snow: 0 }, trip: { km: 7.4 + s / 60, vmax: 121, driveS: 640 + s, overspeeds: 1, overspeedS: 4 },
      track, stops };
  }
  // tylko dane pociągu (nie /stations, /say itd.)
  window.fetch = (u, o) => (/^\/api\/ekranik\/tsw(\?|$)/.test(String(u))
    ? Promise.resolve(new Response(JSON.stringify(frame()), { headers: { 'Content-Type': 'application/json' } })) : real(u, o));
})();
