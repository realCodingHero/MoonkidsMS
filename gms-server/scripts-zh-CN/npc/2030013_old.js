/* 
 * This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* 
 * @Author Stereo, xQuasar, XkelvinchiaX (Kelvin) - For make it Fully Working.
 * 
 * Adobis - El Nath: Entrance to Zakum Altar (211042400)
 * 
 * Start of Zakum Bossfight
 */

var status;
var minLevel = 50;
var state;
var maxPlayers = 30;

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
        if (status == 0) {
            if ((cm.getPlayer().getLevel() < minLevel)) {
                cm.warp(211042300);
                cm.sendOk("请在你做好万全准备之后再来。以你现在的实力，这里还不是你该涉足的地方。");
                cm.dispose();
                return;
            }
            cm.sendSimple("挑战魔神扎昆的决战入口就在眼前。你想做什么？#b\r\n#L0#创建新的扎昆远征战局#l\r\n#L1#加入已创建的扎昆远征战局#l");
        } else if (status == 1) {
            state = selection;
            if (selection == 0) {
                cm.sendGetText("为了开启扎昆挑战，请为本次战斗副本设置一个专属房间名称（或密码）。其他想要参与本次战斗的队员需要输入相同的名称才能进入，请将该名称告知你的队员们。");
            } else if (selection == 1) {
                cm.sendGetText("若要加入已创建的扎昆远征战局，请输入对应的房间名称（密码）。如果不清楚名称，请向带领本次战斗的队长询问。");
            }

        } else if (status == 2) {
            var em = cm.getEventManager("ZakumBattle");
            var passwd = cm.getText();
            if (em == null) {
                cm.sendOk("这个试炼目前正在维护中。");
            } else {
                if (state == 0) { // Leader
                    if (getEimForString(em, passwd) != null) {
                        cm.sendOk("该房间名称（密码）已被占用，请换一个重试。");
                    } else { // start Zakum Battle
                        if (!em.startInstance(cm.getPlayer())) {
                            cm.sendOk("该副本中已经有一个队伍注册了。");
                        }

                        cm.dispose();
                        return;
                    }
                }
                if (state == 1) { // Member
                    var eim = getEimForString(em, passwd);
                    if (eim == null) {
                        cm.sendOk("当前没有以该名称注册的战斗。");
                    } else {
                        if (eim.getProperty("canEnter").toLowerCase() == "true") {
                            if (eim.getPlayers().size() < maxPlayers) {
                                eim.registerPlayer(cm.getPlayer());
                            } else {
                                cm.sendOk("对不起，这场战斗目前已经满员。请等待加入另一场战斗。");
                            }
                        } else {
                            cm.sendOk("对不起，这场战斗目前正在进行中。请稍后再来。");
                        }
                    }
                }
            }
            cm.dispose();
        }
    }
}

function getEimForString(em, name) {
    var stringId = "Zakum" + name;
    return em.getInstance(stringId);
}
