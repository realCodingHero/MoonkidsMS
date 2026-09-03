var arena;
var status = 0;

function start() {
    arena = cm.getPlayer().getAriantColiseum();
    if (arena == null) {
        cm.sendOk("嘿，刚才在竞技场里我怎么没看到你？你在这里做什么？");
        cm.dispose();
        return;
    }

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
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            menuStr = generateSelectionMenu([
                "我想查看点数或兑换#t3010018#", 
                "我想了解竞技场点数的相关规则"
            ]);
            cm.sendSimple("你好，我能为你做些什么？\r\n" + menuStr);
        } else if (status == 1) {
            if (selection == 0) {
                apqpoints = cm.getPlayer().getAriantPoints();
                if (apqpoints >= 100) {
                    cm.sendNext("哇，看来你已经积攒了 #b100#k 点竞技场点数，我们马上来兑换吧！");
                } else if (apqpoints + arena.getAriantRewardTier(cm.getPlayer()) >= 100) {
                    cm.sendOk("你当前的竞技场点数：#b" + apqpoints + "#k 点，你马上就能达到了！先去找我妻子 #p2101016# 结算本局点数，然后再来找我吧！");
                    cm.dispose();
                } else {
                    cm.sendOk("你当前的竞技场点数：#b" + apqpoints + "#k 点。你需要累积达到 #b100点#k，我才能把 #b#t3010018##k 奖励给你。等你攒够点数后再来找我吧。");
                    cm.dispose();
                }
            } else if (selection == 1) {
                cm.sendOk("竞技场的主要目标是让大家在比赛中积累竞技场点数，用来兑换终极大奖：#b#t3010018##k。只要在竞技场中累积足够的点数，就可以找我兑换奖励。\r\n在每场比赛中，玩家会根据最终持有的宝石数量获得对应点数。不过要注意！如果你与其他玩家的宝石差距#r过大#k，所有的努力都会白费，你最终只能得到可怜的 #r1点#k 积分。");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.getPlayer().gainAriantPoints(-100);
            cm.gainItem(3010018, 1);
            cm.dispose();
        }
    }
}

function generateSelectionMenu(array) {     // nice tool for generating a string for the sendSimple functionality
    var menu = "";
    for (var i = 0; i < array.length; i++) {
        menu += "#L" + i + "##b" + array[i] + "#l#k\r\n";
    }
    return menu;
}
