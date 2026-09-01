function start() {
    if (cm.haveItem(4031047)) {
        var em = cm.getEventManager("Boats");
        if (em.getProperty("entry") == "true") {
            cm.sendYesNo("开往魔法密林的飞船已经进站，现在可以登船了。你想要登上这班飞船吗？");
        } else {
            cm.sendOk("开往魔法密林的飞船已经启程，请耐心等待下一班。");
            cm.dispose();
        }
    } else {
        cm.sendOk("你必须持有前往#b魔法密林的船票#k才能乘坐这艘飞船。请先前往售票处购买，并确认背包中是否有船票。");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode <= 0) {
        cm.sendOk("好的，如果你改变了主意，随时可以再来找我。");
        cm.dispose();
        return;
    }

    var em = cm.getEventManager("Boats");
    if (em.getProperty("entry") == "true") {
        cm.warp(200000112);
        cm.gainItem(4031047, -1);
        cm.dispose();
    } else {
        cm.sendOk("开往魔法密林的飞船已经启程，请耐心等待下一班。");
        cm.dispose();
    }
}
