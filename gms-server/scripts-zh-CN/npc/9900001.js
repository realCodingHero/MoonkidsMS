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

/**
 * @description 枫叶助手 / 脚本中心
 */
var OldTitle = "\t\t\t\t\t#e欢迎来到#rBeiDou#k枫叶助手#n\t\t\t\t\r\n";
var status = -1;
var currentMenu = 0; // 0: 主菜单, 1: 更多... (玩家), 2: 更多 (GM)

function start() {
    status = -1;
    currentMenu = 0;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === -1) {
        status--;
    } else {
        cm.dispose();
        return;
    }

    if (status === 0) {
        currentMenu = 0;
        let text = OldTitle;
        text += "当前点券：" + cm.getPlayer().getCashShop().getCash(1) + "\r\n";
        text += "当前抵用券：" + cm.getPlayer().getCashShop().getCash(2) + "\r\n";
        text += "当前信用券：" + cm.getPlayer().getCashShop().getCash(4) + "\r\n";
        text += "当前金币：" + cm.getPlayer().getMeso() + "\r\n";
        text += " \r\n\r\n";
        text += "#b#L71#超级传送#l \t #L80#任务辅助#l\r\n";
        text += "#L81#装备商店#l \t #L82#宠物杂物设置#l\r\n";
        text += "#L100#更多...#l#k\r\n";

        if (cm.getPlayer().isGM()) {
            text += "\r\n";
            text += "\t\t\t\t#r=====以下内容仅GM可见=====\r\n";
            text += "#L62#超级商店#l \t #L63#整容集合#l\r\n";
            text += "#L200#更多 (GM)#l\r\n";
        }
        cm.sendSimple(text);
    } else if (status === 1) {
        if (selection === 100) {
            // 普通玩家：更多...
            currentMenu = 1;
            let text = "\t\t\t\t\t#e【 枫叶助手 - 更多功能 】#n\r\n\r\n";
            text += "#b#L3#传送自由#l \t #L69#快速转职#l \t #L70#学习技能#l\r\n";
            text += "#L72#转世重生#l \t #L4#爆率一览#l \t #L2#在线奖励#l\r\n";
            text += "#L0#新人福利#l \t #L1#每日签到#l\r\n\r\n";
            text += "#L9999##b[返回主菜单]#k#l";
            cm.sendSimple(text);
        } else if (selection === 200 && cm.getPlayer().isGM()) {
            // GM：更多 (GM)
            currentMenu = 2;
            let text = "\t\t\t\t\t#r#e【 GM 管理与调试功能 】#n#k\r\n\r\n";
            text += "#b#L64#UI查询#l \t #L65#一键删除道具#l \t #L66#一键刷道具#l\r\n\r\n";
            text += "#L67#有状态脚本示例#l \t #L68#NextLevel脚本示例#l\r\n\r\n";
            text += "#L9999##b[返回主菜单]#k#l";
            cm.sendSimple(text);
        } else if (selection === 9999) {
            start();
        } else {
            doSelect(selection);
        }
    } else if (status === 2) {
        if (selection === 9999) {
            start();
        } else {
            doSelect(selection);
        }
    } else {
        cm.dispose();
    }
}

function doSelect(selection) {
    switch (selection) {
        // 非GM功能
        case 71:
            openNpc("万能传送");
            break;
        case 80:
            openNpc("questHelper");
            break;
        case 81:
            openNpc("装备商店");
            break;
        case 82:
            openNpc("petLootSetting");
            break;
        case 3:
            cm.getPlayer().saveLocation("FREE_MARKET");
            cm.warp(910000000, "out00");
            cm.dispose();
            break;
        case 69:
            openNpc("快速转职");
            break;
        case 70:
            openNpc("技能学习");
            break;
        case 72:
            openNpc("转世重生");
            break;
        case 4:
            openNpc("当前地图掉落");
            break;
        case 2:
            openNpc("在线奖励_nextlevel");
            break;
        case 0:
            openNpc("新人福利");
            break;
        case 1:
            openNpc("每日签到");
            break;

        // GM功能
        case 62:
            cm.dispose();
            cm.openShopNPC(9900001);
            cm.dispose();
            break;
        case 63:
            openNpc("Salon");
            break;
        case 64:
            openNpc("UI查询");
            break;
        case 65:
            openNpc("一键删除道具");
            break;
        case 66:
            openNpc("一键刷道具");
            break;
        case 67:
            openNpc("Example1");
            break;
        case 68:
            openNpc("Example2");
            break;

        default:
            cm.sendOk("该功能暂不支持，敬请期待！");
            cm.dispose();
    }
}

function openNpc(scriptName) {
    try {
        java.lang.System.out.println("[NPC 9900001] openNpc called: " + scriptName);
    } catch (ignored) {}
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}