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
/* Rooney
	Map Name (Map ID)
	Used to exchange VP for Maple Leaves, and Maple Leaves for rewards.
 */

var itemToUse = 4001126;

var chairs = [3010000, 3010001, 3010002, 3010003, 3010004, 3010005, 3010006, 3010007, 3010008, 3010009, 3010010, 3010011, 3010012, 3010013, 3010015, 3010016, 3010017, 3010018, 3010019, 3010022, 3010023, 3010024, 3010025, 3010026, 3010028, 3010040, 3010041, 3010043, 3010045, 3010046, 3010047, 3010057, 3010058, 3010060, 3010061, 3010062, 3010063, 3010064, 3010065, 3010066, 3010067, 3010069, 3010071, 3010072, 3010073, 3010080, 3010081, 3010082, 3010083, 3010084, 3010085, 3010097, 3010098, 3010099, 3010101, 3010106, 3010116, 3011000, 3012005, 3012010, 3012011];
var scrolls = [2040603, 2044503, 2041024, 2041025, 2044703, 2044603, 2043303, 2040807, 2040806, 2040006, 2040007, 2043103, 2043203, 2043003, 2040506, 2044403, 2040903, 2040709, 2040710, 2040711, 2044303, 2043803, 2040403, 2044103, 2044203, 2044003, 2043703];
var weapons = [1302020, 1302030, 1302033, 1302058, 1302064, 1302080, 1312032, 1322054, 1332025, 1332055, 1332056, 1372034, 1382009, 1382012, 1382039, 1402039, 1412011, 1412027, 1422014, 1422029, 1432012, 1432040, 1432046, 1442024, 1442030, 1442051, 1452016, 1452022, 1452045, 1462014, 1462019, 1462040, 1472030, 1472032, 1472055, 1482020, 1482021, 1482022, 1492020, 1492021, 1492022, 1092030, 1092045, 1092046, 1092047];

var nxAmount = 3000;
var chairAmount = 2;
var weaponAmount = 2;
var buffAmount = 2;
var hiredMerchantLength = 7;

var buff1ID = 2022273;
var buff2ID = 2022179;
var status;
var vp;
var choice;

function start() {
    //vp = cm.getClient().getVotePoints();
    //if(vp == null)
    vp = 0;

    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 0) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0 && mode == 1) {
            if (cm.getPlayer().getLevel() < 20) {
                cm.sendOk("你好，我是投票点数兑换使者！很抱歉，我只能为#b20级及以上#k的玩家提供兑换服务。");
                cm.dispose();
                return;
            }
            var outStr = "你好，我是投票点数兑换使者！\r\n";
            outStr += "你目前拥有 #r#c" + itemToUse + "##k 个 #t" + itemToUse + "# 以及 #r" + vp + "#k 点投票点数。#b\r\n\r\n";
            outStr += "#L0#我想将投票点数兑换为枫叶#l\r\n";
            outStr += "#L1#我想用 1 个 #t" + itemToUse + "# 兑换 " + nxAmount + " 点券#l\r\n";
            outStr += "#L2#我想用 1 个 #t" + itemToUse + "# 兑换 " + chairAmount + " 张随机椅子#l\r\n";
            outStr += "#L3#我想用 1 个 #t" + itemToUse + "# 兑换 " + weaponAmount + " 件枫叶系列武器#l\r\n";
            outStr += "#L4#我想用 1 个 #t" + itemToUse + "# 兑换 " + buffAmount + " 个 #t" + buff1ID + "# 和 " + buffAmount + " 个 #t" + buff2ID + "##l\r\n";
            outStr += "#L5#我想用 1 个 #t" + itemToUse + "# 兑换 " + hiredMerchantLength + " 天雇佣商人契约#l\r\n";
            cm.sendSimple(outStr);
        } else if (status == 1) {
            choice = selection;

            if (selection > 0) {
                if (!cm.haveItem(itemToUse) && vp == 0) {
                    cm.sendOk("对不起，您没有任何 #t" + itemToUse + "# 或投票点数。");
                    cm.dispose();
                    return;
                }
            }

            if (selection == 0) {
                // Exchange VP for leaves
                if (vp <= 0) {
                    cm.sendOk("对不起，您没有任何投票点数可以兑换！");
                    cm.dispose();
                    return;
                }
                cm.sendYesNo("你想要使用 " + vp + " 点投票点数兑换 " + vp + " 个 #t" + itemToUse + "# 吗？");
            } else if (selection == 1) {
                // Exchange 1 Leaf for Cash
                cm.sendYesNo("您想用 1 个 #t" + itemToUse + "# 兑换 " + nxAmount + " 点券吗？");
            } else if (selection == 2) {
                // Exchange 1 Leaf for Chair
                cm.sendYesNo("你想用 1 个 #t" + itemToUse + "# 兑换 " + chairAmount + " 张随机椅子吗？");
            } else if (selection == 3) {
                // Exchange 1 Leaf for Maple Weapons
                cm.sendYesNo("你想用 1 个 #t" + itemToUse + "# 兑换 " + weaponAmount + " 件随机枫叶系列武器吗？");
            } else if (selection == 4) {
                // Exchange 1 Leaf for Apples/Cheese
                cm.sendYesNo("你想用 1 个 #t" + itemToUse + "# 兑换 " + buffAmount + " 个 #t" + buff1ID + "# 和 " + buffAmount + " 个 #t" + buff2ID + "# 吗？");
            } else if (selection == 5) {
                // Echange 1 Leaf for Merchant
                cm.sendYesNo("您想用 1 个 #t" + itemToUse + "# 兑换一个 " + hiredMerchantLength + " 天的雇佣商人吗？");
            } else {
                cm.dispose();
            }
        } else if (status == 2) {
            var useVP = false;
            if (!cm.hasItem(itemToUse) && vp > 0) {
                useVP = true;
            }

            const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
            if (choice == 0) {
                // VP Exchange
                if (!cm.canHold(itemToUse)) {
                    cm.sendOk("看起来你的 #r其它栏#k 没有足够的空间来存放 #t" + itemToUse + "#。");
                    cm.dispose();
                    return;
                }

                cm.getClient().useVotePoints(vp);
                cm.gainItem(itemToUse, vp);
                cm.dispose();
            } else if (choice == 1) {
                // Leaf for Cash
                if (useVP) {
                    cm.getClient().useVotePoints(1);
                } else {
                    cm.gainItem(itemToUse, -1);
                }

                cm.getPlayer().getCashShop().gainCash(1, nxAmount);
                const PacketCreator = Java.type('org.gms.util.PacketCreator');
                cm.getPlayer().sendPacket(PacketCreator.earnTitleMessage("获得 " + nxAmount + " 点券"));
                cm.logLeaf(nxAmount + " NX");
                cm.dispose();
            } else if (choice == 2) {
                if (!cm.getPlayer().getInventory(InventoryType.SETUP).isFull(chairAmount)) {

                    var chairStr = "";
                    for (var i = 0; i < chairAmount; i++) {
                        var chair = chairs[Math.floor(Math.random() * chairs.length)];
                        cm.gainItem(chair, 1, true);
                        chairStr += chair + " ";
                    }

                    if (useVP) {
                        cm.getClient().useVotePoints(1);
                    } else {
                        cm.gainItem(itemToUse, -1);
                    }

                    cm.logLeaf("Chair ID: " + chairStr);
                    cm.dispose();
                } else {
                    cm.sendOk("请确保您的设置栏有足够的空间！");
                }
            } else if (choice == 3) {
                if (!cm.getPlayer().getInventory(InventoryType.EQUIP).isFull(weaponAmount)) {

                    var weaponStr = "";
                    for (var i = 0; i < weaponAmount; i++) {
                        var weapon = weapons[Math.floor(Math.random() * weapons.length)];
                        cm.gainItem(weapon, 1, true, true);
                        weaponStr += weapon + " ";
                    }

                    if (useVP) {
                        cm.getClient().useVotePoints(1);
                    } else {
                        cm.gainItem(itemToUse, -1);
                    }

                    cm.logLeaf("Maple Weapon IDs: " + weaponStr);
                    cm.dispose();
                } else {
                    cm.sendOk("请确保您的装备栏有足够的空间！");
                }
            } else if (choice == 4) {
                if (!cm.getPlayer().getInventory(InventoryType.USE).isFull(2)) {
                    cm.gainItem(buff1ID, buffAmount, true);
                    cm.gainItem(buff2ID, buffAmount, true);
                    cm.gainItem(itemToUse, -1);
                    cm.logLeaf(buffAmount + " cheeses and apples");
                    cm.dispose();
                } else {
                    cm.sendOk("请确保您的消耗栏有足够的空间！");
                }
            } else if (choice == 5) {
                if (!cm.haveItem(5030000, 1)) {
                    if (!cm.getPlayer().getInventory(InventoryType.CASH).isFull(1)) {
                        cm.gainItem(5030000, 1, false, true, 1000 * 60 * 60 * 24 * hiredMerchantLength);

                        if (useVP) {
                            cm.getClient().useVotePoints(1);
                        } else {
                            cm.gainItem(itemToUse, -1);
                        }

                        cm.logLeaf(hiredMerchantLength + " day hired merchant");
                        cm.dispose();
                    } else {
                        cm.sendOk("请确保您的特殊栏有足够的空间！");
                    }
                } else {
                    cm.sendOk("如果你已经拥有了雇佣商人，就不能重复获得了！");
                }
            }
        } else {
            cm.dispose();
        }
    }
}