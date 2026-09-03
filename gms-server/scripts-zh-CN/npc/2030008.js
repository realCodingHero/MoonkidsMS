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
/* Adobis
 * 
 * El Nath - The Door to Zakum (211042300)
 * 
 * Vs Zakum Recruiter NPC
 * 
 * Custom Quest 100200 = Whether you can start Zakum PQ
 * Custom Quest 100201 = Whether you have done the trials
*/

var status;
var em;
var selectedType;
var gotAllDocs;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.haveItem(4001109, 1)) {
            cm.warp(921100000, "out00");
            cm.dispose();
            return;
        }

        if (!(cm.isQuestStarted(100200) || cm.isQuestCompleted(100200))) {
            if (cm.getPlayer().getLevel() >= 50) {
                cm.sendOk("小心，古老的力量并未被遗忘……如果你希望有朝一日挑战 #r扎昆#k，首先要前往长老板屋获得 #b长老议会#k 的批准，然后再来接受我的考验，证明你有面对魔神的资格。");
            } else {
                cm.sendOk("小心，古老的力量并未被遗忘……");
            }

            cm.dispose();
            return;
        }

        em = cm.getEventManager("ZakumPQ");
        if (em == null) {
            cm.sendOk("扎昆组队任务遇到了一个错误。");
            cm.dispose();
            return;
        }

        if (status == 0) {
            cm.sendSimple("#e#b<扎昆前置试炼任务>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n小心，沉睡的远古魔神即将苏醒……#b\r\n#L0#废矿区调查（第1阶段）#l\r\n#L1#扎昆的忍耐之林（第2阶段：熔岩之息）#l\r\n#L2#提炼火焰之眼（第3阶段）#l");
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
                        cm.sendOk("你目前无法开始这个组队任务，因为你的队伍可能不符合人数要求，有些队员可能不符合参与条件，或者他们不在这张地图上。如果你找不到队员，可以尝试使用组队搜索功能。");
                    }

                    cm.dispose();
                }
            } else if (selection == 1) {
                if (cm.haveItem(4031061) && !cm.haveItem(4031062)) {
                    cm.sendYesNo("你已经成功通过了第一阶段的试炼。不过距离抵达扎昆祭台还有漫长险峻的路程。你准备好挑战第二阶段的耐力试炼了吗？");
                } else {
                    if (cm.haveItem(4031062)) {
                        cm.sendNext("你已经获得了 #b#t4031062##k，无需重复挑战这一阶段。");
                    } else {
                        cm.sendNext("请先按顺序完成前面的试炼阶段。");
                    }
                    cm.dispose();
                }
            } else {
                if (cm.haveItem(4031061) && cm.haveItem(4031062)) {
                    if (!cm.haveItem(4000082, 30)) {
                        cm.sendOk("你已经完成了全部考验，但还需要带来 #b#i4000082# #t4000082# 30个#k，我才能为你提炼出 #b5个 #t4001017##k。");
                    } else {
                        cm.completeQuest(100201);
                        cm.gainItem(4031061, -1);
                        cm.gainItem(4031062, -1);
                        cm.gainItem(4000082, -30);

                        cm.gainItem(4001017, 5);
                        cm.sendNext("做得好！你已经成功通过了全部试炼！这是给你的 #b#t4001017##k。从现在起，我正式特许你进入祭台挑战扎昆！");
                    }

                    cm.dispose();
                } else {
                    cm.sendOk("你还缺少锻造 #b#t4001017##k 所需的试炼信物：\r\n#b#i4031061# #t4031061# 1个\r\n#i4031062# #t4031062# 1个#k\r\n请完成前两阶段的试炼后再来找我。");
                    cm.dispose();
                }
            }
        } else if (status == 2) {
            cm.warp(280020000, 0);
            cm.dispose();
        }
    }
}