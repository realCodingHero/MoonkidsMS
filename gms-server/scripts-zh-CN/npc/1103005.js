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
 * @NPC: Cygnus
 * @ID: 1103005
 * @Map Id: 913040006
 * @Function: Cygnus Creator
 * @Author Jay <text>
 * @Author David
 */

function start() {
    cm.sendAcceptDecline("成为一名冒险骑士团骑士需要天赋、信念、勇气与坚强的意志……看起来你完全具备成为骑士的资质。你意下如何？如果你现在就想加入，我可以立刻送你前往圣地。你现在就想出发去圣地吗？");
}

function action(coded, by, Moogra) {
    if (coded > 0) {
        cm.warp(130000000);
    } else {
        try {
            cm.warp(cm.getPlayer().getSavedLocation("CYGNUSINTRO"));
        } catch (err) {
            cm.warp(100000000);
        }
    }
    cm.dispose();
}