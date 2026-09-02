/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100008 Kiru (Orbis Station)

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/

var menu = new Array("圣地");
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
                display += "\r\n#L" + i + "#b 圣地 (1000 金币)#k";
            }
            cm.sendNext("这艘船将驶向浮空岛屿#b圣地#k。在那里，你能沐浴在明媚的阳光下，感受轻柔的微风，觐见尊贵的西格诺斯女皇。如果你有兴趣加入圣地骑士团，这里绝对是不容错过的地方。你想前往圣地吗？船费为 #b1,000 金币#k。\r\n");

        } else if (status == 1) {
            if (cm.getMeso() < 1000) {
                cm.sendNext("嗯……你确定身上有 #b1,000 金币#k 吗？请检查一下你的背包。船费不足的话，我是不能让你登船的哦……");
                cm.dispose();
            } else {
                cm.gainMeso(-1000);
                cm.warp(200090020);
                cm.dispose();
            }
        }
    }
}