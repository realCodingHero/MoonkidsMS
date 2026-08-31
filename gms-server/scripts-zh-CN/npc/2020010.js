/*
    蕾妮 - 冰峰雪域长老板屋 (211000001)
    弓箭手三转导师 (CMS标准地道化重构)
*/

status = -1;
var sel;
actionx = {"Mental": false, "Physical": false};

function start() {
    var jobBase = parseInt(cm.getJobId() / 100);
    var jobStyle = 3; // 弓箭手
    if (!(cm.getPlayer().getLevel() >= 70 && jobBase == jobStyle && cm.getJobId() % 10 == 0)) {
        if (cm.getPlayer().getLevel() >= 50 && jobBase % 10 == jobStyle) {
            status++;
            action(1, 0, 1);
            return;
        }

        cm.sendNext("你好，身手敏捷的巡林神射手。");
        cm.dispose();
        return;
    }

    if (cm.haveItem(4031058)) {
        actionx["Mental"] = true;
    } else if (cm.haveItem(4031057)) {
        actionx["Physical"] = true;
    }

    cm.sendSimple("有什么我可以帮你的吗？#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#我想接受弓箭手的三转试炼。" : "") + "\r\n#L1#我想申请挑战扎昆的资格。");
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
            cm.sendNext("干得漂亮！你成功通过了神圣之石的智慧试炼。你展现出的博大阅历与冷静洞察力令人钦佩。在举行晋升仪式之前，请先把智慧项链交还给我吧。");
        } else if (status == 1) {
            cm.sendYesNo("好极了！现在，在我的引导下，你将觉醒成为百步穿杨的高阶神射手。在转职前，请确保在70级前获得的所有技能点（SP）已全部使用完毕。由于你早在二转时就确立了弓箭或弩弓路线，三转将直接深化你的射术之道。\r\n\r\n你准备好正式晋升为三转职业了吗？");
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

            if (Math.floor(cm.getJobId() / 10) == 31) {
                cm.sendNext("恭喜你正式转职成为#b射手（箭神）#k！\r\n\r\n你领悟了弓系进阶绝技：瞬间连续射出4支强力箭矢的#b四连射#k、箭矢如暴风雨般扫射全场群敌的#b箭雨#k、召唤强力烈火神鸟协同作战的#b替身术/火凤凰#k，以及极大提升致命一击杀伤力的被动技能！");
            } else {
                cm.sendNext("恭喜你正式转职成为#b游侠（神射手）#k！\r\n\r\n你领悟了弩系进阶绝技：射出强力贯穿箭重创沿途所有怪物的#b穿透箭#k、全方位冰封冻结敌人的#b升龙弩/寒冰箭#k、召唤极寒冰凤凰协同作战的#b冰凤凰#k，以及极具破坏力的弩弓专精！");
            }
        } else if (status == 3) {
            cm.sendNextPrev("我已经为你注入了全新的能力点（AP）与技能点（SP）。你现在已经是一位名震四方的强大神射手了！但请谨记，前方的冒险之路上还有更遥远的目标等待着你的弓弦。当你感到箭术修为达到极致之时，欢迎再回到这里找我！");
            cm.dispose();
        }
    } else if (actionx["Physical"]) {
        if (status == 0) {
            cm.sendNext("做得非常出色！你成功击败了射手村导师赫丽娜的分身，夺回了黑符，证明了你出神入化的身手与射术。把黑符交给我吧。");
        } else if (status == 1) {
            if (cm.haveItem(4031057)) {
                cm.gainItem(4031057, -1);
                cm.getPlayer().setPartyQuestItemObtained("JBQ");
            }
            cm.sendNextPrev("接下来是第二阶段——智慧与阅历的试炼。一名百步穿杨的神射手，不仅需要精准的目力，更需要洞悉战局万象的睿智。\r\n\r\n在神秘岛雪原深处的隐秘之地，矗立着远古流传的【神圣之石】。你需要献上一颗 #b#t4005004##k 作为祭品，神圣之石将会对你展开智慧的考验。");
        } else if (status == 2) {
            cm.sendNextPrev("你必须连续回答正确它提出的所有问题。成功通过试炼后，神圣之石会赐予你 #b#t4031058##k。把智慧项链带回来交给我，我就为你举行正式的三转仪式。祝你好运！");
            cm.dispose();
        }
    } else if (cm.getPlayer().gotPartyQuestItem("JB3") && selection == 0) {
        cm.sendNext("请返回金银岛射手村与弓箭手导师 #b#p1012100##k 对话，击败她的分身并带回 #b#t4031057##k。");
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
                    cm.sendYesNo("欢迎你，神射手。我是冰峰雪域长老板屋的弓箭手长老 #b#p2020010##k。你的箭术已炉火纯青，看来你已经准备好迈向三转的神射手殿堂了。\r\n\r\n你确定已经做好了准备，接受三转试炼的严苛考验了吗？");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("很好！弓箭手的三转试炼分为两大核心：箭术的考验与智慧的考验。\r\n\r\n首先是箭术的考验：请返回金银岛射手村，拜访你的入门导师 #b#p1012100##k。她会引导你前往异次元空间迎战她的分身。击败分身后，将象征胜利的 #b#t4031057##k 带回给我。");
                } else if (status == 2) {
                    cm.sendNextPrev("唯有当你带回 #b#t4031057##k 证明了自身射术后，我们才能开启后续的智慧试炼。我已经向 #b#p1012100##k 发送了信函，去吧，愿风指引你的箭道！");
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
