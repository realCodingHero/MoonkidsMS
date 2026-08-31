/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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
 * @npc: Mark of the Squad
 * @map: Cave of Life - Cave Entrance (240050000)
 * @func: Horntail PQ
 */

var status = 0;
var price = 100000;
var em = null;
var hasPass;

function isRecruitingMap(mapid) {
    return mapid == 240050000;
}

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

        if (isRecruitingMap(cm.getMapId())) {
            if (status == 0) {
                em = cm.getEventManager("HorntailPQ");
                if (em == null) {
                    cm.sendOk("暗黑龙王洞穴发生了一个错误。");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<组队任务：暗黑龙王试炼场>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n这是通往暗黑龙王巢穴的必经之路。如果你想面对它，你和你的队伍必须先通过前方的试炼场。#b\r\n#L0#开始挑战试炼场。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "关闭" : "开启") + "组队寻找。\r\n#L2#我想了解详细信息。#l#k");
            } else if (status == 1) {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("只有加入组队后，才能参加组队任务。");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("只有队长与我交谈才能开始这个组队任务。");
                        cm.dispose();
                    } else {
                        var eli = em.getEligibleParty(cm.getParty());
                        if (eli.size() > 0) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("另一个队伍已经进入了该频道的#r组队任务#k。请尝试其他频道，或者等待当前队伍完成。");
                            }
                        } else {
                            cm.sendOk("你队伍中的某些成员不符合进入条件，或者队伍人数不符。请调整后再来找我！");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("你的组队搜索状态现在是：#b" + (psState ? "已开启" : "已关闭") + "#k。想要更改状态时可以随时找我。");
                    cm.dispose();
                } else {
                    cm.sendOk("#e#b<组队任务：暗黑龙王试炼场>#k#n\r\n作为暗黑龙王巢穴的守门人，我只允许具备资格的勇士进入。即使获得了进入资格，内部的道路也如同迷宫一般布满了重重考验与危险。只有默契配合的团队，才有可能最终站在暗黑龙王的面前！");
                    cm.dispose();
                }
            }
        } else {
            if (!cm.isEventLeader()) {
                cm.sendOk("只有你的队长才能进行操作。");
            } else if (cm.getMapId() == 240050100) {
                if (cm.haveItem(4001087) && cm.haveItem(4001088) && cm.haveItem(4001089) && cm.haveItem(4001090) && cm.haveItem(4001091)) {
                    cm.gainItem(4001087, -1);
                    cm.gainItem(4001088, -1);
                    cm.gainItem(4001089, -1);
                    cm.gainItem(4001090, -1);
                    cm.gainItem(4001091, -1);

                    cm.getEventInstance().warpEventTeam(240050200);
                } else {
                    cm.sendOk("你没有集齐所有进入下一阶段所需的钥匙。");
                }
            } else if (cm.getMapId() == 240050300) {
                if (cm.haveItem(4001092, 1) && cm.haveItem(4001093, 6)) {
                    cm.gainItem(4001092, -1);
                    cm.gainItem(4001093, -6);
                    cm.getEventInstance().clearPQ();
                } else {
                    cm.sendOk("请检查一下是否已经收集齐了6把红色钥匙和1把蓝色钥匙。");
                }
            } else if (cm.getMapId() == 240050310) {
                if (cm.haveItem(4001092, 1) && cm.haveItem(4001093, 6)) {
                    cm.gainItem(4001092, -1);
                    cm.gainItem(4001093, -6);
                    cm.getEventInstance().clearPQ();
                } else {
                    cm.sendOk("请检查一下是否已经收集齐了6把红色钥匙和1把蓝色钥匙。");
                }
            }

            cm.dispose();
        }
    }
}
