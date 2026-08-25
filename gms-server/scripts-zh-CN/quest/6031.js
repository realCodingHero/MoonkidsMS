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
	Quest: Hughes the Fuse's Basic of Theory of Science
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
            qm.sendNext("我将教你有关科学理论的基础知识。");
        } else if (status == 1) {
            qm.sendNextPrev("科学阶段是炼金术无法企及的领域。所有物质都由分子构成，物品的#r分子排列结构与内在物质单位#k决定了该物品所具备的诸多属性。");
        } else if (status == 2) {
            qm.sendNextPrev("这也完全适用于#r锻造技能#k。工匠必须能够深入洞察构成道具的每一种材料成分，才能准确预判实验最终是成功还是失败。");
        } else if (status == 3) {
            qm.sendNextPrev("记住这一点：科学的核心视角与驱动力，永远在于#b理解事物演化与产出结果的过程#k，而不是盲目地胡乱尝试。");
        } else if (status == 4) {
            qm.sendNextPrev("听明白了吗？很好，那么今天的课程就到此为止。下课。");
        } else if (status == 5) {
            qm.gainMeso(-10000);

            qm.forceCompleteQuest();
            qm.dispose();
        }

    }
}
