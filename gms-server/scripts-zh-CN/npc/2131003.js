var status = -1;
var exchangeItem = 4000437;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendSimple("伤员这么多，药品却这么少……#b\r\n#L0#嘿，拿着这些黑色孢子，你可以用它们制作更好的药剂。#l#k");
    } else if (status == 1) {
        if (!cm.haveItem(exchangeItem, 100)) {
            cm.sendNext("你的数量不够……我至少需要100个。");
            cm.dispose();
        } else {
            cm.sendGetNumber("嘿，这个主意真棒！每给我100个 #i" + exchangeItem + "##t" + exchangeItem + "#，我就可以给你1个 #i4310000# #b#t4310000##k。你想要兑换多少个？（当前持有数量：" + cm.itemQuantity(exchangeItem) + "）", Math.min(300, cm.itemQuantity(exchangeItem) / 100), 1, Math.min(300, cm.itemQuantity(exchangeItem) / 100));
        }
    } else if (status == 2) {
        if (selection >= 1 && selection <= cm.itemQuantity(exchangeItem) / 100) {
            if (!cm.canHold(4310000, selection)) {
                cm.sendOk("请在其它栏腾出足够的背包空间。");
            } else {
                cm.gainItem(4310000, selection);
                cm.gainItem(exchangeItem, -(selection * 100));
                cm.sendOk("非常感谢！拿去吧。");
            }
        }
        cm.dispose();
    }
}
