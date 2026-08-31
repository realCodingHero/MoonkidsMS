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
 * @npc: Amos
 * @map: Entrance of Amorian Challenge (670010100)
 * @func: Amoria PQ
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
            em = cm.getEventManager("AmoriaPQ");
            if (em == null) {
                cm.sendOk("阿莫利亚组队任务目前遇到异常，请稍后再试。");
                cm.dispose();
                return;
            } else if (cm.isUsingOldPqNpcStyle()) {
                action(1, 0, 0);
                return;
            }

            cm.sendSimple("#e#b<组队任务：阿莫利亚挑战>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n如果你渴望证明彼此的默契，不妨与其他情侣或冒险家组队，让你们的#b队长#k前来与我对话。如果队伍全部由已婚夫妇组成，通关后将会获得更丰厚的专属奖励！#b\r\n#L0#我们想要开始阿莫利亚组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "关闭" : "开启") + "组队寻找邀请。\r\n#L2#我想了解挑战详情与规则。");
        } else if (status == 1) {
            if (selection == 0) {
                if (cm.getParty() == null) {
                    cm.sendOk("请先创建一个队伍后再来找我。");
                    cm.dispose();
                } else if (!cm.isLeader()) {
                    cm.sendOk("请让你们的队长前来与我对话。");
                    cm.dispose();
                } else {
                    var eli = em.getEligibleParty(cm.getParty());
                    if (eli.size() > 0) {
                        if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                            cm.sendOk("当前频道已经有其他队伍正在挑战#r阿莫利亚组队任务#k，请换线或者稍后再试。");
                        }
                    } else {
                        cm.sendOk("你的队伍目前不符合进入要求。请确保所有队员等级达标、在同一张地图内，且队伍人数符合任务规定。");
                    }

                    cm.dispose();
                }
            } else if (selection == 1) {
                var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                cm.sendOk("你的组队搜索邀请功能现已：#b" + (psState ? "开启" : "关闭") + "#k。");
                cm.dispose();
            } else {
                cm.sendOk("#e#b<组队任务：阿莫利亚挑战>#k#n\r\n我是阿莫斯，阿莫利亚挑战的主持人！这个组队任务包含许多极具考验的团队机关谜题与强力首领，齐心协力是通关的唯一关键！在最后阶段将有充满惊喜的奖励关卡，击碎宝箱可以获得各种珍贵装备与许愿券。如果队伍全员都是已婚夫妻，还将开启更具吸引力的高级奖励关卡！");
                cm.dispose();
            }
        }
    }
}