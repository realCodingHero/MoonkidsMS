var status;
var jobId = 0;

function start() {
    status = -1;
    //const GameConfig = Java.type('org.gms.config.GameConfig');
    //if (!GameConfig.getServerBoolean("use_rebirth_system"))
      //  cm.sendOk("转生在这个服务器上是不允许的，你是怎么到这里来的？");
        //cm.dispose();
        //return;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        cm.sendNext("当你想要再次转生时，就来找我吧。你目前总共转生了 #r" + cm.getChar().getReborns() + "#k 次。");
    } else if (status === 1) {
        cm.sendSimple("你今天想做什么呢？\r\n\r\n#L0##b我想转生！#l\r\n#L1##b[返回枫叶助手主菜单]#k#l");
    } else if (status === 2) {
        if (selection === 0) {
            if (cm.getChar().getLevel() === cm.getChar().getMaxClassLevel()) {
                cm.sendSimple("我明白了……你想选择哪条转生之路？\r\n\r\n#L0##b冒险家（新手）#l\r\n");//*#L1##b圣地（贵族）#l\r\n#L2##b战神（传说）#l
            } else {
                cm.sendOk("看起来你的修行还未圆满……当你达到等级 #b" + cm.getChar().getMaxClassLevel() + "#k 级时再来找我吧。");
                cm.dispose();
            }
        } else if (selection === 1) {
            cm.dispose();
            cm.openNpc(9900001);
            return;
        }
    } else if (status === 3) {
        // 0 => beginner, 1000 => noblesse, 2000 => legend
        // makes this very easy :-)
        jobId = selection * 1000;

        var job = "";
        if (selection === 0) job = "0";
        else if (selection === 1) job = "1000";
        else if (selection === 2) job = "2000";
        cm.sendYesNo("你确定要转生为冒险家吗？");
    }
    else if (status === 4 && type === 1) {
        cm.getChar().executeRebornAsId(jobId);
        cm.dropMessage(0, "恭喜 " + cm.getPlayer().getName() + " 进行了第 " + cm.getChar().getReborns() + " 次转生！");
        cm.dispose();
    }
}