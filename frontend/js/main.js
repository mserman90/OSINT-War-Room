import { initLayout, initModals, initClock, initWebcams } from './ui.js';
import { initMap, initTrafficLayers, initNukeSimulator, initCyberPanel, initThreatMeter, initBodyCount, initRadio } from './map.js';
import { initDataPolling } from './api.js';
import { applyTranslations, setLang, getLang } from './i18n.js';

// ── Theme Manager ──────────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('osint_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    // Top-bar toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            window._sfx?.click();
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('osint_theme', next);
            updateThemeIcon(next);
            // Sync global settings dropdown
            const sel = document.getElementById('global-theme-select');
            if (sel) sel.value = next;
        });
    }

    // Global settings dropdown
    const themeSel = document.getElementById('global-theme-select');
    if (themeSel) {
        themeSel.value = saved;
        themeSel.addEventListener('change', () => {
            const val = themeSel.value;
            document.documentElement.setAttribute('data-theme', val);
            localStorage.setItem('osint_theme', val);
            updateThemeIcon(val);
        });
    }
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

// ── Language Manager ───────────────────────────────────────────────
function initLang() {
    const saved = getLang();
    updateLangLabel(saved);

    // Top-bar toggle button
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            window._sfx?.click();
            const current = getLang();
            const next = current === 'en' ? 'tr' : 'en';
            setLang(next);
            updateLangLabel(next);
            // Sync global settings dropdown
            const sel = document.getElementById('global-lang-select');
            if (sel) sel.value = next;
        });
    }

    // Global settings dropdown
    const langSel = document.getElementById('global-lang-select');
    if (langSel) {
        langSel.value = saved;
        langSel.addEventListener('change', () => {
            const val = langSel.value;
            setLang(val);
            updateLangLabel(val);
        });
    }

    // Apply saved language on load
    applyTranslations();
}

function updateLangLabel(lang) {
    const label = document.getElementById('lang-label');
    if (label) label.textContent = lang.toUpperCase();
}

// ── Boot ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    console.log("OSINT DASHBOARD // INITIALIZING...");

    initLayout();
    initModals();
    initClock();
    initWebcams();
    const map = initMap();
    initTrafficLayers(map);
    initNukeSimulator(map);
    initCyberPanel(map);
    initThreatMeter();
    initBodyCount();
    initRadio();
    initDataPolling();

    // Theme & Language
    initTheme();
    initLang();

    console.log("OSINT DASHBOARD // SYSTEM READY");
});
