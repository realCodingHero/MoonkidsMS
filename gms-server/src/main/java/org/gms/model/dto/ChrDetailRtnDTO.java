package org.gms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChrDetailRtnDTO {
    // 基础信息
    private int id;
    private int accountId;
    private String name;
    private int level;
    private int job;
    private String jobName;
    private int world;
    private String worldName;
    private int channel;
    private int map;
    private int gm;
    private int fame;
    private int gender;
    private boolean online;
    private int guildId;
    private String guildName;
    private int partyId;

    // 基础能力值
    private int str;
    private int dex;
    private int intStat;
    private int luk;
    private int hp;
    private int maxHp;
    private int mp;
    private int maxMp;
    private int ap;
    private int[] sp;

    // 面板综合属性（含装备与 Buff）
    private int totalHp;
    private int totalMp;
    private int totalStr;
    private int totalDex;
    private int totalInt;
    private int totalLuk;
    private int totalWatk;
    private int totalMagic;

    // 个人倍率
    private float expRate;
    private float mesoRate;
    private float dropRate;

    // 经验信息
    private long exp;
    private long nextLevelExp;
    private double expPercent;
    private int gachaExp;

    // 资产与点券
    private long meso;
    private long merchantMeso;
    private int nxCredit;
    private int maplePoint;
    private int nxPrepaid;
}
