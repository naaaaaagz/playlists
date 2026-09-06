import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const W = 3600;
const H = 2200;
const root = process.cwd();
const bgPath = path.join(root, 'playlist-map-background.png');
const bg64 = fs.readFileSync(bgPath).toString('base64');

const categories = {
  chill: {
    label: 'CHILL', color: '#58e5d2', x: 740, y: 500, rx: 640, ry: 350,
    items: ["just vibin'", "don't wanna move or do anything", "i'm very rich and i'm driving", 'make some love but soulfully', 'urban love', "2006, London and you're stoned", 'gaze into the lights and think', 'crystals, facebook and menopause', 'audible melatonin'], cols: 2
  },
  energetic: {
    label: 'ENERGETIC', color: '#ffb44d', x: 1770, y: 380, rx: 430, ry: 245,
    items: ["i'm the protagonist!", "i just wanna bop my head", 'i am the dormant energy', 'keep the funk alive'], cols: 2
  },
  pop: {
    label: 'POP', color: '#ff718c', x: 2860, y: 500, rx: 640, ry: 350,
    items: ["i like everything that's on tv", 'your youtube intro', 'baseball caps & divas', 'msn, ipods and myspace', 'fanny packs, n64s and ripped jeans', 'sing into a hairbrush', 'black nail polish', 'seatbelt substitute', 'breakups suck', 'hey kids! do you like music?'], cols: 2
  },
  jamaican: {
    label: 'JAMAICAN', color: '#8ddf63', x: 340, y: 1050, rx: 285, ry: 205,
    items: ['jah - not for the thick blooded', 'roots man'], cols: 1
  },
  raps: {
    label: 'RAPS', color: '#f3c64f', x: 900, y: 1050, rx: 310, ry: 225,
    items: ['conscious culture', 'raise the roof yo!', 'let them cook'], cols: 1
  },
  edm: {
    label: 'EDM', color: '#56a8ff', x: 1570, y: 980, rx: 500, ry: 330,
    items: ['melt your face with BASS', 'i hate to break it to ya..', 'did you like the matrix?'], cols: 1
  },
  dnb: {
    label: 'DNB', color: '#9e8cff', x: 2060, y: 1020, rx: 260, ry: 190,
    items: [], cols: 1
  },
  weird: {
    label: 'WEIRD', color: '#e57cff', x: 3050, y: 1040, rx: 450, ry: 290,
    items: ['make heatwaves enjoyable', 'durban rooftop party', 'gameboys & synthesizers', 'i understand quantum physics!', 'lol why does this exist'], cols: 2
  },
  guitars: {
    label: 'GUITARS AND SUCH', color: '#67d39b', x: 650, y: 1710, rx: 620, ry: 370,
    items: ['rock on, everybody!', "i'd marry my harley", 'got some spare change?', 'dude that festival was bonkers', 'for hipster coffee shop owners', 'wear flowers in your hair', 'shakas & wipeout', 'nerds with guitars', 'wow i got nice shoes', 'mwuaaarrrrggh'], cols: 2
  },
  psy: {
    label: 'PSY', color: '#c8ef50', x: 1420, y: 1570, rx: 275, ry: 195,
    items: [], cols: 1
  },
  four: {
    label: '4-ON-4', color: '#ff9d3f', x: 1900, y: 1700, rx: 560, ry: 350,
    items: ['the house party is about to start', 'submerged in 4/4'], cols: 1
  },
  hard: {
    label: 'HARD', color: '#ff554f', x: 2570, y: 1600, rx: 400, ry: 285,
    items: ['sadomazo dungeon', 'bald head & hakkuh', 'good morning, neighbors!'], cols: 1
  },
  traditional: {
    label: 'TRADITIONAL', color: '#d5a46d', x: 3230, y: 1690, rx: 340, ry: 315,
    items: ['help my grandma took over spotify', 'honor thy folk heritage', 'saxophone a z z', 'dead guys in wigs'], cols: 1
  }
};

const shared = [
  { name: 'glitter, distortion and autotune', a: 'hard', b: 'weird', x: 2750, y: 1305 },
  { name: 'welcome, alien overlords!', a: 'edm', b: 'dnb', x: 1925, y: 900 },
  { name: 'bruh, are we the aliens?', a: 'edm', b: 'dnb', x: 1940, y: 1020 },
  { name: "let's cry naked on the subway", a: 'edm', b: 'chill', x: 1300, y: 720 },
  { name: 'ride the dragon, aummmmm', a: 'four', b: 'psy', x: 1585, y: 1570 },
  { name: 'melt away into the universe', a: 'chill', b: 'psy', x: 1320, y: 1325 },
  { name: 'oh my techno goodness', a: 'four', b: 'hard', x: 2380, y: 1880 },
  { name: 'come down at the afterparty', a: 'four', b: 'chill', x: 1660, y: 1360 },
  { name: 'ex & estrogen', a: 'four', b: 'pop', x: 2280, y: 1320 }
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function bubble(c) {
  const labelY = c.y - c.ry + 58;
  return `<g>
    <ellipse cx="${c.x}" cy="${c.y}" rx="${c.rx}" ry="${c.ry}" fill="${c.color}" fill-opacity=".075" stroke="${c.color}" stroke-opacity=".72" stroke-width="4" filter="url(#glow)"/>
    <text x="${c.x}" y="${labelY}" class="cat" fill="${c.color}">${esc(c.label)}</text>
  </g>`;
}

function pill(x, y, name, color, maxWidth = 400) {
  const width = Math.min(maxWidth, Math.max(220, name.length * 13.2 + 66));
  return `<g transform="translate(${x - width / 2} ${y - 27})">
    <rect width="${width}" height="54" rx="27" fill="#10161d" fill-opacity=".94" stroke="${color}" stroke-opacity=".72" stroke-width="2"/>
    <circle cx="25" cy="27" r="6" fill="${color}"/>
    <text x="44" y="34" class="brick">${esc(name)}</text>
  </g>`;
}

function itemsFor(c) {
  if (!c.items.length) return '';
  const rows = Math.ceil(c.items.length / c.cols);
  const xGap = c.rx * 0.88;
  const yGap = Math.min(78, (c.ry * 1.45) / Math.max(rows, 1));
  const startY = c.y - ((rows - 1) * yGap) / 2 + 30;
  return c.items.map((name, i) => {
    const col = i % c.cols;
    const row = Math.floor(i / c.cols);
    const x = c.x + (col - (c.cols - 1) / 2) * xGap + (row % 2 ? 20 : -20);
    const y = startY + row * yGap;
    const cap = c.cols === 1 ? c.rx * 1.55 : c.rx * .82;
    return pill(x, y, name, c.color, cap);
  }).join('\n');
}

function sharedPill(s, i) {
  const a = categories[s.a], b = categories[s.b];
  const width = Math.max(300, Math.min(470, s.name.length * 13.4 + 92));
  const grad = `mix${i}`;
  return `<g>
    <line x1="${s.x}" y1="${s.y}" x2="${a.x}" y2="${a.y}" stroke="${a.color}" stroke-opacity=".32" stroke-width="3" stroke-dasharray="10 13"/>
    <line x1="${s.x}" y1="${s.y}" x2="${b.x}" y2="${b.y}" stroke="${b.color}" stroke-opacity=".32" stroke-width="3" stroke-dasharray="10 13"/>
    <g transform="translate(${s.x - width / 2} ${s.y - 34})" filter="url(#shadow)">
      <rect width="${width}" height="68" rx="34" fill="#10161d" stroke="url(#${grad})" stroke-width="5"/>
      <circle cx="28" cy="34" r="8" fill="${a.color}"/>
      <circle cx="49" cy="34" r="8" fill="${b.color}"/>
      <text x="68" y="42" class="shared">${esc(s.name)}</text>
    </g>
  </g>`;
}

const gradients = shared.map((s, i) => `<linearGradient id="mix${i}" x1="0" x2="1"><stop stop-color="${categories[s.a].color}"/><stop offset="1" stop-color="${categories[s.b].color}"/></linearGradient>`).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="shadow" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity=".55"/></filter>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#070a0e" stop-opacity=".48"/><stop offset="1" stop-color="#070a0e" stop-opacity=".86"/></linearGradient>
    ${gradients}
    <style>
      .title{font:800 64px 'Segoe UI',Arial,sans-serif;letter-spacing:2px;fill:#f5f7fb}
      .subtitle{font:400 25px 'Segoe UI',Arial,sans-serif;letter-spacing:.6px;fill:#aab6c4}
      .cat{font:800 26px 'Segoe UI',Arial,sans-serif;letter-spacing:5px;text-anchor:middle}
      .brick{font:600 20px 'Segoe UI',Arial,sans-serif;fill:#eef3f8}
      .shared{font:700 21px 'Segoe UI',Arial,sans-serif;fill:#fff}
      .legend{font:500 20px 'Segoe UI',Arial,sans-serif;fill:#c9d2dc}
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="#070a0e"/>
  <image href="data:image/png;base64,${bg64}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" opacity=".30"/>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <text x="120" y="98" class="title">64 PLAYLISTS — A LISTENING MAP</text>
  <text x="122" y="142" class="subtitle">Mood at the top, musical families below. Two-color bricks live between both of their categories.</text>
  <g opacity=".92">${Object.values(categories).map(bubble).join('\n')}</g>
  <g>${Object.values(categories).map(itemsFor).join('\n')}</g>
  <g>${shared.map(sharedPill).join('\n')}</g>
  <g transform="translate(2940 2115)"><circle cx="0" cy="0" r="8" fill="#58e5d2"/><circle cx="22" cy="0" r="8" fill="#ff9d3f"/><text x="42" y="7" class="legend">shared category bridge</text></g>
</svg>`;

fs.writeFileSync(path.join(root, 'playlist-bubble-map.svg'), svg);
await sharp(Buffer.from(svg)).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(path.join(root, 'playlist-bubble-map.png'));
console.log('Created playlist-bubble-map.svg and playlist-bubble-map.png');
