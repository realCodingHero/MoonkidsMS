/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* Dark Lord
	Thief Job Advancement
	Victoria Road : Thieves' Hideout (103000003)
	Custom Quest 100009, 100011
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "3thJobI": false, "3thJobC": false};
job = 410;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 4;

function start() {
    const GameConstants = Java.type('org.gms.constants.game.GameConstants');
    if (parseInt(cm.getJobId() / 100) == jobType && cm.canSpawnPlayerNpc(GameConstants.getHallOfFameMapid(cm.getJob()))) {
        spawnPnpc = true;

        var sendStr = "经历了漫长的冒险旅途，你终于拥有了今天的力量、智慧与勇气，不是吗？你想现在就在#r名人堂中留下你现在的角色形象NPC#k吗？";
        if (spawnPnpcFee > 0) {
            sendStr += " 我可以为你办理，费用是 #b" + cm.numberWithCommas(spawnPnpcFee) + " 金币#k。";
        }

        cm.sendYesNo(sendStr);
    } else {
        if (cm.getJobId() == 0) {
            actionx["1stJob"] = true;
            cm.sendNext("想成为一名#r飞侠#k吗？想要融入黑夜，必须满足基本条件……#b等级达到10级以上，且" + cm.getFirstJobStatRequirement(jobType) + "#k。让我来看看你的资质吧。");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 400) {
            actionx["2ndJob"] = true;
            if (cm.haveItem(4031012)) {
                cm.sendNext("做得不错。看来你已经做好了向更深邃的阴影迈出下一步的准备。");
            } else if (cm.haveItem(4031011)) {
                cm.sendOk("去找飞侠二转转职教官#b#p1072003##k吧。");
                cm.dispose();
            } else {
                cm.sendNext("你取得的进步令人惊叹。不知不觉中，你已经成长为一名身手不凡的飞侠了。");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 4 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
            actionx["3thJobI"] = true;
            cm.sendNext("你来了。几天前，神秘岛的#b#p2020011##k跟我提起过你。听说你想进行飞侠的三转。为了实现这个目标，我必须测试你的实力，看看你是否具备晋升的资格。在金银岛的废弃都市猴子沼泽深处有一处入口通往次元裂缝。进入后你将面对我的分身。你的任务是打败他，并带回#b#t4031059##k。");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("请击败分身，将#b#t4031059##k带给我。");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("干得好！你打败了我的分身，并安全带回了#b#t4031059##k。你战胜了我的分身，向我证明了你坚韧不拔的强大实力。现在你应该把这条项链交给在冰峰雪域长老板屋的#b#p2020011##k，去开启智慧的试炼吧。祝你好运！");
        } else if (cm.isQuestStarted(6141)) {
            cm.warp(910300000, 3);
        } else {
            cm.sendOk("你做出了明智的选择。");
            cm.dispose();
        }
    }
}

function action(mode, type, selection) {
    status++;
    if (mode == -1 && selection == -1) {
        cm.dispose();
        return;
    } else if (mode == 0 && type != 1) {
        status -= 2;
    }

    if (status == -1) {
        start();
        return;
    } else {
        if (spawnPnpc) {
            if (mode > 0) {
                if (cm.getMeso() < spawnPnpcFee) {
                    cm.sendOk("抱歉，你没有足够的金币在名人堂设立雕像。");
                    cm.dispose();
                    return;
                }

                const PlayerNPC = Java.type('org.gms.server.life.PlayerNPC');
                const GameConstants = Java.type('org.gms.constants.game.GameConstants');
                if (PlayerNPC.spawnPlayerNPC(GameConstants.getHallOfFameMapid(cm.getJob()), cm.getPlayer())) {
                    cm.sendOk("搞定了！希望你喜欢你的雕像。");
                    cm.gainMeso(-spawnPnpcFee);
                } else {
                    cm.sendOk("抱歉，名人堂目前已满……");
                }
            }

            cm.dispose();
            return;
        } else {
            if (mode != 1 || status == 7 && type != 1 || (actionx["1stJob"] && status == 4) || (cm.haveItem(4031008) && status == 2) || (actionx["3thJobI"] && status == 1)) {
                if (mode == 0 && status == 2 && type == 1) {
                    cm.sendOk("你知道没有其他选择……");
                }
                if (!(mode == 0 && type != 1)) {
                    cm.dispose();
                    return;
                }
            }
        }
    }

    if (actionx["1stJob"]) {
        if (status == 0) {
            if (cm.getLevel() >= 10 && cm.canGetFirstJob(jobType)) {
                cm.sendYesNo("哦……！你身上散发着敏锐而神秘的气息，确实适合成为暗影中的主宰。那么，你准备好成为一名飞侠了吗？");
            } else {
                cm.sendOk("请再去努力训练一下吧。等你达到基本要求后，我就可以引导你成为一名#r飞侠#k。");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(2070000) && cm.canHoldAll([1472061, 1332063])) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(400);
                    cm.gainItem(2070015, 500);
                    cm.gainItem(1472061, 1);
                    cm.gainItem(1332063, 1);
                    cm.resetStats();
                }
                cm.sendNext("很好，从现在开始，你就是我们飞侠的一员了！潜伏在暗影之中，虽然道路孤独而危险，但只要身手敏捷、意志坚定，终将成为顶尖的刺客。那么，虽然不多，但我会传授给你一些力量……喝啊啊啊！！");
            } else {
                cm.sendNext("请清理一下你的背包，然后再来找我。");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("你现在变得比以前更强了，并且所有背包栏的容量都增加了一行。自己打开背包看看吧。我还给了你一些 #b技能点数（SP）#k。点击屏幕左下角的 #b技能#k 菜单，就可以使用SP学习飞侠技能。不过要注意：技能需要逐步提升，部分高阶技能需要先习得前置技能才能学习。");
        } else if (status == 3) {
            cm.sendNextPrev("另外提醒你一句：一旦做出了选择，就无法反悔或更改职业。去吧，成为一名暗夜中的骄傲飞侠！");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.haveItem(4031012)) {
                cm.sendSimple("考虑好之后，请点击底部的[决定选择职业]。#b\r\n#L0#请为我说明刺客职业。\r\n#L1#请为我说明侠客职业。\r\n#L3#我已经决定好要转职的职业！");
            } else {
                cm.sendNext("做得好。你看起来已经很出色了，但我必须测试你是否真的有实力完成二转。这并不是特别困难的测试，相信你一定能做好。先收下我的推荐信……千万不要弄丢了！");
                if (!cm.isQuestStarted(100009)) {
                    cm.startQuest(100009);
                }
            }
        } else if (status == 1) {
            if (!cm.haveItem(4031012)) {
                if (cm.canHold(4031011)) {
                    if (!cm.haveItem(4031011)) {
                        cm.gainItem(4031011, 1);
                    }
                    cm.sendNextPrev("请将这封推荐信交给废弃都市附近的#b#p1072003##k。他是飞侠二转转职教官。把信交给他，他会负责主持你的转职测试。祝你好运！");
                } else {
                    cm.sendNext("请在你的背包中留出足够的空位。");
                    cm.dispose();
                }
            } else {
                if (selection < 3) {
                    if (selection == 0) {    //assassin
                        cm.sendNext("擅长使用#r拳套与飞镖#k的远程飞侠。\r\n\r\n#b刺客#k擅长在远距离利用投掷飞镖进行高速致命打击。拥有极高的暴击伤害与机动性，战斗风格华丽轻盈。核心技能包括提高伤害的#r强力投掷#k与提高移动速度和跳跃力的技能。");
                    } else if (selection == 1) {    //bandit
                        cm.sendNext("擅长使用#r短刀（短剑）#k的近战飞侠。\r\n\r\n#b侠客#k擅长近身肉搏与快速连续刺杀，拥有出色的近战爆发力与连招技巧。可以使用技能如#r快速短剑#k和#r神通术#k等，近战伤害非常可观。");
                    }

                    status -= 2;
                } else {
                    cm.sendSimple("现在... 你决定好了吗？请选择你想要在二转时选择的职业：#b\r\n#L0#刺客\r\n#L1#侠客");
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031011)) {
                cm.dispose();
                return;
            }
            job += selection * 10;
            cm.sendYesNo("你决定要转职成为" + (job == 410 ? "#b刺客#k" : "#b侠客#k") + "吗？一旦做出选择，将无法更改二转职业，确定吗？");
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }
            cm.completeQuest(100011);

            if (job == 410) {
                cm.sendNext("很好，从现在起你就是一名#b刺客#k了！刺客拥有敏捷的步伐与致命的手法，能在瞬息之间消灭敌人。请坚持刻苦训练，我会一直注视着你的成长。");
            } else {
                cm.sendNext("很好，从现在起你就是一名#b侠客#k了！侠客在暗影中潜行，能在敌人不备之时发动迅猛致命的突袭。请坚持刻苦训练，我会一直注视着你的成长。");
            }

            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("我刚才给了你二转技能书，同时你的背包空间和最大生命值、魔法值也都得到了提升。快去查看一下吧。");
        } else if (status == 5) {
            cm.sendNextPrev("我还给了你一些 #b技能点数（SP）#k。打开左下角的 #b技能菜单#k，就可以升级新的二转技能。请记住，某些强力技能需要先满足前置技能等级才能解锁。");
        } else if (status == 6) {
            cm.sendNextPrev("作为一名" + (job == 410 ? "刺客" : "侠客") + "，你必须变得更加坚强。但请牢记，力量绝不能用来欺凌弱者，一定要将这份强大的力量用于正义。当你准备好追寻更高的境界时，再来找我吧。我期待着你的归来。");
        }
    } else if (actionx["3thJobI"]) {
        if (status == 0) {
            if (cm.getPlayer().gotPartyQuestItem("JB3")) {
                cm.getPlayer().removePartyQuestItem("JB3");
                cm.getPlayer().setPartyQuestItemObtained("JBP");
            }
            cm.sendNextPrev("既然是我的分身，实力自然非同小可，你将面临一场恶战。分身拥有许多强力且特殊的攻击技能，你必须依靠自己的力量一对一将其战胜。另外在次元空间中存在时间限制，你必须在时限内解决战斗。祝你好运，期待你带回#b#t4031059##k。");
        }
    } else if (actionx["3thJobC"]) {
        cm.getPlayer().removePartyQuestItem("JBP");
        cm.gainItem(4031059, -1);
        cm.gainItem(4031057, 1);
        cm.dispose();
    }
}