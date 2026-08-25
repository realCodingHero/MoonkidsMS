/**
 * Generic Medal Quest Script
 */

function start(mode, type, selection) {
    if (qm.isQuestCompleted(qm.getQuest())) {
        qm.dispose();
        return;
    }

    qm.forceStartQuest();
    var medalname = qm.getMedalName();
    if (medalname != null && medalname.length > 0) {
        qm.showInfoText("Accepted medal quest <" + medalname + ">.");
    }
    qm.dispose();
}

function end(mode, type, selection) {
    var medalId = qm.getMedalRequirement();
    var medalname = qm.getMedalName();

    if (medalId > 0 && !qm.haveItem(medalId)) {
        if (!qm.canHold(medalId)) {
            qm.sendOk("Please make space in your equip inventory to receive the medal.");
            qm.dispose();
            return;
        }
        qm.gainItem(medalId, 1);
    }

    qm.forceCompleteQuest();
    if (medalname != null && medalname.length > 0) {
        qm.earnTitle("<" + medalname + "> medal acquired!");
        qm.showInfoText("Congratulations on obtaining <" + medalname + "> medal!");
    }
    qm.dispose();
}