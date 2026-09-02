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
 * @author: Ronan
 * @npc: Romeo & Juliet (罗密欧与朱丽叶 - 终点结算)
 * @func: MagatiaPQ exit
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

        var eim = cm.getEventInstance();

        if (status == 0) {
            if (eim.getIntProperty("escortFail") == 1) {
                cm.sendNext("多亏了大家相助，我们才能化险为夷再次相聚。犹泰因触犯玛加提亚的禁忌法律，将会依法接受审判与严加看管。再次感谢你们的援手！");
            } else {
                cm.sendNext("太感谢你们了！多亏了大家的英勇奋战，我们才得以再次平安团聚。虽然犹泰因为对力量的执念走入了歧途，但他卓越的研究才能对城镇的发展仍然至关重要。炼金术协会将对他进行看管与感化，引导他用炼金术造福玛加提亚。再次衷心地感谢你们！");
            }
        } else {
            if (eim.giveEventReward(cm.getPlayer())) {
                cm.warp((eim.getIntProperty("isAlcadno") == 0) ? 261000011 : 261000021);
            } else {
                cm.sendOk("请在领取奖励前为您的背包腾出足够的空位。");
            }

            cm.dispose();
        }
    }
}
