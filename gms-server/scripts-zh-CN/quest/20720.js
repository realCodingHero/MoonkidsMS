/*
	QUEST: Before the Mission in Perion Begins
	NPC: Neinheart
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
		qm.sendAcceptDecline("到目前为止修行进展得如何了？这个阶段你大概正在 #m103000000# 参加组队任务吧。虽然提升等级很重要，但现在更需要你以圣骑士团成员的身份去执行新的任务。我们刚刚收到了一条新情报，或许会有所帮助。");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {}