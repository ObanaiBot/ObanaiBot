const RPGAssetBase = require("./RPGAssetBase");
const RPGBreathingStyleTechnique = require("./RPGBreathingStyleTechnique");

class RPGBreathingStyle extends RPGAssetBase {
    constructor(lang, id) {
        super(lang, id);

        const data = this.lang.json[this.id];
        this.name = data.name;
        this.techniques = Object.entries(data.techniques).map(e => new RPGBreathingStyleTechnique(this, e[0], e[1]));
    }
}

module.exports = RPGBreathingStyle;