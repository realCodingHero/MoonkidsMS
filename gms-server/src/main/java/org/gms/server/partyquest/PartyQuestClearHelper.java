package org.gms.server.partyquest;

import org.gms.client.Character;
import org.gms.client.inventory.manipulator.InventoryManipulator;
import org.gms.scripting.event.EventInstanceManager;
import org.gms.server.life.Monster;
import org.gms.server.maps.MapleMap;
import org.gms.server.maps.Reactor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PartyQuestClearHelper {
    private static final Logger log = LoggerFactory.getLogger(PartyQuestClearHelper.class);

    public enum ClearResultType {
        SUCCESS,
        BOSS_STAGE_BLOCKED,
        NOT_IN_PQ,
        ERROR
    }

    public static class ClearResult {
        private final ClearResultType type;
        private final String message;

        public ClearResult(ClearResultType type, String message) {
            this.type = type;
            this.message = message;
        }

        public ClearResultType getType() {
            return type;
        }

        public String getMessage() {
            return message;
        }
    }

    public static boolean isBossStage(int mapId) {
        return mapId == 103000804 // Kerning King Slime
                || mapId == 922010900 // Ludi Alishar
                || mapId == 920010800 || mapId == 920010900 || mapId == 920011000 // Orbis Papa Pixie
                || mapId == 926100203 || mapId == 926110203 || mapId == 926100500 // Magatia Frankenroid
                || mapId == 925100500 // Pirate Captain
                || mapId == 930000600; // Ellin Poison Golem
    }

    public static boolean isPuzzleStage(int mapId) {
        return (mapId >= 103000801 && mapId <= 103000803) // Kerning rope/platform/barrel
                || mapId == 922010600 || mapId == 922010800 // Ludi box jump / 5-box
                || mapId == 926100000 || mapId == 926110000 // Magatia Stage 1
                || mapId == 926100100 || mapId == 926110100 // Magatia Stage 3
                || mapId == 926100400 || mapId == 926110400; // Magatia Stage 6
    }

    public static ClearResult handlePassPQ(Character player, boolean forceBoss) {
        if (player == null || player.getMap() == null) {
            return new ClearResult(ClearResultType.ERROR, "玩家或地图不存在。");
        }

        int mapId = player.getMapId();
        EventInstanceManager eim = player.getEventInstance();
        Character leader = (eim != null && eim.getLeader() != null) ? eim.getLeader() : player;

        // 1. 废弃都市组队任务 (Kerning PQ / 103000800 ~ 103000805)
        if (mapId >= 103000800 && mapId <= 103000805) {
            return handleKerningPQ(player, leader, eim, mapId, forceBoss);
        }

        // 2. 玩具城组队任务 (Ludibrium PQ / 922010100 ~ 922011000)
        if (mapId >= 922010100 && mapId <= 922011000) {
            return handleLudiPQ(player, leader, eim, mapId, forceBoss);
        }

        // 3. 射手村月妙组队任务 (Henesys PQ / 910010000)
        if (mapId == 910010000) {
            return handleHenesysPQ(player, leader, eim, forceBoss);
        }

        // 4. 天空之城女神塔组队任务 (Orbis PQ / 920010000 ~ 920011200)
        if (mapId >= 920010000 && mapId <= 920011200) {
            return handleOrbisPQ(player, leader, eim, mapId, forceBoss);
        }

        // 5. 罗密欧与朱丽叶组队任务 (Magatia PQ / 926100000 ~ 926100700, 926110000 ~ 926110700)
        if ((mapId >= 926100000 && mapId <= 926100700) || (mapId >= 926110000 && mapId <= 926110700)) {
            return handleMagatiaPQ(player, leader, eim, mapId, forceBoss);
        }

        // 6. 海盗组队任务 (Pirate PQ / 925100000 ~ 925100500)
        if (mapId >= 925100000 && mapId <= 925100500) {
            return handlePiratePQ(player, leader, eim, mapId, forceBoss);
        }

        // 7. 毒雾森林组队任务 (Ellin PQ / 930000000 ~ 930000600)
        if (mapId >= 930000000 && mapId <= 930000600) {
            return handleEllinPQ(player, leader, eim, mapId, forceBoss);
        }

        // 8. 通用组队任务 / 副本检测
        return handleGenericPQ(player, leader, eim, mapId, forceBoss);
    }

    private static void giveItem(Character target, int itemId, int count) {
        if (target != null && target.getClient() != null) {
            int currentCount = target.getItemQuantity(itemId, false);
            int needed = count - currentCount;
            if (needed > 0) {
                InventoryManipulator.addById(target.getClient(), itemId, (short) needed);
            }
        }
    }

    private static ClearResult handleKerningPQ(Character player, Character leader, EventInstanceManager eim, int mapId, boolean forceBoss) {
        switch (mapId) {
            case 103000800: { // Stage 1 答题关
                int count = (eim != null ? Math.max(1, eim.getPlayerCount() - 1) : 3);
                giveItem(leader, 4001008, count);
                return new ClearResult(ClearResultType.SUCCESS, "[废弃都市 PQ - 第1阶段] 已为队长发放通过所需的通行证，请与克洛托对话过关。");
            }
            case 103000801: { // Stage 2 绳子关
                if (eim != null) {
                    eim.setProperty("2stageclear", "true");
                    eim.setProperty("stg2stageclear", "true");
                    eim.showClearEffect(true);
                    eim.linkToNextStage(2, "kpq", mapId);
                }
                return new ClearResult(ClearResultType.SUCCESS, "[废弃都市 PQ - 第2阶段] 挂绳谜题已破解，通往下一阶段的传送门已开启！");
            }
            case 103000802: { // Stage 3 平台关
                if (eim != null) {
                    eim.setProperty("3stageclear", "true");
                    eim.setProperty("stg3stageclear", "true");
                    eim.showClearEffect(true);
                    eim.linkToNextStage(3, "kpq", mapId);
                }
                return new ClearResult(ClearResultType.SUCCESS, "[废弃都市 PQ - 第3阶段] 平台站位谜题已破解，通往下一阶段的传送门已开启！");
            }
            case 103000803: { // Stage 4 木桶关
                if (eim != null) {
                    eim.setProperty("4stageclear", "true");
                    eim.setProperty("stg4stageclear", "true");
                    eim.showClearEffect(true);
                    eim.linkToNextStage(4, "kpq", mapId);
                }
                return new ClearResult(ClearResultType.SUCCESS, "[废弃都市 PQ - 第4阶段] 木桶站位谜题已破解，通往下一阶段的传送门已开启！");
            }
            case 103000804: { // Stage 5 绿水灵王 Boss 关
                if (!forceBoss) {
                    return new ClearResult(ClearResultType.BOSS_STAGE_BLOCKED, "[废弃都市 PQ - 终极阶段] 当前为 Boss 战斗关卡（超级绿水灵），单人可直接挑战。请消灭 Boss 收集 10 张通行证，或使用 '!passpq boss' 强制跳过。");
                }
                giveItem(leader, 4001008, 10);
                return new ClearResult(ClearResultType.SUCCESS, "[废弃都市 PQ - 终极阶段] 已强制为队长发放 10 张通行证，请与克洛托对话完成任务！");
            }
            case 103000805: {
                return new ClearResult(ClearResultType.SUCCESS, "[废弃都市 PQ] 当前已在奖励地图。");
            }
            default:
                return new ClearResult(ClearResultType.NOT_IN_PQ, "当前不是废弃都市组队任务的进行地图。");
        }
    }

    private static ClearResult handleLudiPQ(Character player, Character leader, EventInstanceManager eim, int mapId, boolean forceBoss) {
        switch (mapId) {
            case 922010100: { // Stage 1 白老鼠怪
                giveItem(leader, 4001022, 25);
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第1阶段] 已为队长发放 25 张通行证，请与 NPC 对话过关。");
            }
            case 922010200: { // Stage 2 隐藏箱子
                giveItem(leader, 4001022, 15);
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第2阶段] 已为队长发放 15 张通行证，请与 NPC 对话过关。");
            }
            case 922010300: { // Stage 3 八爪章鱼怪
                giveItem(leader, 4001022, 32);
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第3阶段] 已为队长发放 32 张通行证，请与 NPC 对话过关。");
            }
            case 922010400: { // Stage 4 暗黑幻影怪
                giveItem(leader, 4001022, 6);
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第4阶段] 已为队长发放 6 张通行证，请与 NPC 对话过关。");
            }
            case 922010500: { // Stage 5 迷宫箱子
                giveItem(leader, 4001022, 24);
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第5阶段] 已为队长发放 24 张迷宫通行证，请与 NPC 对话过关。");
            }
            case 922010600: { // Stage 6 算术跳箱子
                if (eim != null) {
                    eim.setProperty("6stageclear", "true");
                    eim.showClearEffect(true);
                }
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第6阶段] 已协助跳过算术跳箱子关卡，请前往顶部传送门！");
            }
            case 922010700: { // Stage 7 恶魔水灵怪
                giveItem(leader, 4001022, 3);
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第7阶段] 已为队长发放 3 张通行证，请与 NPC 对话过关。");
            }
            case 922010800: { // Stage 8 5人箱子站位
                if (eim != null) {
                    eim.setProperty("8stageclear", "true");
                    eim.setProperty("stg8stageclear", "true");
                    eim.showClearEffect(true);
                    eim.linkToNextStage(8, "lpq", mapId);
                }
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 第8阶段] 9箱站位谜题已破解，传送门已开启！");
            }
            case 922010900: { // Stage 9 泥人巨怪 Boss
                if (!forceBoss) {
                    return new ClearResult(ClearResultType.BOSS_STAGE_BLOCKED, "[玩具城 PQ - 终极阶段] 当前为 Boss 战斗关卡（泥人巨怪），请击败 Boss 获取次元钥匙，或使用 '!passpq boss' 强制跳过。");
                }
                giveItem(leader, 4001023, 1);
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ - 终极阶段] 已强制发放次元钥匙，请与 NPC 对话开启奖励阶段！");
            }
            case 922011000: {
                return new ClearResult(ClearResultType.SUCCESS, "[玩具城 PQ] 当前已在奖励地图。");
            }
            default:
                return new ClearResult(ClearResultType.NOT_IN_PQ, "当前不是玩具城组队任务的进行地图。");
        }
    }

    private static ClearResult handleHenesysPQ(Character player, Character leader, EventInstanceManager eim, boolean forceBoss) {
        giveItem(leader, 4001101, 10);
        return new ClearResult(ClearResultType.SUCCESS, "[射手村月妙 PQ] 已为队长发放 10 块月妙年糕，请与托利对话过关。");
    }

    private static ClearResult handleOrbisPQ(Character player, Character leader, EventInstanceManager eim, int mapId, boolean forceBoss) {
        if (mapId == 920010800 || mapId == 920010900 || mapId == 920011000) { // Boss 战
            if (!forceBoss) {
                return new ClearResult(ClearResultType.BOSS_STAGE_BLOCKED, "[天空之城 PQ] 当前为 Boss 战斗关卡（爸爸精灵），请击杀 Boss 获取生命草，或使用 '!passpq boss' 强制跳过。");
            }
            giveItem(leader, 4001050, 1);
            return new ClearResult(ClearResultType.SUCCESS, "[天空之城 PQ] 已强制发放生命草，请交回女神像！");
        }

        // 唱片房
        if (mapId == 920010400) {
            int day = java.time.LocalDate.now().getDayOfWeek().getValue();
            int cdId = 4001056 + (day % 7);
            giveItem(leader, cdId, 1);
            return new ClearResult(ClearResultType.SUCCESS, "[天空之城 PQ - 唱片室] 已发放今日唱片，请放入唱片机播放！");
        }

        // 休息室（日记）
        if (mapId == 920010300) {
            giveItem(leader, 4001063, 1);
            return new ClearResult(ClearResultType.SUCCESS, "[天空之城 PQ - 休息室] 已发放日记碎片！");
        }

        // 封印室/其他碎片关卡
        giveItem(leader, 4001044, 1);
        giveItem(leader, 4001045, 1);
        giveItem(leader, 4001046, 1);
        giveItem(leader, 4001047, 1);
        giveItem(leader, 4001048, 1);
        giveItem(leader, 4001049, 1);
        return new ClearResult(ClearResultType.SUCCESS, "[天空之城 PQ] 已补齐女神雕像碎片，请与中央女神像对话。");
    }

    private static ClearResult handleMagatiaPQ(Character player, Character leader, EventInstanceManager eim, int mapId, boolean forceBoss) {
        if (mapId == 926100203 || mapId == 926110203 || mapId == 926100500) { // 疯狂/愤怒法郎肯斯坦 Boss
            if (!forceBoss) {
                return new ClearResult(ClearResultType.BOSS_STAGE_BLOCKED, "[罗密欧与朱丽叶 PQ] 当前为 Boss 战斗关卡（法郎肯斯坦），请击败 Boss，或使用 '!passpq boss' 强制跳过。");
            }
            giveItem(leader, 4001130, 1);
            giveItem(leader, 4001131, 1);
            if (eim != null) {
                eim.setIntProperty("statusStg7", 1);
                eim.setProperty("statusStg7", "1");
                eim.showClearEffect(true);
            }
            return new ClearResult(ClearResultType.SUCCESS, "[罗密欧与朱丽叶 PQ] 已强制发放通关信物，请与 NPC 对话通关！");
        }

        MapleMap map = player.getMap();

        // Stage 1 (926100000 / 926110000): 实验室可疑处 / 地下通道密室暗门
        if (mapId == 926100000 || mapId == 926110000) {
            if (eim != null) {
                eim.setIntProperty("statusStg1", 1);
                eim.setProperty("statusStg1", "1");
                eim.showClearEffect(true);
            }
            if (map != null) {
                Reactor door = map.getReactorByName("d00");
                if (door != null) {
                    door.forceHitReactor((byte) 1);
                }
            }
            giveItem(leader, 4001131, 1); // 发放朱丽叶的情书信件
            return new ClearResult(ClearResultType.SUCCESS, "[罗密欧与朱丽叶 PQ - 第1阶段] 地下密室暗门已开启，已发放情书信件，请直接进入传送门！");
        }

        // Stage 2 (926100001 / 926110001): 黑暗通道
        if (mapId == 926100001 || mapId == 926110001) {
            if (eim != null) {
                eim.setIntProperty("statusStg2", 1);
                eim.setProperty("statusStg2", "1");
                eim.showClearEffect(true);
            }
            return new ClearResult(ClearResultType.SUCCESS, "[罗密欧与朱丽叶 PQ - 第2阶段] 黑暗通道已解锁，请前往下一阶段传送门！");
        }

        // Stage 3 (926100100 / 926110100): 烧杯装满液体关卡
        if (mapId == 926100100 || mapId == 926110100) {
            if (eim != null) {
                eim.setIntProperty("statusStg3", 3);
                eim.setProperty("statusStg3", "3");
                eim.showClearEffect(true);
            }
            if (map != null) {
                Reactor rDoor = map.getReactorByName("rnj2_door");
                if (rDoor != null) rDoor.forceHitReactor((byte) 1);
                Reactor jDoor = map.getReactorByName("jnr2_door");
                if (jDoor != null) jDoor.forceHitReactor((byte) 1);
            }
            return new ClearResult(ClearResultType.SUCCESS, "[罗密欧与朱丽叶 PQ - 第3阶段] 烧杯实验已破解，通往中央实验室的大门已开启！");
        }

        // Stage 4 (926100200 / 926110200 ~ 926100202): 左右分支实验室
        if ((mapId >= 926100200 && mapId <= 926100202) || (mapId >= 926110200 && mapId <= 926110202)) {
            if (eim != null) {
                eim.setIntProperty("statusStg4", 1);
                eim.setProperty("statusStg4", "1");
                eim.showClearEffect(true);
            }
            giveItem(leader, 4001134, 1);
            giveItem(leader, 4001135, 1);
            return new ClearResult(ClearResultType.SUCCESS, "[罗密欧与朱丽叶 PQ - 第4阶段] 实验室门卡已破解，请前往中央大门！");
        }

        // Stage 6 (926100400 / 926110400): 机关跳台
        if (mapId == 926100400 || mapId == 926110400) {
            if (eim != null) {
                eim.setIntProperty("statusStg6", 1);
                eim.setProperty("statusStg6", "1");
                eim.showClearEffect(true);
            }
            return new ClearResult(ClearResultType.SUCCESS, "[罗密欧与朱丽叶 PQ - 第6阶段] 机关平台已破解，请进入顶部传送门！");
        }

        if (eim != null) {
            eim.setIntProperty("statusStg1", 1);
            eim.setIntProperty("statusStg2", 1);
            eim.setIntProperty("statusStg3", 3);
            eim.setIntProperty("statusStg4", 1);
            eim.setIntProperty("statusStg5", 1);
            eim.setIntProperty("statusStg6", 1);
            eim.showClearEffect(true);
        }
        return new ClearResult(ClearResultType.SUCCESS, "[罗密欧与朱丽叶 PQ] 机关已破解，请前往下一阶段！");
    }

    private static ClearResult handlePiratePQ(Character player, Character leader, EventInstanceManager eim, int mapId, boolean forceBoss) {
        if (mapId == 925100500) { // 老船长 Boss
            if (!forceBoss) {
                return new ClearResult(ClearResultType.BOSS_STAGE_BLOCKED, "[海盗 PQ] 当前为 Boss 战斗关卡（老船长），请击败 Boss，或使用 '!passpq boss' 强制跳过。");
            }
            giveItem(leader, 4001117, 1);
            return new ClearResult(ClearResultType.SUCCESS, "[海盗 PQ] 已强制发放通关钥匙，请与 NPC 对话完成任务！");
        }

        giveItem(leader, 4001117, 1); // 补发钥匙
        giveItem(leader, 4001120, 20); // 补发徽章
        return new ClearResult(ClearResultType.SUCCESS, "[海盗 PQ] 已发放通关钥匙与徽章，请与 NPC 对话开启大门！");
    }

    private static ClearResult handleEllinPQ(Character player, Character leader, EventInstanceManager eim, int mapId, boolean forceBoss) {
        if (mapId == 930000600) { // 毒藤怪 Boss
            if (!forceBoss) {
                return new ClearResult(ClearResultType.BOSS_STAGE_BLOCKED, "[毒雾森林 PQ] 当前为 Boss 战斗关卡（毒藤怪），请击败 Boss，或使用 '!passpq boss' 强制跳过。");
            }
            giveItem(leader, 4001198, 1);
            return new ClearResult(ClearResultType.SUCCESS, "[毒雾森林 PQ] 已强制发放通关信物，请与 NPC 对话完成任务！");
        }

        giveItem(leader, 4001161, 1); // 净化之石/大理石
        giveItem(leader, 4001162, 1);
        giveItem(leader, 4001163, 1);
        giveItem(leader, 4001164, 1);
        return new ClearResult(ClearResultType.SUCCESS, "[毒雾森林 PQ] 已发放净化道具与信物，请与 NPC 对话过关！");
    }

    private static ClearResult handleGenericPQ(Character player, Character leader, EventInstanceManager eim, int mapId, boolean forceBoss) {
        MapleMap map = player.getMap();
        if (map != null) {
            boolean hasBoss = map.getAllMonsters().stream().anyMatch(m -> m.getStats().isBoss());
            if (hasBoss && !forceBoss) {
                return new ClearResult(ClearResultType.BOSS_STAGE_BLOCKED, "[组队任务] 当前地图存在 Boss 怪物，单人可击败。请自行挑战 Boss，或使用 '!passpq boss' 强制跳过。");
            }
        }

        if (eim != null) {
            eim.showClearEffect(true);
            return new ClearResult(ClearResultType.SUCCESS, "[组队任务] 已尝试触发当前事件阶段通关判定！");
        }

        return new ClearResult(ClearResultType.NOT_IN_PQ, "当前地图不是已知的组队任务地图，未检测到可跳过的机关。");
    }
}
