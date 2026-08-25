/*
    This file is part of the HeavenMS (MapleSolaxiaV2) MapleStory Server
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

let status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1)
            status++;
        else
            status--;

        if (status == 0) {
            if ((qm.getQuestProgress(3311, 0) == 1 && qm.getQuestProgress(3311, 1) == 1) || qm.getQuestProgress(3311, 0) == 5) {
                // qm.sendNext("嗯，阿尔卡诺的炼金博士留下记录，说他正在研发一种性能远超现有型号的新型休罗伊德机器，并正准备进行最后的实机演练？我们已经整整三周没有他的音讯了，一定是出了什么意外……");
                qm.sendNext("嗯，那位名叫 卡帕莱特 的医生写了一些内容，提到他在研究一种先进的 氯化洛伊德 机器人技术——这种机器人远比现有的型号更强大。他似乎已经准备好了实验的最后阶段……不过我们已经有三周左右没有收到他的任何消息了，肯定出了什么问题……");
                qm.gainExp(60000 * qm.getPlayer().getExpRate());
                qm.forceCompleteQuest();
            } else {
                // qm.sendNext("还没有发现任何线索吗？请务必仔细搜查德朗博士的住所，那里一定留下了能揭开真相的线索。");
                qm.sendNext("还没找到任何线索吗？请仔细检查德朗博士的房子，那里肯定有什么东西能帮助我们了解到底发生了什么。");
            }

            qm.dispose();
        }
    }
}