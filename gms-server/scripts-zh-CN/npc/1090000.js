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
/* Kyrin
	Pirate Job Advancement
	
	Custom Quest 100009, 100011
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "2ndjobT": false, "3thJobI": false, "3thJobC": false};
job = 510;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 5;

var advQuest = 0;

function start() {
    const GameConstants = Java.type('org.gms.constants.game.GameConstants');
    if (cm.isQuestStarted(6330)) {
        if (cm.getEventInstance() != null) {    // missing script for skill test found thanks to Jade™
            advQuest = 5;                       // string visibility thanks to iPunchEm & Glvelturall
            cm.sendNext("干得漂亮！我们去外面详细聊聊吧！");
        } else if (cm.getQuestProgressInt(6330, 6331) == 0) {
            advQuest = 1;
            cm.sendNext("你准备好了吗？接下来你必须在我的猛烈攻势下坚持生存2分钟。我可不会手下留情哦！祝你好运！");
        } else {
            advQuest = 3;
            cm.teachSkill(5121003, 0, 10, -1);
            cm.forceCompleteQuest(6330);

            cm.sendNext("恭喜你！你成功通过了我的考验。我现在传授你海盗的终极技能【#q5121003#】！\r\n\r\n  #s5121003#    #b#q5121003##k");
        }
    } else if (cm.isQuestStarted(6370)) {
        if (cm.getEventInstance() != null) {
            advQuest = 6;
            cm.sendNext("干得漂亮！我们去外面详细聊聊吧！");
        } else if (cm.getQuestProgressInt(6370, 6371) == 0) {
            advQuest = 2;
            cm.sendNext("你准备好了吗？接下来你必须在我的猛烈攻势下坚持生存2分钟。我可不会手下留情哦！祝你好运！");
        } else {
            advQuest = 4;
            cm.teachSkill(5221006, 0, 10, -1);
            cm.forceCompleteQuest(6370);

            cm.sendNext("恭喜你！你成功通过了我的考验。我现在传授你海盗的终极技能【#q5221006#】！\r\n\r\n  #s5221006#    #b#q5221006##k");
        }
    } else if (parseInt(cm.getJobId() / 100) == jobType && cm.canSpawnPlayerNpc(GameConstants.getHallOfFameMapid(cm.getJob()))) {
        spawnPnpc = true;

        var sendStr = "经历了漫长的冒险旅途，你终于拥有了今天的力量、智慧与勇气，不是吗？你想现在就在#r名人堂中留下你现在的角色形象NPC#k吗？";
        if (spawnPnpcFee > 0) {
            sendStr += " 我可以为你办理，费用是 #b" + cm.numberWithCommas(spawnPnpcFee) + " 金币#k。";
        }

        cm.sendYesNo(sendStr);
    } else {
        if (cm.getJobId() == 0) {
            actionx["1stJob"] = true;
            cm.sendNext("想要成为一名充满冒险精神的#r海盗#k吗？想要扬帆起航，必须满足基本条件……#b等级达到10级以上，且" + cm.getFirstJobStatRequirement(jobType) + "#k。让我来看看你的资质吧。");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 500) {
            actionx["2ndJob"] = true;
            if (cm.isQuestCompleted(2191) || cm.isQuestCompleted(2192)) {
                cm.sendNext("做得不错。看来你已经做好了向浩瀚大海迈出下一步的准备。");
            } else {
                cm.sendNext("你取得的进步令人惊叹。不知不觉中，你已经成长为一名身手矫健的海盗了。");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 5 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
            actionx["3thJobI"] = true;
            cm.sendNext("你来了。几天前，神秘岛的#b#p2020013##k跟我提起过你。听说你想进行海盗的三转。为了实现这个目标，我必须测试你的实力，看看你是否具备晋升的资格。在金银岛的一处洞穴深处有一处入口通往次元裂缝。进入后你将面对我的分身。你的任务是打败他，并带回#b#t4031059##k。");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("请击败分身，将#b#t4031059##k带给我。");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("干得好！你打败了我的分身，并安全带回了#b#t4031059##k。你战胜了我的分身，向我证明了你坚韧不拔的强大实力。现在你应该把这条项链交给在冰峰雪域长老板屋的#b#p2020013##k，去开启智慧的试炼吧。祝你好运！");
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
        if (advQuest > 0) {
            if (advQuest < 3) {
                var em = cm.getEventManager(advQuest == 1 ? "4jship" : "4jsuper");
                if (!em.startInstance(cm.getPlayer())) {
                    cm.sendOk("当前已有其他玩家正在挑战测试，请稍后再试。");
                }
            } else if (advQuest < 5) {
                if (advQuest == 3) {
                    cm.sendOk("【超级变身】类似于‘变身’，但威力要强大得多。继续刻苦训练吧，期待在海域上看到你的英姿！");
                } else {
                    cm.sendOk("与你之前作为海盗学到的大多数技能不同，这个技能非常独特——你可以亲自驾驶【金属战舰】轰击敌人！处于战舰上时，你的防御力和攻击力都会大幅提升。愿你成为名扬四海的顶尖神枪手！");
                }
            } else {
                if (advQuest < 6) {
                    cm.setQuestProgress(6330, 6331, 2);
                } else {
                    cm.setQuestProgress(6370, 6371, 2);
                }

                cm.warp(120000101);
            }

            cm.dispose();
        } else if (spawnPnpc) {
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
                cm.sendYesNo("哦……！你身上散发着渴望自由与冒险的气息，确实适合成为一名驰骋大海的海盗。那么，你准备好成为一名海盗了吗？");
            } else {
                cm.sendOk("请再去努力训练一下吧。等你达到基本要求后，我就可以引导你成为一名#r海盗#k。");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(2070000) && cm.canHoldAll([1482000, 1492000])) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(500);
                    cm.gainItem(1492000, 1);
                    cm.gainItem(1482000, 1);
                    cm.gainItem(2330000, 1000);
                    cm.resetStats();
                }
                cm.sendNext("很好，从现在开始，你就是我们海盗的一员了！扬帆起航，虽然大海上波涛汹涌、充满挑战，但只要无所畏惧，终将征服一切风浪。那么，虽然不多，但我会传授给你一些力量……喝啊啊啊！！");
            } else {
                cm.sendNext("请清理一下你的背包，然后再来找我。");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("你现在变得比以前更强了，并且所有背包栏的容量都增加了一行。自己打开背包看看吧。我还给了你一些 #b技能点数（SP）#k。点击屏幕左下角的 #b技能#k 菜单，就可以使用SP学习海盗技能。不过要注意：技能需要逐步提升，部分高阶技能需要先习得前置技能才能学习。");
        } else if (status == 3) {
            cm.sendNextPrev("另外提醒你一句：一旦做出了选择，就无法反悔或更改职业。去吧，成为一名乘风破浪的骄傲海盗！");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.isQuestCompleted(2191) || cm.isQuestCompleted(2192)) {
                cm.sendSimple("考虑好之后，请点击底部的[决定选择职业]。#b\r\n#L0#请为我说明拳手职业。\r\n#L1#请为我说明火枪手职业。\r\n#L3#我已经决定好要转职的职业！");
            } else {
                cm.sendNext("做得好。你看起来已经很出色了，但我必须测试你是否真的有实力完成二转。这并不是特别困难的测试，相信你一定能做好。");
            }
        } else if (status == 1) {
            if (!cm.isQuestCompleted(2191) && !cm.isQuestCompleted(2192)) {
                // Pirate works differently from the other jobs. It warps you directly in.
                actionx["2ndJobT"] = true;
                cm.sendYesNo("你准备好现在进入测试考场了吗？");
            } else {
                if (selection < 3) {
                    if (selection == 0) {    //brawler
                        cm.sendNext("精通#r拳套与近身格斗#k的海盗。\r\n\r\n#b拳手#k擅长近战肉搏与强力体术，拥有高生命值与凶猛的近战爆发力。可以使用技能#r百烈拳#k、#r回旋踢#k对敌人进行多段打击，还可以使用#r伪装术#k躲避危险。");
                    } else if (selection == 1) {    //gunslinger
                        cm.sendNext("精通#r火枪与射击技巧#k的海盗。\r\n\r\n#b火枪手#k擅长在远距离利用火枪进行高速连射。拥有出色的机动性与控制能力，可以使用#r后跃射击#k在空中后撤射击，还可以使用#r散射#k同时攻击多个敌人。");
                    }

                    status -= 2;
                } else {
                    cm.sendNextPrev("冒险的征程还很漫长，但成为一名真正的海盗定能助你实现梦想。牢记这份初心，你一定会成为伟大的传奇。");
                }
            }
        } else if (status == 2) {
            if (actionx["2ndJobT"]) {
                var map = 0;
                if (cm.isQuestStarted(2191)) {
                    map = 108000502;
                } else if (cm.isQuestStarted(2192)) {
                    map = 108000501;
                }
				if(map > 0){
	                if (cm.getPlayerCount(map) > 0) {
	                    cm.sendOk("所有测试考场目前均有玩家在使用中，请稍后再试。");
	                } else {
	                    cm.warp(map, 0);
	                }
				} else {
					cm.sendOk("你还没有接到转职任务！");
				}
				cm.dispose();
            } else {
                if (cm.isQuestCompleted(2191) && cm.isQuestCompleted(2192)) {
                    job = (Math.random() < 0.5) ? 510 : 520;
                } else if (cm.isQuestCompleted(2191)) {
                    job = 510;
                } else if (cm.isQuestCompleted(2192)) {
                    job = 520;
                }

                cm.sendYesNo("你决定要转职成为" + (job == 510 ? "#b拳手#k" : "#b火枪手#k") + "吗？一旦做出选择，将无法更改二转职业，确定吗？");
            }
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }

            if (job == 510) {
                cm.sendNext("很好，从现在起你就是一名#b拳手#k了！拳手凭借千锤百炼的强健体魄与凌厉双拳压制敌人。请坚持刻苦训练，我会一直注视着你的成长。");
            } else {
                cm.sendNext("很好，从现在起你就是一名#b火枪手#k了！火枪手凭借精准致命的射术与百步穿杨的枪法驰骋战场。请坚持刻苦训练，我会一直注视着你的成长。");
            }

            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("我刚才给了你二转技能书，同时你的背包空间和最大生命值、魔法值也都得到了提升。快去查看一下吧。");
        } else if (status == 5) {
            cm.sendNextPrev("我还给了你一些 #b技能点数（SP）#k。打开左下角的 #b技能菜单#k，就可以升级新的二转技能。请记住，某些强力技能需要先满足前置技能等级才能解锁。");
        } else if (status == 6) {
            cm.sendNextPrev("作为一名" + (job == 510 ? "拳手" : "火枪手") + "，你必须变得更加坚强。但请牢记，力量绝不能用来欺凌弱者，一定要将这份强大的力量用于正义。当你准备好追寻更高的境界时，再来找我吧。我期待着你的归来。");
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
