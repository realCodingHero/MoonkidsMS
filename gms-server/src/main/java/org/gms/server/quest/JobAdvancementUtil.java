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
 */
public final class JobAdvancementUtil {

    // 希纳斯骑士团 2转任务 ID
    private static final Set<Integer> CYGNUS_2ND_QUESTS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            20200, 20201, 20202, 20203, 20204, 20205
    )));

    // 希纳斯骑士团 3转任务 ID
    private static final Set<Integer> CYGNUS_3RD_QUESTS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            20300, 20301, 20302, 20303, 20304, 20305
    )));

    // 战神 2转任务 ID
    private static final Set<Integer> ARAN_2ND_QUESTS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            21200, 21201, 21202, 21203
    )));

    // 战神 3转任务 ID
    private static final Set<Integer> ARAN_3RD_QUESTS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            21300, 21301, 21302, 21303
    )));

    // 战神 4转任务 ID
    private static final Set<Integer> ARAN_4TH_QUESTS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            21400, 21401, 21402, 21403
    )));

    // 冒险家 4转任务 ID (6900~6945)
    private static final Set<Integer> ADVENTURER_4TH_QUESTS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            6900, 6901, 6902, 6903, 6905, // 战士
            6910, 6911, 6912, 6913, 6915, // 魔法师
            6920, 6921, 6922, 6923, 6925, // 弓箭手
            6930, 6931, 6932, 6933, 6935, // 飞侠
            6940, 6941, 6942, 6943, 6945  // 海盗
    )));

    // 汇总所有转职任务 ID
    private static final Set<Integer> ALL_JOB_QUEST_IDS;
    static {
        Set<Integer> all = new HashSet<>();
        all.addAll(CYGNUS_2ND_QUESTS);
        all.addAll(CYGNUS_3RD_QUESTS);
        all.addAll(ARAN_2ND_QUESTS);
        all.addAll(ARAN_3RD_QUESTS);
        all.addAll(ARAN_4TH_QUESTS);
        all.addAll(ADVENTURER_4TH_QUESTS);
        all.addAll(Arrays.asList(2191, 2192, 6330, 6370, 6904, 6914, 6924, 6934, 6944));
        ALL_JOB_QUEST_IDS = Collections.unmodifiableSet(all);
    }

    private JobAdvancementUtil() {
    }

    private static boolean isQuestStarted(Character chr, int qid) {
        Quest quest = Quest.getInstance(qid);
        if (quest != null) {
            QuestStatus status = chr.getQuestNoAdd(quest);
            return status != null && status.getStatus() == QuestStatus.Status.STARTED;
        }
        return false;
    }

    private static boolean hasAnyQuestStarted(Character chr, Set<Integer> questIds) {
        for (int qid : questIds) {
            if (isQuestStarted(chr, qid)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断当前角色是否正在进行 2转、3转、4转 任务
     *
     * @param chr 角色实例
     * @return 若角色正处于转职任务中则返回 true，否则返回 false
     */
    public static boolean isUndergoingJobAdvancement(Character chr) {
        if (chr == null) {
            return false;
        }

        int jobId = chr.getJobId();
        int level = chr.getLevel();

        // 1. 希纳斯骑士团 (1100~1512)
        if (jobId >= 1100 && jobId <= 1512) {
            if (level >= 30 && jobId % 100 == 0) { // 1100, 1200, 1300, 1400, 1500 (1转阶段，进行2转)
                return hasAnyQuestStarted(chr, CYGNUS_2ND_QUESTS);
            }
            if (level >= 70 && jobId % 100 == 10) { // 1110, 1210, 1310, 1410, 1510 (2转阶段，进行3转)
                return hasAnyQuestStarted(chr, CYGNUS_3RD_QUESTS);
            }
            return false;
        }

        // 2. 战神 (2000~2112)
        if (jobId >= 2000 && jobId <= 2112) {
            if (level >= 30 && jobId == 2100) { // 1转阶段，进行2转
                return hasAnyQuestStarted(chr, ARAN_2ND_QUESTS);
            }
            if (level >= 70 && jobId == 2110) { // 2转阶段，进行3转
                return hasAnyQuestStarted(chr, ARAN_3RD_QUESTS);
            }
            if (level >= 120 && jobId == 2111) { // 3转阶段，进行4转
                return hasAnyQuestStarted(chr, ARAN_4TH_QUESTS);
            }
            return false;
        }

        // 3. 冒险家 (五大系)
        // 二转阶段判定：1转职业 (100, 200, 300, 400, 500) 且 等级 >= 30
        if (level >= 30 && (jobId == 100 || jobId == 200 || jobId == 300 || jobId == 400 || jobId == 500)) {
            // 拥有导师信件、黑珠、英雄证书等转职道具
            if (chr.haveItem(4031008) || chr.haveItem(4031009) || chr.haveItem(4031010) ||
                chr.haveItem(4031011) || chr.haveItem(4031012) || chr.haveItem(4031013) ||
                chr.haveItem(4031856) || chr.haveItem(4031857)) {
                return true;
            }
            if (isQuestStarted(chr, 2191) || isQuestStarted(chr, 2192) ||
                isQuestStarted(chr, 6330) || isQuestStarted(chr, 6370)) {
                return true;
            }
        }

        // 三转阶段判定：2转职业 (110..520, jobId % 10 == 0) 且 等级 >= 70
        // (注：已完成三转的角色 jobId % 10 == 1，如祭司 231、勇士 111，不会被判定为三转中)
        if (level >= 70 && jobId >= 110 && jobId <= 520 && (jobId % 10 == 0)) {
            if (chr.gotPartyQuestItem("JB3") || chr.gotPartyQuestItem("JBP") || chr.gotPartyQuestItem("JBQ")) {
                return true;
            }
            if (chr.haveItem(4031057) || chr.haveItem(4031059) || chr.haveItem(4031058)) {
                return true;
            }
            if (isQuestStarted(chr, 6904) || isQuestStarted(chr, 6914) ||
                isQuestStarted(chr, 6924) || isQuestStarted(chr, 6934) || isQuestStarted(chr, 6944)) {
                return true;
            }
        }

        // 四转阶段判定：3转职业 (111..521, jobId % 10 == 1) 且 等级 >= 120
        // (注：已完成四转的角色 jobId % 10 == 2，如主教 232、英雄 112，不会被判定为四转中)
        if (level >= 120 && jobId >= 111 && jobId <= 521 && (jobId % 10 == 1)) {
            if (hasAnyQuestStarted(chr, ADVENTURER_4TH_QUESTS)) {
                return true;
            }
            if (chr.haveItem(4031343) || chr.haveItem(4031344) || chr.haveItem(4031531)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 获取所有转职任务 ID 集合（只读）
     */
    public static Set<Integer> getJobAdvancementQuestIds() {
        return ALL_JOB_QUEST_IDS;
    }
}
