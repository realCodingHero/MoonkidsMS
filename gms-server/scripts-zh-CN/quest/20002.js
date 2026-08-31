/*
    NPC Name:       Kiku (奇姆)
    Map(s):         Empress' Road : Training Forest I (圣地: 提鲁的森林 130010000)
    Description:    Quest - 奇姆的修炼指导
    Quest ID :      20002
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode > 0) {
            status++;
        } else {
            status--;
        }
        
        if (status == 0) {
            qm.sendNext("什么？是指挥官那因哈特派你来的？啊，你一定就是新加入的见习骑士吧！欢迎欢迎！我叫奇姆，我的职责就是指导和训练像你这样的新人，让你成长为一名合格的圣地骑士！咦……你为什么用这种好奇的眼神看着我？哈哈，你之前一定没见过我们皮约族吧？");
        } else if (status == 1) {
            qm.sendNext("我们属于圣地特有的灵兽种族——皮约族。你之前已经见过策士那因哈特了吧？他也是我们皮约族的一员哦！我们皮约族只生活在美丽的圣地埃雷夫，虽然你一开始可能会觉得有点新奇，但相信很快你就会喜欢上这里的！");
        } else if (status == 2) {
            qm.sendAcceptDecline("对了，你可能已经注意到了，在神圣的圣地岛屿上是不会有任何邪恶怪物的。任何邪恶气息都无法踏上这片纯净的土地。不过别担心，策士大人施展幻术创造了用于练习的幻影怪物，它们就是你的训练对手。准备好开始第一次基础修炼了吗？");
        } else if (status == 3) {
            qm.forceStartQuest();
            qm.forceCompleteQuest();

            qm.gainExp(60);
            qm.gainItem(2000020, 10); // 初学者红色药水
            qm.gainItem(2000021, 10); // 初学者蓝色药水
            qm.gainItem(1002869, 1);  // 初学者见习帽

            qm.sendOk("哈哈！我就喜欢你这种充满干劲的年轻人！但在开始前，你必须做好万全准备：装备好你的见习武器，将技能摆放至快捷键。我还送了你一些初学者恢复药水，以备不时之需。准备就绪后就去消灭幻影怪物吧！");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}
