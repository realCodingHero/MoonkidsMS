/*
    改名卡 NPC
    CMS标准地道化重构
*/

var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
        cm.sendGetText("请输入你心仪的全新角色昵称：");
    } else if (status == 1) {
        var newName = cm.getText();
        if (newName == null || newName.length < 2 || newName.length > 12) {
            cm.sendOk("角色昵称长度必须在 2 到 12 个字符之间，请重新输入。");
            cm.dispose();
            return;
        }
        if (cm.changeName(newName)) {
            cm.sendOk("恭喜！角色昵称已成功更改为：#b" + newName + "#k。请重新登录以使新名称完全生效！");
        } else {
            cm.sendOk("该昵称已被其他玩家占用或包含非法字符，请更换其他昵称再试。");
        }
        cm.dispose();
    }
}
