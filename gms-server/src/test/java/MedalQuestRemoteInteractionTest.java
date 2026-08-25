import org.gms.net.server.channel.handlers.QuestActionHandler;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MedalQuestRemoteInteractionTest {

    @Test
    public void testRemoteNpcRecognition() {
        // 达利尔 (9000040), 9000066, 9000057 等勋章 NPC 应被识别为远程 NPC
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9000040));
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9000066));
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9000057));
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9000058));
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9000059));

        // 冒险岛管理员与常用服务 NPC
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9010000)); // MAPLE_ADMINISTRATOR
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9900000));
        assertTrue(QuestActionHandler.isRemoteQuest(null, 9000000));

        // 普通野外地图专属 NPC (例如 1022000 武术教练) 不应被无条件识别为远程 NPC
        assertFalse(QuestActionHandler.isRemoteQuest(null, 1022000));
    }
}
