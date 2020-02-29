module.exports = (client, message) => {
    const user = client.user;
    console.log("Logged in as " + user.tag);
};

module.exports.eventName = "ready";
