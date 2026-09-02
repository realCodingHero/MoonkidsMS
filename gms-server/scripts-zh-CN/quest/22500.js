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
		qm.sendNext("我终于出来了！*深吸一口气* 啊，这就是外面的空气吗？那……那一定就是太阳了！还有树木！植物！花朵！哇哈哈！太不可思议了！这比我困在蛋里时想象的世界还要棒得多！还有你……你就是我的主人吗？嗯……你看起来跟我想象的有点不太一样。");
	} else if (status == 1) {
		qm.sendNextPrev("#b哇啊啊！它……它竟然会说话！", 2);
	} else if (status == 2) {
		qm.sendNextPrev("我的主人好像有点呆呆的。不过既然契约已经成立，也没办法了。*呼* 很高兴见到你，以后我们要经常在一起了。");
	} else if (status == 3) {
		qm.sendNextPrev("#b啊？你在说什么啊？经常在一起？什么契约？", 2);
	} else if (status == 4) {
		qm.sendNextPrev("你在说什么傻话啊？！是你把我从蛋里唤醒的，你就是我的主人！所以照顾我、训练我、帮助我成为一条威风凛凛的巨龙，当然都是你的责任啦！这不是明摆着的嘛！");
	} else if (status == 5) {
		qm.sendNextPrev("#b天哪！龙？你说你是龙？！等一下……我为什么会变成你的主人啊？你开玩笑的吧？", 2);
	} else if (status == 6) {
		qm.sendNextPrev("你在说什么呀？你的灵魂和我的灵魂已经定下了契约！我们现在几乎算是一体同心了。这还需要我解释吗？总而言之，你就是我的主人，我们受契约的束缚，你可不能反悔……契约是一旦定下就无法解除的！");		
	} else if (status == 7) {
		qm.sendNextPrev("#b等等……等等！让我捋一捋。你的意思是说，除了照顾你，我别无选择？", 2);
	} else if (status == 8) {
		qm.sendNextPrev("那是当然！喂……你那副表情是怎么回事？你……难道不想当我的主人吗？");
	} else if (status == 9) {
		qm.sendNextPrev("#b不……倒也不是那个意思……我只是还没做好养宠物的心理准备……", 2);
	} else if (status == 10) {
		qm.sendNextPrev("宠……宠……宠物？！你刚刚居然叫我宠物？！你怎么敢……我可是高贵的龙族！世界上最强的存在！");
	} else if (status == 11) {
		qm.sendNextPrev("#b……#b（你用怀疑的眼神打量着它。不管怎么看，它都只是一只瘦小的小蜥蜴而已。）#k", 2);
	} else if (status == 12) {
		qm.sendAcceptDecline("你那是什么眼神？！别小看我！让你见识见识我真正的实力！准备好了吗？");
	} else if (status == 13) {
		if (mode == 0 && type == 15) {
			qm.sendNext("你竟然不相信我？呜呜，气死我了！");
			qm.dispose();
		} else {
			if (!qm.isQuestStarted(22500)) {
				qm.forceStartQuest();
			}
			qm.sendNext("带我去找 #r#o1210100#k！现在就去！我要让你见识见识本龙打倒 #o1210100# 有多神速！冲啊！");
		}
	} else if (status == 14) {
		qm.sendNextPrev("等等！你有好好分配能力点吗？作为我的主人，你的 #b智力 和 运气#k 对我可是有很大影响的！如果你想见识我的厉害，记得在使用技能之前把能力点加好，并且 #b穿戴好魔法师的装备#k！");
	} else if (status == 15) {
		qm.sendImage("UI/tutorial/evan/11/0");
		qm.dispose();
	}
}