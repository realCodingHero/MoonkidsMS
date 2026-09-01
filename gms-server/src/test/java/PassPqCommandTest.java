import org.gms.server.partyquest.PartyQuestClearHelper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PassPqCommandTest {

    @Test
    public void testKerningPQPuzzleAndBossStages() {
        // 废弃都市绳子关、平台关、木桶关为谜题关卡
        assertTrue(PartyQuestClearHelper.isPuzzleStage(103000801));
        assertTrue(PartyQuestClearHelper.isPuzzleStage(103000802));
        assertTrue(PartyQuestClearHelper.isPuzzleStage(103000803));
        assertFalse(PartyQuestClearHelper.isBossStage(103000801));

        // 废弃都市绿水灵王关必须被识别为 Boss 关卡
        assertTrue(PartyQuestClearHelper.isBossStage(103000804));
        assertFalse(PartyQuestClearHelper.isPuzzleStage(103000804));
    }

    @Test
    public void testLudiPQStages() {
        // 玩具城算术跳箱子与9箱站位为谜题关
        assertTrue(PartyQuestClearHelper.isPuzzleStage(922010600));
        assertTrue(PartyQuestClearHelper.isPuzzleStage(922010800));
        assertFalse(PartyQuestClearHelper.isBossStage(922010800));

        // 玩具城泥人巨怪为 Boss 关
        assertTrue(PartyQuestClearHelper.isBossStage(922010900));
    }

    @Test
    public void testMagatiaPQStages() {
        // 罗密欧朱丽叶 Stage 1 (密室调查) 与 Stage 3 (烧杯实验) 为谜题关
        assertTrue(PartyQuestClearHelper.isPuzzleStage(926100000));
        assertTrue(PartyQuestClearHelper.isPuzzleStage(926100100));
        assertFalse(PartyQuestClearHelper.isBossStage(926100000));

        // 罗密欧朱丽叶法郎肯斯坦为 Boss 关
        assertTrue(PartyQuestClearHelper.isBossStage(926100203));
    }

    @Test
    public void testBossStagesAcrossPQs() {
        // 天空之城爸爸精灵
        assertTrue(PartyQuestClearHelper.isBossStage(920010800));
        // 罗密欧朱丽叶法郎肯斯坦
        assertTrue(PartyQuestClearHelper.isBossStage(926100203));
        // 海盗老船长
        assertTrue(PartyQuestClearHelper.isBossStage(925100500));
        // 毒雾森林毒藤怪
        assertTrue(PartyQuestClearHelper.isBossStage(930000600));

        // 普通城镇地图不是 Boss 关也不是谜题关
        assertFalse(PartyQuestClearHelper.isBossStage(100000000));
        assertFalse(PartyQuestClearHelper.isPuzzleStage(100000000));
    }
}
