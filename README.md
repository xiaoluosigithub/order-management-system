
# 订单管理系统（Vue3 + Vite + Node.js + Express + MySQL）

一个基于前后端分离的简单订单管理演示项目。
前端使用 Vue3 + Vite，后端使用 Express + MySQL，支持订单列表查询、关键字搜索、状态筛选、分页与分层设色展示。

## 环境要求

* Node.js ≥ 18（建议安装最新 LTS）
* MySQL ≥ 5.7（建议 8.0）
* Windows、macOS 或 Linux 均可运行

## 项目结构

```
order-management-system/
├─ backend/             # 后端服务（Express）
│  ├─ app.js            # 接口实现
│  ├─ db.js             # 数据库连接配置
│  └─ package.json
├─ frontend/            # 前端（Vue3 + Vite）
│  ├─ src/
│  │  └─ App.vue        # 单页实现（订单列表/搜索/筛选/分页）
│  ├─ vite.config.js    # 开发代理到后端
│  └─ package.json
├─ db.md                # 数据库建表与演示数据（SQL）
└─ README.md
```

## 数据库准备

1. 创建数据库（与 `backend/db.js` 保持一致）：

```sql
CREATE DATABASE shop_order_db DEFAULT CHARACTER SET utf8mb4;
```

2. 执行建表与初始化数据
   打开 `db.md`，将其中的 SQL 代码块复制到你的 MySQL 客户端执行（或保存为 `orders.sql` 后使用 `SOURCE orders.sql` 导入）。
   文件包含：

   * 表结构：`orders(order_id, order_no, user_name, product_name, quantity, total_price, order_status, create_time)`
   * 示例订单数据

3. 确认数据库连接信息
   默认配置（`backend/db.js`）：

```js
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'shop_order_db',
  charset: 'utf8mb4'
});
module.exports = pool;
```

如需更改密码或数据库名，请同步修改此配置。

## 启动后端

在终端执行：

```bash
cd backend
npm install
node app.js
```

* 成功启动后输出：`🚀 API 服务启动：http://localhost:3000`
* 接口基地址：`http://localhost:3000`

### 后端接口说明

* 获取订单列表（分页/筛选/搜索）：`GET /api/orders`

  * Query 参数：`page`、`pageSize`、`status`、`keyword`
  * 示例：`/api/orders?page=1&pageSize=10&status=已完成`
* 获取订单详情：`GET /api/orders/:id`
* 新增订单：`POST /api/orders`
* 修改订单状态：`PUT /api/orders/:id/status`
* 删除订单：`DELETE /api/orders/:id`

## 启动前端

在另一个终端执行：

```bash
cd frontend
npm install
npm run dev
```

* 启动后会显示本地开发地址（通常为 `http://localhost:5173`）
* 已配置开发代理，前端对 `/api` 的请求会自动转发到后端 `http://localhost:3000`
  代理配置位置：`frontend/vite.config.js`

## 功能演示

* **搜索**：输入订单号或用户名，按回车或点击“搜索”
* **状态筛选**：下拉选择“全部/待付款/已付款/已发货/已完成/已取消”
* **分页**：上一页/下一页，每页数量支持 10/20/50
* **分层设色**：不同订单状态以柔和色块展示，简洁清晰

前端主要页面实现位置：`frontend/src/App.vue`

## 常见问题

* **无法连接数据库**

  * 检查 MySQL 是否启动
  * 确认 `backend/db.js` 中 `user/password/database` 与实际一致
  * 确保已执行 `db.md` 中建表与示例数据
* **端口被占用**

  * 后端默认端口 `3000`，可在 `backend/app.js` 调整
  * 前端 Vite 默认端口 `5173`，可用 `npm run dev -- --port 5174` 自定义
* **CORS 问题**

  * 开发环境已通过 Vite 代理转发 `/api` 到后端，通常无需额外配置
* **Node 版本过低**

  * 请使用 Node.js ≥ 18（Vite 新版本需要较新 Node）

## 快速复现步骤

1. 安装 Node.js ≥ 18 与 MySQL
2. 创建数据库并执行 `db.md` 中 SQL
3. 启动后端：

```bash
cd backend
npm install
node app.js
```

4. 启动前端：

```bash
cd frontend
npm install
npm run dev
```

5. 浏览器访问前端地址，进行搜索/筛选/分页等操作

## 参考文件

* 数据库：`db.md`
* 后端：`backend/db.js`、`backend/app.js`
* 前端入口：`frontend/src/App.vue`、`frontend/vite.config.js`

---