(function () {
  'use strict';

  const KEYS = {
    sessions: 'cindyWorkout.sessions.v1',
    settings: 'cindyWorkout.settings.v1',
  };

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function getSessions() {
    const sessions = read(KEYS.sessions, []);
    return Array.isArray(sessions) ? sessions : [];
  }

  function saveSession(session) {
    const sessions = getSessions();
    if (sessions.some(item => item.id === session.id)) return false;
    sessions.push(session);
    return write(KEYS.sessions, sessions.slice(-250));
  }

  function getSettings() {
    return read(KEYS.settings, {});
  }

  function saveSettings(settings) {
    return write(KEYS.settings, { ...getSettings(), ...settings });
  }

  function positiveInteger(value, fallback) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 && number <= 999 ? number : fallback;
  }

  function sanitizeRecipe(recipe) {
    if (!recipe || typeof recipe !== 'object') return null;
    const sanitized = {
      pullups: positiveInteger(recipe.pullups, 0),
      pushups: positiveInteger(recipe.pushups, 0),
      squats: positiveInteger(recipe.squats, 0),
    };
    return Object.values(sanitized).every(Boolean) ? sanitized : null;
  }

  function sanitizeSession(session, index) {
    if (!session || typeof session !== 'object') return null;
    const completedAt = new Date(session.completedAt);
    const rounds = Number(session.rounds);
    const recipe = sanitizeRecipe(session.recipe);
    if (Number.isNaN(completedAt.getTime()) || !Number.isInteger(rounds) || rounds < 0 || rounds > 10000 || !recipe) return null;

    const startedAt = session.startedAt && !Number.isNaN(new Date(session.startedAt).getTime())
      ? new Date(session.startedAt).toISOString()
      : null;
    const roundLog = Array.isArray(session.roundLog) ? session.roundLog.slice(0, rounds).map(item => ({
      time: typeof item?.time === 'string' ? item.time.slice(0, 8) : '',
      round: Number.isInteger(Number(item?.round)) ? Number(item.round) : 0,
      source: item?.source === 'voice' ? 'voice' : 'manual',
    })) : [];
    const completedIso = completedAt.toISOString();

    return {
      id: typeof session.id === 'string' && session.id.length <= 160
        ? session.id
        : `import-${completedIso}-${index}`,
      startedAt,
      completedAt: completedIso,
      durationSeconds: Number.isFinite(Number(session.durationSeconds))
        ? Math.max(0, Math.round(Number(session.durationSeconds)))
        : 1200,
      rounds,
      recipe,
      totalReps: rounds * (recipe.pullups + recipe.pushups + recipe.squats),
      roundLog,
    };
  }

  function sanitizeSettings(settings) {
    if (!settings || typeof settings !== 'object') return {};
    const sanitized = {};
    const recipe = sanitizeRecipe(settings.recipe);
    const volume = Number(settings.volume);
    if (recipe) sanitized.recipe = recipe;
    if (Number.isFinite(volume) && volume >= 0 && volume <= 1) sanitized.volume = volume;
    if (settings.language === 'en-US' || settings.language === 'it-IT') sanitized.language = settings.language;
    return sanitized;
  }

  function importData(payload) {
    if (!payload || typeof payload !== 'object') throw new TypeError('The JSON root must be an object.');
    const incoming = Array.isArray(payload) ? payload : payload.sessions;
    if (!Array.isArray(incoming)) throw new TypeError('The JSON must contain a sessions array.');
    if (incoming.length > 2500) throw new TypeError('The file contains too many sessions.');

    const sanitized = incoming.map(sanitizeSession).filter(Boolean);
    if (incoming.length && !sanitized.length) throw new TypeError('No valid Cindy Workout sessions were found.');

    const existing = getSessions();
    const knownIds = new Set(existing.map(session => session.id));
    const unique = sanitized.filter(session => {
      if (knownIds.has(session.id)) return false;
      knownIds.add(session.id);
      return true;
    });
    const merged = [...existing, ...unique]
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
      .slice(-250);

    if (!write(KEYS.sessions, merged)) throw new Error('The browser could not save the imported data.');
    const settings = sanitizeSettings(Array.isArray(payload) ? null : payload.settings);
    const settingsImported = Object.keys(settings).length > 0;
    if (settingsImported) saveSettings(settings);

    return {
      imported: unique.length,
      duplicates: sanitized.length - unique.length,
      invalid: incoming.length - sanitized.length,
      total: merged.length,
      settingsImported,
    };
  }

  function clearSessions() {
    try {
      localStorage.removeItem(KEYS.sessions);
      return true;
    } catch {
      return false;
    }
  }

  function clearAll() {
    try {
      Object.values(KEYS).forEach(key => localStorage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  }

  function exportData() {
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      sessions: getSessions(),
      settings: getSettings(),
    };
  }

  window.CindyStore = {
    KEYS,
    getSessions,
    saveSession,
    getSettings,
    saveSettings,
    clearSessions,
    clearAll,
    exportData,
    importData,
  };
}());
