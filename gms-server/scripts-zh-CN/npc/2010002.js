var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.sendOk("如果你想前往公园散步，随时可以来找我。");
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            cm.sendNext("这里是天空之城的宠物公园。带着你心爱的宠物来这里散步吧！");
        } else if (status == 1) {
            cm.sendSimple("你想要去哪里？\r\n#b#L0#进入宠物公园#l\r\n#L1#前往宠物训练场#l#k");
        } else if (status == 2) {
            if (selection == 0) {
                cm.warp(200000201, 0);
            } else {
                cm.warp(200000202, 0);
            }
            cm.dispose();
        }
    }
}
