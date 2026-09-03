var status = -1;

function start(mode, type, selection) {
	if (mode == 0 && type == 0) {
		status--;
	} else if (mode == -1) {
		qm.dispose();
		return;
	} else {
		status++;
	}
	if (status == 0) {
		qm.sendAcceptDecline("真奇怪，母鸡们看起来怪怪的。以前明明能产下更多的 #t4032451# 的。你觉得这事跟狐狸有关系吗？如果是的话，我们最好赶快采取行动。");
	} else if (status == 1) {
		if (mode == 0) {//decline
			qm.sendNext("天哪……你竟然害怕 #o9300385#？千万别跟别人说你是我弟弟，太丢人了！");
			qm.dispose();
		} else {
			qm.forceStartQuest();
			qm.sendNext("真的吗？那我们一起去收拾那些狐狸吧！你先去 #b#m100030103##k 消灭 #r10只 #o9300385##k。我会跟在你后面接应你。快去 #m100030103# 吧！");
		}
	} else if (status == 2) {
		qm.sendImage("UI/tutorial/evan/10/0");
		qm.dispose();
	}
}

function end(mode, type, selection) {
	if (mode == 0 && type == 0) {
		status--;
	} else if (mode == -1) {
		qm.dispose();
		return;
	} else {
		status++;
	}
	if (status == 0) {
		qm.sendNext("你把 #o9300385# 都消灭了吗？");
	} else if (status == 1) {
		qm.sendNextPrev("#b消灭狐狸的时候，你在哪儿呢？", 2);
	} else if (status == 2) {
		qm.sendNextPrev("啊，那个啊？哈哈……我本来想去追它们的，但为了确保它们不会绕过去偷袭你，免得你被 #o9300385# 叼走，我就在旁边放哨啦。");
	} else if (status == 3) {
		qm.sendNextPrev("#b你确定你不是因为害怕狐狸才躲起来的吗？", 2);
	} else if (status == 4) {
		qm.sendNextPrev("什么？！怎么可能！我什么都不怕！");
	} else if (status == 5) {
		qm.sendNextPrev("#b小心！#o9300385# 就在你身后！", 2);
	} else if (status == 6) {
		qm.sendNextPrev("妈呀！救命啊——！");	
	} else if (status == 7) {
		qm.sendNextPrev("#b...", 2);	
	} else if (status == 8) {
		qm.sendNextPrev("...");	
	} else if (status == 9) {
		qm.sendNextPrev("你这臭小子！我可是你哥哥！别拿我开涮！你又不是不知道你哥……咳，心脏不好！别这样吓我！");	
	} else if (status == 10) {
		qm.sendNextPrev("#b（这就是为什么我不想叫你哥哥……）", 2);
	} else if (status == 11) {
		qm.sendNextPrev("哼！不管怎么说，你成功消灭了 #o9300385# 还是挺厉害的。作为奖励，我把很久以前一位冒险家送给我的东西给你吧。拿去吧！\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i1372043# 1 #t1372043#\r\n#i2022621# 25 #t2022621#\r\n#i2022622# 25 #t2022622#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 910 exp");
	} else if (status == 12) {
		if (!qm.isQuestCompleted(22008)) {
			qm.gainItem(1372043, true);
			qm.gainItem(2022621, 25, true);
			qm.gainItem(2022622, 25, true);
			qm.forceCompleteQuest();
			qm.gainExp(910);
		}
		qm.sendNextPrev("这是魔法师使用的武器，叫做短杖。虽然你现在可能还用不上，但带在身上看起来会很威风哦！哈哈哈哈！");
	} else if (status == 13) {
		qm.sendPrev("话说回来，狐狸的数量确实变多了对吧？真奇怪，为什么一天比一天多呢？看来我们真得好好调查一下了。");
	} else if (status == 14) {
		qm.dispose();
	}
}