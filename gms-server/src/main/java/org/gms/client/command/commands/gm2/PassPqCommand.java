package org.gms.client.command.commands.gm2;

import org.gms.client.Character;
import org.gms.client.Client;
import org.gms.client.command.Command;
import org.gms.server.partyquest.PartyQuestClearHelper;
import org.gms.util.I18nUtil;

public class PassPqCommand extends Command {
    {
        setDescription("一键发放当前组队任务通关道具或破解多人机关（默认排除单人可击败的Boss战，使用 '!passpq boss' 强制跳过）");
    }

    @Override
    public void execute(Client client, String[] params) {
        Character player = client.getPlayer();
        if (player == null) {
            return;
        }

        boolean forceBoss = false;
        if (params.length > 0) {
            String arg = params[0].toLowerCase();
            if (arg.equals("help") || arg.equals("?") || arg.equals("帮助")) {
                player.yellowMessage("=== !passpq 组队任务快捷辅助说明 ===");
                player.yellowMessage("用法 1: !passpq (或 !clearpq) - 智能跳过多人群体机关/挂绳/跳台/发券，保留Boss战");
                player.yellowMessage("用法 2: !passpq boss (或 !passpq all / !passpq force) - 强制跳过包括Boss在内的所有阶段");
                return;
            }
            if (arg.equals("boss") || arg.equals("all") || arg.equals("force") || arg.equals("1")) {
                forceBoss = true;
            }
        }

        PartyQuestClearHelper.ClearResult result = PartyQuestClearHelper.handlePassPQ(player, forceBoss);
        player.yellowMessage(result.getMessage());
    }
}
