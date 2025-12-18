# 一、接口功能设计（单表，但功能完整）

基于你目前的 `orders` 表，我们提供 **5 个核心接口**：

| 功能                                         | 接口                         |
| -------------------------------------------- | ---------------------------- |
| 获取订单列表（分页 / 状态筛选 / 关键字搜索） | `GET /api/orders`            |
| 获取订单详情                                 | `GET /api/orders/:id`        |
| 新增订单                                     | `POST /api/orders`           |
| 修改订单状态                                 | `PUT /api/orders/:id/status` |
| 删除订单                                     | `DELETE /api/orders/:id`     |

👉 **完全覆盖前端 CRUD 演示需求**

------

# 二、后端实现（Node.js + Express）

## 1️⃣ 数据库连接（`db.js`）

```js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '你的数据库密码',
  database: 'order_system',
  charset: 'utf8mb4'
});

module.exports = pool;
```

------

## 2️⃣ 主服务文件（`app.js`）

```js
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

/**
 * 1️⃣ 获取订单列表（分页 / 状态 / 关键字）
 * GET /api/orders
 */
app.get('/api/orders', (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    status,
    keyword
  } = req.query;

  let sql = 'SELECT * FROM orders WHERE 1=1';
  let params = [];

  if (status) {
    sql += ' AND order_status = ?';
    params.push(status);
  }

  if (keyword) {
    sql += ' AND (order_no LIKE ? OR user_name LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  sql += ' ORDER BY create_time DESC LIMIT ?, ?';
  params.push((page - 1) * pageSize, Number(pageSize));

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: '查询失败' });
    }
    res.json(results);
  });
});

/**
 * 2️⃣ 获取订单详情
 * GET /api/orders/:id
 */
app.get('/api/orders/:id', (req, res) => {
  const sql = 'SELECT * FROM orders WHERE order_id = ?';

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: '查询失败' });
    if (!results.length) return res.status(404).json({ message: '订单不存在' });

    res.json(results[0]);
  });
});

/**
 * 3️⃣ 新增订单
 * POST /api/orders
 */
app.post('/api/orders', (req, res) => {
  const {
    order_no,
    user_name,
    product_name,
    quantity,
    total_price
  } = req.body;

  const sql = `
    INSERT INTO orders
    (order_no, user_name, product_name, quantity, total_price, order_status, create_time)
    VALUES (?, ?, ?, ?, ?, '待付款', NOW())
  `;

  db.query(sql, [order_no, user_name, product_name, quantity, total_price], (err) => {
    if (err) return res.status(500).json({ message: '创建失败' });
    res.json({ message: '订单创建成功' });
  });
});

/**
 * 4️⃣ 修改订单状态
 * PUT /api/orders/:id/status
 */
app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;

  const sql = 'UPDATE orders SET order_status = ? WHERE order_id = ?';
  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: '更新失败' });
    if (!result.affectedRows) return res.status(404).json({ message: '订单不存在' });

    res.json({ message: '订单状态更新成功' });
  });
});

/**
 * 5️⃣ 删除订单
 * DELETE /api/orders/:id
 */
app.delete('/api/orders/:id', (req, res) => {
  const sql = 'DELETE FROM orders WHERE order_id = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: '删除失败' });
    if (!result.affectedRows) return res.status(404).json({ message: '订单不存在' });

    res.json({ message: '订单已删除' });
  });
});

app.listen(3000, () => {
  console.log('🚀 API 服务启动：http://localhost:3000');
});
```

------

# 三、📄 前端接口文档（对接用）

你可以直接把下面内容发给组员 👇

------

## 订单管理系统接口文档

### 📌 基础信息

- 接口地址前缀：`http://localhost:3000`
- 数据格式：`JSON`
- 字符编码：`UTF-8`

------

### 1️⃣ 获取订单列表

**接口地址**

```
GET /api/orders
```

**请求参数（Query）**

| 参数名   | 类型   | 是否必填 | 说明                  |
| -------- | ------ | -------- | --------------------- |
| page     | number | 否       | 页码，默认 1          |
| pageSize | number | 否       | 每页条数，默认 10     |
| status   | string | 否       | 订单状态              |
| keyword  | string | 否       | 订单号 / 用户名关键字 |

**示例**

```
/api/orders?page=1&pageSize=10&status=已完成
```

------

### 2️⃣ 获取订单详情

```
GET /api/orders/{id}
```

------

### 3️⃣ 新增订单

```
POST /api/orders
```

**请求体**

```json
{
  "order_no": "ORD20240108001",
  "user_name": "张三",
  "product_name": "无线键盘",
  "quantity": 1,
  "total_price": 199.00
}
```

------

### 4️⃣ 修改订单状态

```
PUT /api/orders/{id}/status
```

**请求体**

```json
{
  "status": "已发货"
}
```

------

### 5️⃣ 删除订单

```
DELETE /api/orders/{id}
```

