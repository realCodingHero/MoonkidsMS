# -*- coding: utf-8 -*-
"""
Unit tests for MapleStory rich text markup parser and validator.
"""

import unittest
import sys
import os

# Ensure local module is importable
sys.path.insert(0, os.path.dirname(__file__))
from maple_tag_parser import MapleTagValidator

class TestMapleTagValidator(unittest.TestCase):

    def test_valid_tag_combinations(self):
        """Test valid standard MapleStory dialogues."""
        valid_cases = [
            "#L1##b>> 查看当前可直接交付的任务#k#l",
            "#L2##b>> 查看当前进行中的任务列表#k #d(50 个进行中)#k#l",
            "喂，如果您有#b20个 #t2012002##k，我可以做一个美味的#r#t2010005##k。你觉得怎么样？想帮我吗？",
            "请前往#b#m100000000##k寻找#p1022100#，获取#i2012002##t2012002#。",
            "消灭#b#o100100##k获取#b#c4000000#/20#k个道具。",
            "你好，勇敢的#h0#！",
            "#e#r【 月兒 任务辅助助手 】#k#n",
            "#fUI/UIWindow.img/Quest/icon0#",
            "纯文本对话，没有任何标签。"
        ]
        for text in valid_cases:
            issues = MapleTagValidator.validate_critical_rules(text)
            self.assertEqual(len(issues), 0, f"Expected no issues for valid text: {text}, but got: {issues}")

    def test_detect_missing_hash_in_composite_tags(self):
        """Detect the regression where #L1##b was accidentally replaced with #L1#b."""
        bad_cases = [
            ("#L1#b>> 查看当前可直接交付的任务#k#l", "MISSING_HASH_IN_JUXTAPOSITION"),
            ("#t2012002#k", "MISSING_HASH_IN_JUXTAPOSITION"),
            ("噢，你居然带来了#p2012019#k，谢谢。", "MISSING_HASH_IN_JUXTAPOSITION"),
            ("你是#b#h0#k吗？", "MISSING_HASH_IN_JUXTAPOSITION")
        ]
        for text, expected_type in bad_cases:
            issues = MapleTagValidator.validate_critical_rules(text)
            self.assertGreater(len(issues), 0, f"Failed to detect error in: {text}")
            self.assertEqual(issues[0].issue_type, expected_type)

    def test_detect_doubled_tag_letter(self):
        """Detect Quest 8084 bug where #kk rendered a literal 'k'."""
        bad_cases = [
            ("喂，如果您有#b20个 #t2012002##kk，我可以做一个美味的蜂蜜。", "DOUBLED_TAG_LETTER"),
            ("获得了经验值#bb", "DOUBLED_TAG_LETTER"),
            ("危险区域#rr", "DOUBLED_TAG_LETTER")
        ]
        for text, expected_type in bad_cases:
            issues = MapleTagValidator.validate_critical_rules(text)
            self.assertGreater(len(issues), 0, f"Failed to detect error in: {text}")
            self.assertEqual(issues[0].issue_type, expected_type)

    def test_detect_english_plural_suffix(self):
        """Detect trailing 's' appended to entity tags like #t2012002#s."""
        bad_cases = [
            ("为了制作美食，她需要 #b20#k #b#t2012002#s#k。快去收集吧！", "ENGLISH_PLURAL_TAG_SUFFIX"),
            ("请消灭3只#r#o9300383#s#k！", "ENGLISH_PLURAL_TAG_SUFFIX"),
            ("收集50个#i4000000#s交给村长。", "ENGLISH_PLURAL_TAG_SUFFIX")
        ]
        for text, expected_type in bad_cases:
            issues = MapleTagValidator.validate_critical_rules(text)
            self.assertGreater(len(issues), 0, f"Failed to detect error in: {text}")
            self.assertEqual(issues[0].issue_type, expected_type)

    def test_detect_missing_hash_before_color_reset(self):
        """Detect missing '#' in phrases like '那些#b生日蜡烛k，快！'."""
        bad_text = "我需要那些#b生日蜡烛k，快！请快点！！"
        issues = MapleTagValidator.validate_critical_rules(bad_text)
        self.assertGreater(len(issues), 0)
        self.assertEqual(issues[0].issue_type, "MISSING_HASH_BEFORE_COLOR_RESET")

if __name__ == '__main__':
    unittest.main()
