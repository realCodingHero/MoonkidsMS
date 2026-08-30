<template>
  <a-modal
    v-model:visible="visible"
    :title="modalTitle"
    :width="920"
    :mask-closable="false"
    :esc-to-close="false"
    :footer="false"
    unmount-on-close
    @cancel="handleClose"
  >
    <div class="player-detail-container">
      <!-- 头部状态栏与控制 -->
      <a-card :bordered="false" class="header-card" size="small">
        <div class="header-content">
          <a-space wrap align="center">
            <a-tag color="arcoblue" size="large">
              ID: {{ detailData?.id ?? characterId }}
            </a-tag>
            <span class="player-name">{{ detailData?.name ?? characterName }}</span>
            <a-tag v-if="detailData?.online" color="green">
              <template #icon><icon-check-circle-fill /></template>
              {{ $t('account.player.detail.status.online') }}
            </a-tag>
            <a-tag v-else color="gray">
              <template #icon><icon-close-circle-fill /></template>
              {{ $t('account.player.detail.status.offline') }}
            </a-tag>
            <a-tag v-if="detailData && detailData.gm > 0" color="red">
              GM Lv.{{ detailData.gm }}
            </a-tag>
            <a-tag color="purple">
              {{ detailData?.jobName || $t('account.player.job') }}
            </a-tag>
            <a-tag color="cyan">
              {{ detailData?.worldName }}
              <template v-if="detailData && detailData.channel >= 0">
                / {{ $t('account.player.detail.channel') }} {{ detailData.channel }}
              </template>
            </a-tag>
            <a-tag color="orangered">
              {{ $t('account.player.mapId') }}: {{ detailData?.map }}
            </a-tag>
          </a-space>

          <div class="sync-controls">
            <a-space align="center">
              <a-badge
                :status="isPolling ? 'processing' : 'normal'"
                :color="isPolling ? '#52c41a' : '#86909c'"
                :text="isPolling ? $t('account.player.detail.polling') : $t('account.player.detail.paused')"
              />
              <a-switch
                v-model="isPolling"
                size="small"
                @change="handlePollingToggle"
              />
              <a-button
                type="text"
                size="mini"
                :loading="loading"
                @click="() => loadData(true)"
              >
                <template #icon>
                  <icon-refresh />
                </template>
              </a-button>
            </a-space>
          </div>
        </div>
      </a-card>

      <!-- 经验值进度条 -->
      <a-card
        :title="$t('account.player.detail.expPercent')"
        size="small"
        class="section-card"
        style="margin-top: 12px"
      >
        <div class="exp-info">
          <div class="exp-label">
            <span class="level-badge">Lv.{{ detailData?.level ?? 1 }}</span>
            <span class="exp-values">
              {{ $t('account.player.detail.exp') }}:
              <strong>{{ formatNumber(detailData?.exp) }}</strong> /
              {{ formatNumber(detailData?.nextLevelExp) }}
            </span>
          </div>
          <span class="exp-percent">{{ detailData?.expPercent ?? 0 }}%</span>
        </div>
        <a-progress
          :percent="getExpRatio(detailData?.expPercent)"
          :status="detailData && detailData.level >= 200 ? 'success' : 'normal'"
          :show-text="false"
          :stroke-width="12"
          color="#165DFF"
        />
      </a-card>

      <!-- 核心信息卡片网格 -->
      <a-row :gutter="[12, 12]" style="margin-top: 12px">
        <!-- 资产与点券 -->
        <a-col :span="12">
          <a-card
            :title="$t('account.player.detail.currency')"
            size="small"
            class="section-card h-100"
          >
            <a-descriptions :column="2" layout="horizontal" bordered size="small">
              <a-descriptions-item :label="$t('account.player.detail.meso')">
                <span class="currency-meso">{{ formatNumber(detailData?.meso) }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.merchantMeso')">
                <span>{{ formatNumber(detailData?.merchantMeso) }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.nxCredit')">
                <span class="currency-point">{{ formatNumber(detailData?.nxCredit) }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.maplePoint')">
                <span class="currency-point">{{ formatNumber(detailData?.maplePoint) }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.nxPrepaid')" :span="2">
                <span>{{ formatNumber(detailData?.nxPrepaid) }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <!-- 倍率与社交 -->
        <a-col :span="12">
          <a-card
            :title="$t('account.player.detail.ratesAndSocial')"
            size="small"
            class="section-card h-100"
          >
            <a-descriptions :column="2" layout="horizontal" bordered size="small">
              <a-descriptions-item :label="$t('account.player.detail.expRate')">
                <a-tag color="blue">{{ detailData?.expRate ?? 1 }}x</a-tag>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.mesoRate')">
                <a-tag color="gold">{{ detailData?.mesoRate ?? 1 }}x</a-tag>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.dropRate')">
                <a-tag color="cyan">{{ detailData?.dropRate ?? 1 }}x</a-tag>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.fame')">
                <span>{{ detailData?.fame ?? 0 }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.guild')">
                <span>{{ detailData?.guildName || $t('account.player.detail.none') }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.party')">
                <span>{{ detailData && detailData.partyId > 0 ? `#${detailData.partyId}` : $t('account.player.detail.none') }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <!-- 基础能力值 -->
        <a-col :span="12">
          <a-card
            :title="$t('account.player.detail.baseStats')"
            size="small"
            class="section-card h-100"
          >
            <a-descriptions :column="2" layout="horizontal" bordered size="small">
              <a-descriptions-item :label="$t('account.player.detail.str')">
                <strong>{{ detailData?.str ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.dex')">
                <strong>{{ detailData?.dex ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.int')">
                <strong>{{ detailData?.intStat ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.luk')">
                <strong>{{ detailData?.luk ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.hp')">
                <span class="hp-text">{{ detailData?.hp ?? 0 }} / {{ detailData?.maxHp ?? 0 }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.mp')">
                <span class="mp-text">{{ detailData?.mp ?? 0 }} / {{ detailData?.maxMp ?? 0 }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.ap')">
                <a-tag color="green">{{ detailData?.ap ?? 0 }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.sp')">
                <span>{{ formatSp(detailData?.sp) }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <!-- 面板综合属性 (含装备与Buff) -->
        <a-col :span="12">
          <a-card
            :title="$t('account.player.detail.totalStats')"
            size="small"
            class="section-card h-100"
          >
            <a-descriptions :column="2" layout="horizontal" bordered size="small">
              <a-descriptions-item :label="$t('account.player.detail.totalStr')">
                <strong class="total-stat">{{ detailData?.totalStr ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.totalDex')">
                <strong class="total-stat">{{ detailData?.totalDex ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.totalInt')">
                <strong class="total-stat">{{ detailData?.totalInt ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.totalLuk')">
                <strong class="total-stat">{{ detailData?.totalLuk ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.totalHp')">
                <span class="hp-text">{{ detailData?.totalHp ?? 0 }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.totalMp')">
                <span class="mp-text">{{ detailData?.totalMp ?? 0 }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.totalWatk')">
                <strong class="watk-text">{{ detailData?.totalWatk ?? 0 }}</strong>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('account.player.detail.totalMagic')">
                <strong class="matk-text">{{ detailData?.totalMagic ?? 0 }}</strong>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, onUnmounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { CharacterDetail, getCharacterDetail } from '@/api/character';

  const { t } = useI18n();
  const visible = ref(false);
  const loading = ref(false);
  const isPolling = ref(true);
  const characterId = ref(0);
  const characterName = ref('');
  const detailData = ref<CharacterDetail | null>(null);
  let timer: ReturnType<typeof setInterval> | null = null;

  const modalTitle = computed(() => {
    return `${t('account.player.detail.title')} [${characterId.value}] ${characterName.value}`;
  });

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  const getExpRatio = (percent?: number) => {
    if (!percent || percent <= 0) return 0;
    if (percent >= 100) return 1;
    return percent / 100;
  };

  const formatSp = (sp?: number[]) => {
    if (!sp || !sp.length) return '0';
    const nonZero = sp.filter((v) => v > 0);
    return nonZero.length ? nonZero.join(' / ') : '0';
  };

  const startPolling = () => {
    stopPolling();
    if (isPolling.value) {
      timer = setInterval(() => {
        loadData(false);
      }, 1000);
    }
  };

  const stopPolling = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const handlePollingToggle = (val: boolean | string | number) => {
    if (val) {
      startPolling();
    } else {
      stopPolling();
    }
  };

  const loadData = async (showLoading = true) => {
    if (showLoading && !detailData.value) {
      loading.value = true;
    }
    try {
      const { data } = await getCharacterDetail(characterId.value);
      detailData.value = data;
    } catch {
      // 保持界面当前数据
    } finally {
      loading.value = false;
    }
  };

  const init = (id: number, name: string) => {
    characterId.value = id;
    characterName.value = name;
    detailData.value = null;
    isPolling.value = true;
    visible.value = true;
    loadData(true);
    startPolling();
  };

  const handleClose = () => {
    stopPolling();
    visible.value = false;
  };

  onUnmounted(() => {
    stopPolling();
  });

  defineExpose({ init });
</script>

<script lang="ts">
  export default {
    name: 'PlayerDetailModal',
  };
</script>

<style scoped lang="less">
  .player-detail-container {
    padding: 4px 0;
  }

  .header-card {
    background-color: var(--color-fill-2);
    border-radius: 6px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .player-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .section-card {
    border-radius: 6px;
    background-color: var(--color-bg-2);
  }

  .h-100 {
    height: 100%;
  }

  .exp-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .level-badge {
    font-weight: 700;
    color: #165dff;
    margin-right: 8px;
    font-size: 14px;
  }

  .exp-values {
    color: var(--color-text-2);
    font-size: 13px;
  }

  .exp-percent {
    font-weight: 700;
    color: #165dff;
    font-size: 14px;
  }

  .currency-meso {
    font-weight: 600;
    color: #d46b08;
  }

  .currency-point {
    font-weight: 600;
    color: #165dff;
  }

  .hp-text {
    color: #f53f3f;
    font-weight: 600;
  }

  .mp-text {
    color: #165dff;
    font-weight: 600;
  }

  .total-stat {
    color: #722ed1;
  }

  .watk-text {
    color: #eb2f96;
  }

  .matk-text {
    color: #13c2c2;
  }
</style>
