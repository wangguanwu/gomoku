// ==================== 游戏常量配置 ====================
const BOARD_SIZE = 15;
const PADDING = 15;
// 动态计算 CELL_SIZE：棋盘占屏幕约80%
let CELL_SIZE = Math.floor((Math.min(window.innerWidth, window.innerHeight) * 0.8 - PADDING * 2) / BOARD_SIZE);
let PIECE_RADIUS = Math.floor(CELL_SIZE * 0.43);

// 窗口大小变化时重新计算尺寸
function recalculateSize() {
    CELL_SIZE = Math.floor((Math.min(window.innerWidth, window.innerHeight) * 0.8 - PADDING * 2) / BOARD_SIZE);
    PIECE_RADIUS = Math.floor(CELL_SIZE * 0.43);
}

// ==================== 音频系统 ====================
let audioCtx = null;
let bgmPlaying = false;
let bgmGain = null;

// 初始化音频上下文
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// 播放下棋音效
function playDropSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
}

// 播放获胜音效
function playWinSound() {
    initAudio();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + i * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.4);
        osc.start(audioCtx.currentTime + i * 0.15);
        osc.stop(audioCtx.currentTime + i * 0.15 + 0.4);
    });
}

// 简单的钢琴曲旋律 (C大调)
const BGM_MELODY = [
    { note: 262, dur: 0.4 },  // C4
    { note: 294, dur: 0.4 },  // D4
    { note: 330, dur: 0.4 },  // E4
    { note: 262, dur: 0.4 },  // C4
    { note: 330, dur: 0.4 },  // E4
    { note: 294, dur: 0.4 },  // D4
    { note: 392, dur: 0.8 },  // G4
    { note: 349, dur: 0.4 },  // F4
    { note: 330, dur: 0.4 },  // E4
    { note: 294, dur: 0.4 },  // D4
    { note: 262, dur: 0.4 },  // C4
    { note: 392, dur: 0.8 },  // G4
    { note: 440, dur: 0.4 },  // A4
    { note: 494, dur: 0.4 },  // B4
    { note: 523, dur: 0.8 },  // C5
    { note: 494, dur: 0.4 },  // B4
    { note: 440, dur: 0.4 },  // A4
    { note: 392, dur: 0.8 },  // G4
    { note: 330, dur: 0.6 },  // E4
    { note: 262, dur: 0.6 },  // C4
    { note: 294, dur: 0.6 },  // D4
    { note: 330, dur: 0.6 },  // E4
    { note: 262, dur: 1.2 },  // C4 (长音)
];

// 天空之城 旋律 (简化版)
const SKY_CASTLE_MELODY = [
    { note: 392, dur: 0.6 },  // G4
    { note: 440, dur: 0.6 },  // A4
    { note: 494, dur: 0.6 },  // B4
    { note: 523, dur: 0.6 },  // C5
    { note: 494, dur: 0.3 },  // B4
    { note: 440, dur: 0.3 },  // A4
    { note: 392, dur: 0.6 },  // G4
    { note: 349, dur: 0.6 },  // F4
    { note: 330, dur: 0.6 },  // E4
    { note: 294, dur: 0.6 },  // D4
    { note: 330, dur: 0.3 },  // E4
    { note: 294, dur: 0.3 },  // D4
    { note: 262, dur: 0.6 },  // C4
    { note: 294, dur: 0.6 },  // D4
    { note: 330, dur: 0.6 },  // E4
    { note: 349, dur: 0.6 },  // F4
    { note: 330, dur: 0.3 },  // E4
    { note: 294, dur: 0.3 },  // D4
    { note: 262, dur: 1.2 },  // C4
    { note: 0, dur: 0.3 },    // 休止
    { note: 330, dur: 0.6 },  // E4
    { note: 392, dur: 0.6 },  // G4
    { note: 440, dur: 0.6 },  // A4
    { note: 494, dur: 0.6 },  // B4
    { note: 523, dur: 0.6 },  // C5
    { note: 494, dur: 0.3 },  // B4
    { note: 440, dur: 0.3 },  // A4
    { note: 392, dur: 0.6 },  // G4
    { note: 349, dur: 0.6 },  // F4
    { note: 294, dur: 1.2 },  // D4
];

// 巴赫 C大调前奏曲 (简化版)
const BACH_MELODY = [
    { note: 261, dur: 0.25 }, // C4
    { note: 293, dur: 0.25 }, // D4
    { note: 329, dur: 0.25 }, // E4
    { note: 349, dur: 0.25 }, // F4
    { note: 392, dur: 0.25 }, // G4
    { note: 440, dur: 0.25 }, // A4
    { note: 493, dur: 0.25 }, // B4
    { note: 523, dur: 0.25 }, // C5
    { note: 493, dur: 0.25 }, // B4
    { note: 440, dur: 0.25 }, // A4
    { note: 392, dur: 0.25 }, // G4
    { note: 349, dur: 0.25 }, // F4
    { note: 329, dur: 0.25 }, // E4
    { note: 293, dur: 0.25 }, // D4
    { note: 261, dur: 0.25 }, // C4
    { note: 293, dur: 0.25 }, // D4
    { note: 329, dur: 0.25 }, // E4
    { note: 349, dur: 0.25 }, // F4
    { note: 392, dur: 0.25 }, // G4
    { note: 440, dur: 0.25 }, // A4
    { note: 493, dur: 0.25 }, // B4
    { note: 523, dur: 0.5 },  // C5
    { note: 493, dur: 0.25 }, // B4
    { note: 440, dur: 0.25 }, // A4
    { note: 392, dur: 0.25 }, // G4
    { note: 349, dur: 0.25 }, // F4
    { note: 329, dur: 0.25 }, // E4
    { note: 293, dur: 0.25 }, // D4
    { note: 261, dur: 0.5 },  // C4
];

// 贝多芬 月光奏鸣曲 第一乐章 主题 (简化版)
const BEETHOVEN_MELODY = [
    { note: 311, dur: 0.5 },  // D#4 (Eb4)
    { note: 0, dur: 0.25 },   // 休止
    { note: 311, dur: 0.25 }, // D#4
    { note: 369, dur: 0.5 },  // F#4 (Gb4)
    { note: 0, dur: 0.25 },   // 休止
    { note: 369, dur: 0.25 }, // F#4
    { note: 415, dur: 0.5 },  // G#4 (Ab4)
    { note: 0, dur: 0.25 },   // 休止
    { note: 415, dur: 0.25 }, // G#4
    { note: 466, dur: 1.0 },  // A#4 (Bb4)
    { note: 0, dur: 0.5 },    // 休止
    { note: 466, dur: 0.5 },  // A#4
    { note: 415, dur: 0.5 },  // G#4
    { note: 369, dur: 0.5 },  // F#4
    { note: 311, dur: 1.0 },  // D#4
    { note: 0, dur: 0.5 },    // 休止
    { note: 277, dur: 0.5 },  // C#4
    { note: 0, dur: 0.25 },   // 休止
    { note: 277, dur: 0.25 }, // C#4
    { note: 329, dur: 0.5 },  // E4
    { note: 0, dur: 0.25 },   // 休止
    { note: 329, dur: 0.25 }, // E4
    { note: 369, dur: 0.5 },  // F#4
    { note: 0, dur: 0.25 },   // 休止
    { note: 369, dur: 0.25 }, // F#4
    { note: 415, dur: 1.0 },  // G#4
    { note: 0, dur: 0.5 },    // 休止
    { note: 415, dur: 0.5 },  // G#4
    { note: 369, dur: 0.5 },  // F#4
    { note: 329, dur: 0.5 },  // E4
    { note: 277, dur: 1.0 },  // C#4
];

// 歌曲列表
const PLAYLIST = [
    { name: '🎹 简单旋律', melody: BGM_MELODY },
    { name: '🏯 天空之城', melody: SKY_CASTLE_MELODY },
    { name: '🎼 巴赫前奏曲', melody: BACH_MELODY },
    { name: '🌙 月光奏鸣曲', melody: BEETHOVEN_MELODY }
];

let currentSongIndex = 0;
let bgmTimeout = null;

// 播放单个音符（钢琴音色）
function playPianoNote(freq, duration) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.value = freq;
    osc.type = 'sine';

    // 钢琴音色包络
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.08, now + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
}

// 播放背景音乐循环
function playBGM() {
    if (bgmPlaying) return;
    bgmPlaying = true;

    initAudio();
    bgmGain = audioCtx.createGain();
    bgmGain.gain.value = 0.1;
    bgmGain.connect(audioCtx.destination);

    const currentMelody = PLAYLIST[currentSongIndex].melody;

    function playNextNote(index) {
        if (!bgmPlaying) return;
        const { note, dur } = currentMelody[index % currentMelody.length];

        if (note > 0) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(bgmGain);

            osc.frequency.value = note;
            osc.type = 'sine';

            const now = audioCtx.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.06, now + dur * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

            osc.start(now);
            osc.stop(now + dur);
        }

        bgmTimeout = setTimeout(() => playNextNote(index + 1), dur * 1000);
    }

    playNextNote(0);
}

// 停止背景音乐
function stopBGM() {
    bgmPlaying = false;
    if (bgmTimeout) {
        clearTimeout(bgmTimeout);
        bgmTimeout = null;
    }
}

// 切换到下一首歌
function nextSong() {
    stopBGM();
    currentSongIndex = (currentSongIndex + 1) % PLAYLIST.length;
    playBGM();
    updateBGMButton();
}

// 更新BGM按钮文字
function updateBGMButton() {
    const btn = document.getElementById('bgm-toggle');
    btn.textContent = PLAYLIST[currentSongIndex].name;
    if (bgmPlaying) {
        btn.classList.add('playing');
    } else {
        btn.classList.remove('playing');
    }
}

// 切换背景音乐
function toggleBGM() {
    if (bgmPlaying) {
        stopBGM();
    } else {
        playBGM();
    }
    updateBGMButton();
}

// ==================== 科幻配色 ====================
const COLORS = {
    background: '#1a1a2e',
    grid: '#00ffff',
    blackPiece: '#ff00ff',
    whitePiece: '#00ffff',
    winHighlight: '#ffff00',
    starPoint: '#7b2cbf'
};

// ==================== 游戏状态 ====================
let board = [];
let currentPlayer = 1;
let gameOver = false;
let canvas, ctx;
let hoverCell = null;
let animationId = null;
let dropAnimations = [];
let winLine = [];
let winAnimationTime = 0;
let pulseTime = 0;
let lastTime = 0;

// ==================== 粒子系统 ====================
const particleSystem = {
    particles: [],
    maxParticles: 100,

    add(x, y, color, count = 15) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 2 + Math.random() * 3,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                color
            });
        }
    },

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.life -= p.decay;
            p.radius *= 0.97;
            if (p.life <= 0 || p.radius < 0.5) {
                this.particles.splice(i, 1);
            }
        }
    },

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
        });
    },

    clear() {
        this.particles = [];
    }
};

// ==================== 初始化 ====================
function init() {
    recalculateSize();
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    canvas = document.getElementById('board');
    ctx = canvas.getContext('2d');
    canvas.width = BOARD_SIZE * CELL_SIZE + PADDING * 2;
    canvas.height = BOARD_SIZE * CELL_SIZE + PADDING * 2;

    currentPlayer = 1;
    gameOver = false;
    hoverCell = null;
    winLine = [];
    winAnimationTime = 0;
    dropAnimations = [];
    pulseTime = 0;
    lastTime = performance.now();
    particleSystem.clear();

    canvas.onclick = handleClick;
    canvas.onmousemove = handleMouseMove;
    canvas.onmouseleave = handleMouseLeave;
    document.getElementById('restart').onclick = init;
    document.getElementById('bgm-toggle').onclick = () => {
        initAudio();
        if (bgmPlaying) {
            // 播放中：切换到下一首歌
            nextSong();
        } else {
            // 暂停中：继续播放
            playBGM();
            updateBGMButton();
        }
    };

    // 首次点击页面时启动BGM（浏览器自动播放政策）
    if (!bgmPlaying) {
        const startBgm = () => {
            initAudio();
            playBGM();
            document.removeEventListener('click', startBgm);
        };
        document.addEventListener('click', startBgm, { once: true });
    }

    if (!animationId) {
        animationId = requestAnimationFrame(gameLoop);
    }

    updateStatus();
}

// ==================== 主动画循环 ====================
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    pulseTime += deltaTime;

    particleSystem.update();

    for (let i = dropAnimations.length - 1; i >= 0; i--) {
        dropAnimations[i].progress += deltaTime / 300;
        if (dropAnimations[i].progress >= 1) {
            dropAnimations.splice(i, 1);
        }
    }

    if (winLine.length > 0) {
        winAnimationTime += deltaTime;
    }

    render();
    animationId = requestAnimationFrame(gameLoop);
}

// ==================== 渲染 ====================
function render() {
    // 清空画布
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGridPulse();
    drawBoard();
    drawStarPoints();
    drawHoverCell();
    drawPieces();
    particleSystem.draw(ctx);
}

function drawGridPulse() {
    const pulse = 0.3 + 0.2 * Math.sin(pulseTime / 1000);
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3 + pulse * 0.3;

    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(PADDING, PADDING + i * CELL_SIZE);
        ctx.lineTo(PADDING + (BOARD_SIZE - 1) * CELL_SIZE, PADDING + i * CELL_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
        ctx.lineTo(PADDING + i * CELL_SIZE, PADDING + (BOARD_SIZE - 1) * CELL_SIZE);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

function drawBoard() {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(PADDING, PADDING + i * CELL_SIZE);
        ctx.lineTo(PADDING + (BOARD_SIZE - 1) * CELL_SIZE, PADDING + i * CELL_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
        ctx.lineTo(PADDING + i * CELL_SIZE, PADDING + (BOARD_SIZE - 1) * CELL_SIZE);
        ctx.stroke();
    }
}

function drawStarPoints() {
    const points = [[3,3], [3,11], [7,7], [11,3], [11,11]];
    points.forEach(([x, y]) => {
        ctx.fillStyle = COLORS.starPoint;
        ctx.shadowBlur = 5;
        ctx.shadowColor = COLORS.starPoint;
        ctx.beginPath();
        ctx.arc(PADDING + x * CELL_SIZE, PADDING + y * CELL_SIZE, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function drawHoverCell() {
    if (!hoverCell || gameOver) return;
    const [row, col] = hoverCell;
    const x = PADDING + col * CELL_SIZE;
    const y = PADDING + row * CELL_SIZE;

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.grid;
    ctx.strokeRect(x - CELL_SIZE/2, y - CELL_SIZE/2, CELL_SIZE, CELL_SIZE);
    ctx.shadowBlur = 0;

    if (board[row][col] === 0) {
        ctx.globalAlpha = 0.4;
        drawPieceAt(x, y, currentPlayer, 1);
        ctx.globalAlpha = 1;
    }
}

function drawPieces() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== 0) {
                const x = PADDING + col * CELL_SIZE;
                const y = PADDING + row * CELL_SIZE;
                const anim = dropAnimations.find(a => a.row === row && a.col === col);
                const t = anim ? Math.min(anim.progress, 1) : 1;
                const scale = t === 1 ? 1 : easeOutElastic(t);
                drawPieceAt(x, y, board[row][col], scale);

                if (winLine.length > 0 && winLine.some(([r, c]) => r === row && c === col)) {
                    drawWinHighlight(x, y);
                }
            }
        }
    }
}

function drawPieceAt(x, y, player, scale) {
    const radius = PIECE_RADIUS * scale;
    if (radius <= 0) return;

    const color = player === 1 ? COLORS.blackPiece : COLORS.whitePiece;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.arc(x + 2 * scale, y + 2 * scale, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    ctx.shadowBlur = 0;
}

function drawWinHighlight(x, y) {
    const flash = Math.sin(winAnimationTime / 150) > 0;
    ctx.strokeStyle = flash ? COLORS.winHighlight : '#fff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = COLORS.winHighlight;
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function easeOutElastic(t) {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
}

// ==================== 游戏逻辑 ====================
function handleClick(e) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.round((x - PADDING) / CELL_SIZE);
    const row = Math.round((y - PADDING) / CELL_SIZE);

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
    if (board[row][col] !== 0) return;

    board[row][col] = currentPlayer;
    playDropSound();

    dropAnimations.push({ row, col, progress: 0 });

    const pieceX = PADDING + col * CELL_SIZE;
    const pieceY = PADDING + row * CELL_SIZE;
    const color = currentPlayer === 1 ? COLORS.blackPiece : COLORS.whitePiece;
    particleSystem.add(pieceX, pieceY, color, 15);

    const win = checkWin(row, col);
    if (win) {
        gameOver = true;
        winLine = win;
        playWinSound();
        stopBGM();
        const winner = currentPlayer === 1 ? '黑棋' : '白棋';
        document.getElementById('status').textContent = winner + '获胜！';
        document.getElementById('status').style.color = COLORS.winHighlight;
        return;
    }

    if (isBoardFull()) {
        gameOver = true;
        document.getElementById('status').textContent = '平局！';
        return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
}

function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.round((x - PADDING) / CELL_SIZE);
    const row = Math.round((y - PADDING) / CELL_SIZE);
    hoverCell = (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) ? [row, col] : null;
}

function handleMouseLeave() {
    hoverCell = null;
}

function checkWin(row, col) {
    const player = board[row][col];
    const dirs = [[0,1], [1,0], [1,1], [1,-1]];

    for (const [dr, dc] of dirs) {
        const line = [[row, col]];
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            line.push([r, c]);
            r += dr;
            c += dc;
        }
        r = row - dr;
        c = col - dc;
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            line.unshift([r, c]);
            r -= dr;
            c -= dc;
        }
        if (line.length >= 5) return line.slice(0, 5);
    }
    return null;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== 0));
}

function updateStatus() {
    const color = currentPlayer === 1 ? COLORS.blackPiece : COLORS.whitePiece;
    const status = document.getElementById('status');
    status.textContent = (currentPlayer === 1 ? '黑棋' : '白棋') + '回合';
    status.style.color = color;
}

window.onload = init;
