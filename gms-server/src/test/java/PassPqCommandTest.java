import org.gms.client.Character;
import org.gms.client.Client;
import org.gms.server.maps.MapleMap;
import org.gms.server.partyquest.PartyQuestClearHelper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

public class PassPqCommandTest {

    @Test
    public void testKerningPQPuzzleStages() {
        Character player = Mockito.mock(Character.class);
        MapleMap map = Mockito.mock(MapleMap.class);
        when(player.getMap()).thenReturn(map);

        // 1. Stage 2 (103000801 绳子关) -> 应该成功破解
        when(player.getMapId()).thenReturn(103000801);
        PartyQuestClearHelper.ClearResult r2 = PartyQuestClearHelper.handlePassPQ(player, false);
        assertEquals(PartyQuestClearHelper.ClearResultType.SUCCESS, r2.getType());
        assertTrue(r2.getMessage().contains("第2阶段"));

        // 2. Stage 3 (103000802 平台关) -> 应该成功破解
        when(player.getMapId()).thenReturn(103000802);
        PartyQuestClearHelper.ClearResult r3 = PartyQuestClearHelper.handlePassPQ(player, false);
        assertEquals(PartyQuestClearHelper.ClearResultType.SUCCESS, r3.getType());
        assertTrue(r3.getMessage().contains("第3阶段"));

        // 3. Stage 4 (103000803 木桶关) -> 应该成功破解
        when(player.getMapId()).thenReturn(103000803);
        PartyQuestClearHelper.ClearResult r4 = PartyQuestClearHelper.handlePassPQ(player, false);
        assertEquals(PartyQuestClearHelper.ClearResultType.SUCCESS, r4.getType());
        assertTrue(r4.getMessage().contains("第4阶段"));
    }

    @Test
    public void testKerningPQBossStageBlockedByDefault() {
        Character player = Mockito.mock(Character.class);
        MapleMap map = Mockito.mock(MapleMap.class);
        when(player.getMap()).thenReturn(map);
        when(player.getMapId()).thenReturn(103000804); // Stage 5 绿水灵王 Boss 关

        // 默认模式：必须精准拦截 Boss 战
        PartyQuestClearHelper.ClearResult normalResult = PartyQuestClearHelper.handlePassPQ(player, false);
        assertEquals(PartyQuestClearHelper.ClearResultType.BOSS_STAGE_BLOCKED, normalResult.getType());
        assertTrue(normalResult.getMessage().contains("超级绿水灵"));
        assertTrue(normalResult.getMessage().contains("!passpq boss"));

        // 强制模式：forceBoss = true 时允许发放
        PartyQuestClearHelper.ClearResult forceResult = PartyQuestClearHelper.handlePassPQ(player, true);
        assertEquals(PartyQuestClearHelper.ClearResultType.SUCCESS, forceResult.getType());
    }

    @Test
    public void testLudiPQBossStageBlockedByDefault() {
        Character player = Mockito.mock(Character.class);
        MapleMap map = Mockito.mock(MapleMap.class);
        when(player.getMap()).thenReturn(map);
        when(player.getMapId()).thenReturn(922010900); // Stage 9 泥人巨怪 Boss 关

        PartyQuestClearHelper.ClearResult normalResult = PartyQuestClearHelper.handlePassPQ(player, false);
        assertEquals(PartyQuestClearHelper.ClearResultType.BOSS_STAGE_BLOCKED, normalResult.getType());
        assertTrue(normalResult.getMessage().contains("泥人巨怪"));

        PartyQuestClearHelper.ClearResult forceResult = PartyQuestClearHelper.handlePassPQ(player, true);
        assertEquals(PartyQuestClearHelper.ClearResultType.SUCCESS, forceResult.getType());
    }

    @Test
    public void testNonPQMapReturnsNotInPQ() {
        Character player = Mockito.mock(Character.class);
        MapleMap map = Mockito.mock(MapleMap.class);
        when(player.getMap()).thenReturn(map);
        when(player.getMapId()).thenReturn(100000000); // 射手村

        PartyQuestClearHelper.ClearResult result = PartyQuestClearHelper.handlePassPQ(player, false);
        assertEquals(PartyQuestClearHelper.ClearResultType.NOT_IN_PQ, result.getType());
    }
}
