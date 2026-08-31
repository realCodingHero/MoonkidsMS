var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    var eim = cm.getEventInstance();
    if (eim != null && eim.getIntProperty("glpq6") == 3) {
        cm.sendOk("干得漂亮！你们成功击溃了恶魔大师们！请穿过那扇门领取丰厚的通关奖励吧！");
        cm.dispose();
        return;
    }

    if (!cm.isEventLeader()) {
        cm.sendNext("请让你们的队长前来与我对话。");
        cm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (eim != null) {
        if (eim.getIntProperty("glpq6") == 0) {
            if (status == 0) {
                cm.sendNext("欢迎来到恶魔大师的要塞要地！今晚将由我来招待各位……");
            } else if (status == 1) {
                cm.sendNext("今晚，我们将享受一场以冒险家为盛宴的狂欢……哈哈哈哈！");
            } else if (status == 2) {
                cm.sendNext("就让我们训练有素的守护大师们好好款待你们吧！");
                cm.mapMessage(6, "全员戒备！守护大师正在逼近！");
                for (var i = 0; i < 10; i++) {
                    var mob = eim.getMonster(9400594);
                    const xPos = Math.floor(-1337 + (Math.random() * 1337))
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(xPos, 276));
                }
                for (var i = 0; i < 20; i++) {
                    var mob = eim.getMonster(9400582);
                    const xPos = Math.floor(-1337 + (Math.random() * 1337))
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(xPos, 276));
                }
                eim.setIntProperty("glpq6", 1);
                cm.dispose();
            }
        } else if (eim.getIntProperty("glpq6") == 1) {
            if (cm.getMap().countMonsters() == 0) {
                if (status == 0) {
                    cm.sendOk("嗯？什么情况？你们居然击败了他们？！");
                } else if (status == 1) {
                    cm.sendNext("哼，无所谓！四位恶魔大师会非常乐意亲自撕碎你们！");
                    cm.mapMessage(6, "恶魔大师们现身了！");

                    //Margana
                    var mob = eim.getMonster(9400590);
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(-22, 1));

                    //Red Nirg
                    var mob2 = eim.getMonster(9400591);
                    cm.getMap().spawnMonsterOnGroundBelow(mob2, new java.awt.Point(-22, 276));

                    //Hsalf
                    var mob4 = eim.getMonster(9400593);
                    cm.getMap().spawnMonsterOnGroundBelow(mob4, new java.awt.Point(496, 276));

                    //Rellik
                    var mob3 = eim.getMonster(9400592);
                    cm.getMap().spawnMonsterOnGroundBelow(mob3, new java.awt.Point(-496, 276));

                    eim.setIntProperty("glpq6", 2);
                    cm.dispose();
                }
            } else {
                cm.sendOk("少废话，先过了守护大师这一关再说吧！");
                cm.dispose();
            }
        } else if (eim.getIntProperty("glpq6") == 2) {
            if (cm.getMap().countMonsters() == 0) {
                cm.sendOk("什……什么？！这……这绝不可能！恶魔大师们竟然被打败了？！");
                cm.mapMessage(5, "通往下一阶段的传送门已经开启！");
                eim.setIntProperty("glpq6", 3);

                eim.showClearEffect(true);
                eim.giveEventPlayersStageReward(6);

                eim.clearPQ();
                cm.dispose();
            } else {
                cm.sendOk("别来烦我！好好承受恶魔大师们的怒火吧！");
                cm.dispose();
            }
        } else {
            cm.sendOk("干得漂亮！你们成功击溃了恶魔大师们！请穿过那扇门领取丰厚的通关奖励吧！");
            cm.dispose();
        }
    } else {
        cm.dispose();
    }
}