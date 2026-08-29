/*
    This file is part of the BeiDou MapleStory Server
*/
package org.gms.server.quest.requirements;

import org.gms.client.Character;
import org.gms.provider.Data;
import org.gms.provider.DataTool;
import org.gms.server.quest.Quest;
import org.gms.server.quest.QuestRequirementType;

public class PartyQuestSRequirement extends AbstractQuestRequirement {
    private int reqCount;

    public PartyQuestSRequirement(Quest quest, Data data) {
        super(QuestRequirementType.PARTY_QUEST_S);
        processData(data);
    }

    @Override
    public void processData(Data data) {
        reqCount = DataTool.getInt(data, 5);
    }

    @Override
    public boolean check(Character chr, Integer npcid) {
        // 在 v83 中，角色完成指定数量的组队任务并取得 S 级评价
        // 尚未达成 5 个 S 级组队任务前返回 false
        return false;
    }

    public int getReqCount() {
        return reqCount;
    }
}
