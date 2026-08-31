/**
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Drago (MapleStorySA)
 2.0 - Second Version by Jayd - translated CPQ contents to English
 ---------------------------------------------------------------------------------------------------
 **/

var cpqMinLvl = 51;
var cpqMaxLvl = 70;
var cpqMinAmt = 2;
var cpqMaxAmt = 6;

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
        if (status == 0) {
            if (cm.getParty() == null) {
                status = 10;
                cm.sendOk("在开始挑战前，你必须先创建一个队伍！");
            } else if (!cm.isLeader()) {
                status = 10;
                cm.sendOk("只有队伍的#b队长#k才能与我对话开启挑战。");
            } else {
                var leaderMapid = cm.getMapId();
                var party = cm.getParty().getMembers();
                var inMap = cm.partyMembersInMap();
                var lvlOk = 0;
                var isOutMap = 0;
                for (var i = 0; i < party.size(); i++) {
                    if (party.get(i).getLevel() >= cpqMinLvl && party.get(i).getLevel() <= cpqMaxLvl) {
                        lvlOk++;

                        if (party.get(i).getPlayer().getMapId() != leaderMapid) {
                            isOutMap++;
                        }
                    }
                }

                if (party.size() < 2) {
                    status = 10;
                    cm.sendOk("你的队伍人数不足。队伍至少需要 #b" + cpqMinAmt + "#k 至 #r" + cpqMaxAmt + "#k 名成员，且大家必须在同一张地图内。");
                } else if (lvlOk != inMap) {
                    status = 10;
                    cm.sendOk("请确保队伍中的所有成员等级均在符合要求的范围内（" + cpqMinLvl + " ~ " + cpqMaxLvl + "级）！");
                } else if (isOutMap > 0) {
                    status = 10;
                    cm.sendOk("队伍中有部分成员不在当前地图内！");
                } else {
                    if (!cm.sendCPQMapLists2()) {
                        cm.sendOk("当前所有的怪物嘉年华2场地均在使用中！请稍后再试。");
                        cm.dispose();
                    }
                }
            }
        } else if (status == 1) {
            if (cm.fieldTaken2(selection)) {
                if (cm.fieldLobbied2(selection)) {
                    cm.challengeParty2(selection);
                    cm.dispose();
                } else {
                    cm.sendOk("该擂台房间目前正在对战中。");
                    cm.dispose();
                }
            } else {
                var party = cm.getParty().getMembers();
                const GameConfig = Java.type('org.gms.config.GameConfig');
                if ((selection === 0 || selection === 1) && party.size() < (GameConfig.getServerBoolean("use_enable_solo_expeditions") ? 1 : 2)) {
                    cm.sendOk("该擂台至少需要 2 名队员才能发起挑战！");
                } else if ((selection === 2) && party.size() < (GameConfig.getServerBoolean("use_enable_solo_expeditions") ? 1 : 3)) {
                    cm.sendOk("该擂台至少需要 3 名队员才能发起挑战！");
                } else {
                    cm.cpqLobby2(selection);
                }
                cm.dispose();
            }
        } else if (status == 11) {
            cm.dispose();
        }
    }
}