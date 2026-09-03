/*
    佩特伦 - 冰峰雪域长老板屋 (211000001)
    海盗三转导师 (CMS标准地道化重构)
*/

status = -1;
var sel;
actionx = {"Mental": false, "Physical": false};

function start() {
    var jobBase = parseInt(cm.getJobId() / 100);
    var jobStyle = 5; // 海盗
    if (!(cm.getPlayer().getLevel() >= 70 && jobBase == jobStyle && cm.getJobId() % 10 == 0)) {
        if (cm.getPlayer().getLevel() >= 50 && jobBase % 10 == jobStyle) {
            status++;
            action(1, 0, 1);
            return;
        }

        cm.sendNext("你好，崇尚自由的大海冒险家！");
        cm.dispose();
        return;
    }

    if (cm.haveItem(4031058)) {
        actionx["Mental"] = true;
    } else if (cm.haveItem(4031057)) {
        actionx["Physical"] = true;
    }

    cm.sendSimple("有什么我可以帮你的吗？#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#我想接受海盗的三转试炼。" : "") + "\r\n#L1#我想申请挑战扎昆的资格。");
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
            cm.sendNext("干得漂亮！你成功通过了神圣之石的智慧试炼。你展现出的博大阅历与豪迈见识令人赞叹。在举行晋升仪式之前，请先把智慧项链交还给我吧。");
        } else if (status == 1) {
            cm.sendYesNo("好极了！现在，在我的引导下，你将觉醒成为纵横四海的海盗大师。在转职前，请确保在70级前获得的所有技能点（SP）已全部使用完毕。由于你早在二转时就确立了拳手或枪手路线，三转将直接深化你的霸者之道。\r\n\r\n你准备好正式晋升为三转职业了吗？");
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
                cm.getPlayer().removePartyQuestItem("JB3");
                cm.getPlayer().removePartyQuestItem("JBP");
            }

            if (Math.floor(cm.getJobId() / 10) == 51) {
                cm.sendNext("恭喜你正式转职成为#b大副（拳霸）#k！\r\n\r\n你领悟了聚能拳法与变身神技：积蓄斗气爆发无敌气劲的#b能量获得/能量暴击#k、化身巨大赛亚人形态横扫千军的#b变身术/超级变身#k、聚气向前轰出巨大光束的#b聚能激光#k，以及极具爆发力的碎石破地绝技！");
            } else {
                cm.sendNext("恭喜你正式转职成为#b大副（枪神）#k！\r\n\r\n你领悟了重火力枪斗术与投弹神技：召唤狂轰滥炸的#b章鱼投弹手#k、给子弹附加烈焰与极寒冰冻效果的#b火焰喷射/寒冰喷射#k、多重火力精准索敌的#b多重射击#k，以及提升枪火杀伤力的枪械精通！");
            }
        } else if (status == 3) {
            cm.sendNextPrev("我已经为你注入了全新的能力点（AP）与技能点（SP）。你现在已经是一位名扬汪洋的大海盗了！但请谨记，前方的波涛怒海中还有更宏伟的航程等待着你。当你感到自身修为达到巅峰之时，欢迎再回到这里找我！");
            cm.dispose();
        }
    } else if (actionx["Physical"]) {
        if (status == 0) {
            cm.sendNext("做得非常出色！你成功击败了诺特勒斯号船长卡伊琳的分身，夺回了黑符，证明了你强悍无匹的战斗力。把黑符交给我吧。");
        } else if (status == 1) {
            if (cm.haveItem(4031057)) {
                cm.gainItem(4031057, -1);
                cm.getPlayer().setPartyQuestItemObtained("JBQ");
            }
            cm.sendNextPrev("接下来是第二阶段——智慧与阅历的试炼。一名征服大海的真正船长，睿智洞察的头脑与博大见识至关重要。\r\n\r\n在神秘岛雪原深处的隐秘之地，矗立着远古流传的【神圣之石】。你需要献上一颗 #b#t4005004##k 作为祭品，神圣之石将会对你展开智慧的考验。");
        } else if (status == 2) {
            cm.sendNextPrev("你必须连续回答正确它提出的所有问题。成功通过试炼后，神圣之石会赐予你 #b#t4031058##k。把智慧项链带回来交给我，我就为你举行正式的三转仪式。祝你好运！");
            cm.dispose();
        }
    } else if (cm.getPlayer().gotPartyQuestItem("JB3") && selection == 0) {
        cm.sendNext("请返回金银岛诺特勒斯号与海盗导师 #b#p1090000##k 对话，击败她的分身并带回 #b#t4031057##k。");
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
                    cm.sendYesNo("欢迎你，海盗勇士。我是冰峰雪域长老板屋的海盗长老 #b#p2020013##k。你的豪气与胆魄非同凡响，看来你已经准备好迈向海盗三转的大师之路了。\r\n\r\n你确定已经做好了准备，接受三转试炼的严苛考验了吗？");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("很好！海盗的三转试炼分为两大核心：武力的考验与智慧的考验。\r\n\r\n首先是武力的考验：请返回金银岛诺特勒斯号，拜访你的入门导师 #b#p1090000##k。她会引导你前往异次元空间迎战她的分身。击败分身后，将象征胜利的 #b#t4031057##k 带回给我。");
                } else if (status == 2) {
                    cm.sendNextPrev("唯有当你带回 #b#t4031057##k 证明了自身实力后，我们才能开启后续的智慧试炼。我已经向 #b#p1090000##k 发送了信函，去吧，愿狂风暴雨为你加冕！");
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
