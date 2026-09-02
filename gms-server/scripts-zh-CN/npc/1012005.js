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
/* Author: Xterminator
	NPC Name: 		Cloy
	Map(s): 		Victoria Road : Henesys Park (100000200)
	Description: 		Pet Master
 */
var status = -2;
var sel;

function start() {
    status = -2
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == -1) {
            cm.sendNext("嗯……难道你在抚养由我赋予生命的宠物吗？我掌握了一种借助生命之水给玩偶注入生命的神秘咒语，人们将它们称为#b宠物#k。如果你带着宠物，随时可以向我请教。");
        } else if (status == 0) {
            cm.sendSimple("你想了解关于宠物的什么内容？#b\r\n#L0#了解关于宠物的基础知识。#l\r\n#L1#如何喂养和培养宠物？#l\r\n#L2#宠物也会死亡吗？#l\r\n#L3#棕色小猫和黑色小猫的指令是什么？#l\r\n#L4#棕色小狗的指令是什么？#l\r\n#L5#粉红兔子和白兔子的指令是什么？#l\r\n#L6#小魔龙的指令是什么？#l\r\n#L7#圣诞麋鹿的指令是什么？#l\r\n#L8#黑猪的指令是什么？#l\r\n#L9#熊猫的指令是什么？#l\r\n#L10#哈士奇的指令是什么？#l\r\n#L11#迪诺龙和妮诺龙的指令是什么？#l\r\n#L12#小猴子的指令是什么？#l\r\n#L13#火鸡的指令是什么？#l\r\n#L14#白虎的指令是什么？#l\r\n#L15#企鹅的指令是什么？#l\r\n#L16#金猪的指令是什么？#l\r\n#L17#机器人的指令是什么？#l\r\n#L18#迷你雪吉拉的指令是什么？#l\r\n#L19#巴洛古的指令是什么？#l\r\n#L20#宝贝龙的指令是什么？#l\r\n#L21#绿龙/红龙/蓝龙的指令是什么？#l\r\n#L22#黑龙的指令是什么？#l\r\n#L23#黑色幽灵的指令是什么？#l\r\n#L24#豪猪的指令是什么？#l\r\n#L25#雪人的指令是什么？#l\r\n#L26#臭鼬的指令是什么？#l\r\n#L27#请教我如何转移宠物能力。#l");
        } else if (status == 1) {
            sel = selection;
            if (selection == 0) {
                status = 3;
                cm.sendNext("原来你想了解关于宠物的诞生啊。很久以前，我用玩偶喷洒了生命之水，并对其施展了神奇的咒语，从而创造出这些不可思议的生灵。虽然听起来很神奇，但它们确实是由玩偶演变而来的生命。它们通人性，也非常喜欢跟随人类主人。");
            } else if (selection == 1) {
                status = 6;
                cm.sendNext("根据你给出的口令指令，宠物会做出高兴、难过等各种反应。如果你给宠物的指令能被它很好地执行，你们之间的亲密度就会提升。双击宠物，可以查看它的亲密度、等级、饱食度等各项状态……");
            } else if (selection == 2) {
                status = 11;
                cm.sendNext("死亡……嗯，严格来说它们并不是普通的肉身生命，所以用‘死亡’这个词可能不太准确。它们是由我的魔法力量与生命之水赋予灵性的玩偶。当然，在活动期间，它们就像真正的动物一样富有活力……");
            } else if (selection == 3) {
                cm.sendNext("这些是#r棕色小猫和黑色小猫#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏猫, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b说话, 说, 聊天#k (等级 10 ~ 30)\r\n#b可爱#k (等级 10 ~ 30)\r\n#b站起来, 站立, 起立#k (等级 20 ~ 30)");
            } else if (selection == 4) {
                cm.sendNext("这些是#r棕色小狗#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏狗, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 坏狗, 傻瓜#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b撒尿#k (等级 1 ~ 30)\r\n#b说话, 说, 聊天#k (等级 10 ~ 30)\r\n#b趴下#k (等级 10 ~ 30)\r\n#b站起来, 站, 起立#k (等级 20 ~ 30)");
            } else if (selection == 5) {
                cm.sendNext("这些是#r粉红兔子和白兔子#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b站起来, 站立, 起立#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b说话, 说, 聊天#k (等级 10 ~ 30)\r\n#b拥抱#k (等级 10 ~ 30)\r\n#b睡觉, 困了, 去睡觉#k (等级 20 ~ 30)");
            } else if (selection == 6) {
                cm.sendNext("这些是#r小魔龙#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b站起来, 站立, 起立#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b撒尿#k (等级 1 ~ 30)\r\n#b说话, 说, 聊天#k (等级 10 ~ 30)\r\n#b看这里, 魅力#k (等级 10 ~ 30)\r\n#b趴下#k (等级 10 ~ 30)\r\n#b好孩子, 好乖#k (等级 20 ~ 30)");
            } else if (selection == 7) {
                cm.sendNext("这些是#r圣诞麋鹿#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b站起来, 站立#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b圣诞快乐#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b说话, 说, 聊天#k (等级 11 ~ 30)\r\n#b孤独, 寂寞#k (等级 11 ~ 30)\r\n#b可爱#k (等级 11 ~ 30)\r\n#b出发, 快跑#k (等级 21 ~ 30)");
            } else if (selection == 8) {
                cm.sendNext("这些是#r黑猪#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏猪, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b握手#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 10 ~ 30)\r\n#b微笑#k (等级 10 ~ 30)\r\n#b魅力#k (等级 20 ~ 30)");
            } else if (selection == 9) {
                cm.sendNext("这些是#r熊猫#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b放松, 休息#k (等级 1 ~ 30)\r\n#b坏, 不行, 坏孩子#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b站起来, 站立, 起立#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 10 ~ 30)\r\n#b玩耍, 一起玩#k (等级 10 ~ 30)\r\n#b嗯, 呃#k (等级 10 ~ 30)\r\n#b睡觉#k (等级 20 ~ 30)");
            } else if (selection == 10) {
                cm.sendNext("这些是#r哈士奇#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏狗, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 坏狗, 傻瓜#k (等级 1 ~ 30)\r\n#b握手#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b趴下#k (等级 10 ~ 30)\r\n#b说话, 聊天, 说#k (等级 10 ~ 30)\r\n#b站起来, 站立, 起立#k (等级 20 ~ 30)");
            } else if (selection == 11) {
                cm.sendNext("这些是#r迪诺龙和妮诺龙#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏孩子, 不行, 坏男孩, 坏女孩#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b微笑, 笑#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 10 ~ 30)\r\n#b可爱#k (等级 10 ~ 30)\r\n#b睡觉, 小睡, 困了#k (等级 20 ~ 30)");
            } else if (selection == 12) {
                cm.sendNext("这些是#r小猴子#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b休息#k (等级 1 ~ 30)\r\n#b坏孩子, 不乖#k (等级 1 ~ 30)\r\n#b撒尿#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b站起来#k (等级 1 ~ 30)\r\n#b说话, 聊天#k (等级 10 ~ 30)\r\n#b玩耍#k (等级 10 ~ 30)\r\n#b我想你#k (等级 10 ~ 30)\r\n#b睡觉, 去睡觉, 困了#k (等级 20 ~ 30)");
            } else if (selection == 13) {
                cm.sendNext("这些是#r火鸡#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b不行, 坏蛋, 淘气#k (等级 1 ~ 30)\r\n#b笨蛋#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b站起来, 站立#k (等级 1 ~ 30)\r\n#b说话, 聊天, 叫#k (等级 10 ~ 30)\r\n#b乖, 好孩子#k (等级 10 ~ 30)\r\n#b困了, 打瞌睡, 睡觉#k (等级 20 ~ 30)\r\n#b鸟眼, 感恩节, 飞, 烤鸟, 我饿了#k (等级 30)");
            } else if (selection == 14) {
                cm.sendNext("这些是#r白虎#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏孩子, 不行, 坏男孩, 坏女孩#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b休息, 放松#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 10 ~ 30)\r\n#b悲伤, 伤心#k (等级 10 ~ 30)\r\n#b等待#k (等级 20 ~ 30)");
            } else if (selection == 15) {
                cm.sendNext("这些是#r企鹅#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏, 不行, 坏孩子, 坏女孩#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b站起来, 站, 起来#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 10 ~ 30)\r\n#b拥抱, 抱抱我#k (等级 10 ~ 30)\r\n#b挥手, 举手#k (等级 10 ~ 30)\r\n#b睡觉#k (等级 20 ~ 30)\r\n#b亲吻, 亲亲, 亲一个#k (等级 20 ~ 30)\r\n#b飞#k (等级 20 ~ 30)\r\n#b可爱, 可爱的#k (等级 20 ~ 30)");
            } else if (selection == 16) {
                cm.sendNext("这些是#r金猪#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏孩子, 不行, 坏蛋, 坏女孩#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 11 ~ 30)\r\n#b爱我, 拥抱我#k (等级 11 ~ 30)\r\n#b睡觉, 困了, 去睡觉#k (等级 21 ~ 30)\r\n#b无视, 印象深刻, 离开#k (等级 21 ~ 30)\r\n#b翻滚, 给我钱#k (等级 21 ~ 30)");
            } else if (selection == 17) {
                cm.sendNext("这些是#r机器人#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b站起来, 站立, 起立#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b坏, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b攻击, 冲锋#k (等级 1 ~ 30)\r\n#b我爱你#k (等级 1 ~ 30)\r\n#b好, 魅力#k (等级 11 ~ 30)\r\n#b说话, 聊天, 说#k (等级 11 ~ 30)\r\n#b变装, 变化, 变形#k (等级 11 ~ 30)");
            } else if (selection == 18) {
                cm.sendNext("这些是#r迷你雪吉拉#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏孩子, 不乖, 坏男孩, 坏女孩#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b跳舞, 舞动, 摇摆#k (等级 1 ~ 30)\r\n#b可爱, 可爱宝贝, 漂亮#k (等级 1 ~ 30)\r\n#b我爱你, 喜欢你, 我的爱#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 11 ~ 30)\r\n#b睡觉, 小睡, 困了, 去睡觉#k (等级 11 ~ 30)");
            } else if (selection == 19) {
                cm.sendNext("这些是#r巴洛古#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b趴下#k (等级 1 ~ 30)\r\n#b不行, 坏, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b我爱你, 我的爱, 喜欢你#k (等级 1 ~ 30)\r\n#b可爱, 漂亮#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b微笑, 笑#k (等级 1 ~ 30)\r\n#b吐舌头#k (等级 11 ~ 30)\r\n#b好, 魅力, 眼神#k (等级 11 ~ 30)\r\n#b说话, 聊天, 说#k (等级 11 ~ 30)\r\n#b睡觉, 小睡, 困了#k (等级 11 ~ 30)\r\n#b放屁#k (等级 21 ~ 30)");
            } else if (selection == 20) {
                cm.sendNext("这些是#r宝贝龙#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b不行, 坏, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b我爱你, 爱你#k (等级 1 ~ 30)\r\n#b拉屎#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b可爱#k (等级 11 ~ 30)\r\n#b说话, 聊天, 说#k (等级 11 ~ 30)\r\n#b睡觉, 困了, 去睡觉#k (等级 11 ~ 30)");
            } else if (selection == 21) {
                cm.sendNext("这些是#r绿龙/红龙/蓝龙#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 15 ~ 30)\r\n#b不行, 坏, 坏女孩, 坏男孩#k (等级 15 ~ 30)\r\n#b我爱你, 爱你#k (等级 15 ~ 30)\r\n#b拉屎#k (等级 15 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 15 ~ 30)\r\n#b说, 聊天, 说话#k (等级 15 ~ 30)\r\n#b睡觉, 困了, 去睡觉#k (等级 15 ~ 30)\r\n#b变身#k (等级 21 ~ 30)");
            } else if (selection == 22) {
                cm.sendNext("这些是#r黑龙#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 15 ~ 30)\r\n#b不行, 坏, 坏女孩, 坏男孩#k (等级 15 ~ 30)\r\n#b我爱你, 爱你#k (等级 15 ~ 30)\r\n#b拉屎#k (等级 15 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 15 ~ 30)\r\n#b说话, 聊天, 说#k (等级 15 ~ 30)\r\n#b睡觉, 困了, 去睡觉#k (等级 15 ~ 30)\r\n#b可爱, 变化#k (等级 21 ~ 30)");
            } else if (selection == 23) {
                cm.sendNext("这些是#r黑色幽灵#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b不行, 坏, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b装死, 拉屎#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 1 ~ 30)\r\n#b我爱你, 抱抱#k (等级 1 ~ 30)\r\n#b闻闻脚, 摇滚, 哇#k (等级 1 ~ 30)\r\n#b不给糖就捣蛋#k (等级 1 ~ 30)\r\n#b怪物乱舞#k (等级 1 ~ 30)");
            } else if (selection == 24) {
                cm.sendNext("这些是#r豪猪#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b不行, 坏, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b我爱你, 抱抱, 好孩子#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说#k (等级 1 ~ 30)\r\n#b靠垫, 睡觉, 织毛衣, 拉屎#k (等级 1 ~ 30)\r\n#b梳头, 沙滩#k (等级 10 ~ 30)\r\n#b树上忍者#k (等级 20 ~ 30)\r\n#b飞镖#k (等级 20 ~ 30)");
            } else if (selection == 25) {
                cm.sendNext("这些是#r雪人#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b笨蛋, 讨厌你, 傻瓜#k (等级 1 ~ 30)\r\n#b我爱你, 我的爱, 喜欢你#k (等级 1 ~ 30)\r\n#b圣诞快乐#k (等级 1 ~ 30)\r\n#b可爱, 漂亮#k (等级 1 ~ 30)\r\n#b梳理, 沙滩, 坏, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说, 睡觉, 困了, 去睡觉#k (等级 10 ~ 30)\r\n#b变化#k (等级 20 ~ 30)");
            } else if (selection == 26) {
                cm.sendNext("这些是#r臭鼬#k的口令指令（括号内为响应所需的宠物等级）：\r\n#b坐下#k (等级 1 ~ 30)\r\n#b坏, 不行, 坏女孩, 坏男孩#k (等级 1 ~ 30)\r\n#b休息, 放松, 拉屎#k (等级 1 ~ 30)\r\n#b说话, 聊天, 说, 我爱你#k (等级 1 ~ 30)\r\n#b依偎, 拥抱, 睡觉, 好孩子#k (等级 1 ~ 30)\r\n#b小胖子, 瞎子, 臭嘴#k (等级 10 ~ 30)\r\n#b穿上西装, 释放魅力#k (等级 20 ~ 30)");
            } else if (selection == 27) {
                status = 14;
                cm.sendNext("为了转移宠物的能力点、亲密度和等级，需要使用宠物能力转移卷轴。如果你把这个卷轴带到魔法密林的妖精玛露那里，她会把宠物的等级和亲密度转移到另一只宠物身上。看到你如此爱护宠物，我可以把这本卷轴以25万金币的价格卖给你。哦，对了！即使有了卷轴，也需要有一只新的宠物来继承能力才行哦。");
            }
            if (selection > 2 && selection < 27) {
                cm.dispose();
            }
        } else if (status == 2) {
            if (sel == 0) {
                cm.sendNextPrev("但是生命之水只在世界树的最底部微量凝结，因此能赋予玩偶活动的时间是有限的……虽然有点遗憾，但即使它变回了玩偶，只要再次注入生命之水就能唤醒它。所以在它陪伴你的时光里，一定要好好善待它。");
            } else if (sel == 1) {
                cm.sendNextPrev("经常和宠物说话并给予关注，它的亲密度就会提升，等级也会随之升高。随着等级的提升，有一天它甚至可能会像人类一样开口说话呢！当然，这需要付出不少耐心……");
            } else if (sel == 2) {
                cm.sendNextPrev("一段时间后……是的，它们会停止活动。当魔法效力消退、生命之水干涸时，它们就会变回普通的玩偶。但这并不意味着永远分别，只要重新注入生命之水，它们就会再次苏醒过来！");
            } else if (sel == 27) {
                cm.sendYesNo("购买宠物能力转移卷轴需要扣除25万金币。你确定要购买吗？");
            }
        } else if (status == 3) {
            if (sel == 0) {
                cm.sendNextPrev("对了，当你对它们下达特定指令时，它们会做出各种反应。你可以夸奖它们，也可以教训它们……这一切都取决于你的照料。它们最害怕离开主人，所以请多给它们一些关爱吧，否则它们会感到伤心和寂寞的……");
            } else if (sel == 1) {
                cm.sendNextPrev("虽然它们是由玩偶赋予生命的，但既然有了生命就会感到饥饿。#b饱食度#k 代表宠物的饥饿程度，满分是100分，数值越低说明宠物越饿。如果饱食度过低，它不仅不会听从你的命令，甚至还会闹脾气自己跑回背包，所以请一定要多加注意。");
            } else if (sel == 2) {
                cm.sendNextPrev("即使日后能再次唤醒，看到它们突然停下不动也挺让人难过的。所以在它们陪伴你的每一天里，请好好爱护并喂饱它们吧。有这样一个全心全意信任并跟随你的小家伙，难道不是很温馨的事吗？");
            } else if (sel == 27) {
                if (cm.getMeso() < 250000 || !cm.canHold(4160011)) {
                    cm.sendOk("请确认您的背包是否有足够的空位，并确认金币是否充足。");
                } else {
                    cm.gainMeso(-250000);
                    cm.gainItem(4160011, 1);
                }
                cm.dispose();
            }
        } else if (status == 4) {
            if (sel != 1) {
                cm.dispose();
            }
            cm.sendNextPrev("对了！宠物是不能吃人类食物的。不过，我的徒弟#b巴特斯#k在射手村市场出售#b宠物食品#k。如果你需要给宠物喂食，可以去射手村找他。最好提前备好宠物食品，在宠物饿的时候及时喂给它。");
        } else if (status == 5) {
            cm.sendNextPrev("还有，如果长时间不给宠物喂食，它就会自己回到背包里。虽然你可以再次把它召唤出来喂食，但这样对宠物的亲密度可不太好，所以记得定期喂养，别让它饿坏了，知道了吗？");
        } else {
            cm.dispose();
        }
    }
}