const fs     = require("fs");
const moment = require("moment-timezone");
const path   = require("path");
const util   = require("util");

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
        const tzExists = moment.tz.zone(tz);
        if (!tzExists) {
            return 1;
        }
        clockData.timezone = tz;
        if (tzCode && typeof tzCode === "string") {
            clockData.tzCode = tzCode;
        }
        await writeFile(path.join(this.folderLocation, fileName), JSON.stringify(clockData));

        return true;
    }

    async removeClock(channel) {
        let files = (await readdir(this.folderLocation)).filter((fileName) => fileName.endsWith(".json"));

        for (const file of files) {
            const fullPath = path.join(this.folderLocation, file);
            const fileData = JSON.parse(await readFile(fullPath));
            if (fileData.channelID === channel.id) {
                return await unlink(fullPath);
            }
        }
    }

    async load() {
        const files = (await readdir(this.folderLocation)).filter((fileName) => fileName.endsWith(".json"));
        for (const file of files) {
            const clockData = JSON.parse(await readFile(path.join(this.folderLocation, file)));
        }
        this.startClocks(true);
    }

    startClocks(startNow = false) {
        setTimeout(async () => {
            const files = (await readdir(this.folderLocation)).filter((fileName) => fileName.endsWith(".json"));
            for (const file of files) {
                const clockData = JSON.parse(await readFile(path.join(this.folderLocation, file)));

                const now = moment().tz(clockData.timezone);
                const minute = parseInt(now.format('m'));
                const hour = parseInt(now.format('h'));
                const clockEmoji = minute < 30 ? clockFaces[hour - 2] : halfHourClockFaces[hour - 2];

                this.client
                    .channels.get(clockData.channelID)
                    .setName(clockEmoji + " " + now.format(`h:mm A${clockData.tzCode ? " " : " zz"}`)
                        + (clockData.tzCode ? clockData.tzCode : ""));
            }

            this.startClocks();
        }, startNow ? 0 : 60000);
    }
}

module.exports = ClockManager;
