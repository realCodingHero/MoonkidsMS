/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* Yulete
	Yulete's Office (926110203)
	Magatia NPC
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function playersTooClose() {
    var npcpos = cm.getMap().getMapObject(cm.getNpcObjectId()).getPosition();
    var listchr = cm.getMap().getPlayers();

    for (var iterator = listchr.iterator(); iterator.hasNext();) {
        var chr = iterator.next();

        var chrpos = chr.getPosition();
        if (Math.sqrt(Math.pow((npcpos.getX() - chrpos.getX()), 2) + Math.pow((npcpos.getY() - chrpos.getY()), 2)) < 310) {
            return true;
        }
    }

    return false;
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        var eim = cm.getEventInstance();

        if (cm.getMapId() == 926110203) {
            if (status == 0) {
                var state = eim.getIntProperty("yuleteTalked");

                if (state == -1) {
                    cm.sendOk("“嘿，看来你们又有了新玩伴。祝你们玩得开心，我先告辞了。”");

                } else if (playersTooClose()) {
                    cm.sendOk("“哦，你们好啊。从你们踏入这里的那一刻起，我一直在注视着你们的一举一动。能来到这里确实很了不起，我由衷地赞赏你们。不过看看时间，我还有个重要的约会，恐怕必须先离开了。但别担心，我的助手们会好好招待你们所有人的。那么，恕我失陪了。”");

                    eim.setIntProperty("yuleteTalked", -1);
                } else if (eim.getIntProperty("npcShocked") == 0) {
                    cm.sendOk("“哼哼~ 真是个狡猾的家伙。不过无所谓了，从你们进入这里开始，我就一直在#b暗中观察你们#k。能突破到这里确实有点本事，我对你们表示赞赏。不过看看时间，我手头还有要紧事，恕不奉陪了。别担心，我的#r助手们#k会好好‘招待’你们的。那么，拜拜咯！”");

                    eim.setIntProperty("yuleteTalked", -1);
                } else {
                    cm.sendOk("“哈哈！什、什么——你们是怎么跑到这里来的？！我明明封锁了所有的通道！不过没关系，很快就能解决掉你们。手下们：启动#r终极武器#k！！你！没错，就是你，别以为这就结束了，回头看看你的同伴们吧，他们正需要你的救援呢！我就先撤了！”");

                    eim.setIntProperty("yuleteTalked", 1);
                }
            }

            cm.dispose();
        } else {
            if (status == 0) {
                if (eim.isEventCleared()) {
                    cm.sendOk("“不……不可能！我怎么会被打败？为什么？！我所做的一切，全都是为了追求更伟大的炼金术啊！你们凭什么阻止我？站在我的位置上，任何一个炼金术士都会这么做！可他们倒好，仅仅因为所谓的‘危险’就扼杀科学的进步！真是不可理喻！”");
                } else {
                    var state = eim.getIntProperty("yuletePassed");

                    const LifeFactory = Java.type('org.gms.server.life.LifeFactory');
                    const Point = Java.type('java.awt.Point');
                    if (state == -1) {
                        cm.sendOk("睁大眼睛看好了！这就是玛加提亚炼金术登峰造极的最高杰作！哈哈哈哈哈哈……");
                    } else if (state == 0) {
                        cm.sendOk("你们这群碍事的家伙，真是阴魂不散。既然如此，就让你们见识一下我倾注最顶尖炼金术打造的最新武器——#r弗朗肯狂人#k吧！");
                        eim.dropMessage(5, "犹泰：让你们见识一下我用最顶尖炼金术打造的最新武器——弗朗肯狂人！");

                        var mapobj = eim.getMapInstance(926110401);
                        var bossobj = LifeFactory.getMonster(9300151);
                        mapobj.spawnMonsterOnGroundBelow(bossobj, new Point(250, 100));

                        eim.setIntProperty("statusStg7", 1);
                        eim.setIntProperty("yuletePassed", -1);
                    } else {
                        cm.sendOk("你们这群不知死活的家伙，真是烦死人了！既然如此，就让你们见识一下融合了蒙特鸠与卡帕莱特两大学派禁忌炼金术的终极杰作——玛加提亚那些庸人唯恐避之不及的伟力：#r狂暴弗朗肯#k！！");
                        eim.dropMessage(5, "犹泰：让你们见识一下融合了蒙特鸠与卡帕莱特两大学派禁忌炼金术的终极杰作——狂暴弗朗肯！！");

                        var mapobj = eim.getMapInstance(926110401);
                        var bossobj = LifeFactory.getMonster(9300152);
                        mapobj.spawnMonsterOnGroundBelow(bossobj, new Point(250, 100));

                        eim.setIntProperty("statusStg7", 2);
                        eim.setIntProperty("yuletePassed", -1);
                    }
                }
            }

            cm.dispose();
        }
    }
}
