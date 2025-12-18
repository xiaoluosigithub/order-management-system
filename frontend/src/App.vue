<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])
const loading = ref(false)
const error = ref('')

const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [10, 20, 50]

const filters = ref({
  keyword: '',
  status: '全部',
})

const statusOptions = ['全部', '待付款', '已付款', '已发货', '已完成', '已取消']

function statusClass(s) {
  const map = {
    待付款: 's-pending',
    已付款: 's-paid',
    已发货: 's-shipped',
    已完成: 's-completed',
    已取消: 's-cancelled',
  }
  const cls = map[s] || 's-default'
  return `status-badge ${cls}`
}

async function fetchOrders() {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    params.set('page', String(page.value))
    params.set('pageSize', String(pageSize.value))
    const kw = filters.value.keyword.trim()
    if (kw) params.set('keyword', kw)
    if (filters.value.status && filters.value.status !== '全部') {
      params.set('status', filters.value.status)
    }
    const res = await fetch(`/api/orders?${params.toString()}`)
    if (!res.ok) {
      throw new Error(`请求失败：${res.status}`)
    }
    const data = await res.json()
    orders.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e.message || '加载失败'
    orders.value = []
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchOrders()
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1
    fetchOrders()
  }
}

function nextPage() {
  if (orders.value.length >= pageSize.value) {
    page.value += 1
    fetchOrders()
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="page">
    <header class="header">
      <h1>订单管理</h1>
      <p class="sub">基于接口文档：列表、搜索、状态分层设色、分页</p>
    </header>

    <section class="toolbar">
      <input
        class="input"
        v-model="filters.keyword"
        type="text"
        placeholder="搜索：订单号 / 用户名"
        @keyup.enter="handleSearch"
      />

      <select class="select" v-model="filters.status" @change="handleSearch">
        <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
      </select>

      <select class="select" v-model="pageSize" @change="handleSearch">
        <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }} / 页</option>
      </select>

      <button class="btn primary" @click="handleSearch">搜索</button>
    </section>

    <section class="content">
      <div v-if="error" class="alert error">{{ error }}</div>
      <div v-if="loading" class="loading">加载中...</div>

      <table v-if="!loading && orders.length" class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户</th>
            <th>商品</th>
            <th>数量</th>
            <th>总价</th>
            <th>状态</th>
            <th>创建时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in orders" :key="row.order_id">
            <td class="mono">{{ row.order_no }}</td>
            <td>{{ row.user_name }}</td>
            <td>{{ row.product_name }}</td>
            <td>{{ row.quantity }}</td>
            <td class="mono">￥{{ Number(row.total_price).toFixed(2) }}</td>
            <td><span :class="statusClass(row.order_status)">{{ row.order_status }}</span></td>
            <td class="mono">{{ row.create_time }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && !orders.length && !error" class="empty">暂无数据</div>
    </section>

    <section class="pagination">
      <button class="btn" :disabled="page === 1" @click="prevPage">上一页</button>
      <span class="page-info">第 {{ page }} 页</span>
      <button class="btn" :disabled="orders.length < pageSize" @click="nextPage">下一页</button>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px;
  color: #333;
  background: #fff;
}
.header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #222;
}
.sub {
  margin: 6px 0 16px;
  color: #666;
  font-size: 14px;
}
.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}
.input, .select {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #333;
}
.input {
  flex: 1 1 320px;
  min-width: 240px;
}
.btn {
  height: 36px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #333;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.content {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
}
.table thead th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.loading {
  padding: 16px;
  color: #666;
}
.empty {
  padding: 24px;
  color: #888;
  text-align: center;
}
.alert.error {
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #b91c1c;
  border-radius: 8px;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
.page-info {
  color: #555;
}
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  border: 1px solid transparent;
}
.status-badge.s-default {
  background: #eef2ff;
  color: #3730a3;
  border-color: #c7d2fe;
}
.status-badge.s-pending {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}
.status-badge.s-paid {
  background: #dbeafe;
  color: #1e40af;
  border-color: #bfdbfe;
}
.status-badge.s-shipped {
  background: #ffedd5;
  color: #9a3412;
  border-color: #fed7aa;
}
.status-badge.s-completed {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}
.status-badge.s-cancelled {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}
</style>
