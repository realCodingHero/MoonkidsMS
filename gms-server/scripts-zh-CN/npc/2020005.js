/*
    阿尔卡斯特 - 冰峰雪域市集 (211000100)
    古代贤者道具商店 (CMS标准地道化重构)
*/

var selected;
var amount;
var totalcost;
var item = [2050003, 2050004, 4006000, 4006001];
var cost = [300, 400, 5000, 5000];
var msg = [
    "能解除封印与诅咒状态的圣药",
    "能解除所有异常状态的神奇万能药",
    "蕴含强大魔力、用于施展高阶魔法技能的魔力之石",
    "蕴含神秘召唤之力、用于施展高阶召唤技能的召唤之石"
];
var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (!cm.isQuestCompleted(3035)) {
        cm.sendNext("如果你愿意帮我完成封印黑暗水晶的任务，作为回报，我将把我珍藏的古代秘药与魔法之石出售给你。");
        cm.dispose();
        return;
    }
    if (mode == 0 && status == 2) {
        cm.sendNext("我明白了。我这里有许多外界罕见的特殊物品，请随意挑选。我只会以公道的价格出售给你，绝无虚假。");
        cm.dispose();
        return;
    }
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;
    if (status == 0) {
        var selStr = "";
        for (var i = 0; i < item.length; i++) {
            selStr += "\r\n#L" + i + "# #b#t" + item[i] + "# (单价: " + cost[i] + " 冒险币)#k#l";
        }
        cm.sendSimple("多亏了你的鼎力相助，#b#t4031056##k 已经成功被彻底封印了。虽然耗费了我近八百年积累的半数元气……但如今我终于能够安心了。对了，你是不是在寻找稀有的魔法材料？为了感谢你的功绩，我将向你提供我的珍藏秘药与魔法之石。挑选你需要的物品吧！" + selStr);
    } else if (status == 1) {
        selected = selection;
        cm.sendGetNumber("你需要的确实是 #b#t" + item[selected] + "##k 吗？这可是" + msg[selected] + "。虽然平时在外界极难寻觅，但我会以特惠价格提供给你，每个仅需 #b" + cost[selected] + " 冒险币#k。你想购买多少个？", 0, 1, 100);
    } else if (status == 2) {
        amount = selection;
        totalcost = cost[selected] * amount;
        if (amount <= 0) {
            cm.sendOk("既然你不打算购买，那我们下次再见吧。");
            cm.dispose();
            return;
        }
        cm.sendYesNo("你确定要购买 #r" + amount + " 个 #t" + item[selected] + "##k 吗？\r\n每个 #t" + item[selected] + "# 单价为 " + cost[selected] + " 冒险币，总计需要支付 #r" + totalcost + " 冒险币#k。");
    } else if (status == 3) {
        if (cm.getMeso() < totalcost || !cm.canHold(item[selected], amount)) {
            cm.sendNext("你的冒险币不足，或者背包空间已满。请检查你的【消耗】或【其它】栏是否有足够空位，并确认是否拥有至少 #r" + totalcost + "#k 冒险币。");
            cm.dispose();
            return;
        }
        cm.sendNext("多谢惠顾。今后若是还需要古代秘药或魔法之石，随时来这里找我。老朽虽然年迈，但炼制这些魔法道具依然手到擒来。");
        cm.gainMeso(-totalcost);
        cm.gainItem(item[selected], amount);
        cm.dispose();
    }
}
