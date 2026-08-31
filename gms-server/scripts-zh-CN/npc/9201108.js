/* @Author SharpAceX
*/

function start() {
    if (cm.getPlayer().getMapId() == 610030500) {
        cm.sendOk("一位被称为大师守护者的强大生物正等待着你的挑战！它曾是一只绯红守卫，经过改造后对魔法、枪矛、钝器等几乎所有武器都有着极高的抗性，唯独无法抵挡强力箭矢的贯穿！弓箭手们，作为百步穿杨的无可争议的射术大师，拿出你们最强劲的箭术技能——从四连射、暴风箭雨到穿透箭，摧毁这个强大的怪物，抵达弓箭手雕像并夺取祖传之弓吧！祝你好运！");
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 610030000) {
        cm.sendOk("洛克伍德是少数名震大陆的神圣弓手之一，也是要塞中最著名的英雄。他使用经过女神祝福的白金特制箭矢，拥有超远距离的精准射击能力。凭借其绝技“创世之箭”与“末日不死鸟”，他曾一次性击倒英雄之谷中的六只泰坦巨兽，受万人敬仰。");
        cm.dispose();
    } else if (cm.getPlayer().getMapId() == 610030540) {
        if (cm.getPlayer().getMap().countMonsters() == 0) {
            var eim = cm.getEventInstance();
            var stgStatus = eim.getIntProperty("glpq5_room");
            var jobNiche = cm.getPlayer().getJob().getJobNiche();

            if ((stgStatus >> jobNiche) % 2 == 0) {
                if (cm.canHold(4001258, 1)) {
                    cm.gainItem(4001258, 1);
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
            cm.sendOk("请先消灭房间内所有的大师守护者！");
        }
        cm.dispose();
    }
}