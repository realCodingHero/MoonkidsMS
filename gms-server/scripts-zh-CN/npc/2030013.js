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
/*Adobis
 *
 *@author Alan (SharpAceX)
 *@author Ronan
 */

var status = 0;
var expedition;
var expedMembers;
var player;
var em;
const ExpeditionType = Java.type('org.gms.server.expeditions.ExpeditionType');
const exped = ExpeditionType.ZAKUM;
var expedName = "Zakum";
var expedBoss = "扎昆";
var expedMap = "扎昆祭台";
var expedItem = 4001017;

var list = "你想做什么？#b\r\n\r\n#L1#查看当前远征队成员#l\r\n#L2#开始挑战扎昆！#l\r\n#L3#解散远征队#l";

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {

    player = cm.getPlayer();
    expedition = cm.getExpedition(exped);
    em = cm.getEventManager("ZakumBattle");

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            if (player.getLevel() < exped.getMinLevel() || player.getLevel() > exped.getMaxLevel()) {
                cm.sendOk("您不符合挑战 " + expedBoss + " 的等级条件！");
                cm.dispose();
            } else if (expedition == null) {
                cm.sendSimple("#e#b<远征队：" + expedName + ">\r\n#k#n" + em.getProperty("party") + "\r\n\r\n你想组建远征队来挑战 #r" + expedBoss + "#k 吗？\r\n#b#L1#是的，让我们开始吧！#l\r\n#L2#不，我再等等看……#l");
                status = 1;
            } else if (expedition.isLeader(player)) {
                if (expedition.isInProgress()) {
                    cm.sendOk("你的远征已经在进行中。愿冒险之神保佑那些正在奋战的勇士们。");
                    cm.dispose();
                } else {
                    cm.sendSimple(list);
                    status = 2;
                }
            } else if (expedition.isRegistering()) {
                if (expedition.contains(player)) {
                    cm.sendOk("你已经加入了该远征队。请耐心等待远征队长 #r" + expedition.getLeader().getName() + "#k 开启战斗。");
                    cm.dispose();
                } else {
                    cm.sendOk(expedition.addMember(cm.getPlayer()));
                    cm.dispose();
                }
            } else if (expedition.isInProgress()) {
                if (expedition.contains(player)) {
                    var eim = em.getInstance(expedName + player.getClient().getChannel());
                    if (eim.getIntProperty("canJoin") == 1) {
                        eim.registerPlayer(player);
                    } else {
                        cm.sendOk("你的远征队已经开始对抗 " + expedBoss + " 的战斗。让我们为这些勇敢的灵魂祈祷。");
                    }

                    cm.dispose();
                } else {
                    cm.sendOk("当前已有另一支远征队正在挑战 " + expedBoss + "。让我们为这些勇敢的灵魂祈祷吧。");
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            if (selection == 1) {
                if (!cm.haveItem(expedItem)) {
                    cm.sendOk("作为远征队长，你的物品栏中必须携带 #b#t" + expedItem + "##k，才能召唤并挑战 " + expedBoss + "！");
                    cm.dispose();
                    return;
                }

                expedition = cm.getExpedition(exped);
                if (expedition != null) {
                    cm.sendOk("已经有其他勇士创建了远征队，试着加入他们吧！");
                    cm.dispose();
                    return;
                }

                var res = cm.createExpedition(exped);
                if (res == 0) {
                    cm.sendOk("#r" + expedBoss + " 远征队#k 已成功创建。\r\n\r\n再次与我对话可查看远征队员或正式开始战斗！");
                } else if (res > 0) {
                    cm.sendOk("抱歉，你今天挑战扎昆的次数已达到上限！请明天再来尝试吧。");
                } else {
                    cm.sendOk("创建远征队时发生未知异常，请稍后再试。");
                }

                cm.dispose();

            } else if (selection == 2) {
                cm.sendOk("确实，面对强大的 " + expedBoss + "，谨慎一点总是没错的。");
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
                    cm.sendOk("目前远征队中只有你一个人。");
                    cm.dispose();
                    return;
                }
                var text = "以下是远征队当前的成员名单（点击可将对应成员移出远征队）：\r\n";
                text += "\r\n\t\t1." + expedition.getLeader().getName();
                for (var i = 1; i < size; i++) {
                    text += "\r\n#b#L" + (i + 1) + "#" + (i + 1) + ". " + expedMembers.get(i).getValue() + "#l\r\n";
                }
                cm.sendSimple(text);
                status = 6;
            } else if (selection == 2) {
                var min = exped.getMinSize();

                var size = expedition.getMemberList().size();
                if (size < min) {
                    cm.sendOk("你的远征队至少需要 #b" + min + " 名#k 玩家才能开启挑战。");
                    cm.dispose();
                    return;
                }

                cm.sendOk("远征即将开始，正在护送你们前往 #b" + expedMap + "#k！");
                status = 4;
            } else if (selection == 3) {
                const PacketCreator = Java.type('org.gms.util.PacketCreator');
                player.getMap().broadcastMessage(PacketCreator.serverNotice(6, expedition.getLeader().getName() + " 的远征队已解散。"));
                cm.endExpedition(expedition);
                cm.sendOk("远征队已解散。有时候暂时的战略性撤退也是明智的选择。");
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
                cm.sendOk("当前已有另一支远征队正在挑战 " + expedBoss + "，请稍候或更换频道后再试。");
                cm.dispose();
                return;
            }

            cm.dispose();

        } else if (status == 6) {
            if (selection > 0) {
                var banned = expedMembers.get(selection - 1);
                expedition.ban(banned);
                cm.sendOk("已将玩家 #b" + banned.getValue() + "#k 移出远征队。");
                cm.dispose();
            } else {
                cm.sendSimple(list);
                status = 2;
            }
        }
    }
}
