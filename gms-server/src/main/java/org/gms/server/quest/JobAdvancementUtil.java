package org.gms.server.quest;

import org.gms.client.Character;
import org.gms.client.QuestStatus;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * 转职任务状态判定工具类
 * 用于检测玩家是否正在进行 2转、3转、4转 任务，以便在转职考验期间提供沉浸式冒险体验（限制瞬移/快捷直达传送）。
 * 一旦转职完成（职业阶级晋升），传送限制自动解除。
 */
public final class JobAdvancementUtil {

    // === 2转道具 (教官推荐信、英雄证书、黑珠、海盗任务道具等) ===
    private static final Set<Integer> SECOND_JOB_ITEM_IDS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            4031008, 4031009, 4031010, 4031011, // 战士/魔法师/弓箭手/飞侠 转职教官信件
            4031012, // 英雄证书 (Proof of Hero)
            4031013, // 黑珠 (Dark Marble)
            4031856, 4031857 // 海盗转职信件与能量证明
    )));

    // === 2转任务 ID (海盗/骑士团/战神/自定义2转任务) ===
    private static final Set<Integer> SECOND_JOB_QUEST_IDS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            100000, 100001, 100002, 100003, 100004, 100005,
            100006, 100007, 100008, 100009, 100010, 100011,
            2191, 2192, 6330, 6370,
            20200, 20201, 20202, 20203, 20204, 20205, // 骑士团 2转
            21200, 21201, 21202, 21203 // 战神 2转
    )));

    // === 3转道具 (黑符、力量/智慧项链) ===
    private static final Set<Integer> THIRD_JOB_ITEM_IDS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            4031057, // 黑符 (战士/弓箭手/飞侠/海盗 分身掉落)
            4031058, // 力量项链 / 智慧项链 (神圣之石 答题奖励)
            4031059  // 黑符 (魔法师 分身掉落)
    )));

    // === 3转任务 ID (骑士团/战神) ===
    private static final Set<Integer> THIRD_JOB_QUEST_IDS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            20300, 20301, 20302, 20303, 20304, 20305, // 骑士团 3转
            21300, 21301, 21302, 21303 // 战神 3转
    )));

    // === 4转道具 (英雄之星、英雄之羽、秘密卷轴、推荐信) ===
    private static final Set<Integer> FOURTH_JOB_ITEM_IDS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            4031343, 4031344, 4031345, 4031346
    )));

    // === 4转任务 ID (冒险家 4转 6900~6945、战神 4转 21400~21403) ===
    private static final Set<Integer> FOURTH_JOB_QUEST_IDS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            6900, 6901, 6902, 6903, 6904, 6905, // 战士 4转
            6910, 6911, 6912, 6913, 6914, 6915, // 魔法师 4转
            6920, 6921, 6922, 6923, 6924, 6925, // 弓箭手 4转
            6930, 6931, 6932, 6933, 6934, 6935, // 飞侠 4转
            6940, 6941, 6942, 6943, 6944, 6945, // 海盗 4转
            21400, 21401, 21402, 21403 // 战神 4转
    )));

    private static final Set<Integer> ALL_JOB_ADVANCEMENT_QUEST_IDS;

    static {
        Set<Integer> all = new HashSet<>();
        all.addAll(SECOND_JOB_QUEST_IDS);
        all.addAll(THIRD_JOB_QUEST_IDS);
        all.addAll(FOURTH_JOB_QUEST_IDS);
        ALL_JOB_ADVANCEMENT_QUEST_IDS = Collections.unmodifiableSet(all);
    }

    private JobAdvancementUtil() {
    }

    /**
     * 获取角色职业阶级 (0: 初心者, 1: 1转, 2: 2转, 3: 3转, 4: 4转, -1: GM/其他)
     */
    public static int getJobTier(int job) {
        if (job == 0 || job == 1000 || job == 2000) {
            return 0;
        }
        if (job == 100 || job == 200 || job == 300 || job == 400 || job == 500
                || job == 1100 || job == 1200 || job == 1300 || job == 1400 || job == 1500
                || job == 2100) {
            return 1;
        }
        if ((job >= 110 && job <= 130 && job % 10 == 0)
                || (job >= 210 && job <= 230 && job % 10 == 0)
                || (job >= 310 && job <= 320 && job % 10 == 0)
                || (job >= 410 && job <= 420 && job % 10 == 0)
                || (job >= 510 && job <= 520 && job % 10 == 0)
                || (job >= 1110 && job <= 1510 && job % 100 == 10)
                || job == 2110) {
            return 2;
        }
        if ((job >= 111 && job <= 131 && job % 10 == 1)
                || (job >= 211 && job <= 231 && job % 10 == 1)
                || (job >= 311 && job <= 321 && job % 10 == 1)
                || (job >= 411 && job <= 421 && job % 10 == 1)
                || (job >= 511 && job <= 521 && job % 10 == 1)
                || (job >= 1111 && job <= 1511 && job % 100 == 11)
                || job == 2111) {
            return 3;
        }
        if ((job >= 112 && job <= 132 && job % 10 == 2)
                || (job >= 212 && job <= 232 && job % 10 == 2)
                || (job >= 312 && job <= 322 && job % 10 == 2)
                || (job >= 412 && job <= 422 && job % 10 == 2)
                || (job >= 512 && job <= 522 && job % 10 == 2)
                || job == 2112) {
            return 4;
        }
        return -1;
    }

    /**
     * 判断当前角色是否正在进行 2转、3转、4转 任务
     * GM 管理员在游戏内道具/NPC交互时与普通玩家一致，仅在直接执行管理指令时豁免。
     *
     * @param chr 角色实例
     * @return 若角色正处于转职任务中则返回 true，否则返回 false
     */
    public static boolean isUndergoingJobAdvancement(Character chr) {
        if (chr == null) {
            return false;
        }

        int tier = getJobTier(chr.getJob());
        int level = chr.getLevel();

        if (tier == 1 && level >= 30) {
            // 1转玩家正在进行 2转考核
            for (int itemId : SECOND_JOB_ITEM_IDS) {
                if (chr.haveItem(itemId)) {
                    return true;
                }
            }
            for (int qid : SECOND_JOB_QUEST_IDS) {
                if (isQuestStarted(chr, qid)) {
                    return true;
                }
            }
        } else if (tier == 2 && level >= 70) {
            // 2转玩家正在进行 3转考核
            if (chr.gotPartyQuestItem("JB3") || chr.gotPartyQuestItem("JBP") || chr.gotPartyQuestItem("JBQ")) {
                return true;
            }
            for (int itemId : THIRD_JOB_ITEM_IDS) {
                if (chr.haveItem(itemId)) {
                    return true;
                }
            }
            for (int qid : THIRD_JOB_QUEST_IDS) {
                if (isQuestStarted(chr, qid)) {
                    return true;
                }
            }
        } else if (tier == 3 && level >= 120) {
            // 3转玩家正在进行 4转考核
            for (int itemId : FOURTH_JOB_ITEM_IDS) {
                if (chr.haveItem(itemId)) {
                    return true;
                }
            }
            for (int qid : FOURTH_JOB_QUEST_IDS) {
                if (isQuestStarted(chr, qid)) {
                    return true;
                }
            }
        }

        return false;
    }

    private static boolean isQuestStarted(Character chr, int questId) {
        Quest quest = Quest.getInstance(questId);
        if (quest == null) {
            return false;
        }
        QuestStatus status = chr.getQuest(quest);
        return status != null && status.getStatus() == QuestStatus.Status.STARTED;
    }

    /**
     * 获取所有转职任务 ID 集合（只读）
     */
    public static Set<Integer> getJobAdvancementQuestIds() {
        return ALL_JOB_ADVANCEMENT_QUEST_IDS;
    }
}
