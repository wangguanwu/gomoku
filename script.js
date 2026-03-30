// ==================== 游戏常量配置 ====================
const BOARD_SIZE = 15;          // 棋盘大小（15x15）
const CELL_SIZE = 30;            // 每格像素大小
const PIECE_RADIUS = 13;         // 棋子半径
const PADDING = 15;              // 棋盘内边距

// ==================== 游戏状态变量 ====================
let board = [];                  // 棋盘二维数组：0=空，1=黑棋，2=白棋
let currentPlayer = 1;           // 当前玩家：1=黑棋，2=白棋
let gameOver = false;            // 游戏是否结束
let canvas, ctx;                 // Canvas 元素和绘图上下文
let isEventBound = false;        // 事件是否已绑定标志，避免重复绑定

// ==================== 初始化函数 ====================
/**
 * 初始化游戏
 * 创建棋盘数组、获取Canvas元素、绑定事件
 */
function init() {
    // 创建15x15的空棋盘
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));

    // 获取Canvas元素并设置尺寸
    canvas = document.getElementById('board');
    ctx = canvas.getContext('2d');
    const boardPixelSize = BOARD_SIZE * CELL_SIZE + PADDING * 2;
    canvas.width = boardPixelSize;
    canvas.height = boardPixelSize;

    // 重置游戏状态
    currentPlayer = 1;
    gameOver = false;

    // 绑定点击事件（仅绑定一次，避免重复绑定导致内存泄漏）
    if (!isEventBound) {
        canvas.addEventListener('click', handleClick);
        document.getElementById('restart').addEventListener('click', init);
        isEventBound = true;
    }

    // 渲染初始棋盘
    render();
    updateStatus();
}

// ==================== 渲染函数 ====================
/**
 * 渲染整个棋盘
 * 包括绘制网格线和所有棋子
 */
function render() {
    drawBoard();      // 绘制棋盘网格
    drawPieces();     // 绘制所有棋子
}

/**
 * 绘制棋盘网格
 */
function drawBoard() {
    ctx.strokeStyle = '#8b4513';  // 网格线颜色
    ctx.lineWidth = 1;

    // 绘制横线
    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(PADDING, PADDING + i * CELL_SIZE);
        ctx.lineTo(PADDING + (BOARD_SIZE - 1) * CELL_SIZE, PADDING + i * CELL_SIZE);
        ctx.stroke();
    }

    // 绘制竖线
    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
        ctx.lineTo(PADDING + i * CELL_SIZE, PADDING + (BOARD_SIZE - 1) * CELL_SIZE);
        ctx.stroke();
    }

    // 绘制天元和星位标记点
    const starPoints = [
        [3, 3], [3, 11], [7, 7], [11, 3], [11, 11]
    ];
    starPoints.forEach(([x, y]) => {
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.arc(PADDING + x * CELL_SIZE, PADDING + y * CELL_SIZE, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

/**
 * 绘制所有已落棋子
 */
function drawPieces() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] !== 0) {
                drawPiece(row, col, board[row][col]);
            }
        }
    }
}

/**
 * 绘制单个棋子
 * @param {number} row - 行索引
 * @param {number} col - 列索引
 * @param {number} player - 玩家编号（1=黑棋，2=白棋）
 */
function drawPiece(row, col, player) {
    const x = PADDING + col * CELL_SIZE;
    const y = PADDING + row * CELL_SIZE;

    // 绘制棋子阴影
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // 绘制棋子主体
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);

    // 黑棋白棋颜色
    if (player === 1) {
        ctx.fillStyle = '#000';
    } else {
        ctx.fillStyle = '#fff';
    }
    ctx.fill();

    // 白棋添加边框（使用更深的颜色和更粗的线条以便在浅色背景下清晰可见）
    if (player === 2) {
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // 棋子光泽效果
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, PIECE_RADIUS / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
}

// ==================== 游戏逻辑函数 ====================
/**
 * 处理棋盘点击事件
 * @param {Event} event - 点击事件
 */
function handleClick(event) {
    if (gameOver) return;  // 游戏结束后忽略点击

    // 计算点击位置对应的棋盘坐标
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.round((x - PADDING) / CELL_SIZE);
    const row = Math.round((y - PADDING) / CELL_SIZE);

    // 验证坐标有效性
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
    if (board[row][col] !== 0) return;  // 该位置已有棋子

    // 落子
    board[row][col] = currentPlayer;
    render();

    // 检查是否获胜
    if (checkWin(row, col)) {
        gameOver = true;
        const winner = currentPlayer === 1 ? '黑棋' : '白棋';
        document.getElementById('status').textContent = `${winner}获胜！`;
        return;
    }

    // 检查是否平局（棋盘下满）
    if (isBoardFull()) {
        gameOver = true;
        document.getElementById('status').textContent = '平局！';
        return;
    }

    // 切换玩家
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
}

/**
 * 检查指定位置是否形成五子连珠
 * @param {number} row - 行索引
 * @param {number} col - 列索引
 * @returns {boolean} 是否获胜
 */
function checkWin(row, col) {
    const player = board[row][col];
    // 四个方向：横、竖、左斜、右斜
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 左斜
        [1, -1]   // 右斜
    ];

    return directions.some(([dr, dc]) => {
        return countLine(row, col, dr, dc, player) + countLine(row, col, -dr, -dc, player) >= 4;
    });
}

/**
 * 统计指定方向连续相同棋子数量
 * @param {number} row - 起始行
 * @param {number} col - 起始列
 * @param {number} dr - 行方向增量
 * @param {number} dc - 列方向增量
 * @param {number} player - 玩家编号
 * @returns {number} 连续棋子数量
 */
function countLine(row, col, dr, dc, player) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
    }

    return count;
}

/**
 * 检查棋盘是否已下满
 * @returns {boolean} 是否下满
 */
function isBoardFull() {
    return board.every(row => row.every(cell => cell !== 0));
}

/**
 * 更新状态显示
 */
function updateStatus() {
    const playerText = currentPlayer === 1 ? '黑棋' : '白棋';
    document.getElementById('status').textContent = `${playerText}回合`;
}

// 页面加载完成后初始化游戏
window.addEventListener('load', init);
