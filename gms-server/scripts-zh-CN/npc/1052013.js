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

/*
    NPC ID: 1052013 
    NPC NAME: Computer
    @author Ronan
*/

var status;
var pqArea;

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

        if (cm.getMapId() != 193000000) {
            var eim = cm.getEventInstance();

            if (status == 0) {
                if (!eim.isEventCleared()) {
                    var couponsNeeded = eim.getIntProperty("couponsNeeded");

                    if (cm.isEventLeader()) {
                        if (cm.haveItem(4001007, couponsNeeded)) {
                            cm.sendNext("你的队伍收集齐了所有入场券，干得漂亮！");
                            cm.gainItem(4001007, couponsNeeded);
                            eim.clearPQ();

                            cm.dispose();

                        } else {
                            cm.sendYesNo("你的队伍必须收集 #r" + couponsNeeded + "#k 张入场券才能通关此任务。收集齐后请让队长来和我对话……或者你想#b现在放弃并退出#k？请注意，如果你现在退出，#r你的队伍也将被迫退出#k。");
                        }
                    } else {
                        cm.sendYesNo("你的队伍必须收集 #r" + couponsNeeded + "#k 张入场券才能通关此任务。请让你的队长带着足够数量的入场券来找我……或者你想#b现在退出#k吗？请注意，如果你现在退出，你的队伍可能会因人数不足而无法继续进行。");
                    }
                } else {
                    if (!eim.giveEventReward(cm.getPlayer())) {
                        cm.sendOk("请在你的其它栏整理出至少一个空位以接收奖励。");
                        cm.dispose();
                    } else {
                        cm.warp(193000000);
                        cm.dispose();
                    }
                }
            } else if (status == 1) {
                cm.warp(193000000);
                cm.dispose();
            }
        } else {
            var levels = ["#m190000000#", "#m191000000#", "#m192000000#", "#m195000000#", "#m196000000#", "#m197000000#"];
            if (status == 0) {
                var sendStr = "高级之路是一个聚集了各种类型怪物、练级与打宝的绝佳场所。请选择你想挑战的区域：\r\n\r\n#b";
                for (var i = 0; i < 6; i++) {
                    sendStr += "#L" + i + "#" + levels[i] + "#l\r\n";
                }

                cm.sendSimple(sendStr);
            } else if (status == 1) {
                pqArea = selection + 1;

                em = cm.getEventManager("CafePQ_" + pqArea);
                if (em == null) {
                    cm.sendOk("CafePQ_" + pqArea + " 遇到了错误。");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    status = 1;
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<组队任务：高级之路 - " + levels[selection] + ">\r\n#k#n" + em.getProperty("party") + "\r\n\r\n这里的#p1052014#与普通的售货机不同，它不使用金币或扭蛋券，而是使用#r怪物橡皮擦#k。通过完成高级之路的组队任务即可获得橡皮擦。想要挑战，请组建好队伍后让#b队长#k来与我对话。#b\r\n#L0#我想参加组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "禁用" : "启用") + "组队邀请搜索。\r\n#L2#我想了解更多详情。");
            } else if (status == 2) {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("只有当你加入一个队伍时，才能参加组队任务。");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("必须由队长与我对话才能开启组队任务。");
                        cm.dispose();
                    } else {
                        var eli = em.getEligibleParty(cm.getParty());
                        if (eli.size() > 0) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("当前频道的#r组队任务#k已有其他队伍正在进行。请稍后再试或更换频道。");
                            }
                        } else {
                            cm.sendOk("你的队伍目前无法进入此组队任务。请确认：队伍人数是否符合要求、队员等级是否达标、所有队员是否都在当前地图。如果你找不到队员，可以尝试使用组队搜索功能。");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("你的组队搜索状态现已设置为：#b" + (psState ? "开启" : "关闭") + "#k。若需更改可随时来找我。");
                    cm.dispose();
                } else {
                    cm.sendOk("#e#b<组队任务：高级之路>#k#n\r\n在前方区域中，你们将面对各种怪物。消灭怪物并收集所需数量的入场券交给电脑，所有队员即可获得对应区域等级的#b怪物橡皮擦#k。在自动售货机中投入橡皮擦即可兑换丰厚奖励！");
                    cm.dispose();
                }
            }
        }
    }
}