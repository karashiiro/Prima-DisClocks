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

    fookinSend(t = 1000) {
        axios.post(process.env.UPTIME_SERVICE_HOSTNAME + "/PostUptime", {
            name,
            port,
        })
        .catch(async (err) => {
            console.log(err);
            await new Promise((resolve) => setTimeout(resolve, Math.min(t, 60000)));
            fookinSend(t + t);
        });
    }
}

module.exports = UptimeMessageService;