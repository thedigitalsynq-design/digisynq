/**
 * DIGISYNQ — Creative Industry Intelligence & Orchestration Platform
 * Backend Server & REST API Engine (Zero-Dependency Node.js HTTP Server)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');

// Load .env (zero-dependency) — secrets stay server-side, never shipped to the client
(function loadEnv() {
  try {
    const envFile = path.join(__dirname, '.env');
    if (!fs.existsSync(envFile)) return;
    for (const line of fs.readFileSync(envFile, 'utf-8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch { /* .env is optional */ }
})();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// AI provider config for the insights dashboard (keys read from env only)
const INSIGHTS_PROVIDER = (process.env.INSIGHTS_PROVIDER || 'gemini').toLowerCase();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const INSIGHTS_CACHE_TTL_MS = 5 * 60 * 1000; // 5-minute cache — keeps free-tier Gemini usage well under daily limits

// In-Memory Database (seeded with verified ecosystem records)
const db = {
  talents: [
    {
      id: "DS-TAL-004821",
      name: "Aryan Sharma",
      role: "Director of Photography",
      category: "Cinematography",
      grade: "Grade A",
      rating: 4.8,
      reliability: 94,
      onTime: 97,
      repeatHire: 81,
      projects: 32,
      city: "Bengaluru",
      specialty: "Low Light, Anamorphic & High-Speed Commercials",
      gear: "ARRI Alexa Mini LF, Cooke Anamorphic /i",
      availability: "Sept 10–18",
      rate: "₹35,000 / day",
      verified: true
    },
    {
      id: "DS-TAL-003190",
      name: "Meera Krishnan",
      role: "Director / Showrunner",
      category: "Direction",
      grade: "Grade A",
      rating: 4.9,
      reliability: 98,
      onTime: 99,
      repeatHire: 92,
      projects: 24,
      city: "Bengaluru",
      specialty: "Narrative Thrillers & Brand Films",
      gear: "ScriptE, Pre-Viz 3D, DaVinci Studio",
      availability: "Immediate",
      rate: "Project Retainer",
      verified: true
    },
    {
      id: "DS-TAL-007512",
      name: "Vikramaditya Roy",
      role: "Colorist (DI) & Post Supervisor",
      category: "Post-Production",
      grade: "Grade A",
      rating: 4.7,
      reliability: 92,
      onTime: 95,
      repeatHire: 88,
      projects: 48,
      city: "Mumbai / Remote",
      specialty: "ACES Color Science, Theatrical HDR DI",
      gear: "DaVinci Resolve Studio Advanced Panel, Flanders OLED",
      availability: "Next Week",
      rate: "₹25,000 / day",
      verified: true
    },
    {
      id: "DS-TAL-008439",
      name: "Karthik R.",
      role: "Gaffer & Chief Lighting Tech",
      category: "Lighting & Grip",
      grade: "Grade A",
      rating: 4.8,
      reliability: 96,
      onTime: 98,
      repeatHire: 90,
      projects: 56,
      city: "Bengaluru / South",
      specialty: "Aputure Electro Storm, ARRI SkyPanels, Wireless CRMX",
      gear: "Full Lighting Truck Package",
      availability: "Sept 12–22",
      rate: "₹18,000 / day",
      verified: true
    },
    {
      id: "DS-TAL-009210",
      name: "Tanvi Hegde",
      role: "Production Designer & Art Director",
      category: "Art & Production Design",
      grade: "Grade A",
      rating: 4.9,
      reliability: 95,
      onTime: 96,
      repeatHire: 89,
      projects: 19,
      city: "Bengaluru / Mysuru",
      specialty: "Period Drama Sets, Sci-Fi Commercial Installations",
      gear: "AutoCAD 3D, Set Workshops",
      availability: "Immediate",
      rate: "₹22,000 / day",
      verified: true
    },
    {
      id: "DS-TAL-001044",
      name: "Siddharth Rao",
      role: "Sync Sound Recordist & Mixer",
      category: "Sound",
      grade: "Grade B",
      rating: 4.9,
      reliability: 97,
      onTime: 98,
      repeatHire: 85,
      projects: 29,
      city: "Bengaluru",
      specialty: "Acoustic Field Recording, Multi-Track RF Wireless",
      gear: "Sound Devices 833, Schoeps & DPA Mics",
      availability: "Open Calendar",
      rate: "₹16,000 / day",
      verified: true
    }
  ],

  studios: [
    {
      id: "DS-STU-01",
      name: "Synq Stage 01 (Acoustic Soundstage)",
      city: "Bengaluru (Koramangala Hub)",
      dimensions: "10,000 sq.ft • 28ft Grid",
      power: "250 kW Silent Generator",
      rate: "₹65,000 / day",
      availability: "Sept 11–15 (Open Slot)",
      discount: "28% Off Peak"
    },
    {
      id: "DS-STU-02",
      name: "Virtual Production LED Bay",
      city: "Bengaluru Hub",
      dimensions: "40ft Curved ROE Ruby LED Wall",
      power: "Unreal Engine 5.4 Live Frustum",
      rate: "₹1,40,000 / day",
      availability: "Immediate",
      discount: "Plan B Standby Active"
    }
  ],

  projects: [
    {
      id: "DS-PRJ-8820",
      title: "Kannada Narrative Feature — Shadow Lines",
      format: "Feature Film",
      budget: "₹2.40 Cr",
      schedule: "47 Days",
      status: "Pre-Production",
      health: "96% Optimal",
      plan: "Plan A Active"
    }
  ]
};

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Safety limits & baseline security headers
const MAX_BODY_BYTES = 100 * 1024; // 100 KB JSON payload cap
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

/**
 * Reads and JSON-parses a request body with a hard size cap.
 * Resolves to the parsed object, or `null` on invalid/oversized payloads.
 */
function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        req.destroy();
        resolve(null);
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

/**
 * Minimal HTTPS JSON POST helper (zero-dependency).
 * Resolves with the parsed JSON body on 2xx, rejects otherwise.
 */
function httpsJson(hostname, pathname, headers, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch { /* non-JSON */ }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsed);
        } else {
          reject(new Error(`API ${res.statusCode}: ${(parsed && (parsed.error && (parsed.error.message || JSON.stringify(parsed.error)))) || data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(25000, () => req.destroy(new Error('API request timed out')));
    req.end(payload);
  });
}

const RETRYABLE_CODES = new Set([429, 500, 503]);
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * httpsJson with backoff retries for transient overload/quota codes (429/500/503).
 */
async function httpsJsonWithRetry(hostname, pathname, headers, body, attempts = 3) {
  let lastErr = null;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await httpsJson(hostname, pathname, headers, body);
    } catch (err) {
      lastErr = err;
      const m = /API (\d{3})/.exec(err.message);
      const code = m ? Number(m[1]) : 0;
      if (!RETRYABLE_CODES.has(code) || attempt === attempts - 1) break;
      await sleep(1000 * Math.pow(2, attempt)); // 1s, 2s backoff
    }
  }
  throw lastErr;
}

/**
 * Calls the configured AI provider and returns a raw text answer.
 * Supports gemini (default) and openai.
 */
async function aiGenerate(systemPrompt, userPrompt, temperature) {
  if (INSIGHTS_PROVIDER === 'openai' && OPENAI_API_KEY) {
    const out = await httpsJsonWithRetry(
      'api.openai.com',
      '/v1/chat/completions',
      { Authorization: `Bearer ${OPENAI_API_KEY}` },
      {
        model: 'gpt-4o-mini',
        temperature: temperature || 0.6,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      }
    );
    return out.choices && out.choices[0] && out.choices[0].message && out.choices[0].message.content;
  }

  if (GEMINI_API_KEY) {
    const models = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];
    let lastErr = null;
    for (const model of models) {
      try {
        const out = await httpsJsonWithRetry(
          'generativelanguage.googleapis.com',
          `/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
          {},
          {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: {
              temperature: temperature || 0.6,
              responseMimeType: 'application/json'
            }
          }
        );
        const text = out && out.candidates && out.candidates[0] &&
          out.candidates[0].content && out.candidates[0].content.parts &&
          out.candidates[0].content.parts.map(p => p.text || '').join('');
        if (text) return text;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('All Gemini models failed');
  }

  throw new Error('No AI provider configured — set INSIGHTS_PROVIDER, GEMINI_API_KEY, or OPENAI_API_KEY in .env');
}

/**
 * Insight snapshot cache: { at: ms, payload }
 */
let insightsCache = { at: 0, payload: null };

const INSIGHTS_SYSTEM = [
  'You are the data engine of DIGISYNQ, an operating network for the Kannada film industry.',
  'You generate realistic, internally consistent, illustrative market snapshots.',
  'Always answer with ONLY valid JSON. Never add markdown fences, never add commentary outside the JSON.',
  'All monetary values in Indian Rupees crores (₹ Cr). Use fiscal years FY22–FY26.',
  'Every number must be internally consistent (hits + average + flops = releases).'
].join(' ');

const INSIGHTS_USER = `
Generate a live Kannada film industry dashboard snapshot. Return JSON with exactly this schema:

{
  "asOf": "ISO 8601 timestamp of this snapshot",
  "kpis": {
    "releases": <total releases over FY22-FY26>,
    "boxOfficeCr": <cumulative box office in ₹ Cr>,
    "hits": <total hits>,
    "average": <total average movies>,
    "flops": <total flops>,
    "screens": <total active screens>,
    "multiplex": <multiplex screens>,
    "single": <single-screen theatres>
  },
  "years": [
    {"year":"FY22","releases":214,"boxOfficeCr":412,"hits":14,"average":86,"flops":114},
    ... one object per fiscal year FY22..FY26 (5 objects). FY26 is the current partial year.
  ],
  "talent": {
    "heroes": [{"name":"...","status":"Active|Breakout|On hiatus|Retired","films":n,"hits":n,"boxOfficeCr":n} ... 4-6 entries],
    "heroines": [same shape, 4-6 entries]
  },
  "houses": {
    "active": [{"name":"...","releases":n,"hits":n,"boxOfficeCr":n,"lastActivity":"FY26 Q2","pipeline":n} ... 5 entries],
    "lost": [{"name":"...","status":"Dormant|Closed","lastRelease":"FY23","flagged":"FY24"} ... 4 entries]
  },
  "industry": {
    "screensByRegion": [{"region":"Bengaluru","count":404}, ...],
    "releaseMix": [{"label":"Theatrical","pct":68}, {"label":"OTT direct","pct":22}, {"label":"Hybrid","pct":7}, {"label":"Direct / low reach","pct":3}],
    "avgShootDays": 38,
    "avgBudgetCr": 4.2,
    "recoveryPct": 58,
    "verifiedArtists": 1120,
    "cameraPackages": 212,
    "postSuites": 58,
    "utilisation": [{"label":"Stage occupancy","pct":61}, {"label":"Gear utilisation","pct":47}, {"label":"Crew between projects","pct":39}, {"label":"Idle capacity recovered","pct":22}]
  },
  "feed": [
    {"title":"...","text":"...","time":"..."} ... 5-7 recent activity entries, newest first
  ]
}
`;

/**
 * Builds a fresh dashboard snapshot through the AI provider, or the built-in
 * seeded snapshot when the provider is unavailable.
 */
async function buildInsightsSnapshot() {
  const now = Date.now();
  if (insightsCache.payload && now - insightsCache.at < INSIGHTS_CACHE_TTL_MS) {
    return insightsCache.payload;
  }

  try {
    const raw = await aiGenerate(INSIGHTS_SYSTEM, INSIGHTS_USER, 0.6);
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ''));
    if (!parsed.kpis || !parsed.years || !parsed.feed) throw new Error('Malformed AI response');
    parsed.source = 'live';
    parsed.provider = INSIGHTS_PROVIDER;
    insightsCache = { at: now, payload: parsed };
    return parsed;
  } catch (err) {
    const fallback = require('./insights-seed.json');
    fallback.source = 'seed';
    fallback.asOf = new Date().toISOString();
    fallback.providerError = err.message;
    insightsCache = { at: now, payload: fallback };
    return fallback;
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── API ROUTES ──────────────────────────────────────────────────────────

  // GET /api/talents
  if (pathname === '/api/talents' && req.method === 'GET') {
    const category = parsedUrl.query.category;
    const search = (parsedUrl.query.q || '').toLowerCase();

    let filtered = db.talents;
    if (category && category !== 'All') {
      filtered = filtered.filter(t => t.category === category);
    }
    if (search) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.role.toLowerCase().includes(search) ||
        t.specialty.toLowerCase().includes(search) ||
        t.city.toLowerCase().includes(search)
      );
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: filtered.length, data: filtered }));
    return;
  }

  // GET /api/studios
  if (pathname === '/api/studios' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: db.studios.length, data: db.studios }));
    return;
  }

  // GET /api/stats
  if (pathname === '/api/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      stats: {
        totalTalents: db.talents.length + 1234,
        activeProjects: 42,
        totalCapacityOrchestrated: "₹48.6 Cr",
        avgReliabilityScore: "96.4%",
        planBActivationRate: "94.2%"
      }
    }));
    return;
  }

  // GET /api/health
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      service: 'digisynq-platform',
      version: '2.0.0',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // GET /api/posts
  if (pathname === '/api/posts' && req.method === 'GET') {
    if (!db.posts) {
      db.posts = [
        {
          id: '1',
          tag: 'Network Activity',
          title: 'DOP × Studio Sync Confirmed',
          body: 'Aryan Sharma (Grade A DOP) matched with Ciné Studio Block B for a 12-day feature film shoot. Cooke anamorphic package locked.',
          author: 'DIGISYNQ Ops',
          date: new Date().toISOString()
        },
        {
          id: '2',
          tag: 'Capability Added',
          title: 'ACES HDR Color Suite Bookable',
          body: 'Vikramaditya Roy\'s post-production suite upgraded with DaVinci Resolve Studio Advanced Panel and Flanders scientific OLED.',
          author: 'Network Registry',
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          tag: 'Knowledge Event',
          title: 'Workshop: Low-Light Narrative Lighting',
          body: 'Hands-on masterclass led by Karthik R. utilizing idle soundstage downtime in Bengaluru. 28 attendee seats confirmed.',
          author: 'DIGISYNQ Events',
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ];
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.posts));
    return;
  }

  // POST /api/posts
  if (pathname === '/api/posts' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    if (!payload || !payload.title || !payload.body) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Valid title and body required' }));
      return;
    }
    if (!db.posts) db.posts = [];
    const newPost = {
      id: String(Date.now()),
      tag: payload.tag || 'Network Update',
      title: payload.title,
      body: payload.body,
      author: payload.author || 'DIGISYNQ Member',
      date: new Date().toISOString()
    };
    db.posts.unshift(newPost);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, post: newPost }));
    return;
  }

  // POST /api/feedback
  if (pathname === '/api/feedback' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    if (!payload) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid feedback data' }));
      return;
    }
    if (!db.feedback) db.feedback = [];
    const item = {
      id: `FB-${Date.now()}`,
      name: payload.name || 'Anonymous',
      type: payload.type || 'General',
      message: payload.message || '',
      page: payload.page || '/',
      timestamp: payload.ts || new Date().toISOString()
    };
    db.feedback.push(item);
    console.log(`[FEEDBACK RECEIVED] [${item.type}] ${item.name}: ${item.message.slice(0, 60)}...`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, id: item.id }));
    return;
  }

  // POST /api/register
  if (pathname === '/api/register' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    if (!payload) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      return;
    }
    const newId = `DS-TAL-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newTalent = {
      id: newId,
      name: payload.name || 'Anonymous Creator',
      role: payload.role || 'Cinematographer',
      category: payload.category || 'Cinematography',
      grade: 'Grade A',
      rating: 5.0,
      reliability: 100,
      onTime: 100,
      repeatHire: 100,
      projects: 1,
      city: payload.city || 'Bengaluru',
      specialty: payload.specialty || 'General Craft',
      gear: payload.gear || 'Standard Package',
      availability: payload.availability || 'Immediate',
      rate: payload.rate || 'Flexible',
      verified: true
    };
    db.talents.unshift(newTalent);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Profile registered successfully', data: newTalent }));
    return;
  }

  // POST /api/calculate
  if (pathname === '/api/calculate' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const budget = (payload && payload.budget) || 'tier2';
    const format = (payload && payload.format) || 'commercial';

    let crewCount = 32;
    let gearPkgs = 14;
    let efficiency = "+15%";
    let derivedCuts = 16;

    if (format === 'feature') {
      crewCount = 68;
      gearPkgs = 26;
      efficiency = "+18%";
      derivedCuts = 40;
    } else if (format === 'creator') {
      crewCount = 8;
      gearPkgs = 4;
      efficiency = "+22%";
      derivedCuts = 24;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      estimate: {
        crew: crewCount,
        gear: `${gearPkgs} Packages`,
        budgetEfficiency: efficiency,
        planBCoverage: "94%",
        derivedDeliverables: `${derivedCuts} Assets`,
        scheduleRisk: "Low"
      }
    }));
    return;
  }

  // GET /api/insights — AI-driven live industry snapshot (cached 60s, seed fallback)
  if (pathname === '/api/insights' && req.method === 'GET') {
    try {
      const snapshot = await buildInsightsSnapshot();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, snapshot }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // GET /api/insights/provider — which AI provider is wired up (no secrets exposed)
  if (pathname === '/api/insights/provider' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      provider: INSIGHTS_PROVIDER,
      configured: INSIGHTS_PROVIDER === 'openai' ? !!OPENAI_API_KEY : !!GEMINI_API_KEY
    }));
    return;
  }

  // 404 for unknown API routes — always JSON, never silently fall back to HTML
  if (pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
    return;
  }

  // ── STATIC FILE SERVER ──────────────────────────────────────────────────
  let requestPath;
  try {
    requestPath = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Malformed URL encoding' }));
    return;
  }

  // Resolve and verify the path stays inside the public directory
  const resolved = path.join(PUBLIC_DIR, requestPath === '/' ? 'index.html' : requestPath);
  const rel = path.relative(PUBLIC_DIR, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Access denied' }));
    return;
  }

  fs.stat(resolved, (err, stats) => {
    let target = resolved;
    let status = 200;

    if (err || !stats.isFile()) {
      if (fs.existsSync(resolved + '.html')) {
        target = resolved + '.html';
      } else if (stats && stats.isDirectory() && fs.existsSync(path.join(resolved, 'index.html'))) {
        target = path.join(resolved, 'index.html');
      } else {
        target = path.join(PUBLIC_DIR, '404.html');
        status = 404;
      }
    }

    fs.readFile(target, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Server error' }));
        return;
      }

      const ext = path.extname(target).toLowerCase();
      const headers = {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        ...SECURITY_HEADERS,
        'Cache-Control': status === 200 && ext !== '.html' ? 'public, max-age=3600' : 'no-store'
      };
      res.writeHead(status, headers);
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`✨ DIGISYNQ Platform Server running at http://localhost:${PORT}`);
});
