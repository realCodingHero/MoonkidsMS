/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100007 Kiriru (Victoria Island Station to Ereve)

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
            cm.sendNext("如果你暂时不想出发，那就算了……");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            var display = "";
            for (var i = 0; i < menu.length; i++) {
                display += "\r\n#L" + i + "#b 圣地 (1000 金币)#k";
            }
            cm.sendNext("你好！你是想离开金银岛前往其他地区吗？你可以乘坐这艘渡船前往#b圣地#k。在那里，你能沐浴在明媚的阳光下，感受轻柔的微风，那里正是神兽与西格诺斯女皇居住的圣地。你想前往圣地吗？航程大约需要 #b2分钟#k，费用是 #b1,000 金币#k。\r\n");

        } else if (status == 1) {
            if (cm.getMeso() < 1000) {
                cm.sendNext("嗯……你确定身上有 #b1,000 金币#k 吗？请检查一下你的背包。船费不足的话，我是不能让你登船的哦……");
                cm.dispose();
            } else {
                cm.gainMeso(-1000);
                cm.warp(200090030);
                cm.dispose();
            }
        }
    }
}