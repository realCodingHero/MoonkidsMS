/*
    阿烈达 - 冰峰雪域长老板屋 (211000001)
    飞侠三转导师 (CMS标准地道化重构)
*/

status = -1;
var sel;
actionx = {"Mental": false, "Physical": false};

function start() {
    var jobBase = parseInt(cm.getJobId() / 100);
    var jobStyle = 4; // 飞侠
    if (!(cm.getPlayer().getLevel() >= 70 && jobBase == jobStyle && cm.getJobId() % 10 == 0)) {
        if (cm.getPlayer().getLevel() >= 50 && jobBase % 10 == jobStyle) {
            status++;
            action(1, 0, 1);
            return;
        }

        cm.sendNext("你好，潜行于暗影之中的致命飞侠。");
        cm.dispose();
        return;
    }

    if (cm.haveItem(4031058)) {
        actionx["Mental"] = true;
    } else if (cm.haveItem(4031057)) {
        actionx["Physical"] = true;
    }

    cm.sendSimple("有什么我可以帮你的吗？#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#我想接受飞侠的三转试炼。" : "") + "\r\n#L1#我想申请挑战扎昆的资格。");
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
            cm.sendNext("干得漂亮！你成功通过了神圣之石的智慧试炼。你展现出的博大阅历与冷静洞察力令人折服。在举行晋升仪式之前，请先把智慧项链交还给我吧。");
        } else if (status == 1) {
            cm.sendYesNo("好极了！现在，在我的引导下，你将觉醒成为暗影中最顶尖的刺客大师。在转职前，请确保在70级前获得的所有技能点（SP）已全部使用完毕。由于你早在二转时就确立了刺客或侠盗路线，三转将直接深化你的暗杀之道。\r\n\r\n你准备好正式晋升为三转职业了吗？");
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

            if (Math.floor(cm.getJobId() / 10) == 41) {
                cm.sendNext("恭喜你正式转职成为#b无影人（标飞）#k！\r\n\r\n你领悟了飞镖投掷的巅峰技艺：召唤影子与你同步投掷飞镖造成双倍打击的灵魂神技#b影分身#k、消耗金币引爆高额固定伤害的#b金钱攻击#k、毒杀群敌的#b吸血蝙蝠/药剂精通#k，以及增强机动性的暗影步法！");
            } else {
                cm.sendNext("恭喜你正式转职成为#b侠盗（神偷）#k！\r\n\r\n你领悟了短刀近身搏杀的终极杀阵：化作落叶在怪物丛中极速来回穿梭斩杀的#b落叶斩#k、引爆地面所有金币造成毁灭巨响的#b金钱炸弹#k，以及在暗影隐身状态下蓄力爆发致命一击的#b暗杀/转化术#k！");
            }
        } else if (status == 3) {
            cm.sendNextPrev("我已经为你注入了全新的能力点（AP）与技能点（SP）。你现在已经是一位名动大陆的暗影刺客大师了！但请谨记，真正的刺客永远潜伏于阴影之中。当你感到暗杀与遁术修为达到极限之时，欢迎再回到这里找我！");
            cm.dispose();
        }
    } else if (actionx["Physical"]) {
        if (status == 0) {
            cm.sendNext("做得非常出色！你成功击败了废弃都市导师达克鲁的分身，夺回了黑符，证明了你凌厉狠绝的身手。把黑符交给我吧。");
        } else if (status == 1) {
            if (cm.haveItem(4031057)) {
                cm.gainItem(4031057, -1);
                cm.getPlayer().setPartyQuestItemObtained("JBQ");
            }
            cm.sendNextPrev("接下来是第二阶段——智慧与阅历的试炼。一名行走于阴影中的真正刺客，冷静睿智的头脑往往比手中的锋刃更加致命。\r\n\r\n在神秘岛雪原深处的隐秘之地，矗立着远古流传的【神圣之石】。你需要献上一颗 #b#t4005004##k 作为祭品，神圣之石将会对你展开智慧的考验。");
        } else if (status == 2) {
            cm.sendNextPrev("你必须连续回答正确它提出的所有问题。成功通过试炼后，神圣之石会赐予你 #b#t4031058##k。把智慧项链带回来交给我，我就为你举行正式的三转仪式。祝你好运！");
            cm.dispose();
        }
    } else if (cm.getPlayer().gotPartyQuestItem("JB3") && selection == 0) {
        cm.sendNext("请返回金银岛废弃都市与飞侠导师 #b#p1052001##k 对话，击败他的分身并带回 #b#t4031057##k。");
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
                    cm.sendYesNo("欢迎你，刺客。我是冰峰雪域长老板屋的飞侠长老 #b#p2020011##k。你的身手已无比敏捷，看来你已经准备好迈向飞侠三转的至高境界了。\r\n\r\n你确定已经做好了准备，接受三转试炼的严苛考验了吗？");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("很好！飞侠的三转试炼分为两大核心：身手的考验与智慧的考验。\r\n\r\n首先是身手的考验：请返回金银岛废弃都市，拜访你的入门导师 #b#p1052001##k。他会引导你前往异次元空间迎战他的分身。击败分身后，将象征胜利的 #b#t4031057##k 带回给我。");
                } else if (status == 2) {
                    cm.sendNextPrev("唯有当你带回 #b#t4031057##k 证明了自身潜行刺杀之术后，我们才能开启后续的智慧试炼。我已经向 #b#p1052001##k 发送了密函，去吧，愿暗影永远庇护你的脚步！");
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
