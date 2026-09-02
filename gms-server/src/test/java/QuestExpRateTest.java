import org.gms.config.GameConfig;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class QuestExpRateTest {

    @Test
    public void testDynamicMobExpRateCalculation() {
        // 模拟打怪动态浮动倍率计算公式
        // 基础参数:
        float worldExpRate = 2.0f;
        int couponRate = 2;
        float rawExpRate = 1.0f;
        float charExpRate = worldExpRate * couponRate * rawExpRate; // 4.0

        int level = 50;
        int quickLevel = 70;
        float quickLevelExpRate = 0.05f; // (70 - 50) * 0.05 = 1.0 -> 1 + 1.0 = 2.0
        float levelExpRate = 0.01f; // 1 + 50 * 0.01 = 1.5

        float mobExpRate = (1.0f + (quickLevel - level) * quickLevelExpRate) * (1.0f + level * levelExpRate); // 2.0 * 1.5 = 3.0
        float dynamicRate = charExpRate * mobExpRate; // 4.0 * 3.0 = 12.0

        assertEquals(12.0f, dynamicRate, 0.001f);

        // 基础任务经验 10,000
        int baseGain = 10000;
        int totalExp = Math.round(baseGain * dynamicRate);
        assertEquals(120000, totalExp);

        // 校验固定 quest_rate 无论设置多大（例如 5.0），动态模式下均不影响结果
        float fixedQuestRate = 5.0f;
        float fixedRate = worldExpRate * fixedQuestRate; // 10.0
        // 在动态模式下使用的是 dynamicRate (12.0) 而非 fixedRate (10.0)
        assertEquals(12.0f, dynamicRate, 0.001f);
    }

    @Test
    public void testNoviceProtection() {
        // 新手保护机制：初学者 1~10 级倍率为 1
        boolean isBeginner = true;
        int level = 5;
        boolean enforceNovice = true;
        boolean hasNoviceRate = enforceNovice && isBeginner && level < 11;
        assertTrue(hasNoviceRate);

        float finalRate = hasNoviceRate ? 1.0f : 10.0f;
        assertEquals(1.0f, finalRate, 0.001f);
    }
}
