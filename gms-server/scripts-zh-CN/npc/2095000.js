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
/* Delli
	Looking for Delli 3 (925010200)
	Hypnotize skill quest NPC.
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
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (cm.getMapId() != 925010400) {
                em = cm.getEventManager("DelliBattle");
                if (em == null) {
                    cm.sendOk("拯救戴利副本遇到错误。");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<组队任务：拯救戴利>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n啊，是#r#p1095000##k让你来的吗？她很担心我？……很抱歉让她操心了，但我现在还不能回去，这里的怪物受到了黑魔法师邪恶力量的侵蚀，我必须解救它们！……看你的样子，应该不会袖手旁观吧？你愿意和你的队员们一起帮帮我吗？如果准备好了，请让你们的#b队长#k来和我对话。#b\r\n#L0#我想挑战组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "关闭" : "开启") + "组队寻找。\r\n#L2#我想了解详细信息。#l#k");
            } else {
                cm.sendYesNo("任务成功了，非常感谢你的护送！我可以带你前往#b#m120000104##k，你准备好了吗？");
            }
        } else if (status == 1) {
            if (cm.getMapId() != 925010400) {
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
                } else {
                    cm.sendOk("#e#b<组队任务：拯救戴利>#k#n\r\n怪物们正在不断发起袭击！我必须在战场上坚持大约6分钟来完成解救仪式，请在此期间保护好我，协助我完成任务！");
                    cm.dispose();
                }
            } else {
                cm.warp(120000104);
                cm.dispose();
            }
        }
    }
}
