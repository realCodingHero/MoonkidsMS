/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2017 RonanLana

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
/* Moony
	Amoria (680000000)
	Engagement ring NPC.
 */

var status;
var state;

var item;
var mats;
var matQty;
var cost;

var options;

function hasEngagementBox(player) {
    for (var i = 2240000; i <= 2240003; i++) {
        if (player.haveItem(i)) {
            return true;
        }
    }

    return false;
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
            options = ["我想制作一枚订婚戒指。", "我想丢弃多余的戒指盒。"];
            cm.sendSimple("我是#p9201000#，专业的订婚戒指工匠。请问有什么我可以效劳的吗？\r\n\r\n#b" + generateSelectionMenu(options));
        } else if (status == 1) {
            if (selection == 0) {
                if (!cm.isQuestCompleted(100400)) {
                    if (!cm.isQuestStarted(100400)) {
                        state = 0;
                        cm.sendNext("你想制作订婚戒指是吗？好的，不过你必须先去获得#b#p9201003#k的#r真爱祝福#k，我才能为你打造。");
                    } else {
                        cm.sendOk("在制作订婚戒指之前，请先去获得#b#p9201003#k的祝福。他就在#r射手村狩猎场#k的附近等你。");
                        cm.dispose();
                    }
                } else {
                    if (hasEngagementBox(cm.getPlayer())) {
                        cm.sendOk("抱歉，你身上已经有一个戒指盒了。一个人一次只能持有一个戒指盒。");
                        cm.dispose();
                        return;
                    }
                    if (cm.getPlayer().getGender() != 0) {
                        cm.sendOk("抱歉，订婚戒指盒目前只能由男性角色申领。");
                        cm.dispose();
                        return;
                    }

                    state = 1;
                    options = ["月光石订婚戒指", "星石订婚戒指", "金心订婚戒指", "银天鹅订婚戒指"];
                    var selStr = "那么，你想让我为你制作哪种订婚戒指？\r\n\r\n#b" + generateSelectionMenu(options);
                    cm.sendSimple(selStr);
                }
            } else {
                if (hasEngagementBox(cm.getPlayer())) {
                    for (var i = 2240000; i <= 2240003; i++) {
                        cm.removeAll(i);
                    }

                    cm.sendOk("你的戒指盒已被销毁。");
                } else {
                    cm.sendOk("你身上没有可以销毁的戒指盒。");
                }

                cm.dispose();
            }
        } else if (status == 2) {
            if (state == 0) {
                cm.sendOk("你问他们住在哪里？哦，这说来话长了……你知道的，我是他们的老朋友，当年也是我亲自打造并送去他们的订婚戒指。他们就住在#r林中之城狩猎场#k的深处，相信你一定能找到那里。");
                cm.startQuest(100400);
                cm.dispose();
            } else {
                var itemSet = [2240000, 2240001, 2240002, 2240003];
                var matSet = [[4011007, 4021007], [4021009, 4021007], [4011006, 4021007], [4011004, 4021007]];
                var matQtySet = [[1, 1], [1, 1], [1, 1], [1, 1]];
                var costSet = [30000, 20000, 10000, 5000];

                item = itemSet[selection];
                mats = matSet[selection];
                matQty = matQtySet[selection];
                cost = costSet[selection];

                var prompt = "你确定要制作 #b#t" + item + "#k 吗？";
                prompt += "\r\n制作这枚戒指需要准备以下材料与手续费，请确保你的背包有足够的空位：#b";

                if (mats instanceof Array) {
                    for (var i = 0; i < mats.length; i++) {
                        prompt += "\r\n#i" + mats[i] + "# " + matQty[i] + " 个 #t" + mats[i] + "#";
                    }
                } else {
                    prompt += "\r\n#i" + mats + "# " + matQty + " 个 #t" + mats + "#";
                }

                if (cost > 0) {
                    prompt += "\r\n#i4031138# " + cm.numberWithCommas(cost) + " 金币";
                }

                cm.sendYesNo(prompt);
            }
        } else if (status == 3) {
            var complete = true;
            var recvItem = item, recvQty = 1, qty = 1;

            if (!cm.canHold(recvItem, recvQty)) {
                cm.sendOk("请先确认您的背包中是否有足够的空位。");
                cm.dispose();
                return;
            } else if (cm.getMeso() < cost * qty) {
                cm.sendOk("对不起，制作戒指需要收取相应的手续费。请带够所需金币后再来吧。");
                cm.dispose();
                return;
            } else {
                if (mats instanceof Array) {
                    for (var i = 0; complete && i < mats.length; i++) {
                        if (!cm.haveItem(mats[i], matQty[i] * qty)) {
                            complete = false;
                        }
                    }
                } else if (!cm.haveItem(mats, matQty * qty)) {
                    complete = false;
                }
            }

            if (!complete) {
                cm.sendOk("嗯……看来你还缺少制作订婚戒指所需的某些材料。请备齐材料后再来找我。");
            } else {
                if (mats instanceof Array) {
                    for (var i = 0; i < mats.length; i++) {
                        cm.gainItem(mats[i], -matQty[i] * qty);
                    }
                } else {
                    cm.gainItem(mats, -matQty * qty);
                }

                if (cost > 0) {
                    cm.gainMeso(-cost * qty);
                }

                cm.gainItem(recvItem, recvQty);
                cm.sendOk("大功告成！这枚订婚戒指打造得精致而完美。祝你们订婚快乐、幸福美满！");
            }
            cm.dispose();
        }
    }
}

function generateSelectionMenu(array) {
    var menu = "";
    for (var i = 0; i < array.length; i++) {
        menu += "#L" + i + "#" + array[i] + "#l\r\n";
    }
    return menu;
}
