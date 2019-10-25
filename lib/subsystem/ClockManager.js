const fs = require("fs");
const moment = require("moment");
const path = require("path");
const util = require("util");

const clockStructure = require("../util/clockStructure");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

const clockFaces = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];
const halfHourClockFaces = ['🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'];

class ClockManager {
    constructor(client, folderLocation) {
        this.client = client;
        this.folderLocation = path.join(__dirname, "../..", folderLocation);

        if (!fs.existsSync(this.folderLocation)) {
            fs.mkdirSync(this.folderLocation);
        }

        this.clocks = [];

        this.load();
    }

    async addClock(channel, tz, tzCode = null) {
        // Check for existing file
        let files = await readdir(this.folderLocation);
        const fileName = `${channel.id}.json`;
        if (files.includes(fileName)) {
            return 3;
        }

        // Fill clockData and write file out
        const clockData = Object.create(clockStructure);
        clockData.channelID = channel.id;
        const timezone = tz.replace(/[^a-zA-Z_\/+0-9-]/g, "");
        if (timezone.indexOf("/") === -1) {
            return 1;
        } else {
            clockData.timezone = timezone;
        }
        if (tzCode && typeof tzCode === "string") {
            clockData.tzCode = tzCode;
        }
        await writeFile(path.join(this.folderLocation, fileName), JSON.stringify(clockData));

        // Start the clock
        this.startClock(clockData);

        return true;
    }

    async removeClock(channel) {
        let files = await readdir(this.folderLocation);

        for (const file of files) {
            const fullPath = path.join(this.folderLocation, file);
            const fileData = JSON.parse(await readFile(fullPath));
            if (fileData.channel === channel.id) {
                this.clocks.splice(this.clocks.indexOf(channel.id), 1);
                return await unlink(fullPath);
            }
        }
    }

    async load() {
        const files = (await readdir(this.folderLocation)).filter((fileName) => fileName.endsWith(".json"));
        for (const file of files) {
            const clockData = JSON.parse(await readFile(path.join(this.folderLocation, file)));
            this.clocks.push(clockData.channel);
            this.startClock(clockData);
        }
    }

    startClock(clockData) {
        setTimeout(() => {
            if (!this.clocks.includes(clockData.channel)) return;

            const now = moment.tz(clockData.timezone);
            const minute = minute = parseInt(now.format('m'));
            const hour = parseInt(now.format('h'));
            const clockEmoji = minute < 30 ? clockFaces[hour - 1] : halfHourClockFaces[hour - 1];

            this.client
                .channels.get(clockData.channelID)
                .setName(clockEmoji + " " + now.format(`h:mm A${clockData.tzCode ? " zz" : ""}`)
                    + clockData.tzCode ? clockData.tzCode : "");

            startClock(clockData); // Recursive
        }, 60000);
    }
}

module.exports = ClockManager;
