/*
    NPC: 海豚出租车 (Dolphin Taxi)
    ID: 2060009
    地图: 水下世界 (230000000) / 百草村码头 (251000100)
    功能: 海路传送 / 任务 3845 (雾海中的传闻) 交互
*/

var status = 0;
var menu = "";
var payment = false;
var atHerbTown = false;
var locationCloseToOrbis = [13, 18];
var isQuest3845 = false;

function start() {
    status = 0;
    atHerbTown = (cm.getPlayer().getMap().getId() == 251000100);
    isQuest3845 = cm.isQuestActive(3845);

    menu = "";
    if (isQuest3845) {
        menu += "#L3##b#e【任务】打听关于雾海与幽灵船的传闻#n#k#l\r\n";
    }

    if (cm.haveItem(4031242)) {
        if (atHerbTown) {
            menu += "#L0##b我想用 #t4031242##k 移动到 #b#m230030200##k。#l\r\n#L1#去 #b#m230000000##k 需支付 #b10000金币#k。#l";
        } else {
            menu += "#L0##b我想用 #t4031242##k 移动到 #b#m230030200##k。#l\r\n#L1#去 #b#m251000000##k 需支付 #b10000金币#k。#l\r\n#L2#前往 #b#m230010000##k 需支付 #b1000金币#k。#l";
        }
    } else {
        if (atHerbTown) {
            menu += "#L0#前往 #b#m230030200##k 需支付 #b1000金币#k。#l\r\n#L1#前往 #b#m230000000##k 需支付 #b10000金币#k。#l";
        } else {
            menu += "#L0#前往 #b#m230030200##k 需支付 #b1000金币#k。#l\r\n#L1#前往 #b#m251000000##k 需支付 #b10000金币#k。#l\r\n#L2#前往 #b#m230010000##k 需支付 #b1000金币#k。#l";
        }
        payment = true;
    }

    cm.sendSimple("海洋之间都是相互连接的。无法步行到达的地方可以很容易地通过海路到达。今天和我们一起乘坐 #b海豚出租车#k，怎么样？\r\n" + menu);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }

    if (status == 0) {
        if (selection == 3) {
            // Quest 3845 Dialog
            status = 10;
            cm.sendNext("（海豚眨了眨聪明的眼睛，欢快地向你喷出了一道水花，似乎完全听懂了你的询问……）\r\n\r\n你是受百草村黄船长的委托，特地来向我打听关于#b雾海#k与#b幽灵船#k的传闻对吧？");
            return;
        } else if (selection == 0) {
            if (payment) {
                if (cm.getPlayer().getMeso() < 1000) {
                    cm.sendOk("你的金币好像不够 1000 金币……");
                    cm.dispose();
                    return;
                } else {
                    cm.gainMeso(-1000);
                }
            } else {
                cm.gainItem(4031242, -1);
            }
            cm.warp(230030200, 2);
            cm.dispose();
            return;
        } else if (selection == 1) {
            if (cm.getPlayer().getMeso() < 10000) {
                cm.sendOk("你的金币好像不够 10000 金币……");
                cm.dispose();
                return;
            } else {
                cm.gainMeso(-10000);
                cm.warp(atHerbTown ? 230000000 : 251000100);
                cm.dispose();
                return;
            }
        } else if (selection == 2) {
            if (cm.getPlayer().getMeso() < 1000) {
                cm.sendOk("你的金币好像不够 1000 金币……");
                cm.dispose();
                return;
            } else {
                cm.gainMeso(-1000);
                cm.warp(230010000, locationCloseToOrbis[Math.floor(Math.random() * locationCloseToOrbis.length)]);
                cm.dispose();
                return;
            }
        }
    } else if (status == 10) {
        status = 11;
        cm.sendNextPrev("我们在往返于百草村与水下世界的深海航线巡游时，确实经常在武陵桃园东侧的海域感受到一阵阵异样的阴森寒气。那里常年被伸手不见五指的大浓雾笼罩，有时甚至能隐约听到古老军舰破浪前进的号角声！\r\n\r\n那艘迷失的幽灵军舰确实就搁浅在雾海深处的一座无名孤岛附近。虽然目前通往雾海核心的暗流极其凶险，但我已经为你探明并记录下了雾海的关键情报！");
    } else if (status == 11) {
        if (cm.isQuestActive(3845)) {
            cm.forceCompleteQuest(3845);
            cm.gainExp(50000);
        }
        cm.sendOk("你从海豚出租车这里成功探听到了关于雾海与幽灵船的关键线索，完成了黄船长的委托！\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#b经验值：50,000 EXP#k");
        cm.dispose();
    }
}
