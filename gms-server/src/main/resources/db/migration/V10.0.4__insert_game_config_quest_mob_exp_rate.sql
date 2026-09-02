-- 任务经验是否应用打怪动态浮动倍率
INSERT INTO `game_config`(`config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`, `update_time`)
SELECT 'server', 'Game Mechanics', 'java.lang.Boolean', 'use_quest_mob_exp_rate', 'false', 'use_quest_mob_exp_rate', '2026-09-03 00:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM `game_config` WHERE `config_code` = 'use_quest_mob_exp_rate'
);

-- 中文
INSERT INTO `lang_resources`(`lang_type`, `lang_base`, `lang_code`, `lang_value`, `lang_extend`)
SELECT 'zh-CN', 'game_config', 'use_quest_mob_exp_rate', '任务经验是否应用打怪动态浮动倍率（开启时自动应用exp_rate、quick_level_rate、level_exp_rate等打怪倍率，并使quest_rate失效）', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM `lang_resources` WHERE `lang_type` = 'zh-CN' AND `lang_code` = 'use_quest_mob_exp_rate'
);

-- 英文
INSERT INTO `lang_resources`(`lang_type`, `lang_base`, `lang_code`, `lang_value`, `lang_extend`)
SELECT 'en-US', 'game_config', 'use_quest_mob_exp_rate', 'Whether to apply monster floating exp rates to quest rewards (automatically applies exp_rate, quick_level_rate, level_exp_rate, and disables quest_rate)', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM `lang_resources` WHERE `lang_type` = 'en-US' AND `lang_code` = 'use_quest_mob_exp_rate'
);
