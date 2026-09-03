/**
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Drago (MapleStorySA)
 2.0 - Second Version by Ronan (HeavenMS)
 3.0 - Third Version by Jayd - translated CPQ contents to English and added Pirate items
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var rnk = -1;
var n1 = 50; //???
var n2 = 40; //??? ???
var n3 = 7; //35
var n4 = 10; //40
var n5 = 20; //50

var cpqMap = 980000000;
var cpqMinLvl = 30;
var cpqMaxLvl = 50;
var cpqMinAmt = 2;
var cpqMaxAmt = 6;

// Ronan's custom ore refiner NPC
var refineRocks = true;     // enables moon rock, star rock
var refineCrystals = true;  // enables common crystals
var refineSpecials = true;  // enables lithium, special crystals
var feeMultiplier = 7.0;

function start() {
    status = -1;

    const GameConfig = Java.type('org.gms.config.GameConfig');
    if (!GameConfig.getServerBoolean("use_cpq")) {
        if (GameConfig.getServerBoolean("use_enable_custom_npc_script")) {
            status = 0;
            action(1, 0, 4);
        } else {
            cm.sendOk("怪物嘉年华目前不可用。");
            cm.dispose();
        }

        return;
    }

    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        const GameConfig = Java.type('org.gms.config.GameConfig');
        if (cm.getPlayer().getMapId() == 980000010) {
            if (status == 0) {
                cm.sendNext("祝你在怪物嘉年华中玩得尽兴！");
            } else if (status > 0) {
                cm.warp(980000000, 0);
                cm.dispose();
            }
        } else if (cm.getChar().getMap().isCPQLoserMap()) {
            if (status == 0) {
                if (cm.getChar().getParty() != null) {
                    var shiu = "";
                    if (cm.getPlayer().getFestivalPoints() >= 300) {
                        shiu += "#rA#k";
                        cm.sendOk("真可惜！虽然你表现出色拿到了高分，但胜败乃兵家常事。吸取教训，下次胜利一定是你们的！\r\n\r\n#b本次评价：" + shiu);
                        rnk = 10;
                    } else if (cm.getPlayer().getFestivalPoints() >= 100) {
                        shiu += "#rB#k";
                        rnk = 20;
                        cm.sendOk("太遗憾了！你们只差一点点就能拿下胜利了，战斗非常激烈！下次继续加油！\r\n\r\n#b本次评价：" + shiu);
                    } else if (cm.getPlayer().getFestivalPoints() >= 50) {
                        shiu += "#rC#k";
                        rnk = 30;
                        cm.sendOk("胜负乃兵家常事，唯有不断磨炼方能登上顶峰。只要继续努力，胜利离你们并不遥远！\r\n\r\n#b本次评价：" + shiu);
                    } else {
                        shiu += "#rD#k";
                        rnk = 40;
                        cm.sendOk("很遗憾，你们输掉了这场战斗，本次表现也稍显欠缺。希望下次你能更加积极地投入战斗！\r\n\r\n#b本次评价：" + shiu);
                    }
                } else {
                    cm.warp(980000000, 0);
                    cm.dispose();
                }
            } else if (status == 1) {
                switch (rnk) {
                    case 10:
                        cm.warp(980000000, 0);
                        cm.gainExp(17500);
                        cm.dispose();
                        break;
                    case 20:
                        cm.warp(980000000, 0);
                        cm.gainExp(1200);
                        cm.dispose();
                        break;
                    case 30:
                        cm.warp(980000000, 0);
                        cm.gainExp(5000);
                        cm.dispose();
                        break;
                    case 40:
                        cm.warp(980000000, 0);
                        cm.gainExp(2500);
                        cm.dispose();
                        break;
                    default:
                        cm.warp(980000000, 0);
                        cm.dispose();
                        break;
                }
            }
        } else if (cm.getChar().getMap().isCPQWinnerMap()) {
            if (status == 0) {
                if (cm.getChar().getParty() != null) {
                    var shi = "";
                    if (cm.getPlayer().getFestivalPoints() >= 300) {
                        shi += "#rA#k";
                        rnk = 1;
                        cm.sendOk("恭喜你们大获全胜！太精彩了，简直是一场无可挑剔的压倒性胜利！希望下次也能看到你们如此精彩的表现！\r\n\r\n#b本次评价：" + shi);
                    } else if (cm.getPlayer().getFestivalPoints() >= 100) {
                        shi += "#rB#k";
                        rnk = 2;
                        cm.sendOk("恭喜你们赢得了胜利！打得非常漂亮！再多积累一点点点数，下次一定能拿到顶级A级评价！\r\n\r\n#b本次评价：" + shi);
                    } else if (cm.getPlayer().getFestivalPoints() >= 50) {
                        shi += "#rC#k";
                        rnk = 3;
                        cm.sendOk("恭喜获得胜利！虽然赢下了比赛，但表现还有很大提升空间哦，期待你们下次更出色的发挥！\r\n\r\n#b本次评价：" + shi);
                    } else {
                        shi += "#rD#k";
                        rnk = 4;
                        cm.sendOk("恭喜获胜！不过在比赛中似乎没有全力以赴哦。下次怪物嘉年华可要更加积极地获取点数呀！\r\n\r\n#b本次评价：" + shi);
                    }
                } else {
                    cm.warp(980000000, 0);
                    cm.dispose();
                }
            } else if (status == 1) {
                switch (rnk) {
                    case 1:
                        cm.warp(980000000, 0);
                        cm.gainExp(50000);
                        cm.dispose();
                        break;
                    case 2:
                        cm.warp(980000000, 0);
                        cm.gainExp(25500);
                        cm.dispose();
                        break;
                    case 3:
                        cm.warp(980000000, 0);
                        cm.gainExp(21000);
                        cm.dispose();
                        break;
                    case 4:
                        cm.warp(980000000, 0);
                        cm.gainExp(19505);
                        cm.dispose();
                        break;
                    default:
                        cm.warp(980000000, 0);
                        cm.dispose();
                        break;
                }
            }
        } else if (cm.getMapId() == cpqMap) {   // only CPQ1
            if (status == 0) {
                if (cm.getParty() == null) {
                    status = 10;
                    cm.sendOk("在开始挑战前，你必须先创建一个队伍！");
                } else if (!cm.isLeader()) {
                    status = 10;
                    cm.sendOk("只有队伍的#b队长#k才能与我对话开启挑战。");
                } else {
                    var party = cm.getParty().getMembers();
                    var inMap = cm.partyMembersInMap();
                    var lvlOk = 0;
                    var isOutMap = 0;
                    for (var i = 0; i < party.size(); i++) {
                        if (party.get(i).getLevel() >= cpqMinLvl && party.get(i).getLevel() <= cpqMaxLvl) {
                            lvlOk++;

                            if (party.get(i).getPlayer().getMapId() != cpqMap) {
                                isOutMap++;
                            }
                        }
                    }

                    if (party.size() < 2) {
                        status = 10;
                        cm.sendOk("你的队伍人数不足。队伍至少需要 #b" + cpqMinAmt + "#k 至 #r" + cpqMaxAmt + "#k 名成员，且大家必须在同一张地图内。");
                    } else if (lvlOk != inMap) {
                        status = 10;
                        cm.sendOk("请确保队伍中的所有成员等级均在符合要求的范围内（" + cpqMinLvl + " ~ " + cpqMaxLvl + "级）！");
                    } else if (isOutMap > 0) {
                        status = 10;
                        cm.sendOk("队伍中有部分成员不在当前地图内！");
                    } else {
                        if (!cm.sendCPQMapLists()) {
                            cm.sendOk("当前所有的怪物嘉年华场地均在使用中！请稍后再试。");
                            cm.dispose();
                        }
                    }
                }
            } else if (status == 1) {
                if (cm.fieldTaken(selection)) {
                    if (cm.fieldLobbied(selection)) {
                        cm.challengeParty(selection);
                        cm.dispose();
                    } else {
                        cm.sendOk("该擂台房间目前正在对战中。");
                        cm.dispose();
                    }
                } else {
                    var party = cm.getParty().getMembers();
                    if ((selection >= 0 && selection <= 3) && party.size() < (GameConfig.getServerBoolean("use_enable_solo_expeditions") ? 1 : 2)) {
                        cm.sendOk("该擂台至少需要 2 名队员才能发起挑战！");
                    } else if ((selection >= 4 && selection <= 5) && party.size() < (GameConfig.getServerBoolean("use_enable_solo_expeditions") ? 1 : 3)) {
                        cm.sendOk("该擂台至少需要 3 名队员才能发起挑战！");
                    } else {
                        cm.cpqLobby(selection);
                    }
                    cm.dispose();
                }
            } else if (status == 11) {
                cm.dispose();
            }
        } else {
            if (status == 0) {
                var talk = "你想了解或参与什么呢？如果你第一次听说怪物嘉年华，在入场前最好先了解一下规则！\r\n#b#L0# 前往怪物嘉年华擂台 1 (Lv.30~50)#l\r\n#L3# 前往怪物嘉年华擂台 2 (Lv.51~70)#l\r\n#L1# 了解怪物嘉年华规则#l\r\n#L2# 使用枫叶币兑换装备与卷轴#l";
                if (GameConfig.getServerBoolean("use_enable_custom_npc_script")) {
                    talk += "\r\n#L4# 矿石精炼服务#l";
                }
                cm.sendSimple(talk);
            } else if (status == 1) {
                if (selection == 0) {
                    if ((cm.getLevel() > 29 && cm.getLevel() < 51) || cm.getPlayer().isGM()) {
                        cm.getChar().saveLocation("MONSTER_CARNIVAL");
                        cm.warp(980000000, 0);
                        cm.dispose();

                    } else if (cm.getLevel() < 30) {
                        cm.sendOk("你的等级尚未达到 30 级，无法参加怪物嘉年华擂台 1。等变得更强大后再来吧！");
                        cm.dispose();

                    } else {
                        cm.sendOk("怪物嘉年华擂台 1 仅限 30 到 50 级的玩家入场。");
                        cm.dispose();

                    }
                } else if (selection == 1) {
                    status = 60;
                    cm.sendSimple("你想了解哪些内容？\r\n#b#L0# 什么是怪物嘉年华？#l\r\n#L1# 怪物嘉年华玩法概述#l\r\n#L2# 嘉年华点数(CP)与快捷键指南#l\r\n#L3# 算了，我不想了解了#l");
                } else if (selection == 2) {
                    cm.sendSimple("只要你手头拥有 #b#t4001129##k（枫叶币），就能找我兑换各种专属饰品、稀有卷轴以及极品武器！\r\n#b#L0# #t1122007#（" + n1 + " 个枫叶币）#l\r\n#L1# #t2041211#（" + n2 + " 个枫叶币）#l\r\n#L2# 战士专属武器#l\r\n#L3# 魔法师专属武器#l\r\n#L4# 弓箭手专属武器#l\r\n#L5# 飞侠专属武器#l\r\n#L6# 海盗专属武器#l");
                } else if (selection == 3) {
                    cm.getChar().saveLocation("MONSTER_CARNIVAL");
                    cm.warp(980030000, 0);
                    cm.dispose();

                } else if (selection == 4) {
                    var selStr = "好吧，我也可以为你提供稳定的#b矿石精炼#k服务，不过合成费用会比平时多收#r" + ((feeMultiplier * 100) | 0) + "%#k。你想做什么？#b";

                    var options = ["精炼矿石母矿", "精炼宝石母矿"];
                    if (refineCrystals) {
                        options.push("精炼水晶母矿");
                    }
                    if (refineRocks) {
                        options.push("合成矿石成品/宝石");
                    }

                    for (var i = 0; i < options.length; i++) {
                        selStr += "\r\n#L" + i + "# " + options[i] + "#l";
                    }

                    cm.sendSimple(selStr);

                    status = 76;
                }
            } else if (status == 2) {
                select = selection;
                if (select == 0) {
                    if (cm.haveItem(4001129, n1) && cm.canHold(4001129)) {
                        cm.gainItem(1122007, 1);
                        cm.gainItem(4001129, -n1);
                        cm.dispose();
                    } else {
                        cm.sendOk("请检查你身上是否有足够的 #b#t4001129##k，或者装备栏是否有空位。");
                        cm.dispose();
                    }
                } else if (select == 1) {
                    if (cm.haveItem(4001129, n2) && cm.canHold(2041211)) {
                        cm.gainItem(2041211, 1);
                        cm.gainItem(4001129, -n2);
                        cm.dispose();
                    } else {
                        cm.sendOk("请检查你身上是否有足够的 #b#t4001129##k，或者消耗栏是否有空位。");
                        cm.dispose();
                    }
                } else if (select == 2) {//S2 Warrior 26 S3 Magician 6 S4 Bowman 6 S5 Thief 8
                    status = 10;
                    cm.sendSimple("请选择你想要兑换的战士武器。我这里的装备品质绝对是一等一的棒！\r\n#b#L0# #z1302004#（" + n3 + " 个枫叶币）#l\r\n#L1# #z1402006#（" + n3 + " 个枫叶币）#l\r\n#L2# #z1302009#（" + n4 + " 个枫叶币）#l\r\n#L3# #z1402007#（" + n4 + " 个枫叶币）#l\r\n#L4# #z1302010#（" + n5 + " 个枫叶币）#l\r\n#L5# #z1402003#（" + n5 + " 个枫叶币）#l\r\n#L6# #z1312006#（" + n3 + " 个枫叶币）#l\r\n#L7# #z1412004#（" + n3 + " 个枫叶币）#l\r\n#L8# #z1312007#（" + n4 + " 个枫叶币）#l\r\n#L9# #z1412005#（" + n4 + " 个枫叶币）#l\r\n#L10# #z1312008#（" + n5 + " 个枫叶币）#l\r\n#L11# #z1412003#（" + n5 + " 个枫叶币）#l\r\n#L12# 翻到下一页（1/2）#l");
                } else if (select == 3) {
                    status = 20;
                    cm.sendSimple("请选择你想要兑换的魔法师武器。每一把法杖都蕴含着强大的魔力！\r\n#b#L0# #z1372001#（" + n3 + " 个枫叶币）#l\r\n#L1# #z1382018#（" + n3 + " 个枫叶币）#l\r\n#L2# #z1372012#（" + n4 + " 个枫叶币）#l\r\n#L3# #z1382019#（" + n4 + " 个枫叶币）#l\r\n#L4# #z1382001#（" + n5 + " 个枫叶币）#l\r\n#L5# #z1372007#（" + n5 + " 个枫叶币）#l");
                } else if (select == 4) {
                    status = 30;
                    cm.sendSimple("请选择你想要兑换的弓箭手武器。手感绝佳，百步穿杨！\r\n#b#L0# #z1452006#（" + n3 + " 个枫叶币）#l\r\n#L1# #z1452007#（" + n4 + " 个枫叶币）#l\r\n#L2# #z1452008#（" + n5 + " 个枫叶币）#l\r\n#L3# #z1462005#（" + n3 + " 个枫叶币）#l\r\n#L4# #z1462006#（" + n4 + " 个枫叶币）#l\r\n#L5# #z1462007#（" + n5 + " 个枫叶币）#l");
                } else if (select == 5) {
                    status = 40;
                    cm.sendSimple("请选择你想要兑换的飞侠武器。锋利无比，乃暗夜刺客之首选！\r\n#b#L0# #z1472013#（" + n3 + " 个枫叶币）#l\r\n#L1# #z1472017#（" + n4 + " 个枫叶币）#l\r\n#L2# #z1472021#（" + n5 + " 个枫叶币）#l\r\n#L3# #z1332014#（" + n3 + " 个枫叶币）#l\r\n#L4# #z1332031#（" + n4 + " 个枫叶币）#l\r\n#L5# #z1332011#（" + n4 + " 个枫叶币）#l\r\n#L6# #z1332016#（" + n5 + " 个枫叶币）#l\r\n#L7# #z1332003#（" + n5 + " 个枫叶币）#l");
                } else if (select == 6) {
                    status = 50; //pirate rewards
                    cm.sendSimple("请选择你想要兑换的海盗武器。威力强大，横扫战场！\r\n#b#L0# #z1482005#（" + n3 + " 个枫叶币）#l \r\n#b#L1# #z1482006#（" + n4 + " 个枫叶币）#l \r\n#b#L2# #z1482007#（" + n5 + " 个枫叶币）#l \r\n#b#L3# #z1492005#（" + n3 + " 个枫叶币）#l \r\n#b#L4# #z1492006#（" + n4 + " 个枫叶币）#l \r\n#b#L5# #z1492007#（" + n5 + " 个枫叶币）#l");
                }
            } else if (status == 11) {
                if (selection == 12) {
                    cm.sendSimple("请选择你想要兑换的武器：\r\n#b#L0# #z1322015#（" + n3 + " 个枫叶币）#l\r\n#L1# #z1422008#（" + n3 + " 个枫叶币）#l\r\n#L2# #z1322016#（" + n4 + " 个枫叶币）#l\r\n#L3# #z1422007#（" + n4 + " 个枫叶币）#l\r\n#L4# #z1322017#（" + n5 + " 个枫叶币）#l\r\n#L5# #z1422005#（" + n5 + " 个枫叶币）#l\r\n#L6# #z1432003#（" + n3 + " 个枫叶币）#l\r\n#L7# #z1442003#（" + n3 + " 个枫叶币）#l\r\n#L8# #z1432005#（" + n4 + " 个枫叶币）#l\r\n#L9# #z1442009#（" + n4 + " 个枫叶币）#l\r\n#L10# #z1442005#（" + n5 + " 个枫叶币）#l\r\n#L11# #z1432004#（" + n5 + " 个枫叶币）#l\r\n#L12# 返回第一页（2/2）#l");
                } else {
                    var item = [1302004, 1402006, 1302009, 1402007, 1302010, 1402003, 1312006, 1412004, 1312007, 1412005, 1312008, 1412003];
                    var cost = [n3, n3, n4, n4, n5, n5, n3, n3, n4, n4, n5];
                    if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                        cm.gainItem(item[selection], 1);
                        cm.gainItem(4001129, -cost[selection]);
                        cm.dispose();
                    } else {
                        cm.sendOk("你的 #b#t4001129##k 数量不足，或者装备栏已满。请检查后再试。");
                        cm.dispose();
                    }
                }
            } else if (status == 12) {
                if (selection == 12) {
                    status = 10;
                    cm.sendSimple("请选择你想要兑换的战士武器。我这里的装备品质绝对是一等一的棒！\r\n#b#L0# #z1302004#（" + n3 + " 个枫叶币）#l\r\n#L1# #z1402006#（" + n3 + " 个枫叶币）#l\r\n#L2# #z1302009#（" + n4 + " 个枫叶币）#l\r\n#L3# #z1402007#（" + n4 + " 个枫叶币）#l\r\n#L4# #z1302010#（" + n5 + " 个枫叶币）#l\r\n#L5# #z1402003#（" + n5 + " 个枫叶币）#l\r\n#L6# #z1312006#（" + n3 + " 个枫叶币）#l\r\n#L7# #z1412004#（" + n3 + " 个枫叶币）#l\r\n#L8# #z1312007#（" + n4 + " 个枫叶币）#l\r\n#L9# #z1412005#（" + n4 + " 个枫叶币）#l\r\n#L10# #z1312008#（" + n5 + " 个枫叶币）#l\r\n#L11# #z1412003#（" + n5 + " 个枫叶币）#l\r\n#L12# 翻到下一页（1/2）#l");
                } else {
                    var item = [1322015, 1422008, 1322016, 1422007, 1322017, 1422005, 1432003, 1442003, 1432005, 1442009, 1442005, 1432004];
                    var cost = [n3, n3, n4, n4, n5, n5, n3, n3, n4, n4, n5, n5];
                    if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                        cm.gainItem(item[selection], 1);
                        cm.gainItem(4001129, -cost[selection]);
                        cm.dispose();
                    } else {
                        cm.sendOk("你的 #b#t4001129##k 数量不足，或者装备栏已满。请检查后再试。");
                        cm.dispose();
                    }
                }
            } else if (status == 21) {
                var item = [1372001, 1382018, 1372012, 1382019, 1382001, 1372007];
                var cost = [n3, n3, n4, n4, n5, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("你的 #b#t4001129##k 数量不足，或者装备栏已满。请检查后再试。");
                    cm.dispose();
                }
            } else if (status == 31) {
                var item = [1452006, 1452007, 1452008, 1462005, 1462006, 1462007];
                var cost = [n3, n4, n5, n3, n4, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("你的 #b#t4001129##k 数量不足，或者装备栏已满。请检查后再试。");
                    cm.dispose();
                }
            } else if (status == 41) {
                var item = [1472013, 1472017, 1472021, 1332014, 1332031, 1332011, 1332016, 1332003];
                var cost = [n3, n4, n5, n3, n4, n4, n5, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("你的 #b#t4001129##k 数量不足，或者装备栏已满。请检查后再试。");
                    cm.dispose();
                }
            } else if (status == 51) {
                var item = [1482005, 1482006, 1482007, 1492005, 1492006, 1492007];
                var cost = [n3, n4, n5, n3, n4, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("你的 #b#t4001129##k 数量不足，或者装备栏已满。请检查后再试。");
                    cm.dispose();
                }
            } else if (status == 61) {
                select = selection;
                if (selection == 0) {
                    cm.sendNext("哈哈！我是斯皮格曼，怪物嘉年华的主办人！我在这里举办了盛大的#b怪物嘉年华#k，期待像你这样充满朝气的冒险家加入这场狂欢！");
                } else if (selection == 1) {
                    cm.sendNext("#b怪物嘉年华#k 是由两支队伍进入专属擂台，通过击败怪物获取嘉年华点数（CP），并利用CP召唤怪物、施加负面技能或召唤守护者妨碍对手的精彩对战！最后#b以获得CP总分高的一方判定获胜#k。");
                } else if (selection == 2) {
                    cm.sendNext("进入嘉年华擂台后，你的界面上会出现对战控制面板。你只需要#b选择你想使用的战术功能，然后按下确定即可执行#k。非常简单直观！");
                } else {
                    cm.dispose();
                }
            } else if (status == 62) {
                if (select == 0) {
                    cm.sendNext("什么是#b怪物嘉年华#k？哈哈哈！可以说这是一场你终生难忘的刺激体验！在这里你可以与其他冒险家队伍展开斗智斗勇的精彩对抗！");
                } else if (select == 1) {
                    cm.sendNext("进入擂台后，你们的目标就是尽可能快地消灭怪物以赚取嘉年华点数(CP)，并巧妙消耗CP来给对方队伍施加干扰，阻止他们顺畅击杀怪物。");
                } else if (select == 2) {
                    cm.sendNext("当你熟悉了界面操作后，推荐使用快捷键：#bTAB 键以及 F1 ~ F12 键#k。#bTAB 键可以在【召唤怪物 / 施加技能 / 召唤守护者】三类功能间快速切换#k，而 #bF1 ~ F12 可以一键触发对应编号的战术功能#k！");
                }
            } else if (status == 63) {
                if (select == 0) {
                    cm.sendNext("让冒险家们拿真刀真枪直接互砍太野蛮危险了，我可不推崇那种粗鲁的行为。在这里，我提供的是充满智谋与技巧的竞技乐趣！双方互相给对方场上召唤强力怪物并进行猎杀！此外，在嘉年华中斩获的枫叶币，还可以找我兑换各种专属神兵利器与极品卷轴！");
                } else if (select == 1) {
                    cm.sendNext("干扰对方队伍主要有三种手段：#b召唤更强怪物#k、#b施加异常状态技能#k 以及 #b召唤强化守护者图腾#k。想了解更详细的战术，可以继续听我讲解！");
                } else if (select == 2) {
                    cm.sendNext("#b召唤怪物#k：消耗一定的CP，在对方队伍的战场上立刻召唤出一批怪物。怪物越强力，对方清理起来就越吃力！");
                }
            } else if (select == 64) {
                if (select == 0) {
                    cm.sendNext("不仅如此，战局千变万化，合理搭配技能与守护者才是制胜之道。怎么样？是不是迫不及待想要来一场友谊对抗了？");
                    cm.dispose();
                } else if (select == 1) {
                    cm.sendNext("请记住，把CP一直捏在手里可不是明智之举。#b积极运用CP打乱对手节奏，才是赢得怪物嘉年华的关键！#k");
                } else if (select == 2) {
                    cm.sendNext("#b状态技能#k：消耗少量CP，给对方全队施加诸如黑暗、虚弱、眩晕、诅咒等负面状态。虽然持续时间有限，但在关键时刻往往能起到扭转战局的奇效！");
                }
            } else if (status == 65) {
                if (select == 1) {
                    cm.sendNext("对了，在嘉年华中完全不必担心阵亡受损。在怪物嘉年华对战中，即便角色阵亡也#r绝对不会扣除任何经验值#k！所以尽管放手一搏吧！");
                    cm.dispose();
                } else if (select == 2) {
                    cm.sendNext("#b守护者图腾#k：召唤一个特殊的图腾柱，大幅提升本方召唤给对手的怪物的攻击力、防御力或回避率等属性！图腾会一直生效直到被对方击碎为止。建议先召唤一批怪物后再立起图腾！");
                }
            } else if (status == 66) {
                cm.sendNext("最后需要提醒的是：在怪物嘉年华内无法使用随身背包中的常规消耗药水。取而代之的是，战场怪物会掉落即时生效的恢复药水与状态符文，拾取瞬间立即生效。因此掌控药水掉落时机也是一门高超的学问！");
                cm.dispose();
            } else if (status == 77) {
                var allDone;

                if (selection == 0) {
                    allDone = refineItems(0); // minerals
                } else if (selection == 1) {
                    allDone = refineItems(1); // jewels
                } else if (selection == 2 && refineCrystals) {
                    allDone = refineItems(2); // crystals
                } else if (selection == 2 && !refineCrystals || selection == 3) {
                    allDone = refineRockItems(); // moon/star rock
                }

                if (allDone) {
                    cm.sendOk("完成了。谢谢你的出现~。");
                } else {
                    cm.sendOk("完成。请注意，一些物品无法合成，可能是因为您的杂项物品栏空间不足，或者没有足够的纪念币来支付费用。");
                }
                cm.dispose();
            }
        }
    }
}

function getRefineFee(fee) {
    return ((feeMultiplier * fee) | 0);
}

function isRefineTarget(refineType, refineItemid) {
    if (refineType == 0) { //mineral refine
        return refineItemid >= 4010000 && refineItemid <= 4010007 && !(refineItemid == 4010007 && !refineSpecials);
    } else if (refineType == 1) { //jewel refine
        return refineItemid >= 4020000 && refineItemid <= 4020008 && !(refineItemid == 4020008 && !refineSpecials);
    } else if (refineType == 2) { //crystal refine
        return refineItemid >= 4004000 && refineItemid <= 4004004 && !(refineItemid == 4004004 && !refineSpecials);
    }

    return false;
}

function getRockRefineTarget(refineItemid) {
    if (refineItemid >= 4011000 && refineItemid <= 4011006) {
        return 0;
    } else if (refineItemid >= 4021000 && refineItemid <= 4021008) {
        return 1;
    }

    return -1;
}

function refineItems(refineType) {
    var allDone = true;

    var refineFees = [[300, 300, 300, 500, 500, 500, 800, 270], [500, 500, 500, 500, 500, 500, 500, 1000, 3000], [5000, 5000, 5000, 5000, 1000000]];
    var itemCount = {};

    const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
    var iter = cm.getPlayer().getInventory(InventoryType.ETC).iterator();
    while (iter.hasNext()) {
        var it = iter.next();
        var itemid = it.getItemId();

        if (isRefineTarget(refineType, itemid)) {
            var ic = itemCount[itemid];

            if (ic != undefined) {
                itemCount[itemid] += it.getQuantity();
            } else {
                itemCount[itemid] = it.getQuantity();
            }
        }
    }

    for (var key in itemCount) {
        var itemqty = itemCount[key];
        var itemid = parseInt(key);

        var refineQty = ((itemqty / 10) | 0);
        if (refineQty <= 0) {
            continue;
        }

        while (true) {
            itemqty = refineQty * 10;

            var fee = getRefineFee(refineFees[refineType][(itemid % 100) | 0] * refineQty);
            if (cm.canHold(itemid + 1000, refineQty, itemid, itemqty) && cm.getMeso() >= fee) {
                cm.gainMeso(-fee);
                cm.gainItem(itemid, -itemqty);
                cm.gainItem(itemid + (itemid != 4010007 ? 1000 : 1001), refineQty);

                break;
            } else if (refineQty <= 1) {
                allDone = false;
                break;
            } else {
                refineQty--;
            }
        }
    }

    return allDone;
}

function refineRockItems() {
    var allDone = true;
    var minItems = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
    var minRocks = [2147483647, 2147483647];

    var rockItems = [4011007, 4021009];
    var rockFees = [10000, 15000];

    const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
    var iter = cm.getPlayer().getInventory(InventoryType.ETC).iterator();
    while (iter.hasNext()) {
        var it = iter.next();
        var itemid = it.getItemId();
        var rockRefine = getRockRefineTarget(itemid);
        if (rockRefine >= 0) {
            var rockItem = ((itemid % 100) | 0);
            var itemqty = it.getQuantity();

            minItems[rockRefine][rockItem] += itemqty;
        }
    }

    for (var i = 0; i < minRocks.length; i++) {
        for (var j = 0; j < minItems[i].length; j++) {
            if (minRocks[i] > minItems[i][j]) {
                minRocks[i] = minItems[i][j];
            }
        }
        if (minRocks[i] <= 0 || minRocks[i] == 2147483647) {
            continue;
        }

        var refineQty = minRocks[i];
        while (true) {
            var fee = getRefineFee(rockFees[i] * refineQty);
            if (cm.canHold(rockItems[i], refineQty) && cm.getMeso() >= fee) {
                cm.gainMeso(-fee);

                var j;
                if (i == 0) {
                    for (j = 4011000; j < 4011007; j++) {
                        cm.gainItem(j, -refineQty);
                    }
                    cm.gainItem(j, refineQty);
                } else {
                    for (j = 4021000; j < 4021009; j++) {
                        cm.gainItem(j, -refineQty);
                    }
                    cm.gainItem(j, refineQty);
                }

                break;
            } else if (refineQty <= 1) {
                allDone = false;
                break;
            } else {
                refineQty--;
            }
        }
    }

    return allDone;
}