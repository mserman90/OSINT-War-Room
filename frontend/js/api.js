let appState = {
    refreshRate: 10000,
    paused: false,
    accounts: [],
    tweets: []
};

async function fetchVix() {
    try {
        const res = await fetch('/api/economy/vix');
        const result = await res.json();
        if (result.status === 'success') {
            const el = document.querySelector('.vix-overlay h1');
            const chEl = document.querySelector('.vix-overlay span');
            if (el) el.textContent = `$${result.price}`;
            if (chEl) {
                const up = result.change_pct >= 0;
                chEl.style.color = up ? '#4ade80' : '#ef4444';
                chEl.textContent = `${up ? '+' : ''}${result.change_pct}%`;
            }
        }
    } catch(e) {}
}

const channelNames = {
    "monitor_the_situation": "Situation Monitor",
    "aljazeeraglobal": "Al Jazeera",
    "OSINTWarfare": "OSINT Warfare",
    "terroralarm": "Terror Alarm",
    "ConflictsTracker": "Conflicts Tracker",
    "twz": "The War Zone",
    "usni": "USNI News"
};

function timeSince(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "Just now";
}

function formatTimeElapsed(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
}

function renderFeed(data = null) {
    const container = document.getElementById('tweet-feed-container');
    if (!container) return;

    const tweetsToRender = data || appState.tweets;

    for (let i = tweetsToRender.length - 1; i >= 0; i--) {
        const tweet = tweetsToRender[i];
        if (document.getElementById(`msg-${tweet.id}`)) continue;
        
        // Add this color mapping logic inside the rendering loop for each item
        let dotColor = '#888888'; // Default grey
        if (tweet.channel === 'monitor_the_situation') dotColor = '#eab308'; // Glowing Yellow
        else if (tweet.channel === 'aljazeeraglobal') dotColor = '#ef4444'; // Glowing Red
        else if (tweet.channel === 'OSINTWarfare') dotColor = '#22c55e'; // Glowing Green
        else if (tweet.channel === 'terroralarm') dotColor = '#3b82f6'; // Glowing Blue
        else if (tweet.channel === 'ConflictsTracker') dotColor = '#a855f7'; // Glowing Purple
        else if (tweet.channel === 'twz') dotColor = '#f97316'; // Glowing Orange — The War Zone
        else if (tweet.channel === 'usni') dotColor = '#06b6d4'; // Glowing Cyan — USNI News
        const dotStyle = `background-color: ${dotColor}; color: ${dotColor}; box-shadow: 0 0 8px ${dotColor};`

        const displayName = channelNames[tweet.channel] || tweet.channel;
        const mediaIcon = tweet.has_media ? '<i class="fa-solid fa-camera"></i>' : '';

        const html = `
        <div class="tweet-card" id="msg-${tweet.id}">
            <div class="tweet-header">
                <div>
                    <div class="source-dot" style="${dotStyle}"></div>
                    <span class="tweet-user">${displayName}</span>
                </div>
                <a href="${tweet.url || '#'}" target="_blank" class="tweet-link" title="Open Post"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            </div>
            <div class="tweet-content">${tweet.text}</div>
            <div class="tweet-footer">
                <span>${mediaIcon}</span>
                <span class="time-ago" data-time="${tweet.timestamp}">${timeSince(tweet.timestamp)}</span>
            </div>
        </div>
        `;
        container.insertAdjacentHTML('afterbegin', html);
        window._sfx?.news();
    }
}

async function fetchLiveAlerts() {
    if (appState.paused) return;
    try {
        const response = await fetch('/api/news/feed');
        const result = await response.json();
        if (result.status === 'success') {
            renderFeed(result.data);
        }
    } catch (error) {
        console.error("Error fetching alerts:", error);
    }
}

// ── The War Zone (TWZ) RSS Feed ──────────────────────────────────
const TWZ_FEED_URL = 'https://www.twz.com/feed';
const CORS_PROXIES = [
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

async function fetchWithCorsProxy(url) {
    for (const proxyFn of CORS_PROXIES) {
        try {
            const res = await fetch(proxyFn(url), { signal: AbortSignal.timeout(12000) });
            if (res.ok) return await res.text();
        } catch (_) { /* try next proxy */ }
    }
    throw new Error('All CORS proxies failed for ' + url);
}

function parseTWZFeed(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    const items = doc.querySelectorAll('item');
    const results = [];

    items.forEach(item => {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        const link  = item.querySelector('link')?.textContent?.trim() || '';
        const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
        const desc = item.querySelector('description')?.textContent?.trim() || '';
        // Strip HTML tags from description for a clean snippet
        const cleanDesc = desc.replace(/<[^>]*>/g, '').replace(/The post .* appeared first on The War Zone\./, '').trim();
        const id = 'twz-' + link.split('/').filter(Boolean).pop();

        results.push({
            id,
            url: link,
            source: 'rss',
            channel: 'twz',
            text: `<strong>${title}</strong>${cleanDesc ? '<br><span style="opacity:.7;font-size:11px;">' + cleanDesc + '</span>' : ''}`,
            timestamp: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
            has_media: !!item.querySelector('enclosure')
        });
    });
    return results;
}

async function fetchTWZFeed() {
    if (appState.paused) return;
    try {
        const xml = await fetchWithCorsProxy(TWZ_FEED_URL);
        const items = parseTWZFeed(xml);
        if (items.length) renderFeed(items);
    } catch (e) {
        console.warn('[TWZ] RSS fetch failed:', e.message);
    }
}

// ── USNI News RSS Feed ─────────────────────────────────────────────
const USNI_FEED_URL = 'https://news.usni.org/feed';

function parseUSNIFeed(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    const items = doc.querySelectorAll('item');
    const results = [];

    items.forEach(item => {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        const link  = item.querySelector('link')?.textContent?.trim() || '';
        const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
        const desc = item.querySelector('description')?.textContent?.trim() || '';
        const cleanDesc = desc.replace(/<[^>]*>/g, '').replace(/The post .* appeared first on .*\./, '').trim().slice(0, 200);
        const id = 'usni-' + link.split('/').filter(Boolean).pop();

        results.push({
            id,
            url: link,
            source: 'rss',
            channel: 'usni',
            text: `<strong>${title}</strong>${cleanDesc ? '<br><span style="opacity:.7;font-size:11px;">' + cleanDesc + '</span>' : ''}`,
            timestamp: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
            has_media: !!item.querySelector('enclosure')
        });
    });
    return results;
}

async function fetchUSNIFeed() {
    if (appState.paused) return;
    try {
        const xml = await fetchWithCorsProxy(USNI_FEED_URL);
        const items = parseUSNIFeed(xml);
        if (items.length) renderFeed(items);
    } catch (e) {
        console.warn('[USNI] RSS fetch failed:', e.message);
    }
}

async function fetchMarketData() {
    try {
        const res = await fetch('/api/economy/markets');
        const result = await res.json();
        if (result.status === 'success') {
            renderMarketData(result.data);
            // Update VIX gauge from the same response
            const vix = result.data.find(d => d.category === 'Fear');
            if (vix) {
                const el = document.querySelector('.vix-overlay h1');
                const chEl = document.querySelector('.vix-overlay span');
                if (el) el.textContent = vix.price;
                if (chEl) {
                    chEl.style.color = vix.type === 'up' ? '#4ade80' : '#ef4444';
                    chEl.textContent = vix.change;
                }
            }
        }
    } catch(e) { console.warn("Market fetch failed", e); }
}

function renderPizzaData(data) {
    const container = document.getElementById('pizza-content');
    if (!container) return;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'pizza-container';

    const yAxis = document.createElement('div');
    yAxis.className = 'pizza-y-axis';
    yAxis.textContent = 'ORDER VOLUME';
    wrapper.appendChild(yAxis);

    const chartArea = document.createElement('div');
    chartArea.className = 'pizza-chart-area';

    const barsContainer = document.createElement('div');
    barsContainer.className = 'pizza-chart';
    data.forEach(val => {
        const bar = document.createElement('div');
        bar.className = `pizza-bar ${val > 80 ? 'active' : ''}`;
        bar.style.height = `${val}%`;
        barsContainer.appendChild(bar);
    });
    chartArea.appendChild(barsContainer);

    const xAxis = document.createElement('div');
    xAxis.className = 'pizza-x-axis';
    xAxis.innerHTML = '<span>6a</span><span>9a</span><span>12p</span><span>3p</span><span>6p</span><span>9p</span><span>12a</span><span>3a</span>';
    chartArea.appendChild(xAxis);

    const legend = document.createElement('div');
    legend.className = 'pizza-legend';
    legend.innerHTML = '<span style="color:#333">■</span> Usual <span style="color:#f97316">■</span> Now';
    chartArea.appendChild(legend);

    wrapper.appendChild(chartArea);
    container.appendChild(wrapper);
}

function renderMarketData(data) {
    const container = document.getElementById('module-stocks');
    if (!container) return;
    container.innerHTML = '';

    const legend = document.createElement('div');
    legend.className = 'market-header-row';
    legend.innerHTML = '<span>SYMBOL</span><span>PRICE</span><span>CHG</span>';
    container.appendChild(legend);

    const table = document.createElement('div');
    table.className = 'market-table';
    let lastCategory = null;

    // Filter out VIX from the table — it's shown in the gauge, not the table
    data.filter(item => item.category !== 'Fear').forEach((item, index) => {
        if (item.category !== lastCategory && index > 0) {
            const sep = document.createElement('div');
            sep.className = 'market-separator';
            table.appendChild(sep);
        }
        lastCategory = item.category;

        const el = document.createElement('div');
        el.className = 'market-row';
        const arrow = item.type === 'up' ? '▲' : '▼';
        el.innerHTML = `
            <div class="market-symbol">${item.icon} ${item.symbol}</div>
            <div class="market-price">${item.price}</div>
            <div class="market-change"><span class="${item.type}">${arrow} ${item.change}</span></div>
        `;
        table.appendChild(el);
    });
    container.appendChild(table);
}

async function fetchPolymarketData() {
    try {
        const res = await fetch('/api/economy/polymarket');
        const result = await res.json();
        if (result.status === 'success') {
            renderPolymarketData(result.data, result.top_volume || []);
        }
    } catch(e) { console.warn("Polymarket fetch failed", e); }
}

function renderPolymarketData(markets, topVolume = []) {
    const container = document.getElementById('module-poly');
    if (!container) return;

    const formatVol = (v) => {
        if (v >= 1000000) return `$${(v/1000000).toFixed(1)}M`;
        if (v >= 1000) return `$${(v/1000).toFixed(0)}K`;
        return `$${v.toFixed(0)}`;
    };

    container.innerHTML = `
        <div class="card-title" style="color:#60a5fa; text-shadow:0 0 12px rgba(59,130,246,0.8); padding: 10px 10px 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="margin-right:6px;">
                <circle cx="12" cy="12" r="12" fill="#2563eb"/>
                <path d="M7 7h5a5 5 0 0 1 0 10H7V7z" stroke="white" stroke-width="2"/>
            </svg>
            Polymarket Bets
        </div>
        <div class="poly-container">
            ${markets.map(m => {
                const changeColor = m.change_pct >= 0 ? '#10b981' : '#ef4444';
                const changeArrow = m.change_pct >= 0 ? '📈' : '📉';
                const sparkPath = m.yes_prob > 50
                    ? `M0,14 L10,10 L20,11 L30,6 L40,${14 - (m.yes_prob / 10)}`
                    : `M0,4 L10,7 L20,10 L30,11 L40,${4 + ((100 - m.yes_prob) / 10)}`;
                return `
                <div class="poly-card">
                    <div class="poly-header">
                        <div class="poly-question">${m.question}</div>
                        <a href="${m.url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square poly-link"></i></a>
                    </div>
                    <div class="poly-data-row">
                        <span class="poly-percent">${m.yes_prob}% Yes</span>
                        <svg class="poly-spark" viewBox="0 0 40 15" stroke="${m.yes_prob >= 50 ? '#10b981' : '#ef4444'}">
                            <path d="${sparkPath}" fill="none"/>
                        </svg>
                    </div>
                    <div class="poly-bar-container">
                        <div class="poly-bar-yes" style="width:${m.yes_prob}%"></div>
                        <div class="poly-bar-no" style="width:${m.no_prob}%"></div>
                    </div>
                    <div class="poly-meta">
                        <span>Vol: ${formatVol(m.volume24hr)}</span>
                        <span style="color:${changeColor}">${changeArrow} ${Math.abs(m.change_pct)}% change</span>
                    </div>
                </div>`;
            }).join('')}
        </div>
        ${topVolume.length ? `
        <div style="border-top:1px solid var(--border-panel); margin-top:8px; padding: 8px 10px 4px;">
            <div style="font-size:10px; color:#eab308; text-shadow:0 0 8px #eab30888; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-weight:700;">
                🏆 Top by Total Volume
            </div>
            ${topVolume.map(m => {
                const yc = m.yes_prob >= 50 ? '#10b981' : '#ef4444';
                const changeColor = m.change_pct >= 0 ? '#10b981' : '#ef4444';
                const changeArrow = m.change_pct >= 0 ? '📈' : '📉';
                return `
                <div class="poly-card" style="border-color:#eab30833; box-shadow: 0 0 8px #eab30818;">
                    <div class="poly-header">
                        <div class="poly-question">${m.question}</div>
                        <a href="${m.url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square poly-link"></i></a>
                    </div>
                    <div class="poly-data-row">
                        <span class="poly-percent" style="color:${yc};">${m.yes_prob}% Yes</span>
                    </div>
                    <div class="poly-bar-container">
                        <div class="poly-bar-yes" style="width:${m.yes_prob}%; background:#eab308;"></div>
                        <div class="poly-bar-no" style="width:${m.no_prob}%; background:#44310a;"></div>
                    </div>
                    <div class="poly-meta">
                        <span>Total Vol: ${formatVol(m.total_volume)}</span>
                        <span style="color:${changeColor};">${changeArrow} ${Math.abs(m.change_pct)}% change</span>
                    </div>
                </div>`;
            }).join('')}
        </div>` : ''}`;
}


async function fetchTickerHeadlines() {
    try {
        const res = await fetch('/api/economy/ticker');
        const result = await res.json();
        if (result.status === 'success' && result.data.length) {
            updateTicker(result.data);
        }
    } catch(e) { console.warn("Ticker fetch failed", e); }
}

function updateTicker(headlines) {
    const content = document.getElementById('ticker-content');
    if (!content) return;
    
    const html = headlines.map(h =>
        `<a href="${h.url}" target="_blank" class="ticker-item">
            <span class="ticker-source">${h.source}</span>
            <span class="ticker-title">${h.title}</span>
        </a>`
    ).join('<span class="ticker-sep">◆</span>');
    
    content.innerHTML = html + '<span class="ticker-sep">◆</span>' + html; // duplicate for seamless loop
    
    // Recalculate animation duration based on content width
    // ~120px per second feels like broadcast TV
    const totalWidth = content.scrollWidth / 2;
    const duration = Math.max(totalWidth / 120, 20);
    content.style.animationDuration = `${duration}s`;
}

// ── GDELT Bilateral Threat Monitor ──────────────────────────────────
const COUNTRY_PAIRS = [
    {
        id: 'usa-irn',
        nameA: 'USA', nameB: 'IRN',
        codeA: 'USA', codeB: 'IRN',
        flagA: '🇺🇸', flagB: '🇮🇷',
        query: '(USA OR Iran) conflict war tension'
    },
    {
        id: 'rus-ukr',
        nameA: 'RUS', nameB: 'UKR',
        codeA: 'RUS', codeB: 'UKR',
        flagA: '🇷🇺', flagB: '🇺🇦',
        query: '(Russia OR Ukraine) conflict war tension'
    },
    {
        id: 'usa-chn',
        nameA: 'USA', nameB: 'CHN',
        codeA: 'USA', codeB: 'CHN',
        flagA: '🇺🇸', flagB: '🇨🇳',
        query: '(USA OR China) conflict war tension'
    },
    {
        id: 'chn-twn',
        nameA: 'CHN', nameB: 'TWN',
        codeA: 'CHN', codeB: 'TWN',
        flagA: '🇨🇳', flagB: '🇹🇼',
        query: '(China OR Taiwan) conflict war tension'
    },
    {
        id: 'isr-irn',
        nameA: 'ISR', nameB: 'IRN',
        codeA: 'ISR', codeB: 'IRN',
        flagA: '🇮🇱', flagB: '🇮🇷',
        query: '(Israel OR Iran) conflict war tension'
    },
    {
        id: 'usa-rus',
        nameA: 'USA', nameB: 'RUS',
        codeA: 'USA', codeB: 'RUS',
        flagA: '🇺🇸', flagB: '🇷🇺',
        query: '(USA OR Russia) conflict war tension'
    }
];

function gdeltThreatLevel(index) {
    if (index < 0.5)  return { label: 'LOW',      color: '#10b981' };
    if (index < 1.0)  return { label: 'MODERATE', color: '#06b6d4' };
    if (index < 1.5)  return { label: 'ELEVATED', color: '#eab308' };
    if (index < 2.5)  return { label: 'HIGH',     color: '#f97316' };
    return               { label: 'CRITICAL',  color: '#ef4444' };
}

function buildGDELTSparkline(bins, color) {
    if (!bins || bins.length === 0) return '<svg class="gdelt-sparkline" viewBox="0 0 120 32"></svg>';

    // Use the distribution of tone bins as the sparkline
    // Sort bins by bin value (tone score) to ensure proper ordering
    const sorted = [...bins].sort((a, b) => a.bin - b.bin);
    const counts = sorted.map(b => b.count);
    const maxCount = Math.max(...counts, 1);
    const n = sorted.length;
    const W = 120, H = 32;
    const step = W / Math.max(n - 1, 1);

    // Build polyline points
    const points = sorted.map((b, i) => {
        const x = i * step;
        const y = H - (b.count / maxCount) * (H - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Build filled area path
    const firstX = 0;
    const lastX = ((n - 1) * step).toFixed(1);
    const areaPoints = `0,${H} ` + points + ` ${lastX},${H}`;

    return `<svg class="gdelt-sparkline" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs>
            <linearGradient id="sg-${Math.random().toString(36).slice(2,7)}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
            </linearGradient>
        </defs>
        <polygon points="${areaPoints}" fill="${color}" fill-opacity="0.15"/>
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`;
}

async function fetchGDELTData() {
    const grid = document.getElementById('gdelt-grid');
    if (!grid) return;

    // Show loading skeletons on first call if grid is empty
    if (!grid.dataset.initialized) {
        grid.dataset.initialized = '1';
        grid.innerHTML = COUNTRY_PAIRS.map(p => `
            <div class="gdelt-card" id="gdelt-${p.id}">
                <div class="gdelt-card-header">
                    <span class="gdelt-flags">${p.flagA}→${p.flagB}</span>
                    <span class="gdelt-codes">${p.codeA} / ${p.codeB}</span>
                    <span class="gdelt-badge" style="background:#ffffff18; color:#888;">LOADING</span>
                    <span class="gdelt-index" style="color:#555;">—</span>
                </div>
                <div class="gdelt-spark-wrap"><div class="gdelt-spark-loading"></div></div>
                <div class="gdelt-footer">Index: —</div>
            </div>`).join('');
    }

    // Fetch all pairs in parallel for speed
    await Promise.allSettled(COUNTRY_PAIRS.map(async (pair) => {
        try {
            const apiUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(pair.query)}&mode=ToneChart&format=json&TIMESPAN=30d`;
            const raw = await fetchWithCorsProxy(apiUrl);
            const data = JSON.parse(raw);
            const bins = data.tonechart || [];

            let sumWeighted = 0, sumCount = 0;
            bins.forEach(b => { sumWeighted += b.bin * b.count; sumCount += b.count; });
            const avgTone = sumCount > 0 ? sumWeighted / sumCount : 0;

            const riskIndex = Math.abs(avgTone) / 3.0;
            const threat = gdeltThreatLevel(riskIndex);
            const sparkSvg = buildGDELTSparkline(bins, threat.color);

            const card = document.getElementById(`gdelt-${pair.id}`);
            if (card) {
                card.style.borderColor = threat.color + '44';
                card.style.boxShadow = `0 0 8px ${threat.color}18`;
                card.innerHTML = `
                    <div class="gdelt-card-header">
                        <span class="gdelt-flags">${pair.flagA}→${pair.flagB}</span>
                        <span class="gdelt-codes">${pair.codeA} / ${pair.codeB}</span>
                        <span class="gdelt-badge" style="background:${threat.color}22; border:1px solid ${threat.color}66; color:${threat.color};">${threat.label}</span>
                        <span class="gdelt-index" style="color:${threat.color}; text-shadow:0 0 8px ${threat.color}88;">${riskIndex.toFixed(2)}</span>
                    </div>
                    <div class="gdelt-spark-wrap">${sparkSvg}</div>
                    <div class="gdelt-footer" style="color:${threat.color}88;">Index: ${riskIndex.toFixed(2)}</div>`;
            }
        } catch(e) {
            console.warn(`[GDELT] ${pair.id} error:`, e.message);
            const card = document.getElementById(`gdelt-${pair.id}`);
            if (card) {
                card.innerHTML = `
                    <div class="gdelt-card-header">
                        <span class="gdelt-flags">${pair.flagA}→${pair.flagB}</span>
                        <span class="gdelt-codes">${pair.codeA} / ${pair.codeB}</span>
                        <span class="gdelt-badge" style="background:#ef444422; border:1px solid #ef444466; color:#ef4444;">RETRY</span>
                        <span class="gdelt-index" style="color:#555;">—</span>
                    </div>
                    <div class="gdelt-spark-wrap" style="height:50px;display:flex;align-items:center;justify-content:center;"><span style="font-size:10px;color:#64748b;">Retrying next cycle...</span></div>
                    <div class="gdelt-footer" style="color:#555;">Index: —</div>`;
            }
        }
    }));
}

function renderGDELTMonitor() {
    // Initial render with placeholder cards before data loads
    const grid = document.getElementById('gdelt-grid');
    if (!grid) return;
    grid.innerHTML = COUNTRY_PAIRS.map(p => `
        <div class="gdelt-card" id="gdelt-${p.id}">
            <div class="gdelt-card-header">
                <span class="gdelt-flags">${p.flagA}→${p.flagB}</span>
                <span class="gdelt-codes">${p.codeA} / ${p.codeB}</span>
                <span class="gdelt-badge" style="background:#ffffff18; color:#888;">—</span>
                <span class="gdelt-index" style="color:#555;">—</span>
            </div>
            <div class="gdelt-spark-wrap"><div class="gdelt-spark-loading"></div></div>
            <div class="gdelt-footer">Index: —</div>
        </div>`).join('');
}

export function initDataPolling() {
    fetchMarketData();
    setInterval(fetchMarketData, 60000)

    fetchPolymarketData();
    setInterval(fetchPolymarketData, 300000); // refresh every 5 min

    fetchTickerHeadlines();
    setInterval(fetchTickerHeadlines, 120000); // refresh every 2 minutes

    // Pizza Index is now a live iframe embed of pizzint.watch (loaded by ui.js on modal open)

    fetchLiveAlerts();
    setInterval(fetchLiveAlerts, 10000);

    // RSS feeds – fetch on boot + every 5 minutes
    fetchTWZFeed();
    fetchUSNIFeed();
    setInterval(fetchTWZFeed, 300000);
    setInterval(fetchUSNIFeed, 300000);

    // GDELT Bilateral Threat Monitor – render placeholders then fetch on boot + every 5 minutes
    renderGDELTMonitor();
    fetchGDELTData();
    setInterval(fetchGDELTData, 300000);

    // Settings listeners for feed control
    const pauseCheckbox = document.getElementById('pause-news-updates');
    if (pauseCheckbox) {
        pauseCheckbox.addEventListener('change', (e) => {
            appState.paused = e.target.checked;
        });
    }

    // Listen for market settings changes from ui.js
    window.addEventListener('marketSettingsChanged', () => {
       // renderMarketData(MOCK_MARKET_DATA);
    });

    // Part 3: Frontend Settings Modal Sync
    let tgChannels = [];
    async function loadTgSettings() {
        try {
            const res = await fetch('/api/alerts/settings');
            const data = await res.json();
            tgChannels = data.telegram_channels;
            renderTgList();
        } catch (e) { console.error("Failed to load settings", e); }
    }
    function renderTgList() {
        const list = document.getElementById('accounts-list');
        if (!list) return;
        list.innerHTML = tgChannels.map((ch, i) => `
            <div class="setting-item" style="display:flex; justify-content:space-between; align-items:center; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 4px;">
                <span>${ch}</span>
                <i class="fa-solid fa-trash" style="cursor:pointer; color:#ef4444;" onclick="removeTgChannel(${i})"></i>
            </div>`).join('');
    }
    window.removeTgChannel = async (i) => {
        tgChannels.splice(i, 1);
        renderTgList();
        await fetch('/api/alerts/settings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({channels: tgChannels}) });
    };
    document.getElementById('add-account-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('new-account'); // Reuse the input
        const val = input.value.trim().replace('@', '');
        if (val && !tgChannels.includes(val)) {
            tgChannels.push(val);
            input.value = '';
            renderTgList();
            await fetch('/api/alerts/settings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({channels: tgChannels}) });
        }
    });
    loadTgSettings(); // Call on boot

    // 1. Run this every minute to update timestamps dynamically
    setInterval(() => {
        document.querySelectorAll('.time-ago').forEach(el => {
            el.innerText = timeSince(el.getAttribute('data-time'));
        });
    }, 60000);

    // 2. Search Filter
    document.getElementById('news-search')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.tweet-card').forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });

}


