function start() {
    if (cm.haveItem(4031074)) {
        var em = cm.getEventManager("Trains");
        if (em.getProperty("entry") == "true") {
            cm.sendYesNo("开往玩具城的积木火车已经准备就绪，现在可以上车了。你想要乘坐这趟火车吗？");
        } else {
            cm.sendOk("开往玩具城的积木火车已经开出，请耐心等待下一班。");
            cm.dispose();
        }
    } else {
        cm.sendOk("你必须持有前往#b玩具城的车票#k才能乘坐这趟火车。请先前往售票处购买，并确认背包中是否有车票。");
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
        cm.warp(200000122);
        cm.gainItem(4031074, -1);
        cm.dispose();
    } else {
        cm.sendOk("开往玩具城的积木火车已经开出，请耐心等待下一班。");
        cm.dispose();
    }
}
