/* Dalair
   Medal Master NPC
*/

var status = -1;
var selectedOption = -1;
var availableReissue = [];
var selectedMedal = null;
var reissueFee = 1000;
var mergeFee = 50000;
var name = "";

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === -1 || (mode === 0 && status === 0)) {
        cm.dispose();
        return;
    }

    if (mode === 1) {
        status++;
    } else {
        status--;
    }

    if (status === 0) {
        var text = "I am #bDalair#k, the Medal Master of Maple World.\r\n\r\n";
        text += "#b#L0# Re-issue previously earned medals#l\r\n";
        text += "#L1# Learn about medal and explorer quests#l\r\n";
        text += "#L2# Equipment Merge service#l#k";
        cm.sendSimple(text);
    } else if (status === 1) {
        selectedOption = selection;

        if (selectedOption === 0) { // Reissue
            availableReissue = [];
            const Quest = Java.type('org.gms.server.quest.Quest');
            var medalsMap = Quest.getAllMedals();

            var it = medalsMap.entrySet().iterator();
            while (it.hasNext()) {
                var entry = it.next();
                var questId = entry.getKey();
                var medalId = entry.getValue();

                if (cm.isQuestCompleted(questId)) {
                    if (!cm.haveItem(medalId)) {
                        availableReissue.push({
                            questId: questId,
                            medalId: medalId
                        });
                    }
                }
            }

            if (availableReissue.length === 0) {
                cm.sendOk("You do not have any medals eligible for re-issuing.\r\n\r\n#dNote: You can only re-issue medals for completed quests that you do not currently possess in your inventory or equip slots.#k");
                cm.dispose();
                return;
            }

            var text = "Here are the medals you have earned that you do not currently possess. Re-issuing fee is #r" + cm.numberWithCommas(reissueFee) + " mesos#k each:\r\n\r\n";
            for (var i = 0; i < availableReissue.length; i++) {
                var item = availableReissue[i];
                text += "#L" + i + "# #i" + item.medalId + "# #b#t" + item.medalId + "##k#l\r\n";
            }
            cm.sendSimple(text);

        } else if (selectedOption === 1) { // Intro
            var text = "In Maple World, accomplishing special achievements awards honorable titles and unique medals:\r\n\r\n";
            text += "#e#b[Job & Level Advancements]#n#k: Earn adventurer medals by completing job advancements;\r\n";
            text += "#e#b[World Exploration]#n#k: Explore Victoria Island, El Nath, Ludibrium, Aquarium, Mu Lung, Leafre, and Temple of Time;\r\n";
            text += "#e#b[Boss & Challenge]#n#k: Slay mighty bosses, gain fame, complete party quests, or collect monster book cards.\r\n\r\n";
            text += "#dYou can also use the Quest Helper (@qh) to check your progress.#k";
            cm.sendOk(text);
            cm.dispose();

        } else if (selectedOption === 2) { // Equipment Merge
            const GameConfig = Java.type('org.gms.config.GameConfig');
            if (!GameConfig.getServerBoolean("use_enable_custom_npc_script")) {
                cm.sendOk("Equipment merge is currently disabled.");
                cm.dispose();
                return;
            }

            var levelLimit = !cm.getPlayer().isCygnus() ? 160 : 110;
            const MakerProcessor = Java.type('org.gms.client.processor.action.MakerProcessor');
            if (!GameConfig.getServerBoolean("use_starter_merge") && (cm.getPlayer().getLevel() < levelLimit || MakerProcessor.getMakerSkillLevel(cm.getPlayer()) < 3)) {
                cm.sendOk("You need Maker level 3 and level " + levelLimit + " to use equipment merge.");
                cm.dispose();
                return;
            }

            if (cm.getMeso() < mergeFee) {
                cm.sendOk("The service fee is #r" + cm.numberWithCommas(mergeFee) + " mesos#k.");
                cm.dispose();
                return;
            }

            var selStr = "Merge fee is #r" + cm.numberWithCommas(mergeFee) + "#k mesos. Extra equipments in inventory will be merged into your equipped gear.\r\n\r\n#rWarning: Merged equipments will become untradeable.#k";
            cm.sendNext(selStr);
        }
    } else if (status === 2) {
        if (selectedOption === 0) {
            var idx = selection;
            if (idx < 0 || idx >= availableReissue.length) {
                cm.dispose();
                return;
            }
            selectedMedal = availableReissue[idx];

            if (cm.getMeso() < reissueFee) {
                cm.sendOk("You do not have enough mesos (#r" + cm.numberWithCommas(reissueFee) + " mesos#k required).");
                cm.dispose();
                return;
            }

            if (!cm.canHold(selectedMedal.medalId)) {
                cm.sendOk("Please ensure you have at least 1 free slot in your equip inventory.");
                cm.dispose();
                return;
            }

            cm.gainMeso(-reissueFee);
            cm.gainItem(selectedMedal.medalId, 1);
            cm.sendOk("Successfully re-issued #b#i" + selectedMedal.medalId + "# #t" + selectedMedal.medalId + "##k! Please take good care of your medal.");
            cm.dispose();

        } else if (selectedOption === 2) {
            var selStr = "Please enter the target item name:";
            cm.sendGetText(selStr);
        }
    } else if (status === 3) {
        if (selectedOption === 2) {
            name = cm.getText();
            if (cm.getPlayer().mergeAllItemsFromName(name)) {
                cm.gainMeso(-mergeFee);
                cm.sendOk("Merge completed! Thank you for using our service.");
            } else {
                cm.sendOk("Could not find #b'" + name + "'#k in your equipment inventory!");
            }
            cm.dispose();
        }
    }
}
