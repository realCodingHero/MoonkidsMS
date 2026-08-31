/*2101017.js
 *Cesar
 *@author Jvlaple
 */

var status = 0;
var toBan = -1;
var choice;
var arena;
var arenaName;
var type;
var map;
const ExpeditionType = Java.type('org.gms.server.expeditions.ExpeditionType');
var exped;
var expedicao;
var expedMembers;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }

        const GameConstants = Java.type('org.gms.constants.game.GameConstants');
        if (cm.getPlayer().getMapId() == 980010100 || cm.getPlayer().getMapId() == 980010200 || cm.getPlayer().getMapId() == 980010300) {
            if (cm.getPlayer().getMapId() == 980010100) {
                exped = ExpeditionType.ARIANT;
                expedicao = cm.getExpedition(exped);

            } else if (cm.getPlayer().getMapId() == 980010200) {
                exped = ExpeditionType.ARIANT1;
                expedicao = cm.getExpedition(exped);
            } else {
                exped = ExpeditionType.ARIANT2;
                expedicao = cm.getExpedition(exped);
            }

            if (expedicao == null) {
                cm.dispose();
                return;
            }

            expedMembers = expedicao.getMemberList();
            if (status == 0) {
                if (cm.isLeaderExpedition(exped)) {
                    cm.sendSimple("你想做什么？#b\r\n#L1#查看当前成员#l\r\n#L2#请离成员#l\r\n#L3#开始比赛#l\r\n#L4#离开竞技场#l#k");
                    status = 1;
                } else {
                    var toSend = "当前房间内的成员列表：\r\n#b";
                    toSend += cm.getExpeditionMemberNames(exped);
                    cm.sendOk(toSend);
                    cm.dispose();
                }
            } else if (status == 1) {
                if (selection == 1) {
                    var toSend = "当前房间内的成员列表：\r\n#b";
                    toSend += cm.getExpeditionMemberNames(exped);
                    cm.sendOk(toSend);
                    cm.dispose();
                } else if (selection == 2) {
                    var size = expedMembers.size();
                    if (size == 1) {
                        cm.sendOk("你是房间里唯一的成员。");
                        cm.dispose();
                        return;
                    }
                    var text = "以下是当前房间中的成员（点击成员名字可以将其请离房间）：\r\n";
                    text += "\r\n		1." + expedicao.getLeader().getName();
                    for (var i = 1; i < size; i++) {
                        text += "\r\n#b#L" + (i + 1) + "#" + (i + 1) + ". " + expedMembers.get(i).getValue() + "#l\n";
                    }
                    cm.sendSimple(text);
                    status = 6;
                } else if (selection == 3) {
                    if (expedicao.getMembers().size() < 1) {
                        cm.sendOk("至少需要2名玩家才能开始比赛。");
                        cm.dispose();
                    } else {
                        if (cm.getParty() != null) {
                            cm.sendOk("不能以组队形式进入比赛。");
                            cm.dispose();
                            return;
                        }

                        var errorMsg = cm.startAriantBattle(exped, cm.getPlayer().getMapId());
                        if (errorMsg != "") {
                            cm.sendOk(errorMsg);
                        }

                        cm.dispose();
                    }
                } else if (selection == 4) {
                    cm.mapMessage(5, "竞技场房主已离开。");
                    expedicao.warpExpeditionTeam(980010000);
                    cm.endExpedition(expedicao);
                    cm.dispose();
                }
            } else if (status == 6) {
                if (selection > 0) {
                    var banned = expedMembers.get(selection - 1);
                    expedicao.ban(banned);
                    cm.sendOk("你已经将 " + banned.getValue() + " 请离了房间。");
                    cm.dispose();
                } else {
                    cm.sendSimple(list);
                    status = 2;
                }
            }
        } else if (GameConstants.isAriantColiseumArena(cm.getPlayer().getMapId())) {
            if (cm.getPlayer().getMapId() == 980010101) {
                exped = ExpeditionType.ARIANT;
                expedicao = cm.getExpedition(exped);
            } else if (cm.getPlayer().getMapId() == 980010201) {
                exped = ExpeditionType.ARIANT1;
                expedicao = cm.getExpedition(exped);
            } else {
                exped = ExpeditionType.ARIANT2;
                expedicao = cm.getExpedition(exped);
            }
            if (status == 0) {
                var gotTheBombs = expedicao.getProperty("gotBomb" + cm.getChar().getId());
                if (gotTheBombs != null) {
                    cm.sendOk("我已经把炸药给你了，赶快去击败 #b天蝎怪#k 吧！");
                    cm.dispose();
                } else if (cm.canHoldAll([2270002, 2100067], [50, 5])) {
                    cm.sendOk("我已经给了你 5个 #b#e眩晕炸药#k#n 和 50个 #b#e元素石#k#n。\r\n使用元素石捕捉天蝎怪，收集 #r#e灵魂之石#k#n 吧！");
                    expedicao.setProperty("gotBomb" + cm.getChar().getId(), "1");
                    cm.gainItem(2270002, 50);
                    cm.gainItem(2100067, 5);
                    cm.dispose();
                } else {
                    cm.sendOk("你的背包空间不足，请清理出消耗栏和其它栏的空间。");
                    cm.dispose();
                }
            }
        } else {
            cm.sendOk("嗨，你听说过阿里安特斗技场吗？这是一个适合20级至30级玩家参与的竞技挑战！");
            cm.dispose();
        }
    }
}
