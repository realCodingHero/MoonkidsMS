/*
    NPC: 诺林顿 (Norrington)
    ID: 2060103
    功能: 雾海幽灵船 NPC
*/

function start() {
    if (cm.isQuestActive(3845)) {
        cm.forceCompleteQuest(3845);
        cm.gainExp(50000);
        cm.sendOk("你终于找到这里了！关于这艘迷失在雾海中的幽灵船，背后隐藏着极大的秘密……\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#b经验值：50,000 EXP#k");
    } else {
        cm.sendOk("我感到一股神秘的气流正在吹过……他们的灵魂一定还徘徊在这里。");
    }
    cm.dispose();
}
