const axios = require("axios");
const http = require("http");

class UptimeMessageService {
    server;
    name = "DisClocks";
    flavorText = "Tick tock.";
    timeInitialized = Date.now();

    port;

    constructor() {
        this.server = http.createServer((req, res) => {
            const data = [];
            req.on("data", data.push);
            req.on("end", () => {
                let content;
                try {
                    content = JSON.parse(data);
                } catch {
                    console.log(err);
                    return;
                }

                if (content.t === "uptime") {
                    res.end(JSON.stringify({
                        timeInitialized: this.timeInitialized,
                        flavorText: this.flavorText,
                    }));
                }
            });
        });

        this.server.listen();

        this.port = this.server.address().port;

        this.fookinSend();
    }

    async fookinSend() {
        let timeout = 1000;
        let sent = false;
        while (!sent) {
            await new Promise(() => {
                axios.post(process.env.UPTIME_SERVICE_HOSTNAME + "/PostUptime", {
                    name: this.name,
                    port: this.port,
                })
                .catch(async (err) => {
                    console.log(err);
                    await new Promise((timeChekku) => setTimeout(timeChekku, timeout >= 60000 ? 60000 : timeout *= 2));
                    resolve();
                });
            });
        }
    }
}

module.exports = UptimeMessageService;
