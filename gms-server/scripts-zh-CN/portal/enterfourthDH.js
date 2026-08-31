function enter(pi) {
    if (pi.hasItem(4032125) || pi.hasItem(4032126) || pi.hasItem(4032127) || pi.hasItem(4032128) || pi.hasItem(4032129)) {
        pi.playerMessage(5, "你已经拥有了能力之证。");
        return false;
    }

    if (pi.isQuestStarted(20611) || pi.isQuestStarted(20612) || pi.isQuestStarted(20613) || pi.isQuestStarted(20614) || pi.isQuestStarted(20615)) {
        if (pi.getPlayerCount(913020300) == 0) {
            var map = pi.getMap(913020300);
            map.killAllMonsters();

            pi.playPortalSound();
            pi.warp(913020300, 0);
            pi.spawnMonster(9300294, 87, 88);
            return true;
        } else {
            pi.playerMessage(5, "已经有其他人在挑战Boss，请稍后再来。");
            return false;
        }
    } else {
        pi.playerMessage(5, "只有正在进行骑士等级考试方可进入。");
        return false;
    }
}