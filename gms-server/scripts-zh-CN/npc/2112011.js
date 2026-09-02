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
/* Yulete (犹泰)
	Traces of Yulete (926110500)
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("我居然……被打败了……难道我犹泰的研究心血，注定就要这样悲惨地收场吗……你们现在满意了吧？接下来我恐怕只能在暗无天日的牢房里度过余生了。可是，我所做的一切……真的全都是为了玛加提亚的未来啊！！呜呜呜……#L1#振作一点吧！所幸事情还没有到无法挽回的地步。玛加提亚之所以制定严苛的法律，正是为了防止如此危险的禁忌力量失控危害民众。这并不是你的绝路，好好反省并接受协会的感化与看管，一切都还能重新开始！#l");
        } else if (status == 1) {
            cm.sendNext("“……在做了这么多错事之后，你们居然还愿意原谅我？唉，看来我确实被追求禁忌力量的狂热冲昏了头脑。或许大家说得对，若没有足够的自制力，盲目触碰这种力量只会让人彻底堕落走入歧途……我由衷地向大家道歉。为了弥补我所犯下的过错，今后我愿意协助两大学派，为玛加提亚的炼金术正道贡献力量。谢谢你们……”");
        } else {
            if (!cm.isQuestCompleted(7770)) {
                cm.completeQuest(7770);
            }

            cm.warp(926110600, 0);
            cm.dispose();
        }
    }
}
