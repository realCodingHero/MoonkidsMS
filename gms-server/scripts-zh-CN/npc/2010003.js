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

/* Neve
	Orbis: Orbis Park (200000200)
	
	Refining NPC: 
	* Gloves, level 70-80 all classes
*/

var status = 0;
var selectedType = -1;
var selectedItem = -1;
var item;
var mats;
var matQty;
var cost;

function start() {
    cm.getPlayer().setCS(true);
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
    }
    if (status == 0 && mode == 1) {
        var selStr = "你好呀。我是天空之城第一的手套制作大师。需要我为你打造手套吗？#b";
        var options = ["制作或升级战士手套", "制作或升级弓箭手手套", "制作或升级魔法师手套", "制作或升级飞侠手套"];
        for (var i = 0; i < options.length; i++) {
            selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        }

        cm.sendSimple(selStr);
    } else if (status == 1 && mode == 1) {
        selectedType = selection;
        if (selectedType == 0) { //warrior glove
            var selStr = "战士手套吗？好的，你想制作哪一款？#b";
            var gloves = ["#t1082103# - 战士 Lv. 70#b", "#t1082104# - 战士 Lv. 70#b", "#t1082105# - 战士 Lv. 70#b",
                "#t1082114# - 战士 Lv. 80#b", "#t1082115# - 战士 Lv. 80#b", "#t1082116# - 战士 Lv. 80#b", "#t1082117# - 战士 Lv. 80#b"];
            for (var i = 0; i < gloves.length; i++) {
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            cm.sendSimple(selStr);
        } else if (selectedType == 1) { //bowman glove
            var selStr = "弓箭手手套吗？好的，你想制作哪一款？#b";
            var gloves = ["#t1082106# - 弓箭手 Lv. 70#b", "#t1082107# - 弓箭手 Lv. 70#b", "#t1082108# - 弓箭手 Lv. 70#b",
                "#t1082109# - 弓箭手 Lv. 80#b", "#t1082110# - 弓箭手 Lv. 80#b", "#t1082111# - 弓箭手 Lv. 80#b", "#t1082112# - 弓箭手 Lv. 80#b"];
            for (var i = 0; i < gloves.length; i++) {
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            cm.sendSimple(selStr);
        } else if (selectedType == 2) { //mage glove
            var selStr = "魔法师手套吗？好的，你想制作哪一款？#b";
            var gloves = ["#t1082098# - 魔法师 Lv. 70#b", "#t1082099# - 魔法师 Lv. 70#b", "#t1082100# - 魔法师 Lv. 70#b",
                "#t1082121# - 魔法师 Lv. 80#b", "#t1082122# - 魔法师 Lv. 80#b", "#t1082123# - 魔法师 Lv. 80#b"];
            for (var i = 0; i < gloves.length; i++) {
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            cm.sendSimple(selStr);
        } else if (selectedType == 3) { //thief glove
            var selStr = "飞侠手套吗？好的，你想制作哪一款？#b";
            var gloves = ["#t1082095# - 飞侠 Lv. 70#b", "#t1082096# - 飞侠 Lv. 70#b", "#t1082097# - 飞侠 Lv. 70#b",
                "#t1082118# - 飞侠 Lv. 80#b", "#t1082119# - 飞侠 Lv. 80#b", "#t1082120# - 飞侠 Lv. 80#b"];
            for (var i = 0; i < gloves.length; i++) {
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
    } else if (status == 2 && mode == 1) {
        selectedItem = selection;

        if (selectedType == 0) { //warrior glove
            var itemSet = [1082103, 1082104, 1082105, 1082114, 1082115, 1082116, 1082117, 1082118];
            var matSet = [[4005000, 4011000, 4011006, 4000030, 4003000], [1082103, 4011002, 4021006], [1082103, 4021006, 4021008], [4005000, 4005002, 4021005, 4000030, 4003000], [1082114, 4005000, 4005002, 4021003], [1082114, 4005002, 4021000], [1082114, 4005000, 4005002, 4021008]];
            var matQtySet = [[2, 8, 3, 70, 55], [1, 6, 4], [1, 8, 3], [2, 1, 8, 90, 60], [1, 1, 1, 7], [1, 3, 8], [1, 2, 1, 4]];
            var costSet = [90000, 90000, 100000, 100000, 110000, 110000, 120000];
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 1) { //bowman glove
            var itemSet = [1082106, 1082107, 1082108, 1082109, 1082110, 1082111, 1082112];
            var matSet = [[4005002, 4021005, 4011004, 4000030, 4003000], [1082106, 4021006, 4011006], [1082106, 4021007, 4021008], [4005002, 4005000, 4021000, 4000030, 4003000], [1082109, 4005002, 4005000, 4021005], [1082109, 4005002, 4005000, 4021003], [1082109, 4005002, 4005000, 4021008]];
            var matQtySet = [[2, 8, 3, 70, 55], [1, 5, 3], [1, 2, 3], [2, 1, 8, 90, 60], [1, 1, 1, 7], [1, 1, 1, 7], [1, 2, 1, 4]];
            var costSet = [90000, 90000, 100000, 100000, 110000, 110000, 120000];
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 2) { //mage glove
            var itemSet = [1082098, 1082099, 1082100, 1082121, 1082122, 1082123];
            var matSet = [[4005001, 4011000, 4011004, 4000030, 4003000], [1082098, 4021002, 4021007], [1082098, 4021008, 4011006], [4005001, 4005003, 4021003, 4000030, 4003000], [1082121, 4005001, 4005003, 4021005], [1082121, 4005001, 4005003, 4021008]];
            var matQtySet = [[2, 6, 6, 70, 55], [1, 6, 2], [1, 3, 3], [2, 1, 8, 90, 60], [1, 1, 1, 7], [1, 2, 1, 4]];
            var costSet = [90000, 90000, 100000, 100000, 110000, 120000];
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 3) { //thief glove
            var itemSet = [1082095, 1082096, 1082097, 1082118, 1082119, 1082120];
            var matSet = [[4005003, 4011000, 4011003, 4000030, 4003000], [1082095, 4011004, 4021007], [1082095, 4021007, 4011006], [4005003, 4005002, 4011002, 4000030, 4003000], [1082118, 4005003, 4005002, 4021001], [1082118, 4005003, 4005002, 4021000]];
            var matQtySet = [[2, 6, 6, 70, 55], [1, 6, 2], [1, 3, 3], [2, 1, 8, 90, 60], [1, 1, 1, 7], [1, 2, 1, 8]];
            var costSet = [90000, 90000, 100000, 100000, 110000, 120000];
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }

        var prompt = "你想制作 #t" + item + "# 吗？如果是的话，我需要这些制作材料。另外，请确认你的背包有足够的空位哦！#b";

        if (mats instanceof Array) {
            for (var i = 0; i < mats.length; i++) {
                prompt += "\r\n#i" + mats[i] + "# " + matQty[i] + " #t" + mats[i] + "#";
            }
        } else {
            prompt += "\r\n#i" + mats + "# " + matQty + " #t" + mats + "#";
        }

        if (cost > 0) {
            prompt += "\r\n#i4031138# " + cost + " 金币";
        }

        cm.sendYesNo(prompt);
    } else if (status == 3 && mode == 1) {
        var complete = true;

        if (!cm.canHold(item, 1)) {
            cm.sendOk("请先检查你的装备栏或背包是否有足够的空位。");
            cm.dispose();
            return;
        } else if (cm.getMeso() < cost) {
            cm.sendOk("恐怕你带的金币不够支付我的手续费。");
            cm.dispose();
            return;
        } else {
            if (mats instanceof Array) {
                for (var i = 0; complete && i < mats.length; i++) {
                    if (!cm.haveItem(mats[i], matQty[i])) {
                        complete = false;
                    }
                }
            } else if (!cm.haveItem(mats, matQty)) {
                complete = false;
            }
        }

        if (!complete) {
            cm.sendOk("如果想要打造出高品质的手套，材料可一点都不能马虎。你带来的材料似乎不够呢。");
        } else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++) {
                    cm.gainItem(mats[i], -matQty[i]);
                }
            } else {
                cm.gainItem(mats, -matQty);
            }

            cm.gainMeso(-cost);
            cm.gainItem(item, 1);
            cm.sendOk("手套已经制作完成了！如果你还需要打造其他手套，随时来找我。");
        }
        cm.dispose();
    }
}