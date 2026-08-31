/*
    罗贝拉 - 冰峰雪域长老板屋 (211000001)
    魔法师三转导师 (CMS标准地道化重构)
*/

status = -1;
var sel;
actionx = {"Mental": false, "Physical": false};

function start() {
    var jobBase = parseInt(cm.getJobId() / 100);
    var jobStyle = 2; // 魔法师
    if (!(cm.getPlayer().getLevel() >= 70 && jobBase == jobStyle && cm.getJobId() % 10 == 0)) {
        if (cm.getPlayer().getLevel() >= 50 && jobBase % 10 == jobStyle) {
            status++;
            action(1, 0, 1);
            return;
        }

        cm.sendNext("你好，漫步于冰雪之中的魔法求道者。");
        cm.dispose();
        return;
    }

    if (cm.haveItem(4031058)) {
        actionx["Mental"] = true;
    } else if (cm.haveItem(4031057)) {
        actionx["Physical"] = true;
    }

    cm.sendSimple("有什么我可以帮你的吗？#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#我想接受魔法师的三转试炼。" : "") + "\r\n#L1#我想申请挑战扎昆的资格。");
}

function action(mode, type, selection) {
    status++;
    if (mode == 0 && type == 0) {
        status -= 2;
    } else if (mode != 1 || (status > 2 && !actionx["Mental"]) || status > 3) {
        if (mode == 0 && type == 1) {
            cm.sendNext("既然你还没考虑清楚，那就等做好准备后再来找我吧。");
        }
        cm.dispose();
        return;
    }

    if (actionx["Mental"]) {
        if (status == 0) {
            cm.sendNext("干得漂亮！你成功通过了神圣之石的智慧试炼。你展现出的博大阅历与深邃心智令人赞叹。在举行晋升仪式之前，请先把智慧项链交还给我吧。");
        } else if (status == 1) {
            cm.sendYesNo("好极了！现在，在我的引导下，你将觉醒成为掌握至高魔导之力的尊贵法师。在转职前，请确保在70级前获得的所有技能点（SP）已全部使用完毕。由于你早在二转时就确立了奥术方向，三转将直接升华你的魔法流派。\r\n\r\n你准备好正式晋升为三转职业了吗？");
        } else if (status == 2) {
            if (cm.getPlayer().getRemainingSp() > 0) {
                if (cm.getPlayer().getRemainingSp() > (cm.getLevel() - 70) * 3) {
                    cm.sendNext("转职前必须将70级之前获得的所有技能点（SP）全部消耗完毕，请分配好技能点后再来找我。");
                    cm.dispose();
                    return;
                }
            }

            if (cm.getJobId() % 10 == 0) {
                cm.gainItem(4031058, -1);
                cm.changeJobById(cm.getJobId() + 1);
                cm.getPlayer().removePartyQuestItem("JBQ");
            }

            if (Math.floor(cm.getJobId() / 10) == 21) {
                cm.sendNext("恭喜你正式转职成为#b火毒魔导士（巫师）#k！\r\n\r\n你领悟了剧毒与烈焰的毁灭奥义：全屏持续剧毒侵蚀的#b致命毒雾#k、对单体爆发极强的#b火凤火球#k，以及大幅提升魔法威力的核心被动#b魔力激化#k与大幅提升吟唱速度的#b魔法狂暴#k！");
            } else if (Math.floor(cm.getJobId() / 10) == 22) {
                cm.sendNext("恭喜你正式转职成为#b冰雷魔导士（巫师）#k！\r\n\r\n你领悟了极寒与雷霆的磅礴伟力：全屏大范围绝对冰封的#b冰咆哮#k、贯穿天际轰击群敌的#b落雷枪#k，以及增强元素破坏力的#b魔力激化#k与提升施法速度的#b魔法狂暴#k！");
            } else {
                cm.sendNext("恭喜你正式转职成为#b祭司#k！\r\n\r\n你获得了圣光神圣力量的真谛：凝聚圣力净化群魔的#b圣光普照#k、全队经验获取大幅提升的团队神技#b神圣祈祷#k、跨越空间直达城镇的#b时空门#k，以及召唤神圣巨龙伴随作战的#b强化圣龙#k！");
            }
        } else if (status == 3) {
            cm.sendNextPrev("我已经为你注入了全新的能力点（AP）与技能点（SP）。你现在已经是一位受人敬仰的高阶法师了！但请谨记，奥术的尽头永无止境。当你感到魔法修为达到瓶颈、需要探寻终极禁咒之时，欢迎再回到这里找我！");
            cm.dispose();
        }
    } else if (actionx["Physical"]) {
        if (status == 0) {
            cm.sendNext("做得非常出色！你成功击败了魔法密林大魔法师汉斯的分身，夺回了黑符，证明了你强大的魔力掌控力。把黑符交给我吧。");
        } else if (status == 1) {
            if (cm.haveItem(4031057)) {
                cm.gainItem(4031057, -1);
                cm.getPlayer().setPartyQuestItemObtained("JBQ");
            }
            cm.sendNextPrev("接下来是第二阶段——智慧与阅历的试炼。一名真正的魔导大师，渊博的智慧远比单纯的破坏力更为可贵。\r\n\r\n在神秘岛雪原深处的隐秘之地，矗立着远古流传的【神圣之石】。你需要献上一颗 #b#t4005004##k 作为祭品，神圣之石将会对你展开智慧的考验。");
        } else if (status == 2) {
            cm.sendNextPrev("你必须连续回答正确它提出的所有问题。成功通过试炼后，神圣之石会赐予你 #b#t4031058##k。把智慧项链带回来交给我，我就为你举行正式的三转仪式。祝你好运！");
            cm.dispose();
        }
    } else if (cm.getPlayer().gotPartyQuestItem("JB3") && selection == 0) {
        cm.sendNext("请返回金银岛魔法密林与大魔法师 #b#p1032001##k 对话，击败他的分身并带回 #b#t4031057##k。");
        cm.dispose();
    } else if (cm.getPlayer().gotPartyQuestItem("JBQ") && selection == 0) {
        cm.sendNext("请前往雪原圣地与 #b#p2030006##k 对话，献上黑暗水晶通过智慧试炼并带回 #b#t4031058##k。");
        cm.dispose();
    } else {
        if (sel == undefined) {
            sel = selection;
        }
        if (sel == 0) {
            if (cm.getPlayer().getLevel() >= 70 && cm.getJobId() % 10 == 0) {
                if (status == 0) {
                    cm.sendYesNo("欢迎你，法师。我是冰峰雪域长老板屋的魔法师长老 #b#p2020009##k。我能感受到你周身澎湃涌动的元素共鸣，看来你已经准备好迈向更高深的奥术境界了。\r\n\r\n你确定已经做好了准备，接受三转试炼的严苛考验了吗？");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("很好！魔法师的三转试炼分为两大核心：魔力的考验与智慧的考验。\r\n\r\n首先是魔力的考验：请返回金银岛魔法密林，拜访你的入门导师 #b#p1032001##k。他会引导你前往异次元空间迎战他的分身。击败分身后，将象征胜利的 #b#t4031057##k 带回给我。");
                } else if (status == 2) {
                    cm.sendNextPrev("唯有当你带回 #b#t4031057##k 证明了自身魔力后，我们才能开启后续的智慧试炼。我已经向 #b#p1032001##k 发送了信函，去吧，愿智慧与奥术之光指引你的前路！");
                    cm.dispose();
                }
            }
        } else {
            if (cm.getPlayer().getLevel() >= 50) {
                cm.sendOk("冰峰雪域长老会已正式批准你的申请，特许你成为 #r扎昆远征队#k 的成员。愿你在讨伐古老魔神扎昆的征程中武运昌隆！");
                if (!(cm.isQuestStarted(100200) || cm.isQuestCompleted(100200))) {
                    cm.startQuest(100200);
                }
                const GameConfig = Java.type('org.gms.config.GameConfig');
                if (GameConfig.getServerBoolean("use_enable_solo_expeditions") && !cm.isQuestCompleted(100201)) {
                    cm.completeQuest(100201);
                }
            } else {
                cm.sendOk("你目前的修为尚浅，还无法承受古代魔神扎昆的可怖力量。请至少提升至 #b50级#k 后再来申请扎昆远征资格。");
            }
            cm.dispose();
        }
    }
}
