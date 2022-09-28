const Enmap = require("enmap");

class SQLiteTableMerger {
    constructor(client, ...tables) {
        this.client = client;
        this.tables = [...tables];

        if (this.client.mergeSQLiteTables === "true") {
            this.merge();
        }
    }

    merge() {
        if (this.tables.includes("activityDb")) {
            const dbs = { a: new Enmap({ name: "activity" }), b: new Enmap({ name: "activityDb" }) };
            dbs.b.destroy();
        }
        if (this.tables.includes("externalServerDb")) {
            const dbs = { a: new Enmap({ name: "externalServer" }), b: new Enmap({ name: "externalServerDb" }) };
            dbs.b.destroy();
        }
        if (this.tables.includes("guildDb")) {
            const dbs = { a: new Enmap({ name: "guild" }), b: new Enmap({ name: "guildDb" }) };
            dbs.b.destroy();
        }
        if (this.tables.includes("inventoryDb")) {
            const dbs = { a: new Enmap({ name: "inventory" }), b: new Enmap({ name: "inventoryDb" }) };

            for (const player of dbs.b.array()) {
                const id = player.id;
                this.client.inventoryDb.db.set(id, player);
                this.client.inventoryDb.db.set(id, player.yens, "wallet");
                const newCrow = {
                    id: player.kasugai_crow || player.kasugaiCrow?.id || "basicCrow",
                    exp: player.kasugai_crow_exp || player.kasugaiCrow?.exp || 0,
                    hunger: player.kasugaiCrow?.hunger || 100,
                };
                if (newCrow.id === "kasugai_evolved") newCrow.id = "evolvedCrow";
                if (newCrow.id === "kasugai_proud") newCrow.id = "proudCrow";
                if (newCrow.id === "kasugai_simple") newCrow.id = "basicCrow";
                this.client.inventoryDb.db.set(id, newCrow, "kasugaiCrow");
                const newGrimoire = {
                    id: player.active_grimoire || player.enchantedGrimoire?.id || null,
                    activeSince: player.active_grimoire_since || player.enchantedGrimoire?.activeSince || 0,
                };
                this.client.inventoryDb.db.set(id, newGrimoire, "enchantedGrimoire");
                const newWeapon = {
                    id: "katana",
                    rarity: String(player.weapon.rarity) || "3",
                };
                this.client.inventoryDb.db.set(id, newWeapon, "weapon");
                const items = {
                    enchantedGrimoires: player.grimoires,
                    materials: {},
                    questItems: {},
                    weapons: {},
                };
                for (const wp of player.weapons) {
                    if ("rarity" in (wp ?? {})) {
                        if ((items.weapons["katana"] ?? "null") instanceof Object) {
                            if (items.weapons["katana"][String(wp.rarity)] instanceof Number) {
                                items.weapons["katana"][String(wp.rarity)] += 1;
                            }
                        }
                        else {
                            items.weapons["katana"] = {
                                [String(wp.rarity)]: 1,
                            };
                        }
                    }
                }
                for (let mat in player.materials) {
                    const key = mat;
                    if (mat === "weapon_model") mat = "weaponBase";
                    items.materials[mat] = player.materials[key];
                }
                this.client.inventoryDb.db.set(id, items, "items");
            }

            dbs.b.destroy();
        }
        if (this.tables.includes("mapDb")) {
            const dbs = { a: new Enmap({ name: "map" }), b: new Enmap({ name: "mapDb" }) };
            dbs.b.destroy();
        }
        if (this.tables.includes("playerDb")) {
            const dbs = { a: new Enmap({ name: "player" }), b: new Enmap({ name: "playerDb" }) };

            for (const player of dbs.b.array()) {
                const id = player.id;
                this.client.playerDb.db.set(id, player);
                const stats = { strength: player.stats.strength, defense: player.stats.defense };
                this.client.playerDb.db.set(id, stats, "statistics");
                this.client.playerDb.db.set(id, player.breath || "water", "breathingStyle");
                this.client.playerDb.db.set(id, player.created || Date.now(), "creationDate");
            }

            dbs.b.destroy();
        }
        if (this.tables.includes("questDb")) {
            const dbs = { a: new Enmap({ name: "quest" }), b: new Enmap({ name: "questDb" }) };
            dbs.b.destroy();
        }
        if (this.tables.includes("squadDb")) {
            const dbs = { a: new Enmap({ name: "squad" }), b: new Enmap({ name: "squadDb" }) };
            dbs.b.destroy();
        }
        if (this.tables.includes("internalServerManager")) {
            new Enmap({ name: "internalServerManager" }).destroy();
        }
    }
}

module.exports = SQLiteTableMerger;