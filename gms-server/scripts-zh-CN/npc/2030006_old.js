/*
	This file is part of the OdinMS MapleStory Server
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
status = -1;
quest = [
    "在金银岛魔法密林看不到的NPC是？#b\r\n#L0#赛恩\r\n#L1#妖精弗朗索瓦\r\n#L2#汉斯\r\n#L3#妖精艾温\r\n#L4#露尔",
    "以下哪种怪物不会在神秘岛出现？#b\r\n#L0#白狼\r\n#L1#鳄鱼\r\n#L2#雪人\r\n#L3#狼人\r\n#L4#月光精灵",
    "以下哪种怪物的等级最高？#b\r\n#L0#三眼章鱼\r\n#L1#漂漂猪\r\n#L2#绿蘑菇\r\n#L3#斧木妖\r\n#L4#蓝水灵",
    "在冒险岛中，哪组药水与效果是不匹配的？#b\r\n#L0#圣水 - 解除诅咒和封印状态\r\n#L1#清晨之露 - 恢复 3000 MP\r\n#L2#汉堡包 - 恢复 400 HP\r\n#L3#沙拉 - 恢复 200 MP\r\n#L4#蓝色药水 - 恢复 100 MP",
    "以下哪个NPC与宠物完全无关？#b\r\n#L0#科洛伊\r\n#L1#妖精玛尔\r\n#L2#训练师巴特斯\r\n#L3#比休斯\r\n#L4#杜布斯"
];
ans = [4, 1, 3, 1, 3];
rand = parseInt(Math.random() * quest.length);

function start() {
    if (cm.getPlayer().gotPartyQuestItem("JBQ") && !cm.haveItem(4031058)) {
        if (cm.haveItem(4005004)) {
            if (!cm.canHold(4031058)) {
                cm.sendNext("接受此试炼前，请确保你的【其它】栏至少保留1个空位。");
            } else {
                cm.sendNext("很好……我将在此检验你的智慧。你必须连续答对全部5道问题才能通过试炼。只要答错任意一题，测试就会立即终止并需要重新开始。那么，我们现在开始吧。");
                return;
            }
        } else {
            cm.sendNext("请献上一颗 #b#t4005004##k 作为祭品，方可开启智慧的试炼。");
        }
    }
    cm.dispose();
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.gainItem(4005004, -1);
    }
    if (status > 0) {
        if (selection != ans[rand]) {
            cm.sendNext("回答错误！你的智慧尚不足以通过试炼。请重新准备好祭品后再来尝试吧。");
            cm.dispose();
            return;
        }
    }
    while (quest[rand] === "" && status <= 4) {
        rand = parseInt(Math.random() * quest.length);
    }
    if (status <= 4) {
        cm.sendSimple("这是第 #b" + (status + 1) + "#k 道问题：\r\n\r\n" + quest[rand]);
        quest[rand] = "";
    } else {
        cm.sendOk("精彩绝伦！你全部回答正确，你的渊博智慧与敏锐洞察力已经得到了神圣之石的完全认可。拿着这枚 #b#t4031058##k，回去找你的三转导师完成晋升吧！");
        cm.gainItem(4031058, 1);
        cm.dispose();
    }
}
