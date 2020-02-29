const fs = require("fs");
const path = require("path");

const configStructure = require("./configStructure");

module.exports = (configPath) => {
    const truePath = path.join(__dirname, "../..", configPath);

    if (!fs.existsSync(truePath)) {
        fs.writeFileSync(truePath, JSON.stringify(configStructure));
    }

    return require(truePath);
};
