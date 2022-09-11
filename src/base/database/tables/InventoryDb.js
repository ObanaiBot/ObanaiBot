const SQLiteTable = require("./SQLiteTable");
const InventoryDatas = require("../subclasses/InventoryDatas");

function schema(id) {
    return {
        id: id,
        wallet: 0,
        kasugaiCrow: {
            id: null,
            exp: 0,
            hunger: 100,
        },
        enchantedGrimoire: {
            id: null,
            activeSince: 0,
        },
        weapon: {
            id: "katana",
            rarity: 3,
        },
        items: {
            enchantedGrimoires: {},
            materials: {},
            questItems: {},
            weapons: {},
        },
    };
}

class InventoryDb extends SQLiteTable {
    constructor(client) {
        super(client, "inventory", schema);
    }

    async load(id) {
        return new InventoryDatas(this.client, this.get(id), this.client.playerDb.getLang(id));
    }
}

module.exports = InventoryDb;