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
// 炼金术士简
var status = -1;
var amount = -1;
var items = [[2000002, 310], [2022003, 1060], [2022000, 1600], [2001000, 3120]];
var item;

function start() {
    if (cm.isQuestCompleted(2013)) {
        cm.sendNext("是你啊……多亏了你，我才能制作出各种药水。如果你需要什么，随时告诉我。");
    } else {
        if (cm.isQuestCompleted(2010)) {
            cm.sendNext("你现在看起来还不够强大，无法购买我的特制药水……");
        } else {
            cm.sendOk("我的梦想是像你一样到处旅行。然而，我的父亲不允许我这么做，他觉得外面太危险了。不过，如果我能向他证明我不是个柔弱的女孩子，他也许会同意的……");
        }
        cm.dispose();
    }
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && type == 1) {
            cm.sendNext("我这里还有很多你之前给我的材料。药水都在这里，你可以慢慢挑选。");
        }
        cm.dispose();
        return;
    }
    if (status == 0) {
        var selStr = "你想购买哪些药水？#b";
        for (var i = 0; i < items.length; i++) {
            selStr += "\r\n#L" + i + "##i" + items[i][0] + "# (价格 : " + items[i][1] + " 金币)#l";
        }
        cm.sendSimple(selStr);
    } else if (status == 1) {
        item = items[selection];
        var recHpMp = ["300点生命值（HP）", "1000点生命值（HP）", "800点魔法值（MP）", "1000点生命值（HP）和魔法值（MP）"];
        cm.sendGetNumber("你想购买 #b#t" + item[0] + "##k 吗？#t" + item[0] + "# 可以恢复 " + recHpMp[selection] + "。你想买多少个？", 1, 1, 100);
    } else if (status == 2) {
        cm.sendYesNo("你确定要购买 #r" + selection + "#k 个 #b#t" + item[0] + "##k 吗？每个 #t" + item[0] + "# 需要 " + item[1] + " 金币，总共需要 #r" + (item[1] * selection) + "#k 金币。");
        amount = selection;
    } else if (status == 3) {
        if (cm.getMeso() < item[1] * amount) {
            cm.sendNext("你身上的金币好像不够呢。请确认背包空间是否充足，以及是否带够了 #r" + (item[1] * amount) + "#k 金币。");
        } else {
            if (cm.canHold(item[0])) {
                cm.gainMeso(-item[1] * amount);
                cm.gainItem(item[0], amount);
                cm.sendNext("谢谢惠顾！如果你以后还需要药水，随时欢迎再来。");
            } else {
                cm.sendNext("请检查你的消耗栏是否有足够的空位。");
            }
        }
        cm.dispose();
    }
}