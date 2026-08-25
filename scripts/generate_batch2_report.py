import sys, json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/evaluation_second_200_words_report.json', 'r', encoding='utf-8') as f:
    report = json.load(f)

print(f"Total evaluated Batch 2: {report['total']}")
print(f"Passed: {report['pass_count']} ({report['pass_rate']})")
print(f"Failed: {report['fail_count']}")

# Build detailed markdown report
md_lines = []
md_lines.append("# Подробный отчет о проверке ВТОРОЙ партии из 200 случайных слов по словарю Мюллера (2021)\n")
md_lines.append(f"**Результаты аудита партии №2:** Проверено: **200 новых слов**. Успешно прошло: **{report['pass_count']} ({report['pass_rate']})**. Не прошло: **{report['fail_count']}**.\n")
md_lines.append("Критерии: проверка на отсутствие лишних значений, пропущенных значений, нарушений порядка, искажения слов/опечаток и ошибок частей речи.\n")
md_lines.append("---\n")
md_lines.append("## Таблица аудита второй партии (200 слов)\n")
md_lines.append("| № | Слово | Статус | Кол-во значений | Первые значения (перевод из словаря) | Обоснование / Сверка со статьей Мюллера |")
md_lines.append("|---|---|---|---|---|---|")

for idx, r in enumerate(report['results'], 1):
    w = r['word']
    st = r['status']
    cnt = r['json_meanings_count']
    sample_tr = "; ".join([t for t in r['json_meanings'] if t]) if r['json_meanings'] else "—"
    if len(sample_tr) > 60:
        sample_tr = sample_tr[:57] + "..."
    reason = r['reason']
    if len(reason) > 80:
        reason = reason[:77] + "..."
    sample_tr = sample_tr.replace('|', '/')
    reason = reason.replace('|', '/')
    md_lines.append(f"| {idx} | **{w}** | {st} | {cnt} | {sample_tr} | {reason} |")

md_content = "\n".join(md_lines)

with open('scripts/audit_batch2_200_words_report.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print("Saved scripts/audit_batch2_200_words_report.md")
