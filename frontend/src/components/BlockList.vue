<template>
  <div class="site-layout">
    <aside class="side-nav" aria-label="页面导航">
      <button class="nav-mark" type="button" aria-label="回到顶部" @click="goToSection('overview')">
        <span></span><span></span><span></span>
      </button>

      <nav class="nav-links">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          :class="{ active: activeSection === item.id }"
          @click="goToSection(item.id)"
        >
          <span class="nav-label">{{ item.label }}</span>
          <small>{{ item.sub }}</small>
        </button>
      </nav>

      <div class="nav-foot">
        <span>GRAY RAVEN</span>
        <span>PROTOCOL // 01</span>
      </div>
    </aside>

    <div class="main-column">
      <section id="overview" class="hero">
        <div class="hero-art" aria-hidden="true">
          <span class="hero-glow"></span>
          <span class="hero-rings"></span>
          <span class="hero-line hero-line--top"></span>
          <span class="hero-line hero-line--bottom"></span>
        </div>

        <div class="hero-city" aria-hidden="true"></div>

        <div class="hero-top">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true">
              <i></i><i></i><i></i>
            </span>
            <div class="brand-copy">
              <p class="brand-eyebrow">BLOCKCHAIN // VISUALIZER</p>
              <p class="brand-sub">GRAY RAVEN PROTOCOL</p>
            </div>
          </div>

          <div class="hero-status">
            <span
              class="status"
              :class="connected ? 'is-online' : 'is-offline'"
              :title="statusTitle"
            >
              <i class="status-dot" aria-hidden="true"></i>
              {{ connected ? 'LINK ONLINE' : 'LINK OFFLINE' }}
            </span>
            <span class="node-readout">
              CURRENT NODE
              <strong class="current-node">P2P {{ currentNodeP2pPort }}</strong>
            </span>
          </div>
        </div>

        <div class="hero-body">
          <div class="hero-visual">
            <p class="hero-kicker"><span>GRAY RAVEN</span> / BLOCKCHAIN NETWORK</p>

            <div class="hero-core">
              <img
                src="/hero-emblem.svg"
                width="600"
                height="600"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>

          <div class="hero-copy">
            <div class="hero-text">
              <h1 class="sr-only">BLOCKCHAIN VISUALIZER</h1>

              <p class="hero-en">REAL-TIME P2P CHAIN MONITORING</p>
              <p class="hero-desc">连接节点，读取区块；让每一次链上回响都有迹可循。</p>
            </div>

            <div class="hero-actions">
              <button
                type="button"
                class="line-btn line-btn--primary refresh-btn"
                :disabled="isLoading"
                @click="fetchBlocks()"
              >
                <span class="btn-mark" aria-hidden="true">//</span>
                {{ isLoading ? '同步中...' : '刷新区块链' }}
                <small>SYNC CHAIN</small>
              </button>

              <label class="auto-toggle" for="auto-refresh">
                <input id="auto-refresh" v-model="autoRefresh" type="checkbox" />
                <span class="auto-track" aria-hidden="true">
                  <span class="auto-thumb"></span>
                </span>
                <span class="auto-text">自动刷新 <em>2.0s</em></span>
              </label>
            </div>
          </div>
        </div>

        <div class="hero-bottom">
          <div class="hero-meta">
            <span class="meta-box">
              <em>NODES</em>
              <strong>{{ pad2(availableNodes.length) }}</strong>
            </span>
            <span class="meta-box">
              <em>BLOCKS</em>
              <strong>{{ pad2(blocks.length) }}</strong>
            </span>
            <span class="meta-box">
              <em>LAST SYNC</em>
              <strong>{{ lastSync || '--:--:--' }}</strong>
            </span>
          </div>

          <button type="button" class="scroll-hint" @click="goToSection('nodes')">
            <span>SCROLL</span>
            <i aria-hidden="true"></i>
          </button>
        </div>
      </section>

      <div class="sections-grid">
        <section id="nodes" class="content-section nodes-section">
        <header class="section-head">
          <span class="section-index">01</span>
          <div class="section-title-wrap">
            <h2>节点网络</h2>
            <small>NODE LINK / P2P NETWORK</small>
          </div>
          <span class="section-line" aria-hidden="true"></span>
          <button
            type="button"
            class="line-btn line-btn--small refresh-nodes-btn"
            :disabled="isDiscovering"
            @click="refreshNodes"
          >
            {{ isDiscovering ? '扫描中...' : '刷新节点' }}
          </button>
        </header>

        <div class="node-grid">
          <button
            v-for="(node, index) in availableNodes"
            :key="node.apiPort"
            type="button"
            :class="['node-btn', { active: currentApiPort === node.apiPort }]"
            :title="`API 端口：${node.apiPort}，区块数：${node.blockCount}`"
            :aria-pressed="currentApiPort === node.apiPort"
            @click="switchToNode(node)"
          >
            <span class="node-index">NODE {{ pad2(index + 1) }}</span>
            <span class="node-api">API // {{ node.apiPort }}</span>
            <span class="node-p2p">
              P2P
              <strong>{{ node.p2pPort ?? '—' }}</strong>
            </span>
            <span class="node-blocks">
              <strong>{{ node.blockCount }}</strong>
              <em>BLOCKS</em>
            </span>
          </button>

          <div v-if="availableNodes.length === 0" class="node-empty">
            <span class="empty-sigil" aria-hidden="true">✦</span>
            <p>{{ isDiscovering ? '正在扫描节点...' : '未发现节点' }}</p>
            <small>{{ isDiscovering ? 'SCANNING 3001 — 3005' : 'NO NODE SIGNAL' }}</small>
          </div>
        </div>

        <div v-if="availableNodes.length > 0" class="nodes-aside" aria-hidden="true">
          <span class="nodes-aside-spine"></span>
          <span class="nodes-aside-pulse"></span>
          <span class="nodes-aside-vertical">P2P LINK</span>
          <span class="nodes-aside-mark">P2P</span>
          <span class="nodes-aside-line"></span>
          <div class="nodes-aside-meta">
            <span>NETWORK ACTIVE</span>
            <span>{{ pad2(availableNodes.length) }} NODES / {{ pad2(blocks.length) }} BLOCKS</span>
          </div>
        </div>
      </section>

      <section id="chain" class="content-section chain-section">
        <header class="section-head">
          <span class="section-index">02</span>
          <div class="section-title-wrap">
            <h2>区块数据</h2>
            <small>CHAIN DATA / SHA-256</small>
          </div>
          <span class="section-line" aria-hidden="true"></span>
          <span class="section-meta">{{ pad2(blocks.length) }} BLOCKS</span>
        </header>

        <main v-if="blocks.length > 0" class="chain-display">
          <div
            v-for="(block, index) in blocks"
            :key="block.index ?? index"
            class="block-wrapper"
          >
            <BlockCard :block="block" />
            <div v-if="index < blocks.length - 1" class="chain-link" aria-hidden="true">
              <span class="link-line"></span>
              <span class="link-glyph"></span>
              <span class="link-caption">CHAIN LINK</span>
            </div>
          </div>
        </main>

        <div v-else class="empty-state">
          <span class="empty-sigil" aria-hidden="true">✦</span>
          <p>{{ isLoading ? '正在加载区块链数据...' : '等待区块链的数据.....' }}</p>
          <small>{{ isLoading ? 'LOADING CHAIN DATA' : 'AWAITING CHAIN SIGNAL' }}</small>
        </div>
      </section>
      </div>

      <footer class="site-footer">
        <div class="footer-hud">
          <span>NET 01/01</span>
          <span>OPEN {{ pad2(availableNodes.length) }} NODES</span>
          <span>BLOCKS {{ pad2(blocks.length) }}</span>
          <span>LAST SYNC {{ lastSync || '--:--:--' }}</span>
        </div>
        <div class="footer-brand">
          <span>BLOCKCHAIN VISUALIZER</span>
          <span>GRAY RAVEN PROTOCOL // © 2026</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import {
  API_PORTS,
  fetchBlocks as requestBlocks,
  fetchNodeInfo,
} from '../api/blockchain'
import BlockCard from './BlockCard.vue'

const POLL_INTERVAL = 2000

const navItems = [
  { id: 'overview', label: '首页', sub: 'OVERVIEW' },
  { id: 'nodes', label: '节点网络', sub: 'NODE LINK' },
  { id: 'chain', label: '区块数据', sub: 'CHAIN DATA' },
]

const activeSection = ref('overview')
const availableNodes = ref([])
const currentApiPort = ref(API_PORTS[0])
const currentNode = computed(
  () =>
    availableNodes.value.find((node) => node.apiPort === currentApiPort.value) ??
    null,
)
const currentNodeP2pPort = computed(() => currentNode.value?.p2pPort ?? '—')

const blocks = ref([])
const connected = ref(false)
const autoRefresh = ref(true)
const isDiscovering = ref(false)
const isLoading = ref(false)
const lastError = ref('')
const lastSync = ref('')

let pollTimer = null
let nodeInfoTimer = null
let discoveryTimer = null
let requestId = 0
let discovering = false

const pad2 = (value) => String(value).padStart(2, '0')

const statusTitle = computed(() =>
  connected.value ? '节点连接正常' : lastError.value || '无法连接到节点',
)

const goToSection = (id) => {
  activeSection.value = id
  const target = document.getElementById(id)
  if (!target) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

const handleScroll = () => {
  const marker = window.innerHeight * 0.2
  const nodesEl = document.getElementById('nodes')
  const chainEl = document.getElementById('chain')
  const nodesTop = nodesEl?.getBoundingClientRect().top
  const chainTop = chainEl?.getBoundingClientRect().top

  // 宽屏下节点与区块并排，保持用户点击的那一列高亮
  if (
    nodesTop !== undefined &&
    chainTop !== undefined &&
    Math.abs(nodesTop - chainTop) < 80 &&
    nodesTop <= marker &&
    (activeSection.value === 'nodes' || activeSection.value === 'chain')
  ) {
    return
  }

  let current = 'overview'
  for (const item of navItems) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= marker) {
      current = item.id
    }
  }
  activeSection.value = current
}

// 探测单个端口，返回在线的节点信息；不可用时返回 null
const scanNode = async (port) => {
  try {
    return await fetchNodeInfo(port)
  } catch {
    return null
  }
}

// 扫描所有候选端口，发现当前网络中的节点
// silent=true 用于后台定时发现，不显示“正在发现节点...”提示
const discoverNodes = async ({ silent = false } = {}) => {
  if (discovering) return

  discovering = true
  if (!silent) isDiscovering.value = true
  try {
    const results = await Promise.all(API_PORTS.map(scanNode))
    availableNodes.value = results
      .filter(Boolean)
      .sort((a, b) => a.apiPort - b.apiPort)

    // 当前节点已经下线时，自动切换到第一个可用节点
    const currentStillOnline = availableNodes.value.some(
      (node) => node.apiPort === currentApiPort.value,
    )
    if (!currentStillOnline && availableNodes.value.length > 0) {
      requestId += 1 // 丢弃仍在途的旧节点请求
      currentApiPort.value = availableNodes.value[0].apiPort
      blocks.value = []
      connected.value = false
    }
  } finally {
    discovering = false
    if (!silent) isDiscovering.value = false
  }
}

// 拉取当前节点的区块链数据（silent 用于定时刷新，不显示按钮 loading）
const fetchBlocks = async ({ silent = false } = {}) => {
  const port = currentApiPort.value
  const id = ++requestId
  if (!silent) isLoading.value = true

  try {
    const chain = await requestBlocks(port)
    if (id !== requestId) return

    blocks.value = chain
    connected.value = true
    lastError.value = ''
    lastSync.value = dayjs().format('HH:mm:ss')

    const node = availableNodes.value.find((item) => item.apiPort === port)
    if (node) node.blockCount = chain.length
  } catch (error) {
    if (id !== requestId) return

    connected.value = false
    lastError.value =
      error?.message === 'Network Error'
        ? `无法连接 API 端口 ${port}`
        : `获取区块数据失败（API 端口 ${port}）`
  } finally {
    if (id === requestId) isLoading.value = false
  }
}

// 点击“刷新节点”：重新扫描节点，并同步当前节点的最新区块
const refreshNodes = async () => {
  await discoverNodes()
  if (currentNode.value) {
    await fetchBlocks()
  }
}

const switchToNode = (node) => {
  if (node.apiPort === currentApiPort.value) return

  requestId += 1 // 丢弃仍在途的旧节点请求
  currentApiPort.value = node.apiPort
  blocks.value = []
  connected.value = false
  fetchBlocks()
}

// 定时同步节点信息，避免非当前节点的区块数量过期
const refreshNodeCounts = async () => {
  if (availableNodes.value.length === 0) return

  const infos = await Promise.all(
    availableNodes.value.map(async (node) => {
      try {
        return await fetchNodeInfo(node.apiPort)
      } catch {
        return null
      }
    }),
  )

  for (const info of infos) {
    if (!info) continue
    const node = availableNodes.value.find((item) => item.apiPort === info.apiPort)
    if (node) {
      node.p2pPort = info.p2pPort ?? node.p2pPort
      node.blockCount = info.blockCount
    }
  }
}

const startPolling = () => {
  stopPolling()
  pollTimer = window.setInterval(() => {
    if (document.hidden) return
    fetchBlocks({ silent: true })
  }, POLL_INTERVAL)
  // 节点区块数量与链数据保持同一刷新频率
  nodeInfoTimer = window.setInterval(refreshNodeCounts, POLL_INTERVAL)
  // 后台定时重新发现节点，兼顾先打开网页、后启动后端的情况
  discoveryTimer = window.setInterval(() => {
    if (document.hidden) return
    discoverNodes({ silent: true })
  }, 10000)
}

const stopPolling = () => {
  if (pollTimer) {
    window.clearInterval(pollTimer)
    pollTimer = null
  }
  if (nodeInfoTimer) {
    window.clearInterval(nodeInfoTimer)
    nodeInfoTimer = null
  }
  if (discoveryTimer) {
    window.clearInterval(discoveryTimer)
    discoveryTimer = null
  }
}

const handleAutoRefreshChange = () => {
  if (autoRefresh.value) {
    startPolling()
    fetchBlocks({ silent: true })
  } else {
    stopPolling()
  }
}

// 勾选“自动刷新”后立即再取一次，避免等待 2 秒
watch(autoRefresh, handleAutoRefreshChange)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  await discoverNodes()
  if (currentNode.value) {
    await fetchBlocks()
  }
  if (autoRefresh.value) startPolling()
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  stopPolling()
})
</script>

<style scoped>
.site-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 36px;
  max-width: none;
  margin: 0 auto;
  padding: 0 clamp(24px, 3vw, 64px);
}

.main-column {
  min-width: 0;
}

.side-nav {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-self: start;
  height: 100vh;
  padding: 34px 0 30px;
  z-index: 3;
}

.nav-mark {
  position: relative;
  width: 28px;
  height: 18px;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
}

.nav-mark span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.75);
  transition: background 0.2s, transform 0.2s;
}

.nav-mark span:nth-child(1) {
  top: 0;
}

.nav-mark span:nth-child(2) {
  top: 8px;
  width: 72%;
}

.nav-mark span:nth-child(3) {
  top: 16px;
  width: 46%;
}

.nav-mark:hover span {
  background: var(--red);
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 26px;
  margin-top: 27vh;
}

.nav-links button {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 0 0 18px;
  text-align: left;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-links button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 1px;
  bottom: 1px;
  width: 2px;
  background: transparent;
  transition: background 0.2s, box-shadow 0.2s;
}

.nav-links button:hover {
  color: #fff;
}

.nav-links button.active {
  color: #fff;
}

.nav-links button.active::before {
  background: var(--red);
  box-shadow: 0 0 12px rgba(255, 31, 61, 0.8);
}

.nav-label {
  font-size: 13px;
  letter-spacing: 0.16em;
}

.nav-links small {
  font-family: var(--mono);
  font-size: 7px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.28);
}

.nav-links button.active small {
  color: var(--red);
}

.nav-foot {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
  font-family: var(--mono);
  font-size: 7px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.28);
}

.hero {
  /* centered hero layout */
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: min(720px, 80vh);
  padding: 24px 0 18px;
  scroll-margin-top: 24px;
}

.hero-art {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  top: 4%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 76%;
  background: radial-gradient(
    ellipse at 50% 45%,
    rgba(255, 31, 61, 0.4),
    rgba(255, 31, 61, 0.1) 42%,
    transparent 70%
  );
  filter: blur(28px);
}

.hero-rings {
  position: absolute;
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: min(660px, 64vw);
  height: min(660px, 64vw);
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0 1px,
    transparent 1px 28px
  );
  -webkit-mask-image: radial-gradient(circle, #000 18%, transparent 70%);
  mask-image: radial-gradient(circle, #000 18%, transparent 70%);
  opacity: 0.55;
}

.hero-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.24),
    transparent
  );
}

.hero-line--top {
  top: 21%;
}

.hero-line--bottom {
  bottom: 19%;
}

.hero-shard {
  position: absolute;
  display: block;
}

.hero-shard--a {
  top: 35%;
  right: 8%;
  width: 420px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 31, 61, 0.8),
    transparent
  );
  box-shadow: 0 0 24px rgba(255, 31, 61, 0.5);
  transform: rotate(-28deg);
}

.hero-shard--b {
  top: 23%;
  right: 18%;
  width: 170px;
  height: 170px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  transform: rotate(45deg);
}

.hero-shard--c {
  right: 0;
  bottom: 12%;
  width: 42%;
  height: 120px;
  background: linear-gradient(
    105deg,
    transparent,
    rgba(255, 31, 61, 0.12),
    transparent
  );
  transform: skewX(-20deg);
  filter: blur(2px);
}

.hero-shard--d {
  right: 0;
  bottom: 24%;
  width: 58%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 31, 61, 0.55),
    transparent
  );
  box-shadow: 0 0 18px rgba(255, 31, 61, 0.25);
  transform: rotate(-18deg);
}

.hero-petal {
  position: absolute;
  display: block;
  background: linear-gradient(
    180deg,
    rgba(255, 82, 102, 0.4),
    rgba(255, 31, 61, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.14);
  clip-path: polygon(50% 0, 100% 76%, 50% 100%, 0 76%);
  filter: blur(0.6px);
  pointer-events: none;
}

.hero-petal--a {
  right: 9%;
  bottom: 3%;
  width: 150px;
  height: 300px;
  transform: rotate(24deg);
  opacity: 0.28;
}

.hero-petal--b {
  right: 27%;
  bottom: 10%;
  width: 90px;
  height: 210px;
  transform: rotate(-34deg);
  opacity: 0.22;
}

.hero-petal--c {
  right: 3%;
  bottom: 20%;
  width: 62px;
  height: 160px;
  transform: rotate(58deg);
  opacity: 0.25;
}

.hero-rail {
  position: absolute;
  top: 38%;
  right: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 7px;
  letter-spacing: 0.26em;
  color: rgba(255, 255, 255, 0.28);
  writing-mode: vertical-rl;
  pointer-events: none;
}

.hero-rail i {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.18);
}

.hero-art::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 38%,
    transparent 16%,
    rgba(5, 3, 4, 0.58) 78%
  );
}

.hero-city {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 78%;
  background: url('/hero-city.jpg') center top / cover no-repeat;
  opacity: 0.92;
  filter: saturate(0.9) brightness(0.98);
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to top,
    transparent 0%,
    rgba(0, 0, 0, 0.28) 8%,
    #000 20%,
    #000 92%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to top,
    transparent 0%,
    rgba(0, 0, 0, 0.28) 8%,
    #000 20%,
    #000 92%,
    transparent 100%
  );
}

.hero-city::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(5, 3, 4, 0.5), transparent 16%);
}

.hero-city::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(5, 3, 4, 0.94) 0%,
      rgba(5, 3, 4, 0.55) 26%,
      transparent 62%
    ),
    radial-gradient(ellipse at 50% 30%, rgba(255, 31, 61, 0.14), transparent 60%);
}

.hero-top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.brand-mark {
  display: flex;
  gap: 3px;
  height: 24px;
  margin-top: 2px;
}

.brand-mark i {
  display: block;
  width: 3px;
  background: #f4f1ea;
  transform: skewX(-18deg);
}

.brand-mark i:nth-child(1) {
  height: 16px;
  opacity: 0.5;
}

.brand-mark i:nth-child(2) {
  height: 20px;
  opacity: 0.78;
}

.brand-mark i:nth-child(3) {
  height: 24px;
  background: var(--red);
  box-shadow: 0 0 10px rgba(255, 31, 61, 0.6);
}

.brand-eyebrow {
  margin: 0;
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--red);
}

.brand-sub {
  margin: 4px 0 0;
  font-family: var(--mono);
  font-size: 7px;
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.4);
}

.hero-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.2em;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.75);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 10px var(--red);
  animation: status-pulse 2.4s ease-in-out infinite;
}

.status.is-offline .status-dot {
  background: #6d6460;
  box-shadow: none;
  animation: none;
}

.node-readout {
  color: rgba(255, 255, 255, 0.38);
}

.current-node {
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.12em;
}

.hero-body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(1400px, 100%);
  margin: auto;
  padding: 1vh 0;
  text-align: center;
}

.hero-visual,
.hero-copy,
.hero-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hero-kicker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 0 8px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.28em;
  color: rgba(255, 255, 255, 0.55);
}

.hero-kicker::before {
  content: '';
  width: 36px;
  height: 1px;
  background: var(--red);
  box-shadow: 0 0 10px rgba(255, 31, 61, 0.6);
}

.hero-kicker span {
  color: var(--red);
}

.hero-core {
  width: min(540px, 78%);
  margin: 0 auto 2px;
}

.hero-core img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 44px rgba(255, 31, 61, 0.36));
  animation: emblem-spin 120s linear infinite;
}

.hero-heading {
  display: none;
}

.hero-en {
  margin: 14px 0 0;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.42em;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.hero-desc {
  max-width: 560px;
  margin: 10px auto 0;
  font-size: 13px;
  line-height: 1.8;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.62);
  text-align: center;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.line-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 13px 26px;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: #f4f1ea;
  background: rgba(5, 3, 4, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.42);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.line-btn:hover:not(:disabled) {
  color: #fff;
  background: rgba(255, 31, 61, 0.08);
  border-color: var(--red);
  box-shadow: 0 0 22px rgba(255, 31, 61, 0.16);
}

.line-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.line-btn small {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.38);
}

.line-btn--primary {
  border-color: rgba(255, 255, 255, 0.72);
}

.line-btn--small {
  padding: 8px 16px;
  font-size: 10px;
  letter-spacing: 0.12em;
}

.btn-mark {
  font-family: var(--mono);
  letter-spacing: -0.1em;
  color: var(--red);
}

.auto-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.auto-toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.auto-track {
  position: relative;
  width: 38px;
  height: 16px;
  flex: none;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: border-color 0.2s, background 0.2s;
}

.auto-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.55);
  transition: left 0.2s, background 0.2s, box-shadow 0.2s;
}

.auto-toggle input:checked + .auto-track {
  background: rgba(255, 31, 61, 0.12);
  border-color: var(--red);
}

.auto-toggle input:checked + .auto-track .auto-thumb {
  left: 24px;
  background: var(--red);
  box-shadow: 0 0 10px var(--red);
}

.auto-toggle input:focus-visible + .auto-track {
  outline: 1px solid var(--red);
  outline-offset: 2px;
}

.auto-text {
  font-size: 12px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.7);
}

.auto-text em {
  margin-left: 6px;
  font-family: var(--mono);
  font-style: normal;
  font-size: 8px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.35);
}

.hero-bottom {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.hero-bottom::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 80px;
  height: 1px;
  background: var(--red);
  box-shadow: 0 0 12px rgba(255, 31, 61, 0.5);
}

.hero-meta {
  display: flex;
  width: min(780px, 100%);
  background: rgba(5, 3, 4, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.meta-box {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 14px 24px 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.18);
}

.meta-box:last-child {
  border-right: 0;
}

.meta-box em {
  font-family: var(--mono);
  font-style: normal;
  font-size: 8px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.4);
}

.meta-box strong {
  font-family: var(--mono);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: #f4f1ea;
}

.scroll-hint {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.45);
  background: none;
  border: 0;
  cursor: pointer;
}

.scroll-hint i {
  width: 1px;
  height: 32px;
  background: linear-gradient(180deg, var(--red), transparent);
}

.scroll-hint:hover {
  color: #fff;
}

.sections-grid {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
}

.content-section {
  position: relative;
  width: 100%;
  padding: 86px 0 0;
  scroll-margin-top: 30px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-bottom: 16px;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.section-index {
  font-family: var(--mono);
  font-size: 38px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 31, 61, 0.65);
}

.section-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title-wrap h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: #f4f1ea;
}

.section-title-wrap small {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.26em;
  color: rgba(255, 255, 255, 0.35);
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.18),
    transparent
  );
}

.section-meta {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}

.node-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.node-btn {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  gap: 24px 20px;
  padding: 20px 22px;
  color: #f4f1ea;
  text-align: left;
  cursor: pointer;
  background: rgba(8, 5, 6, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
}

.node-btn::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 46px;
  height: 1px;
  background: rgba(255, 255, 255, 0.6);
}

.node-btn::after {
  content: '';
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 46px;
  height: 1px;
  background: rgba(255, 255, 255, 0.35);
}

.node-btn:hover:not(.active) {
  background: rgba(12, 7, 9, 0.7);
  border-color: rgba(255, 255, 255, 0.65);
  transform: translateY(-2px);
}

.node-btn.active {
  background: linear-gradient(
    180deg,
    rgba(255, 31, 61, 0.12),
    rgba(8, 5, 6, 0.65)
  );
  border-color: var(--red);
  box-shadow:
    0 0 30px rgba(255, 31, 61, 0.12),
    inset 0 0 30px rgba(255, 31, 61, 0.04);
}

.node-btn.active::before {
  width: 100%;
  background: var(--red);
  box-shadow: 0 0 14px rgba(255, 31, 61, 0.5);
}

.node-btn:focus-visible {
  outline: 1px solid var(--red);
  outline-offset: 3px;
}

.node-index {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.4);
}

.node-btn.active .node-index {
  color: var(--red);
}

.node-api {
  justify-self: end;
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.3);
}

.node-p2p {
  align-self: end;
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.6);
}

.node-p2p strong {
  display: block;
  margin-top: 4px;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #f4f1ea;
}

.node-btn.active .node-p2p strong {
  color: #fff;
  text-shadow: 0 0 24px rgba(255, 31, 61, 0.35);
}

.node-blocks {
  align-self: end;
  justify-self: end;
  text-align: right;
}

.node-blocks strong {
  display: block;
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 500;
  line-height: 1;
  color: #f4f1ea;
}

.node-blocks em {
  display: block;
  margin-top: 4px;
  font-family: var(--mono);
  font-style: normal;
  font-size: 7px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.35);
}

.node-btn.active .node-blocks strong {
  color: var(--red);
}

.node-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 160px;
  padding: 24px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(8, 5, 6, 0.35);
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.empty-sigil {
  font-size: 20px;
  color: var(--red);
  text-shadow: 0 0 16px rgba(255, 31, 61, 0.6);
}

.node-empty p {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.06em;
}

.node-empty small {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.3);
}

.nodes-aside {
  display: none;
}

.chain-display {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chain-display::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(255, 255, 255, 0.14) 5%,
    rgba(255, 31, 61, 0.3) 50%,
    rgba(255, 255, 255, 0.14) 95%,
    transparent
  );
  opacity: 0.6;
}

.block-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.chain-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 58px;
}

.link-line {
  width: 1px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(255, 31, 61, 0.6),
    transparent
  );
}

.link-glyph {
  position: absolute;
  width: 7px;
  height: 7px;
  background: #050304;
  border: 1px solid var(--red);
  transform: rotate(45deg);
  box-shadow: 0 0 12px rgba(255, 31, 61, 0.65);
}

.link-caption {
  position: absolute;
  top: 50%;
  left: calc(50% + 18px);
  transform: translateY(-50%);
  font-family: var(--mono);
  font-size: 7px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.3);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 80px 20px;
  background: rgba(8, 5, 6, 0.35);
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.empty-state p {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.55);
}

.empty-state small {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.3);
}

.site-footer {
  width: 100%;
  max-width: 1500px;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px 0 36px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.footer-hud {
  display: flex;
  gap: 26px;
  flex-wrap: wrap;
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.3);
}

.footer-hud span::before {
  content: '//';
  margin-right: 8px;
  color: var(--red);
}

.footer-brand {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 18px;
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.45);
}

@keyframes emblem-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes status-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@media (min-width: 1300px) {
  .sections-grid {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    align-items: start;
    gap: clamp(36px, 4vw, 64px);
    margin-top: 86px;
  }

  .content-section {
    padding: 0;
  }

  .nodes-section {
    position: sticky;
    top: 24px;
    align-self: start;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 48px);
    padding: 20px 20px 22px;
    background: linear-gradient(
      180deg,
      rgba(11, 8, 10, 0.72),
      rgba(5, 3, 4, 0.28)
    );
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .nodes-section .node-grid {
    grid-template-columns: 1fr;
  }

  .nodes-section .node-btn {
    padding: 22px 24px;
  }

  .nodes-section .node-p2p strong,
  .nodes-section .node-blocks strong {
    font-size: 36px;
  }

  .nodes-aside {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 260px;
    margin-top: 24px;
    padding-top: 22px;
    overflow: hidden;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .nodes-aside-mark {
    position: absolute;
    right: -8px;
    bottom: -32px;
    font-family: 'Bahnschrift', 'Arial Narrow', sans-serif;
    font-size: 170px;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.055);
    user-select: none;
  }

  .nodes-aside-spine {
    position: absolute;
    left: 34px;
    top: 26px;
    bottom: 78px;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 31, 61, 0.06),
      rgba(255, 31, 61, 0.5) 20%,
      rgba(255, 255, 255, 0.15) 70%,
      transparent
    );
  }

  .nodes-aside-spine::before,
  .nodes-aside-spine::after {
    content: '';
    position: absolute;
    left: -3px;
    width: 7px;
    height: 7px;
    background: #050304;
    border: 1px solid rgba(255, 31, 61, 0.6);
    transform: rotate(45deg);
  }

  .nodes-aside-spine::before {
    top: -3px;
  }

  .nodes-aside-spine::after {
    bottom: -3px;
  }

  .nodes-aside-pulse {
    position: absolute;
    left: 30px;
    top: 10%;
    width: 9px;
    height: 9px;
    background: var(--red);
    border-radius: 50%;
    box-shadow: 0 0 16px var(--red);
    animation: aside-pulse 4.5s linear infinite;
  }

  .nodes-aside-vertical {
    position: absolute;
    left: 48px;
    top: 38%;
    font-family: var(--mono);
    font-size: 8px;
    letter-spacing: 0.28em;
    color: rgba(255, 255, 255, 0.25);
    writing-mode: vertical-rl;
  }

  @keyframes aside-pulse {
    0% {
      top: 10%;
      opacity: 0;
    }
    8% {
      opacity: 1;
    }
    86% {
      opacity: 1;
    }
    100% {
      top: 84%;
      opacity: 0;
    }
  }

  .nodes-aside-line {
    position: absolute;
    left: 0;
    top: 22px;
    bottom: 18px;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 31, 61, 0.5),
      rgba(255, 255, 255, 0.12) 30%,
      rgba(255, 255, 255, 0.06)
    );
  }

  .nodes-aside-meta {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: var(--mono);
    font-size: 8px;
    letter-spacing: 0.22em;
    color: rgba(255, 255, 255, 0.35);
  }

  .nodes-aside-meta span:first-child {
    color: var(--red);
  }
}

@media (min-width: 1100px) {
  .hero {
    min-height: min(700px, 80vh);
  }

  .hero-copy {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    width: 100%;
    max-width: 980px;
    text-align: left;
  }

  .hero-text {
    align-items: flex-start;
    width: auto;
    text-align: left;
  }

  .hero-en {
    margin-top: 0;
    text-align: left;
  }

  .hero-desc {
    max-width: 520px;
    margin: 10px 0 0;
    text-align: left;
  }

  .hero-actions {
    flex: none;
    justify-content: flex-end;
    margin-top: 0;
  }
}

@media (max-width: 1180px) {
  .site-layout {
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 24px;
    padding: 0 30px;
  }

  .nav-links {
    margin-top: 24vh;
  }
}

@media (max-width: 1120px) {
  .site-layout {
    display: block;
    padding: 0 28px;
  }

  .side-nav {
    display: none;
  }

  .hero {
    min-height: 88vh;
  }
}

@media (max-width: 760px) {
  .site-layout {
    padding: 0 16px;
  }

  .hero {
    min-height: auto;
    padding: 26px 0 30px;
  }

  .hero-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .hero-status {
    flex-direction: row;
    align-items: center;
    gap: 18px;
  }

  .brand-sub {
    display: none;
  }

  .hero-body {
    padding: 4vh 0 6vh;
  }

  .hero-chain {
    width: 100%;
    max-width: 360px;
    margin: 6px 0 8px;
  }

  .hero-core {
    width: 86%;
    margin: 0 auto 6px;
  }

  .hero-title-compact {
    font-size: 32px;
    letter-spacing: 0.08em;
  }

  .hero-heading {
    gap: 10px;
  }

  .hero-heading-en {
    display: none;
  }

  .hero-en {
    font-size: 8px;
    letter-spacing: 0.22em;
  }

  .hero-desc {
    font-size: 12px;
  }

  .hero-actions {
    gap: 16px;
  }

  .hero-bottom {
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }

  .hero-meta {
    width: 100%;
  }

  .meta-box {
    flex: 1;
    min-width: 0;
    gap: 3px;
    padding: 10px 12px;
  }

  .meta-box em {
    font-size: 7px;
    letter-spacing: 0.16em;
  }

  .meta-box strong {
    font-size: clamp(14px, 4.3vw, 17px);
    letter-spacing: 0.04em;
  }

  .scroll-hint {
    display: none;
  }

  .hero-emblem {
    display: none;
  }

  .hero-city {
    height: 55%;
    opacity: 0.6;
  }

  .hero-rings {
    top: 4%;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: 88vw;
    height: 88vw;
  }

  .hero-line {
    display: none;
  }

  .hero-rail,
  .hero-petal {
    display: none;
  }

  .content-section {
    padding-top: 64px;
  }

  .section-head {
    flex-wrap: wrap;
    gap: 12px;
  }

  .section-index {
    font-size: 28px;
  }

  .section-title-wrap h2 {
    font-size: 17px;
  }

  .section-line {
    display: none;
  }

  .section-meta {
    margin-left: auto;
  }

  .node-grid {
    grid-template-columns: 1fr;
  }

  .link-caption {
    display: none;
  }

  .footer-hud {
    gap: 10px 18px;
  }

  .footer-brand {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
