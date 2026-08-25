var item;
var stance;
var status = -1;
var vecItem;

function end(mode, type, selection) {
    if (mode == 0) {
        qm.dispose();
        return;
    }
    status++;

    if (status == 0) {
        qm.sendNext("哇……就是这个！！！有了这份样本，地球防御总部的研究项目必将迎来突破性进展！没想到竟然能遇到比我更有狩猎天赋的人，我都快被你惊呆了。我也得加倍努力才行！总之，由于你出色地完成了任务，这是属于你的丰厚报酬。");
    } else if (status == 1) {
        var talkStr = "Here, please select the scroll of your choice. All success rates are at 10%. \r\n\r\n#rSELECT A ITEM\r\n#b"
        stance = qm.getPlayer().getJobStyle();

        const Job = Java.type('org.gms.client.Job');
        if (stance == Job.WARRIOR || stance == Job.BEGINNER) {
            vecItem = [2043002, 2043102, 2043202, 2044002, 2044102, 2044202, 2044402, 2044302];
        } else if (stance == Job.MAGICIAN) {
            vecItem = [2043702, 2043802];
        } else if (stance == Job.BOWMAN || stance == Job.CROSSBOWMAN) {
            vecItem = [2044502, 2044602];
        } else if (stance == Job.THIEF) {
            vecItem = [2043302, 2044702];
        } else {
            vecItem = [2044802, 2044902];
        }

        for (var i = 0; i < vecItem.length; i++) {
            talkStr += "\r\n#L" + i + "# #i" + vecItem[i] + "# #t" + vecItem[i] + "#";
        }
        qm.sendSimple(talkStr);
    } else if (status == 2) {
        item = vecItem[selection];
        item = qm.gainItem(item, 1);

        if (item != null) {
            qm.gainExp(12000);
            qm.completeQuest();
        }

        qm.dispose();
    }
}
