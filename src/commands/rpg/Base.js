const Command = require("../../base/Command");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");
const Nav = require("../../base/Navigation");

class Base extends Command {
    constructor() {
        super({
            name: "base",
            description: "Commande permettant d'afficher les informations d'un joueur.",
            descriptionLocalizations: {
                "en-US": "Command to display player informations.",
            },
            options: [
                {
                    type: 6,
                    name: "base",
                    nameLocalizations: {
                        "en-US": "base",
                    },
                    description: "Joueur dont vous souhaitez afficher les informations.",
                    descriptionLocalizations: {
                        "en-US": "Player whose informations you want to display.",
                    },
                    required: false,
                },
            ],
            type: [1, 2],
            dmPermission: true,
            category: "RPG",
            cooldown: 5,
            finishRequest: ["base"],
            private: "none",
            permissions: 0n,
        });
    }

    async run() {
        const user = this.interaction.user;
        let userId = user.id;
        if (this.interaction.type === 1) userId = this.interaction.options?.get("joueur")?.user?.id;
        else if (this.interaction.type === 2) userId = this.client.users.cache.get(this.interaction.targetId);
        userId = (await this.client.getUser(userId, user)).userId;

        const userPDB = await this.client.playerDb.load(userId);
        const userIDB = await this.client.inventoryDb.load(userId);
        const userADB = await this.client.activityDb.load(userId);
        const userMDB = await this.client.mapDb.load(userId);
        console.log(userMDB);

        let userstatisticsObject = {};
        for (const statKey in userPDB.statisticsLevel) {
            userstatisticsObject[statKey] = `${this.consts.emojis.rpg.statistics[statKey]} `
                + `» **${this.lang.rpgAssets.statistics[statKey]} | `
                + `\`${this.client.util.intRender(userPDB.finalstatistics[statKey])}\`**\n`
                + `*(${this.lang.strings.level} ${userPDB.statisticsLevel[statKey]}) **${userPDB.statistics[statKey]}***`;

            if (userPDB.grimBoosts[statKey][0] > 0) {
                userstatisticsObject[statKey] += ` *+ **${userPDB.grimBoosts[statKey][0]}**`
                    + ` (${userPDB.grimBoosts[statKey][1]}%)`
                    + `${this.consts.emojis.rpg.objects.enchantedGrimoire}*`;
            }
        }
        userstatisticsObject = Object.values(userstatisticsObject).join("\n");
        const userRank = `${this.lang.strings.level}: **${userPDB.level.level}** | `
            + `${this.lang.strings.total_experience}: ⭐ **${this.client.util.intRender(userPDB.exp, " ")}**`
            + `\n${this.lang.strings.level_experience}: ⭐ **`
            + `${this.client.util.intRender(userPDB.level.tempExp, " ")}`
            + `**/${this.client.util.intRender(userPDB.level.required, " ")}`;

        let userInventoryObjects = {};

        const playerFields = [
            {
                name: `» ${this.lang.panels.player.pages["0"].embeds["0"].fields["0"].name} «`,
                value: `\u200b\n${userstatisticsObject}`,
                inline: true,
            },
            {
                name: `» ${this.lang.panels.player.pages["0"].embeds["0"].fields["1"].name} «`,
                value: `\u200b\n${userRank}`,
                inline: true,
            },
        ];
        const inventoryFields = [
            {
                name: `» ${this.lang.panels.inventory.pages["0"].embeds["0"].fields["0"].name} «`,
                value: "\u200b\ninventory",
                inline: true,
            },
        ];
        const activityFields = [
            {
                name: `» ${this.lang.panels.activity.pages["0"].embeds["0"].fields["0"].name} «`,
                value: "\u200b\nactivity",
                inline: true,
            },
        ];
        const crowFields = [
            {
                name: `» ${this.lang.panels.crow.pages["0"].embeds["0"].fields["0"].name} «`,
                value: "\u200b\ncrow",
                inline: true,
            },
        ];
        const weaponsFields = [
            {
                name: `» ${this.lang.panels.weapons.pages["0"].embeds["0"].fields["0"].name} «`,
                value: "\u200b\nweapons",
                inline: true,
            },
        ];

        const pages = {
            "player_panel": new Nav.Panel()
                .setPages([
                    new Nav.Page()
                        .setEmbeds([
                            new EmbedBuilder()
                                .setTitle(this.lang.panels.player.pages["0"].embeds["0"].title)
                                .setFields(playerFields),
                        ]),
                ]),
            "inventory_panel": new Nav.Panel()
                .setPages([
                    new Nav.Page()
                        .setEmbeds([
                            new EmbedBuilder()
                                .setTitle(this.lang.panels.inventory.pages["0"].embeds["0"].title)
                                .setFields(inventoryFields),
                        ]),
                ]),
            "activity_panel": new Nav.Panel()
                .setPages([
                    new Nav.Page()
                        .setEmbeds([
                            new EmbedBuilder()
                                .setTitle(this.lang.panels.activity.pages["0"].embeds["0"].title)
                                .setFields(activityFields),
                        ]),
                ]),
            "crow_panel": new Nav.Panel()
                .setPages([
                    new Nav.Page()
                        .setEmbeds([
                            new EmbedBuilder()
                                .setTitle(this.lang.panels.crow.pages["0"].embeds["0"].title)
                                .setFields(crowFields),
                        ]),
                ]),
            "weapons_panel": new Nav.Panel()
                .setPages([
                    new Nav.Page()
                        .setEmbeds([
                            new EmbedBuilder()
                                .setTitle(this.lang.panels.weapons.pages["0"].embeds["0"].title)
                                .setFields(weaponsFields),
                        ]),
                ]),
        };

        const universalRows = [
            new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder()
                        .setCustomId("player_panel")
                        // .setLabel(this.lang.rows.universal.player_panel)
                        .setEmoji(this.consts.emojis.rpg.symbols.player)
                        .setStyle("Secondary"),
                    new ButtonBuilder()
                        .setCustomId("inventory_panel")
                        // .setLabel(this.lang.rows.universal.inventory_panel)
                        .setEmoji(this.consts.emojis.rpg.symbols.inventory)
                        .setStyle("Secondary"),
                    new ButtonBuilder()
                        .setCustomId("activity_panel")
                        // .setLabel(this.lang.rows.universal.activity_panel)
                        .setEmoji(this.consts.emojis.rpg.symbols.activity)
                        .setStyle("Secondary"),
                    new ButtonBuilder()
                        .setCustomId("crow_panel")
                        // .setLabel(this.lang.rows.universal.crow_panel)
                        .setEmoji(this.consts.emojis.rpg.symbols.crow)
                        .setStyle("Secondary"),
                    new ButtonBuilder()
                        .setCustomId("weapons_panel")
                        // .setLabel(this.lang.rows.universal.weapons_panel)
                        .setEmoji(this.consts.emojis.rpg.symbols.weapons)
                        .setStyle("Secondary"),
                ),
            new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder()
                        .setCustomId("leave_panel")
                        .setLabel(this.lang.rows.universal.leave_panel)
                        .setStyle("Danger"),
                ),
        ];

        const panel = await this.interaction.reply({
            embeds: pages.player_panel.pages["0"].embeds,
            components: pages.player_panel.components.concat(universalRows),
        }).catch(this.client.util.catchError);
        if (panel === undefined) return;
        const navigation = panel.createMessageComponentCollector({
            filter: inter => inter.user.id === this.interaction.user.id,
            time: 600_000,
            dispose: true,
        });

        let currentPanel = "player_panel";

        navigation.on("collect", async inter => {
            if (inter.isButton()) {
                if (inter.customId.endsWith("_panel") && inter.customId !== "leave_panel") {
                    await inter.deferUpdate()
                        .catch(this.client.util.catchError);

                    currentPanel = inter.customId;
                    const newComponents = [...pages[currentPanel].pages[0].components];
                    for (const pageRow of pages[currentPanel].components) newComponents.push(pageRow);
                    for (const universalRow of universalRows) newComponents.push(universalRow);

                    panel.interaction.editReply({
                        embeds: pages[currentPanel].pages[0].embeds,
                        components: newComponents,
                    }).catch(this.client.util.catchError);
                }
                else if (inter.customId === "leave_panel") {
                    await inter.deferUpdate()
                        .catch(this.client.util.catchError);
                    navigation.stop();
                }
            }
        });

        navigation.on("end", async () => {
            panel.interaction.editReply({ embeds: panel.embeds, components: [] })
                .catch(this.client.util.catchError);
        });
    }
}

module.exports = Base;