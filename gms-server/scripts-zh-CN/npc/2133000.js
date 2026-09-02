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
 * @npc: Ellin
 * @map: 300030100 - Deep Fairy Forest
 * @func: Ellin PQ
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

        if (status == 0) {
            em = cm.getEventManager("EllinPQ");
            if (em == null) {
                cm.sendOk("毒雾森林组队任务发生错误。");
                cm.dispose();
                return;
            } else if (cm.isUsingOldPqNpcStyle()) {
                action(1, 0, 0);
                return;
            }

            cm.sendSimple("#e#b<组队任务：毒雾森林>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n你想要和队员们一起探索并揭开#b毒雾森林#k的秘密吗？请让你的#b队长#k来和我交谈，或者自己组建一个队伍。#b\r\n#L0#我想挑战组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "关闭" : "开启") + "组队寻找。\r\n#L2#我想了解详细信息。\r\n#L3#我想用亚泰尔碎片兑换奖励。#l#k");
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
                        cm.sendOk("你目前无法开始这个组队任务，因为你的队伍可能不符合人数要求，或者某些队员不符合挑战条件，或者他们不在这张地图上。如果队伍人数不足，可以使用组队搜索功能寻找队友。");
                    }

                    cm.dispose();
                }
            } else if (selection == 1) {
                var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                cm.sendOk("你的组队搜索状态现在是：#b" + (psState ? "已开启" : "已关闭") + "#k。想要更改状态时可以随时找我。");
                cm.dispose();
            } else if (selection == 2) {
                cm.sendOk("#e#b<组队任务：毒雾森林>#k#n\r\n在这个组队任务中，你们需要深入被剧毒笼罩的森林，击退变异的怪物，解开层层谜题，并充分发挥团队协作来克服险境。在击败最终首领后，如果获得净化之石并#b投掷到出口地图的清泉中#k，全队还能获得额外的丰厚奖励！祝你们好运！");
                cm.dispose();
            } else {
                cm.sendSimple("你想兑换哪件奖励？\r\n#b#L0##t1032060##l\r\n#L1##t1032061##l#k");
            }
        } else if (status == 2) {
            if (selection == 0) {
                if (!cm.haveItem(1032060) && cm.haveItem(4001198, 10)) {
                    cm.gainItem(1032060, 1);
                    cm.gainItem(4001198, -10);
                    cm.dispose();
                } else {
                    cm.sendOk("你已经拥有了 #b#t1032060#k，或者你身上的 #b#t4001198#k 不足 10 个。");
                    cm.dispose();
                }
            } else if (selection == 1) {
                if (cm.haveItem(1032060) && !cm.haveItem(1032061) && cm.haveItem(4001198, 10)) {
                    cm.gainItem(1032060, -1);
                    cm.gainItem(1032061, 1);
                    cm.gainItem(4001198, -10);
                    cm.dispose();
                } else {
                    cm.sendOk("你需要先拥有 #b#t1032060#k 并且集齐 10 个 #b#t4001198#k 才能升级。");
                    cm.dispose();
                }
            }
        }
    }
}
