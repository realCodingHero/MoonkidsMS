var quantities = Array(10, 8, 6, 5, 4, 3, 2, 1, 1, 1);
var prize1 = Array(1442047, 2000000, 2000001, 2000002, 2000003, 2000004, 2000005, 2430036, 2430037, 2430038, 2430039, 2430040); //1 day
var prize2 = Array(1442047, 4080100, 4080001, 4080002, 4080003, 4080004, 4080005, 4080006, 4080007, 4080008, 4080009, 4080010, 4080011);
var prize3 = Array(1442047, 1442048, 2022070);
var prize4 = Array(1442048, 2430082, 2430072); //7 day
var prize5 = Array(1442048, 2430091, 2430092, 2430093, 2430101, 2430102); //10 day
var prize6 = Array(1442048, 1442050, 2430073, 2430074, 2430075, 2430076, 2430077); //15 day
var prize7 = Array(1442050, 3010183, 3010182, 3010053, 2430080); //20 day
var prize8 = Array(1442050, 3010178, 3010177, 3010075, 1442049, 2430053, 2430054, 2430055, 2430056, 2430103, 2430136); //30 day
var prize9 = Array(1442049, 3010123, 3010175, 3010170, 3010172, 3010173, 2430201, 2430228, 2430229); //60 day
var prize10 = Array(1442049, 3010172, 3010171, 3010169, 3010168, 3010161, 2430117, 2430118, 2430119, 2430120, 2430137); //1 year
var status = 0;

function start() {
    status = -1;
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
        if (status == 0) {
            cm.sendNext("嘿，我是#p" + cm.getNpc() + "#k。如果你现在有空的话……能和我一起玩吗？我听说这附近聚集了好多人准备参加#r活动#k，但我一个人有点不好意思去……嗯，你想和我一起去看看吗？");
        } else if (status == 1) {
            cm.sendSimple("哦？是什么样的活动？那个嘛……\r\n#L0##e1.#n#b 这是什么样的活动？#k#l\r\n#L1##e2.#n#b 给我介绍一下活动项目吧。#k#l\r\n#L2##e3.#n#b 好啊，我们出发吧！#k#l\r\n#L3##e4.#n#b 使用连胜证书兑换奖励。#k#l");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendNext("这个月，冒险岛正在举办特别庆典活动！管理员们将在活动期间举行各种惊喜活动，千万不要错过参与并赢取丰厚奖品的机会哦！");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendSimple("活动包含多种丰富的小游戏。在进入游戏前先熟悉一下规则会更有帮助哦。请选择你想了解的项目吧！#b\r\n#L0# 爬高高 (Ola Ola)#l\r\n#L1# 冒险岛体能测试#l\r\n#L2# 滚雪球#l\r\n#L3# 打椰子#l\r\n#L4# OX问答#l\r\n#L5# 寻宝活动#l#k");
            } else if (selection == 2) {
                var marr = cm.getQuestRecord(100295);
                if (marr.getCustomData() == null) {
                    marr.setCustomData("0");
                }
                var dat = parseInt(marr.getCustomData());
                if (dat + 3600000 >= cm.getCurrentTime()) {
                    cm.sendNext("你在过去的一小时内已经参加过活动了，请稍后再来。");
                } else if (!cm.canHold(4031019)) {
                    cm.sendNext("请清理出一些背包空间。");
                } else if (cm.getChannelServer().getEvent() > -1 && !cm.haveItem(4031019)) {
                    cm.getPlayer().saveLocation("EVENT");
                    cm.getPlayer().setChalkboard(null);
                    marr.setCustomData("" + cm.getCurrentTime());
                    cm.warp(cm.getChannelServer().getEvent(), cm.getChannelServer().getEvent() == 109080000 || cm.getChannelServer().getEvent() == 109080010 ? 0 : "join00");
                } else {
                    cm.sendNext("活动可能尚未开放，或者你已经持有#b神秘卷轴#k，亦或是你在过去24小时内已经参与过活动了。请稍后再试！");
                }
                cm.dispose();
            } else if (selection == 3) {
                var selStr = "你想用哪种连胜证书兑换奖励呢？";
                for (var i = 0; i < quantities.length; i++) {
                    selStr += "\r\n#b#L" + i + "#使用 #t" + (4031332 + i) + "# 兑换 (" + quantities[i] + "个)#l";
                }
                cm.sendSimple(selStr);
                status = 9;
            }
        } else if (status == 3) {
            if (selection == 0) {
                cm.sendNext("#b[爬高高]#k 是一项需要顺着梯子不断向上攀爬到达顶部的游戏。选择正确的传送门不断向上，进入下一个关卡。\r\n\r\n游戏共分为三个阶段，限时 #b6分钟#k。在 [爬高高] 中，你 #b无法跳跃、使用瞬间移动、加速术，也无法使用药水或道具提高移动速度#k。此外还有一些陷阱传送门会把你送回原点，请格外小心！");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("#b[冒险岛体能测试]#k 是一项类似于忍耐之林/森林障碍的耐力赛跑。克服各种障碍，在规定时间内到达终点即可获胜。\r\n\r\n游戏共分为四个阶段，限时 #b15分钟#k。在 [冒险岛体能测试] 期间，你将无法使用瞬间移动或加速技能。");
                cm.dispose();
            } else if (selection == 2) {
                cm.sendNext("#b[滚雪球]#k 由红队（枫叶队）与蓝队（故事队）两队进行比拼，看哪一队在规定时间内能将雪球推得更远更大。若在规定时间内未分胜负，则由雪球推得更远的一方获胜。\r\n\r\n要推动雪球，请按 #bCtrl#k 键进行普通攻击。所有远程攻击和技能攻击在此均无效，#b只有近身普通攻击才起作用#k。\r\n如果角色触碰到滚动的雪球，将被送回起点。攻击对方起点前的雪人可以阻碍对方推动雪球。合理分配进攻雪球与干扰雪人的策略至关重要！");
                cm.dispose();
            } else if (selection == 3) {
                cm.sendNext("#b[打椰子]#k 由两队互相竞争，看哪队能在限定时间内收集到更多的椰子。限时为 #b5分钟#k。如果打平，将额外增加2分钟加时赛。加时赛依然打平则判定为平局。\r\n\r\n所有远程攻击与技能在此均无效，#b只有近身普通攻击才起作用#k。若未携带近战武器，可在活动地图内的NPC处购买。无论角色等级、装备或技能如何，造成的打击判定均一致。\r\n小心地图内的各种陷阱与障碍。若在游戏中阵亡将被淘汰出局。只有击落并掉在地上的椰子才计入得分，树上未落下的或偶尔爆炸的椰子不计分。地图底部贝壳中藏有隐藏传送门，请善加利用！");
                cm.dispose();
            } else if (selection == 4) {
                cm.sendNext("#b[OX问答]#k 是在冒险岛中通过判断O与X展示智慧的智力竞赛。进入游戏后，按 #bM#k 键打开小地图确认O和X的区域位置。一共会有 #r10道题目#k，全部回答正确的角色将赢得比赛。\r\n\r\n题目公布后，请利用梯子移动到你认为正确的区域（O或X）。如果未在限时内做出选择或依然停留在梯子上，将被直接淘汰。在屏幕上的 [CORRECT] 提示消失之前，请务必保持站立不动。为了防止任何形式的作弊，在OX问答期间所有聊天功能将被关闭。");
                cm.dispose();
            } else if (selection == 5) {
                cm.sendNext("#b[寻宝活动]#k 的目标是在 #r10分钟内#k 搜寻隐藏在地图各处的 #b宝藏卷轴#k。地图各处散落着许多神秘宝箱，打碎宝箱后会掉落各种物品，你需要从中找到宝藏卷轴。\r\n\r\n宝箱只能通过 #b普通攻击#k 破坏。拿到宝藏卷轴后，可以与活动地图内的兑换NPC交换为神秘卷轴，也可以在明珠港找 #b维京#k 兑换。\r\n\r\n地图中暗藏着许多隐藏传送点与捷径。在特定位置按下 #b向上方向键（↑）#k 即可传送到其他区域。多尝试跳跃与探索，或许就能发现隐藏的绳索或宝箱。\r\n\r\n注意：寻宝活动中所有攻击技能均被 #r禁用#k，请使用普通攻击开启宝箱。");
                cm.dispose();
            }
        } else if (status == 10) {
            if (selection < 0 || selection > quantities.length) {
                return;
            }
            var ite = 4031332 + selection;
            var quan = quantities[selection];
            var pri;
            switch (selection) {
                case 0:
                    pri = prize1;
                    break;
                case 1:
                    pri = prize2;
                    break;
                case 2:
                    pri = prize3;
                    break;
                case 3:
                    pri = prize4;
                    break;
                case 4:
                    pri = prize5;
                    break;
                case 5:
                    pri = prize6;
                    break;
                case 6:
                    pri = prize7;
                    break;
                case 7:
                    pri = prize8;
                    break;
                case 8:
                    pri = prize9;
                    break;
                case 9:
                    pri = prize10;
                    break;
                default:
                    cm.dispose();
                    return;
            }
            var rand = Math.floor(Math.random() * pri.length);
            if (!cm.haveItem(ite, quan)) {
                cm.sendOk("你需要 #b" + quan + " 个 #t" + ite + "##k 才能兑换奖励。");
            } else if (cm.getInventory(1).getNextFreeSlot() <= -1 || cm.getInventory(2).getNextFreeSlot() <= -1 || cm.getInventory(3).getNextFreeSlot() <= -1 || cm.getInventory(4).getNextFreeSlot() <= -1) {
                cm.sendOk("请在背包各栏中至少留出一格空位。");
            } else {
                cm.gainItem(pri[rand], 1);
                cm.gainItem(ite, -quan);
                cm.gainMeso(100000 * selection); //temporary prize lolol
            }
            cm.dispose();
        }
    }
}