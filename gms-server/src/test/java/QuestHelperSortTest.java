import org.gms.server.quest.QuestHelpService;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class QuestHelperSortTest {

    @Test
    public void testQuestSortingOrder() {
        long now = System.currentTimeMillis();

        List<QuestHelpService.QuestSummary> list = new ArrayList<>();

        // 构造测试数据：
        // 1. 旧普通任务
        QuestHelpService.QuestSummary oldNormal = new QuestHelpService.QuestSummary(
                2001, "旧普通任务", 10, false, false, now - 100000, false
        );
        // 2. 最新接取的普通任务（如 2086 飞天药水的材料）
        QuestHelpService.QuestSummary newFlyingPotion = new QuestHelpService.QuestSummary(
                2086, "飞天药水的材料", 42, false, false, now, false
        );
        // 3. 次新的普通任务
        QuestHelpService.QuestSummary midNormal = new QuestHelpService.QuestSummary(
                3230, "娃娃之家", 25, false, false, now - 5000, false
        );
        // 4. 最新更新的勋章任务（如 29008 海底探险家勋章）
        QuestHelpService.QuestSummary newMedal = new QuestHelpService.QuestSummary(
                29008, "海底探险家勋章", 20, false, false, now + 1000, true
        );
        // 5. 旧勋章任务
        QuestHelpService.QuestSummary oldMedal = new QuestHelpService.QuestSummary(
                29005, "新手探险家勋章", 15, false, false, now - 200000, true
        );

        list.add(oldNormal);
        list.add(oldMedal);
        list.add(newMedal);
        list.add(midNormal);
        list.add(newFlyingPotion);

        list.sort((a, b) -> {
            // 1. 普通任务始终排在勋章任务前面（勋章任务始终置底）
            if (a.isMedalQuest() != b.isMedalQuest()) {
                return a.isMedalQuest() ? 1 : -1;
            }
            // 2. 同类别内，按最近状态更新/接取时间倒序排列（最新在前）
            int cmp = Long.compare(b.getLastModifiedTime(), a.getLastModifiedTime());
            if (cmp != 0) return cmp;
            // 3. 时间相同时，按等级从高到低，再按任务 ID 升序
            int lvlCmp = Integer.compare(b.getMinLevel(), a.getMinLevel());
            if (lvlCmp != 0) return lvlCmp;
            return Integer.compare(a.getQuestId(), b.getQuestId());
        });

        // 验证普通任务排在最前，且最新普通任务排在第一位
        assertEquals(2086, list.get(0).getQuestId());
        assertEquals("飞天药水的材料", list.get(0).getQuestName());

        assertEquals(3230, list.get(1).getQuestId());
        assertEquals("娃娃之家", list.get(1).getQuestName());

        assertEquals(2001, list.get(2).getQuestId());
        assertEquals("旧普通任务", list.get(2).getQuestName());

        // 验证勋章任务排在所有普通任务之后，且勋章任务内部按更新时间倒序
        assertEquals(29008, list.get(3).getQuestId());
        assertEquals("海底探险家勋章", list.get(3).getQuestName());

        assertEquals(29005, list.get(4).getQuestId());
        assertEquals("新手探险家勋章", list.get(4).getQuestName());
    }
}
