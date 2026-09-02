/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100003 Kiriru (To Victoria Island From Ereve)

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/

var menu = new Array("金银岛");
var method;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();

    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        } else if (mode == 0) {
            cm.sendNext("如果你暂时不想出发，那就算了……");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            var display = "";
            for (var i = 0; i < menu.length; i++) {
                display += "\r\n#L" + i + "#b 金银岛 (1000 金币)#k";
            }
            cm.sendNext("你好！你想离开圣地去其他地方吗？那你找我就找对人啦！我经营着往返于#b圣地#k与#b金银岛#k之间的渡船。只需支付 #b1,000 金币#k，我就可以送你前往金银岛。你想现在出发吗？\r\n");
        } else if (status == 1) {
            if (cm.getMeso() < 1000) {
                cm.sendNext("嗯……你确定身上有 #b1,000 金币#k 吗？请检查一下你的背包。船费不足的话，我是不能让你登船的哦……");
                cm.dispose();
            } else {
                cm.gainMeso(-1000);
                cm.warp(200090031);
                cm.dispose();
            }
        }
    }
}