const SlayerQuest = require("../../bases/SlayerQuest");
const VoyageTo = require("../../bases/objectives/VoyageTo");
const Talk = require("../../bases/superobjectives/Talk");

module.exports = step => {
    const q = [
        new SlayerQuest(
            "Partie de cache-cache",
            "Allez vous cacher dans la ruelle secondaire, là où les deux pourfendeurs ne vous trouveront pas !",
            new VoyageTo(9, 3),
            "chapter1/quest3:0",
            1,
            3,
            0,
        ),
        new SlayerQuest(
            "Où suis-je ?",
            "Qui a déplacé le tonneau dans lequel vous étiez caché ?? "
            +
            "Parlez à Franky, il a l'air d'avoir quelque chose d'important à vous dire !",
            new Talk(pnj6.name, pnj6.id, texts["1"].join("\n\n"), 9, 1),
            "chapter1/quest3:1",
            1,
            3,
            1,
        ),
        new SlayerQuest(
            "Retour à la réalité",
            "Pendant ce temps, les pourfendeurs vous cherchent toujours dans les rues du quartier Yoshiwara... "
            +
            "Continuez de vous enfuir !",
            new VoyageTo(9, 3),
            "chapter1/quest3:2",
            1,
            3,
            2,
        ),
    ];

    if (step === "SIZE") return q.length;

    return step < q.length ? q[Number(step)] : true;
};