// ── i18n — Lightweight Internationalization Module ──────────────────
const translations = {
    en: {
        // Top bar
        "war_room": "WAR ROOM",
        "subtitle": "- Global Osint Monitoring",
        "global": "Global",
        "middle_east": "Middle East",
        "ukraine": "Ukraine",
        "taiwan": "Taiwan",
        "live": "LIVE",
        "defcon": "DEFCON",
        "peace": "PEACE",
        "pizza_index": "🍕 PIZZA INDEX",
        "donate": "💎 DONATE",
        "fullscreen": "Fullscreen",
        "loading_headlines": "Loading headlines...",

        // Sidebar tooltips
        "air_traffic": "Air Traffic (ADS-B)",
        "maritime": "Maritime Traffic (AIS)",
        "cyber": "Live Cyberattacks",
        "nuke_sim": "Nuclear Detonation Simulator",
        "toggle_legend": "Toggle Legend",
        "live_maps": "Live Interactive Maps",
        "maximize_bottom": "Maximize Bottom Panel",
        "maximize_map": "Maximize Map",
        "reset_layout": "Reset Layout",
        "settings": "Settings",

        // Map overlay
        "loading_intel": "Loading Intel Layers",
        "initializing": "Initializing...",

        // Legend
        "legend": "LEGEND",
        "tactical": "TACTICAL",
        "nuclear_site": "Nuclear Site",
        "air_base": "Air Base",
        "naval_port": "Naval / Port",
        "military_hq": "Military HQ",
        "government": "Government",
        "live_intel": "LIVE INTEL",
        "air_raid_alarm": "Air Raid Alarm",
        "strike_explosion": "Strike / Explosion",
        "missile_attack": "Missile Attack",
        "osm_military_base": "OSM Military Base",

        // Panel headers
        "live_news": "LIVE",
        "news_blink": "NEWS",
        "filter_feed": "Filter feed...",
        "feed_settings": "Feed Settings",
        "live_webcam_feeds": "LIVE WEBCAM FEEDS",
        "webcam_settings": "Webcam Settings",
        "live_markets": "MARKETS",
        "market_settings": "Market Settings",
        "space": "Space",

        // VIX
        "vix_fear_gauge": "⚠️ VIX / FEAR GAUGE",
        "extreme_fear": "EXTREME FEAR",
        "fear": "FEAR",
        "normal": "NORMAL",
        "cboe_index": "CBOE Volatility Index",

        // Nuke panel
        "nuke_sim_title": "☢ Nuke Sim",
        "click_to_detonate": "Click anywhere on the map to detonate",
        "clear_detonations": "Clear All Detonations",

        // Cyber panel
        "cyber_intel": "🛡 Cyber Intel",
        "all": "All",
        "ddos": "DDoS",
        "malware": "Malware",
        "exploit": "Exploit",
        "source_cisa": "Source: CISA KEV",

        // News settings modal
        "feed_settings_title": "FEED SETTINGS",
        "feed_control": "Feed Control:",
        "pause_updates": "Pause Updates",
        "refresh_rate": "Refresh Rate:",
        "seconds_5": "5 Seconds",
        "seconds_10": "10 Seconds",
        "seconds_30": "30 Seconds",
        "seconds_60": "60 Seconds",
        "tracked_accounts": "Tracked Accounts:",
        "tracked_hashtags": "Tracked Hashtags:",

        // Market settings modal
        "market_settings_title": "MARKET SETTINGS",
        "display_format": "Display Format:",
        "percentage": "Percentage (%)",
        "mini_graph": "Mini Graph",
        "visible_modules": "Visible Modules:",
        "stock_market": "Stock Market",
        "pizza_tracker": "Pizza Tracker",
        "polymarket_label": "Polymarket",
        "base_currency": "Base Currency:",

        // Webcam settings modal
        "webcam_settings_title": "WEBCAM SETTINGS",
        "manage_feeds": "Manage Feeds (YouTube URLs):",
        "grid_layout": "Grid Layout:",
        "auto_fit": "Auto Fit (Default)",
        "single_view": "1x1 Single View",
        "grid_2x2": "2x2 Grid",
        "grid_3x3": "3x3 Grid",
        "new_category": "+ New...",

        // Marker modal
        "add_tactical_marker": "ADD TACTICAL MARKER",
        "title_tag": "Title / Tag:",
        "color": "Color:",
        "icon": "Icon:",
        "red": "Red",
        "blue": "Blue",
        "yellow": "Yellow",
        "green": "Green",
        "target": "Target",
        "alert": "Alert",
        "base": "Base",
        "place_marker": "PLACE MARKER",

        // Global settings modal
        "global_settings_title": "GLOBAL TERMINAL SETTINGS",
        "default_region": "Default Region:",
        "data_polling_rate": "Data Polling Rate:",
        "terminal_theme": "Terminal Theme:",
        "dark_mode": "Dark Mode",
        "tactical_red": "Tactical Red",
        "api_keys": "API Keys (Local Storage):",
        "bearer_token": "X.com Bearer Token (Optional)",
        "news_api_key": "News API Key (Optional)",
        "language": "Language:",

        // Pizza modal
        "pentagon_pizza": "🍕 PENTAGON PIZZA INDEX",
        "loading": "Loading...",
        "order_volume": "ORDER VOLUME",

        // Donate modal
        "support_mission": "💎 SUPPORT THE MISSION",

        // Live maps modal
        "live_regional_maps": "LIVE REGIONAL MAPS",

        // Radio widget
        "radio_intercept": "📻 RADIO INTERCEPT",
        "centcom": "CENTCOM — Middle East",
        "nato_ops": "NATO OPS — Eastern Flank",
        "pacific_cmd": "PACIFIC CMD — Taiwan Strait",
        "kyiv_ctrl": "KYIV CTRL — Ukraine Front",
        "norad": "NORAD — Northern Warning",
        "tune": "▶ TUNE",
        "standby": "STANDBY...",

        // Nuke weapons
        "little_boy": "Little Boy — 15 kt (Hiroshima)",
        "fat_man": "Fat Man — 21 kt (Nagasaki)",
        "w76": "W76 — 100 kt (Trident SLBM)",
        "b61": "B61 — 340 kt (NATO)",
        "w88": "W88 — 475 kt (Trident SLBM)",
        "sarmat": "RS-28 Sarmat — 800 kt",
        "tsar_bomba": "Tsar Bomba — 50 Mt",

        // Theme
        "theme": "Theme:",
        "dark_theme": "Dark",
        "light_theme": "Light",

        // Market table headers
        "symbol": "SYMBOL",
        "price": "PRICE",
        "chg": "CHG",
    },
    tr: {
        // Top bar
        "war_room": "SAVAŞ ODASI",
        "subtitle": "- Küresel Osint İzleme",
        "global": "Küresel",
        "middle_east": "Orta Doğu",
        "ukraine": "Ukrayna",
        "taiwan": "Tayvan",
        "live": "CANLI",
        "defcon": "DEFCON",
        "peace": "BARIŞ",
        "pizza_index": "🍕 PİZZA ENDEKSİ",
        "donate": "💎 BAĞIŞ",
        "fullscreen": "Tam Ekran",
        "loading_headlines": "Başlıklar yükleniyor...",

        // Sidebar tooltips
        "air_traffic": "Hava Trafiği (ADS-B)",
        "maritime": "Deniz Trafiği (AIS)",
        "cyber": "Canlı Siber Saldırılar",
        "nuke_sim": "Nükleer Patlama Simülatörü",
        "toggle_legend": "Lejant Aç/Kapa",
        "live_maps": "Canlı Etkileşimli Haritalar",
        "maximize_bottom": "Alt Paneli Büyüt",
        "maximize_map": "Haritayı Büyüt",
        "reset_layout": "Düzeni Sıfırla",
        "settings": "Ayarlar",

        // Map overlay
        "loading_intel": "İstihbarat Katmanları Yükleniyor",
        "initializing": "Başlatılıyor...",

        // Legend
        "legend": "LEJANT",
        "tactical": "TAKTİK",
        "nuclear_site": "Nükleer Tesis",
        "air_base": "Hava Üssü",
        "naval_port": "Deniz / Liman",
        "military_hq": "Askeri Karargah",
        "government": "Hükümet",
        "live_intel": "CANLI İSTİHBARAT",
        "air_raid_alarm": "Hava Saldırısı Alarmı",
        "strike_explosion": "Saldırı / Patlama",
        "missile_attack": "Füze Saldırısı",
        "osm_military_base": "OSM Askeri Üs",

        // Panel headers
        "live_news": "CANLI",
        "news_blink": "HABER",
        "filter_feed": "Beslemeyi filtrele...",
        "feed_settings": "Besleme Ayarları",
        "live_webcam_feeds": "CANLI WEBCAM AKIŞLARI",
        "webcam_settings": "Webcam Ayarları",
        "live_markets": "PİYASALAR",
        "market_settings": "Piyasa Ayarları",
        "space": "Uzay",

        // VIX
        "vix_fear_gauge": "⚠️ VIX / KORKU GÖSTERGESİ",
        "extreme_fear": "AŞIRI KORKU",
        "fear": "KORKU",
        "normal": "NORMAL",
        "cboe_index": "CBOE Oynaklık Endeksi",

        // Nuke panel
        "nuke_sim_title": "☢ Nükleer Sim",
        "click_to_detonate": "Patlatmak için haritada herhangi bir yere tıklayın",
        "clear_detonations": "Tüm Patlamaları Temizle",

        // Cyber panel
        "cyber_intel": "🛡 Siber İstihbarat",
        "all": "Tümü",
        "ddos": "DDoS",
        "malware": "Zararlı Yazılım",
        "exploit": "Exploit",
        "source_cisa": "Kaynak: CISA KEV",

        // News settings modal
        "feed_settings_title": "BESLEME AYARLARI",
        "feed_control": "Besleme Kontrolü:",
        "pause_updates": "Güncellemeleri Duraklat",
        "refresh_rate": "Yenileme Hızı:",
        "seconds_5": "5 Saniye",
        "seconds_10": "10 Saniye",
        "seconds_30": "30 Saniye",
        "seconds_60": "60 Saniye",
        "tracked_accounts": "İzlenen Hesaplar:",
        "tracked_hashtags": "İzlenen Hashtagler:",

        // Market settings modal
        "market_settings_title": "PİYASA AYARLARI",
        "display_format": "Görüntüleme Formatı:",
        "percentage": "Yüzde (%)",
        "mini_graph": "Mini Grafik",
        "visible_modules": "Görünür Modüller:",
        "stock_market": "Borsa",
        "pizza_tracker": "Pizza Takipçisi",
        "polymarket_label": "Polymarket",
        "base_currency": "Ana Para Birimi:",

        // Webcam settings modal
        "webcam_settings_title": "WEBCAM AYARLARI",
        "manage_feeds": "Akışları Yönet (YouTube URL):",
        "grid_layout": "Izgara Düzeni:",
        "auto_fit": "Otomatik Sığdır (Varsayılan)",
        "single_view": "1x1 Tekli Görünüm",
        "grid_2x2": "2x2 Izgara",
        "grid_3x3": "3x3 Izgara",
        "new_category": "+ Yeni...",

        // Marker modal
        "add_tactical_marker": "TAKTİK İŞARETÇİ EKLE",
        "title_tag": "Başlık / Etiket:",
        "color": "Renk:",
        "icon": "İkon:",
        "red": "Kırmızı",
        "blue": "Mavi",
        "yellow": "Sarı",
        "green": "Yeşil",
        "target": "Hedef",
        "alert": "Uyarı",
        "base": "Üs",
        "place_marker": "İŞARETÇİ YERLEŞTİR",

        // Global settings modal
        "global_settings_title": "GENEL TERMİNAL AYARLARI",
        "default_region": "Varsayılan Bölge:",
        "data_polling_rate": "Veri Sorgulama Hızı:",
        "terminal_theme": "Terminal Teması:",
        "dark_mode": "Koyu Mod",
        "tactical_red": "Taktik Kırmızı",
        "api_keys": "API Anahtarları (Yerel Depolama):",
        "bearer_token": "X.com Taşıyıcı Token (İsteğe Bağlı)",
        "news_api_key": "Haber API Anahtarı (İsteğe Bağlı)",
        "language": "Dil:",

        // Pizza modal
        "pentagon_pizza": "🍕 PENTAGON PİZZA ENDEKSİ",
        "loading": "Yükleniyor...",
        "order_volume": "SİPARİŞ HACMİ",

        // Donate modal
        "support_mission": "💎 GÖREVİ DESTEKLE",

        // Live maps modal
        "live_regional_maps": "CANLI BÖLGE HARİTALARI",

        // Radio widget
        "radio_intercept": "📻 TELSİZ DİNLEME",
        "centcom": "CENTCOM — Orta Doğu",
        "nato_ops": "NATO OPS — Doğu Kanadı",
        "pacific_cmd": "PASİFİK KMT — Tayvan Boğazı",
        "kyiv_ctrl": "KİEV KNT — Ukrayna Cephesi",
        "norad": "NORAD — Kuzey Uyarı",
        "tune": "▶ AYARLA",
        "standby": "BEKLEMEDE...",

        // Nuke weapons
        "little_boy": "Little Boy — 15 kt (Hiroşima)",
        "fat_man": "Fat Man — 21 kt (Nagazaki)",
        "w76": "W76 — 100 kt (Trident SLBM)",
        "b61": "B61 — 340 kt (NATO)",
        "w88": "W88 — 475 kt (Trident SLBM)",
        "sarmat": "RS-28 Sarmat — 800 kt",
        "tsar_bomba": "Çar Bombası — 50 Mt",

        // Theme
        "theme": "Tema:",
        "dark_theme": "Koyu",
        "light_theme": "Açık",

        // Market table headers
        "symbol": "SEMBOL",
        "price": "FİYAT",
        "chg": "DEĞ",
    }
};

let currentLang = localStorage.getItem('osint_lang') || 'en';

export function t(key) {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
}

export function getLang() {
    return currentLang;
}

export function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('osint_lang', lang);
    applyTranslations();
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
}

export function applyTranslations() {
    // Apply translations to all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = val;
        } else {
            el.textContent = val;
        }
    });

    // Apply translations to elements with data-i18n-title (for tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });

    // Apply translations to elements with data-i18n-html (for innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        el.innerHTML = t(key);
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang === 'tr' ? 'tr' : 'en';
}
