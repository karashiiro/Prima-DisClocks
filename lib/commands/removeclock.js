const { mod_roles } = require("../../config.json");

module.exports = {
    execute: async (message, client) => {
        if (message.args.length < 1) return message.reply("too few arguments!");

        const channel = client.channels.get(message.args.find((arg) => parseInt(arg)));

        if (!channel || !channel.guild) return;

        const member = message.member || await channel.guild.fetchMember(message.author.id);

        // Permissions check
        if (!member.roles.some((r) => mod_roles.includes(r.name)))
            return console.log(`User ${message.author.tag} has insufficient permissions to remove a clock in guild ${channel.guild.name}.`);

        await client.clockManager.removeClock(channel);

        return message.reply("the clock was removed!");
    }
};
