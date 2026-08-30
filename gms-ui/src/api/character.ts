import axios from 'axios';

export interface CharacterListItem {
  id: number;
  name: string;
  job: number;
  jobName: string;
  level: number;
  world: number;
  worldName: string;
  gm: number;
  meso: number;
  fame: number;
  guildid: number;
  createdate: string;
  lastLogoutTime: string;
  online: boolean;
}

export interface CharacterDetail {
  id: number;
  accountId: number;
  name: string;
  level: number;
  job: number;
  jobName: string;
  world: number;
  worldName: string;
  channel: number;
  map: number;
  gm: number;
  fame: number;
  gender: number;
  online: boolean;
  guildId: number;
  guildName: string;
  partyId: number;

  // 基础能力值
  str: number;
  dex: number;
  intStat: number;
  luk: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  ap: number;
  sp: number[];

  // 面板综合属性
  totalHp: number;
  totalMp: number;
  totalStr: number;
  totalDex: number;
  totalInt: number;
  totalLuk: number;
  totalWatk: number;
  totalMagic: number;

  // 个人倍率
  expRate: number;
  mesoRate: number;
  dropRate: number;

  // 经验信息
  exp: number;
  nextLevelExp: number;
  expPercent: number;
  gachaExp: number;

  // 资产与点券
  meso: number;
  merchantMeso: number;
  nxCredit: number;
  maplePoint: number;
  nxPrepaid: number;
}

export function getAccountCharacters(accountId: number) {
  return axios.get<CharacterListItem[]>(`/character/v1/account/${accountId}`);
}

export function getCharacterDetail(cid: number) {
  return axios.get<CharacterDetail>(`/character/v1/detail/${cid}`);
}

export function deleteCharacter(cid: number) {
  return axios.delete(`/character/v1/${cid}`);
}

