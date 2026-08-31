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
 * @description Maple Helper / Script Center
 */
var OldTitle = "\t\t\t\t\t#eWelcome to #rMoonKids#k Maple Helper#n\t\t\t\t\r\n";
var status = -1;
var currentMenu = 0; // 0: Main Menu, 1: More... (Player), 2: More (GM)

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
        text += "Cash: " + cm.getPlayer().getCashShop().getCash(1) + "\r\n";
        text += "Maple Points: " + cm.getPlayer().getCashShop().getCash(2) + "\r\n";
        text += "Credit: " + cm.getPlayer().getCashShop().getCash(4) + "\r\n";
        text += "Mesos: " + cm.getPlayer().getMeso() + "\r\n";
        text += " \r\n\r\n";
        text += "#b#L71#Universal Warp#l \t #L80#Quest Helper#l\r\n";
        text += "#L81#Equip Shop#l \t #L82#Pet Loot Setting#l\r\n";
        text += "#L100#More...#l#k\r\n";

        if (cm.getPlayer().isGM()) {
            text += "\r\n";
            text += "\t\t\t\t#r===== GM Debug Menu =====\r\n";
            text += "#L62#Super Shop#l \t #L63#Salon#l\r\n";
            text += "#L200#More (GM)#l\r\n";
        }
        cm.sendSimple(text);
    } else if (status === 1) {
        if (selection === 100) {
            // Player: More...
            currentMenu = 1;
            let text = "\t\t\t\t\t#e【 Maple Helper - More Features 】#n\r\n\r\n";
            text += "#b#L3#Free Market#l \t #L69#Quick Job Advance#l \t #L70#Learn Skills#l\r\n";
            text += "#L72#Rebirth#l \t #L4#Map Drops#l \t #L2#Online Rewards#l\r\n";
            text += "#L0#Newbie Gift#l \t #L1#Daily Check-in#l\r\n\r\n";
            text += "#L9999##b[Return to Main Menu]#k#l";
            cm.sendSimple(text);
        } else if (selection === 200 && cm.getPlayer().isGM()) {
            // GM: More (GM)
            currentMenu = 2;
            let text = "\t\t\t\t\t#r#e【 GM Management & Debug 】#n#k\r\n\r\n";
            text += "#b#L64#UI Query#l \t #L65#Delete Items#l \t #L66#Spawn Items#l\r\n\r\n";
            text += "#L67#Stateful Example#l \t #L68#NextLevel Example#l\r\n\r\n";
            text += "#L9999##b[Return to Main Menu]#k#l";
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
        // Player Features
        case 71:
            if (org.gms.server.quest.JobAdvancementUtil.isUndergoingJobAdvancement(cm.getPlayer())) {
                cm.sendOk("接到#r转职教官#k通知,转职期间无法使用传送.");
                cm.dispose();
                break;
            }
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
            if (org.gms.server.quest.JobAdvancementUtil.isUndergoingJobAdvancement(cm.getPlayer())) {
                cm.sendOk("接到#r转职教官#k通知,转职期间无法使用传送.");
                cm.dispose();
                break;
            }
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

        // GM Features
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
            cm.sendOk("Feature not supported yet.");
            cm.dispose();
    }
}

function openNpc(scriptName) {
    try {
        java.lang.System.out.println("[NPC 9900001] openNpc called: " + scriptName);
    } catch (ignored) { }
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}