# -*- coding: utf-8 -*-
"""
Full-repo MapleStory script tag validator.
Scans all scripts in gms-server/scripts-zh-CN for tag defects.
Exits with code 0 on success, 1 on failure.
"""

import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Ensure local module import
sys.path.insert(0, os.path.dirname(__file__))
from maple_tag_parser import MapleTagValidator, TagIssue

def extract_strings_from_js(code: str):
    quotes = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'', code)
    results = []
    for q1, q2 in quotes:
        s = q1 if q1 else q2
        if '#' in s:
            results.append(s)
    return results

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    scripts_dir = os.path.join(base_dir, 'gms-server', 'scripts-zh-CN')

    print("=== Running MapleStory Script Tag Validation ===")
    print(f"Scripts Path: {scripts_dir}\n")

    total_files_scanned = 0
    total_issues = 0
    file_issues_map = {}

    if os.path.exists(scripts_dir):
        for root, dirs, files in os.walk(scripts_dir):
            for f in files:
                if f.endswith('.js'):
                    total_files_scanned += 1
                    fpath = os.path.join(root, f)
                    rel_p = os.path.relpath(fpath, base_dir)
                    try:
                        with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                            code = fp.read()
                        dialogues = extract_strings_from_js(code)
                        file_issues = []
                        for d in dialogues:
                            issues = MapleTagValidator.validate_critical_rules(d)
                            file_issues.extend(issues)
                        if file_issues:
                            file_issues_map[rel_p] = file_issues
                            total_issues += len(file_issues)
                    except Exception as e:
                        print(f"Error reading {rel_p}: {e}")

    print(f"Scanned {total_files_scanned} script files.")
    if total_issues == 0:
        print(" SUCCESS: 0 critical tag syntax errors found across all scripts!\n")
        return 0
    else:
        print(f" FAILED: Found {total_issues} critical tag syntax errors in {len(file_issues_map)} files:\n")
        for fpath, issues in file_issues_map.items():
            print(f"[{fpath}] ({len(issues)} issues):")
            for iss in issues[:5]:
                print(f"   - {iss}")
            if len(issues) > 5:
                print(f"   ... and {len(issues) - 5} more issues.")
            print()
        return 1

if __name__ == '__main__':
    sys.exit(main())
