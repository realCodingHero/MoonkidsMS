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
 *9201003.js - Mom and Dad
 *@author Jvlaple
 *@author Ronan
 */
var numberOfLoves = 0;
var status = -1;
var state = 0;

function hasProofOfLoves(player) {
    var count = 0;

    for (var i = 4031367; i <= 4031372; i++) {
        if (player.haveItem(i)) {
            count++;
        }
    }

    return count >= 4;
}

function start() {
    status = -1;
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

        if (status == 0) {
            if (!cm.isQuestStarted(100400)) {
                cm.sendOk("你好，我们是罗宾和拉尔……");
                cm.dispose();
            } else {
                if (cm.getQuestProgressInt(100400, 1) == 0) {
                    cm.sendNext("爸爸、妈妈，我有一个请求想向你们请教……我想向我心爱的人求婚，请指引我如何像你们一样，走过充满爱与关怀的相伴之路。");
                } else {
                    if (!hasProofOfLoves(cm.getPlayer())) {
                        cm.sendOk("孩子，我们需要确认你是否真正做好了全心全意去爱伴侣的准备。请为我们带回 #b4 个 #t4031367#k。");
                        cm.dispose();
                    } else {
                        cm.sendNext("#b#h0#k，你今天真让我们感到无比骄傲！你已经获得了我们的真爱祝福，可以去向你心仪的伴侣求婚了。现在去阿莫利亚找订婚戒指工匠 #p9201000# 吧。愿你们的未来充满爱与幸福~~");
                        state = 1;
                    }
                }
            }
        } else if (status == 1) {
            if (state == 0) {
                cm.sendNextPrev("好孩子！你能来向我们征求祝福，真是太懂事了。我们一定会全力支持你！");
            } else {
                cm.sendOk("爸爸……妈妈……非常感谢你们的理解与祝福！！！");

                cm.completeQuest(100400);
                cm.gainExp(20000 * cm.getPlayer().getExpRate());
                for (var i = 4031367; i <= 4031372; i++) {
                    cm.removeAll(i);
                }

                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("在枫之谷世界各大城镇中，住着负责守护爱情的爱之仙子#r娜娜#k。去拜访她们并收集 #b4 个 #t4031367#k 带回来给我们吧。这段旅程会让你明白爱情的真正意义……");
        } else if (status == 3) {
            cm.setQuestProgress(100400, 1, 1);
            cm.dispose();
        }
    }
}