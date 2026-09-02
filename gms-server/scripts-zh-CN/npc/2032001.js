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
/* Spiruna
Orbis : Old Man's House (200050001)

Refining NPC:
 * Dark Crystal - Half Price compared to Vogen, but must complete quest
 */

var status = 0;

function start() {
    if (cm.isQuestCompleted(3034)) {
        cm.sendYesNo("你之前帮了我很大的忙……如果你有 #b#t4004004#k，我可以帮你精炼成 #b#t4005004#k，每个只需收取 #b500,000 金币#k 的手续费。");
    } else {
        cm.sendOk("走开，别打扰我冥想。");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }
    status++;
    if (status == 1) {
        cm.sendGetNumber("好的，你想要我帮你制作多少个 #b#t4005004#k 呢？", 1, 1, 100);
    } else if (status == 2) {
        var complete = true;

        if (cm.getMeso() < 500000 * selection) {
            cm.sendOk("对不起，我可不会免费帮你精炼。带够金币再来吧。");
            cm.dispose();
            return;
        } else if (!cm.haveItem(4004004, 10 * selection)) {
            complete = false;
        } else if (!cm.canHold(4005004, selection)) {
            cm.sendOk("你的背包似乎没有足够的空位，先整理一下背包吧！");
            cm.dispose();
            return;
        }
        if (!complete) {
            cm.sendOk("我需要足够的黑暗水晶母矿才能进行精炼，少一个都不行。");
        } else {
            cm.gainItem(4004004, -10 * selection);
            cm.gainMeso(-500000 * selection);
            cm.gainItem(4005004, selection);
            cm.sendOk("精炼完成了，好好珍惜使用它吧。");
        }
        cm.dispose();
    }
}