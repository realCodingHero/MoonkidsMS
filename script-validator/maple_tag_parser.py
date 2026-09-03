# -*- coding: utf-8 -*-
"""
MapleStory Rich Text Tag Parser & Linter
Validates Wizet markup language in dialogues, NPC scripts, and WZ strings.
"""

import re
from typing import List

# Valid single-letter control tags
VALID_CONTROL_TAGS = {'b', 'r', 'g', 'd', 'e', 'n', 'k', 'l', 'v', 'B', 'R', 'G', 'K'}

# Valid parameterized entity tags:
# t: item name, i: item icon, m: map name, p: npc name, o: mob name,
# s: skill name, c: item count, z: item detail, y: quest title,
# a: quest action, f: wz ui icon/image, L: menu selection, h: hero name
VALID_ENTITY_TAGS = {'t', 'i', 'm', 'p', 'o', 's', 'c', 'z', 'y', 'a', 'f', 'L', 'h'}

class TagIssue:
    def __init__(self, issue_type: str, message: str, snippet: str, position: int = -1):
        self.issue_type = issue_type
        self.message = message
        self.snippet = snippet
        self.position = position

    def __repr__(self):
        return f"[{self.issue_type}] {self.message} (near '{self.snippet}')"

class MapleTagValidator:
    """
    Validates MapleStory formatted text for common syntax errors and corruptions.
    """

    @staticmethod
    def validate_critical_rules(text: str) -> List[TagIssue]:
        """
        Validates critical tag regressions that cause visible glitches on screen:
        1. Doubled tag letters (#kk, #bb, #rr) -> causes literal letters on screen.
        2. Missing '#' in composite juxtaposition (#L1#b, #t12345#k) -> causes literal 'b' or 'k'.
        3. Stray English plural 's' after tags (#t...#s, #o...#s) -> causes literal 's' on screen.
        4. Missing '#' before color reset (#b生日蜡烛k) -> causes literal 'k' on screen.
        """
        issues: List[TagIssue] = []
        if not text or '#' not in text:
            return issues

        # 1. Check for doubled control letters: #kk, #bb, #rr
        doubled_matches = re.finditer(r'#(?:kk|bb|rr|gg|dd|ee|nn|ll)\b', text, re.IGNORECASE)
        for m in doubled_matches:
            snippet = text[max(0, m.start() - 15):min(len(text), m.end() + 15)]
            issues.append(TagIssue(
                issue_type="DOUBLED_TAG_LETTER",
                message=f"Duplicated tag letter '{m.group(0)}' found (causes extra character rendered in client)",
                snippet=snippet,
                position=m.start()
            ))

        # 2. Check for missing '#' in composite tag juxtaposition:
        # e.g. #L1#b -> should be #L1##b
        # e.g. #t12345#k -> should be #t12345##k
        # e.g. #p12345#k -> should be #p12345##k
        # e.g. #h0#k -> should be #h0##k
        comp_matches = re.finditer(r'(#[timposczyafLh][0-9a-zA-Z_/.:]+?#)([brgdeknlBBRGK])(?=[^a-zA-Z0-9#]|$)', text)
        for m in comp_matches:
            prefix = m.group(1)
            bad_char = m.group(2)
            snippet = text[max(0, m.start() - 15):min(len(text), m.end() + 15)]
            issues.append(TagIssue(
                issue_type="MISSING_HASH_IN_JUXTAPOSITION",
                message=f"Missing '#' between closing tag '{prefix}' and control tag '{bad_char}'. Should be '{prefix}#{bad_char}'",
                snippet=snippet,
                position=m.start()
            ))

        # 3. Check for English plural suffix appended directly to tags:
        # e.g. #t2012002#s, #o0100131#s, #i4000000#s
        plural_matches = re.finditer(r'(#[timposczyafL][0-9a-zA-Z_/.:]+?#)s(?=[^a-zA-Z0-9]|$)', text, re.IGNORECASE)
        for m in plural_matches:
            snippet = text[max(0, m.start() - 15):min(len(text), m.end() + 15)]
            issues.append(TagIssue(
                issue_type="ENGLISH_PLURAL_TAG_SUFFIX",
                message=f"Stray English plural 's' suffix after tag '{m.group(1)}s'",
                snippet=snippet,
                position=m.start()
            ))

        # 4. Check for missing '#' before color closing letter at the end of Chinese phrases:
        # e.g. 那些#b生日蜡烛k， -> should be 那些#b生日蜡烛#k，
        missing_color_close = re.finditer(r'#[brgd]([^\s#\r\n]{1,30})([kbr])(?=[，。,！？\s\r\n]|$)', text)
        for m in missing_color_close:
            inner_text = m.group(1)
            stray_char = m.group(2)
            if any('\u4e00' <= c <= '\u9fa5' for c in inner_text):
                snippet = text[max(0, m.start() - 10):min(len(text), m.end() + 10)]
                issues.append(TagIssue(
                    issue_type="MISSING_HASH_BEFORE_COLOR_RESET",
                    message=f"Missing '#' before color reset '{stray_char}' after Chinese text",
                    snippet=snippet,
                    position=m.start()
                ))

        return issues
