/*
 * Time Temple - Kirston
 * Twilight of the Gods
 */

function start() {
    cm.sendAcceptDecline("只要拥有善良之镜，我就能再次召唤出黑魔法师！\r\n等等！感觉不太对劲！为什么被召唤出来的不是黑魔法师？等一下，这股强大的力量到底是什么？我感受到的……是某种和黑魔法师完全不同的恐怖存在！啊啊啊啊啊！！！！！\r\n\r\n #b(将手搭在克莱斯顿的肩膀上。)#k");
}

function action(mode, type, selection) {
    if (mode == 1) {
        cm.removeNpc(270050100, 2141000);
        cm.forceStartReactor(270050100, 2709000);
    }
    cm.dispose();

// If accepted, = summon PB + Kriston Disappear + 1 hour timer
// If deny = NoTHING HAPPEN
}
