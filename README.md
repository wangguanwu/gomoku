# Gomoku 五子棋

一个基于浏览器的经典五子棋双人对抗游戏。

## 游戏特性

- 15x15 标准棋盘
- 双人对战，黑棋先行
- 实时回合提示
- 自动胜负判定（五子连珠）
- 平局检测（棋盘下满）
- 一键重新开始

## 技术栈

- HTML5 Canvas
- CSS3
- Vanilla JavaScript

## 运行方式

直接在浏览器中打开 `index.html` 即可游玩。

```bash
# 或使用本地服务器
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

## 项目结构

```
gomoku/
├── index.html    # 游戏主页面
├── style.css     # 样式表
├── script.js     # 游戏逻辑
└── README.md     # 项目说明
```

## 游戏规则

1. 黑棋先行，双方轮流落子
2. 任意一方在横、竖、斜四个方向上连成五子即为获胜
3. 棋盘下满且无人获胜则为平局
