/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

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

/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Jeff - El Nath : El Nath : Ice Valley II (211040200)
 -- By ---------------------------------------------------------------------------------------------
 Xterminator
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Xterminator
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;

function start() {
    if (cm.haveItem(4031450, 1)) {
        cm.warp(921100100, 1);
        cm.dispose();
        return;
    }

    cm.sendNext("嘿，你看起来似乎打算继续深入雪原更深处。不过我得提醒你，前面盘踞着异常凶猛危险的怪物，即使你觉得自己实力不俗，也千万不能掉以轻心。很久以前，我们村里的一些勇士为了消除对村庄的威胁进去了，但再也没有一个人能够活着回来……");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 1 && mode == 0 && cm.getLevel() > 49) {
            cm.sendNext("即使你的实力很强，里面的危险也绝非儿戏。如果你改变主意做好了心理准备，随时再来找我。毕竟我的职责就是看守这里的关口。");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            if (cm.getLevel() > 49) {
                cm.sendYesNo("如果你打算进去，我劝你最好还是打消这个念头。但如果你执意要去……我只放那些有能力在里面活下来的真正勇士进去。我不希望再看到有人白白送命。让我瞧瞧……嗯！你看起来确实相当精悍强壮。怎么样，你真的下定决心要进去吗？");
            } else {
                cm.sendPrev("如果你打算进去，我劝你最好还是打消这个念头。但我只放那些有能力在里面活下来的勇士进去。我不希望再看到有人白白送命。让我瞧瞧……嗯……你还没有达到 #b50级#k 呢。以你现在的实力进去必死无疑，我绝不能放你通行，快回去吧！");
            }
        } else if (status == 2) {
            if (cm.getLevel() >= 50) {
                cm.warp(211040300, 5);
            }
            cm.dispose();
        }
    }
}