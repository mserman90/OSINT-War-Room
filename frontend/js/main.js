import { initLayout, initModals, initClock, initWebcams } from './ui.js';
import { initMap, initTrafficLayers, initNukeSimulator, initCyberPanel, initThreatMeter, initBodyCount, initRadio } from './map.js';
import { initDataPolling } from './api.js';

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

    console.log("OSINT DASHBOARD // SYSTEM READY");
});