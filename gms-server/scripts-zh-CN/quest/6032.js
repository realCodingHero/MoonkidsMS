/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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
/* 
	Quest: Meren's Class on the Actual Practice
 */

var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendNext("你是来听我的实习课程的吧？好，我长话短说。");
        } else if (status == 1) {
            qm.sendNextPrev("我来教你#b锻造技能#k的实际应用技巧。其实很简单，你只要在脑海中构思出想要制作的道具，照着图纸备齐材料，再通过#r科学与炼金术相结合的方式#k进行融合熔炼即可。很简单吧？");
        } else if (status == 2) {
            qm.sendNextPrev("以制作#b重力耳环#k为例。每种独特的道具在生成时都有其特定的#r延展理论#k，它的命名通常与所涉及的#r核心物理作用力#k相关——在这个例子中，就是#b重力延展理论#k（既然是“重力耳环”，你应该能明白吧？）");
        } else if (status == 3) {
            qm.sendNextPrev("好了，现在你需要支付10,000金币的学费。这笔费用将用于采购你后续深入研习#b锻造技术#k所需的实验耗材。");
        } else if (status == 4) {
            qm.gainMeso(-10000);

            qm.forceCompleteQuest();
            qm.dispose();
        }

        }
    }

