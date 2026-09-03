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
/* Nana, the Love fairy
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

function hasProofOfLoves(player) {
    var count = 0;

    for (var i = 4031367; i <= 4031372; i++) {
        if (player.haveItem(i)) {
            count++;
        }
    }

    return count >= 4;
}

function getNanaLocation(player) {
    var mapid = player.getMap().getId();

    for (var i = 0; i < mapids.length; i++) {
        if (mapid == mapids[i]) {
            return i;
        }
    }

    return -1;
}

var nanaLoc;
var mapids = [100000000, 103000000, 102000000, 101000000, 200000000, 220000000];
var questItems = [4000001, 4000037, 4000215, 4000026, 4000070, 4000128];
var questExp = [2000, 5000, 10000, 17000, 22000, 30000];

function processNanaQuest() {
    if (cm.haveItem(questItems[nanaLoc], 50)) {
        if (cm.canHold(4031367 + nanaLoc, 1)) {
            cm.gainItem(questItems[nanaLoc], -50);
            cm.gainItem(4031367 + nanaLoc, 1);

            cm.sendOk("哇~ 太感谢你了！请收下这枚 #b#t" + (4031367 + nanaLoc) + "##k。");
            return true;
        } else {
            cm.sendOk("请确保你的其它栏至少有 1 个空位来存放爱心信物。");
        }
    } else {
        cm.sendOk("请帮我收集 #b50 个 #t" + questItems[nanaLoc] + "##k 拿来给我吧。");
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
            if (!cm.isQuestStarted(100400)) {
                cm.sendOk("你好 #b#h0##k，我是爱之仙子 #p9201025#。");
                cm.dispose();
                return;
            }

            nanaLoc = getNanaLocation(cm.getPlayer());
            if (nanaLoc == -1) {
                cm.sendOk("你好 #b#h0##k，我是爱之仙子 #p9201025#。");
                cm.dispose();
                return;
            }

            if (!cm.haveItem(4031367 + nanaLoc, 1)) {
                if (cm.isQuestCompleted(100401 + nanaLoc)) {
                    state = 1;
                    cm.sendAcceptDecline("你把你之前得到的 #k#t" + (4031367 + nanaLoc) + "##k 弄丢了吗？好吧，我可以再给你补发一枚，不过你需要再帮我一个小忙，可以吗？请帮我收集 #r50 个 #t" + questItems[nanaLoc] + "##k。");
                } else if (cm.isQuestStarted(100401 + nanaLoc)) {
                    if (processNanaQuest()) {
                        cm.gainExp(questExp[nanaLoc] * cm.getPlayer().getExpRate());
                        cm.completeQuest(100401 + nanaLoc);
                    }

                    cm.dispose();
                } else {
                    state = 0;
                    cm.sendAcceptDecline("你正在寻找 #k#t" + (4031367 + nanaLoc) + "##k 吗？我可以赠送你一枚，不过你得先帮我一个小忙，愿意帮我吗？");
                }
            } else {
                cm.sendOk("你好呀！你已经拿到了我这里的信物了。你从其他地区的娜娜那里收集到足够的 #b#t4031367##k 了吗？");
                cm.dispose();
            }
        } else if (status == 1) {
            if (state == 0) {
                cm.startQuest(100401 + nanaLoc);

                cm.sendOk("那就拜托你帮我收集 #r50 个 #t" + questItems[nanaLoc] + "##k 啦！");
                cm.dispose();
            } else {
                processNanaQuest();
                cm.dispose();
            }
        }
    }
}