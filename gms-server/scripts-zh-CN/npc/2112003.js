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
 * @npc: Juliet
 * @map: Magatia - Alcadno - Hidden Room (261000021)
 * @func: Magatia PQ (Alcadno)
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

        if (cm.getMapId() != 261000021) {
            if (status == 0) {
                cm.sendYesNo("为了拯救罗密欧，我们必须继续前进。如果你感觉状态不佳无法继续，大家都能理解……那么，你现在打算离开吗？");
            } else if (status == 1) {
                cm.warp(926110700, 0);
                cm.dispose();
            }
        } else {
            if (status == 0) {
                em = cm.getEventManager("MagatiaPQ_A");
                if (em == null) {
                    cm.sendOk("玛加提亚组队任务（蒙特鸠）发生错误。");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<组队任务：罗密欧与朱丽叶>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n我最心爱的罗密欧被绑架了！虽然他是卡帕莱特的人，但我绝不能坐视不管，看着他因为两大学派的愚蠢冲突而受折磨。我需要你和你的队员们帮我救出他！拜托大家了！请让你们的#b队长#k来和我对话。#b\r\n#L0#我想挑战组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "关闭" : "开启") + "组队寻找。\r\n#L2#我想了解详细信息。#l#k");
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
                            cm.sendOk("你目前无法开始这个组队任务，因为你的队伍可能不符合人数要求，或者某些队员不符合参与条件，或者他们不在这张地图上。如果队伍人数不足，可以使用组队搜索功能寻找队友。");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("你的组队搜索状态现在是：#b" + (psState ? "已开启" : "已关闭") + "#k。想要更改状态时可以随时找我。");
                    cm.dispose();
                } else {
                    cm.sendOk("不久前，一个名叫犹泰的科学家因为私自研究融合蒙特鸠与卡帕莱特的禁忌炼金术而被玛加提亚放逐。两派炼金术结合所产生的可怕力量，是受到法律绝对禁止的。但他无视禁令执意研究，最终遭到了流放。\r\n如今他展开了疯狂的报复，抓走了我最心爱的人，下一个目标很可能就是我，因为我们分别是两大学派的继承人。但我绝不退缩，我们必须不惜一切代价救出他！");
                    cm.dispose();
                }
            }
        }
    }
}
