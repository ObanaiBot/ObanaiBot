const SQLiteTableChangeListener = require("../../SQLiteTableChangeListener");

class PlayerListener extends SQLiteTableChangeListener {
    constructor(client) {
        super(client);
    }

    async overListener(key, before, after) {
        if (before !== after) {
            await this.client.questDb.notifyQuests(key, "playerDb");
        }
    }
}

module.exports = PlayerListener;