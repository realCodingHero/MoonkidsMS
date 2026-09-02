/*
    This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
               Matthias Butz <matze@odinms.de>
               Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* Credits to: kevintjuh93
    NPC Name:         Jean
    Map(s):         Victoria Road : Lith Harbour (104000000)
    Description:         Event Assistant
*/
var status = 0;

function start() {
    cm.sendNext("嘿，我是#b#p9000001#k。我正在等我哥哥#b保罗#k呢，他按说应该已经到了才对呀……");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 2 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            cm.sendNextPrev("唔……该怎么办好呢？活动马上就要开始了……好多人都已经赶过去了，我们也得抓紧时间了……");
        } else if (status == 2) {
            cm.sendSimple("嘿……不如你和我一起去吧？我想我哥哥可能已经和别的朋友一起进去了。\r\n#L0##e1.#n#b 这是什么样的活动？#k#l\r\n#L1##e2.#n#b 给我介绍一下活动项目吧。#k#l\r\n#L2##e3.#n#b 好啊，我们出发吧！#k#l");
        } else if (status == 3) {
            if (selection == 0) {
                cm.sendNext("这个月，冒险岛正在举办特别庆典活动！管理员们将在活动期间举行各种惊喜活动，千万不要错过参与并赢取丰厚奖品的机会哦！");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendSimple("活动包含多种丰富的小游戏。在进入游戏前先熟悉一下规则会更有帮助哦。请选择你想了解的项目吧！#b\r\n#L0# 爬高高 (Ola Ola)#l\r\n#L1# 冒险岛体能测试#l\r\n#L2# 滚雪球#l\r\n#L3# 打椰子#l\r\n#L4# OX问答#l\r\n#L5# 寻宝活动#l#k");
            } else if (selection == 2) {
                if (cm.getEvent() != null && cm.getEvent().getLimit() > 0) {
                    cm.getPlayer().saveLocation("EVENT");
                    if (cm.getEvent().getMapId() == 109080000 || cm.getEvent().getMapId() == 109060001) {
                        cm.divideTeams();
                    }

                    cm.getEvent().minusLimit();
                    cm.warp(cm.getEvent().getMapId(), 0);
                    cm.dispose();
                } else {
                    cm.sendNext("活动可能尚未开放，或者你已经持有#b神秘卷轴#k，亦或是你在过去24小时内已经参与过活动了。请稍后再试！");
                    cm.dispose();
                }
            }
        } else if (status == 4) {
            if (selection == 0) {
                cm.sendNext("#b[爬高高]#k 是一项需要顺着梯子不断向上攀爬到达顶部的游戏。选择正确的传送门不断向上，进入下一个关卡。\r\n\r\n游戏共分为三个阶段，限时 #b6分钟#k。在 [爬高高] 中，你 #b无法跳跃、使用瞬间移动、加速术，也无法使用药水或道具提高移动速度#k。此外还有一些陷阱传送门会把你送回原点，请格外小心！");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("#b[冒险岛体能测试]#k 是一项类似于忍耐之林/森林障碍的耐力赛跑。克服各种障碍，在规定时间内到达终点即可获胜。\r\n\r\n游戏共分为四个阶段，限时 #b15分钟#k。在 [冒险岛体能测试] 期间，你将无法使用瞬间移动或加速技能。");
                cm.dispose();
            } else if (selection == 2) {
                cm.sendNext("#b[滚雪球]#k 由红队（枫叶队）与蓝队（故事队）两队进行比拼，看哪一队在规定时间内能将雪球推得更远更大。若在规定时间内未分胜负，则由雪球推得更远的一方获胜。\r\n\r\n要推动雪球，请按 #bCtrl#k 键进行普通攻击。所有远程攻击和技能攻击在此均无效，#b只有近身普通攻击才起作用#k。\r\n如果角色触碰到滚动的雪球，将被送回起点。攻击对方起点前的雪人可以阻碍对方推动雪球。合理分配进攻雪球与干扰雪人的策略至关重要！");
                cm.dispose();
            } else if (selection == 3) {
                cm.sendNext("#b[打椰子]#k 由两队互相竞争，看哪队能在限定时间内收集到更多的椰子。限时为 #b5分钟#k。如果打平，将额外增加2分钟加时赛。加时赛依然打平则判定为平局。\r\n\r\n所有远程攻击与技能在此均无效，#b只有近身普通攻击才起作用#k。若未携带近战武器，可在活动地图内的NPC处购买。无论角色等级、装备或技能如何，造成的打击判定均一致。\r\n小心地图内的各种陷阱与障碍。若在游戏中阵亡将被淘汰出局。只有击落并掉在地上的椰子才计入得分，树上未落下的或偶尔爆炸的椰子不计分。地图底部贝壳中藏有隐藏传送门，请善加利用！");
                cm.dispose();
            } else if (selection == 4) {
                cm.sendNext("#b[OX问答]#k 是在冒险岛中通过判断O与X展示智慧的智力竞赛。进入游戏后，按 #bM#k 键打开小地图确认O和X的区域位置。一共会有 #r10道题目#k，全部回答正确的角色将赢得比赛。\r\n\r\n题目公布后，请利用梯子移动到你认为正确的区域（O或X）。如果未在限时内做出选择或依然停留在梯子上，将被直接淘汰。在屏幕上的 [CORRECT] 提示消失之前，请务必保持站立不动。为了防止任何形式的作弊，在OX问答期间所有聊天功能将被关闭。");
                cm.dispose();
            } else if (selection == 5) {
                cm.sendNext("#b[寻宝活动]#k 的目标是在 #r10分钟内#k 搜寻隐藏在地图各处的 #b宝藏卷轴#k。地图各处散落着许多神秘宝箱，打碎宝箱后会掉落各种物品，你需要从中找到宝藏卷轴。\r\n\r\n宝箱只能通过 #b普通攻击#k 破坏。拿到宝藏卷轴后，可以与活动地图内的兑换NPC交换为神秘卷轴，也可以在明珠港找 #b维京#k 兑换。\r\n\r\n地图中暗藏着许多隐藏传送点与捷径。在特定位置按下 #b向上方向键（↑）#k 即可传送到其他区域。多尝试跳跃与探索，或许就能发现隐藏的绳索或宝箱。\r\n\r\n注意：寻宝活动中所有攻击技能均被 #r禁用#k，请使用普通攻击开启宝箱。");
                cm.dispose();
            }
        }
    }
}  