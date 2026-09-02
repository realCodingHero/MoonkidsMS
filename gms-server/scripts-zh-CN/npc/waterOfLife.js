/*
    生命之水 - 玛鲁 (宠物复活NPC)
    CMS标准地道化重构
*/

var status = -1;
var pets;
var selectedPet = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
        pets = cm.getDeadPets();
        if (pets.size() == 0) {
            cm.sendOk("你目前没有处于休眠状态（已死亡）的宠物需要使用生命之水复活。");
            cm.dispose();
            return;
        }

        var text = "你想要复活哪一只心爱的宠物呢？请选择你最想唤醒的伙伴：\r\n#b";
        for (var i = 0; i < pets.size(); i++) {
            var pet = pets.get(i);
            text += "#L" + i + "# #i" + pet.getPetItemId() + "# " + pet.getName() + " (等级: " + pet.getLevel() + ")#l\r\n";
        }
        cm.sendSimple(text);
    } else if (status == 1) {
        selectedPet = selection;
        var pet = pets.get(selectedPet);
        cm.sendYesNo("你确定要使用 #b#t5180000#k 唤醒宠物 #r" + pet.getName() + "#k 吗？注入生命之水后，它将重新恢复活力，陪伴你继续展开冒险！");
    } else if (status == 2) {
        if (!cm.haveItem(5180000, 1)) {
            cm.sendOk("你身上没有 #b#t5180000#k，无法唤醒宠物。请先准备好生命之水后再来找我吧。");
            cm.dispose();
            return;
        }

        var pet = pets.get(selectedPet);
        cm.gainItem(5180000, -1);
        cm.revivePet(pet.getUniqueId());
        cm.sendOk("奇迹发生了！你的宠物 #b" + pet.getName() + "#k 已经喝下生命之水重新苏醒了！快去宠物栏看看你的好伙伴吧！");
        cm.dispose();
    }
}
