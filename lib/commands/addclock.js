const { mod_roles } = require("../../config.json");

module.exports = {
    execute: async (message, client) => {
        if (message.args.length < 2) return message.reply("too few arguments!");

        const channel = client.channels.get(message.args.find((arg) => parseInt(arg)));
        const timezone = message.args[1];
        const tzCode = message.args[2];

        if (!channel || !channel.guild) return message.reply("that's not a valid channel ID.");

        const member = message.member || await channel.guild.fetchMember(message.author.id);

        // Permissions check
        if (!member.roles.some((r) => mod_roles.includes(r.name)))
            return console.log(`User ${message.author.tag} has insufficient permissions to create a clock in guild` +
                ` ${channel.guild.name}.`);

        const successCode = await client.clockManager.addClock(channel, timezone, tzCode);

        if (successCode === 3) {
            return message.reply("that clock already exists!");
        } else if (successCode === 1) {
            return message.reply("that's not a valid timezone. Please refer to the TZ database for valid timezones " +
                "here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones");
        } else {
            return message.reply("the clock was created! Please allow for up to one minute for the clock to update.");
        }
    }
};
