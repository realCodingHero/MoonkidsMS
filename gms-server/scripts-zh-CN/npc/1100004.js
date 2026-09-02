/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100004 Kiru (To Orbis)

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/
var menu = new Array("天空之城");
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
            cm.sendNext("好的。如果你改变主意了，随时来找我。");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            var display = "";
            for (var i = 0; i < menu.length; i++) {
                display += "\r\n#L" + i + "#b 天空之城 (1000 金币)#k";
            }
            cm.sendNext("嗯……现在的风向正好。你是想离开圣地前往其他地方吗？这艘渡船开往神秘岛的天空之城。你在圣地的事情都办完了吗？如果你要去#b天空之城#k，只需支付 #b1,000 金币#k 就可以登船。你想现在出发吗？\r\n");

        } else if (status == 1) {
            if (cm.getMeso() < 1000) {
                cm.sendNext("嗯……你确定身上有 #b1,000 金币#k 吗？请检查一下你的背包。船费不足的话，我是不能让你登船的哦……");
                cm.dispose();
            } else {
                cm.gainMeso(-1000);
                cm.warp(200090021);
                cm.dispose();
            }
        }
    }
}