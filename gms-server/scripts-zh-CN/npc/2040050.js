/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Eurek the Alchemist - Multiple Place
 -- By ---------------------------------------------------------------------------------------------
 Information
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Information
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var menu = "";
var set;
var makeitem;
var access = true;
var reqitem = [];
var cost = 4000;
var makeditem = [4006000, 4006001];
var reqset = [[[[4000046, 20], [4000027, 20], [4021001, 1]],
        [[4000025, 20], [4000049, 20], [4021006, 1]],
        [[4000129, 15], [4000130, 15], [4021002, 1]],
        [[4000074, 15], [4000057, 15], [4021005, 1]],
        [[4000054, 7], [4000053, 7], [4021003, 1]]],

    [[[4000046, 20], [4000027, 20], [4011001, 1]],
        [[4000014, 20], [4000049, 20], [4011003, 1]],
        [[4000132, 15], [4000128, 15], [4011005, 1]],
        [[4000074, 15], [4000069, 15], [4011002, 1]],
        [[4000080, 7], [4000079, 7], [4011004, 1]]]];

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && (status == 1 || status == 2))) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        cm.sendNext("材料还没带齐吗？不用着急。收集齐所有必要的材料后再来找我吧。无论通过打怪还是向其他玩家收购，都能弄到这些材料，继续加油吧！");
        cm.dispose();
    }
    if (mode == 1) {
        status++;
    }
    if (status == 0) {
        cm.sendNext("好的，把青蛙的舌头和松鼠的牙齿混合在一起……哎呀！差点忘了放闪闪发光的白色粉末！！呼，好险差点就搞砸了……哇啊！！你站在那里看多久了？我做起实验来总是太投入了……嘿嘿。");
    } else if (status == 1) {
        cm.sendSimple("正如你所见，我是一名游历各地的炼金术士。虽然我还在修行之中，但我已经能够制作一些你冒险中必不可少的神奇道具了。想看看吗？\r\n\r\n#L0##b制作魔法石（5个）#k#l\r\n#L1##b制作召唤石（5个）#k#l");
    } else if (status == 2) {
        set = selection;
        makeitem = makeditem[set];
        for (i = 0; i < reqset[set].length; i++) {
            menu += "\r\n#L" + i + "##b使用 #t" + reqset[set][i][0][0] + "# 和 #t" + reqset[set][i][1][0] + "# 等材料制作#k#l";
        }
        cm.sendSimple("哈哈…… #b#t" + makeitem + "##k 是一种充满神秘力量的石头，只有像我这样的炼金术士才能制作出来。许多冒险家施展强大的三转高级技能时都需要消耗它。目前有5种不同的配方可以制作 #t" + makeitem + "#，你想用哪种配方来制作？" + menu);
    } else if (status == 3) {
        set = reqset[set][selection];
        reqitem[0] = [set[0][0], set[0][1]];
        reqitem[1] = [set[1][0], set[1][1]];
        reqitem[2] = [set[2][0], set[2][1]];
        menu = "";
        for (i = 0; i < reqitem.length; i++) {
            menu += "\r\n#i" + reqitem[i][0] + "# #b#t" + reqitem[i][0] + "# " + reqitem[i][1] + "个#k";
        }
        menu += "\r\n#i4031138# #b" + cost + " 金币#k";
        cm.sendYesNo("为了制作 #b5个 #t" + makeitem + "##k，我需要你提供以下材料和手续费。这些材料在怪物身上大多很容易获得。怎么样？要现在开始制作吗？\r\n" + menu);
    } else if (status == 4) {
        for (i = 0; i < reqitem.length; i++) {
            if (!cm.haveItem(reqitem[i][0], reqitem[i][1])) {
                access = false;
            }
        }
        if (access == false || !cm.canHold(makeitem) || cm.getMeso() < cost) {
            cm.sendNext("请检查你是否带齐了所有所需材料和金币，或者你的【其它】栏空间是否已满。");
        } else {
            cm.sendOk("给，这是制作好的5个 #b#t" + makeitem + "##k！不得不说，这真是一件完美的炼金杰作。如果以后还需要的话，随时欢迎再来找我！");
            cm.gainItem(reqitem[0][0], -reqitem[0][1]);
            cm.gainItem(reqitem[1][0], -reqitem[1][1]);
            cm.gainItem(reqitem[2][0], -reqitem[2][1]);
            cm.gainMeso(-cost);
            cm.gainItem(makeitem, 5);
        }
        cm.dispose();
    }
}