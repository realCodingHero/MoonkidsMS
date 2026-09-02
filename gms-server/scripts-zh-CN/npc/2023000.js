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

var toMap = [211040200, 220050300, 220000000, 240030000];
var inMap = [211000000, 220000000, 221000000, 240000000];
var cost = [10000, 25000, 25000, 65000];
var location;
var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.sendNext("嗯，请仔细考虑一下。虽然价格不算便宜，但您绝对不会对我们的顶级服务感到失望！");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            for (var i = 0; i < toMap.length; i++) {
                if (inMap[i] == cm.getPlayer().getMap().getId()) {
                    location = i;
                    break;
                }
            }
            cm.sendNext("你好！这是能够比飞箭更快地将你送往危险地带的危险地区出租车！我们可以带你从 #m" + inMap[location] + "# 前往神秘岛各处的 #b#m" + toMap[location] + "#k！费用是 #b" + cost[location] + " 金币#k。虽然有点贵，但能避开沿途所有凶险的怪物，绝对物超所值！");
        } else if (status == 1) {
            cm.sendYesNo("你想支付 #b" + cost[location] + " 金币#k 前往 #b#m" + toMap[location] + "#k 吗？");
        } else if (status == 2) {
            if (cm.getMeso() < cost[location]) {
                cm.sendNext("你身上的金币好像不够呢。非常抱歉，如果没有支付全额车费，我是不能发车的。多去狩猎赚些金币后再来吧。");
            } else {
                cm.warp(toMap[location], location != 1 ? 0 : 1);
                cm.gainMeso(-cost[location]);
            }
            cm.dispose();
        }
    }
}