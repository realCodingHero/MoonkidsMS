/**
 * @description 魔法师教官汉斯，用nextLevel框架实现示例
*/

var job = 210;

const SPAWN_PNPC_FEE = 7000000;
const JOB_TYPE = 2;
const GameConstants = Java.type('org.gms.constants.game.GameConstants');

function start() {
    levelStart();
}

/**
 * @description 脚本开始执行入口
 */
function levelStart() {
    // 是魔法师职业，且能加入名人堂
    if (parseInt(cm.getJobId() / 100) === JOB_TYPE && cm.canSpawnPlayerNpc(GameConstants.getHallOfFameMapid(cm.getJob()))) {
        levelStartHallOfFame();
    } else {
        levelStartChangeJob();
    }
}

/**
 * @description 处理名人堂相关的起始方法
 */
function levelStartHallOfFame() {
    let sendStr = "经历了漫长的冒险旅途，你终于拥有了今天的力量、智慧与勇气，不是吗？你想现在就在#r名人堂中留下你现在的角色形象NPC#k吗？";
    if (SPAWN_PNPC_FEE > 0) {
        sendStr += " 我可以为你办理，费用是 #b" + cm.numberWithCommas(SPAWN_PNPC_FEE) + " 金币#k。";
    }
    // 选择否就调用levelDispose，选择是就走levelCheckHallOfFame
    cm.sendYesNoLevel("Dispose", "CheckHallOfFame", sendStr);
}

/**
 * @description 校验并执行名人堂操作
 */
function levelCheckHallOfFame() {
    if (cm.getMeso() < SPAWN_PNPC_FEE) {
        // 点击ok调用dispose
        cm.sendOkLevel("Dispose", "抱歉，你没有足够的金币在名人堂设立雕像。");
        return;
    }

    const PlayerNPC = Java.type('org.gms.server.life.PlayerNPC');
    let msg;
    if (PlayerNPC.spawnPlayerNPC(GameConstants.getHallOfFameMapid(cm.getJob()), cm.getPlayer())) {
        cm.gainMeso(-SPAWN_PNPC_FEE);
        msg = "搞定了！希望你喜欢你的雕像。";
    } else {
        msg = "抱歉，名人堂目前已满……";
    }
    // 点击ok调用levelDispose
    cm.sendOkLevel("Dispose", msg);
}

/**
 * @description 处理转职相关的起始方法
 */
function levelStartChangeJob() {
    if (cm.getJobId() === 0) {
        // 1转，点击下一步进入levelStartFistJob
        cm.sendNextLevel("StartFistJob", "想要成为一名#r魔法师#k吗？想要参透魔法的奥秘，必须满足基本条件……#b等级达到8级以上，且" + cm.getFirstJobStatRequirement(JOB_TYPE) + "#k。让我来看看你的资质吧。");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
    } else if (cm.getLevel() >= 30 && cm.getJobId() === 200) {
        // 2转
        if (cm.haveItem(4031012)) {
            // 点击下一步进入levelStartSecondJob1
            cm.sendNextLevel("StartSecondJob1", "做得不错。看来你已经做好了向更广阔的魔法世界迈出下一步的准备。");
        } else if (cm.haveItem(4031009)) {
            // 点击ok调用levelDispose
            cm.sendOkLevel("Dispose", "去找魔法师二转转职教官#b#p1072001##k吧。");
        } else {
            // 点击下一步进入levelStartSecondJob2
            cm.sendNextLevel("StartSecondJob2", "你取得的进步令人惊叹。不知不觉中，你已经成长为一名优秀的魔法师了。");
        }
    } else if ((cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 === 0 && parseInt(cm.getJobId() / 100) === 2 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
        // 3转，点击下一步进入levelStartThirdJob1
        cm.sendNextLevel("StartThirdJob1", "你来了。几天前，神秘岛的#b#p2020009##k跟我提起过你。听说你想进行魔法师的三转。为了实现这个目标，我必须测试你的实力，看看你是否具备晋升的资格。在金银岛的邪恶森林深处有一处入口通往次元裂缝。进入后你将面对我的分身。你的任务是打败他，并带回#b#t4031059##k。");
    } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
        // 3转，点击ok调用levelDispose
        cm.sendOkLevel("Dispose", "请击败邪恶森林次元裂缝中的分身，带回#b#t4031059##k给我。");
    } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
        // 3转，点击下一步进入levelStartThirdJob2
        cm.sendNextLevel("StartThirdJob2", "干得好！你打败了我的分身，并安全带回了#b#t4031059##k。你战胜了我的分身，向我证明了你坚韧不拔的强大实力。现在你应该把这条项链交给在冰峰雪域长老板屋的#b#p2020009##k，去开启智慧的试炼吧。祝你好运！");
    } else {
        // 点击ok调用levelDispose
        cm.sendOkLevel("Dispose", "你做出了明智的选择。");
    }
}

/**
 * @description 1转处理入口
 */
function levelStartFistJob() {
    if (cm.getLevel() >= 8 && cm.canGetFirstJob(JOB_TYPE)) {
        // 点击否调用levelDispose，点击是走levelFinishFirstJob1
        cm.sendYesNoLevel("Dispose", "FinishFirstJob1", "哦……！你身上散发着不寻常的魔力潜质。那么，你准备好成为一名掌握自然元素的魔法师了吗？");
    } else {
        // 点击ok调用levelDispose
        cm.sendOkLevel("Dispose", "请再去努力训练一下吧。等你达到基本要求后，我就可以引导你成为一名#r魔法师#k。");
    }
}

function levelFinishFirstJob1() {
    if (cm.canHold(1372043)) {
        if (cm.getJobId() === 0) {
            cm.changeJobById(200);
            cm.gainItem(1372043, 1);
            cm.resetStats();
        }
        // 点击下一步进入levelFinishFirstJob2
        cm.sendNextLevel("FinishFirstJob2", "很好，从现在开始，你就是我们魔法师的一员了！虽然魔法的修行之路艰辛漫长，但只要坚持下去，你一定会掌握无上的智慧与力量。那么，虽然不多，但我会传授给你一些魔力……喝啊啊啊！！");
    } else {
        // 点击ok调用levelDispose
        cm.sendOkLevel("Dispose", "请清理一下你的背包，然后再来找我。");
    }
}

function levelFinishFirstJob2() {
    // 点击上一步返回levelFinishFirstJob1，下一步进入levelFinishFirstJob3
    cm.sendLastNextLevel("FinishFirstJob1", "FinishFirstJob3", "你现在变得比以前更强了，并且所有背包栏的容量都增加了一行。自己打开背包看看吧。我还给了你一些 #b技能点数（SP）#k。点击屏幕左下角的 #b技能#k 菜单，就可以使用SP学习魔法技能。不过要注意：技能需要逐步提升，部分高阶技能需要先习得前置技能才能学习。");
}

function levelFinishFirstJob3() {
    // 点击上一步返回levelFinishFirstJob2，下一步进入levelFinishFirstJob4
    cm.sendLastNextLevel("FinishFirstJob2", "FinishFirstJob4", "不过请记住，光有技能还不够。作为一名魔法师，属性点的分配至关重要。魔法师的主属性是智力（INT），副属性是运气（LUK）。如果不确定如何分配，可以使用#b自动分配#k。");
}

function levelFinishFirstJob4() {
    // 点击上一步返回levelFinishFirstJob3，下一步进入levelFinishFirstJob5
    cm.sendLastNextLevel("FinishFirstJob3", "FinishFirstJob5", "另外提醒你一句：今后在战斗中如果不幸阵亡，将会损失一部分当前经验值。魔法师的体质相对较弱，血量偏低，一定要格外小心！");
}

function levelFinishFirstJob5() {
    // 点击上一步返回levelFinishFirstJob4，下一步直接levelDispose
    cm.sendLastNextLevel("FinishFirstJob4", "Dispose", "这就是我能教给你的一切了。祝你在冒险旅途中一切顺利，年轻的魔法师！");
}

/**
 * @description 2转处理入口1
 */
function levelStartSecondJob1() {
    // 选择0进入levelSecondJobSelect0，选择1进入levelSecondJobSelect1，选择2进入levelSecondJobSelect2，选择3进入levelSecondJobSelect3
    cm.sendSelectLevel("SecondJobSelect", "考虑好之后，请点击底部的[决定选择职业]。#b\r\n#L0#请为我说明巫师（火/毒）职业。\r\n#L1#请为我说明巫师（冰/雷）职业。\r\n#L2#请为我说明牧师职业。\r\n#L3#我已经决定好要转职的职业！");
}

function levelSecondJobSelect0() {
    // 点击下一步返回levelStartSecondJob1
    cm.sendNextLevel("StartSecondJob1", "掌握#r火焰与剧毒魔法#k的巫师。\r\n\r\n#b巫师（火/毒）#k擅长操控火与毒属性的魔法攻击，能对惧怕火毒属性的敌人造成毁灭性打击。通过#r精神力#k和#r缓速术#k等辅助技能，可以大幅提升魔法攻击力并减缓敌人速度。核心技能为强力的火焰箭与剧毒术。");    //f/p mage
}

function levelSecondJobSelect1() {
    // 点击下一步返回levelStartSecondJob1
    cm.sendNextLevel("StartSecondJob1", "掌握#r寒冰与雷电魔法#k的巫师。\r\n\r\n#b巫师（冰/雷）#k擅长操控冰与雷属性的魔法攻击，能对惧怕冰雷属性的敌人造成巨大伤害。冰系技能可以冻结控制敌人，雷系技能可以对群体敌人进行雷电轰击。此外还可以使用#r精神力#k和#r缓速术#k等实用技能。");    //i/l mage
}

function levelSecondJobSelect2() {
    // 点击下一步返回levelStartSecondJob1
    cm.sendNextLevel("StartSecondJob1", "掌握#r神圣魔法#k的圣职者。\r\n\r\n#b牧师#k是极受欢迎的团队支援职业。他们拥有#r群体治愈#k技能，可以为自己和队友恢复生命值；还可以施展#r神圣之光#k和#r祝福#k等技能增强防御与属性。在面对不死系和恶魔系怪物时，牧师的圣属性攻击格外致命。");    //cleric
}

function levelSecondJobSelect3() {
    // 选择4进入levelSecondJobSelect4，选择5进入levelSecondJobSelect5，选择6进入levelSecondJobSelect6
    cm.sendSelectLevel("SecondJobSelect", "现在... 你决定好了吗？请选择你想要在二转时选择的职业：#b\r\n#L4#巫师（火 / 毒）\r\n#L5#巫师（冰 / 雷）\r\n#L6#牧师");
}

function levelSecondJobSelect4() {
    job = 210;
    // 选择否直接levelDispose，选择是进入levelFinishSecondJob1
    cm.sendYesNoLevel("Dispose", "FinishSecondJob1", "你决定要转职成为#b巫师（火/毒）#k吗？一旦做出选择，将无法更改二转职业，确定吗？");
}

function levelSecondJobSelect5() {
    job = 220;
    // 选择否直接levelDispose，选择是进入levelFinishSecondJob1
    cm.sendYesNoLevel("Dispose", "FinishSecondJob1", "你决定要转职成为#b巫师（冰/雷）#k吗？一旦做出选择，将无法更改二转职业，确定吗？");
}

function levelSecondJobSelect6() {
    job = 230;
    // 选择否直接levelDispose，选择是进入levelFinishSecondJob1
    cm.sendYesNoLevel("Dispose", "FinishSecondJob1", "你决定要转职成为#b牧师#k吗？一旦做出选择，将无法更改二转职业，确定吗？");
}

function levelFinishSecondJob1() {
    if (cm.haveItem(4031012)) {
        cm.gainItem(4031012, -1);
    }
    cm.completeQuest(100008);
    // 下一步进入levelFinishSecondJob2
    cm.sendNextLevel("FinishSecondJob2", "很好，从现在起你就是一名#b" + getJobName() + "#k了！魔法师拥有不可思议的智慧与精神力量，能够洞悉怪物的弱点并用奥术予以惩戒。请坚持刻苦训练，我会一直注视着你的成长。");
    if (cm.getJobId() !== job) {
        cm.changeJobById(job);
    }
}

function levelFinishSecondJob2() {
    // 上一步返回levelFinishSecondJob1，下一步进入levelFinishSecondJob3
    cm.sendLastNextLevel("FinishSecondJob1", "FinishSecondJob3", "我刚才给了你二转技能书，同时你的背包空间和最大生命值、魔法值也都得到了提升。快去查看一下吧。");
}

function levelFinishSecondJob3() {
    // 上一步返回levelFinishSecondJob2，下一步进入levelFinishSecondJob4
    cm.sendLastNextLevel("FinishSecondJob2", "FinishSecondJob4", "我还给了你一些 #b技能点数（SP）#k。打开左下角的 #b技能菜单#k，就可以升级新的二转技能。请记住，某些强力技能需要先满足前置技能等级才能解锁。");
}

function levelFinishSecondJob4() {
    // 上一步返回levelFinishSecondJob3，下一步直接levelDispose
    cm.sendLastNextLevel("FinishSecondJob3", "Dispose", getJobName() + "需要继续变强！但若将自身的力量发泄在弱者身上，这并不是正确的方法。将自己所拥有的力量用在正义之事上，这是比单纯追求强大更重要的课题。好了，相信通过不断修炼，过不了多久我们就会再次相见，我期待着那一天的到来！");
}

/**
 * @description 2转处理入口1
 */
function levelStartSecondJob2() {
    if (!cm.isQuestStarted(100006)) {
        cm.startQuest(100006);
    }
    // 下一步进入levelStartSecondJob3
    cm.sendNextLevel("StartSecondJob3", "做得好。你看起来已经很出色了，但我必须测试你是否真的有实力完成二转。这并不是特别困难的测试，相信你一定能做好。先收下我的推荐信……千万不要弄丢了！");
}

function levelStartSecondJob3() {
    if (cm.canHold(4031009)) {
        if (!cm.haveItem(4031009)) {
            cm.gainItem(4031009, 1);
        }
        // 上一步返回levelStartSecondJob2，下一步直接levelDispose
        cm.sendLastNextLevel("StartSecondJob2", "Dispose", "请将这封推荐信交给魔法密林附近的#b#p1072001##k（位于#b#m101020000##k）。他是魔法师二转转职教官。把信交给这位魔法师，他会负责主持你的转职测试。祝你好运！");
    } else {
        // ok调用levelDispose
        cm.sendOkLevel("Dispose", "请在你的背包中留出足够的空位。");
    }
}

/**
 * @description 3转处理入口1
 */
function levelStartThirdJob1() {
    if (cm.getPlayer().gotPartyQuestItem("JB3")) {
        cm.getPlayer().removePartyQuestItem("JB3");
        cm.getPlayer().removePartyQuestItem("JB3");
        cm.getPlayer().setPartyQuestItemObtained("JBP");
    }
    // 点击上一步，返回levelStartChangeJob，下一步直接levelDispose
    cm.sendLastNextLevel("StartChangeJob", "Dispose", "既然是我的分身，实力自然非同小可，你将面临一场恶战。分身拥有许多强力且特殊的攻击技能，你必须依靠自己的力量一对一将其战胜。另外在次元空间中存在时间限制，你必须在时限内解决战斗。祝你好运，期待你带回#b#t4031059##k。");
}

/**
 * @description 3转处理入口2
 */
function levelStartThirdJob2() {
    cm.getPlayer().removePartyQuestItem("JBP");
    cm.gainItem(4031059, -1);
    cm.gainItem(4031057, 1);
    levelDispose();
}

/**
 * @description 执行dispose
 */
function levelDispose() {
    cm.dispose();
}

/**
 * @description 根据jobId获取job名
 *
 * @returns job名
 */
function getJobName() {
    return job === 210 ? "#b巫师（火/毒）#k" : (job === 220 ? "#b巫师（冰/雷）#k" : "#b牧师#k");
}