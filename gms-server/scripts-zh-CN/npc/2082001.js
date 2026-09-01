function start() {
    if (cm.haveItem(4031045)) {
        var em = cm.getEventManager("Cabin");
        if (em.getProperty("entry") == "true") {
            cm.sendYesNo("开往天空之城的飞船已经进站，现在可以登船了。你想要登上这班飞船吗？");
        } else {
            cm.sendOk("开往天空之城的飞船还没有进站。请稍后再来确认。");
            cm.dispose();
        }
    } else {
        cm.sendOk("你必须持有前往#b天空之城的船票#k才能登船。请先前往售票处购买，并确认背包中是否有船票。");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode <= 0) {
        cm.sendOk("好的，如果你改变了主意，随时可以再来找我。");
        cm.dispose();
        return;
    }
    var em = cm.getEventManager("Cabin");
    if (em.getProperty("entry") == "true") {
        cm.warp(240000111);
        cm.gainItem(4031045, -1);
    } else {
        cm.sendOk("开往天空之城的飞船还没有进站。请稍后再来确认。");
    }
    cm.dispose();
}
