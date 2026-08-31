/*2101014.js - Lobby and Entrance
 * @author Jvlaple
 * For Jvlaple's AriantPQ
 */

var status = 0;
var toBan = -1;
var choice;
var arenaType;
var arena;
var arenaName;
var type;
var map;
const ExpeditionType = Java.type('org.gms.server.expeditions.ExpeditionType');
var exped = ExpeditionType.ARIANT;
var exped1 = ExpeditionType.ARIANT1;
var exped2 = ExpeditionType.ARIANT2;

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
        if (cm.getPlayer().getMapId() == 980010000) {
            if (cm.getLevel() > 30) {
                cm.sendOk("你的等级已经超过了#r30级#k，无法再参加阿里安特竞技场了。");
                cm.dispose();
                return;
            }

            if (status == 0) {
                var expedicao = cm.getExpedition(exped);
                var expedicao1 = cm.getExpedition(exped1);
                var expedicao2 = cm.getExpedition(exped2);

                var channelMaps = cm.getClient().getChannelServer().getMapFactory();
                var startSnd = "你想做什么？\r\n\r\n	#e#r(请选择一个竞技场房间)#n#k\r\n#b";
                var toSnd = startSnd;

                if (expedicao == null) {
                    toSnd += "#L0#竞技场 (1) (空闲)#l\r\n";
                } else if (channelMaps.getMap(980010101).getCharacters().isEmpty()) {
                    toSnd += "#L0#加入竞技场 (1)  房主 (" + expedicao.getLeader().getName() + ")" + " 当前成员: " + cm.getExpeditionMemberNames(exped) + "\r\n";
                }
                if (expedicao1 == null) {
                    toSnd += "#L1#竞技场 (2) (空闲)#l\r\n";
                } else if (channelMaps.getMap(980010201).getCharacters().isEmpty()) {
                    toSnd += "#L1#加入竞技场 (2)  房主 (" + expedicao1.getLeader().getName() + ")" + " 当前成员: " + cm.getExpeditionMemberNames(exped1) + "\r\n";
                }
                if (expedicao2 == null) {
                    toSnd += "#L2#竞技场 (3) (空闲)#l\r\n";
                } else if (channelMaps.getMap(980010301).getCharacters().isEmpty()) {
                    toSnd += "#L2#加入竞技场 (3)  房主 (" + expedicao2.getLeader().getName() + ")" + " 当前成员: " + cm.getExpeditionMemberNames(exped2) + "\r\n";
                }
                if (toSnd === startSnd) {
                    cm.sendOk("所有的竞技场都已被占用。建议你稍后再来，或者更换频道。");
                    cm.dispose();
                } else {
                    cm.sendSimple(toSnd);
                }
            } else if (status == 1) {
                arenaType = selection;
                expedicao = fetchArenaType();
                if (expedicao == "") {
                    cm.dispose();
                    return;
                }

                if (expedicao != null) {
                    enterArena(-1);
                } else {
                    cm.sendGetText("这场比赛最多允许多少人参加？(2~5人)");
                }
            } else if (status == 2) {
                var players = parseInt(cm.getText());   // AriantPQ option limit found thanks to NarutoFury (iMrSiN)
                if (isNaN(players)) {
                    cm.sendNext("请输入允许参与比赛的玩家人数。");
                    status = 0;
                } else if (players < 2) {
                    cm.sendNext("参与人数最少不能少于2人。");
                    status = 0;
                } else {
                    enterArena(players);
                }
            }
        }
    }
}

function fetchArenaType() {
    switch (arenaType) {
        case 0 :
            exped = ExpeditionType.ARIANT;
            expedicao = cm.getExpedition(exped);
            map = 980010100;
            break;
        case 1 :
            exped = ExpeditionType.ARIANT1;
            expedicao = cm.getExpedition(exped);
            map = 980010200;
            break;
        case 2 :
            exped = ExpeditionType.ARIANT2;
            expedicao = cm.getExpedition(exped);
            map = 980010300;
            break;
        default :
            exped = null;
            map = 0;
            expedicao = "";
    }

    return expedicao;
}

function enterArena(arenaPlayers) {
    expedicao = fetchArenaType();
    if (expedicao == "") {
        cm.dispose();

    } else if (expedicao == null) {
        if (arenaPlayers != -1) {
            var res = cm.createExpedition(exped, true, 0, arenaPlayers);
            if (res == 0) {
                cm.warp(map, 0);
                cm.getPlayer().dropMessage("竞技场创建成功。请等待其他玩家加入比赛。");
            } else if (res > 0) {
                cm.sendOk("抱歉，您今日参与竞技场的次数已达上限！请明日再来尝试……");
            } else {
                cm.sendOk("创建竞技场时发生未知错误，请稍后再试。");
            }
        } else {
            cm.sendOk("查找竞技场时发生未知错误，请稍后再试。");
        }

        cm.dispose();
    } else {
        if (playerAlreadyInLobby(cm.getPlayer())) {
            cm.sendOk("抱歉，你已经在等待房间中了。");
            cm.dispose();
            return;
        }

        var playerAdd = expedicao.addMemberInt(cm.getPlayer());
        if (playerAdd == 3) {
            cm.sendOk("抱歉，该房间人数已满。");
            cm.dispose();
        } else {
            if (playerAdd == 0) {
                cm.warp(map, 0);
                cm.dispose();
            } else if (playerAdd == 2) {
                cm.sendOk("抱歉，房主拒绝了你的加入。");
                cm.dispose();
            } else {
                cm.sendOk("发生错误。");
                cm.dispose();
            }
        }
    }
}

function playerAlreadyInLobby(player) {
    return cm.getExpedition(ExpeditionType.ARIANT) != null && cm.getExpedition(ExpeditionType.ARIANT).contains(player) ||
        cm.getExpedition(ExpeditionType.ARIANT1) != null && cm.getExpedition(ExpeditionType.ARIANT1).contains(player) ||
        cm.getExpedition(ExpeditionType.ARIANT2) != null && cm.getExpedition(ExpeditionType.ARIANT2).contains(player);
}
