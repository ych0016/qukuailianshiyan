import axios from 'axios'

// 后端每个节点都会启动一个 HTTP API（cli.js 中的 api 命令），
// 这里列出前端需要探测的 API 端口，可通过 .env 中的 VITE_API_PORTS 覆盖。
const DEFAULT_API_PORTS = [3001, 3002, 3003, 3004, 3005]

const env = import.meta.env ?? {}
const apiHost = env.VITE_API_HOST || 'localhost'

const customPorts = String(env.VITE_API_PORTS || '')
  .split(',')
  .map((port) => Number(port.trim()))
  .filter((port) => Number.isInteger(port) && port > 0 && port < 65536)

export const API_HOST = apiHost
export const API_PORTS = customPorts.length
  ? [...new Set(customPorts)]
  : DEFAULT_API_PORTS

// 请求超时时间不宜过短，否则本机首次连接时容易误判节点离线
const http = axios.create({ timeout: 1200 })

export const nodeBaseUrl = (port) => `http://${apiHost}:${port}`

// 获取节点信息：P2P 端口、API 端口、当前区块数量
export async function fetchNodeInfo(port) {
  const { data } = await http.get(`${nodeBaseUrl(port)}/nodeInfo`)

  if (!data || typeof data !== 'object') {
    throw new Error('节点信息格式错误')
  }

  return {
    apiPort: port,
    p2pPort: data.p2pPort ?? null,
    blockCount: Number(data.blockCount) || 0,
  }
}

// 获取当前节点的整条区块链
export async function fetchBlocks(port) {
  const { data } = await http.get(`${nodeBaseUrl(port)}/blocks`)

  if (!Array.isArray(data)) {
    throw new Error('区块数据格式错误')
  }

  return data
}
