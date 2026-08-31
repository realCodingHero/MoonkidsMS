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
/* The Forgotten Temple Manager
 * 
 * Deep Place of Temple - Forgotten Twilight (270050000)
 * Vs Pink Bean Recruiter NPC
 * 
 * @author Ronan
 */

var status = 0;
var expedition;
var expedMembers;
var player;
var em;
const ExpeditionType = Java.type('org.gms.server.expeditions.ExpeditionType');
var exped = ExpeditionType.PINKBEAN;
var expedTitle = "众神的黄昏";
var expedBoss = "品克缤";
var expedMap = "众神的黄昏";

var list = "你想做什么？#b\r\n\r\n#L1#查看当前远征队成员#l\r\n#L2#开始战斗！#l\r\n#L3#解散远征队#l#k";

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {

    player = cm.getPlayer();
    expedition = cm.getExpedition(exped);
    em = cm.getEventManager("PinkBeanBattle");

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            if (player.getLevel() < exped.getMinLevel() || player.getLevel() > exped.getMaxLevel()) { //Don't fit requirement, thanks Conrad
                cm.sendOk("你的等级不符合挑战" + expedBoss + "的条件！");
                cm.dispose();
            } else if (expedition == null) { //Start an expedition
                cm.sendSimple("#e#b<远征队：" + expedTitle + ">\r\n#k#n" + em.getProperty("party") + "\r\n\r\n你想组建远征队来挑战 #r" + expedBoss + "#k 吗？\r\n#b#L1#立即组建远征队！#l\r\n#L2#不，我想再准备一下……#l#k");
                status = 1;
            } else if (expedition.isLeader(player)) { //If you're the leader, manage the exped
                if (expedition.isInProgress()) {
                    cm.sendOk("你的远征队已经在进行挑战了，让我们为那些正在奋战的勇敢勇士们祈祷吧。");
                    cm.dispose();
                } else {
                    cm.sendSimple(list);
                    status = 2;
                }
            } else if (expedition.isRegistering()) { //If the expedition is registering
                if (expedition.contains(player)) { //If you're in it but it hasn't started, be patient
                    cm.sendOk("你已经加入了这次远征。请等待远征队长 #r" + expedition.getLeader().getName() + "#k 开启战斗。");
                    cm.dispose();
                } else { //If you aren't in it, you're going to get added
                    cm.sendOk(expedition.addMember(cm.getPlayer()));
                    cm.dispose();
                }
            } else if (expedition.isInProgress()) { //Only if the expedition is in progress
                if (expedition.contains(player)) { //If you're registered, warp you in
                    var eim = em.getInstance("PinkBean" + player.getClient().getChannel());
                    if (eim.getIntProperty("canJoin") == 1) {
                        eim.registerPlayer(player);
                    } else {
                        cm.sendOk("你的远征队已经开始对抗" + expedBoss + "的战斗。让我们为这些勇敢的勇士们祈祷。");
                    }

                    cm.dispose();
                } else { //If you're not in by now, tough luck
                    cm.sendOk("另一支远征队正在挑战" + expedBoss + "，让我们为那些勇敢的勇士们祈祷吧。");
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            if (selection == 1) {
                expedition = cm.getExpedition(exped);
                if (expedition != null) {
                    cm.sendOk("已经有人创建了远征队。你可以尝试申请加入他们！");
                    cm.dispose();
                    return;
                }

                var res = cm.createExpedition(exped);
                if (res == 0) {
                    cm.sendOk("#r" + expedBoss + " 远征队#k 已成功创建。\r\n\r\n再次与我对话，即可查看当前队员或开始战斗！");
                } else if (res > 0) {
                    cm.sendOk("抱歉，您今日挑战该远征的次数已达上限！请明日再来尝试……");
                } else {
                    cm.sendOk("创建远征队时发生未知错误，请稍后再试。");
                }

                cm.dispose();

            } else if (selection == 2) {
                cm.sendOk("当然，并非每个人都有勇气挑战" + expedBoss + "。");
                cm.dispose();

            }
        } else if (status == 2) {
            if (selection == 1) {
                if (expedition == null) {
                    cm.sendOk("无法加载远征队信息。");
                    cm.dispose();
                    return;
                }
                expedMembers = expedition.getMemberList();
                var size = expedMembers.size();
                if (size == 1) {
                    cm.sendOk("你是远征队中唯一的成员。");
                    cm.dispose();
                    return;
                }
                var text = "以下是当前远征队的成员（点击成员名字可以将其请离远征队）：\r\n";
                text += "\r\n		1." + expedition.getLeader().getName();
                for (var i = 1; i < size; i++) {
                    text += "\r\n#b#L" + (i + 1) + "#" + (i + 1) + ". " + expedMembers.get(i).getValue() + "#l\n";
                }
                cm.sendSimple(text);
                status = 6;
            } else if (selection == 2) {
                var min = exped.getMinSize();

                var size = expedition.getMemberList().size();
                if (size < min) {
                    cm.sendOk("你的远征队至少需要有 " + min + " 名玩家报名才能开始。");
                    cm.dispose();
                    return;
                }

                cm.sendOk("远征即将开始，现在将护送你们前往 #b" + expedMap + "#k。");
                status = 4;
            } else if (selection == 3) {
                const PacketCreator = Java.type('org.gms.util.PacketCreator');
                player.getMap().broadcastMessage(PacketCreator.serverNotice(6, expedition.getLeader().getName() + " 的远征挑战已结束。"));
                cm.endExpedition(expedition);
                cm.sendOk("本次远征已解散。审时度势撤退也是一种明智的策略。");
                cm.dispose();

            }
        } else if (status == 4) {
            if (em == null) {
                cm.sendOk("副本事件无法初始化，请向管理员反馈此问题。");
                cm.dispose();
                return;
            }

            em.setProperty("leader", player.getName());
            em.setProperty("channel", player.getClient().getChannel());
            if (!em.startInstance(expedition)) {
                cm.sendOk("另一支远征队正在挑战" + expedBoss + "，让我们为那些勇敢的勇士们祈祷吧。");
                cm.dispose();
                return;
            }

            cm.dispose();

        } else if (status == 6) {
            if (selection > 0) {
                var banned = expedMembers.get(selection - 1);
                expedition.ban(banned);
                cm.sendOk("你已经将 " + banned.getValue() + " 请离了远征队。");
                cm.dispose();
            } else {
                cm.sendSimple(list);
                status = 2;
            }
        }
    }
}
