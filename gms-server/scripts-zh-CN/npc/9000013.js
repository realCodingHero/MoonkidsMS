/*
    NPC Name:         Tony (托尼)
    Map(s):           Maple Road: Southperry (枫叶路: 南港 60000)
    Description:      活动向导
*/
var status = 0;

function start() {
    cm.sendNext("嗨！我是 #b托尼#k。如果你现在不忙的话……能陪我聊会儿天吗？我听说这附近有很多玩家聚集在一起准备参加 #r官方活动#k，但我一个人有点不好意思去……嗯，你想和我一起去看看吗？");
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            cm.sendSimple("咦？你问是什么活动？嗯，这个嘛……\r\n#L0##e1.#n#b 这是什么样的活动？#k#l\r\n#L1##e2.#n#b 请向我介绍一下活动小游戏的玩法。#k#l\r\n#L2##e3.#n#b 太棒了，我们这就出发吧！#k#l");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendNext("整个活动期间，冒险岛世界都在举办盛大的周年狂欢庆典！GM 管理员会在活动期间不定期开启各种惊喜 GM 活动，请密切留意系统公告，积极参与活动赢取丰厚大奖吧！");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendSimple("本次庆典准备了多种趣味小游戏。在参与前先熟悉规则对你会有很大帮助哦！请选择你想了解的项目：#b\r\n#L0# 向上爬向上爬 (Ola Ola)#l\r\n#L1# 冒险岛体能障碍训练场#l\r\n#L2# 滚雪球对决#l\r\n#L3# 椰子大丰收#l\r\n#L4# OX 问答竞赛#l\r\n#L5# 寻找隐藏的宝藏#l#k");
            } else if (selection == 2) {
                cm.sendNext("当前活动尚未开始，或者你已经持有 #b秘密卷轴#k，亦或你在过去的24小时内已经参与过该活动。请稍后再来尝试吧！");
                cm.dispose();
            }
        } else if (status == 3) {
            if (selection == 0) {
                cm.sendNext("#b[向上爬向上爬]#k 是一个考验攀爬与选择的小游戏。玩家需要顺着梯子向上攀爬，并在每层众多的传送门中选择正确的入口前往下一层。\r\n\r\n游戏共分为3层，时间限制为 #b6分钟#k。在游戏过程中，你 #b无法使用跳跃、瞬间移动、速度激发以及任何药水加速效果#k。此外，部分传送门会将你送回原点，请务必小心辨别！");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("#b[体能障碍训练场]#k 是一个类似忍耐之林的障碍跑酷挑战！在限定时间内克服重重机关陷阱，最先抵达终点的玩家即可获胜。\r\n\r\n游戏共分为4个阶段，时间限制为 #b15分钟#k。在此期间无法使用瞬间移动和速度激发技能。");
                cm.dispose();
            } else if (selection == 2) {
                cm.sendNext("#b[滚雪球对决]#k 分为红蓝两个阵营进行对抗，看 #b哪个阵营能在规定时间内将雪球推得更大、更远#k。\r\n\r\n通过按 #bCtrl 普通攻击#k 来推动雪球。远程攻击和技能攻击均无效，#b只有近战普通攻击才起作用#k。同时可以通过击打前方的障碍雪人来阻碍对方队伍推进！");
                cm.dispose();
            } else if (selection == 3) {
                cm.sendNext("#b[椰子大丰收]#k 是在美丽的南方海滩进行的采摘比赛。在限定时间内，通过普通攻击敲打椰子树，收集掉落的新鲜椰子。\r\n\r\n比赛时间为 #b5分钟#k。采集到最多椰子的队伍将获得最终的胜利！");
                cm.dispose();
            } else if (selection == 4) {
                cm.sendNext("#b[OX 问答竞赛]#k 是对冒险岛全方位知识的终极考验！\r\n\r\n听到系统提出的问题后，在倒计时结束前跑到代表 #bO (正确)#k 或 #bX (错误)#k 的区域。只要答错一题就会被淘汰掉落至下方，坚持到最后的勇士将荣获丰厚奖励！");
                cm.dispose();
            } else if (selection == 5) {
                cm.sendNext("#b[寻找隐藏的宝藏]#k 在神秘的藏宝地图中展开。地图各处散落着装有丰厚奖励的宝箱，使用普通攻击击破宝箱即可获取其中的珍稀物品！");
                cm.dispose();
            }
        }
    }
}
