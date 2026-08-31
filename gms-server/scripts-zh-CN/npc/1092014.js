var status = 0;
var maps = [104000000, 102000000, 100000000, 101000000, 103000000];
var cost = [1000, 1000, 1000, 800, 1000];
var selectedMap = -1;

function start() {
    cm.sendNext("你好！我是诺特勒斯中型出租车司机。如果你想快速安全地前往其他城镇，请乘坐我们的出租车吧！我们将以实惠的价格将你送达目的地。");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 1 && mode == 0) {
            cm.dispose();
            return;
        } else if (status >= 2 && mode == 0) {
            cm.sendNext("诺特勒斯还有很多值得探索的地方呢。如果你需要前往其他城镇，随时来找我吧！");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            var selStr = "";
            if (cm.getJobId() == 0) {
                selStr += "我们对新手玩家提供90%的特别折扣优惠。";
            }
            selStr += "请选择你想前往的目的地。根据路程远近，费用会有所不同。#b";
            for (var i = 0; i < maps.length; i++) {
                selStr += "\r\n#L" + i + "##m" + maps[i] + "# (" + (cm.getJobId() == 0 ? cost[i] / 10 : cost[i]) + " 金币)#l";
            }
            cm.sendSimple(selStr);
        } else if (status == 2) {
            cm.sendYesNo("你确定要前往 #b#m" + maps[selection] + "##k 吗？本次车费为 #b" + (cm.getJobId() == 0 ? cost[selection] / 10 : cost[selection]) + " 金币#k。");
            selectedMap = selection;
        } else if (status == 3) {
            if (cm.getJobId() == 0) {
                mesos = cost[selectedMap] / 10;
            } else {
                mesos = cost[selectedMap];
            }

            if (cm.getMeso() < mesos) {
                cm.sendNext("看起来你的金币不够呢。很抱歉，金币不足无法乘坐出租车。");
                cm.dispose();
                return;
            }

            cm.gainMeso(-mesos);
            cm.warp(maps[selectedMap], 0);
            cm.dispose();
        }
    }
}