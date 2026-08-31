var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
        cm.sendGetText("通往封印神殿的入口……请输入#b暗号#k！");
    } else if (status == 1) {
        if (cm.getWarpMap(925040100).countPlayers() > 0) {
            cm.sendOk("有人已经在前往封印神殿的路上了。");
            cm.dispose();
            return;
        }
        var text = cm.getText();
        if (text == "Actions speak louder than words" || text == "行动胜于雄辩" || text == "百闻不如一见" || text == "实践胜于空谈") {
            if (cm.isQuestStarted(21747) && cm.getQuestProgressInt(21747, 9300351) == 0) {
                cm.warp(925040100, 0);
            } else {
                cm.playerMessage(5, "虽然你说对了暗号，但似乎有一股神秘的力量阻挡了去路。");
            }

            cm.dispose();
        } else {
            cm.sendOk("#r暗号错误！");
        }
    } else if (status == 2) {
        cm.dispose();
    }
}
