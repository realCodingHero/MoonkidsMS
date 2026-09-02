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
/*
* @Author: Moogra, XxOsirisxX
* @NPC:    2091005
* @Name:   So Gong
* @Map(s): Dojo Hall
*/

var disabled = false;
var belts = Array(1132000, 1132001, 1132002, 1132003, 1132004);
var belt_level = Array(25, 35, 45, 60, 75);

/* var belt_points = Array(200, 1800, 4000, 9200, 17000); */
var belt_points = Array(5, 45, 100, 230, 425); /* Watered down version */

var status = -1;
var selectedMenu = -1;

function start() {
    if (disabled) {
        cm.sendOk("师父吩咐现在道场暂时关闭，所以我不能让你进去。");
        cm.dispose();
        return;
    }

    if (isRestingSpot(cm.getPlayer().getMap().getId())) {
        var text = "真没想到你能走到这一步！不过接下来的挑战可没那么容易了。你还要继续挑战吗？\r\n\r\n#b#L0#我想继续挑战#l\r\n#L1#我想离开这里#l\r\n";

        const GameConstants = Java.type('org.gms.constants.game.GameConstants');
        if (!GameConstants.isDojoPartyArea(cm.getPlayer().getMapId())) {
            text += "#L2#我想记录当前的成绩#l";
        }
        cm.sendSimple(text);
    } else if (cm.getPlayer().getLevel() >= 25) {
        if (cm.getPlayer().getMap().getId() == 925020001) {
            cm.sendSimple("我的师父是武陵最强大的人，你想挑战他？好吧，但你以后可别后悔。\r\n#b#L0#我想独自挑战他。#l\r\n#L1#我想组队挑战他。#l\r\n#L2#我想领取腰带。#l\r\n#L3#我想重置我的修练点数。#l\r\n#L4#我想领取勋章。#l\r\n#L5#什么是武陵道场？#l#k");
        } else {
            cm.sendYesNo("怎么，你要放弃了吗？只要再升一级就可以了！你真的要放弃离开吗？");
        }
    } else {
        cm.sendOk("喂！你在嘲笑我师父吗？你以为你是谁，凭你也想挑战他？真可笑！你的等级至少要达到 #b25级#k 才能挑战。");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 925020001) {
        if (mode >= 0) {
            if (status == -1) {
                selectedMenu = selection;
            }
            status++; //there is no prev.
            if (selectedMenu == 0) { //I want to challenge him alone.
                if (!cm.getPlayer().hasEntered("dojang_Msg") && !cm.getPlayer().isFinishedDojoTutorial()) { //kind of hackish...
                    if (status == 0) {
                        cm.sendYesNo("喂！你！这是你第一次来吗？我师父可不是随便什么人都见的，他忙得很呢。看你这副样子，他肯定不会理你。哈！不过，今天算你走运……这样吧，如果你能打败我，我就引荐你去见我师父。怎么样？");
                    } else if (status == 1) {
                        if (mode == 0) {
                            cm.sendNext("哈哈！就你这点胆量，还想见我师父？\r\n还是回你该去的地方吧！");
                        } else {
                            if (cm.getClient().getChannelServer().getMapFactory().getMap(925020010).getCharacters().size() > 0) {
                                cm.sendOk("道场里已经有人在挑战了。");
                                cm.dispose();
                                return;
                            }
                            cm.warp(925020010, 0);
                            cm.getPlayer().finishDojoTutorial();
                        }
                        cm.dispose();
                    }
                } else if (cm.getPlayer().getDojoStage() > 0) {
                    if (status == 0) {
                        cm.sendYesNo("上次你独自挑战时，到达了第 " + cm.getPlayer().getDojoStage() + " 层。我现在可以直接送你过去。你想去吗？");
                    } else {
                        cm.warp(mode == 1 ? 925020000 + cm.getPlayer().getDojoStage() * 100 : 925020100, 0);
                        cm.dispose();
                    }
                } else {
                    for (var i = 1; i < 39; i++) { //only 32 stages, but 38 maps
                        if (cm.getClient().getChannelServer().getMapFactory().getMap(925020000 + 100 * i).getCharacters().size() > 0) {
                            cm.sendOk("道场里已经有人在挑战了。");
                            cm.dispose();
                            return;
                        }
                    }
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).resetReactors();
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).killAllMonsters();
                    cm.warp(925020100, 0);
                    cm.dispose();
                }
            } else if (selectedMenu == 1) { //I want to challenge him with a party.
                var party = cm.getPlayer().getParty();
                if (party == null) {
                    cm.sendNext("你想去哪？你又不是队长！去叫你们队长来和我说话。");
                    cm.dispose();
                    return;
                }
                var lowest = cm.getPlayer().getLevel();
                var highest = lowest;
                for (var x = 0; x < party.getMembers().size(); x++) {
                    var lvl = party.getMembers().get(x).getLevel();
                    if (lvl > highest) {
                        highest = lvl;
                    } else if (lvl < lowest) {
                        lowest = lvl;
                    }
                }
                var isBetween30 = highest - lowest < 30;
                if (party.getLeader().getId() != cm.getPlayer().getId()) {
                    cm.sendNext("你想去哪？你又不是队长！去叫你们队长来和我说话。");
                    cm.dispose();
                } else if (party.getMembers().size() == 1) {
                    cm.sendNext("你想一个人挑战吗？");
                } else if (!isBetween30) {
                    cm.sendNext("队伍成员的等级差距太大，无法进入。所有队员的等级差距不能超过 #r30级#k。");
                } else {
                    for (var i = 1; i < 39; i++) { //only 32 stages, but 38 maps
                        if (cm.getClient().getChannelServer().getMapFactory().getMap(925020000 + 100 * i).getCharacters().size() > 0) {
                            cm.sendOk("道场里已经有人在挑战了。");
                            cm.dispose();
                            return;
                        }
                    }
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).resetReactors();
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).killAllMonsters();
                    cm.warpParty(925020100);
                    cm.dispose();
                }
                cm.dispose();
            } else if (selectedMenu == 2) { //I want to receive a belt.
                if (mode < 1) {
                    cm.dispose();
                    return;
                }
                if (status == 0) {
                    var selStr = "你当前拥有 #b" + cm.getPlayer().getDojoPoints() + "#k 点修练点数。师父喜欢有才能的人。如果你获得了足够的修练点数，就能根据点数获得对应的腰带。\r\n";
                    for (var i = 0; i < belts.length; i++) {
                        if (cm.haveItemWithId(belts[i], true)) {
                            selStr += "\r\n     #i" + belts[i] + "# #t" + belts[i] + "#(已获得)";
                        } else {
                            selStr += "\r\n#L" + i + "##i" + belts[i] + "# #t" + belts[i] + "#l";
                        }
                    }
                    cm.sendSimple(selStr);
                } else if (status == 1) {
                    var belt = belts[selection];
                    var level = belt_level[selection];
                    var points = belt_points[selection];
                    if (cm.getPlayer().getDojoPoints() > points) {
                        if (cm.getPlayer().getLevel() > level) {
                            cm.gainItem(belt, 1);
                        } else {
                            cm.sendNext("想要获得 #i" + belt + "# #b#t" + belt + "#k，等级至少需要达到 #b" + level + "级#k，并且至少拥有 #b" + points + " 点修练点数#k。\r\n\r\n如果你想获得这条腰带，还需要 #r" + (points - cm.getPlayer().getDojoPoints()) + "#k 点修练点数。");
                        }
                    } else {
                        cm.sendNext("想要获得 #i" + belt + "# #b#t" + belt + "#k，等级至少需要达到 #b" + level + "级#k，并且至少拥有 #b" + points + " 点修练点数#k。\r\n\r\n如果你想获得这条腰带，还需要 #r" + (points - cm.getPlayer().getDojoPoints()) + "#k 点修练点数。");
                    }
                    cm.dispose();
                }
            } else if (selectedMenu == 3) { //I want to reset my training points.
                if (status == 0) {
                    cm.sendYesNo("你应该知道重置修练点数后，点数会归0对吧？不过这也不完全是坏事。重置后重新累积修练点数，就可以再次领取腰带。你确定现在要重置修练点数吗？");
                } else if (status == 1) {
                    if (mode == 0) {
                        cm.sendNext("你需要冷静一下吗？深呼吸调整好后再来找我吧。");
                    } else {
                        cm.getPlayer().setDojoPoints(0);
                        cm.sendNext("好了！你所有的修练点数都已重置。把它当作一个全新的开始，继续加油修练吧！");
                    }
                    cm.dispose();
                }
            } else if (selectedMenu == 4) { //I want to receive a medal.
                if (status == 0 && cm.getPlayer().getVanquisherStage() <= 0) {
                    cm.sendYesNo("你还没有尝试过挑战勋章吗？如果在武陵道场击败某种怪物 #b100次#k，就可以获得 #b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "#k 称号勋章。看起来你还没有获得 #b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "#k……你想挑战 #b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "#k 吗？");
                } else if (status == 1 || cm.getPlayer().getVanquisherStage() > 0) {
                    if (mode == 0) {
                        cm.sendNext("如果不想挑战的话也没关系。");
                        cm.dispose();
                    } else {
                        if (cm.getPlayer().getDojoStage() > 37) {
                            cm.sendNext("你已经完成了所有的勋章挑战！");
                        } else if (cm.getPlayer().getVanquisherKills() < 100 && cm.getPlayer().getVanquisherStage() > 0) {
                            cm.sendNext("你还需要击败 #b" + (100 - cm.getPlayer().getVanquisherKills()) + " 只#k 怪物才能获得 #b#t" + (1142032 + cm.getPlayer().getVanquisherStage()) + "#k。请继续加油。顺便提醒一下，只有在武陵道场由我师父召唤出来的怪物才算数哦。还有，打完怪之后可别直接退场！#r如果击败怪物后没有进入下一层，是不会计入胜利次数的#k。");
                        } else if (cm.getPlayer().getVanquisherStage() <= 0) {
                            cm.getPlayer().setVanquisherStage(1);
                        } else {
                            cm.sendNext("恭喜你获得了 #b#t" + (1142032 + cm.getPlayer().getVanquisherStage()) + "#k！");
                            cm.gainItem(1142033 + cm.getPlayer().getVanquisherStage(), 1);
                            cm.getPlayer().setVanquisherStage(cm.c.getPlayer().getVanquisherStage() + 1);
                            cm.getPlayer().setVanquisherKills(0);
                        }
                    }
                    cm.dispose();
                }
            } else if (selectedMenu == 5) { //What is a Mu Lung Dojo?
                cm.sendNext("我师父是武陵最强大的人。他建造了这座叫做武陵道场的建筑，共有38层！你可以在每一层磨练自己。当然，以你现在的水平想登上顶层可不容易。");
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    } else if (isRestingSpot(cm.getPlayer().getMap().getId())) {
        if (selectedMenu == -1) {
            selectedMenu = selection;
        }
        status++;
        if (selectedMenu == 0) {
            cm.warp(cm.getPlayer().getMap().getId() + 100, 0);
            cm.dispose();
        } else if (selectedMenu == 1) { //I want to leave
            if (status == 0) {
                cm.sendAcceptDecline("怎么，你要放弃了吗？真的要离开这里吗？");
            } else {
                if (mode == 1) {
                    cm.warp(925020002, "st00");
                }
                cm.dispose();
            }
        } else if (selectedMenu == 2) { //I want to record my score up to this point
            if (status == 0) {
                cm.sendYesNo("如果记录下当前层数，下次就可以直接从这里继续挑战。很方便吧？你想记录当前的挑战进度吗？");
            } else {
                if (mode == 0) {
                    cm.sendNext("你觉得自己还能更上一层楼？那就祝你好运！");
                } else if (925020000 + cm.getPlayer().getDojoStage() * 100 == cm.getMapId()) {
                    cm.sendOk("你的挑战进度已经记录下来了。下次挑战道场时，可以直接回到这里。");
                } else {
                    cm.sendNext("我已经记录下了你的进度。下次再来时告诉我，就可以从这里继续挑战了。");
                    cm.getPlayer().setDojoStage((cm.getMapId() - 925020000) / 100);
                }
                cm.dispose();
            }
        }
    } else {
        if (mode == 0) {
            cm.sendNext("别总是犹豫不决！一会儿你肯定会哭着求我送你回来的。");
        } else if (mode == 1) {
            cm.warp(925020002, 0);
            cm.getPlayer().message("请拿定主意后再做决定。");
        }
        cm.dispose();
    }
}

function isRestingSpot(id) {
    return (id / 100 - 9250200) % 6 == 0;
}
