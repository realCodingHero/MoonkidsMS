function start() {
    if (cm.haveItem(4031576)) {
        var em = cm.getEventManager("Genie");
        if (em.getProperty("entry") == "true") {
            cm.sendYesNo("前往沙漠阿里安特需要飞行一段较长的距离。你现在想要乘坐魔灯出发吗？");
        } else {
            cm.sendOk("神灯精灵正在准备启程，很抱歉你必须等待下一班。发车时间表可以向售票处咨询。");
            cm.dispose();
        }
    } else {
        cm.sendOk("你必须持有前往#b阿里安特的神灯船票#k才能乘坐魔灯旅行。请确认背包中是否有船票。");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode <= 0) {
        cm.sendOk("好的，如果你改变了主意，随时可以再来找我。");
        cm.dispose();
        return;
    }

    var em = cm.getEventManager("Genie");
    if (em.getProperty("entry") == "true") {
        cm.warp(200000152);
        cm.gainItem(4031576, -1);
    } else {
        cm.sendOk("神灯精灵正在准备启程，很抱歉你必须等待下一班。发车时间表可以向售票处咨询。");
    }

    cm.dispose();
}
