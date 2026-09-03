/* Dalair (达尔利)
   Medal Master NPC (勋章达人)
*/

var status = -1;
var selectedOption = -1;
var availableReissue = [];
var selectedMedal = null;
var reissueFee = 1000;
var mergeFee = 50000;
var name = "";

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === -1 || (mode === 0 && status === 0)) {
        cm.dispose();
        return;
    }

    if (mode === 1) {
        status++;
    } else {
        status--;
    }

    if (status === 0) {
        var text = "我是勋章达人 #b达尔利#k。我掌管着冒险岛世界所有勇敢冒险家的勋章与荣誉。\r\n\r\n";
        text += "#b#L0# 重新领取已获得的勋章（补领）#l\r\n";
        text += "#L1# 了解勋章与探险挑战介绍#l\r\n";
        text += "#L2# 装备合并强化服务（辅助）#l#k";
        cm.sendSimple(text);
    } else if (status === 1) {
        selectedOption = selection;

        if (selectedOption === 0) { // 补领勋章
            availableReissue = [];
            const Quest = Java.type('org.gms.server.quest.Quest');
            var medalsMap = Quest.getAllMedals();

            var it = medalsMap.entrySet().iterator();
            while (it.hasNext()) {
                var entry = it.next();
                var questId = entry.getKey();
                var medalId = entry.getValue();

                if (cm.isQuestCompleted(questId)) {
                    if (!cm.haveItem(medalId)) {
                        availableReissue.push({
                            questId: questId,
                            medalId: medalId
                        });
                    }
                }
            }

            if (availableReissue.length === 0) {
                cm.sendOk("您当前没有可以补领的勋章。\r\n\r\n#d提示：只有当您已经完成对应的勋章挑战，且背包和身上都不存在该勋章时，才可以重新领取。#k");
                cm.dispose();
                return;
            }

            var text = "以下是您已获得头衔但当前未持有的勋章。请选择您想要重新领取的勋章（每枚补领手续费为 #r" + cm.numberWithCommas(reissueFee) + " 金币#k）：\r\n\r\n";
            for (var i = 0; i < availableReissue.length; i++) {
                var item = availableReissue[i];
                text += "#L" + i + "# #i" + item.medalId + "# #b#t" + item.medalId + "##k#l\r\n";
            }
            cm.sendSimple(text);

        } else if (selectedOption === 1) { // 勋章介绍
            var text = "在枫之谷世界中，完成特定的冒险壮举即可获得荣耀头衔与专属勋章：\r\n\r\n";
            text += "#e#b[冒险家等级与转职]#n#k：达成 1~4 转与满级可获得系列冒险家勋章；\r\n";
            text += "#e#b[大陆与地图探险]#n#k：走遍金银岛、雪原、玩具城、水下、沙漠、武陵、神木村与时间神殿各区域即可获得探险家勋章；\r\n";
            text += "#e#b[挑战与成就]#n#k：击杀特定 Boss、提升人气、完成组队任务、收集怪物卡片等均有专属勋章。\r\n\r\n";
            text += "#d您可以打开任务辅助助手 (@qh) 查看您的当前任务与勋章进度。#k";
            cm.sendOk(text);
            cm.dispose();

        } else if (selectedOption === 2) { // 装备合并
            const GameConfig = Java.type('org.gms.config.GameConfig');
            if (!GameConfig.getServerBoolean("use_enable_custom_npc_script")) {
                cm.sendOk("装备合并功能目前未开启。");
                cm.dispose();
                return;
            }

            var levelLimit = !cm.getPlayer().isCygnus() ? 160 : 110;
            const MakerProcessor = Java.type('org.gms.client.processor.action.MakerProcessor');
            if (!GameConfig.getServerBoolean("use_starter_merge") && (cm.getPlayer().getLevel() < levelLimit || MakerProcessor.getMakerSkillLevel(cm.getPlayer()) < 3)) {
                cm.sendOk("使用装备合并服务需要制造技能等级 3 且角色等级达到 " + levelLimit + " 级。");
                cm.dispose();
                return;
            }

            if (cm.getMeso() < mergeFee) {
                cm.sendOk("手续费需要 #r" + cm.numberWithCommas(mergeFee) + " 金币#k，您的金币不足。");
                cm.dispose();
                return;
            }

            var selStr = "合并服务费用为 #r" + cm.numberWithCommas(mergeFee) + "#k 金币。可以将背包中多余的装备合并入当前佩戴的装备。\r\n\r\n#r注意：被合并强化的装备将变为无法交易。#k";
            cm.sendNext(selStr);
        }
    } else if (status === 2) {
        if (selectedOption === 0) { // 补领确认与发放
            var idx = selection;
            if (idx < 0 || idx >= availableReissue.length) {
                cm.dispose();
                return;
            }
            selectedMedal = availableReissue[idx];

            if (cm.getMeso() < reissueFee) {
                cm.sendOk("您的金币不足以支付手续费 #r" + cm.numberWithCommas(reissueFee) + " 金币#k。");
                cm.dispose();
                return;
            }

            if (!cm.canHold(selectedMedal.medalId)) {
                cm.sendOk("请在装备栏空出至少 1 个格子。");
                cm.dispose();
                return;
            }

            cm.gainMeso(-reissueFee);
            cm.gainItem(selectedMedal.medalId, 1);
            cm.sendOk("已经成功为您补发了 #b#i" + selectedMedal.medalId + "# #t" + selectedMedal.medalId + "##k！\r\n请妥善保管好您的荣誉勋章。");
            cm.dispose();

        } else if (selectedOption === 2) { // 装备合并输入
            var selStr = "#r警告#b：请确保要被吸收合并的物品位于所选物品之后。#k\r\n\r\n请输入目标装备名称：";
            cm.sendGetText(selStr);
        }
    } else if (status === 3) {
        if (selectedOption === 2) {
            name = cm.getText();
            if (cm.getPlayer().mergeAllItemsFromName(name)) {
                cm.gainMeso(-mergeFee);
                cm.sendOk("合并完成！感谢您使用本服务。");
            } else {
                cm.sendOk("你的装备栏中没有找到 #b'" + name + "'#k！");
            }
            cm.dispose();
        }
    }
}