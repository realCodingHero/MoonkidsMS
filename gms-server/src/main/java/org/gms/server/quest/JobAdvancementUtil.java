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

    private static final Set<Integer> JOB_ADVANCEMENT_QUEST_IDS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            // === 冒险家 2转任务 (脚本及 WZ) ===
            100000, 100001, 100002, 100003, 100004, 100005,
            100006, 100007, 100008, 100009, 100010, 100011,
            2191, 2192, 6330, 6370,
            // 希纳斯骑士团 2转任务
            20200, 20201, 20202, 20203, 20204, 20205,
            // 战神 2转任务
            21200, 21201, 21202, 21203,

            // === 冒险家 3转任务 (脚本及 WZ) ===
            100200, 100201, 100202,
            6904, 6914, 6924, 6934, 6944,
            // 希纳斯骑士团 3转任务
            20300, 20301, 20302, 20303, 20304, 20305,
            // 战神 3转任务
            21300, 21301, 21302, 21303,

            // === 冒险家 4转任务 ===
            6900, 6901, 6902, 6903, 6905, // 战士
            6910, 6911, 6912, 6913, 6915, // 魔法师
            6920, 6921, 6922, 6923, 6925, // 弓箭手
            6930, 6931, 6932, 6933, 6935, // 飞侠
            6940, 6941, 6942, 6943, 6945, // 海盗
            // 战神 4转任务
            21400, 21401, 21402, 21403
    )));

    private JobAdvancementUtil() {
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

        for (int qid : JOB_ADVANCEMENT_QUEST_IDS) {
            Quest quest = Quest.getInstance(qid);
            if (quest != null) {
                QuestStatus status = chr.getQuest(quest);
                if (status != null && status.getStatus() == QuestStatus.Status.STARTED) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取所有转职任务 ID 集合（只读）
     */
    public static Set<Integer> getJobAdvancementQuestIds() {
        return JOB_ADVANCEMENT_QUEST_IDS;
    }
}
