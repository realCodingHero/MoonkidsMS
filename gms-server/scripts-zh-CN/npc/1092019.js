/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    Copyleft (L) 2016 - 2019 RonanLana (HeavenMS)

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
/*
-- JavaScript -----------------
Lord Jonathan - Nautilus' Port
-- Created By --
    Cody (Cyndicate)
-- Totally Recreated by --
    Moogra
-- And Quest Script by --
    Ronan
-- Function --
No specific function, useless text.
-- GMS LIKE --
*/

var status;

var seagullProgress;
var seagullIdx = -1;
var seagullQuestion = ["有一天，我去海边抓了62只章鱼准备当晚餐。后来有个小孩跑过来送了我10只章鱼作为礼物！请问我现在一共有多少只章鱼？"];
var seagullAnswer = ["72"];

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

        if (status == 0) {    // missing script for skill test found thanks to Jade™
            if (!cm.isQuestStarted(6400)) {
                cm.sendOk("你在跟我说话吗？如果你只是无聊，去烦别人吧。");
                cm.dispose();
            } else {
                seagullProgress = cm.getQuestProgressInt(6400, 1);

                if (seagullProgress == 0) {
                    seagullIdx = Math.floor(Math.random() * seagullQuestion.length);

                    // string visibility thanks to ProXAIMeRx & Glvelturall
                    cm.sendNext("很好！现在出第一道题！你最好做好心理准备，因为这道题非常难，连我们海鸥一族都觉得十分棘手！");
                } else if (seagullProgress == 1) {
                    cm.sendNext("很好~ 接下来进入下一个测试。这次的考验难度更高，我要请巴特来帮我。你认识巴特对吧？");
                } else {
                    cm.sendNext("哇！太令人惊叹了！我的考验如此严苛，你竟然全部通过了……你确实是名副其实的优秀海盗，也是海鸥们最好的朋友！从今往后我们就是同生共死的伙伴了！朋友有难必定拔刀相助，若遇到紧急危机，随时呼唤我们海鸥吧！");
                }
            }
        } else if (status == 1) {
            if (seagullProgress == 0) {
                cm.sendGetText(seagullQuestion[seagullIdx]);
            } else if (seagullProgress == 1) {
                cm.sendNextPrev("我会把你送到诺特勒斯号的一个独立房间里。在那里你会看到9个巴特。哈哈哈~ 难道他们是九胞胎吗？当然不是啦，这是我为了测试你的洞察力而施加的一点小魔法。");
            } else {
                cm.sendNextPrev("使用技能【#q5221003#】召唤我们，海鸥大队会立刻赶来支援你！这就是伙伴之间的羁绊！\r\n\r\n  #s5221003# #b#q5221003#k");
            }
        } else if (status == 2) {
            if (seagullIdx > -1) {
                var answer = cm.getText();
                if (answer == seagullAnswer[seagullIdx]) {
                    cm.sendNext("什么？！竟然答对了！天哪，你太聪明了！在海鸥的世界里，凭你的智商绝对能拿到博士学位！太不可思议了……你真是个天才！");
                    cm.setQuestProgress(6400, 1, 1);
                    cm.dispose();
                } else {
                    cm.sendOk("嗯……答案好像不对哦，跟我记忆中的数字不符。重新算一下再来试试吧！");
                    cm.dispose();
                }
            } else if (seagullProgress != 2) {
                cm.sendNextPrev("在这9个巴特中，只有一个是真正的巴特。真正的海盗凭借敏锐的直觉和深厚的羁绊，一定能一眼认出自己的伙伴。如果你是真正的海盗，找出他应该轻而易举吧？准备好了吗，我现在就把你送过去！");
            } else {
                //cm.gainExp(1000000);
                //cm.teachSkill(5221003, 0, 10, -1);
                //cm.forceCompleteQuest(6400);

                cm.sendNextPrev("你已经应对了我所有的挑战，并且成功通过了！干得好！");
                cm.dispose();
            }
        } else if (status == 3) {
            var em = cm.getEventManager("4jaerial");
            if (!em.startInstance(cm.getPlayer())) {
                cm.sendOk("当前频道的测试考场已有其他玩家正在挑战，请更换频道或稍后再试。");
            }

            cm.dispose();
        }
    }
}