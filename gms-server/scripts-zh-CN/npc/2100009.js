/* Author: aaroncsn <MapleSea Like>
	NPC Name: 		Aldin
	Map(s): 		The Burning Road: Ariant(2600000000)
	Description: 	Ariant Plastic Surgery

        GMS-like revised by Ronan -- contents found thanks to Mitsune (GamerBewbs), Waltzing, AyumiLove
*/

var status = 0;
var beauty = 0;
var mface_r = Array(20001, 20003, 20009, 20010, 20025, 20031);
var fface_r = Array(21002, 21009, 21011, 21013, 21016, 21029, 21030);
var facenew = Array();

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function pushIfItemsExists(array, itemidList) {
    for (var i = 0; i < itemidList.length; i++) {
        var itemid = itemidList[i];

        if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
            array.push(itemid);
        }
    }
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {  // disposing issue with stylishs found thanks to Vcoc
        if (type == 7) {
            cm.sendNext("我明白了……请仔细考虑清楚。当你下定决心后再来找我吧。");
        }

        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("嗨，我是这里的整容助理医生。只要有#b#t5152029##k或#b#t5152048##k，我就可以为你进行美容，相信我的手艺！啊，别忘了，普通会员卡的手术结果是随机的哦！那么，你想做哪项服务呢？\r\n#b#L1#普通整容：#i5152029##t5152029##l\r\n#L2#普通美瞳：#i5152048##t5152048##l#k");
        } else if (status == 1) {
            if (selection == 1) {
                beauty = 0;

                facenew = Array();
                if (cm.getChar().getGender() == 0) {
                    for (var i = 0; i < mface_r.length; i++) {
                        pushIfItemExists(facenew, mface_r[i] + cm.getChar().getFace()
                            % 1000 - (cm.getChar().getFace()
                                % 100));
                    }
                }
                if (cm.getChar().getGender() == 1) {
                    for (var i = 0; i < fface_r.length; i++) {
                        pushIfItemExists(facenew, fface_r[i] + cm.getChar().getFace()
                            % 1000 - (cm.getChar().getFace()
                                % 100));
                    }
                }
                cm.sendYesNo("如果使用普通整容会员卡，你的脸型将会随机变成一种新模样……你确定要使用#b#t5152029##k进行整容吗？");
            } else if (selection == 2) {
                beauty = 1;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 21000;
                }
                colors = Array();
                pushIfItemsExists(colors, [current, current + 100, current + 300, current + 600, current + 700]);
                cm.sendYesNo("如果使用普通美瞳会员卡，你的眼睛颜色将会随机改变。你确定要使用#b#t5152048##k改变瞳孔颜色吗？");
            }
        } else if (status == 2) {
            cm.dispose();

            if (beauty == 0) {
                if (cm.haveItem(5152029) == true) {
                    cm.gainItem(5152029, -1);
                    cm.setFace(facenew[Math.floor(Math.random() * facenew.length)]);
                    cm.sendOk("祝贺你！尽情享受你的全新面貌吧！");
                } else {
                    cm.sendNext("嗯……看来你身上没有阿里安特适用的整容会员卡呢。很抱歉，没有会员卡的话，我无法为你进行手术。");
                }
            } else if (beauty == 1) {
                if (cm.haveItem(5152048)) {
                    cm.gainItem(5152048, -1);
                    cm.setFace(colors[Math.floor(Math.random() * colors.length)]);
                    cm.sendOk("祝贺你！尽情享受你的全新美瞳色彩吧！");
                } else {
                    cm.sendOk("嗯……看来你身上没有阿里安特适用的美瞳会员卡呢。很抱歉，没有会员卡的话，我无法为你更换美瞳。");
                }
            }
        }
    }
}
