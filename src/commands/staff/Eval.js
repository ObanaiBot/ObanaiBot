const Command = require("../../base/Command");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
} = require("discord.js");
const Nav = require("../../base/Navigation");

class Base extends Command {
    constructor() {
        super({
            name: "eval",
            description: "Commande permettant d'effectuer du code JavaScript ES6 Asynchrone.",
            descriptionLocalizations: {
                "en-US": "Command allowing to perform JavaScript ES6 Asynchronous code.",
            },
            options: [],
            type: [1],
            dmPermission: true,
            category: "Staff",
            cooldown: 3,
            finishRequest: ["eval"],
            authorizationBitField: 0b100,
            permissions: 0n,
        });
    }

    async run() {
        const modal = new ModalBuilder()
            .setTitle(this.lang.rows.title)
            .setCustomId("modal_code_execute")
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setLabel(this.lang.rows.label)
                        .setCustomId("code_input")
                        .setPlaceholder(this.lang.rows.placeholder)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph),
                ),
            );

        await this.interaction.showModal(modal).catch(this.client.util.catchError);
        const modalSubmit = await this.interaction.awaitModalSubmit({
            filter: modalSubmitted => modalSubmitted.user.id === this.interaction.user.id,
            time: 300_000,
        }).catch(this.client.util.catchError);

        if (modalSubmit !== undefined) {
            const codeInput = modalSubmit.fields.getTextInputValue("code_input") ?? "";

            const resp = await this.client.util.evalCode(codeInput, this);
            modalSubmit.reply({
                content: resp,
                ephemeral: false,
            }).catch(this.client.util.catchError);
        }
    }
}

module.exports = Base;