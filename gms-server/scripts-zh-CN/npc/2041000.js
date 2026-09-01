function start() {
    if (cm.haveItem(4031045)) {
        var em = cm.getEventManager("Trains");
        if (em.getProperty("entry") == "true") {
            cm.sendYesNo("开往天空之城的积木火车已经准备就绪，现在可以上车了。你想要乘坐这趟火车吗？");
        } else {
            cm.sendOk("开往天空之城的积木火车已经启程，请耐心等待下一班。");
            cm.dispose();
        }
    } else {
        cm.sendOk("你必须持有前往#b天空之城的车票#k才能乘坐这列火车。请先前往售票处购买，并确认背包中是否有车票。");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode <= 0) {
        cm.sendOk("好的，如果你改变了主意，随时可以再来找我。");
        cm.dispose();
        return;
    }

    var em = cm.getEventManager("Trains");
    if (em.getProperty("entry") == "true") {
        cm.warp(220000111);
        cm.gainItem(4031045, -1);
        cm.dispose();
    } else {
        cm.sendOk("开往天空之城的积木火车已经启程，请耐心等待下一班。");
        cm.dispose();
    }
}
