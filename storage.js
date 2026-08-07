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
  };
}());
