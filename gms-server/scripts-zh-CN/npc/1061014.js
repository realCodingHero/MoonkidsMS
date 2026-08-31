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
/*
 *
 *@author Ronan
 */

var status = 0;
var expedition;
var expedMembers;
var player;
var em;
const ExpeditionType = Java.type('org.gms.server.expeditions.ExpeditionType');
const exped = ExpeditionType.BALROG_NORMAL;
var expedName = "魔王巴洛古";
var expedBoss = "魔王巴洛古";
var expedMap = "魔王巴洛古墓地";

var list = "你想做什么？#b\r\n\r\n#L1#查看当前远征队成员#l\r\n#L2#开始战斗！#l\r\n#L3#解散/退出远征队#l";

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {

    player = cm.getPlayer();
    expedition = cm.getExpedition(exped);
    em = cm.getEventManager("BalrogBattle");

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            if (player.getLevel() < exped.getMinLevel() || player.getLevel() > exped.getMaxLevel()) { //Don't fit requirement, thanks Conrad
                cm.sendOk("你的等级不符合与" + expedBoss + "战斗的条件！");
                cm.dispose();
            } else if (expedition == null) { //Start an expedition
                cm.sendSimple("#e#b<远征队：" + expedName + ">\r\n#k#n" + em.getProperty("party") + "\r\n\r\n你想组建远征队来挑战 #r" + expedBoss + "#k 吗？\r\n#b#L1#开始创建远征队！#l\r\n#L2#不，我想再等等……#l\r\n#L3#我想了解关于这次远征的信息……#l");
                status = 1;
            } else if (expedition.isLeader(player)) { //If you're the leader, manage the exped
                if (expedition.isInProgress()) {
                    cm.sendOk("你的远征队已经在战斗中了。让我们为浴血奋战的勇士们祈祷吧。");
                    cm.dispose();
                } else {
                    cm.sendSimple(list);
                    status = 2;
                }
            } else if (expedition.isRegistering()) { //If the expedition is registering
                if (expedition.contains(player)) { //If you're in it but it hasn't started, be patient
                    cm.sendOk("你已经加入了该远征队。请耐心等待队长 #r" + expedition.getLeader().getName() + "#k 开启战斗。");
                    cm.dispose();
                } else { //If you aren't in it, you're going to get added
                    cm.sendOk(expedition.addMember(cm.getPlayer()));
                    cm.dispose();
                }
            } else if (expedition.isInProgress()) { //Only if the expedition is in progress
                if (expedition.contains(player)) { //If you're registered, warp you in
                    var eim = em.getInstance(expedName + player.getClient().getChannel());
                    if (eim.getIntProperty("canJoin") == 1) {
                        eim.registerPlayer(player);
                    } else {
                        cm.sendOk("你的远征队已经开始挑战" + expedBoss + "了。让我们为勇敢的战士们祈祷吧。");
                    }

                    cm.dispose();
                } else { //If you're not in by now, tough luck
                    cm.sendOk("已有其他远征队正在挑战" + expedBoss + "，让我们为勇敢的战士们祈祷吧。");
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            if (selection == 1) {
                expedition = cm.getExpedition(exped);
                if (expedition != null) {
                    cm.sendOk("已经有人创建了远征队，去尝试加入他们吧！");
                    cm.dispose();
                    return;
                }

                var res = cm.createExpedition(exped);
                if (res == 0) {
                    cm.sendOk("#r" + expedBoss + " 远征队#k 创建成功！\r\n\r\n请再次与我对话以查看远征队员或进入战场。");
                } else if (res > 0) {
                    cm.sendOk("抱歉，你今天的远征挑战次数已达上限，请明天再来尝试！");
                } else {
                    cm.sendOk("创建远征队时发生未知错误，请稍后重试。");
                }

                cm.dispose();

            } else if (selection == 2) {
                cm.sendOk("也是，毕竟挑战" + expedBoss + "需要十足的勇气。");
                cm.dispose();

            } else {
                cm.sendSimple("你好。我是神殿守护者#b#n无影#n#k。这座神殿目前正遭到魔王巴洛克军团的围攻。我们尚不清楚究竟是谁下达的指令。" +
                    "几周以来，#e#b牛郎星骑士团#n#k一直在派遣雇佣兵，但每次都全军覆没了。" +
                    " 所以，旅行者，你想试试看能否击败这个可怕的梦魇吗？\r\n  #L1#什么是#e牛郎星骑士团？#n");

                status = 10;
            }
        } else if (status == 2) {
            if (selection == 1) {
                if (expedition == null) {
                    cm.sendOk("无法加载远征队数据。");
                    cm.dispose();
                    return;
                }
                expedMembers = expedition.getMemberList();
                var size = expedMembers.size();
                if (size == 1) {
                    cm.sendOk("你是当前远征队中唯一的成员。");
                    cm.dispose();
                    return;
                }
                var text = "以下是你的远征队成员列表（点击成员名字可以将其请离队伍）：\r\n";
                text += "\r\n\t\t1." + expedition.getLeader().getName();
                for (var i = 1; i < size; i++) {
                    text += "\r\n#b#L" + (i + 1) + "#" + (i + 1) + ". " + expedMembers.get(i).getValue() + "#l\n";
                }
                cm.sendSimple(text);
                status = 6;
            } else if (selection == 2) {
                var min = exped.getMinSize();
                var size = expedition.getMemberList().size();
                if (size < min) {
                    cm.sendOk("远征队至少需要 " + min + " 名成员才能开启挑战。");
                    cm.dispose();
                    return;
                }

                cm.sendOk("远征队准备出发！现在将把你们传送至 #b" + expedMap + "#k。");
                status = 4;
            } else if (selection == 3) {
                const PacketCreator = Java.type('org.gms.util.PacketCreator');
                player.getMap().broadcastMessage(PacketCreator.serverNotice(6, expedition.getLeader().getName() + " 的远征队已解散。"));
                cm.endExpedition(expedition);
                cm.sendOk("远征队已解散。有时候审时度势也是一种明智的策略。");
                cm.dispose();

            }
        } else if (status == 4) {
            if (em == null) {
                cm.sendOk("副本事件初始化失败，请联系管理员。");
                cm.dispose();
                return;
            }

            em.setProperty("leader", player.getName());
            em.setProperty("channel", player.getClient().getChannel());
            if (!em.startInstance(expedition)) {
                cm.sendOk("已有其他远征队正在挑战" + expedBoss + "，让我们为勇敢的战士们祈祷吧。");
                cm.dispose();
                return;
            }

            cm.dispose();

        } else if (status == 6) {
            if (selection > 0) {
                var banned = expedMembers.get(selection - 1);
                expedition.ban(banned);
                cm.sendOk("你已将 " + banned.getValue() + " 请离远征队。");
                cm.dispose();
            } else {
                cm.sendSimple(list);
                status = 2;
            }
        } else if (status == 10) {
            cm.sendOk("牛郎星骑士团是由一群精英雇佣兵组成的组织，负责监督大陆的安全与战斗行动。该组织在数百年前黑魔法师被封印后成立，旨在防范黑暗势力的再次复苏。");
            cm.dispose();
        }
    }
}