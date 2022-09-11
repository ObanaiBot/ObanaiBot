const Event = require("../base/Event");
const { EmbedBuilder } = require("discord.js");

class InteractionCreate extends Event {
    constructor() {
        super({
            name: "interactionCreate",
            once: false,
        });
        this.client = null;
        this.interaction = null;
    }

    async exe(client, interaction) {
        if (interaction.user.bot) return;

        this.client = client;
        this.interaction = interaction;

        if (this.interaction.isChatInputCommand()) {
            await this.executeCommand();
        }
        else if (this.interaction.isContextMenuCommand()) {
            this.interaction.commandName = this.interaction.commandName.toLowerCase();
            await this.executeCommand();
        }
    }

    async executeCommand() {
        try {
            let cmd = this.client.commandManager.getCommand(this.interaction.commandName);
            if (cmd === 0) return;

            const userLang = (await this.client.playerDb.get(this.interaction.user.id)).lang;

            cmd = new cmd();
            cmd.init(this.client, this.interaction, this.client.languageManager.getLang(userLang));

            const cooldownReady = await cmd.cooldownReady(true);
            if (!cooldownReady) return;

            const requestReady = await cmd.requestReady();
            if (!requestReady) return;

            const permissionsReady = await cmd.permissionsReady();
            if (!permissionsReady) return;

            const clientPermissionsReady = await cmd.clientPermissionsReady();
            if (!clientPermissionsReady) return;

            const commandPrivateReady = await cmd.commandPrivateReady();
            if (!commandPrivateReady) return;

            const clientStatusReady = await cmd.clientStatusReady();
            if (!clientStatusReady) return;

            if (await this.client.commandManager.isOverloaded()) {
                return this.interaction.channel.send("Le bot est actuellement surchargé, veuillez réessayer plus tard.");
            }

            this.client.lastChannels.set(this.interaction.user.id, this.interaction.channel);
            this.client.requestsManager.add(this.interaction.user.id, { key: cmd.infos.name, value: Date.now() });
            try {
                await cmd.run();
            }
            catch (err) {
                await this.client.throwError(err, "Origin: @InteractionCreate.Command");
            }
            this.client.requestsManager.remove(this.interaction.user.id, cmd.infos.name);
        }
        catch (err) {
            await this.client.throwError(err, "Origin: @Event.InteractionCreate");
        }
    }
}

module.exports = InteractionCreate;