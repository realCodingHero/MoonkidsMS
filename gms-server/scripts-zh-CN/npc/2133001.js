/**
 * @author: Ronan
 * @npc: Ellin
 * @map: Ellin PQ
 * @func: Ellin PQ Coordinator
 */

var status = 0;
var mapid;

function start() {
    mapid = cm.getPlayer().getMapId();

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
            var ellinStr = ellinMapMessage(mapid);

            if (mapid == 930000000) {
                cm.sendNext(ellinStr);
            } else if (mapid == 930000300) {
                var eim = cm.getEventInstance();

                if (eim.getIntProperty("statusStg4") == 0) {
                    eim.showClearEffect(cm.getMap().getId());
                    eim.setIntProperty("statusStg4", 1);
                }

                cm.sendNext(ellinStr);
            } else if (mapid == 930000400) {
                if (cm.haveItem(4001169, 20)) {
                    if (cm.isEventLeader()) {
                        cm.sendNext("太好了，你把它们带来了！我们现在可以进入下一阶段了，准备好出发了吗？");
                    } else {
                        cm.sendOk("你已经收集到了珠子，但你不是队长！请让队长把净化之珠交给我……");
                        cm.dispose();

                    }
                } else {
                    if (cm.getEventInstance().gridCheck(cm.getPlayer()) != 1) {
                        cm.sendNext(ellinStr);

                        cm.getEventInstance().gridInsert(cm.getPlayer(), 1);
                        status = -1;
                    } else {
                        var mobs = cm.getMap().countMonsters();

                        if (mobs > 0) {
                            if (!cm.haveItem(2270004)) {
                                if (cm.canHold(2270004, 10)) {
                                    cm.gainItem(2270004, 10);
                                    cm.sendOk("给你10个#b#t2270004##k。首先，#r削弱#o9300174#的体力#k，等它的生命值降低后，使用我给你的净化之珠来净化并捕捉它们。");
                                    cm.dispose();

                                } else {
                                    cm.sendOk("在领取净化之珠前，请确保你的消耗栏有足够的空位！");
                                    cm.dispose();

                                }
                            } else {
                                cm.sendYesNo(ellinStr + "\r\n\r\n你确定要#r放弃并离开#k吗？请三思，也许你的队友们还在努力挑战呢。");
                            }
                        } else {
                            cm.sendYesNo("你们已经净化了所有的 #o9300174#。请让队长把收集到的 #b20个 #t4001169##k 交给我，然后我们就可以前往下一阶段了。\r\n\r\n或者你想#r放弃并离开#k吗？请三思，也许你的队友们还在努力挑战呢。");
                        }
                    }
                }
            } else {
                cm.sendYesNo(ellinStr + "\r\n\r\n你确定要#r放弃并离开#k吗？请三思，也许你的队友们还在努力挑战呢。");
            }
        } else if (status == 1) {
            if (mapid == 930000000) {
            } else if (mapid == 930000300) {
                cm.getEventInstance().warpEventTeam(930000400);
            } else if (mapid == 930000400) {
                if (cm.haveItem(4001169, 20) && cm.isEventLeader()) {
                    cm.gainItem(4001169, -20);
                    cm.getEventInstance().warpEventTeam(930000500);
                } else {
                    cm.warp(930000800, 0);
                }
            } else {
                cm.warp(930000800, 0);
            }

            cm.dispose();
        }
    }
}

function ellinMapMessage(mapid) {
    switch (mapid) {
        case 930000000:
            return "欢迎来到毒雾森林。请穿过前方的传送口继续前进。";

        case 930000100:
            return "这片区域被#b#o9300172##k占领了。我们必须消灭所有受污染的怪物才能继续前进。";

        case 930000200:
            return "巨大的荆棘挡住了去路。为了清除路障，我们必须从#b#o9300173##k身上获取毒液来溶解荆棘。但是天然的毒液浓度太高无法直接使用，请利用那边的#b清泉#k稀释毒液。";

        case 930000300:
            return "太好了，你们终于来到这里了！我们现在可以继续深入森林了。";

        case 930000400:
            return "#b#o9300175##k占领了这片区域。它们不是普通的怪物，再生速度极快，#r普通的武器和魔法对它们完全无效#k。我们必须使用#b#t2270004##k来净化这些受污染的怪物！请让队长收集20个净化之珠交给我。";

        case 930000600:
            return "这里就是森林一切异变的源头！将获得的魔法石放在祭坛上，准备迎接战斗吧！";

        case 930000700:
            return "终于成功了，你们做到了！非常感谢你们彻底净化了森林！！";

    }
}
