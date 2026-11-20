# 区块链可视化前端

基于项目已有的 Vue 3 + Vite 框架，展示 `blockchaindemo` 后端通过 HTTP API
输出的节点信息与区块链数据。

## 功能

- 后端 CLI 启动时自动在 `3001` ~ `3005` 中选一个空闲端口开启 HTTP API，
  无需再手动执行 `api 3001`
- 自动发现节点，展示每个节点的 P2P 端口与区块数量，点击可切换节点
- 展示当前节点、连接状态以及整条链（Hash、Prev Hash、Data、Nonce）
- 区块数据每 2 秒自动刷新，节点区块数量同步刷新；可手动关闭自动刷新
- 每 10 秒后台重新发现节点，先打开网页、后启动后端也能自动出现节点
- 当前节点下线时自动切换到其他可用节点
- 页面隐藏时暂停轮询，组件卸载时自动清理定时器

## 启动

### 1. 启动后端（两个节点）

终端 1：

```bash
cd blockchaindemo
npm run start
```

在 CLI 交互命令行中输入：

```text
open 2727
blockchain
mine "1111"
```

终端 2：

```bash
cd blockchaindemo
npm run start
```

在 CLI 交互命令行中输入：

```text
open 2828
connect localhost 2727
blockchain
mine "asdsad"
```

然后回到终端 1 执行 `blockchain`，两边的链应完全一致。

> `open`、`connect`、`mine`、`blockchain` 是进入 `npm run start` 之后才能使用的
> CLI 命令，不是系统终端命令。
>
> 不需要再输入 `api 3001`：每个节点启动时会自动打印
> `API server listening on http://localhost:xxxx`，多节点会自动分配不同的
> API 端口（3001、3002 ...）。`api <port>` 命令仍然保留，但通常不再需要。

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

浏览器打开 Vite 输出的地址（默认 <http://localhost:5173>）。

## 端口说明

- 节点按钮上的“节点 2727”是 **P2P 端口**（来自 `/nodeInfo` 的 `p2pPort`）
- Web 页面通过 **HTTP API 端口**（3001 ~ 3005，自动分配）读取数据
- 前端默认扫描 `3001` ~ `3005`，后端自动启动 API 时也使用同一范围，
  因此按上面的步骤启动即可互相发现

## 配置

如需连接其他主机或端口，在 `frontend` 目录新建 `.env.local`：

```bash
VITE_API_HOST=localhost
VITE_API_PORTS=3001,3002
```

- `VITE_API_HOST`：后端 API 所在主机，默认 `localhost`
- `VITE_API_PORTS`：需要探测的 API 端口列表，逗号分隔；默认 `3001,3002,3003,3004,3005`

后端已通过 `cors` 允许跨域访问，因此前端无需配置代理。
