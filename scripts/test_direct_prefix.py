# -*- coding: utf-8 -*-
import sys
from deep_cleaner import clean_bracketed_prefixes, clean_russian_text_deep

sys.stdout.reconfigure(encoding='utf-8')

test_str = '(при) годный; подходящий; соответствующий'
print("Input:", repr(test_str))
print("Prefix:", repr(clean_bracketed_prefixes(test_str)))
print("Deep:", repr(clean_russian_text_deep(test_str)))
