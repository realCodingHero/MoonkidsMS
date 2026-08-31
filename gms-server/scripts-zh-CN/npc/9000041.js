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
/* NPC: Donation Box (9000041)
	Victoria Road : Henesys
	
	NPC Bazaar:
        * @author Ronan Lana
*/

var options = ["装备栏", "消耗栏", "设置栏", "其它栏"];
var name;
var status;
var selectedType = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        cm.dispose();
        return;
    }

    if (status == 0) {
        const GameConfig = Java.type('org.gms.config.GameConfig');
        if (!GameConfig.getServerBoolean("use_enable_custom_npc_script")) {
            cm.sendOk("快速出售功能目前未开启。");
            cm.dispose();
            return;
        }

        var selStr = "你好，我是#b快速出售 NPC#k！你可以把背包中不需要的批量道具出售给我。\r\n#r【警告】#b请注意：系统将从你输入的道具开始，向后批量出售该栏位中的所有后续物品。#k请务必确认好道具顺序！";
        for (var i = 0; i < options.length; i++) {
            selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        }
        cm.sendSimple(selStr);
    } else if (status == 1) {
        selectedType = selection;
        cm.sendGetText("请问你要从#r" + options[selectedType] + "#k中的哪一件道具开始批量出售？\r\n（请输入该起始道具的准确名称）");
    } else if (status == 2) {
        name = cm.getText();
        var res = cm.getPlayer().sellAllItemsFromName(selectedType + 1, name);

        if (res > -1) {
            cm.sendOk("批量出售完成！本次共获得 #r" + cm.numberWithCommas(res) + " 金币#k。");
        } else {
            cm.sendOk("在你的#b" + options[selectedType] + "#k中没有找到名为 #r'" + name + "'#k 的道具！");
        }

        cm.dispose();
    }
}