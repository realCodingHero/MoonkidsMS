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
/* Assistant Bonnie
	Marriage NPC
 */

var status;
var wid;
var isMarrying;

var cathedralWedding = false;
var weddingEventName = "WeddingChapel";
var weddingEntryTicketCommon = 5251001;
var weddingEntryTicketPremium = 5251002;
var weddingSendTicket = 4031377;
var weddingGuestTicket = 4031406;
var weddingAltarMapid = 680000110;
var weddingIndoors;

function isWeddingIndoors(mapid) {
    return mapid >= 680000100 && mapid <= 680000500;
}

function hasSuitForWedding(player) {
    var baseid = (player.getGender() == 0) ? 1050131 : 1051150;

    for (var i = 0; i < 4; i++) {
        if (player.haveItemWithId(baseid + i, true)) {
            return true;
        }
    }

    return false;
}

function getMarriageInstance(weddingId) {
    var em = cm.getEventManager(weddingEventName);

    for (var iterator = em.getInstances().iterator(); iterator.hasNext();) {
        var eim = iterator.next();

        if (eim.getIntProperty("weddingId") == weddingId) {
            return eim;
        }
    }

    return null;
}

function hasWeddingRing(player) {
    var rings = [1112806, 1112803, 1112807, 1112809];
    for (var i = 0; i < rings.length; i++) {
        if (player.haveItemWithId(rings[i], true)) {
            return true;
        }
    }

    return false;
}

function start() {
    weddingIndoors = isWeddingIndoors(cm.getMapId());
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

        if (!weddingIndoors) {
            var hasEngagement = false;
            for (var x = 4031357; x <= 4031364; x++) {
                if (cm.haveItem(x, 1)) {
                    hasEngagement = true;
                    break;
                }
            }

            if (status == 0) {
                var text = "欢迎来到阿莫利亚#b婚礼礼堂#k！请问有什么我可以为您效劳的吗？";
                var choice = ["如何筹备一场婚礼？", "我们已经订婚，想预约婚礼场地", "我是宾客，想入场参加婚礼"];
                for (x = 0; x < choice.length; x++) {
                    text += "\r\n#L" + x + "#b" + choice[x] + "#l";
                }

                if (cm.haveItem(5251100)) {
                    text += "\r\n#L" + x + "#b制作额外的婚礼请柬#l";
                }

                cm.sendSimple(text);
            } else if (status == 1) {
                switch (selection) {
                    case 0:
                        cm.sendOk("首先，你需要先完成订婚并向伴侣求婚。可以在阿莫利亚找 #p9201000# 打造订婚戒指。订婚成功后，购买一张 #b#t" + weddingEntryTicketCommon + "#k。\r\n把订婚戒指和婚礼券出示给我，我就会为你预约婚礼场地并发放 #r15 张婚礼邀请函#k。双击邀请函即可邀请亲朋好友，每位宾客需凭请柬入场。");
                        cm.dispose();
                        break;

                    case 1:
                        if (hasEngagement) {
                            var wserv = cm.getClient().getWorldServer();
                            var cserv = cm.getClient().getChannelServer();
                            var weddingId = wserv.getRelationshipId(cm.getPlayer().getId());

                            if (weddingId > 0) {
                                if (cserv.isWeddingReserved(weddingId)) {    // registration check
                                    var placeTime = cserv.getWeddingReservationTimeLeft(weddingId);
                                    cm.sendOk("你们的婚礼定于 #r" + placeTime + "#k 开始。请穿上漂亮的结婚礼服，千万不要迟到哦！");
                                } else {
                                    var partner = wserv.getPlayerStorage().getCharacterById(cm.getPlayer().getPartnerId());
                                    if (partner == null) {
                                        cm.sendOk("你的伴侣现在似乎不在线……请等双方都在线且在同一张地图时再来办理预约！");
                                        cm.dispose();
                                        return;
                                    }

                                    if (hasWeddingRing(cm.getPlayer()) || hasWeddingRing(partner)) {
                                        cm.sendOk("你或你的伴侣已经拥有结婚戒指了。");
                                        cm.dispose();
                                        return;
                                    }

                                    if (!cm.getMap().equals(partner.getMap())) {
                                        cm.sendOk("请让你的伴侣也来到这里，双方需要在同一张地图才能预约。");
                                        cm.dispose();
                                        return;
                                    }

                                    if (!cm.canHold(weddingSendTicket, 15) || !partner.canHold(weddingSendTicket, 15)) {
                                        cm.sendOk("你或你的伴侣的其它栏空间不足，无法放下15张婚礼邀请函！请在预约前清理出足够的背包空间。");
                                        cm.dispose();
                                        return;
                                    }

                                    if (!cm.getUnclaimedMarriageGifts().isEmpty() || !partner.getAbstractPlayerInteraction().getUnclaimedMarriageGifts().isEmpty()) {
                                        cm.sendOk("抱歉，根据阿莫利亚婚礼礼品簿的记录，你们还有未领取的婚礼礼物。请先找 #b#p9201014#k 处理。");
                                        cm.dispose();
                                        return;
                                    }

                                    var hasCommon = cm.haveItem(weddingEntryTicketCommon);
                                    var hasPremium = cm.haveItem(weddingEntryTicketPremium);

                                    if (hasCommon || hasPremium) {
                                        var weddingType = (hasPremium ? true : false);

                                        var player = cm.getPlayer();
                                        var resStatus = cserv.pushWeddingReservation(weddingId, cathedralWedding, weddingType, player.getId(), player.getPartnerId());
                                        if (resStatus > 0) {
                                            cm.gainItem((weddingType) ? weddingEntryTicketPremium : weddingEntryTicketCommon, -1);

                                            const Channel = Java.type('org.gms.net.server.channel.Channel');
                                            var expirationTime = Channel.getRelativeWeddingTicketExpireTime(resStatus);
                                            cm.gainItem(weddingSendTicket, 15, false, true, expirationTime);
                                            partner.getAbstractPlayerInteraction().gainItem(weddingSendTicket, 15, false, true, expirationTime);

                                            var placeTime = cserv.getWeddingReservationTimeLeft(weddingId);

                                            var wedType = weddingType ? "高级（Premium）" : "普通（Regular）";
                                            cm.sendOk("你们两位都已获得15张婚礼邀请函。#b双击邀请函#k 即可发送给想要邀请的宾客。请柬只能在婚礼正式开始前发送。你们的 #b" + wedType + " 婚礼#k 定于 #r" + placeTime + "#k 开始。请穿上漂亮的礼服，千万不要迟到！");

                                            player.dropMessage(6, "婚礼助手：你们双方已收到15张婚礼邀请函。请柬只能在婚礼开始前发送。你们的 " + wedType + " 婚礼定于 " + placeTime + " 开始，请穿好礼服准时参加！");
                                            partner.dropMessage(6, "婚礼助手：你们双方已收到15张婚礼邀请函。请柬只能在婚礼开始前发送。你们的 " + wedType + " 婚礼定于 " + placeTime + " 开始，请穿好礼服准时参加！");

                                            if (!hasSuitForWedding(player)) {
                                                player.dropMessage(5, "婚礼助手：参加婚礼典礼前请务必购买结婚礼服。礼服可在阿莫利亚最左侧的婚礼商店购买。");
                                            }

                                            if (!hasSuitForWedding(partner)) {
                                                partner.dropMessage(5, "婚礼助手：参加婚礼典礼前请务必购买结婚礼服。礼服可在阿莫利亚最左侧的婚礼商店购买。");
                                            }
                                        } else {
                                            cm.sendOk("您的婚礼预约最近已被处理，请稍后再试。");
                                        }
                                    } else {
                                        cm.sendOk("在尝试预约婚礼前，请确保你的现金商城背包中拥有一张 #b#t" + weddingEntryTicketCommon + "#k。");
                                    }
                                }
                            } else {
                                cm.sendOk("婚礼预约遇到了一个错误，请稍后再试。");
                            }

                            cm.dispose();
                        } else {
                            cm.sendOk("你还没有订婚戒指，请先完成订婚。");
                            cm.dispose();
                        }
                        break;

                    case 2:
                        if (cm.haveItem(weddingGuestTicket)) {
                            var cserv = cm.getClient().getChannelServer();

                            wid = cserv.getOngoingWedding(cathedralWedding);
                            if (wid > 0) {
                                if (cserv.isOngoingWeddingGuest(cathedralWedding, cm.getPlayer().getId())) {
                                    var eim = getMarriageInstance(wid);
                                    if (eim != null) {
                                        cm.sendOk("祝您享受这场浪漫的婚礼！请妥善保管好金枫叶，否则可能无法完整体验婚礼仪式。");
                                    } else {
                                        cm.sendOk("请稍等片刻，新人正在准备步入礼堂。");
                                        cm.dispose();
                                    }
                                } else {
                                    cm.sendOk("抱歉，你没有收到这场婚礼的请柬，无法入场。");
                                    cm.dispose();
                                }
                            } else {
                                cm.sendOk("当前没有正在进行或已预约的婚礼。");
                                cm.dispose();
                            }
                        } else {
                            cm.sendOk("你身上没有 #b#t" + weddingGuestTicket + "#k（婚礼宾客券）。");
                            cm.dispose();
                        }
                        break;

                    default:
                        var wserv = cm.getClient().getWorldServer();
                        var cserv = cm.getClient().getChannelServer();
                        var weddingId = wserv.getRelationshipId(cm.getPlayer().getId());

                        var resStatus = cserv.getWeddingReservationStatus(weddingId, cathedralWedding);
                        if (resStatus > 0) {
                            if (cm.canHold(weddingSendTicket, 3)) {
                                cm.gainItem(5251100, -1);

                                const Channel = Java.type('org.gms.net.server.channel.Channel');
                                var expirationTime = Channel.getRelativeWeddingTicketExpireTime(resStatus);
                                cm.gainItem(weddingSendTicket, 3, false, true, expirationTime);
                            } else {
                                cm.sendOk("请确保其它栏至少有 1 个空位以接收更多请柬。");
                            }
                        } else {
                            cm.sendOk("你当前在礼堂没有可制作额外请柬的有效婚礼预约。");
                        }

                        cm.dispose();
                }
            } else if (status == 2) {   // registering guest
                var eim = getMarriageInstance(wid);

                if (eim != null) {
                    cm.gainItem(weddingGuestTicket, -1);
                    eim.registerPlayer(cm.getPlayer());     //cm.warp(680000210, 0);
                } else {
                    cm.sendOk("未找到当前婚礼活动实例。");
                }

                cm.dispose();
            }
        } else {
            if (status == 0) {
                var eim = cm.getEventInstance();
                if (eim == null) {
                    cm.warp(680000000, 0);
                    cm.dispose();
                    return;
                }

                isMarrying = (cm.getPlayer().getId() == eim.getIntProperty("groomId") || cm.getPlayer().getId() == eim.getIntProperty("brideId"));

                if (eim.getIntProperty("weddingStage") == 0) {
                    if (!isMarrying) {
                        cm.sendOk("欢迎来到 #b#m" + cm.getMapId() + "#k。在仪式开始前，请在此与其他宾客一同陪伴新郎新娘。\r\n\r\n倒计时结束后，新人将前往神圣祭坛，届时您可以在二楼#b宾客观礼席#k见证神圣时刻。");
                    } else {
                        cm.sendOk("欢迎来到 #b#m" + cm.getMapId() + "#k！在倒计时结束前，请向到场的宾客们致意。倒计时结束后，你们将步入神圣祭坛举行仪式。");
                    }

                    cm.dispose();
                } else {
                    cm.sendYesNo("新人已经在前往礼堂祭坛的路上了。你想现在进入主会场观礼吗？");
                }
            } else if (status == 1) {
                cm.warp(weddingAltarMapid, "sp");
                cm.dispose();
            }
        }
    }
}