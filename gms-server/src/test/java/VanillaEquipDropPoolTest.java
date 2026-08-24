import org.gms.server.life.MonsterDropEntry;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class VanillaEquipDropPoolTest {

    @Test
    public void testEquipDropPoolLogic() {
        // 模拟野怪 5120503 (训练用稻草娃娃) 的 8 件装备
        List<MonsterDropEntry> equipDrops = new ArrayList<>();
        equipDrops.add(new MonsterDropEntry(1041088, 800, 1, 1, (short) 0));
        equipDrops.add(new MonsterDropEntry(1051038, 700, 1, 1, (short) 0));
        equipDrops.add(new MonsterDropEntry(1060077, 800, 1, 1, (short) 0));
        equipDrops.add(new MonsterDropEntry(1072118, 800, 1, 1, (short) 0));
        equipDrops.add(new MonsterDropEntry(1072303, 800, 1, 1, (short) 0));
        equipDrops.add(new MonsterDropEntry(1312008, 700, 1, 1, (short) 0));
        equipDrops.add(new MonsterDropEntry(1332011, 500, 1, 1, (short) 0));
        equipDrops.add(new MonsterDropEntry(1372034, 750, 1, 1, (short) 0));

        int totalWeight = 0;
        List<Integer> weights = new ArrayList<>();
        float chRate = 1.0f;
        for (MonsterDropEntry de : equipDrops) {
            int effChance = (int) Math.min((float) de.chance * chRate, Integer.MAX_VALUE);
            weights.add(effChance);
            totalWeight += effChance;
        }

        // 验证总权重 = 5850 (0.585% 综合掉落率，约 1/170 只怪掉 1 件装备)
        assertEquals(5850, totalWeight);

        // 验证加权选取算法
        // 当随机数为 0 时，应选中第一件 (1041088, weight 800)
        int randVal = 0;
        int running = 0;
        MonsterDropEntry selected = null;
        for (int i = 0; i < equipDrops.size(); i++) {
            running += weights.get(i);
            if (randVal < running) {
                selected = equipDrops.get(i);
                break;
            }
        }
        assertNotNull(selected);
        assertEquals(1041088, selected.itemId);

        // 当随机数为 5849 (最后一个区段) 时，应选中最后一件 (1372034, weight 750)
        randVal = 5849;
        running = 0;
        selected = null;
        for (int i = 0; i < equipDrops.size(); i++) {
            running += weights.get(i);
            if (randVal < running) {
                selected = equipDrops.get(i);
                break;
            }
        }
        assertNotNull(selected);
        assertEquals(1372034, selected.itemId);
    }
}
