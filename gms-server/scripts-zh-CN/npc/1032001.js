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
/* Grendel the Really Old
	Magician Job Advancement
	Victoria Road : Magic Library (101000003)

	Custom Quest 100006, 100008, 100100, 100101
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "3thJobI": false, "3thJobC": false};
job = 210;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 2;

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
            cm.sendNext("想要成为一名#r魔法师#k吗？想要参透魔法的奥秘，必须满足基本条件……#b等级达到8级以上，且" + cm.getFirstJobStatRequirement(jobType) + "#k。让我来看看你的资质吧。");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 200) {
            actionx["2ndJob"] = true;
            if (cm.haveItem(4031012)) {
                cm.sendNext("做得不错。看来你已经做好了向更广阔的魔法世界迈出下一步的准备。");
            } else if (cm.haveItem(4031009)) {
                cm.sendOk("去找魔法师二转转职教官#b#p1072001#k吧。");
                cm.dispose();
            } else {
                cm.sendNext("你取得的进步令人惊叹。不知不觉中，你已经成长为一名优秀的魔法师了。");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 2 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
            actionx["3thJobI"] = true;
            cm.sendNext("你来了。几天前，神秘岛的#b#p2020009#k跟我提起过你。听说你想进行魔法师的三转。为了实现这个目标，我必须测试你的实力，看看你是否具备晋升的资格。在金银岛的邪恶森林深处有一处入口通往次元裂缝。进入后你将面对我的分身。你的任务是打败他，并带回#b#t4031059#k。");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("请击败邪恶森林次元裂缝中的分身，带回#b#t4031059#k给我。");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("干得好！你打败了我的分身，并安全带回了#b#t4031059#k。你战胜了我的分身，向我证明了你坚韧不拔的强大实力。现在你应该把这条项链交给在冰峰雪域长老板屋的#b#p2020009#k，去开启智慧的试炼吧。祝你好运！");
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
    } else if (mode == 0 && type == 0) {
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
            if (mode != 1 || status == 7 || (actionx["1stJob"] && status == 4) || (cm.haveItem(4031008) && status == 2) || (actionx["3thJobI"] && status == 1)) {
                if (mode == 0 && status == 2 && type == 1) {
                    cm.sendOk("你知道没有其他选择……");
                }
                if (!(mode == 0 && type == 0)) {
                    cm.dispose();
                    return;
                }
            }
        }
    }

    if (actionx["1stJob"]) {
        if (status == 0) {
            if (cm.getLevel() >= 8 && cm.canGetFirstJob(jobType)) {
                cm.sendYesNo("哦……！你身上散发着不寻常的魔力潜质。那么，你准备好成为一名掌握自然元素的魔法师了吗？");
            } else {
                cm.sendOk("请再去努力训练一下吧。等你达到基本要求后，我就可以引导你成为一名#r魔法师#k。");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(1372043)) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(200);
                    cm.gainItem(1372043, 1);
                    cm.resetStats();
                }
                cm.sendNext("很好，从现在开始，你就是我们魔法师的一员了！虽然魔法的修行之路艰辛漫长，但只要坚持下去，你一定会掌握无上的智慧与力量。那么，虽然不多，但我会传授给你一些魔力……喝啊啊啊！！");
            } else {
                cm.sendNext("请清理一下你的背包，然后再来找我。");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("你现在变得比以前更强了，并且所有背包栏的容量都增加了一行。自己打开背包看看吧。我还给了你一些 #b技能点数（SP）#k。点击屏幕左下角的 #b技能#k 菜单，就可以使用SP学习魔法技能。不过要注意：技能需要逐步提升，部分高阶技能需要先习得前置技能才能学习。");
        } else if (status == 3) {
            cm.sendNextPrev("不过请记住，光有技能还不够。作为一名魔法师，属性点的分配至关重要。魔法师的主属性是智力（INT），副属性是运气（LUK）。如果不确定如何分配，可以使用#b自动分配#k。");
        } else if (status == 4) {
            cm.sendNextPrev("另外提醒你一句：今后在战斗中如果不幸阵亡，将会损失一部分当前经验值。魔法师的体质相对较弱，血量偏低，一定要格外小心！");
        } else if (status == 5) {
            cm.sendNextPrev("这就是我能教给你的一切了。祝你在冒险旅途中一切顺利，年轻的魔法师！");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.haveItem(4031012)) {
                cm.sendSimple("考虑好之后，请点击底部的[决定选择职业]。#b\r\n#L0#请为我说明巫师（火/毒）职业。\r\n#L1#请为我说明巫师（冰/雷）职业。\r\n#L2#请为我说明牧师职业。\r\n#L3#我已经决定好要转职的职业！");
            } else {
                cm.sendNext("做得好。你看起来已经很出色了，但我必须测试你是否真的有实力完成二转。这并不是特别困难的测试，相信你一定能做好。先收下我的推荐信……千万不要弄丢了！");
                if (!cm.isQuestStarted(100006)) {
                    cm.startQuest(100006);
                }
            }
        } else if (status == 1) {
            if (!cm.haveItem(4031012)) {
                if (cm.canHold(4031009)) {
                    if (!cm.haveItem(4031009)) {
                        cm.gainItem(4031009, 1);
                    }
                    cm.sendNextPrev("请将这封推荐信交给魔法密林附近的#b#p1072001#k（位于#b#m101020000#k）。他是魔法师二转转职教官。把信交给这位魔法师，他会负责主持你的转职测试。祝你好运！");
                } else {
                    cm.sendNext("请在你的背包中留出足够的空位。");
                    cm.dispose();
                }
            } else {
                if (selection < 3) {
                    if (selection == 0) {
                        cm.sendNext("掌握#r火焰与剧毒魔法#k的巫师。\r\n\r\n#b巫师（火/毒）#k擅长操控火与毒属性的魔法攻击，能对惧怕火毒属性的敌人造成毁灭性打击。通过#r精神力#k和#r缓速术#k等辅助技能，可以大幅提升魔法攻击力并减缓敌人速度。核心技能为强力的火焰箭与剧毒术。");    //f/p mage
                    } else if (selection == 1) {
                        cm.sendNext("掌握#r寒冰与雷电魔法#k的巫师。\r\n\r\n#b巫师（冰/雷）#k擅长操控冰与雷属性的魔法攻击，能对惧怕冰雷属性的敌人造成巨大伤害。冰系技能可以冻结控制敌人，雷系技能可以对群体敌人进行雷电轰击。此外还可以使用#r精神力#k和#r缓速术#k等实用技能。");    //i/l mage
                    } else {
                        cm.sendNext("掌握#r神圣魔法#k的圣职者。\r\n\r\n#b牧师#k是极受欢迎的团队支援职业。他们拥有#r群体治愈#k技能，可以为自己和队友恢复生命值；还可以施展#r神圣之光#k和#r祝福#k等技能增强防御与属性。在面对不死系和恶魔系怪物时，牧师的圣属性攻击格外致命。");    //cleric
                    }

                    status -= 2;
                } else {
                    cm.sendSimple("现在... 你决定好了吗？请选择你想要在二转时选择的职业：#b\r\n#L0#巫师（火/毒）\r\n#L1#巫师（冰/雷）\r\n#L2#牧师");
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031009)) {
                cm.dispose();
                return;
            }
            job += selection * 10;
            cm.sendYesNo("你决定要转职成为" + getJobName() + "吗？一旦做出选择，将无法更改二转职业，确定吗？");
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }
            cm.completeQuest(100008);
            cm.sendNext("很好，从现在起你就是一名#b" + getJobName() + "#k了！魔法师拥有不可思议的智慧与精神力量，能够洞悉怪物的弱点并用奥术予以惩戒。请坚持刻苦训练，我会一直注视着你的成长。");
            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("我刚才给了你二转技能书，同时你的背包空间和最大生命值、魔法值也都得到了提升。快去查看一下吧。");
        } else if (status == 5) {
            cm.sendNextPrev("我还给了你一些 #b技能点数（SP）#k。打开左下角的 #b技能菜单#k，就可以升级新的二转技能。请记住，某些强力技能需要先满足前置技能等级才能解锁。");
        } else if (status == 6) {
            cm.sendNextPrev(getJobName() + "需要继续变强！但若将自身的力量发泄在弱者身上，这并不是正确的方法。将自己所拥有的力量用在正义之事上，这是比单纯追求强大更重要的课题。好了，相信通过不断修炼，过不了多久我们就会再次相见，我期待着那一天的到来！");
        }
    } else if (actionx["3thJobI"]) {
        if (status == 0) {
            if (cm.getPlayer().gotPartyQuestItem("JB3")) {
                cm.getPlayer().removePartyQuestItem("JB3");
                cm.getPlayer().removePartyQuestItem("JB3");
                cm.getPlayer().setPartyQuestItemObtained("JBP");
            }
            cm.sendNextPrev("既然是我的分身，实力自然非同小可，你将面临一场恶战。分身拥有许多强力且特殊的攻击技能，你必须依靠自己的力量一对一将其战胜。另外在次元空间中存在时间限制，你必须在时限内解决战斗。祝你好运，期待你带回#b#t4031059#k。");
        }
    } else if (actionx["3thJobC"]) {
        cm.getPlayer().removePartyQuestItem("JBP");
        cm.gainItem(4031059, -1);
        cm.gainItem(4031057, 1);
        cm.dispose();
    }
}

function getJobName() {
    return job == 210 ? "#b巫师（火/毒）#k" : (job == 220 ? "#b巫师（冰/雷）#k" : "#b牧师#k");
}