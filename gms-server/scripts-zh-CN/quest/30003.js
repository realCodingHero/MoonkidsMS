/*
StudyJS-By HaiLong

BaseFunction:                                                             type |          mode               |  section
0:  sendYesNo(str) -[弹出Yes/No对话框]                                     1   |  是=1,否=0,结束=-1          |     \
1:  sendNext(str)  -[弹出带有下一个的对话框]                               0   |  下一项=1,结束=-1           |     \
2:  sendPrev(str)  -[弹出带有上一个的对话框]                               0   |  上一项=0,结束=-1           |     \
3:  sendOk(str)    -[弹出带有确定的对话框]                                 0   |  确定=1,结束=-1             |     \
4:  sendNextPrev(str)      -[弹出上&下一个的对话框]                        0   |  上一项=0,下一项=1,停止=-1  |     \
5:  sendAcceptDecline(str) -[弹出接受&拒绝的对话框]                        12  |  接受=1,拒绝=0,结束=-1      |     \  
6:  sendSimple(str) -[弹出带有选项(#L索引# xxx #l)的对话框]                4   |  选择=1,结束=0              |  选择的索引       
7:  sendStyle(str,int styles[]) -[弹出选择造型的对话框]                    0   |  确定=1,取消=0,结束=-1      |  选择的索引
8:  sendGetNumber(str,int def, int min, int max) -[弹出输入数字的对话框]   0   |  确定=1,结束=0              |  输入的数字
9:  setGetText(str) -[保存指定的字符串]                                    \   |          \                  |     \
10: sendGetText(str) -[弹出带有输入字符串的对话框]                         0   |  确定=1,结束=0              |     \
11: getText(str) -[返回sendGetText(str)/setGetText(str)寫入的字符串]       \   |          \                  |     \

AllowFunction-could use directly
-gainMeso获取金币(int gain);
 */


var status = -1; 

//Start
function start(mode, type, selection)
{
	if (CheckStatus(mode))
	{
	    if (status == 0)
	    {
			//第一层对话
			qm.sendNext("嗨，你是新来的冒险家吗？正如你所见，在冒险岛世界里有一个常年被冰雪覆盖的村庄——#b冰峰雪域#k。关于这里有一个古老的故事，你感兴趣吗？");
	    }
		else if (status == 1 )
		{
			//第二层对话
			var text = "据说在这片极寒之地的深处，沉睡着一个恐怖的邪恶存在，正是它的诅咒导致这里常年暴雪不断。曾经有一支勇敢的冒险小队前去讨伐这传说中的怪物。\r\n";
            text += "那支队伍集结了冒险岛世界四大职业的顶尖强者。然而在抵达怪物藏身处的洞穴迷宫前，他们不幸触发了致命陷阱，战士队长为了掩护队友，永远长眠在了那里。\r\n";
			text += "队伍中唯一的牧师更是在决战中被怪物的火毒侵蚀而走火入魔。即便如此，他们最终依然惨烈地战胜了怪物。队伍中的弓箭手和飞侠是一对恩爱的夫妻。\r\n";
			text += "当时飞侠怀有身孕，殊不知濒死的怪物竟然在临终前将自身最后的邪念暗中注入到了女飞侠的体内，企图借胎重生。\r\n";
			text += "幸存者回到村里后，村长阿尔卡特得知此事，竟欲处死弓箭手的妻子！他施展禁锢魔法困住了她，村民们将她绑上了祭台。\r\n";
			text += "最终，这两人也在悲剧中逝去，当年讨伐怪物的远征队无一幸免……据说那个恐怖的怪物后来依然重生了，最后目击到它的人，只依稀看到黑暗中伸出了8只巨大的手臂……";
			qm.sendNextPrev(text);
		}
		else if (status == 2)
		{
			qm.sendAcceptDecline("怎么样，这个故事够震撼吧？不过对现在的你来说挑战它还为时过早。怎么样，想先热热身吗？");
		}
		else if (status == 3)
		{
			//最后一层对话完继续循环至此，退出结束
			qm.sendOk("很好！去消灭5只 #b#o9409000##k 吧！");
			qm.forceStartQuest();
            qm.dispose();
		}
		else
			qm.dispose();
	}
}

function end(mode, type, selection)
{
	if (CheckStatus(mode))
	{
	    if (status == 0)
	    {
			//第一层对话
            qm.sendOk("干得漂亮，任务完成！这是给你的奖励，希望能对你的冒险有所帮助。\r\n\r\n#fUI/CashShop.img/CSDiscount/bonus# 金币 x50000");		
			qm.forceCompleteQuest();
			qm.gainMeso(50000);
            qm.dispose();			
	    }
		else if (status == 1 )
		{
			//第二层对话			
		}
		else
		{
			//最后一层对话完继续循环至此，退出结束
			qm.dispose();
		}
	}
			
}

function CheckStatus(mode)
{
	if (mode == -1)
	{
		qm.dispose();
		return false;
	}
	
	if (mode == 1)
	{
		status++;
	}
	else
	{
		status--;
	}
	
	if (status == -1)
	{
		qm.dispose();
		return false;
	}	
	return true;
}