const P2p = require("./P2p");
const Blockchain = require("./Blockchain");
const express = require("express");
const cors = require("cors");

const blockchain = new Blockchain();
const p2p = new P2p(blockchain);

// 前端通过 HTTP API 读取节点和区块数据。
// CLI 启动时自动占用 3001-3005 中第一个空闲端口，
// 这样按“open → connect → mine”的步骤运行时，网页也能发现节点。
const API_PORT_CANDIDATES = [3001, 3002, 3003, 3004, 3005];

let httpServer = null;
let httpPort = null;
let apiStarting = false;

// 主函数，初始化cli命令行页面
function cli(vorpal) {
    vorpal
        .use(welcome)
        .use(connectCommand)
        .use(discoverCommand)
        .use(blockchainCommand)
        .use(peersCommand)
        .use(mineCommand)
        .use(openCommand)
        .use(apiCommand)
        .delimiter("blockchain>>>>>>>>> ")
        .show();

    // 自动启动 HTTP API，无需再手动执行 api 3001
    autoStartApi();
}

module.exports = cli;

// 欢迎指令
function welcome(vorpal) {
    vorpal.log("欢迎来到blockchain命令行界面");
    vorpal.exec("help");
}

// 连接节点指令
function connectCommand(vorpal) {
    vorpal
        .command("connect <host> <port>", "Connect to a new peer.eg: connect localhost 2727")
        .alias("c")
        .action(function (args, callback) {
            if (args.host && args.port) {
                try {
                    p2p.connectToPeer(args.host, Number(args.port));
                } catch (err) {
                    this.log(err.message);
                }
            }
            callback();
        });
}

// 发现节点指令，发现网络中的其他节点
function discoverCommand(vorpal) {
    vorpal
        .command("discover", "Discover new peers from your connected peers.")
        .alias("d")
        .action(function (args, callback) {
            try {
                p2p.discoverPeers();
            } catch (err) {
                this.log(err.message);
            }
            callback();
        });
}

// 区块链查看指令，显示当前区块链的所有完整信息
function blockchainCommand(vorpal) {
    vorpal
        .command("blockchain", "Show the current blockchain.")
        .alias("bc")
        .action(function (args, callback) {
            this.log(blockchain);
            callback();
        });
}

// 节点查看指令
function peersCommand(vorpal) {
    vorpal
        .command("peers", "Show the current peers.")
        .alias("p")
        .action(function (args, callback) {
            if (p2p.peers.length === 0) {
                this.log("No peers connected.");
            } else {
                this.log(`已连接的节点数量: ${p2p.peers.length}`);
                p2p.peers.forEach((peer, index) => {
                    const host = peer.peerInfo?.host || peer.remoteAddress || "Unknown";
                    const port = peer.peerInfo?.port || peer.remotePort || "Unknown";
                    this.log(`Node ${index + 1}: ${host}:${port}`);
                }, this);
            }
            callback();
        });
}

// 挖矿指令
function mineCommand(vorpal) {
    vorpal
        .command("mine <data>", "Mine a new block. eg. mine 'hello111111'")
        .alias("m")
        .action(function (args, callback) {
            if (args.data) {
                blockchain.mine(args.data);
                p2p.broadcastLatest();
            }
            callback();
        });
}

// 开启端口指令
function openCommand(vorpal) {
    vorpal
        .command("open <port>", "Open a port for P2P communication. eg. open 2727")
        .alias("o")
        .action(function (args, callback) {
            const port = Number(args.port);
            if (Number.isInteger(port) && port > 0 && port <= 65535) {
                p2p.startServer(port);
                this.log(`Server is running on port ${port}`);
            } else {
                this.log("Port not xing.");
            }
            callback();
        });
}

// 开启api指令（现在已经自动启动，保留该命令用于手动指定端口/备用）
function apiCommand(vorpal) {
    vorpal
        .command("api <port>", "Start api server. eg: api 3001")
        .alias("a")
        .action(function (args, callback) {
            if (httpServer) {
                this.log(`API 服务已在端口 ${httpPort} 运行，前端会自动发现该节点`);
                return callback();
            }
            if (apiStarting) {
                this.log("API 服务正在自动启动，请稍候再试");
                return callback();
            }
            const port = Number(args.port);
            if (!Number.isInteger(port) || port < 1 || port > 65535) {
                this.log("Port not xing.");
                return callback();
            }
            startApiServer(port)
                .then(() => this.log(`API 服务已启动：http://localhost:${port}`))
                .catch((err) => this.log(`API 端口 ${port} 启动失败：${err.message}`));
            callback();
        });
}

function createApiApp(port) {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/blocks", (req, res) => {
        res.send(blockchain.blockchain);
    });

    app.post("/mineBlock", (req, res) => {
        const data = req.body.data;
        if (data == null) {
            res.status(400).send("data parameter is missing.");
            return;
        }
        blockchain.mine(data);
        const newBlock = blockchain.latestBlock;
        p2p.broadcastLatest();
        res.send(newBlock);
    });

    app.get("/peers", (req, res) => {
        res.send(
            p2p.peers.map((s) => {
                const host = s.peerInfo?.host || s.remoteAddress;
                const peerPort = s.peerInfo?.port || s.remotePort;
                return `${host}:${peerPort}`;
            }),
        );
    });

    app.get("/nodeInfo", (req, res) => {
        res.send({
            p2pPort: p2p.serverPort,
            apiPort: port,
            blockCount: blockchain.blockchain.length,
        });
    });

    app.post("/addPeer", (req, res) => {
        p2p.connectToPeer(req.body.peer);
        res.send();
    });

    return app;
}

function startApiServer(port) {
    return new Promise((resolve, reject) => {
        if (httpServer) {
            resolve(httpServer);
            return;
        }

        const app = createApiApp(port);
        const server = app.listen(port);

        const onError = (err) => {
            server.removeListener("listening", onListening);
            reject(err);
        };
        const onListening = () => {
            server.removeListener("error", onError);
            server.on("error", (err) => {
                console.error("API server error:", err.message);
            });
            httpServer = server;
            httpPort = port;
            console.log(`API server listening on http://localhost:${port}`);
            resolve(server);
        };

        server.once("error", onError);
        server.once("listening", onListening);
    });
}

// 依次尝试 3001-3005，占用第一个空闲端口
async function autoStartApi() {
    if (httpServer || apiStarting) return;

    apiStarting = true;
    try {
        for (const port of API_PORT_CANDIDATES) {
            try {
                await startApiServer(port);
                return;
            } catch (err) {
                if (err.code !== "EADDRINUSE") {
                    console.error(`API server failed on port ${port}: ${err.message}`);
                    return;
                }
            }
        }
        console.warn("没有空闲的 API 端口（3001-3005），前端将无法发现本节点");
    } finally {
        apiStarting = false;
    }
}
