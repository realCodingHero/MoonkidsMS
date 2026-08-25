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
/* Maker Skill
	Moren's Second round of teaching
	2nd skill level
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
            qm.sendNext("嗯，你声称带来了#b#t4260003##k？好，让我仔细瞧瞧。");
        } else if (status == 1) {
            if (qm.getQuestProgressInt(6033) == 1 && qm.haveItem(4260003, 1)) {
                qm.sendNextPrev("你确实制作了一块品质精良的怪物结晶，非常不错。你通过考验了！现在，我将传授你下一阶段的锻造技能。这块怪物结晶你自己留着吧，这是你的劳动成果。");
            } else {
                qm.sendNext("喂，怎么回事？我明明告诉过你必须亲手制作一块怪物结晶才能通过我的测试，对吧？在测试前从别人那里购买可不算数。快去亲手制作一块#b#t4260003##k交给我。");
                qm.dispose();

            }
        } else if (status == 2) {
            qm.forceCompleteQuest();

            var skillid = Math.floor(qm.getPlayer().getJob().getId() / 1000) * 10000000 + 1007;
            qm.teachSkill(skillid, 2, 3, -1);
            qm.gainExp(230000);
            qm.dispose();
        }
    }
}
