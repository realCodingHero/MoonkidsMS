/**
 ----------------------------------------------------------------------------------
 Whale Between Lith harbor and Rien.

 1200004 Puro

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/

var menu = new Array("里恩");
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
                display += "\r\n#L" + i + "#b 里恩 (800 金币)#k";
            }
            cm.sendNext("你想离开金银岛前往我们的城镇吗？只要乘坐这艘船，我就可以带你往返于#b明珠港#k与#b里恩#k之间。船费只需 #b800 金币#k。你想现在前往里恩吗？");

        } else if (status == 1) {
            if (cm.getMeso() < 800) {
                cm.sendNext("嗯……你确定身上有 #b800 金币#k 吗？请检查一下你的背包。船费不足的话，我是不能让你登船的哦……");
                cm.dispose();
            } else {
                cm.gainMeso(-800);
                cm.warp(200090060);
                cm.dispose();
            }
        }
    }
}