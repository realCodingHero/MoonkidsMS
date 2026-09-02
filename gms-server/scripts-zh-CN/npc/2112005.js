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

/**
 * @author: Ronan
 * @npc: Juliet
 * @func: MagatiaPQ area NPC
 */

var status;

function start() {
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

        var eim = cm.getEventInstance();

        if (!eim.isEventCleared()) {
            if (status == 0) {
                if (eim.getIntProperty("npcShocked") == 0 && cm.haveItem(4001130, 1)) {
                    cm.gainItem(4001130, -1);
                    eim.setIntProperty("npcShocked", 1);

                    cm.sendNext("咦？你递给我一封信？这种时候送来的会是什么……啊！天哪，出大事了！大家快集中过来，从现在开始，情况会变得极其严峻！");
                    eim.dropMessage(6, "朱丽叶读完罗密欧的信后显得非常震惊。");

                    cm.dispose();

                } else if (eim.getIntProperty("statusStg4") == 1) {
                    var door = cm.getMap().getReactorByName("jnr3_out3");

                    if (door.getState() == 0) {
                        cm.sendNext("让我为你打开大门。");
                        door.hitReactor(cm.getClient());
                    } else {
                        cm.sendNext("请快一点，罗密欧现在很危险！");
                    }

                    cm.dispose();

                } else if (cm.haveItem(4001134, 1) && cm.haveItem(4001135, 1)) {
                    if (cm.isEventLeader()) {
                        cm.gainItem(4001134, -1);
                        cm.gainItem(4001135, -1);
                        cm.sendNext("太好了！你找到了蒙特鸠与卡帕莱特的研究文件。现在我们可以继续前进了。");

                        eim.showClearEffect();
                        eim.giveEventPlayersStageReward(4);
                        eim.setIntProperty("statusStg4", 1);

                        cm.getMap().killAllMonsters();
                        cm.getMap().getReactorByName("jnr3_out3").hitReactor(cm.getClient());
                    } else {
                        cm.sendOk("请让你们的队长把文件交给我。");
                    }

                    cm.dispose();

                } else {
                    cm.sendYesNo("为了拯救罗密欧，我们必须继续前进。如果你感觉状态不佳无法继续，大家都能理解……那么，你现在打算离开吗？");
                }
            } else {
                cm.warp(926110700, 0);
                cm.dispose();
            }
        } else {
            if (status == 0) {
                if (eim.getIntProperty("escortFail") == 0) {
                    cm.sendNext("太好了，罗密欧终于安全了！多亏了大家的英勇奋战，我们才成功将他从犹泰的魔爪中解救出来。犹泰将为他背叛玛加提亚的罪行接受审判。之后他会接受看管与治疗，我们会密切监视他，确保他以后不再惹事生非。");
                } else {
                    cm.sendNext("罗密欧现在安全了，虽然在战斗中受了些伤……多亏了大家的奋力救援，我们才能将他从犹泰的魔爪中解救出来。犹泰将因背叛玛加提亚而接受审判。真诚地感谢大家。");
                    status = 2;
                }
            } else if (status == 1) {
                cm.sendNext("请收下这份礼物，作为我们对你的由衷感谢。");
            } else if (status == 2) {
                if (cm.canHold(4001160)) {
                    cm.gainItem(4001160, 1);

                    if (eim.getIntProperty("normalClear") == 1) {
                        cm.warp(926110600, 0);
                    } else {
                        cm.warp(926110500, 0);
                    }
                } else {
                    cm.sendOk("请检查背包的其它栏是否有足够的空位。");
                }

                cm.dispose();
            } else {
                cm.warp(926110600, 0);
                cm.dispose();
            }
        }
    }
}
