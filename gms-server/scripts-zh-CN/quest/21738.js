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

var status = -1;

function start(mode, type, selection) {
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

        if (status == 0) {  // thanks ZERO傑洛 for noticing this quest shouldn't need a pw -- GMS-like string data thanks to skycombat
            qm.sendGetText("嗯，你有什么事？");
        } else if (status == 1) {
            qm.sendNext("（你向她说明了关于巨大食人花的情况。）", 3);
        } else if (status == 2) {
            qm.sendNext("巨大食人花？那确实是个大麻烦，但我认为还不至于真正危及天空之城。等等，你刚才说巨大食人花出现在哪里来着？", 9);
        } else if (status == 3) {
            qm.sendNext("散步路。", 3);
        } else if (status == 4) {
            qm.sendNext("……散步路？如果巨大食人花出现在那里，说明有人正试图闯入被封印的花园！可是为什么？更重要的是，到底是谁干的？", 9);
        } else if (status == 5) {
            qm.sendNext("Sealed Garden?", 3);
        } else if (status == 6) {
            qm.sendAcceptDecline("我现在还不能向你透露关于被封印花园的秘密。如果你想知道，我必须先确认你是否具备知晓这一切的资格。你介意我为你占卜一下命运吗？", 9);
        } else if (status == 7) {
            qm.sendOk("好，现在让我们来看看你的命运吧。请稍等片刻。");
        } else if (status == 8) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}
