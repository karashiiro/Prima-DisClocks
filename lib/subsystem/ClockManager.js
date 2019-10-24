const fs = require("fs");
const isEqual = require("lodash.isequal");
const moment = require("moment");
const path = require("path");
const RichEmbed = require("discord.js").RichEmbed;
const util = require("util");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

class ClockManager {
    constructor(client, folderLocation) {
        this.client = client;
        this.folderLocation = path.join(__dirname, "../..", folderLocation);

        if (!fs.existsSync(this.folderLocation)) {
            fs.mkdirSync(this.folderLocation);
        }

        this.feeds = [];

        this.load();
    }

    async subscribeTo(channel, url) {
        let files = await readdir(this.folderLocation);
        //
    }

    async unsubscribeFrom(channel, url) {
        //
    }

    async load() {
        const files = (await readdir(this.folderLocation)).filter((fileName) => fileName.endsWith(".json"));
        for (const file of files) {
            const feedData = JSON.parse(await readFile(path.join(this.folderLocation, file)));
            this.feeds.push(file);
            this.fetch(feedData, true);
        }
    }
}

module.exports = ClockManager;
