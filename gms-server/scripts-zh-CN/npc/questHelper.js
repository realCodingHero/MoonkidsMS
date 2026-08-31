/**
 * @description 任务辅助 NPC 脚本
 * 提供任务状态分类（可完成/进行中）、普通材料一键补齐（带背包空间安全校验）、
 * 杀怪目标地图传送、道具掉落怪物反查传送、起止 NPC 城镇直达。
 * 采用显式状态机架构，确保“结束对话/返回”在各级菜单中均能精准返回上一层界面。
 * 未探索解锁的地图在所有传送与列表界面均自动过滤隐藏。
 */

var STATE_MAIN_MENU = 0;    // 主菜单
var STATE_QUEST_LIST = 1;   // 任务列表（可交付 / 进行中）
var STATE_QUEST_DETAIL = 2; // 任务详情
var STATE_SUB_MENU = 3;     // 怪物地图列表 / 掉落怪物列表 / NPC地图列表
var STATE_MAP_LIST = 4;     // 掉落怪物的分布地图列表

var currentState = STATE_MAIN_MENU;
var selectedCategory = 1; // 1: 可交付任务, 2: 进行中任务
var selectedQuestId = 0;
var currentDetail = null;
var selectedItem = null;
var currentMapList = null;
var pendingNotice = null;
var pendingConfirmAction = null; // { type: 'ALL' | 'MOB' | 'ITEM', id: number, cost: number }

function start() {
    try {
        java.lang.System.out.println("[NPC questHelper] start() entered");
        currentState = STATE_MAIN_MENU;
        selectedCategory = 1;
        selectedQuestId = 0;
        currentDetail = null;
        selectedItem = null;
        currentMapList = null;
        pendingNotice = null;
        pendingConfirmAction = null;
        showMainMenu();
    } catch (e) {
        java.lang.System.out.println("[NPC questHelper] start() exception: " + e);
        cm.sendOk("任务辅助启动错误：" + e);
        cm.dispose();
    }
}

function action(mode, type, selection) {
    try {
        // 1. 处理强行关闭 (mode === -1)
        if (mode === -1) {
            cm.dispose();
            return;
        }

        // 2. 处理“结束对话” / 取消 / 否 (mode === 0)
        if (mode === 0) {
            if (pendingConfirmAction != null) {
                // 二次确认弹窗中选择了“否” -> 返回任务详情页
                pendingConfirmAction = null;
                currentState = STATE_QUEST_DETAIL;
                showQuestDetail(selectedQuestId);
                return;
            }

            // 无论当前处于哪一层级，点击【结束对话】或按 Esc 均立即彻底退出
            cm.dispose();
            return;
        }

        // 3. 处理正常交互与二次确认“是” (mode === 1)
        if (pendingConfirmAction != null) {
            var confirmAction = pendingConfirmAction;
            pendingConfirmAction = null;
            var service = cm.getQuestHelp();
            var res = null;
            if (confirmAction.type === 'ALL') {
                res = service.deliverAllQuestObjectives(cm.getPlayer(), selectedQuestId);
            } else if (confirmAction.type === 'MOB') {
                res = service.syncQuestMobKill(cm.getPlayer(), selectedQuestId, confirmAction.id);
            } else if (confirmAction.type === 'ITEM') {
                res = service.deliverQuestMaterial(cm.getPlayer(), selectedQuestId, confirmAction.id);
            }
            if (res != null) {
                pendingNotice = res.isSuccess() ? "#d" + res.getMessage() + "#k" : "#r" + res.getMessage() + "#k";
            }
            currentState = STATE_QUEST_DETAIL;
            showQuestDetail(selectedQuestId);
            return;
        }

        // 4. 根据当前状态分发正常菜单选择
        if (currentState === STATE_MAIN_MENU) {
            handleMainMenuSelection(selection);
        } else if (currentState === STATE_QUEST_LIST) {
            handleQuestListSelection(selection);
        } else if (currentState === STATE_QUEST_DETAIL) {
            handleDetailSelection(selection);
        } else if (currentState === STATE_SUB_MENU) {
            handleSubSelection(selection);
        } else if (currentState === STATE_MAP_LIST) {
            handleMapListSelection(selection);
        } else {
            cm.dispose();
        }
    } catch (e) {
        cm.sendOk("任务辅助执行错误：" + e);
        cm.dispose();
    }
}

/**
 * 界面 0：主菜单（可交付任务 vs 进行中任务）
 */
function showMainMenu() {
    try {
        currentState = STATE_MAIN_MENU;
        var service = cm.getQuestHelp();
        if (!service) {
            cm.sendOk("任务辅助服务暂不可用。");
            return;
        }

        var player = cm.getPlayer();
        var canCompleteQuests = null;
        var inProgressQuests = null;
        try {
            canCompleteQuests = service.getCanCompleteQuests(player);
        } catch (e) {
            java.lang.System.out.println("[NPC questHelper] getCanCompleteQuests error: " + e);
        }
        try {
            inProgressQuests = service.getInProgressQuests(player);
        } catch (e) {
            java.lang.System.out.println("[NPC questHelper] getInProgressQuests error: " + e);
        }

        var canCompleteCount = (canCompleteQuests && typeof canCompleteQuests.size === "function") ? canCompleteQuests.size() : 0;
        var inProgressCount = (inProgressQuests && typeof inProgressQuests.size === "function") ? inProgressQuests.size() : 0;

        var text = "\t\t\t\t#e#r【 BeiDou 任务辅助助手 】#k#n\r\n\r\n";
        text += "在这里您可以查看当前所有已接取的任务进度、一键导航至起止 NPC、快捷传送至怪物地图，以及一键补齐普通任务材料。\r\n\r\n";

        if (canCompleteCount > 0) {
            text += "#L1##b>> 查看当前可直接交付的任务#k #r(" + canCompleteCount + " 个已达成)#k#l\r\n";
        } else {
            text += "#L1##d>> 查看当前可交付的任务 (暂无可交付任务)#k#l\r\n";
        }

        text += "#L2##b>> 查看当前进行中的任务列表#k #d(" + inProgressCount + " 个进行中)#k#l\r\n\r\n";
        text += "#L999999##b[返回枫叶助手主菜单]#k#l";

        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("主菜单加载失败：" + e);
        cm.dispose();
    }
}

function handleMainMenuSelection(selection) {
    if (selection === 999999) {
        cm.dispose();
        cm.openNpc(9900001);
        return;
    }

    selectedCategory = selection;
    showQuestList(selectedCategory);
}

/**
 * 界面 1：展示任务列表（分类 1: 可交付, 分类 2: 进行中）
 */
function showQuestList(category) {
    try {
        currentState = STATE_QUEST_LIST;
        var service = cm.getQuestHelp();
        var list = (category === 1) ? service.getCanCompleteQuests(cm.getPlayer()) : service.getInProgressQuests(cm.getPlayer());
        var listSize = (list && typeof list.size === "function") ? list.size() : 0;

        var categoryTitle = (category === 1) ? "可直接交付的任务" : "进行中的任务";
        var text = "#e#b【 " + categoryTitle + " 】 (共 " + listSize + " 个)#k#n\r\n\r\n";

        if (listSize === 0) {
            text += (category === 1) ? "当前没有任何已达成全部条件的任务。\r\n" : "您当前尚未接取任何任务。\r\n";
            text += "\r\n#L999999##b[返回主菜单]#k#l";
            cm.sendSimple(text);
            return;
        }

        var normalQuests = [];
        var medalQuests = [];

        for (var i = 0; i < listSize; i++) {
            var item = list.get(i);
            var isMedal = false;
            try {
                isMedal = (typeof item.isMedalQuest === "function") ? item.isMedalQuest() : false;
            } catch (ignored) {}
            if (isMedal) {
                medalQuests.push(item);
            } else {
                normalQuests.push(item);
            }
        }

        // 1. 普通任务（最新状态更新排在最上方）
        for (var i = 0; i < normalQuests.length; i++) {
            var item = normalQuests[i];
            var tag = "";
            if (item.isCanComplete()) {
                tag = " #r[可交付]#k";
            } else if (item.isPurchasableComplete()) {
                tag = " #d[可一键补齐]#k";
            }
            text += "#L" + item.getQuestId() + "# [Lv." + item.getMinLevel() + "] #b" + item.getQuestName() + "#k" + tag + "#l\r\n";
        }

        // 2. 勋章任务（始终排在最下方，并展示清晰分界线）
        if (medalQuests.length > 0) {
            if (normalQuests.length > 0) {
                text += "\r\n#d-------------------- 探险与挑战勋章 --------------------#k\r\n\r\n";
            } else {
                text += "#d【 探险与挑战勋章 】#k\r\n";
            }
            for (var j = 0; j < medalQuests.length; j++) {
                var item = medalQuests[j];
                var tag = "";
                if (item.isCanComplete()) {
                    tag = " #r[可交付]#k";
                } else if (item.isPurchasableComplete()) {
                    tag = " #d[可一键补齐]#k";
                }
                text += "#L" + item.getQuestId() + "# [Lv." + item.getMinLevel() + "] #d" + item.getQuestName() + "#k" + tag + "#l\r\n";
            }
        }

        text += "\r\n#L999999##b[返回主菜单]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("任务列表加载失败：" + e);
        cm.dispose();
    }
}

function handleQuestListSelection(selection) {
    if (selection === 999999) {
        showMainMenu();
        return;
    }

    selectedQuestId = selection;
    showQuestDetail(selectedQuestId);
}

/**
 * 过滤获取已解锁探索的地图列表（隐藏未探索地点）
 */
function getUnlockedMapsList(mapList) {
    var result = [];
    if (!mapList) return result;
    var service = cm.getQuestHelp();
    var player = cm.getPlayer();
    var size = (typeof mapList.size === "function") ? mapList.size() : mapList.length;
    for (var i = 0; i < size; i++) {
        var map = (typeof mapList.get === "function") ? mapList.get(i) : mapList[i];
        if (map && service && service.isMapWarpUnlocked(player, map.getMapId())) {
            result.push(map);
        }
    }
    return result;
}

function getTargetMapFromList(mapList, index) {
    if (!mapList) return null;
    if (typeof mapList.get === "function") {
        return (index >= 0 && index < mapList.size()) ? mapList.get(index) : null;
    }
    return (index >= 0 && index < mapList.length) ? mapList[index] : null;
}

/**
 * 界面 2：展示指定任务的详细进度与各项操作
 */
function showQuestDetail(questId) {
    try {
        currentState = STATE_QUEST_DETAIL;
        selectedQuestId = questId;
        var service = cm.getQuestHelp();
        currentDetail = service.getQuestDetailInfo(cm.getPlayer(), questId);

        if (!currentDetail) {
            cm.sendOk("未获取到任务详细信息，可能任务已被放弃或已完成。");
            currentState = STATE_MAIN_MENU;
            return;
        }

        var text = "#e#b【 任务详情 】 " + currentDetail.getQuestName() + " (ID: " + questId + ")#k#n\r\n";

        if (pendingNotice) {
            text += "\r\n" + pendingNotice + "\r\n\r\n";
            pendingNotice = null;
        } else {
            text += "\r\n";
        }

        var mobObjs = currentDetail.getMobObjectives();
        var itemObjs = currentDetail.getItemObjectives();
        var cardObjs = currentDetail.getCardObjectives();
        var expObjs = currentDetail.getExplorationObjectives();
        var startNpc = currentDetail.getStartNpc();
        var compNpc = currentDetail.getCompleteNpc();

        // 检查是否有可同步的怪物击杀与可补齐的普通材料
        var hasSyncableMobs = currentDetail.hasSyncableMobKills();
        var hasDeliverableIncomplete = currentDetail.hasDeliverableIncompleteItems();
        var totalMobCost = currentDetail.getTotalSyncableMobsCost();
        var totalMatCost = currentDetail.getTotalRegularMaterialsCost();
        var combinedCost = currentDetail.getTotalCostWithMobsAndMaterials();

        if (hasSyncableMobs && hasDeliverableIncomplete) {
            text += "#L10000##k【 #d[一键同步账号击杀并购买全部普通材料]#k 】 #d(" + combinedCost + " 金币)#k#l\r\n\r\n";
        } else if (hasSyncableMobs) {
            text += "#L10000##k【 #d[一键同步本任务全部满足条件的账号怪物击杀]#k 】 #d(" + totalMobCost + " 金币)#k#l\r\n\r\n";
        } else if (hasDeliverableIncomplete) {
            text += "#L10000##k【 #d[一键购买补齐本任务全部普通/商店材料]#k 】 #d(" + totalMatCost + " 金币)#k#l\r\n\r\n";
        }

        var hasContent = false;

        // 1. 击杀目标
        if (mobObjs && mobObjs.size() > 0) {
            hasContent = true;
            text += "#e【 击杀怪物目标 】#n\r\n";
            for (var i = 0; i < mobObjs.size(); i++) {
                var mob = mobObjs.get(i);
                var isDone = mob.isCompleted();
                var progTag = isDone ? "#b(" + mob.getCurrentKills() + "/" + mob.getRequiredKills() + ") [已达成]#k" : "#r(" + mob.getCurrentKills() + "/" + mob.getRequiredKills() + ") [未完成]#k";

                if (mob.isBoss()) {
                    if (isDone) {
                        text += " 消灭 【#rBoss - " + mob.getMobName() + "#k】 " + progTag + "\r\n\r\n";
                    } else {
                        text += " 消灭 【#rBoss - " + mob.getMobName() + "#k】 " + progTag + " #r[Boss需亲自消灭]#k\r\n\r\n";
                    }
                } else if (isDone) {
                    text += " 消灭 【#b" + mob.getMobName() + " (Lv." + mob.getMobLevel() + ")#k】 " + progTag + "\r\n\r\n";
                } else {
                    var mobUnlockedMaps = getUnlockedMapsList(mob.getMaps());
                    if (mobUnlockedMaps.length > 0) {
                        text += "#L" + (100000 + i) + "# 消灭 【#b" + mob.getMobName() + " (Lv." + mob.getMobLevel() + ")#k】 (#r" + mob.getCurrentKills() + "/" + mob.getRequiredKills() + "#k) -> #d[传送]#k#l\r\n";
                    } else {
                        text += " 消灭 【#b" + mob.getMobName() + " (Lv." + mob.getMobLevel() + ")#k】 (#r" + mob.getCurrentKills() + "/" + mob.getRequiredKills() + "#k) #r[分布地图未探索解锁]#k\r\n";
                    }

                    if (mob.isPurchasable()) {
                        var needed = mob.getRequiredKills() - mob.getCurrentKills();
                        if (mob.getPurchasableKills() >= needed) {
                            text += "#L" + (150000 + i) + "#   └─ #d[可用/历史总击杀数:" + mob.getAvailableKills() + "/" + mob.getTotalAccountKills() + " ,消耗 " + mob.getTotalCost() + "金币补齐余下全部" + mob.getPurchasableKills() + "只]#k#l\r\n";
                        } else {
                            text += "#L" + (150000 + i) + "#   └─ #d[可用/历史总击杀数:" + mob.getAvailableKills() + "/" + mob.getTotalAccountKills() + " ,消耗 " + mob.getTotalCost() + "金币获得" + mob.getPurchasableKills() + "只击杀]#k#l\r\n";
                        }
                    } else if (mobUnlockedMaps.length > 0) {
                        var needed = mob.getRequiredKills() - mob.getCurrentKills();
                        text += "#L" + (100000 + i) + "#   └─ #d(可用/历史总击杀数:0/" + mob.getTotalAccountKills() + " ,需手动消灭剩余 " + needed + "只)#k#l\r\n";
                    } else {
                        var needed = mob.getRequiredKills() - mob.getCurrentKills();
                        text += "   └─ #d(可用/历史总击杀数:0/" + mob.getTotalAccountKills() + " ,需手动消灭剩余 " + needed + "只)#k\r\n";
                    }
                    text += "\r\n";
                }
            }
        }

        // 2. 收集道具目标
        if (itemObjs && itemObjs.size() > 0) {
            hasContent = true;
            text += "#e【 收集道具目标 】#n\r\n";
            for (var i = 0; i < itemObjs.size(); i++) {
                var item = itemObjs.get(i);
                if (item.getRequiredCount() <= 0) {
                    if (item.isCompleted()) {
                        text += " 道具 #v" + item.getItemId() + "# 【#b" + item.getItemName() + "#k】 (已在指定地点使用完毕) #b[已达成]#k\r\n\r\n";
                    } else {
                        text += " 道具 #v" + item.getItemId() + "# 【#b" + item.getItemName() + "#k】 (持有 " + item.getCurrentCount() + " 张 - 需在指定地点使用) #r[进行中]#k\r\n\r\n";
                    }
                    continue;
                }

                var isDone = item.isCompleted();
                var progTag = isDone ? "#b(" + item.getCurrentCount() + "/" + item.getRequiredCount() + ") [已达成]#k" : "#r(" + item.getCurrentCount() + "/" + item.getRequiredCount() + ") [未完成]#k";
                var diff = item.getRequiredCount() - item.getCurrentCount();

                if (isDone) {
                    text += " 收集 #v" + item.getItemId() + "# 【#b" + item.getItemName() + "#k】 " + progTag + "\r\n\r\n";
                } else {
                    text += "#L" + (200000 + i) + "# 收集 #v" + item.getItemId() + "# 【#b" + item.getItemName() + "#k】 (#r" + item.getCurrentCount() + "/" + item.getRequiredCount() + "#k) -> #d[出处/掉落]#k#l\r\n";
                    if (item.getRequiredCount() > 1) {
                        if (item.isDeliverable()) {
                            if (item.isQuestExclusive()) {
                                text += "#L" + (250000 + i) + "#   └─ #d[样本已解锁购买: 缺 " + diff + "个 -> 消耗 " + item.getTotalPrice() + " 金币]#k#l\r\n";
                            } else {
                                text += "#L" + (250000 + i) + "#   └─ #d[购买补齐: 缺 " + diff + "个 -> 消耗 " + item.getTotalPrice() + " 金币]#k#l\r\n";
                            }
                        } else if (item.isQuestExclusive() && item.getCurrentCount() === 0) {
                            text += "#L" + (200000 + i) + "#   └─ #r(专属任务道具: 需背包至少持有1个样本以解锁购买)#k#l\r\n";
                        } else if ((!item.getDropMobs() || item.getDropMobs().isEmpty()) && (!item.getDropReactors() || item.getDropReactors().isEmpty())) {
                            text += "#L" + (200000 + i) + "#   └─ #r[无怪物/野外掉落,不可购买]#k#l\r\n";
                        } else if (!item.getDropMobs() || item.getDropMobs().isEmpty()) {
                            text += "#L" + (200000 + i) + "#   └─ #d(野外花草/宝箱采集,点击查看地图)#k#l\r\n";
                        } else {
                            text += "#L" + (200000 + i) + "#   └─ #r(剧情/特殊道具需手动获取)#k#l\r\n";
                        }
                    }
                    text += "\r\n";
                }
            }
        }

        // 3. 怪物图鉴卡片目标
        if (cardObjs && cardObjs.size() > 0) {
            hasContent = true;
            text += "#e【 怪物图鉴卡片目标 】#n\r\n";
            for (var i = 0; i < cardObjs.size(); i++) {
                var card = cardObjs.get(i);
                var isDone = card.isCompleted();
                var progTag = isDone ? "#b(已点亮)#k" : "#r(未收集)#k";
                if (isDone) {
                    text += " 收集 #v" + card.getCardId() + "# 【#b" + card.getCardName() + "#k】 " + progTag + "\r\n\r\n";
                } else {
                    text += "#L" + (350000 + i) + "# 收集 #v" + card.getCardId() + "# 【#b" + card.getCardName() + "#k】 " + progTag + " -> #d[掉落出处]#k#l\r\n\r\n";
                }
            }
        }

        // 4. 探索 / 封印 / 调查目标
        if (expObjs && expObjs.size() > 0) {
            hasContent = true;
            text += "#e【 探索 / 封印 / 调查目标 】#n\r\n";
            for (var i = 0; i < expObjs.size(); i++) {
                var obj = expObjs.get(i);
                var isDone = obj.isCompleted();
                var progTag = isDone ? "#b[已达成]#k" : "#r[未完成]#k";
                if (isDone) {
                    text += " 目标 " + (i + 1) + "：【#b" + obj.getTargetName() + "#k】 " + progTag + "\r\n\r\n";
                } else {
                    var warpUnlocked = service.isMapWarpUnlocked(cm.getPlayer(), obj.getMapId());
                    var costStr = obj.getWarpCost() > 0 ? " [费用: " + obj.getWarpCost() + "金币]" : "";
                    if (warpUnlocked) {
                        text += "#L" + (600000 + i) + "# 目标 " + (i + 1) + "：【#b" + obj.getTargetName() + "#k】 " + progTag + costStr + " -> #d[传送]#k#l\r\n\r\n";
                    } else {
                        text += " 目标 " + (i + 1) + "：【#b" + obj.getTargetName() + "#k】 " + progTag + " #r[地图未探索解锁]#k\r\n\r\n";
                    }
                }
            }
        }

        // 5. NPC 导航
        if (startNpc || compNpc) {
            hasContent = true;
            text += "#e【 NPC 导航传送 】#n\r\n";
            if (startNpc) {
                var startUnlockedMaps = getUnlockedMapsList(startNpc.getMaps());
                if (startUnlockedMaps.length > 0) {
                    var startMap = startUnlockedMaps[0];
                    var locStr = formatLocationName(startMap);
                    var costStr = startMap && startMap.getWarpCost() > 0 ? " [费用: " + startMap.getWarpCost() + "金币]" : "";
                    text += "#L300001# 接取NPC：#b" + startNpc.getNpcName() + "#k (" + locStr + ")" + costStr + "#l\r\n";
                } else {
                    var startMapRaw = (startNpc.getMaps() && startNpc.getMaps().size() > 0) ? startNpc.getMaps().get(0) : null;
                    var locStr = formatLocationName(startMapRaw);
                    text += " 接取NPC：#b" + startNpc.getNpcName() + "#k (" + locStr + ") #r[所在地图未探索解锁]#k\r\n";
                }
            }
            if (compNpc) {
                var compUnlockedMaps = getUnlockedMapsList(compNpc.getMaps());
                if (compUnlockedMaps.length > 0) {
                    var compMap = compUnlockedMaps[0];
                    var locStr = formatLocationName(compMap);
                    var costStr = compMap && compMap.getWarpCost() > 0 ? " [费用: " + compMap.getWarpCost() + "金币]" : "";
                    text += "#L300002# 交付NPC：#b" + compNpc.getNpcName() + "#k (" + locStr + ")" + costStr + "#l\r\n";
                } else {
                    var compMapRaw = (compNpc.getMaps() && compNpc.getMaps().size() > 0) ? compNpc.getMaps().get(0) : null;
                    var locStr = formatLocationName(compMapRaw);
                    text += " 交付NPC：#b" + compNpc.getNpcName() + "#k (" + locStr + ") #r[所在地图未探索解锁]#k\r\n";
                }
            }
            text += "\r\n";
        }

        if (!hasContent) {
            text += "该任务为纯对话/探索类任务，无需特定击杀或物品收集。\r\n\r\n";
        }

        text += "#L999999##b[返回任务列表]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("任务详情加载失败：" + e);
        cm.dispose();
    }
}

function handleDetailSelection(selection) {
    if (selection === 999999) {
        showQuestList(selectedCategory);
        return;
    }

    // 一键同步账号击杀并购买全部普通材料 -> 二次确认弹窗
    if (selection === 10000) {
        var totalMobCost = currentDetail.getTotalSyncableMobsCost();
        var totalMatCost = currentDetail.getTotalRegularMaterialsCost();
        var combinedCost = currentDetail.getTotalCostWithMobsAndMaterials();

        var confirmText = "#e#b【一键完成任务目标确认】#k#n\r\n\r\n"
            + "本次一键操作将包含：\r\n"
            + " - 同步本任务所有可用的账号历史怪物击杀\r\n"
            + " - 购买补齐本任务所有可购买的普通/商店材料\r\n\r\n"
            + "本次一键结算共计消耗：\r\n"
            + " - 怪物同步金币：#r" + totalMobCost + "#k 金币\r\n"
            + " - 材料购买金币：#r" + totalMatCost + "#k 金币\r\n"
            + " - 合计所需金币：#r" + combinedCost + "#k 金币\r\n"
            + " - 当前持有金币：#b" + cm.getPlayer().getMeso() + "#k 金币\r\n\r\n"
            + "#e是否确认支付金币并立即一键完成？#n";

        pendingConfirmAction = { type: 'ALL', id: 0, cost: combinedCost };
        cm.sendYesNo(confirmText);
        return;
    }

    // 单项购买指定怪物的账号历史击杀 -> 二次确认弹窗
    if (selection >= 150000 && selection < 200000) {
        var index = selection - 150000;
        var mob = currentDetail.getMobObjectives().get(index);
        var buyCount = mob.getPurchasableKills();

        var confirmText = "#e#b【快速完成怪物击杀确认】#k#n\r\n\r\n"
            + "本次任务目标：\r\n"
            + " - 目标怪物：#b" + mob.getMobName() + " (Lv." + mob.getMobLevel() + ")#k\r\n"
            + " - 当前任务进度：#b" + mob.getCurrentKills() + "/" + mob.getRequiredKills() + "#k 只\r\n"
            + " - 账号历史总数：#b" + mob.getTotalAccountKills() + "#k 只\r\n"
            + " - 本次购买注入：#b" + buyCount + "#k 只\r\n\r\n"
            + "本次快速结算将消耗：\r\n"
            + " - 击杀单价：#r" + mob.getUnitPrice() + "#k 金币\r\n"
            + " - 所需金币：#r" + buyCount + "只 * " + mob.getUnitPrice() + "金币/只 = " + mob.getTotalCost() + " 金币#k\r\n"
            + " - 当前持有金币：#b" + cm.getPlayer().getMeso() + "#k 金币\r\n\r\n"
            + "#e是否确认支付金币购买并注入 " + buyCount + " 只击杀？#n";

        pendingConfirmAction = { type: 'MOB', id: mob.getMobId(), cost: mob.getTotalCost() };
        cm.sendYesNo(confirmText);
        return;
    }

    // 单项补齐指定普通材料/商店道具 -> 二次确认弹窗
    if (selection >= 250000 && selection < 300000) {
        var index = selection - 250000;
        var item = currentDetail.getItemObjectives().get(index);
        var diff = item.getRequiredCount() - item.getCurrentCount();

        var tagHeader = item.isQuestExclusive() ? "【购买专属任务道具确认(样本已解锁)】" : "【购买补齐材料确认】";
        var avgPrice = diff > 0 ? Math.round(item.getTotalPrice() / diff) : item.getUnitPrice();

        var confirmText = "#e#b" + tagHeader + "#k#n\r\n\r\n"
            + "本次任务目标：\r\n"
            + " - 收集道具：#v" + item.getItemId() + "# 【#b" + item.getItemName() + "#k】 x " + diff + " 个\r\n\r\n"
            + "本次购买补齐将消耗：\r\n"
            + " - 所需金币：#r" + diff + "#k 个 * #r" + avgPrice + "#k 金币/个 = #r" + item.getTotalPrice() + "#k 金币\r\n"
            + " - 当前持有金币：#b" + cm.getPlayer().getMeso() + "#k 金币\r\n\r\n"
            + "#e是否确认支付金币并购买补齐？#n";

        pendingConfirmAction = { type: 'ITEM', id: item.getItemId(), cost: item.getTotalPrice() };
        cm.sendYesNo(confirmText);
        return;
    }

    // 击杀怪物 -> 显示怪物地图列表
    if (selection >= 100000 && selection < 200000) {
        var index = selection - 100000;
        var mob = currentDetail.getMobObjectives().get(index);
        showMobMapList(mob);
        return;
    }

    // 道具收集 -> 显示掉落怪物列表
    if (selection >= 200000 && selection < 250000) {
        var index = selection - 200000;
        selectedItem = currentDetail.getItemObjectives().get(index);
        showDropMobList(selectedItem);
        return;
    }

    // 接取 NPC 传送
    if (selection === 300001) {
        var startNpc = currentDetail.getStartNpc();
        showNpcMapList(startNpc, "接取");
        return;
    }

    // 交付 NPC 传送
    if (selection === 300002) {
        var compNpc = currentDetail.getCompleteNpc();
        showNpcMapList(compNpc, "交付");
        return;
    }

    // 怪物图鉴卡片出处 -> 显示掉落怪物列表
    if (selection >= 350000 && selection < 400000) {
        var index = selection - 350000;
        var card = currentDetail.getCardObjectives().get(index);
        showCardDropList(card);
        return;
    }

    // 探索 / 封印 / 调查目标 -> 直接传送
    if (selection >= 600000 && selection < 700000) {
        var index = selection - 600000;
        var obj = currentDetail.getExplorationObjectives().get(index);
        if (obj) {
            tryWarpPlayerById(obj.getMapId(), "已传送至目标 【" + obj.getTargetName() + "】 所在地图：");
        }
        cm.dispose();
        return;
    }

    cm.dispose();
}

/**
 * 界面 3-A：展示怪物的野外分布地图（仅显示已解锁探索的地图）
 */
function showMobMapList(mob) {
    try {
        if (!mob) {
            showQuestDetail(selectedQuestId);
            return;
        }
        if (mob.isBoss()) {
            cm.sendOk("当前地图无法传送");
            return;
        }
        var unlockedMaps = getUnlockedMapsList(mob.getMaps());
        currentMapList = unlockedMaps;

        if (unlockedMaps.length === 0) {
            cm.sendOk("怪物 【" + mob.getMobName() + "】 所在的分布地图尚未探索解锁（需先探索并访问对应主城）。");
            return;
        }

        currentState = STATE_SUB_MENU;
        var text = "#e#b怪物 【" + mob.getMobName() + "】 出现在以下已解锁地图：#k#n\r\n请选择传送目的地：\r\n\r\n";
        for (var i = 0; i < unlockedMaps.length; i++) {
            var map = unlockedMaps[i];
            text += "#L" + (500000 + i) + "# " + map.getDisplayName() + "#l\r\n";
        }
        text += "\r\n#L999998##b[返回任务详情]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("怪物分布地图加载失败：" + e);
        cm.dispose();
    }
}

/**
 * 界面 3-B：展示道具的掉落怪物与反应堆（花草/宝箱）来源列表（仅展示已探索解锁地图的来源）
 */
function showDropMobList(item) {
    try {
        if (!item) {
            showQuestDetail(selectedQuestId);
            return;
        }
        var dropMobs = item.getDropMobs();
        var dropReactors = item.getDropReactors();

        var unlockedDropMobs = [];
        if (dropMobs) {
            for (var i = 0; i < dropMobs.size(); i++) {
                var dropMob = dropMobs.get(i);
                var mUnlocked = getUnlockedMapsList(dropMob.getMaps());
                if (mUnlocked.length > 0) {
                    unlockedDropMobs.push({ index: i, mob: dropMob, maps: mUnlocked });
                }
            }
        }

        var unlockedDropReactors = [];
        if (dropReactors) {
            for (var j = 0; j < dropReactors.size(); j++) {
                var dropReactor = dropReactors.get(j);
                var rUnlocked = getUnlockedMapsList(dropReactor.getMaps());
                if (rUnlocked.length > 0) {
                    unlockedDropReactors.push({ index: j, reactor: dropReactor, maps: rUnlocked });
                }
            }
        }

        var hasMobs = unlockedDropMobs.length > 0;
        var hasReactors = unlockedDropReactors.length > 0;

        if (!hasMobs && !hasReactors) {
            cm.sendOk("道具 【#b" + item.getItemName() + "#k】 的所有掉落怪物与采集物所在地图#r尚未探索解锁#k（或暂无野外直接掉落数据）。\r\n\r\n请先前往探索相应区域主城后再来查看与传送！");
            return;
        }

        currentState = STATE_SUB_MENU;
        var text = "#e#b道具 【" + item.getItemName() + "】 的出处与掉落来源列表：#k#n\r\n点击怪物或采集物查看分布地图并传送：\r\n\r\n";

        if (hasMobs) {
            text += "#e【 野外怪物掉落 】#n\r\n";
            for (var i = 0; i < unlockedDropMobs.length; i++) {
                var entry = unlockedDropMobs[i];
                var dropMob = entry.mob;
                var mUnlocked = entry.maps;
                if (dropMob.isBoss()) {
                    text += "#L" + (400000 + entry.index) + "# " + dropMob.getMobName() + " #r[Boss]#k (掉率: " + dropMob.getChanceText() + ") #r[Boss需自行前往]#k#l\r\n";
                } else {
                    text += "#L" + (400000 + entry.index) + "# " + dropMob.getMobName() + " (掉率: " + dropMob.getChanceText() + ", 可传送)#l\r\n";
                }
            }
            text += "\r\n";
        }

        if (hasReactors) {
            text += "#e【 野外反应堆 / 花草 / 宝箱采集 】#n\r\n";
            for (var j = 0; j < unlockedDropReactors.length; j++) {
                var rEntry = unlockedDropReactors[j];
                var dropReactor = rEntry.reactor;
                text += "#L" + (450000 + rEntry.index) + "# 【采集】 " + dropReactor.getReactorName() + " (掉率: " + dropReactor.getChanceText() + ", 可传送)#l\r\n";
            }
            text += "\r\n";
        }

        text += "#L999998##b[返回任务详情]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("掉落来源加载失败：" + e);
        cm.dispose();
    }
}

/**
 * 界面 3-C：展示 NPC 的所在地图列表（仅显示已解锁探索的地图）
 */
function showNpcMapList(npc, npcType) {
    try {
        if (!npc) {
            showQuestDetail(selectedQuestId);
            return;
        }
        var unlockedMaps = getUnlockedMapsList(npc.getMaps());
        if (unlockedMaps.length === 0) {
            cm.sendOk(npcType + " NPC 【" + npc.getNpcName() + "】 所在的地图尚未探索解锁（需先探索对应主城或地图）。");
            return;
        }
        if (unlockedMaps.length === 1) {
            var targetMap = unlockedMaps[0];
            tryWarpPlayer(targetMap, "已传送至" + npcType + " NPC 【" + npc.getNpcName() + "】 所在地图：");
            cm.dispose();
            return;
        }

        currentMapList = unlockedMaps;
        currentState = STATE_SUB_MENU;
        var text = "#e#b" + npcType + " NPC 【" + npc.getNpcName() + "】 所在地图：#k#n\r\n请选择目的地：\r\n\r\n";
        for (var i = 0; i < unlockedMaps.length; i++) {
            var map = unlockedMaps[i];
            text += "#L" + (500000 + i) + "# " + map.getDisplayName() + "#l\r\n";
        }
        text += "\r\n#L999998##b[返回任务详情]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("NPC地图加载失败：" + e);
        cm.dispose();
    }
}

function handleSubSelection(selection) {
    if (selection === 999998) {
        showQuestDetail(selectedQuestId);
        return;
    }

    // 直接地图传送 (来自怪物地图或 NPC 地图)
    if (selection >= 500000 && selection < 600000) {
        var mapIndex = selection - 500000;
        var targetMap = getTargetMapFromList(currentMapList, mapIndex);
        if (targetMap) {
            tryWarpPlayer(targetMap);
        }
        cm.dispose();
        return;
    }

    // 点击了掉落怪物 -> 进入界面 4：展示该怪物的分布地图列表
    if (selection >= 400000 && selection < 450000) {
        var index = selection - 400000;
        if (selectedItem && selectedItem.getDropMobs() && index < selectedItem.getDropMobs().size()) {
            var dropMob = selectedItem.getDropMobs().get(index);
            if (dropMob.isBoss()) {
                cm.sendOk("当前地图无法传送");
                return;
            }
            showDropMobMapList(dropMob);
        } else {
            showQuestDetail(selectedQuestId);
        }
        return;
    }

    // 点击了掉落反应堆（花草/宝箱） -> 进入界面 4：展示该反应堆的分布地图列表
    if (selection >= 450000 && selection < 500000) {
        var rIndex = selection - 450000;
        if (selectedItem && selectedItem.getDropReactors() && rIndex < selectedItem.getDropReactors().size()) {
            var dropReactor = selectedItem.getDropReactors().get(rIndex);
            showDropReactorMapList(dropReactor);
        } else {
            showQuestDetail(selectedQuestId);
        }
        return;
    }

    cm.dispose();
}

/**
 * 界面 4：展示具体掉落怪物的分布地图列表（仅显示已解锁探索的地图）
 */
function showDropMobMapList(dropMob) {
    try {
        if (!dropMob) {
            showDropMobList(selectedItem);
            return;
        }
        if (dropMob.isBoss()) {
            cm.sendOk("当前地图无法传送");
            return;
        }
        var unlockedMaps = getUnlockedMapsList(dropMob.getMaps());
        currentMapList = unlockedMaps;

        if (unlockedMaps.length === 0) {
            cm.sendOk("怪物 【" + dropMob.getMobName() + "】 所在的野外分布地图尚未探索解锁（需先探索对应主城）。");
            return;
        }

        currentState = STATE_MAP_LIST;
        var itemName = selectedItem ? selectedItem.getItemName() : "";
        var text = "#e#b怪物 【" + dropMob.getMobName() + "】 (掉落: " + itemName + ") 分布地图：#k#n\r\n请选择传送目的地：\r\n\r\n";
        for (var i = 0; i < unlockedMaps.length; i++) {
            var map = unlockedMaps[i];
            text += "#L" + (500000 + i) + "# " + map.getDisplayName() + "#l\r\n";
        }
        text += "\r\n#L999997##b[返回出处来源列表]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("掉落怪物地图加载失败：" + e);
        cm.dispose();
    }
}

/**
 * 界面 4-B：展示具体反应堆（花草/宝箱/采集物）的分布地图列表（仅显示已解锁探索的地图）
 */
function showDropReactorMapList(dropReactor) {
    try {
        if (!dropReactor) {
            showDropMobList(selectedItem);
            return;
        }
        var unlockedMaps = getUnlockedMapsList(dropReactor.getMaps());
        currentMapList = unlockedMaps;

        if (unlockedMaps.length === 0) {
            cm.sendOk("【" + dropReactor.getReactorName() + "】 所在的分布地图尚未探索解锁（需先探索对应主城）。");
            return;
        }

        currentState = STATE_MAP_LIST;
        var itemName = selectedItem ? selectedItem.getItemName() : "";
        var text = "#e#b【" + dropReactor.getReactorName() + "】 (产出: " + itemName + ") 分布地图：#k#n\r\n请选择传送目的地：\r\n\r\n";
        for (var i = 0; i < unlockedMaps.length; i++) {
            var map = unlockedMaps[i];
            text += "#L" + (500000 + i) + "# " + map.getDisplayName() + "#l\r\n";
        }
        text += "\r\n#L999997##b[返回出处来源列表]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("采集物分布地图加载失败：" + e);
        cm.dispose();
    }
}

function handleMapListSelection(selection) {
    if (selection === 999997) {
        showDropMobList(selectedItem);
        return;
    }

    if (selection >= 500000 && selection < 600000) {
        var mapIndex = selection - 500000;
        var targetMap = getTargetMapFromList(currentMapList, mapIndex);
        if (targetMap) {
            tryWarpPlayer(targetMap);
        }
        cm.dispose();
        return;
    }

    cm.dispose();
}

function formatLocationName(map) {
    if (!map) return "未知地图";
    var street = map.getStreetName() ? ("" + map.getStreetName()).trim() : "";
    var name = map.getMapName() ? ("" + map.getMapName()).trim() : "";
    if (street !== "" && name !== "" && street !== name) {
        var combined = street + " - " + name;
        return (combined.length <= 16) ? combined : name;
    }
    return (name !== "") ? name : (street !== "" ? street : "地图 (" + map.getMapId() + ")");
}

/**
 * 统一传送扣费与金币校验方法
 */
function tryWarpPlayer(targetMap, noticePrefix) {
    if (org.gms.server.quest.JobAdvancementUtil.isUndergoingJobAdvancement(cm.getPlayer())) {
        cm.sendOk("转职考验进行中，为了感受真实的冒险旅程，当前禁止使用直接传送！\r\n\r\n请使用#b步行、坐船、打车或回城卷#k等固有移动手段前往目的地。");
        return false;
    }
    var service = cm.getQuestHelp();
    var mapId = targetMap.getMapId();
    if (service && !service.isMapWarpUnlocked(cm.getPlayer(), mapId)) {
        if (service.isHiddenMap(mapId) || service.getTownIdForMap(mapId) <= 0) {
            cm.sendOk("目的地 【#b" + targetMap.getDisplayName() + "#k】 为隐藏/特殊区域，您尚未亲自探索过！\r\n必须先亲自找到并前往该地图一次后，方可使用直达传送。");
        } else {
            var townName = service.getTownNameForMap(mapId);
            var townStr = (townName && townName !== "未知主城") ? "【#b" + townName + "#k】" : "该区域的主城";
            cm.sendOk("您尚未探索并访问过 " + townStr + "！\r\n请先亲自前往探索该主城后，方可解锁直达传送。");
        }
        return false;
    }

    var cost = targetMap.getWarpCost();
    if (cost > 0 && cm.getPlayer().getMeso() < cost) {
        cm.sendOk("您的金币不足，无法进行传送！\r\n\r\n目的地：#b" + targetMap.getDisplayName() + "#k\r\n需要费用：#r" + cost + " 金币#k\r\n当前持有：#d" + cm.getPlayer().getMeso() + " 金币#k\r\n\r\n请准备好足够的金币后再来使用传送功能！");
        return false;
    }

    if (cost > 0) {
        cm.gainMeso(-cost);
    }
    cm.warp(targetMap.getMapId());
    var costMsg = cost > 0 ? "，扣除传送费用 " + cost + " 金币" : "";
    var prefix = noticePrefix ? noticePrefix : "已传送至 ";
    cm.playerMessage(5, prefix + targetMap.getDisplayName() + costMsg + "！祝你任务顺利！");
    return true;
}

/**
 * 界面 3-D：展示怪物图鉴卡片的掉落怪物列表（仅展示已探索解锁地图的怪物）
 */
function showCardDropList(card) {
    try {
        if (!card) {
            showQuestDetail(selectedQuestId);
            return;
        }
        var dropMobs = card.getDropMobs();
        var unlockedDropMobs = [];
        if (dropMobs) {
            for (var i = 0; i < dropMobs.size(); i++) {
                var dropMob = dropMobs.get(i);
                var mUnlocked = getUnlockedMapsList(dropMob.getMaps());
                if (mUnlocked.length > 0) {
                    unlockedDropMobs.push({ index: i, mob: dropMob, maps: mUnlocked });
                }
            }
        }

        if (unlockedDropMobs.length === 0) {
            cm.sendOk("卡片 【#b" + card.getCardName() + "#k】 的所有掉落怪物所在地图#r尚未探索解锁#k。\r\n\r\n请先前往探索相应区域主城后再来查看与传送！");
            return;
        }

        currentState = STATE_SUB_MENU;
        selectedItem = {
            getItemName: function() { return card.getCardName(); },
            getDropMobs: function() { return card.getDropMobs(); },
            getDropReactors: function() { return null; }
        };

        var text = "#e#b卡片 【" + card.getCardName() + "】 的掉落怪物列表：#k#n\r\n点击怪物查看分布地图并传送：\r\n\r\n";
        for (var i = 0; i < unlockedDropMobs.length; i++) {
            var entry = unlockedDropMobs[i];
            var dropMob = entry.mob;
            if (dropMob.isBoss()) {
                text += "#L" + (400000 + entry.index) + "# " + dropMob.getMobName() + " #r[Boss]#k (掉率: " + dropMob.getChanceText() + ") #r[Boss需自行前往]#k#l\r\n";
            } else {
                text += "#L" + (400000 + entry.index) + "# " + dropMob.getMobName() + " (掉率: " + dropMob.getChanceText() + ", 可传送)#l\r\n";
            }
        }
        text += "\r\n#L999998##b[返回任务详情]#k#l";
        cm.sendSimple(text);
    } catch (e) {
        cm.sendOk("卡片掉落来源加载失败：" + e);
        cm.dispose();
    }
}

/**
 * 按地图ID直接传送玩家并进行探索/费用校验
 */
function tryWarpPlayerById(mapId, mapName, noticePrefix) {
    if (org.gms.server.quest.JobAdvancementUtil.isUndergoingJobAdvancement(cm.getPlayer())) {
        cm.sendOk("转职考验进行中，为了感受真实的冒险旅程，当前禁止使用直接传送！\r\n\r\n请使用#b步行、坐船、打车或回城卷#k等固有移动手段前往目的地。");
        return false;
    }
    var service = cm.getQuestHelp();
    var mapName = service ? service.getMapName(mapId) : ("地图 (" + mapId + ")");
    if (service && !service.isMapWarpUnlocked(cm.getPlayer(), mapId)) {
        if (service.isHiddenMap(mapId) || service.getTownIdForMap(mapId) <= 0) {
            cm.sendOk("目的地 【#b" + mapName + "#k】 为隐藏/特殊区域，您尚未亲自探索过！\r\n必须先亲自找到并前往该地图一次后，方可使用直达传送。");
        } else {
            var townName = service.getTownNameForMap(mapId);
            var townStr = (townName && townName !== "未知主城") ? "【#b" + townName + "#k】" : "该区域的主城";
            cm.sendOk("您尚未探索并访问过 " + townStr + "！\r\n请先亲自前往探索该主城后，方可解锁直达传送。");
        }
        return false;
    }

    var cost = service ? service.getWarpCost(mapId) : 0;
    if (cost > 0 && cm.getPlayer().getMeso() < cost) {
        cm.sendOk("您的金币不足，无法进行传送！\r\n\r\n目的地：#b" + mapName + "#k\r\n需要费用：#r" + cost + " 金币#k\r\n当前持有：#d" + cm.getPlayer().getMeso() + " 金币#k\r\n\r\n请准备好足够的金币后再来使用传送功能！");
        return false;
    }

    if (cost > 0) {
        cm.gainMeso(-cost);
    }
    cm.warp(mapId);
    var costMsg = cost > 0 ? "，扣除传送费用 " + cost + " 金币" : "";
    var prefix = noticePrefix ? noticePrefix : "已传送至 ";
    cm.playerMessage(5, prefix + mapName + costMsg + "！祝你任务顺利！");
    return true;
}
