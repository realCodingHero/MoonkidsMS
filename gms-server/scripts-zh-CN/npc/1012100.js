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

/*      Athena Pierce
	Bowman Job Advancement
	Victoria Road : Bowman Instructional School (100000201)
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "3thJobI": false, "3thJobC": false};
job = 310;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 3;

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
            cm.sendNext("你决定成为一名#r弓箭手#k了吗？想要成为弓箭手，必须满足基本条件……#b等级达到10级以上，且" + cm.getFirstJobStatRequirement(jobType) + "#k。让我来看看你的资质吧。");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 300) {
            actionx["2ndJob"] = true;
            if (cm.haveItem(4031012)) {
                cm.sendNext("哈哈……我就知道你能轻松通过测试。我承认，你已经是一名出色的弓箭手了。我会让你变得更加强大。不过在此之前……你需要在两条转职道路中做出抉择。这或许是个艰难的决定，如果有任何疑问，请尽管向我咨询。");
            } else if (cm.haveItem(4031011)) {
                cm.sendOk("去找弓箭手转职教官#b#p1072002##k吧。");
                cm.dispose();
            } else {
                cm.sendYesNo("嗯……一段时间不见，你成长了许多呢。在你的身上已经看不到过去的稚嫩，而是越来越有一名真正弓箭手的风范了。怎么样？难道你不想获得更强大的力量吗？只要通过一个简单的测试，我就可以为你进行二转。你想挑战一下吗？");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 3 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
            actionx["3thJobI"] = true;
            cm.sendNext("你来了。几天前，神秘岛的#b#p2020010##k跟我提起过你。听说你想进行弓箭手的三转。为了实现这个目标，我必须测试你的实力，看看你是否具备晋升的资格。在金银岛的密林深处有一处入口通往次元裂缝。进入后你将面对我的分身。你的任务是打败她，并带回#b#t4031059##k。");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("请击败分身，将#b#t4031059##k带给我。");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("干得好！你打败了我的分身，并安全带回了#b#t4031059##k。你战胜了我的分身，向我证明了你坚韧不拔的强大实力。现在你应该把这条项链交给在冰峰雪域长老板屋的#b#p2020010##k，去开启智慧的试炼吧。祝你好运！");
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
                cm.sendNextPrev("这是一个重要且不可逆的选择，一旦转职将无法回头。");
            } else {
                cm.sendOk("请再去努力训练一下吧。等你达到基本要求后，我就可以引导你成为一名#r弓箭手#k。");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(1452051) && cm.canHold(2070000)) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(300);
                    cm.gainItem(1452051, 1);
                    cm.gainItem(2060000, 1000);
                    cm.resetStats();
                }
                cm.sendNext("很好，从现在开始，你就是我们弓箭手的一员了！虽然身为一名初心弓手，前面的路还很漫长，但只要坚持下去，你一定会成为优秀的猎手。那么，虽然不多，但我会传授给你一些力量……喝啊啊啊！！");
            } else {
                cm.sendNext("请清理一下你的背包，然后再来找我。");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("你现在变得比以前更强了，并且所有背包栏的容量都增加了一行。自己打开背包看看吧。我还给了你一些 #b技能点数（SP）#k。点击屏幕左下角的 #b技能#k 菜单，就可以使用SP学习弓箭手技能。不过要注意：技能需要逐步提升，部分高阶技能需要先习得前置技能才能学习。");
        } else if (status == 3) {
            cm.sendNextPrev("另外提醒你一句：一旦做出了选择，就无法反悔或更改职业。去吧，成为一名骄傲的弓箭手！");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.haveItem(4031012)) {
                cm.sendSimple("考虑好之后，请点击底部的[决定选择职业]。#b\r\n#L0#请为我说明猎人职业。\r\n#L1#请为我说明弩弓手职业。\r\n#L3#我已经决定好要转职的职业！");
            } else {
                cm.sendNext("做得好。你看起来已经很出色了，但我必须测试你是否真的有实力完成二转。这并不是特别困难的测试，相信你一定能做好。先收下我的推荐信……千万不要弄丢了！");
                if (!cm.isQuestStarted(100000)) {
                    cm.startQuest(100000);
                }
            }
        } else if (status == 1) {
            if (!cm.haveItem(4031012)) {
                if (cm.canHold(4031010)) {
                    if (!cm.haveItem(4031010)) {
                        cm.gainItem(4031010, 1);
                    }
                    cm.sendNextPrev("请将这封推荐信交给射手村附近的#b#p1072002##k。她是弓箭手二转转职教官。把信交给她后，她会负责主持你的转职测试。祝你好运！");
                    cm.dispose();
                } else {
                    cm.sendNext("请在你的背包中留出足够的空位。");
                    cm.dispose();
                }
            } else {
                if (selection < 3) {
                    if (selection == 0) {    //hunter
                        cm.sendNext("精通弓术的猎人。\r\n\r\n#b猎人#k攻击速度快，在前期拥有极高的持续输出能力。猎人可以使用技能#r炸弹箭#k，对最多6个敌人造成伤害并附带眩晕效果。");
                    } else if (selection == 1) {    //crossbowman 弩弓手
                        cm.sendNext("精通弩术的弩弓手。\r\n\r\n与猎人相比，#b弩弓手#k单发威力更大，爆发伤害极高。弩弓手可以使用强力的穿透技能#r穿退箭#k（铁箭），可以贯穿一条直线上的多个敌人。");
                    }

                    status -= 2;
                } else {
                    cm.sendSimple("现在... 你决定好了吗？请选择你想要进行的二转职业：#b\r\n#L0#猎人\r\n#L1#弩弓手");
                }
            }
        } else if (status == 2) {
            job += selection * 10;
            cm.sendYesNo("你决定要转职成为" + (job == 310 ? "#b猎人#k" : "#b弩弓手#k") + "吗？一旦做出选择，将无法更改二转职业，确定吗？");
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }

            var jobName = (job == 310 ? "猎人" : "弩弓手");
            cm.sendNext("很好，从现在起你就是一名#b" + jobName + "#k了！" + jobName + "拥有敏锐的洞察力和惊人的视力，能够百步穿杨精准命中敌人的要害。请坚持刻苦训练，我会一直注视着你的成长。");
            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("我刚才给了你二转技能书，同时你的背包空间和最大生命值、魔法值也都得到了提升。快去查看一下吧。");
        } else if (status == 5) {
            cm.sendNextPrev("我还给了你一些 #b技能点数（SP）#k。打开左下角的 #b技能菜单#k，就可以升级新的二转技能。请记住，某些强力技能需要先满足前置技能等级才能解锁。");
        } else if (status == 6) {
            cm.sendNextPrev("作为一名" + (job == 310 ? "猎人" : "弩弓手") + "，你必须变得更加坚强。但请牢记，力量绝不能用来欺凌弱者，一定要将这份强大的力量用于正义。当你准备好追寻更高的境界时，再来找我吧。我期待着你的归来。");
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