/**
 * DIGISYNQ — Creative Industry Intelligence & Orchestration Platform
 * Backend Server & REST API Engine (Zero-Dependency Node.js HTTP Server)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

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
