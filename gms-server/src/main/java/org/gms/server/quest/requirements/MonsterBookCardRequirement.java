package org.gms.server.quest.requirements;

import org.gms.client.Character;
import org.gms.provider.Data;
import org.gms.provider.DataTool;
import org.gms.server.quest.Quest;
import org.gms.server.quest.QuestRequirementType;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 怪物图鉴卡片收集需求（mbcard）
 */
public class MonsterBookCardRequirement extends AbstractQuestRequirement {
    private final Map<Integer, Integer> cards = new LinkedHashMap<>();

    public MonsterBookCardRequirement(Quest quest, Data data) {
        super(QuestRequirementType.MONSTER_BOOK_CARD);
        processData(data);
    }

    @Override
    public void processData(Data data) {
        for (Data cardEntry : data.getChildren()) {
            int cardId = DataTool.getInt(cardEntry.getChildByPath("id"), 0);
            int minLevel = DataTool.getInt(cardEntry.getChildByPath("min"), 1);
            if (cardId > 0) {
                cards.put(cardId, Math.max(1, minLevel));
            }
        }
    }

    @Override
    public boolean check(Character chr, Integer npcid) {
        if (chr == null || chr.getMonsterBook() == null) {
            return false;
        }
        for (Map.Entry<Integer, Integer> entry : cards.entrySet()) {
            int cardId = entry.getKey();
            int minLevel = entry.getValue();
            if (chr.getMonsterBook().getLevelByCard(cardId) < minLevel) {
                return false;
            }
        }
        return true;
    }

    public Map<Integer, Integer> getCards() {
        return Collections.unmodifiableMap(cards);
    }
}
