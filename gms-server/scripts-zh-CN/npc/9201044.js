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
@	Description: Used to find the combo to unlock the next door. Players stand on 5 different crates to guess the combo.
*/

var debug = false;
var autopass = false;

function spawnMobs(maxSpawn) {
    var spawnPosX;
    var spawnPosY;

    var mapObj = cm.getMap();
    const LifeFactory = Java.type('org.gms.server.life.LifeFactory');
    const Point = Java.type('java.awt.Point');
    if (stage == 2) {
        spawnPosX = [619, 299, 47, -140, -471];
        spawnPosY = [-840, -840, -840, -840, -840];

        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 2; j++) {
                var mobObj1 = LifeFactory.getMonster(9400515);
                var mobObj2 = LifeFactory.getMonster(9400516);
                var mobObj3 = LifeFactory.getMonster(9400517);

                mapObj.spawnMonsterOnGroundBelow(mobObj1, new Point(spawnPosX[i], spawnPosY[i]));
                mapObj.spawnMonsterOnGroundBelow(mobObj2, new Point(spawnPosX[i], spawnPosY[i]));
                mapObj.spawnMonsterOnGroundBelow(mobObj3, new Point(spawnPosX[i], spawnPosY[i]));
            }
        }
    } else {
        spawnPosX = [2303, 1832, 1656, 1379, 1171];
        spawnPosY = [240, 150, 300, 150, 240];

        for (var i = 0; i < maxSpawn; i++) {
            var rndMob = 9400519 + Math.floor(Math.random() * 4);
            var rndPos = Math.floor(Math.random() * 5);

            var mobObj = LifeFactory.getMonster(rndMob);
            mapObj.spawnMonsterOnGroundBelow(mobObj, new Point(spawnPosX[rndPos], spawnPosY[rndPos]));
        }
    }
}

function generateCombo1() {
    var positions = Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var rndPicked = Math.floor(Math.random() * Math.pow(3, 5));

    while (rndPicked > 0) {
        (positions[rndPicked % 3])++;

        rndPicked = Math.floor(rndPicked / 3);
    }

    var returnString = "";
    for (var i = 0; i < positions.length; i++) {
        returnString += positions[i];
        if (i != positions.length - 1) {
            returnString += ",";
        }
    }

    return returnString;
}

function generateCombo2() {
    var toPick = 5, rndPicked;
    var positions = Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    while (toPick > 0) {
        rndPicked = Math.floor(Math.random() * 9);

        if (positions[rndPicked] == 0) {
            positions[rndPicked] = 1;
            toPick--;
        }
    }

    var returnString = "";
    for (var i = 0; i < positions.length; i++) {
        returnString += positions[i];
        if (i != positions.length - 1) {
            returnString += ",";
        }
    }

    return returnString;
}

var status = 0;
var curMap, stage;

function clearStage(stage, eim, curMap) {
    eim.setProperty(stage + "stageclear", "true");
    if (stage > 1) {
        eim.showClearEffect(true);
        eim.linkToNextStage(stage, "apq", curMap);  //opens the portal to the next map
    } else {
        cm.getMap().getPortal("go01").setPortalState(false);

        var val = Math.floor(Math.random() * 3);
        eim.showClearEffect(670010200, "gate" + val, 2);

        cm.getMap().getPortal("go0" + val).setPortalState(true);
        eim.linkPortalToScript(stage, "go0" + val, "apq0" + val, curMap);
    }
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
            cm.sendNext("通往下一阶段的传送门已经开启，请勇往直前，迎接接下来的考验吧！");
        } else {
            if (eim.isEventLeader(cm.getPlayer())) {
                var state = eim.getIntProperty("statusStg" + stage);

                if (state == -1) {           // preamble
                    if (stage == 1) {
                        cm.sendOk("你好！欢迎来到阿莫利亚挑战的第 #b" + stage + " 阶段#k。请先与 #p9201047# 对话了解此阶段的规则。打碎下方的魔镜收集碎片后交给 #p9201047#，再来找我开启下一阶段的大门。");
                    } else if (stage == 2) {
                        cm.sendOk("你好！欢迎来到阿莫利亚挑战的第 #b" + stage + " 阶段#k。请让队伍中的 5 名成员分别站上不同的绳子/平台，尝试出能够解锁大门的正确站位组合。站好后由队长与我对话确认。注意：如果多次尝试错误，将会召唤出怪物！");
                    } else if (stage == 3) {
                        cm.sendOk("你好！欢迎来到阿莫利亚挑战的第 #b" + stage + " 阶段#k。请让队伍中的 5 名成员分别站上 9 个平台中的 5 个，解出通往下一关的正确组合。站好后由队长与我对话确认。提示：尝试失败时，观察出现的绿水灵数量，那代表站对位置的人数！");
                    }

                    var st = (autopass) ? 2 : 0;
                    eim.setProperty("statusStg" + stage, st);
                } else {       // check stage completion
                    if (state == 2) {
                        eim.setProperty("statusStg" + stage, 1);
                        clearStage(stage, eim, curMap);
                        cm.dispose();
                        return;
                    }

                    var map = cm.getPlayer().getMap();
                    if (stage == 1) {
                        if (eim.getIntProperty("statusStg" + stage) == 1) {
                            clearStage(stage, eim, curMap);
                        } else {
                            cm.sendOk("请先与 #p9201047# 对话，了解该阶段的具体任务目标。");
                        }
                    } else if (stage == 2 || stage == 3) {
                        if (map.countMonsters() == 0) {
                            objset = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                            var playersOnCombo = 0;
                            var party = cm.getEventInstance().getPlayers();
                            for (var i = 0; i < party.size(); i++) {
                                for (var y = 0; y < map.getAreas().size(); y++) {
                                    if (map.getArea(y).contains(party.get(i).getPosition())) {
                                        playersOnCombo++;
                                        objset[y] += 1;
                                        break;
                                    }
                                }
                            }

                            if (playersOnCombo == 5/* || cm.getPlayer().gmLevel() > 1*/ || debug) {
                                var comboStr = eim.getProperty("stage" + stage + "combo");
                                if (comboStr == null || comboStr == "") {
                                    if (stage == 2) {
                                        comboStr = generateCombo1();
                                    } else {
                                        comboStr = generateCombo2();
                                    }

                                    eim.setProperty("stage" + stage + "combo", comboStr);
                                    if (debug) {
                                        print("generated " + comboStr + " for stg" + stage + "\n");
                                    }
                                }

                                var combo = comboStr.split(',');
                                var correctCombo = true;
                                var guessedRight = objset.length;
                                var playersRight = 0;

                                if (!debug) {
                                    for (i = 0; i < objset.length; i++) {
                                        if (parseInt(combo[i]) != objset[i]) {
                                            correctCombo = false;
                                            guessedRight--;
                                        } else {
                                            if (objset[i] > 0) {
                                                playersRight++;
                                            }
                                        }
                                    }
                                } else {
                                    for (i = 0; i < objset.length; i++) {
                                        var ci = cm.getPlayer().countItem(4000000 + i);

                                        if (ci != parseInt(combo[i])) {
                                            correctCombo = false;
                                            guessedRight--;
                                        } else {
                                            if (ci > 0) {
                                                playersRight++;
                                            }
                                        }
                                    }
                                }


                                if (correctCombo/* || cm.getPlayer().gmLevel() > 1*/) {
                                    eim.setProperty("statusStg" + stage, 1);
                                    clearStage(stage, eim, curMap);
                                    cm.dispose();
                                } else {
                                    var miss = eim.getIntProperty("missCount") + 1;
                                    var maxMiss = (stage == 2) ? 7 : 1;

                                    if (miss < maxMiss) {   //already implies stage 2
                                        eim.setIntProperty("missCount", miss);

                                        if (guessedRight == 6) { //6 unused slots on this stage
                                            cm.sendNext("所有绳子的重量与要求均不匹配。请重新调整站位后再试一次。");
                                            cm.mapMessage(5, "艾莫斯：嗯……所有绳子的重量都不正确。");
                                        } else {
                                            cm.sendNext("有一根绳子的重量是正确的！请分析目前的站位后再试一次。");
                                            cm.mapMessage(5, "艾莫斯：嗯……其中一根绳子的重量正确。");
                                        }
                                    } else {
                                        spawnMobs(playersRight);
                                        eim.setIntProperty("missCount", 0);
                                        if (stage == 2) {
                                            eim.setProperty("stage2combo", "");

                                            cm.sendNext("很遗憾，尝试次数已达上限，正确的站位组合已被重置。请清理怪物后重新开始解谜！");
                                            cm.mapMessage(5, "艾莫斯：未能解出正确组合，谜题已重置！请重新开始！");
                                        }
                                    }

                                    eim.showWrongEffect();
                                    cm.dispose();
                                }
                            } else {
                                if (stage == 2) {
                                    cm.sendNext("看来你们还没准备好。请让队伍中的 5 名成员分别站上绳子或平台。请确保正好有 5 个人站位，并且在确认时不要随意移动。继续加油！");
                                } else {
                                    cm.sendNext("看来你们还没准备好。请让队伍中的 5 名成员分别站上 9 个平台中的 5 个。请确保正好有 5 个人站位，并且在确认时不要随意移动。继续加油！");
                                }

                                cm.dispose();
                            }
                        } else {
                            cm.sendNext("在尝试解谜组合前，请先消灭地图中所有的怪物！");
                        }
                    }
                }
            } else {
                cm.sendNext("请让你们的 #b队长#k 前来与我对话。");
            }
        }

        cm.dispose();
    }
}