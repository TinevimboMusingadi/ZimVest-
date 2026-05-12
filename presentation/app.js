// ==================== ZIMVEST PRESENTATION ENGINE ====================

const TOTAL_SLIDES = 10;
let currentSlide = 0;
let isTransitioning = false;

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  createNavDots();
  setupKeyboard();
  setupSlider();
  setupTerminal();
  drawMiniChart();
  updateSlideCounter();
});

// ==================== SLIDE NAVIGATION ====================

function goToSlide(n) {
  if (isTransitioning || n === currentSlide || n < 0 || n >= TOTAL_SLIDES) return;
  isTransitioning = true;
  const slides = document.querySelectorAll('.slide');
  const prev = slides[currentSlide];
  const next = slides[n];

  if (n > currentSlide) {
    prev.classList.remove('active');
    prev.classList.add('prev');
  } else {
    prev.classList.remove('active');
    prev.style.transform = 'scale(0.95) translateX(60px)';
    prev.style.opacity = '0';
  }

  next.classList.add('active');
  next.classList.remove('prev');

  currentSlide = n;
  updateNavDots();
  updateProgress();
  updateSlideCounter();
  triggerSlideAnimations(n);

  setTimeout(() => {
    prev.classList.remove('prev');
    prev.style.transform = '';
    prev.style.opacity = '';
    isTransitioning = false;
  }, 650);
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

// ---- Keyboard ----
function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); }
  });

  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) { diff > 0 ? nextSlide() : prevSlide(); }
  });
}

// ---- Nav Dots ----
function createNavDots() {
  const container = document.getElementById('navDots');
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    container.appendChild(dot);
  }
}

function updateNavDots() {
  document.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function updateProgress() {
  const pct = ((currentSlide + 1) / TOTAL_SLIDES) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

function updateSlideCounter() {
  const c = String(currentSlide + 1).padStart(2, '0');
  document.getElementById('slideCounter').textContent = `${c} / ${TOTAL_SLIDES}`;
}

// ==================== THEME TOGGLE ====================

document.getElementById('themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  setTimeout(drawMiniChart, 100);
  setTimeout(drawGrowthChart, 100);
});

// ==================== SLIDE-SPECIFIC ANIMATIONS ====================

function triggerSlideAnimations(n) {
  if (n === 2) animatePipeline();
  if (n === 3) drawGrowthChart();
  if (n === 4) animateFlowSteps();
  if (n === 5) { drawMiniChart(); startWebDemo(); } else { stopWebDemo(); }
  if (n === 6) { startMobileDemo(); } else { stopMobileDemo(); }
  if (n === 7) { startUssdDemo(); } else { stopUssdDemo(); }
  if (n === 8) animateFeeBars();
}

// ==================== PIPELINE ANIMATION ====================

function animatePipeline() {
  const stages = document.querySelectorAll('#pipelineContainer .pipeline-stage');
  const connectors = document.querySelectorAll('#pipelineContainer .pipeline-connector');
  stages.forEach((s, i) => {
    s.classList.remove('active');
    setTimeout(() => s.classList.add('active'), i * 400);
  });
  connectors.forEach((c, i) => {
    c.classList.remove('active');
    setTimeout(() => c.classList.add('active'), i * 400 + 200);
  });
}

// ==================== GROWTH CHART ====================

function drawGrowthChart() {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const lineColor = isDark ? '#1DB954' : '#1a237e';
  const fillColor = isDark ? 'rgba(29,185,84,0.12)' : 'rgba(26,35,126,0.08)';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#888' : '#666';

  // Projected growth data (monthly, 24 months)
  const data = [0,8,18,30,48,70,95,125,160,200,248,300,360,430,510,600,700,820,950,1100,1280,1480,1700,1950];
  const labels = ['M1','','','M4','','','M7','','','M10','','','Y1','','','M16','','','M19','','','M22','','Y2'];
  const max = Math.max(...data);
  const padL = 50, padR = 20, padT = 20, padB = 40;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = textColor; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('$' + Math.round(max - (max / 4) * i) + 'K', padL - 8, y + 4);
  }

  // X labels
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    if (l) {
      const x = padL + (i / (data.length - 1)) * chartW;
      ctx.fillStyle = textColor;
      ctx.fillText(l, x, h - 8);
    }
  });

  // Area fill
  ctx.beginPath();
  ctx.moveTo(padL, padT + chartH);
  data.forEach((d, i) => {
    const x = padL + (i / (data.length - 1)) * chartW;
    const y = padT + chartH - (d / max) * chartH;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(padL + chartW, padT + chartH);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((d, i) => {
    const x = padL + (i / (data.length - 1)) * chartW;
    const y = padT + chartH - (d / max) * chartH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // End dot
  const lastX = padL + chartW;
  const lastY = padT + chartH - (data[data.length - 1] / max) * chartH;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
  ctx.fillStyle = lineColor;
  ctx.fill();

  // Chart title
  ctx.fillStyle = textColor;
  ctx.font = '12px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Projected Users (thousands) — 24 Month Runway', padL, padT - 6);
}

// ---- Flow Steps ----
function animateFlowSteps() {
  const steps = document.querySelectorAll('#flowContainer .flow-step');
  steps.forEach((s, i) => {
    s.classList.remove('active');
    setTimeout(() => s.classList.add('active'), i * 300);
  });
}

// ---- Fee Bars ----
function animateFeeBars() {
  setTimeout(() => { document.getElementById('fee1').style.width = '25%'; }, 200);
  setTimeout(() => { document.getElementById('fee2').style.width = '60%'; }, 400);
  setTimeout(() => { document.getElementById('fee3').style.width = '10%'; }, 600);
}

// ==================== WEB UI SLIDER ====================

function setupSlider() {
  const slider = document.getElementById('allocSlider');
  if (!slider) return;
  slider.addEventListener('input', () => {
    const total = 200;
    const familyPct = parseInt(slider.value);
    const familyAmt = (total * familyPct / 100).toFixed(2);
    const investAmt = (total * (100 - familyPct) / 100).toFixed(2);
    document.getElementById('familyVal').textContent = '$' + familyAmt;
    document.getElementById('investVal').textContent = '$' + investAmt;
  });
}

// ==================== MINI CHART ====================

function drawMiniChart() {
  const canvas = document.getElementById('miniChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const data = [20,25,22,30,28,35,32,40,38,45,42,50,48,55,52,60,58,65,62,68,70,72,75,78,80,82,85,88,90,92];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const lineColor = isDark ? '#1DB954' : '#1a237e';
  const fillColor = isDark ? 'rgba(29,185,84,0.15)' : 'rgba(26,35,126,0.1)';

  ctx.beginPath();
  ctx.moveTo(0, h);
  data.forEach((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / range) * (h - 10) - 5;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.beginPath();
  data.forEach((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / range) * (h - 10) - 5;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  const lastX = w;
  const lastY = h - ((data[data.length - 1] - min) / range) * (h - 10) - 5;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fillStyle = lineColor;
  ctx.fill();
}

// ==================== MOBILE PHONE PAGES ====================

let currentPhonePage = 0;

function showPhonePage(n) {
  const pages = document.querySelectorAll('.phone-page');
  const btns = document.querySelectorAll('.phone-nav-btn');
  pages.forEach((p, i) => {
    p.classList.remove('active', 'left', 'right');
    if (i < n) p.classList.add('left');
    else if (i > n) p.classList.add('right');
    else p.classList.add('active');
  });
  btns.forEach((b, i) => b.classList.toggle('active', i === n));
  currentPhonePage = n;
}

// ==================== USSD TERMINAL ====================

let terminalState = 'main';

function setupTerminal() {
  const input = document.getElementById('terminalInput');
  if (!input) return;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTerminalInput(input.value.trim());
      input.value = '';
    }
  });
}

function handleTerminalInput(val) {
  const body = document.getElementById('terminalBody');

  const addLine = (text, cls = '') => {
    const div = document.createElement('div');
    div.className = 'terminal-line ' + cls;
    div.textContent = text;
    body.appendChild(div);
  };

  addLine(`> ${val}`, 'dim');

  if (terminalState === 'main') {
    if (val === '1') {
      terminalState = 'send';
      addLine('');
      addLine('-- SEND & INVEST --', 'highlight');
      addLine('Enter amount in USD (e.g. 200):', 'white');
    } else if (val === '2') {
      addLine('');
      addLine('-- BALANCE --', 'highlight');
      addLine('Wallet:    $1,247.50', 'white');
      addLine('Portfolio: $3,890.00', 'white');
      addLine('');
      addLine('Press 0 to go back', 'dim');
    } else if (val === '3') {
      addLine('');
      addLine('-- PORTFOLIO --', 'highlight');
      addLine('1. Econet   120 units  $54.00  +3.2%', 'white');
      addLine('2. Delta     40 units  $48.00  +1.8%', 'white');
      addLine('3. ZimGold  500 units  $50.00  +2.5%', 'white');
      addLine('4. EduFund  100 units $100.00  +4.0%', 'white');
      addLine('');
      addLine('Press 0 to go back', 'dim');
    } else if (val === '4') {
      addLine('');
      addLine('-- TRANSACTIONS --', 'highlight');
      addLine('12 May  SEND   $150 > Tendai M.   Done', 'white');
      addLine('12 May  INVEST  $50 > ZimGold     Done', 'white');
      addLine('10 May  SEND   $100 > Grace M.    Done', 'white');
      addLine('');
      addLine('Press 0 to go back', 'dim');
    } else if (val === '0') {
      addLine('');
      addLine('Goodbye! Dial *384*123# again.', 'highlight');
    } else {
      addLine('Invalid option. Enter 1-4 or 0.', 'white');
    }
  } else if (terminalState === 'send') {
    const amt = parseFloat(val);
    if (isNaN(amt) || amt <= 0) {
      addLine('Invalid amount. Enter a number:', 'white');
    } else {
      const family = (amt * 0.75).toFixed(2);
      const invest = (amt * 0.25).toFixed(2);
      addLine('');
      addLine('-- ALLOCATION --', 'highlight');
      addLine(`Total:  $${amt.toFixed(2)}`, 'white');
      addLine(`Family: $${family} (75%)`, 'white');
      addLine(`Invest: $${invest} (25%)`, 'white');
      addLine('');
      addLine('Beneficiary: Tendai M. (+263 77X XXX)', 'white');
      addLine('Channel: Mukuru', 'white');
      addLine('');
      addLine('Transaction submitted!', 'highlight');
      addLine(`  $${family} sent to Tendai M.`, 'white');
      addLine(`  $${invest} invested in ZimGold`, 'white');
      addLine('  Ref: ZV-2026-00847', 'white');
      addLine('');
      addLine('Press 0 to return to menu', 'dim');
      terminalState = 'main';
    }
  }

  body.scrollTop = body.scrollHeight;
}

// ==================== WEB DEMO AUTO-CURSOR ====================

let webDemoTimer = null;
let webDemoStep = 0;

function stopWebDemo() {
  if (webDemoTimer) { clearTimeout(webDemoTimer); webDemoTimer = null; }
  const cursor = document.getElementById('demoCursor');
  if (cursor) cursor.classList.remove('visible');
  webDemoStep = 0;
}

function startWebDemo() {
  stopWebDemo();
  const cursor = document.getElementById('demoCursor');
  const ring = document.getElementById('demoClickRing');
  const scroll = document.getElementById('webMainScroll');
  if (!cursor || !ring) return;

  const actions = [
    // Dashboard exploration
    { target: '#webWalletCard', x: 80, y: 25, click: true, delay: 1000 },
    { target: '#webDepositBtn', x: 25, y: 8, click: true, delay: 800 },
    { target: '#webWithdrawBtn', x: 30, y: 8, click: true, delay: 800 },
    { target: '#webPortfolioCard', x: 100, y: 30, click: true, delay: 1000 },
    // Navigate to Send & Invest
    { target: '#webNavSend', x: 50, y: 10, click: true, nav: true, delay: 1200 },
    // Slider interactions
    { target: '#allocSlider', x: 60, y: 6, click: true, delay: 700, sliderTo: 50 },
    { target: '#allocSlider', x: 120, y: 6, click: false, delay: 500, sliderTo: 65 },
    { target: '#allocSlider', x: 180, y: 6, click: false, delay: 500, sliderTo: 80 },
    { target: '#allocSlider', x: 100, y: 6, click: false, delay: 500, sliderTo: 60 },
    { target: '#webSendBtn', x: 30, y: 10, click: true, delay: 1200 },
    // Scroll down and explore transactions
    { target: '#webNavTx', x: 50, y: 10, click: true, nav: true, delay: 800, scrollTo: 200 },
    { target: '#webTx1', x: 80, y: 12, click: true, delay: 700 },
    { target: '#webTx2', x: 80, y: 12, click: true, delay: 700 },
    { target: '#webTx3', x: 80, y: 12, click: true, delay: 700 },
    // Scroll to assets
    { target: '#webNavPort', x: 50, y: 10, click: true, nav: true, delay: 800, scrollTo: 300 },
    { target: '#webAsset1', x: 80, y: 12, click: true, delay: 700 },
    { target: '#webAsset2', x: 80, y: 12, click: true, delay: 700 },
    { target: '#webAsset3', x: 80, y: 12, click: true, delay: 700 },
    // Settings
    { target: '#webNavSettings', x: 50, y: 10, click: true, nav: true, delay: 1000 },
    // Back to Dashboard
    { target: '#webNavDash', x: 50, y: 10, click: true, nav: true, delay: 1500, scrollTo: 0 },
  ];

  function doClick(x, y) {
    ring.style.left = (x - 12) + 'px';
    ring.style.top = (y - 12) + 'px';
    ring.classList.remove('pop');
    void ring.offsetWidth;
    ring.classList.add('pop');
  }

  function runStep() {
    if (webDemoStep >= actions.length) webDemoStep = 0;
    const action = actions[webDemoStep];
    const el = document.querySelector(action.target);
    if (!el) { webDemoStep++; webDemoTimer = setTimeout(runStep, 200); return; }

    const container = document.getElementById('webMainScroll');
    const cRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    const cx = rect.left - cRect.left + action.x + container.scrollLeft;
    const cy = rect.top - cRect.top + action.y + container.scrollTop;

    cursor.classList.add('visible');
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';

    setTimeout(() => {
      if (action.click) doClick(cx, cy);

      if (action.nav) {
        document.querySelectorAll('.web-sidebar-item').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
      }

      if (action.sliderTo !== undefined) {
        const slider = document.getElementById('allocSlider');
        if (slider) { slider.value = action.sliderTo; slider.dispatchEvent(new Event('input')); }
      }

      if (action.scrollTo !== undefined && scroll) {
        scroll.scrollTo({ top: action.scrollTo, behavior: 'smooth' });
      }

      // Highlight clicked element briefly
      if (action.click && el.id && !action.nav) {
        el.style.outline = '2px solid var(--accent)';
        el.style.outlineOffset = '2px';
        setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 600);
      }

      webDemoStep++;
      webDemoTimer = setTimeout(runStep, action.delay);
    }, 800);
  }

  webDemoTimer = setTimeout(runStep, 500);
}

// ==================== MOBILE AUTO-DEMO ====================

let mobileDemoTimer = null;
let mobileDemoStep = 0;

function stopMobileDemo() {
  if (mobileDemoTimer) { clearTimeout(mobileDemoTimer); mobileDemoTimer = null; }
  mobileDemoStep = 0;
}

function startMobileDemo() {
  stopMobileDemo();
  // Sequence: Dashboard -> Send & Invest -> Portfolio -> back to Dashboard (loop)
  const sequence = [
    { page: 0, delay: 2500 },
    { page: 1, delay: 3000 },
    { page: 2, delay: 3000 },
    { page: 0, delay: 2500 },
  ];

  function runMobileStep() {
    if (mobileDemoStep >= sequence.length) mobileDemoStep = 0;
    const step = sequence[mobileDemoStep];
    showPhonePage(step.page);
    mobileDemoStep++;
    mobileDemoTimer = setTimeout(runMobileStep, step.delay);
  }

  mobileDemoTimer = setTimeout(runMobileStep, 1500);
}

// ==================== USSD AUTO-TYPING DEMO ====================

let ussdDemoTimer = null;
let ussdDemoStep = 0;

function stopUssdDemo() {
  if (ussdDemoTimer) { clearTimeout(ussdDemoTimer); ussdDemoTimer = null; }
  ussdDemoStep = 0;
}

function startUssdDemo() {
  stopUssdDemo();
  const input = document.getElementById('terminalInput');
  if (!input) return;

  // Sequence of commands to type
  const commands = [
    { text: '2', delay: 2000, typeSpeed: 150 },  // Check Balance
    { text: '3', delay: 3000, typeSpeed: 150 },  // View Portfolio
    { text: '1', delay: 2500, typeSpeed: 150 },  // Send & Invest
    { text: '200', delay: 3500, typeSpeed: 120 }, // Enter amount
    { text: '0', delay: 2000, typeSpeed: 150 },  // Exit
  ];

  function typeText(text, speed, callback) {
    let i = 0;
    input.value = '';
    function typeChar() {
      if (i < text.length) {
        input.value += text[i];
        i++;
        ussdDemoTimer = setTimeout(typeChar, speed);
      } else {
        // Submit after a brief pause
        ussdDemoTimer = setTimeout(() => {
          handleTerminalInput(input.value.trim());
          input.value = '';
          if (callback) callback();
        }, 400);
      }
    }
    typeChar();
  }

  function runUssdStep() {
    if (ussdDemoStep >= commands.length) {
      ussdDemoStep = 0;
      // Reset terminal
      const body = document.getElementById('terminalBody');
      body.innerHTML = `
        <div class="terminal-line highlight">Welcome to ZimVest *384*123#</div>
        <div class="terminal-line dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <div class="terminal-line white">1. Send & Invest</div>
        <div class="terminal-line white">2. Check Balance</div>
        <div class="terminal-line white">3. View Portfolio</div>
        <div class="terminal-line white">4. Transaction History</div>
        <div class="terminal-line white">0. Exit</div>
        <div class="terminal-line dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      `;
      terminalState = 'main';
      ussdDemoTimer = setTimeout(runUssdStep, 1500);
      return;
    }

    const cmd = commands[ussdDemoStep];
    ussdDemoTimer = setTimeout(() => {
      typeText(cmd.text, cmd.typeSpeed, () => {
        ussdDemoStep++;
        runUssdStep();
      });
    }, cmd.delay);
  }

  ussdDemoTimer = setTimeout(runUssdStep, 1000);
}
