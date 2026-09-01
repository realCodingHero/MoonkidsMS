var cost = 150;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.sendNext("看来你在这里还有未完成的事情。准备好了随时来找我。");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            cm.sendYesNo("乘上这艘船，你就可以离开枫叶岛前往广阔的#b金银岛明珠港#k。不过前往金银岛需要支付 #b" + cost + " 金币#k 的船费。你想现在登船出发吗？");
        } else if (status == 1) {
            if (cm.getMeso() < cost) {
                cm.sendOk("什么？你身上连 " + cost + " 金币都没有？这可不能上船啊！");
                cm.dispose();
                return;
            }
            cm.gainMeso(-cost);
            cm.warp(104000000, 0);
            cm.dispose();
        }
    }
}
