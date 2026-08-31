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
@       Author : Ronan
@
@	NPC = Amos (PQ)
@	Map = AmoriaPQ maps
@	Function = AmoriaPQ Host
@
@	Description: Last stages of the Amorian Challenge
*/

var debug = false;
var status = 0;
var curMap, stage;

function isAllGatesOpen() {
    var map = cm.getPlayer().getMap();

    for (var i = 0; i < 7; i++) {
        var gate = map.getReactorByName("gate0" + i);
        if (gate.getState() != 4) {
            return false;
        }
    }

    return true;
}

function clearStage(stage, eim, curMap) {
    eim.setProperty(stage + "stageclear", "true");

    eim.showClearEffect(true);
    eim.linkToNextStage(stage, "apq", curMap);  //opens the portal to the next map
}

function start() {
    curMap = cm.getMapId();
    stage = Math.floor((curMap - 670010200) / 100) + 1;

    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else if (mode == 0) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        var eim = cm.getPlayer().getEventInstance();
        if (eim.getProperty(stage.toString() + "stageclear") != null) {
            if (stage < 5) {
                cm.sendNext("传送门已经打开，前往那里迎接接下来的考验吧！");
            } else if (stage == 5) {
                eim.warpEventTeamToMapSpawnPoint(670010700, 0);
            } else {
                if (cm.isEventLeader()) {
                    if (eim.getIntProperty("marriedGroup") == 0) {
                        eim.restartEventTimer(1 * 60 * 1000);
                        eim.warpEventTeam(670010800);
                    } else {
                        eim.setIntProperty("marriedGroup", 0);

                        eim.restartEventTimer(2 * 60 * 1000);
                        eim.warpEventTeamToMapSpawnPoint(670010750, 1);
                    }
                } else {
                    cm.sendNext("请等待队长与我对话以开启奖励关卡。");
                }
            }
        } else {
            if (stage != 6) {
                if (eim.isEventLeader(cm.getPlayer())) {
                    var state = eim.getIntProperty("statusStg" + stage);

                    if (state == -1) {           // preamble
                        if (stage == 4) {
                            cm.sendOk("你好！欢迎来到阿莫利亚挑战的第 #b" + stage + " 阶段#k。请击败这里的怪物，收集 #b50 个 #t4031597##k 交给我。");
                        } else if (stage == 5) {
                            cm.sendOk("你好！欢迎来到阿莫利亚挑战的第 #b" + stage + " 阶段#k。一口气跑到这里可真不容易！这一关的目标是生存与集合！首先请确保所有存活的队员都安全抵达这里，然后再去挑战最终首领。");
                        }

                        var st = (debug) ? 2 : 0;
                        eim.setProperty("statusStg" + stage, st);
                    } else {       // check stage completion
                        if (stage == 4) {
                            if (cm.haveItem(4031597, 50)) {
                                cm.gainItem(4031597, -50);

                                var tl = eim.getTimeLeft();
                                if (tl >= 5 * 60 * 1000) {
                                    eim.setProperty("timeLeft", tl.toString());
                                    eim.restartEventTimer(4 * 60 * 1000);
                                }

                                cm.sendNext("干得漂亮！我现在就为你们打开通往下个区域的大门。");
                                cm.mapMessage(5, "艾莫斯：时间紧迫！你们的目标是打开沿途的机关门，并在下一张地图的终点处全员集合。祝大家好运！");
                                clearStage(stage, eim, curMap);
                            } else {
                                cm.sendNext("嗯？你没听清楚吗？我需要 #r50 个 #t4031597##k 才能通过这次试炼。");
                            }

                        } else if (stage == 5) {
                            var pass = true;

                            if (eim.isEventTeamTogether()) {
                                var party = cm.getEventInstance().getPlayers();
                                var area = cm.getMap().getArea(2);

                                for (var i = 0; i < party.size(); i++) {
                                    var chr = party.get(i);

                                    if (chr.isAlive() && !area.contains(chr.getPosition())) {
                                        pass = false;
                                        break;
                                    }
                                }
                            } else {
                                pass = false;
                            }

                            if (pass) {
                                if (isAllGatesOpen()) {
                                    var tl = eim.getProperty("timeLeft");
                                    if (tl != null) {
                                        var tr = eim.getTimeLeft();

                                        var tl = parseFloat(tl);
                                        eim.restartEventTimer(tl - (4 * 60 * 1000 - tr));
                                    }

                                    cm.sendNext("太棒了，所有队员都已安全集合！当你们做好与 #r幽灵巴洛古（Geist Balrog）#k 决一死战的准备时，再来和我对话。");

                                    cm.mapMessage(5, "艾莫斯：现在只剩下最后的首领战了！进入后，请在做好万全准备后再与我对话，届时将被立即传送到战斗区域！");
                                    clearStage(stage, eim, curMap);
                                } else {
                                    cm.sendNext("你们是直接瞬移过来的吧？所有的机关门都必须依次开启才能通过这一阶段。如果时间还够，赶紧回头去把所有机关门打开吧！");
                                }
                            } else {
                                cm.sendNext("你的队伍成员还没有全部在此集合。再给他们一点时间赶过来吧。");
                            }
                        }
                    }
                } else {
                    cm.sendNext("请让你们的 #b队长#k 前来与我对话。");
                }
            } else {
                var area = cm.getMap().getArea(0);
                if (area.contains(cm.getPlayer().getPosition())) {
                    if (cm.getPlayer().isAlive()) {
                        cm.warp(670010700, "st01");
                    } else {
                        cm.sendNext("喂喂……你已经阵亡了，无法进入战斗区域。");
                    }
                } else {
                    if (cm.isEventLeader()) {
                        if (cm.haveItem(4031594, 1)) {
                            cm.gainItem(4031594, -1);
                            cm.sendNext("恭喜你们！队伍成功击败了幽灵巴洛古，#b圆满通关了阿莫利亚挑战#k！再次与我对话即可进入奖励关卡！");

                            clearStage(stage, eim, curMap);
                            eim.clearPQ();
                        } else {
                            cm.sendNext("战况如何？你们拿到 #b#t4031594##k 了吗？这是最后的试炼，加油坚持住！");
                        }
                    } else {
                        cm.sendNext("请让你们的 #b队长#k 前来与我对话。");
                    }
                }
            }
        }

        cm.dispose();
    }
}