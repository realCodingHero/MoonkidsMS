package org.gms.service;

import com.mybatisflex.core.query.QueryWrapper;
import lombok.AllArgsConstructor;
import org.gms.client.QuestStatus;
import org.gms.dao.entity.MedalmapsDO;
import org.gms.dao.entity.QuestprogressDO;
import org.gms.dao.entity.QueststatusDO;
import org.gms.dao.mapper.MedalmapsMapper;
import org.gms.dao.mapper.QuestprogressMapper;
import org.gms.dao.mapper.QueststatusMapper;
import org.gms.server.quest.Quest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import static org.gms.dao.entity.table.MedalmapsDOTableDef.MEDALMAPS_D_O;
import static org.gms.dao.entity.table.QuestprogressDOTableDef.QUESTPROGRESS_D_O;
import static org.gms.dao.entity.table.QueststatusDOTableDef.QUESTSTATUS_D_O;

@Service
@AllArgsConstructor
public class QuestService {
    private final MedalmapsMapper medalmapsMapper;
    private final QuestprogressMapper questprogressMapper;
    private final QueststatusMapper queststatusMapper;

    @Transactional(rollbackFor = Exception.class)
    public void deleteQuestProgressByCharacter(int cid) {
        medalmapsMapper.deleteByQuery(QueryWrapper.create().where(MEDALMAPS_D_O.CHARACTERID.eq(cid)));
        questprogressMapper.deleteByQuery(QueryWrapper.create().where(QUESTPROGRESS_D_O.CHARACTERID.eq(cid)));
        queststatusMapper.deleteByQuery(QueryWrapper.create().where(QUESTSTATUS_D_O.CHARACTERID.eq(cid)));
    }

    public List<QuestStatus> getQuestStatusByCharacter(int cid) {
        List<QueststatusDO> queststatusDOList = queststatusMapper.selectListByQuery(QueryWrapper.create().where(QUESTSTATUS_D_O.CHARACTERID.eq(cid)));
        List<QuestprogressDO> questprogressDOList = questprogressMapper.selectListByQuery(QueryWrapper.create().where(QUESTPROGRESS_D_O.CHARACTERID.eq(cid)));
        List<MedalmapsDO> medalmapsDOList = medalmapsMapper.selectListByQuery(QueryWrapper.create().where(MEDALMAPS_D_O.CHARACTERID.eq(cid)));

        return queststatusDOList.stream().map(queststatusDO -> {
            Quest quest = Quest.getInstance(queststatusDO.getQuest());
            QuestStatus questStatus = new QuestStatus(quest, QuestStatus.Status.getById(queststatusDO.getStatus()));
            long completionTimeMillis = (queststatusDO.getTime() != null && queststatusDO.getTime() > -1) ? TimeUnit.SECONDS.toMillis(queststatusDO.getTime()) : 0L;
            if (completionTimeMillis > 0) {
                questStatus.setCompletionTime(completionTimeMillis);
            }
            if (queststatusDO.getExpires() != null && queststatusDO.getExpires() > 0) {
                questStatus.setExpirationTime(queststatusDO.getExpires());
            }
            if (queststatusDO.getForfeited() != null) {
                questStatus.setForfeited(queststatusDO.getForfeited());
            }
            if (queststatusDO.getCompleted() != null) {
                questStatus.setCompleted(queststatusDO.getCompleted());
            }
            questprogressDOList.stream()
                    .filter(questprogressDO -> Objects.equals(queststatusDO.getQueststatusid(), questprogressDO.getQueststatusid()))
                    .forEach(questprogressDO -> questStatus.setProgress(questprogressDO.getProgressid(),  questprogressDO.getProgress()));
            medalmapsDOList.stream()
                    .filter(medalmapsDO -> Objects.equals(queststatusDO.getQueststatusid(), medalmapsDO.getQueststatusid()))
                    .forEach(medalmapsDO -> questStatus.addMedalMap(medalmapsDO.getMapid()));

            // 关键：在填充完 progress 和 medalMaps 后恢复真实历史时间戳，避免被 setProgress 覆写为当前登录时间
            long lastModified = completionTimeMillis > 0 ? completionTimeMillis : (queststatusDO.getQueststatusid() != null ? queststatusDO.getQueststatusid() * 1000L : 0L);
            questStatus.setLastModifiedTime(lastModified);

            return questStatus;
        }).toList();
    }
}
