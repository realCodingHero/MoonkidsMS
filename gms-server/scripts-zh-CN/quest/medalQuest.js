/**
 * 通用勋章任务脚本 (Generic Medal Quest Script)
 * 处理未编写独立专有脚本的勋章任务的自动接取与完成发奖
 */

function start(mode, type, selection) {
    if (qm.isQuestCompleted(qm.getQuest())) {
        qm.dispose();
        return;
    }

    qm.forceStartQuest();
    var medalname = qm.getMedalName();
    if (medalname != null && medalname.length > 0) {
        qm.showInfoText("已接取 <" + medalname + "> 勋章挑战。");
    }
    qm.dispose();
}

function end(mode, type, selection) {
    var medalId = qm.getMedalRequirement();
    var medalname = qm.getMedalName();

    if (medalId > 0 && !qm.haveItem(medalId)) {
        if (!qm.canHold(medalId)) {
            qm.sendOk("请在装备栏空出至少 1 个格子以领取勋章。");
            qm.dispose();
            return;
        }
        qm.gainItem(medalId, 1);
    }

    qm.forceCompleteQuest();
    if (medalname != null && medalname.length > 0) {
        qm.earnTitle("<" + medalname + "> 勋章已获得！");
        qm.showInfoText("恭喜获得 <" + medalname + "> 勋章！");
    }
    qm.dispose();
}
