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
var temp;
var cost;

var status = 0;

function start() {
    cm.sendSimple("...有什么我可以帮你的吗？\r\n#b#L0#购买魔法种子#l\r\n#L1#为神木村做点贡献#l#k");
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status < 3)) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        cm.sendOk("请仔细考虑。一旦你做出了决定，请告诉我。");
        cm.dispose();
        return;
    }
    status++;
    if (status == 1) {
        if (selection == 0) {
            cm.sendSimple("你好像不是本地人。有什么我可以帮你的吗？\r\n#b#L0#我想要一些#t4031346#。#l#k");
        } else {
            cm.sendNext("正在开发中...");
            cm.dispose();
        }
    } else if (status == 2) {
        cm.sendGetNumber("#b#t4031346#k是非常珍贵的物品，我不能随随便便就给你。这样吧，帮我一个小忙，我就卖给你。每个#b#t4031346#k卖你 #b30,000 金币#k。你愿意购买吗？那么你想要买多少个呢？", 0, 0, 99);
    } else if (status == 3) {
        if (selection == 0) {
            cm.sendOk("购买数量不能为0。");
            cm.dispose();
        } else {
            temp = selection;
            cost = temp * 30000;
            cm.sendYesNo("购买 #b" + temp + " 个 #t4031346#k 一共需要 #b" + cost + " 金币#k。你确定要购买吗？");
        }
    } else if (status == 4) {
        if (cm.getMeso() < cost || !cm.canHold(4031346)) {
            cm.sendOk("请检查一下你的金币是否足够，或者背包的其它栏是否有足够的空间。");
        } else {
            cm.sendOk("非常感谢，请收好。再见~");
            cm.gainItem(4031346, temp);
            cm.gainMeso(-cost);
        }
        cm.dispose();
    }
}
