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
 * @npc: Wonky
 * @map: 200080101 - Orbis - The Unknown Tower
 * @func: Orbis PQ
 */

var status = 0;
var em = null;

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

        if (cm.getMapId() == 200080101) {
            if (status == 0) {
                em = cm.getEventManager("OrbisPQ");
                if (em == null) {
                    cm.sendOk("天空之城组队任务遇到了一个错误。");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<组队任务：女神之塔>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n你想要组建或加入一个团队来解开#b女神之塔#k的谜题吗？让你的#b队长#k与我交谈，或者自己组建一个队伍。#b\r\n#L0#我想参加组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "禁用" : "启用") + "组队搜索。\r\n#L2#我想了解更多细节。\r\n#L3#我想要领取奖励。");
            } else if (status == 1) {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("你必须先加入或组建一个队伍，才能参加组队任务。");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("你的队长必须与我交谈才能开始这个组队任务。");
                        cm.dispose();
                    } else {
                        var eli = em.getEligibleParty(cm.getParty());
                        if (eli.size() > 0) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("另一个队伍已经进入了该频道的#r组队任务#k。请尝试其他频道，或者等待当前队伍完成。");
                            }
                        } else {
                            cm.sendOk("你目前无法开始这个组队任务，因为你的队伍可能不符合人数要求，有些队员可能不符合进入条件，或者他们不在这张地图上。如果你找不到队员，可以尝试使用组队搜索功能。");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("你的组队搜索状态现在是：#b" + (psState ? "开启" : "关闭") + "#k。想要改变状态时随时来找我。");
                    cm.dispose();
                } else if (selection == 2) {
                    cm.sendOk("#e#b<女神之塔组队任务>#k#n\r\n我们的女神已经失踪了很久，有传言说她最后被目击是在女神之塔内。此外，我们的圣地已经被精灵们压倒性的力量所占领，这些生物最近一直在天空之城的边缘徘徊。它们的首领——远古精灵目前盘踞在那里，可能掌握着女神的下落！因此我们迫切需要一支勇敢的冒险家队伍，冲进去夺回我们的圣地并拯救女神。如果你的队伍包含了所有职业（战士、魔法师、弓箭手、飞侠和海盗），你们还将获得我的特殊祝福来协助战斗。你们愿意帮助我们吗？");
                    cm.dispose();
                } else {
                    cm.sendSimple("那么，你想兑换什么奖励？\r\n#b#L0#兑换 #t1082232# (需要 10个 #t4001158#)#l\r\n");
                }
            } else if (status == 2) {
                if (selection == 0) {
                    if (!cm.haveItem(1082232) && cm.haveItem(4001158, 10)) {
                        cm.gainItem(1082232, 1);
                        cm.gainItem(4001158, -10);
                        cm.dispose();
                    } else {
                        cm.sendOk("你要么已经拥有了 #t1082232#，要么没有收集齐 10个 #t4001158#。");
                        cm.dispose();
                    }
                }
            }
        } else {
            if (status == 0) {
                cm.sendYesNo("你打算退出这次救援任务吗？");
            } else if (status == 1) {
                cm.warp(920011200);
                cm.dispose();
            }
        }
    }
}