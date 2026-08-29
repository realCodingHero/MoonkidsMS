-- 将大区 0 默认启动频道数扩展为 20 频
UPDATE game_config
SET config_value = '20'
WHERE config_type = 'world'
  AND config_code = 'channel_size'
  AND config_sub_type = '0';
