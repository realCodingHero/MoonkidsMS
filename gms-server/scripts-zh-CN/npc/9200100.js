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

/* Dr. Lenu
	Henesys Random/VIP Eye Color Change.
*/
var status = 0;
var beauty = 0;
var regprice = 1000000;
var vipprice = 1000000;
var colors = Array();

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function pushIfItemsExists(array, itemidList) {
    for (var i = 0; i < itemidList.length; i++) {
        var itemid = itemidList[i];

        if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
            array.push(itemid);
        }
    }
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1)  // disposing issue with stylishs found thanks to Vcoc
    {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("嗨，你好~！我是莱努博士，负责射手村整形医院的美瞳服务！只要使用#b#t5152010#k或#b#t5152013#k，就能为你打造一双神采奕奕、充满魅力的眼睛！记住，眼睛是心灵的窗户，我们会帮你找到最适合你的美瞳颜色！那么，你今天想要尝试哪种服务呢？\r\n#L1#使用普通美瞳券：#i5152010##t5152010##l\r\n#L2#使用高级美瞳券：#i5152013##t5152013##l\r\n#L3#使用一次性美瞳券：#i5152103#（特定颜色）#l");
        } else if (status == 1) {
            if (selection == 1) {
                beauty = 1;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace() % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace() % 100 + 21000;
                }
                colors = Array();
                pushIfItemsExists(colors, [current, current + 100, current + 200, current + 400, current + 600, current + 700]);
                cm.sendYesNo("如果使用普通美瞳券，你的眼睛颜色将会被随机改变。你确定要使用#b#t5152010#k来改变瞳色吗？");
            } else if (selection == 2) {
                beauty = 2;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace() % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace() % 100 + 21000;
                }
                colors = Array();
                pushIfItemsExists(colors, [current, current + 100, current + 200, current + 400, current + 600, current + 700]);
                cm.sendStyle("借助我们的专业设备，你可以提前预览更换瞳色后的效果。请在下方选择你最心仪的眼睛颜色吧！", colors);
            } else if (selection == 3) {
                beauty = 3;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 21000;
                }

                colors = Array();
                for (var i = 0; i < 8; i++) {
                    if (cm.haveItem(5152100 + i)) {
                        pushIfItemExists(colors, current + 100 * i);
                    }
                }

                if (colors.length == 0) {
                    cm.sendOk("你背包里没有任何一次性美瞳券。");
                    cm.dispose();
                    return;
                }

                cm.sendStyle("请选择你想要佩戴的美瞳颜色风格。", colors);
            }
        } else if (status == 2) {
            cm.dispose();
            if (beauty == 1) {
                if (cm.haveItem(5152010) == true) {
                    cm.gainItem(5152010, -1);
                    cm.setFace(colors[Math.floor(Math.random() * colors.length)]);
                    cm.sendOk("太棒了！快照镜子看看，你的新眼睛颜色是不是格外迷人？");
                } else {
                    cm.sendOk("对不起，你背包中似乎没有对应的美瞳券。没有会员券的话，我可不能为你提供服务哦。");
                }
            } else if (beauty == 2) {
                if (cm.haveItem(5152013) == true) {
                    cm.gainItem(5152013, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("太棒了！快照镜子看看，你的新眼睛颜色是不是格外迷人？");
                } else {
                    cm.sendOk("对不起，你背包中似乎没有对应的美瞳券。没有会员券的话，我可不能为你提供服务哦。");
                }
            } else if (beauty == 3) {
                var color = (colors[selection] / 100) % 10 | 0;

                if (cm.haveItem(5152100 + color)) {
                    cm.gainItem(5152100 + color, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("太棒了！快照镜子看看，你的新眼睛颜色是不是格外迷人？");
                } else {
                    cm.sendOk("对不起，你背包中似乎没有对应的美瞳券。没有会员券的话，我可不能为你提供服务哦。");
                }
            } else if (beauty == 0) {
                if (selection == 0 && cm.getMeso() >= regprice) {
                    cm.gainMeso(-regprice);
                    cm.gainItem(5152010, 1);
                    cm.sendOk("给您！欢迎下次光临！");
                } else if (selection == 1 && cm.getMeso() >= vipprice) {
                    cm.gainMeso(-vipprice);
                    cm.gainItem(5152013, 1);
                    cm.sendOk("给您！欢迎下次光临！");
                } else {
                    cm.sendOk("你的金币不足以购买会员券！");
                }
            }
        }
    }
}