// Dependencies
const Discord              = require("discord.js");

const onMessage            = require("./lib/events/onMessage");
const onReady              = require("./lib/events/onReady");

const ClockManager         = require("./lib/subsystem/ClockManager");
const UptimeMessageService = require("./lib/subsystem/UptimeMessageService");

const ensureConfig         = require("./lib/util/ensureConfig");

// Config load/creation
ensureConfig("./config.json");

// Bot client initialization
const client = new Discord.Client();

// Client events
client.events = [onMessage, onReady];
for (let i = 0; i < client.events.length; i++) {
    const e = client.events[i];
    const boundEvent = client.on(e.eventName, e.bind(null, client));
    // Replaces raw function with event listener
    client.events[i] = boundEvent;
}

// Log in and set up subsystems
client.login(process.env.DISCORD_BOT_TOKEN)
.then(() => {
    client.guild = client.guilds.first();
    client.clockManager = new ClockManager(client, "./clocks");
    client.uptimeMessageService = new UptimeMessageService();
})
.catch(console.error);
