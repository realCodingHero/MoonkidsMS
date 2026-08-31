/* @Author SharpAceX
*/

function start() {
    if (cm.getPlayer().getMapId() == 610030500) {
        cm.sendOk("强大的力量固然人人向往，但真正让战士脱颖而出的，是他们钢铁般的坚强意志！无论面对何种绝境，真正的勇士都会坚守阵地直至夺取胜利。战士之厅是一条残酷的试炼之路，整个大厅与其中的强力怪物都将成为你的敌人。运用你的战士技能冲破阻碍，消灭怪物，抵达战士雕像夺取圣剑吧！祝你好运！");
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 610030000) {
        cm.sendOk("风暴法师的创始人德弗里西恩家族是一支传奇的英雄家族。这个家族非常特别，每一代子孙都能完整继承先祖的所有战斗技巧。凭借无限的战术策略与临场应变，他们击败了无数强敌，是名副其实代代相传的传奇世家。");
        cm.dispose();
    } else if (cm.getPlayer().getMapId() == 610030510) {
        if (cm.getPlayer().getMap().countMonsters() == 0) {
            var eim = cm.getEventInstance();
            var stgStatus = eim.getIntProperty("glpq5_room");
            var jobNiche = cm.getPlayer().getJob().getJobNiche();

            if ((stgStatus >> jobNiche) % 2 == 0) {
                if (cm.canHold(4001259, 1)) {
                    cm.gainItem(4001259, 1);
                    cm.sendOk("干得漂亮！你成功获得了武器！");

                    stgStatus += (1 << jobNiche);
                    eim.setIntProperty("glpq5_room", stgStatus);
                } else {
                    cm.sendOk("请确保你的其它栏至少有 1 个空位。");
                }
            } else {
                cm.sendOk("这个房间内的试炼武器已经被取走了。");
            }
        } else {
            cm.sendOk("请先消灭房间内所有的绯红守卫！");
        }
        cm.dispose();
    }
}