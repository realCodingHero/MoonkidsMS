/*
    泰勒斯 - 冰峰雪域长老板屋 (211000001)
    战士三转导师 (CMS标准地道化重构)
*/

status = -1;
var sel;
actionx = {"Mental": false, "Physical": false};

function start() {
    if (cm.isQuestStarted(6192)) {
        if (cm.getParty() == null) {
            cm.sendOk("请组队后再来开启守护泰勒斯任务。");
            cm.dispose();
            return;
        }

        var em = cm.getEventManager("ElnathPQ");
        if (em == null) {
            cm.sendOk("冰峰雪域组队副本出现异常，请联系管理员。");
            cm.dispose();
            return;
        }

        var eli = em.getEligibleParty(cm.getParty());
        if (eli.size() > 0) {
            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                cm.sendOk("当前已有其他队伍正在挑战该副本，请稍候或更换频道后再试。");
            }
        } else {
            cm.sendOk("您的队伍目前无法开始该副本：请确保所有队员等级符合要求且全部在当前地图内。");
        }

        cm.dispose();
        return;
    }

    var jobBase = parseInt(cm.getJobId() / 100);
    var jobStyle = 1; // 战士
    if (!(cm.getPlayer().getLevel() >= 70 && jobBase == jobStyle && cm.getJobId() % 10 == 0)) {
        if (cm.getPlayer().getLevel() >= 50 && jobBase % 10 == jobStyle) {
            status++;
            action(1, 0, 1);
            return;
        }

        cm.sendNext("你好，勇敢的冒险家。冰峰雪域的寒风正磨砺着每一位坚韧的勇士。");
        cm.dispose();
        return;
    }

    if (cm.haveItem(4031058)) {
        actionx["Mental"] = true;
    } else if (cm.haveItem(4031057)) {
        actionx["Physical"] = true;
    }

    cm.sendSimple("有什么我可以帮你的吗？#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#我想接受战士的三转试炼。" : "") + "\r\n#L1#我想申请挑战扎昆的资格。");
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
            cm.sendNext("干得漂亮！你成功通过了神圣之石的智慧试炼。你展现出的博大阅历与冷静心智令人叹服。在进行最终转职之前，请先把智慧项链交还给我吧。");
        } else if (status == 1) {
            cm.sendYesNo("好极了！现在，在我的见证下，你将觉醒成为更加强大的高阶战士。在转职前，请确保在70级前获得的所有技能点（SP）已全部使用完毕。由于你早在二转时就已经确立了进阶方向，因此三转将直接继承并深化你的职业道路。\r\n\r\n你准备好正式晋升为三转职业了吗？");
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

            if (Math.floor(cm.getJobId() / 10) == 11) {
                cm.sendNext("恭喜你正式转职成为#b勇士（十字军）#k！\r\n\r\n你掌握了全新的战斗核心技能：#b斗气集中#k可随攻击不断积蓄斗气，大幅提升杀伤力；#b虎咆哮#k能发出震慑全场的威吓咆哮重创并击晕大范围敌人；而#b装甲崩溃#k则可彻底化解怪物的防御增益状态！");
            } else if (Math.floor(cm.getJobId() / 10) == 12) {
                cm.sendNext("恭喜你正式转职成为#b骑士（白骑士）#k！\r\n\r\n作为掌控元素之力的圣骑士，你领悟了给武器赋予火、冰、雷属性的#b圣灵之剑/圣灵之槌#k，并能使用#b连环环破#k对敌人弱点造成毁灭性爆发伤害；防御方面，#b魔法抗性#k将极大减轻你受到的魔法伤害！");
            } else {
                cm.sendNext("恭喜你正式转职成为#b龙骑士#k！\r\n\r\n你获得了龙族传承的惊世神力：对单体爆发极强的#b枪连击/矛连击#k、对群体横扫千军的#b无双枪/无双矛#k，以及牺牲生命值召唤全屏龙息毁灭敌人的禁忌神技#b龙之咆哮#k！");
            }
        } else if (status == 3) {
            cm.sendNextPrev("我已经为你注入了全新的能力点（AP）与技能点（SP）。你现在已经是一位名震一方的强大战士了！但请谨记，前方的冒险之路上还有更为艰巨的考验在等待着你。当你感到自身修为达到巅峰、需要探寻更高极意之时，欢迎再回到这里找我！");
            cm.dispose();
        }
    } else if (actionx["Physical"]) {
        if (status == 0) {
            cm.sendNext("做得非常出色！你成功击败了一转导师的分身，夺回了黑符，从力量与毅力上证明了你的坚韧。现在第一阶段的考验已经通过，把黑符交给我吧。");
        } else if (status == 1) {
            if (cm.haveItem(4031057)) {
                cm.gainItem(4031057, -1);
                cm.getPlayer().setPartyQuestItemObtained("JBQ");
            }
            cm.sendNextPrev("接下来是第二阶段——智慧与阅历的试炼。一名真正的伟大战士，不仅要有排山倒海的力量，更需要明辨万物的深邃智慧。\r\n\r\n在神秘岛雪原深处的隐秘之地，矗立着远古流传的【神圣之石】。你需要献上一颗 #b#t4005004##k 作为祭品，神圣之石将会对你展开智慧的考验。");
        } else if (status == 2) {
            cm.sendNextPrev("你必须连续回答正确它提出的所有问题。成功通过试炼后，神圣之石会赐予你 #b#t4031058##k。把智慧项链带回来交给我，我就为你举行正式的三转仪式。祝你好运！");
            cm.dispose();
        }
    } else if (cm.getPlayer().gotPartyQuestItem("JB3") && selection == 0) {
        cm.sendNext("请返回金银岛勇士部落与战士导师 #b#p1022000##k 对话，击败他的分身并带回 #b#t4031057##k。");
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
                    cm.sendYesNo("欢迎你，勇士。我是冰峰雪域长老板屋的战士长老 #b#p2020008##k。我察觉到你体内蕴藏着惊人的潜能，看来你已经准备好迎接三转的蜕变了。但三转试炼充满危险，许多自负的战士都在此折戟沉沙。\r\n\r\n你确定已经做好了准备，接受三转试炼的严苛考验了吗？");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("很好！战士的三转试炼分为两大核心：力量的考验与智慧的考验。\r\n\r\n首先是力量的考验：请返回金银岛勇士部落，拜访你的入门导师 #b#p1022000##k。他会引导你前往异次元空间迎战他的分身。击败分身后，将象征胜利的 #b#t4031057##k 带回给我。");
                } else if (status == 2) {
                    cm.sendNextPrev("唯有当你带回 #b#t4031057##k 证明了自身武力后，我们才能开启后续的智慧试炼。我已经向 #b#p1022000##k 发送了信函，去吧，愿荣耀与胜利伴你同行！");
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
