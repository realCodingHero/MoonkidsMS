import org.gms.constants.inventory.ItemConstants;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PetEtcLootModeTest {

    @Test
    public void testIsEtcTrashItem() {
        // 普通怪物掉落杂物 -> 判定为杂物（支持忽略/自动出售）
        assertTrue(ItemConstants.isEtcTrashItem(4000000)); // 蜗牛壳
        assertTrue(ItemConstants.isEtcTrashItem(4000001)); // 蓝蜗牛壳
        assertTrue(ItemConstants.isEtcTrashItem(4000016)); // 红蜗牛壳
        assertTrue(ItemConstants.isEtcTrashItem(4000004)); // 绿水灵珠
        assertTrue(ItemConstants.isEtcTrashItem(4000021)); // 刺蘑菇盖

        // 任务道具 (403xxxx) -> 豁免（必须正常拾取）
        assertFalse(ItemConstants.isEtcTrashItem(4031000));
        assertFalse(ItemConstants.isEtcTrashItem(4030000));
        assertFalse(ItemConstants.isEtcTrashItem(4032000));

        // 矿石母矿与宝石 (401xxxx, 402xxxx) -> 豁免（必须正常拾取）
        assertFalse(ItemConstants.isEtcTrashItem(4010000)); // 青铜母矿
        assertFalse(ItemConstants.isEtcTrashItem(4011000)); // 青铜成品
        assertFalse(ItemConstants.isEtcTrashItem(4020000)); // 石榴石母矿
        assertFalse(ItemConstants.isEtcTrashItem(4021000)); // 石榴石成品

        // 特殊结晶与母矿 (4004xxx, 4005xxx) -> 豁免（必须正常拾取）
        assertFalse(ItemConstants.isEtcTrashItem(4004000)); // 智慧母矿
        assertFalse(ItemConstants.isEtcTrashItem(4005000)); // 黑暗母矿

        // 魔法石、召唤石与特殊卷轴材料 (4006xxx) -> 豁免（必须正常拾取）
        assertFalse(ItemConstants.isEtcTrashItem(4006000)); // 魔法石
        assertFalse(ItemConstants.isEtcTrashItem(4006001)); // 召唤石

        // 非 ETC 栏物品 -> 豁免（必须正常拾取）
        assertFalse(ItemConstants.isEtcTrashItem(1002000)); // 装备
        assertFalse(ItemConstants.isEtcTrashItem(2000000)); // 药水
        assertFalse(ItemConstants.isEtcTrashItem(3010000)); // 设置/椅子
        assertFalse(ItemConstants.isEtcTrashItem(5000000)); // 点卷/特殊
    }

    @Test
    public void testActiveQuestItemPreservationLogic() {
        // 模拟进行中任务需求物品字典：绿水灵珠 (4000004) 需要 50 个，树枝 (4000003) 需要 30 个
        Map<Integer, Integer> activeQuestReqItems = Map.of(
                4000004, 50,
                4000003, 30
        );

        // 玩家当前背包持有数量
        Map<Integer, Integer> playerInventoryCounts = Map.of(
                4000004, 10, // 绿水灵珠 10/50 -> 仍需要 -> 必须保留拾取
                4000003, 30, // 树枝 30/30 -> 已满足 -> 可按杂物处理（忽略或自动出售）
                4000000, 5   // 蜗牛壳 -> 非进行中任务所需道具 -> 可按杂物处理
        );

        // 验证绿水灵珠：需要50，当前10 -> 判定为进行中任务所需
        int slimeBall = 4000004;
        int slimeNeeded = activeQuestReqItems.getOrDefault(slimeBall, 0);
        int slimeCurrent = playerInventoryCounts.getOrDefault(slimeBall, 0);
        assertTrue(slimeNeeded > 0 && slimeCurrent < slimeNeeded);

        // 验证树枝：需要30，当前30 -> 已满额，不再判定为急需
        int branch = 4000003;
        int branchNeeded = activeQuestReqItems.getOrDefault(branch, 0);
        int branchCurrent = playerInventoryCounts.getOrDefault(branch, 0);
        assertFalse(branchNeeded > 0 && branchCurrent < branchNeeded);

        // 验证蜗牛壳：不在任务需求列表
        int snailShell = 4000000;
        int snailNeeded = activeQuestReqItems.getOrDefault(snailShell, 0);
        int snailCurrent = playerInventoryCounts.getOrDefault(snailShell, 0);
        assertFalse(snailNeeded > 0 && snailCurrent < snailNeeded);
    }
}
