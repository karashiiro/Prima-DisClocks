const { mod_roles } = require("../../config.json");

module.exports = {
    execute: async (message, client) => {
        if (message.args.length <= 1) return message.reply("too few arguments!");

        const channel = client.channels.get(message.args[0]);

        // Permissions check
        if (!(await channel.guild.fetchMember(message.author.id).roles.some(mod_roles))) return;

        await client.clockManager.removeClock(channel, timezone, tzCode);

        return message.reply("the clock was removed!");
    }
};
