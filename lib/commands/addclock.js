const { mod_roles } = require("../../config.json");

module.exports = {
    execute: async (message, client) => {
        if (message.args.length <= 2) return message.reply("too few arguments!");

        const channel = client.channels.get(message.args[0]);
        const timezone = message.args[1];
        const tzCode = message.args[2];

        // Permissions check
        if (!(await channel.guild.fetchMember(message.author.id).roles.some(mod_roles))) return;

        const successCode = await client.clockManager.addClock(channel, timezone, tzCode);

        if (successCode === 3) {
            return message.reply("that clock already exists!");
        }else if (successCode === 1) {
            return message.reply("that's not a valid timezone. Please refer to the TZ database for valid timezones.");
        } else {
            return message.reply("the clock was created! Please allow for up to one minute for the clock to update.");
        }
    }
};
