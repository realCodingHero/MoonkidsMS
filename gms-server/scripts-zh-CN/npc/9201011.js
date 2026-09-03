/*
    This file is part of the HeavenMS MapleStory Server
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
/* Pelvis Bebop
	Marriage NPC
 */

var status;
var state;
var eim;
var weddingEventName = "WeddingChapel";
var cathedralWedding = false;
var weddingIndoors;
const GameConfig = Java.type('org.gms.config.GameConfig');
var weddingBlessingExp = GameConfig.getServerInt("wedding_bless_exp");

function detectPlayerItemid(player) {
    for (var x = 4031357; x <= 4031364; x++) {
        if (player.haveItem(x)) {
            return x;
        }
    }

    return -1;
}

function getRingId(boxItemId) {
    return boxItemId == 4031357 ? 1112803 : (boxItemId == 4031359 ? 1112806 : (boxItemId == 4031361 ? 1112807 : (boxItemId == 4031363 ? 1112809 : -1)));
}

function isSuitedForWedding(player, equipped) {
    var baseid = (player.getGender() == 0) ? 1050131 : 1051150;

    if (equipped) {
        for (var i = 0; i < 4; i++) {
            if (player.haveItemEquipped(baseid + i)) {
                return true;
            }
        }
    } else {
        for (var i = 0; i < 4; i++) {
            if (player.haveItemWithId(baseid + i, true)) {
                return true;
            }
        }
    }

    return false;
}

function getWeddingPreparationStatus(player, partner) {
    if (!player.haveItem(4000313)) {
        return -3;
    }
    if (!partner.haveItem(4000313)) {
        return 3;
    }

    if (!isSuitedForWedding(player, true)) {
        return -4;
    }
    if (!isSuitedForWedding(partner, true)) {
        return 4;
    }

    var hasEngagement = false;
    for (var x = 4031357; x <= 4031364; x++) {
        if (player.haveItem(x)) {
            hasEngagement = true;
            break;
        }
    }
    if (!hasEngagement) {
        return -1;
    }

    hasEngagement = false;
    for (var x = 4031357; x <= 4031364; x++) {
        if (partner.haveItem(x)) {
            hasEngagement = true;
            break;
        }
    }
    if (!hasEngagement) {
        return -2;
    }

    if (!player.canHold(1112803)) {
        return 1;
    }
    if (!partner.canHold(1112803)) {
        return 2;
    }

    return 0;
}

function giveCoupleBlessings(eim, player, partner) {
    var blessCount = eim.gridSize();

    player.gainExp(blessCount * weddingBlessingExp);
    partner.gainExp(blessCount * weddingBlessingExp);
}

function start() {
    eim = cm.getEventInstance();

    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (eim == null) {
                cm.warp(680000000, 0);
                cm.dispose();
                return;
            }

            var playerId = cm.getPlayer().getId();
            if (playerId == eim.getIntProperty("groomId") || playerId == eim.getIntProperty("brideId")) {
                var wstg = eim.getIntProperty("weddingStage");

                if (wstg == 2) {
                    cm.sendYesNo("嗷呜~~~~！宾客们已经向你们表达了最真挚热烈的祝福！时机已到，宝贝们~ #r你们准备好正式结为夫妻了吗#k？");
                    state = 1;
                } else if (wstg == 1) {
                    cm.sendOk("哇-等一下，好吗？你的客人们正在给你们表达爱意。让我们来点动感，宝贝~~。");
                    cm.dispose();
                } else {
                    cm.sendOk("Wheeeeeeeeeeeeeew! 我们的庆典现在圆满礼成！请和 #b#p9201009##k 对话，她会引领你们和亲朋好友前往婚后派对。感谢大家的热情！");
                    cm.dispose();
                }
            } else {
                var wstg = eim.getIntProperty("weddingStage");
                if (wstg == 1) {
                    if (eim.gridCheck(cm.getPlayer()) != -1) {
                        cm.sendOk("大家让我们把这个地方搞得热闹起来！让我们摇滚起来！！");
                        cm.dispose();
                    } else {
                        if (eim.getIntProperty("guestBlessings") == 1) {
                            cm.sendYesNo("你会向在场的超级明星表达你的爱吗？");
                            state = 0;
                        } else {
                            cm.sendOk("我们的超级明星都聚集在这里。大家，让我们给他们一个美好的派对~！");
                            cm.dispose();
                        }
                    }
                } else if (wstg == 3) {
                    cm.sendOk("哇哦！现在这对新人的爱意就像一颗超级巨大的璀璨爱心！庆典结束后狂欢还将继续，准备好参加派对吧，宝贝们~！");
                    cm.dispose();
                } else {
                    cm.sendOk("各位观众……瞪大你们的眼睛，竖起你们的耳朵！最激动人心的时刻到了，新郎新娘马上就要甜蜜拥吻啦！！！");
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            if (state == 0) {    // give player blessings
                eim.gridInsert(cm.getPlayer(), 1);

                const PacketCreator = Java.type('org.gms.util.PacketCreator');
                if (GameConfig.getServerBoolean("wedding_blesser_showfx")) {
                    var target = cm.getPlayer();
                    target.sendPacket(PacketCreator.showSpecialEffect(9));
                    target.getMap().broadcastMessage(target, PacketCreator.showForeignEffect(target.getId(), 9), false);
                } else {
                    var target = eim.getPlayerById(eim.getIntProperty("groomId"));
                    target.sendPacket(PacketCreator.showSpecialEffect(9));
                    target.getMap().broadcastMessage(target, PacketCreator.showForeignEffect(target.getId(), 9), false);

                    target = eim.getPlayerById(eim.getIntProperty("brideId"));
                    target.sendPacket(PacketCreator.showSpecialEffect(9));
                    target.getMap().broadcastMessage(target, PacketCreator.showForeignEffect(target.getId(), 9), false);
                }

                cm.sendOk("太棒了，我的朋友！你的爱已经融入了他们的爱，现在成为一个更大的心形情感，将永远活跃在我们的心中！哇哦~！");
                cm.dispose();
            } else {            // couple wants to complete the wedding
                var wstg = eim.getIntProperty("weddingStage");

                if (wstg == 2) {
                    var pid = cm.getPlayer().getPartnerId();
                    if (pid <= 0) {
                        cm.sendOk("哎呀~.... 等等，你刚刚是不是把你手上的东西弄坏了？？哎呀，发生了什么事？");
                        cm.dispose();
                        return;
                    }

                    var player = cm.getPlayer();
                    var partner = cm.getMap().getCharacterById(cm.getPlayer().getPartnerId());
                    if (partner != null) {
                        state = getWeddingPreparationStatus(player, partner);

                        switch (state) {
                            case 0:
                                var pid = eim.getIntProperty("confirmedVows");
                                if (pid != -1) {
                                    if (pid == player.getId()) {
                                        cm.sendOk("你已经确认了你的誓言。现在只剩下你的伴侣需要确认了。");
                                    } else {
                                        eim.setIntProperty("weddingStage", 3);
                                        var cmPartner = partner.getAbstractPlayerInteraction();

                                        var playerItemId = detectPlayerItemid(player);
                                        var partnerItemId = (playerItemId % 2 == 1) ? playerItemId + 1 : playerItemId - 1;

                                        var marriageRingId = getRingId((playerItemId % 2 == 1) ? playerItemId : partnerItemId);

                                        cm.gainItem(playerItemId, -1);
                                        cmPartner.gainItem(partnerItemId, -1);

                                        const RingActionHandler = Java.type('org.gms.net.server.channel.handlers.RingActionHandler');
                                        RingActionHandler.giveMarriageRings(player, partner, marriageRingId);
                                        player.setMarriageItemId(marriageRingId);
                                        partner.setMarriageItemId(marriageRingId);

                                        giveCoupleBlessings(eim, player, partner);

                                        cm.getMap().dropMessage(6, "韦恩：我在此正式宣布——你们就是彼此心锁唯一的钥匙，项链上最完美的坠饰！别害羞了，快深情亲吻对方吧！");
                                        eim.schedule("showMarriedMsg", 2 * 1000);
                                    }
                                } else {
                                    eim.setIntProperty("confirmedVows", player.getId());
                                    cm.getMap().dropMessage(6, "婚礼助手：" + player.getName() + " 已经确认了誓言！距离礼成只差最后一步，抓稳扶好啦！");
                                }

                                break;

                            case -1:
                                cm.sendOk("嗯……看来你身上已经没有订婚时交换的戒指/戒指盒了。哎呀呀~");
                                break;

                            case -2:
                                cm.sendOk("嗯……看来你的伴侣身上没有订婚时交换的戒指/戒指盒了。太遗憾了~");
                                break;

                            case -3:
                                cm.sendOk("嗯……看来你身上没有入场时发放的 #r#t4000313##k……快把它找出来，宝贝~");
                                break;

                            case -4:
                                cm.sendOk("哎呀，虽然摇滚自由不羁，但结婚礼服可是仪式感的核心！在和我确认誓言前，请务必穿好婚礼礼服哦。");
                                break;

                            case 1:
                                cm.sendOk("请在装备栏留出至少 1 个空位来接收神圣的结婚戒指。");
                                break;

                            case 2:
                                cm.sendOk("请提醒你的伴侣在装备栏留出至少 1 个空位来接收结婚戒指。");
                                break;

                            case 3:
                                cm.sendOk("嗯……你的伴侣似乎弄丢了入场发放的 #r#t4000313##k，没有它仪式可无法顺利进行哦。");
                                break;

                            case 4:
                                cm.sendOk("哎呀，你的伴侣还没有穿上正式的结婚礼服呢。请提醒他们穿好礼服后再来找我吧。");
                                break;
                        }

                        cm.dispose();
                    } else {
                        cm.sendOk("咦？你的伴侣现在不在当前地图吗？如果伴侣不在场，我可无法为你们举行神圣的结婚仪式哦。");
                        cm.dispose();
                    }
                } else {
                    cm.sendOk("芜湖~~！你们现在已经#b正式结为夫妻#k啦！真是天造地设、无比耀眼的一对！祝你们新婚快乐、白头偕老！");
                    cm.dispose();
                }
            }
        }
    }
}