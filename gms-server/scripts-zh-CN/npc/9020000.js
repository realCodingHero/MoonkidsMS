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
 * @npc: Lakelis
 * @map: 103000000 - Kerning City
 * @func: Kerning PQ
 */

var status = 0;
var state;
var em = null;

function start() {
    status = -1;
    state = (cm.getMapId() >= 103000800 && cm.getMapId() <= 103000805) ? 1 : 0;
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
            if (state == 1) {
                cm.sendYesNo("你想放弃任务并离开这个区域吗？");
            } else {
                em = cm.getEventManager("KerningPQ");
                if (em == null) {
                    cm.sendOk("废弃都市组队任务初始化异常。");
                    cm.dispose();
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<组队任务：废弃都市（第一次同行）>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n想和你的队员们一起接受挑战吗？在这里，你们将面临各种谜题与重重阻碍，只有齐心协力才能顺利通关。如果你想尝试，请让你们的#b队长#k来和我对话。#b\r\n#L0#我想参加废弃都市组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "关闭" : "开启") + "组队邀请搜索。\r\n#L2#我想听听任务说明。");
            }
        } else if (status == 1) {
            if (state == 1) {
                cm.warp(103000000);
                cm.dispose();
            } else {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("只有在组队状态下才能参加入场挑战。");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("请让你们的#b队长#k来找我对话以开始任务。");
                        cm.dispose();
                    } else {
                        var eli = em.getEligibleParty(cm.getParty());
                        if (eli.size() > 0) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("当前频道的#r废弃都市组队任务#k已有其他队伍正在进行。请尝试更换频道，或稍后再试。");
                            }
                        } else {
                            cm.sendOk("你的队伍目前无法开始任务。请确保所有队员都在当前地图，且队伍人数和等级均符合要求。如果队伍缺少成员，可以尝试开启组队搜索功能。");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("你的组队搜索状态现在已设置为：#b" + (psState ? "开启" : "关闭") + "#k。如需更改设置随时来找我。");
                    cm.dispose();
                } else {
                    cm.sendOk("#e#b<组队任务：废弃都市（第一次同行）>#k#n\r\n在这个组队任务中，你们需要团队协作解开各个阶段的谜题与数学机关，收集足够的通行证以进入下一阶段。最后在终点消灭巨型绿水灵（沼泽巨怪）获取丰厚的通关奖励与额外奖励地图机会！祝你们好运！");
                    cm.dispose();
                }
            }
        }
    }
}