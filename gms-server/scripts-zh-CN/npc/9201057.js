function start() {
    if (cm.c.getPlayer().getMapId() == 103000100 || cm.c.getPlayer().getMapId() == 600010001) {
        cm.sendYesNo("开往 " + (cm.c.getPlayer().getMapId() == 103000100 ? "新叶城" : "废弃都市") + " 的地铁每分钟一班，单程票价为 #b5,000 金币#k。你确定要购买一张 #b#t" + (4031711 + parseInt(cm.c.getPlayer().getMapId() / 300000000)) + "#k 吗？");
    } else if (cm.c.getPlayer().getMapId() == 600010002 || cm.c.getPlayer().getMapId() == 600010004) {
        cm.sendYesNo("列车即将发车，你确定要在发车前离开吗？注意：离开后车票将不予退还。");
    }
}

function action(mode, type, selection) {
    if (mode != 1) {
        cm.dispose();
        return;
    }
    if (cm.c.getPlayer().getMapId() == 103000100 || cm.c.getPlayer().getMapId() == 600010001) {
        var item = 4031711 + parseInt(cm.c.getPlayer().getMapId() / 300000000);

        if (!cm.canHold(item)) {
            cm.sendNext("请确保你的其它栏至少有 1 个空位。");
        } else if (cm.getMeso() >= 5000) {
            cm.gainMeso(-5000);
            cm.gainItem(item, 1);
            cm.sendNext("购票成功！请收好您的车票。");
        } else {
            cm.sendNext("你的金币不足，购买车票需要 5,000 金币。");
        }
    } else {
        cm.warp(cm.c.getPlayer().getMapId() == 600010002 ? 600010001 : 103000100);
    }
    cm.dispose();
}