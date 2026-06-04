/* ════════════════════════════════════════════════════════════
   INTERESTVERSE — script.js
   Full interactive simulation: auth, dashboard, communities,
   games, chat, profile, XP system, particles, toasts
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ══ APP STATE ══════════════════════════════════════════════ */
const state = {
  user: null,
  currentPage: 'dashboard',
  currentRoom: null,
  currentChatRoom: null,
  joined: [],          // community IDs user has joined
  posts: {},           // posts per community
  xp: 0,
  level: 1,
  postCount: 0,
  likeCount: 0,
  gamesPlayed: 0,
  challengesDone: [],
  chatFilter: 'all',
};

/* ══ DATA ════════════════════════════════════════════════════ */
const AVATARS = ['🦊','🐉','🌙','⚡','🔮','🎭','🦅','🌸','🐺','🦁','🤖','🎴'];

const COMMUNITIES = [
  { id:'coding',   name:'Coding',         icon:'💻', color:'#00f5ff', tag:'tech',      members:12840, desc:'Code, debug, ship. Collaborate with dev minds around the world.'},
  { id:'anime',    name:'Anime',          icon:'🎌', color:'#ff4eb8', tag:'creative',  members:34200, desc:'Seasonal picks, fan art, AMV recommendations and deep dives.'},
  { id:'gaming',   name:'Gaming',         icon:'🎮', color:'#b44eff', tag:'games',     members:28500, desc:'From indie to AAA — strats, reviews, multiplayer parties.'},
  { id:'painting', name:'Painting',       icon:'🎨', color:'#ff7a2f', tag:'creative',  members: 8900, desc:'Digital art, watercolors, character design and critique circles.'},
  { id:'cars',     name:'Cars',           icon:'🚗', color:'#ffe44e', tag:'lifestyle', members:11200, desc:'JDM culture, builds, race news, and drift showcases.'},
  { id:'books',    name:'Books',          icon:'📚', color:'#39ff7e', tag:'creative',  members: 7400, desc:'Light novels, manga, fiction — your next read is here.'},
  { id:'crochet',  name:'Crochet',        icon:'🧶', color:'#ff4eb8', tag:'creative',  members: 4100, desc:'Cozy crafts, amigurumi patterns, and yarn swap threads.'},
  { id:'fitness',  name:'Fitness',        icon:'🏋️', color:'#ff7a2f', tag:'lifestyle', members:15600, desc:'Gains, runs, meal plans and accountability partners.'},
  { id:'shopping', name:'Online Shopping',icon:'🛍️', color:'#b44eff', tag:'lifestyle', members:21000, desc:'Deals, hauls, unboxings and shopping advice.'},
  { id:'teaching', name:'Teaching & Learning',icon:'👩‍🏫',color:'#00f5ff',tag:'tech',members:9300,desc:'Study groups, resource sharing, tutoring offers and skill swaps.'},
];

const ROOM_THEMES = {
  coding:   { bg:'linear-gradient(135deg,#001a1a,#001233)', accent:'#00f5ff' },
  anime:    { bg:'linear-gradient(135deg,#1a0022,#200011)', accent:'#ff4eb8' },
  gaming:   { bg:'linear-gradient(135deg,#0d0020,#1a0033)', accent:'#b44eff' },
  painting: { bg:'linear-gradient(135deg,#1a0d00,#1a1000)', accent:'#ff7a2f' },
  cars:     { bg:'linear-gradient(135deg,#1a1400,#0d0d00)', accent:'#ffe44e' },
  books:    { bg:'linear-gradient(135deg,#001a08,#001a10)', accent:'#39ff7e' },
  crochet:  { bg:'linear-gradient(135deg,#1a0011,#1a001a)', accent:'#ff4eb8' },
  fitness:  { bg:'linear-gradient(135deg,#1a0800,#1a0a00)', accent:'#ff7a2f' },
  shopping: { bg:'linear-gradient(135deg,#12001a,#0a0018)', accent:'#b44eff' },
  teaching: { bg:'linear-gradient(135deg,#001a1a,#001120)', accent:'#00f5ff' },
};

const SEED_POSTS = {
  coding: [
    { user:'0x_Kira', av:'🤖', text:'Just deployed a WebGL particle system in 60fps. Took 3 days but the result is 🔥', time:'2h ago', likes:42 },
    { user:'neonDev', av:'⚡', text:'Hot take: TypeScript strict mode is non-negotiable after you\'ve lived without it for a year.', time:'5h ago', likes:89 },
  ],
  anime: [
    { user:'SakuraChan', av:'🌸', text:'Dungeon Meshi season 2 just hit different. The lore is insane this cour.', time:'1h ago', likes:130 },
    { user:'DragonScale', av:'🐉', text:'Finally finished Frieren. I cried. A lot. 10/10 no notes.', time:'3h ago', likes:204 },
  ],
  gaming: [
    { user:'NightBlade', av:'🔮', text:'Found an insane strat in the new patch that triples your clear speed. DM me for details.', time:'30m ago', likes:67 },
    { user:'Vexora', av:'🦅', text:'The new open world map is MASSIVE. I\'ve been exploring for 4 hours and still finding new areas.', time:'2h ago', likes:95 },
  ],
  painting: [
    { user:'PigmentKing', av:'🎨', text:'Tutorial drop: how I do my cel-shading in Procreate. Link in bio.', time:'4h ago', likes:312 },
    { user:'BlueSky', av:'🌙', text:'Commission slots open! DM for rates. Specializing in character portraits.', time:'6h ago', likes:58 },
  ],
};

const CHAT_ROOMS = [
  { id:'global',  name:'🌐 Global Lounge',  online:142 },
  { id:'coding',  name:'💻 Dev Corner',      online: 38 },
  { id:'anime',   name:'🎌 Anime Café',      online: 75 },
  { id:'gaming',  name:'🎮 Game Hub',        online: 93 },
  { id:'chill',   name:'☕ Chill Zone',      online: 29 },
];

const CHAT_BOTS = [
  { name:'SakuraChan', av:'🌸' },
  { name:'NightBlade', av:'🔮' },
  { name:'DragonScale', av:'🐉' },
  { name:'neonDev',    av:'⚡' },
  { name:'Vexora',     av:'🦅' },
];

const BOT_MESSAGES = {
  global:  ['Welcome to InterestVerse! 🎉', 'Just discovered this place, loving it so far!', 'Anyone here into both coding AND anime? 👀', 'This UI is insane 🔥', 'First time here, say hi!'],
  coding:  ['Anyone using Bun for their projects?', 'Just solved a DP problem after 3 hours 😤', 'TypeScript 5.5 drops new features!', 'VS Code or Neovim — fight me.', 'Hot reload is so satisfying ✨'],
  anime:   ['Frieren > everything change my mind', 'New season chart just dropped!', 'Solo Leveling anime adaptation is 🔥', 'Recommend me a mecha anime pls', 'Currently re-watching Code Geass'],
  gaming:  ['GG that last match', 'Who\'s grinding ranked tonight?', 'New patch buffed my main 🎉', 'Looking for co-op partners', 'That final boss took me 47 tries...'],
  chill:   ['Coffee ☕ or matcha 🍵?', 'Lo-fi music recs?', 'What\'s everyone\'s vibe today', 'Just chilling, hbu?', 'This app is my new addiction'],
};

const CHALLENGES = [
  { id:'c1', icon:'💻', title:'First Post', desc:'Post in any community', reward:'+30 XP', xp:30, target:1, type:'post' },
  { id:'c2', icon:'🤝', title:'Community Joiner', desc:'Join 3 communities', reward:'+50 XP', xp:50, target:3, type:'join' },
  { id:'c3', icon:'🎮', title:'Game On!', desc:'Play any mini-game', reward:'+40 XP', xp:40, target:1, type:'game' },
  { id:'c4', icon:'💬', title:'Chatterbox', desc:'Send 5 chat messages', reward:'+25 XP', xp:25, target:5, type:'chat' },
  { id:'c5', icon:'❤️', title:'Show Love', desc:'Like 3 posts', reward:'+20 XP', xp:20, target:3, type:'like' },
];

const ACHIEVEMENTS = [
  { icon:'🌟', name:'First Steps', condition: s => s.postCount >= 1 },
  { icon:'🔥', name:'On Fire', condition: s => s.xp >= 100 },
  { icon:'🤝', name:'Social', condition: s => s.joined.length >= 3 },
  { icon:'🎮', name:'Gamer', condition: s => s.gamesPlayed >= 1 },
  { icon:'💬', name:'Talker', condition: s => true }, // always shown for demo
  { icon:'⭐', name:'Veteran', condition: s => s.level >= 3 },
  { icon:'🏆', name:'Champion', condition: s => s.xp >= 500 },
  { icon:'🎯', name:'Focused', condition: s => s.challengesDone.length >= 3 },
];

/* ══ PARTICLE CANVAS ════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(a,b){ return a + Math.random()*(b-a); }

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: rand(0,1), y: rand(0,1),
      vx: rand(-0.0002,0.0002), vy: rand(-0.0002,0.0002),
      r: rand(0.5,2),
      alpha: rand(0.1,0.5),
      color: ['#00f5ff','#b44eff','#ff4eb8','#ffffff'][Math.floor(rand(0,4))],
    });
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x*W, p.y*H, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // connection lines
    for (let i=0; i<particles.length; i++) {
      for (let j=i+1; j<particles.length; j++) {
        const dx = (particles[i].x-particles[j].x)*W;
        const dy = (particles[i].y-particles[j].y)*H;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x*W, particles[i].y*H);
          ctx.lineTo(particles[j].x*W, particles[j].y*H);
          ctx.strokeStyle = '#00f5ff';
          ctx.globalAlpha = (1 - dist/100) * 0.06;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══ LOADING ════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const ls = document.getElementById('loadingScreen');
    ls.style.opacity = '0';
    ls.style.transition = 'opacity .5s';
    setTimeout(() => {
      ls.style.display = 'none';
      showScreen('authScreen');
    }, 500);
  }, 2200);
});

/* ══ SCREEN MANAGER ─────────────────────────────────────── */
function showScreen(id) {
  ['authScreen','appScreen'].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
}

/* ══ AUTH ═══════════════════════════════════════════════════ */
function switchAuthTab(tab) {
  const slider = document.getElementById('authTabSlider');
  const signIn = document.getElementById('signInForm');
  const signUp = document.getElementById('signUpForm');
  const tabSI  = document.getElementById('tabSignIn');
  const tabSU  = document.getElementById('tabSignUp');

  if (tab === 'signin') {
    slider.style.transform = 'translateX(0)';
    signIn.classList.remove('hidden');
    signUp.classList.add('hidden');
    tabSI.classList.add('active');
    tabSU.classList.remove('active');
  } else {
    slider.style.transform = 'translateX(100%)';
    signIn.classList.add('hidden');
    signUp.classList.remove('hidden');
    tabSI.classList.remove('active');
    tabSU.classList.add('active');
  }
}

function toggleChip(el) {
  el.classList.toggle('selected');
}

// Password strength meter
document.addEventListener('DOMContentLoaded', () => {
  const pw = document.getElementById('suPassword');
  if (pw) pw.addEventListener('input', () => {
    const v = pw.value;
    const bar = document.querySelector('.ps-bar');
    let strength = 0;
    if (v.length > 5) strength++;
    if (v.length > 9) strength++;
    if (/[A-Z]/.test(v)) strength++;
    if (/[0-9]/.test(v)) strength++;
    if (/[^A-Za-z0-9]/.test(v)) strength++;
    const pct = (strength/5)*100;
    bar.style.width = pct + '%';
    bar.style.background = pct < 40 ? '#ff3b5c' : pct < 70 ? '#ff7a2f' : '#39ff7e';
  });
});

function handleSignIn(e) {
  e.preventDefault();
  const username = document.getElementById('siUsername').value || 'Explorer';
  loginUser(username, username[0].toUpperCase() + username.slice(1));
}

function handleSignUp(e) {
  e.preventDefault();
  const display  = document.getElementById('suDisplayName').value || 'Explorer';
  const username = document.getElementById('suUsername').value    || 'explorer';
  const chips = document.querySelectorAll('.ip-chip.selected');
  chips.forEach(c => {
    const comm = COMMUNITIES.find(cm => cm.id === c.dataset.val.toLowerCase());
    if (comm && !state.joined.includes(comm.id)) state.joined.push(comm.id);
  });
  loginUser(username, display);
}

function loginUser(username, displayName) {
  state.user = { username, displayName, avatar: '🦊', bio: '', kanji: '夢' };
  showToast('success', '🎉', `Welcome to InterestVerse, ${displayName}!`);
  showScreen('appScreen');
  initApp();
}

function logout() {
  state.user = null;
  state.joined = [];
  state.xp = 0; state.level = 1; state.postCount = 0;
  showToast('info', '👋', 'Logged out. See you soon!');
  setTimeout(() => showScreen('authScreen'), 300);
}

/* ══ APP INIT ════════════════════════════════════════════════ */
function initApp() {
  buildDashboard();
  buildCommunities();
  buildChatSidebar();
  buildProfilePage();
  updateNavXP();
  showPage('dashboard');
}

/* ══ NAVIGATION ══════════════════════════════════════════════ */
function showPage(name) {
  const pages = {
    dashboard:   'pageDashboard',
    communities: 'pageCommunities',
    room:        'pageCommunityRoom',
    games:       'pageGames',
    chat:        'pageChat',
    profile:     'pageProfile',
  };
  Object.values(pages).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(pages[name]);
  if (target) target.classList.remove('hidden');

  state.currentPage = name;

  // Nav active state
  ['navDash','navComm','navGames','navChat','navProfile'].forEach(id => {
    document.getElementById(id)?.classList.remove('active');
  });
  const navMap = {
    dashboard:'navDash', communities:'navComm', room:'navComm',
    games:'navGames', chat:'navChat', profile:'navProfile',
  };
  if (navMap[name]) document.getElementById(navMap[name])?.classList.add('active');

  // Close emoji picker
  document.getElementById('emojiPicker')?.classList.add('hidden');
}

/* ══ DASHBOARD ═══════════════════════════════════════════════ */
function buildDashboard() {
  // Greeting
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name  = state.user?.displayName || 'Explorer';
  document.getElementById('dashGreeting').textContent = `${greet}, ${name} 👋`;

  // Hero
  updateHeroStats();

  // Challenges
  buildChallenges();

  // Community grid (joined ones or all if none joined)
  buildDashCommunityGrid();

  // Trending
  buildTrending();
}

function updateHeroStats() {
  document.getElementById('hsbJoined').textContent = state.joined.length;
  document.getElementById('hsbLevel').textContent  = state.level;
  document.getElementById('hsbXP').textContent     = state.xp;
  document.getElementById('heroAvatarEmoji').textContent  = state.user?.avatar || '🦊';
  document.getElementById('navAvatarEmoji').textContent   = state.user?.avatar || '🦊';
  document.getElementById('profileAvatarEmoji').textContent = state.user?.avatar || '🦊';
}

function buildChallenges() {
  const row = document.getElementById('challengesRow');
  row.innerHTML = '';
  CHALLENGES.forEach(ch => {
    const done  = state.challengesDone.includes(ch.id);
    const prog  = getChallengeProgress(ch);
    const pct   = Math.min(100, (prog / ch.target)*100);
    const card  = document.createElement('div');
    card.className = 'challenge-card';
    if (done) card.style.opacity = '.6';
    card.innerHTML = `
      <div class="cc-icon">${ch.icon}</div>
      <div class="cc-title">${ch.title}</div>
      <div class="cc-desc">${ch.desc}</div>
      <span class="cc-reward">${done ? '✅ Complete' : ch.reward}</span>
      <div class="cc-progress-bar"><div class="cc-progress-fill" style="width:${pct}%"></div></div>
    `;
    card.addEventListener('click', () => completeChallenge(ch));
    row.appendChild(card);
  });
}

function getChallengeProgress(ch) {
  if (ch.type === 'post')  return state.postCount;
  if (ch.type === 'join')  return state.joined.length;
  if (ch.type === 'game')  return state.gamesPlayed;
  if (ch.type === 'chat')  return parseInt(localStorage.getItem('iv_chatCount')||0);
  if (ch.type === 'like')  return state.likeCount;
  return 0;
}

function completeChallenge(ch) {
  if (state.challengesDone.includes(ch.id)) { showToast('info','ℹ️','Already completed!'); return; }
  const prog = getChallengeProgress(ch);
  if (prog < ch.target) {
    showToast('info','🎯', `Progress: ${prog}/${ch.target} — keep going!`); return;
  }
  state.challengesDone.push(ch.id);
  gainXP(ch.xp, `Challenge: ${ch.title}`);
  buildChallenges();
}

function buildDashCommunityGrid() {
  const grid = document.getElementById('communityGrid');
  grid.innerHTML = '';
  const display = state.joined.length > 0
    ? COMMUNITIES.filter(c => state.joined.includes(c.id))
    : COMMUNITIES.slice(0,6);

  display.forEach(comm => {
    const card = document.createElement('div');
    card.className = 'comm-card';
    card.innerHTML = `
      <div class="cc-cover" style="background:${comm.color}22;">
        <div class="cc-cover-emoji">${comm.icon}</div>
        ${state.joined.includes(comm.id) ? '<div class="cc-joined-badge">✓ Joined</div>' : ''}
      </div>
      <div class="cc-body">
        <div class="cc-name">${comm.name}</div>
        <div class="cc-members">👥 ${(comm.members).toLocaleString()} members</div>
      </div>
    `;
    card.addEventListener('click', () => openRoom(comm.id));
    grid.appendChild(card);
  });
}

function buildTrending() {
  const list = document.getElementById('trendingList');
  list.innerHTML = '';
  const trending = [...COMMUNITIES].sort((a,b) => b.members - a.members).slice(0,5);
  trending.forEach((c,i) => {
    const item = document.createElement('div');
    item.className = 'trend-item';
    item.innerHTML = `
      <span class="trend-rank">#${i+1}</span>
      <span class="trend-icon">${c.icon}</span>
      <div class="trend-info">
        <div class="trend-name">${c.name}</div>
        <div class="trend-sub">${c.desc.slice(0,45)}...</div>
      </div>
      <span class="trend-stat">${(c.members/1000).toFixed(1)}K</span>
    `;
    item.addEventListener('click', () => openRoom(c.id));
    list.appendChild(item);
  });
}

/* ══ COMMUNITIES PAGE ════════════════════════════════════════ */
function buildCommunities() {
  const grid = document.getElementById('allCommGrid');
  grid.innerHTML = '';
  COMMUNITIES.forEach(comm => renderCommCard(comm, grid));
}

function renderCommCard(comm, container) {
  const joined = state.joined.includes(comm.id);
  const card   = document.createElement('div');
  card.className  = 'full-comm-card';
  card.dataset.id  = comm.id;
  card.dataset.tag = comm.tag;
  card.dataset.name= comm.name.toLowerCase();
  card.innerHTML = `
    <div class="fcc-banner" style="background:${comm.color}22;">
      ${comm.icon}
      <span class="fcc-tag">${comm.tag}</span>
    </div>
    <div class="fcc-body">
      <div class="fcc-name">${comm.icon} ${comm.name}</div>
      <div class="fcc-desc">${comm.desc}</div>
      <div class="fcc-footer">
        <span class="fcc-members">👥 ${comm.members.toLocaleString()}</span>
        <button class="fcc-join-btn ${joined?'leave':'join'}"
          onclick="event.stopPropagation();toggleJoinComm('${comm.id}',this)">
          ${joined ? 'Leave' : 'Join'}
        </button>
      </div>
    </div>
  `;
  card.addEventListener('click', () => openRoom(comm.id));
  container.appendChild(card);
}

function filterComm() {
  const q = document.getElementById('commSearch').value.toLowerCase();
  document.querySelectorAll('.full-comm-card').forEach(card => {
    const match = card.dataset.name.includes(q);
    card.style.display = match ? '' : 'none';
  });
}

function filterCommTag(btn, tag) {
  document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.full-comm-card').forEach(card => {
    card.style.display = (tag === 'all' || card.dataset.tag === tag) ? '' : 'none';
  });
}

function toggleJoinComm(id, btn) {
  if (state.joined.includes(id)) {
    state.joined = state.joined.filter(j => j !== id);
    btn.textContent = 'Join';
    btn.className   = 'fcc-join-btn join';
    showToast('info','👋',`Left ${COMMUNITIES.find(c=>c.id===id).name}`);
  } else {
    state.joined.push(id);
    btn.textContent = 'Leave';
    btn.className   = 'fcc-join-btn leave';
    gainXP(15, 'Joined a community');
    showToast('success','🎉',`Joined ${COMMUNITIES.find(c=>c.id===id).name}!`);
    checkChallenge('join');
  }
  updateHeroStats();
  buildDashCommunityGrid();
  updateProfileComms();
}

/* ══ COMMUNITY ROOM ══════════════════════════════════════════ */
function openRoom(id) {
  const comm = COMMUNITIES.find(c => c.id === id);
  if (!comm) return;
  state.currentRoom = id;

  // Set theme
  const theme = ROOM_THEMES[id] || {};
  const roomPage = document.getElementById('pageCommunityRoom');
  roomPage.style.background = theme.bg || '';

  document.getElementById('roomIcon').textContent  = comm.icon;
  document.getElementById('roomTitle').textContent = comm.name;
  document.getElementById('roomSub').textContent   = `${comm.members.toLocaleString()} members`;

  const joinBtn = document.getElementById('joinRoomBtn');
  if (state.joined.includes(id)) {
    joinBtn.textContent = 'Joined ✓';
    joinBtn.classList.add('joined');
  } else {
    joinBtn.textContent = 'Join Community';
    joinBtn.classList.remove('joined');
  }

  document.getElementById('pcAvatar').textContent = state.user?.avatar || '🦊';

  // Load posts
  buildPostsFeed(id);

  showPage('room');
}

function buildPostsFeed(commId) {
  const feed = document.getElementById('postsFeed');
  feed.innerHTML = '';
  const posts = [...(SEED_POSTS[commId] || []), ...(state.posts[commId] || [])].reverse();
  if (!posts.length) {
    feed.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem;">Be the first to post here!</p>';
    return;
  }
  posts.forEach(p => renderPost(p, feed));
}

function renderPost(p, container) {
  const div = document.createElement('div');
  div.className = 'post-card';
  div.innerHTML = `
    <div class="post-header">
      <div class="post-av">${p.av||'🦊'}</div>
      <span class="post-user">${p.user}</span>
      <span class="post-time">${p.time}</span>
    </div>
    <div class="post-content">${p.text}</div>
    <div class="post-actions">
      <div class="post-action-btn" onclick="likePost(this)">
        <span>❤️</span> <span class="like-count">${p.likes||0}</span>
      </div>
      <div class="post-action-btn" onclick="commentPost(this)">
        <span>💬</span> Comment
      </div>
      <div class="post-action-btn" onclick="sharePost(this)">
        <span>🔗</span> Share
      </div>
    </div>
  `;
  container.appendChild(div);
}

function toggleJoinRoom() {
  const id  = state.currentRoom;
  const btn = document.getElementById('joinRoomBtn');
  if (state.joined.includes(id)) {
    state.joined = state.joined.filter(j => j !== id);
    btn.textContent = 'Join Community';
    btn.classList.remove('joined');
    showToast('info','👋','Left the community');
  } else {
    state.joined.push(id);
    btn.textContent = 'Joined ✓';
    btn.classList.add('joined');
    gainXP(15,'Joined a community');
    showToast('success','🎉','Joined community!');
    checkChallenge('join');
  }
  updateHeroStats();
  buildDashCommunityGrid();
  updateProfileComms();
  // refresh the community page cards
  document.querySelectorAll(`.full-comm-card[data-id="${id}"] .fcc-join-btn`).forEach(btn2 => {
    if (state.joined.includes(id)) { btn2.textContent='Leave'; btn2.className='fcc-join-btn leave'; }
    else { btn2.textContent='Join'; btn2.className='fcc-join-btn join'; }
  });
}

function postContent() {
  const input = document.getElementById('pcInput');
  const text  = input.value.trim();
  if (!text) { shakeEl(input); return; }

  const id = state.currentRoom;
  if (!state.posts[id]) state.posts[id] = [];
  state.posts[id].push({
    user: state.user?.displayName || 'Explorer',
    av:   state.user?.avatar || '🦊',
    text, time: 'just now', likes: 0,
  });
  state.postCount++;
  input.value = '';
  buildPostsFeed(id);
  gainXP(20,'Post created');
  showToast('success','✅','Posted successfully!');
  checkChallenge('post');
  floatReact('🎉', null);
}

function toggleEmojiPicker() {
  document.getElementById('emojiPicker').classList.toggle('hidden');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.pc-actions')) {
    document.getElementById('emojiPicker')?.classList.add('hidden');
  }
});

// Click on emoji in picker inserts into textarea
document.getElementById('emojiPicker')?.addEventListener('click', e => {
  const em = e.target.textContent.trim();
  if (em) {
    const ta = document.getElementById('pcInput');
    ta.value += em;
    ta.focus();
  }
});

function likePost(btn) {
  if (btn.classList.contains('liked')) return;
  btn.classList.add('liked');
  const count = btn.querySelector('.like-count');
  count.textContent = parseInt(count.textContent) + 1;
  state.likeCount++;
  gainXP(5,'Liked a post');
  floatReact('❤️', btn);
  checkChallenge('like');
}

function commentPost(btn) {
  showToast('info','💬','Comments coming soon in a future update!');
}
function sharePost(btn) {
  showToast('info','🔗','Post link copied to clipboard!');
  floatReact('🔗', btn);
}

/* ══ GAMES ═══════════════════════════════════════════════════ */
function launchGame(id) {
  document.getElementById('gamesHub').classList.add('hidden');
  document.getElementById(`game${id.charAt(0).toUpperCase()+id.slice(1)}`).classList.remove('hidden');
  state.gamesPlayed++;
  checkChallenge('game');
}

function closeGame() {
  ['gameClick','gameMemory','gameReaction'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('gamesHub').classList.remove('hidden');
  resetGames();
}

function resetGames() {
  clearInterval(clickTimer);
  clearInterval(memTimer);
  clearTimeout(reactionTimeout);
  clickRunning = false; memRunning = false; reactionRunning = false;
}

/* ── CLICK WARRIOR ── */
let clickRunning = false, clickCount = 0, clickTimerVal = 10, clickTimer;
let clickBest = parseInt(localStorage.getItem('iv_clickBest')||0);

function startClickGame() {
  if (clickRunning) return;
  clickRunning = true;
  clickCount   = 0;
  clickTimerVal= 10;
  document.getElementById('cgClicks').textContent = 0;
  document.getElementById('cgTimer').textContent  = 10;
  document.getElementById('cgBest').textContent   = clickBest;
  document.getElementById('clickResult').classList.add('hidden');
  document.getElementById('clickStartBtn').disabled = true;

  clickTimer = setInterval(() => {
    clickTimerVal--;
    document.getElementById('cgTimer').textContent = clickTimerVal;
    if (clickTimerVal <= 0) {
      clearInterval(clickTimer);
      clickRunning = false;
      document.getElementById('clickStartBtn').disabled = false;
      if (clickCount > clickBest) {
        clickBest = clickCount;
        localStorage.setItem('iv_clickBest', clickBest);
      }
      document.getElementById('cgBest').textContent = clickBest;
      const xpEarned = Math.min(50, Math.floor(clickCount/2));
      gainXP(xpEarned, 'Click Warrior game');
      const res = document.getElementById('clickResult');
      res.textContent = `⚡ ${clickCount} clicks! +${xpEarned} XP earned!`;
      res.classList.remove('hidden');
      floatReact('⚡', null);
    }
  }, 1000);
}

function registerClick() {
  if (!clickRunning) return;
  clickCount++;
  document.getElementById('cgClicks').textContent = clickCount;
  // Visual feedback
  const btn = document.getElementById('clickTarget');
  btn.style.transform = 'scale(0.92)';
  setTimeout(() => btn.style.transform = 'scale(1)', 80);
}

/* ── MEMORY REALM ── */
let memRunning = false, memFlipped = [], memMatched = 0, memMoves = 0, memTimerVal = 60, memTimer;
const MEM_EMOJIS = ['🌸','🔮','🐉','⚡','🎌','🏋️','🎮','💻'];

function startMemoryGame() {
  memRunning = true; memFlipped = []; memMatched = 0; memMoves = 0; memTimerVal = 60;
  document.getElementById('mgMoves').textContent   = 0;
  document.getElementById('mgMatches').textContent = 0;
  document.getElementById('mgTimer').textContent   = 60;
  document.getElementById('memoryResult').classList.add('hidden');
  document.getElementById('memoryStartBtn').disabled = true;
  buildMemoryGrid();
  memTimer = setInterval(() => {
    memTimerVal--;
    document.getElementById('mgTimer').textContent = memTimerVal;
    if (memTimerVal <= 0) { clearInterval(memTimer); endMemoryGame(false); }
  }, 1000);
}

function buildMemoryGrid() {
  const pairs = [...MEM_EMOJIS, ...MEM_EMOJIS].sort(() => Math.random()-.5);
  const grid  = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  pairs.forEach((em, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.val = em;
    card.dataset.idx = i;
    card.innerHTML = `<div class="mem-back">❓</div><div class="mem-front">${em}</div>`;
    card.addEventListener('click', flipMemCard);
    grid.appendChild(card);
  });
}

function flipMemCard() {
  if (!memRunning) return;
  if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
  if (memFlipped.length >= 2) return;
  this.classList.add('flipped');
  memFlipped.push(this);
  if (memFlipped.length === 2) {
    memMoves++;
    document.getElementById('mgMoves').textContent = memMoves;
    setTimeout(checkMemMatch, 700);
  }
}

function checkMemMatch() {
  const [a, b] = memFlipped;
  if (a.dataset.val === b.dataset.val) {
    a.classList.add('matched'); b.classList.add('matched');
    memMatched++;
    document.getElementById('mgMatches').textContent = memMatched;
    floatReact('✨', null);
    if (memMatched === MEM_EMOJIS.length) {
      clearInterval(memTimer); endMemoryGame(true);
    }
  } else {
    a.classList.remove('flipped'); b.classList.remove('flipped');
  }
  memFlipped = [];
}

function endMemoryGame(won) {
  memRunning = false;
  document.getElementById('memoryStartBtn').disabled = false;
  const xp = won ? 80 : 20;
  gainXP(xp, 'Memory Realm game');
  const res = document.getElementById('memoryResult');
  res.textContent = won
    ? `🎉 Solved in ${memMoves} moves! +${xp} XP!`
    : `⏰ Time's up! ${memMatched}/${MEM_EMOJIS.length} matches. +${xp} XP`;
  res.classList.remove('hidden');
}

/* ── REACTION BLADE ── */
let reactionRunning = false, reactionRound = 0, reactionBest = Infinity, reactionStart = 0;
let reactionTimeout, reactionWaiting = false;

function startReactionGame() {
  reactionRunning = true; reactionRound = 0; reactionBest = Infinity;
  document.getElementById('rgRound').textContent = '0/5';
  document.getElementById('rgBest').textContent  = '—';
  document.getElementById('rgLast').textContent  = '—';
  document.getElementById('reactionResult').classList.add('hidden');
  document.getElementById('reactionStartBtn').disabled = true;
  nextReactionRound();
}

function nextReactionRound() {
  if (reactionRound >= 5) { endReactionGame(); return; }
  const msg = document.getElementById('raMsg');
  const tgt = document.getElementById('raTarget');
  msg.textContent = 'Get ready...';
  msg.classList.remove('hidden');
  tgt.classList.add('hidden');
  reactionWaiting = false;
  const delay = 1000 + Math.random() * 3000;
  reactionTimeout = setTimeout(() => {
    const arena = document.getElementById('reactionArena');
    const maxX = arena.clientWidth - 80;
    const maxY = arena.clientHeight - 80;
    tgt.style.left = Math.random() * maxX + 'px';
    tgt.style.top  = Math.random() * maxY + 'px';
    msg.classList.add('hidden');
    tgt.classList.remove('hidden');
    reactionStart   = performance.now();
    reactionWaiting = true;
    // Miss timeout
    reactionTimeout = setTimeout(() => {
      if (reactionWaiting) { reactionWaiting = false; tgt.classList.add('hidden'); msg.textContent = 'Too slow!'; msg.classList.remove('hidden'); setTimeout(nextReactionRound, 900); }
    }, 2500);
  }, delay);
}

function hitTarget() {
  if (!reactionWaiting) return;
  clearTimeout(reactionTimeout);
  reactionWaiting = false;
  const ms = Math.round(performance.now() - reactionStart);
  document.getElementById('rgLast').textContent = ms;
  if (ms < reactionBest) {
    reactionBest = ms;
    document.getElementById('rgBest').textContent = ms;
  }
  reactionRound++;
  document.getElementById('rgRound').textContent = `${reactionRound}/5`;
  floatReact('⚔️', null);
  document.getElementById('raTarget').classList.add('hidden');
  document.getElementById('raMsg').textContent = `${ms}ms!`;
  document.getElementById('raMsg').classList.remove('hidden');
  setTimeout(nextReactionRound, 800);
}

function endReactionGame() {
  reactionRunning = false;
  document.getElementById('reactionStartBtn').disabled = false;
  const xp = reactionBest < 300 ? 60 : reactionBest < 500 ? 45 : 30;
  gainXP(xp, 'Reaction Blade game');
  const res = document.getElementById('reactionResult');
  res.textContent = `🏆 Best: ${reactionBest === Infinity ? '—' : reactionBest + 'ms'}! +${xp} XP`;
  res.classList.remove('hidden');
}

/* ══ CHAT ════════════════════════════════════════════════════ */
let chatCount = parseInt(localStorage.getItem('iv_chatCount')||0);

function buildChatSidebar() {
  const rooms = document.getElementById('chatRooms');
  rooms.innerHTML = '';
  CHAT_ROOMS.forEach(r => {
    const item = document.createElement('div');
    item.className = 'cr-item';
    item.dataset.id = r.id;
    item.innerHTML = `<span class="cr-dot"></span>${r.name}`;
    item.addEventListener('click', () => openChatRoom(r.id));
    rooms.appendChild(item);
  });
}

function openChatRoom(id) {
  state.currentChatRoom = id;
  document.querySelectorAll('.cr-item').forEach(el => el.classList.toggle('active', el.dataset.id === id));
  const room = CHAT_ROOMS.find(r => r.id === id);
  document.getElementById('chatRoomName').textContent = room.name;
  document.getElementById('chatOnline').textContent   = `${room.online} online`;
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML = '';
  // seed messages
  const bots = BOT_MESSAGES[id] || BOT_MESSAGES.global;
  bots.slice(0,3).forEach((msg, i) => {
    const bot = CHAT_BOTS[i % CHAT_BOTS.length];
    setTimeout(() => appendChatMsg(bot.name, bot.av, msg, false), i*300);
  });
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text || !state.currentChatRoom) {
    if (!state.currentChatRoom) showToast('info','💬','Select a chat room first!');
    else shakeEl(input);
    return;
  }
  appendChatMsg(state.user?.displayName||'Explorer', state.user?.avatar||'🦊', text, true);
  input.value = '';
  chatCount++;
  localStorage.setItem('iv_chatCount', chatCount);
  gainXP(3,'Chat message sent');
  checkChallenge('chat');
  // Bot reply
  setTimeout(() => {
    showTyping();
    const bot  = CHAT_BOTS[Math.floor(Math.random()*CHAT_BOTS.length)];
    const room = state.currentChatRoom;
    const msgs = BOT_MESSAGES[room] || BOT_MESSAGES.global;
    const reply= msgs[Math.floor(Math.random()*msgs.length)];
    setTimeout(() => { hideTyping(); appendChatMsg(bot.name, bot.av, reply, false); }, 1500 + Math.random()*1000);
  }, 500);
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

function insertChatEmoji() {
  const emojis = ['😊','🔥','💯','🎉','🚀','✨','❤️','😂','🎌','⚡'];
  const em = emojis[Math.floor(Math.random()*emojis.length)];
  document.getElementById('chatInput').value += em;
  document.getElementById('chatInput').focus();
}

function appendChatMsg(user, av, text, isMine) {
  const msgs = document.getElementById('chatMessages');
  const el   = document.createElement('div');
  el.className = `chat-msg ${isMine ? 'mine' : ''}`;
  const time = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  el.innerHTML = `
    <div class="cm-avatar">${av}</div>
    <div>
      <div class="cm-bubble">${text}</div>
      <div class="cm-meta">${user} · ${time}</div>
    </div>
  `;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const bot = CHAT_BOTS[Math.floor(Math.random()*CHAT_BOTS.length)];
  document.getElementById('typingName').textContent = bot.name;
  document.getElementById('typingIndicator').classList.remove('hidden');
}
function hideTyping() {
  document.getElementById('typingIndicator').classList.add('hidden');
}

/* ══ PROFILE ═════════════════════════════════════════════════ */
function buildProfilePage() {
  const u = state.user;
  if (!u) return;
  document.getElementById('profileName').textContent     = u.displayName || 'Explorer';
  document.getElementById('profileUsername').textContent = '@' + (u.username || 'explorer');
  document.getElementById('peDisplayName').value         = u.displayName || '';
  document.getElementById('peBio').value                 = u.bio         || '';
  document.getElementById('peKanji').value               = u.kanji       || '夢';
  updateProfileStats();
  buildAvatarPicker();
  updateProfileComms();
  buildAchievements();
}

function updateProfileStats() {
  document.getElementById('psJoined').textContent = state.joined.length;
  document.getElementById('psPosts').textContent  = state.postCount;
  document.getElementById('psLikes').textContent  = state.likeCount;
  document.getElementById('psGames').textContent  = state.gamesPlayed;
  const xpForLevel = state.level * 500;
  const xpPct = Math.min(100, (state.xp % 500) / 5);
  document.getElementById('profileXpFill').style.width = xpPct + '%';
  document.getElementById('profileXpTxt').textContent  = `${state.xp % 500} / 500 XP`;
  const titles = ['Novice','Apprentice','Explorer','Wanderer','Champion','Legend'];
  const title  = titles[Math.min(state.level-1, titles.length-1)];
  document.getElementById('profileLevelBadge').textContent = `Level ${state.level} · ${title}`;
}

function buildAvatarPicker() {
  const grid = document.getElementById('apGrid');
  grid.innerHTML = '';
  AVATARS.forEach(av => {
    const item = document.createElement('div');
    item.className = 'ap-item' + (av === state.user?.avatar ? ' active' : '');
    item.textContent = av;
    item.addEventListener('click', () => selectAvatar(av));
    grid.appendChild(item);
  });
}

function selectAvatar(av) {
  state.user.avatar = av;
  updateHeroStats();
  buildAvatarPicker();
  showToast('success','🎭','Avatar updated!');
}

function updateProfileComms() {
  const chips = document.getElementById('profileCommChips');
  chips.innerHTML = '';
  if (!state.joined.length) {
    chips.innerHTML = '<span style="color:var(--muted);font-size:.85rem">No communities joined yet</span>';
    return;
  }
  state.joined.forEach(id => {
    const comm = COMMUNITIES.find(c => c.id === id);
    if (!comm) return;
    const chip = document.createElement('span');
    chip.className   = 'pc-chip';
    chip.textContent = `${comm.icon} ${comm.name}`;
    chips.appendChild(chip);
  });
}

function buildAchievements() {
  const grid = document.getElementById('achGrid');
  grid.innerHTML = '';
  ACHIEVEMENTS.forEach(ach => {
    const unlocked = ach.condition(state);
    const el = document.createElement('div');
    el.className = 'ach-badge' + (unlocked ? '' : ' locked');
    el.innerHTML = `<span class="ach-icon">${ach.icon}</span><div class="ach-name">${ach.name}</div>`;
    el.title = unlocked ? ach.name + ' — Unlocked!' : 'Locked';
    grid.appendChild(el);
  });
}

function saveProfile() {
  if (!state.user) return;
  state.user.displayName = document.getElementById('peDisplayName').value || state.user.displayName;
  state.user.bio         = document.getElementById('peBio').value;
  state.user.kanji       = document.getElementById('peKanji').value || '夢';
  document.getElementById('profileName').textContent = state.user.displayName;
  document.getElementById('profileUsername').textContent = '@' + state.user.username;
  document.getElementById('dashGreeting').textContent =
    `Good day, ${state.user.displayName} 👋`;
  showToast('success','✅','Profile saved!');
  gainXP(10,'Profile updated');
}

/* ══ XP SYSTEM ═══════════════════════════════════════════════ */
function gainXP(amount, reason) {
  state.xp += amount;
  const newLevel = Math.floor(state.xp / 500) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    showToast('xp','🎊',`LEVEL UP! You're now Level ${state.level}!`);
    floatReact('🎊', null);
    floatReact('⭐', null);
    floatReact('✨', null);
  } else {
    showToast('xp','⚡',`+${amount} XP — ${reason}`);
  }
  updateNavXP();
  updateHeroStats();
  updateProfileStats();
  buildAchievements();
}

function updateNavXP() {
  const pct = (state.xp % 500) / 5;
  document.getElementById('navXpFill').style.width = pct + '%';
  document.getElementById('navXpTxt').textContent  = `${state.xp} XP`;
  document.getElementById('navLevel').textContent  = `Lv.${state.level}`;
}

function checkChallenge(type) {
  CHALLENGES.forEach(ch => {
    if (ch.type !== type) return;
    if (state.challengesDone.includes(ch.id)) return;
    const prog = getChallengeProgress(ch);
    if (prog >= ch.target) {
      state.challengesDone.push(ch.id);
      gainXP(ch.xp, `Challenge: ${ch.title}`);
      buildChallenges();
    }
  });
}

/* ══ EXPLORE RANDOM ══════════════════════════════════════════ */
function randomInterest() {
  const unjoined = COMMUNITIES.filter(c => !state.joined.includes(c.id));
  const pool = unjoined.length ? unjoined : COMMUNITIES;
  const pick  = pool[Math.floor(Math.random() * pool.length)];
  showToast('info',pick.icon,`Discovering: ${pick.name}!`);
  setTimeout(() => openRoom(pick.id), 600);
}

/* ══ TOAST ═══════════════════════════════════════════════════ */
function showToast(type, icon, message) {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ══ FLOATING REACTIONS ═══════════════════════════════════════ */
function floatReact(emoji, anchorEl) {
  const container = document.getElementById('floatReactions');
  const el = document.createElement('span');
  el.className   = 'float-reaction';
  el.textContent = emoji;
  let x, y;
  if (anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    x = rect.left + rect.width/2;
    y = rect.top;
  } else {
    x = window.innerWidth  / 2 + (Math.random()-0.5) * 200;
    y = window.innerHeight / 2 + (Math.random()-0.5) * 100;
  }
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  container.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

/* ══ UTILITIES ═══════════════════════════════════════════════ */
function shakeEl(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake .4s ease';
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(shakeStyle);

/* ══ CLICK RIPPLE ON ALL BUTTONS ═════════════════════════════ */
document.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn || btn.classList.contains('click-target')) return;
  const ripple = document.createElement('span');
  const rect   = btn.getBoundingClientRect();
  ripple.style.cssText = `
    position:absolute;
    width:${Math.max(rect.width,rect.height)*2}px;
    height:${Math.max(rect.width,rect.height)*2}px;
    left:${e.clientX - rect.left - Math.max(rect.width,rect.height)}px;
    top:${e.clientY - rect.top  - Math.max(rect.width,rect.height)}px;
    background:rgba(255,255,255,.08);
    border-radius:50%;
    pointer-events:none;
    transform:scale(0);
    animation:ripple-btn .5s ease forwards;
  `;
  if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-btn {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ══ SCROLL REVEAL ═══════════════════════════════════════════ */
function observeCards() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.comm-card,.full-comm-card,.challenge-card,.game-card,.trend-item'
  ).forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .4s ease ${i*0.06}s, transform .4s ease ${i*0.06}s`;
    observer.observe(el);
  });
}

// Re-run scroll reveal when pages change
const _origShowPage = showPage;
window.showPage = function(name) {
  _origShowPage(name);
  setTimeout(observeCards, 60);
};

/* ══ COMMUNITY PAGE LIVE SEARCH FIX ══════════════════════════ */
// Ensure emojiPicker is wired after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const ep = document.getElementById('emojiPicker');
  if (ep) {
    ep.addEventListener('click', e => {
      const em = e.target.textContent.trim();
      if (em && em.length <= 2) {
        const ta = document.getElementById('pcInput');
        if (ta) { ta.value += em; ta.focus(); }
      }
    });
  }
});

console.log('%c🎌 INTERESTVERSE LOADED', 'color:#00f5ff;font-family:monospace;font-size:20px;font-weight:bold;');
console.log('%cBuilt with ❤️ and lots of anime inspiration.', 'color:#b44eff;font-family:monospace;');
