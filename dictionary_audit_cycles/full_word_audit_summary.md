# Полный аудит Oxford 5000

**Canonical dataset не изменён в этих циклах.** «Исправлено» означает фактически применённое изменение, а не предложение агента.

## Итоги

- Всего записей: **4980**
- Фактически изменено в dataset: **0**
- Принято без изменения: **2108**
- `review_required`: **1172**
- Не обработано новым пятиагентным циклом: **1700**

## Все слова

| № | Слово | Решение | Изменено | Пустые значения | Generated | No-candidate | Что требует анализа | Отчёт |
|---:|---|---|---|---:|---:|---:|---|---|
| 1 | `a` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 2 | `abandon` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 3 | `ability` | review_required | нет | 2 | 2 | 0 | Generated examples cover the missing senses, but the phrase “ability with numbers” may blur ability with skill/aptitude and needs a lexical review. | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 4 | `able` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 5 | `abolish` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 6 | `abortion` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 7 | `about` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 8 | `above` | принято без изменения | нет | 4 | 4 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 9 | `abroad` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 10 | `absence` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 11 | `absent` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 12 | `absolute` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 13 | `absolutely` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 14 | `absorb` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 15 | `abstract` | принято без изменения | нет | 5 | 5 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 16 | `absurd` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 17 | `abundance` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 18 | `abuse` | принято без изменения | нет | 5 | 5 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 19 | `academic` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 20 | `academy` | review_required | нет | 2 | 2 | 0 | The generated phrase “a higher academy” is understandable but not idiomatic enough to accept without a native-speaker review. | `dictionary_audit_cycles/live_strict_1000/batch_001/stage_10.json` |
| 21 | `accelerate` | review_required | нет | 1 | 0 | 0 | accelerate: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 22 | `accent` | review_required | нет | 7 | 0 | 0 | accent: независимая защита нашла 7 конкретных редакторских проблем среди 7 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 23 | `accept` | review_required | нет | 2 | 0 | 0 | accept: независимая защита нашла 2 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 24 | `acceptable` | review_required | нет | 2 | 0 | 0 | acceptable: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 25 | `acceptance` | review_required | нет | 3 | 0 | 0 | acceptance: независимая защита нашла 3 конкретных редакторских проблем среди 5 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 26 | `access` | review_required | нет | 4 | 0 | 0 | access: независимая защита нашла 4 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 27 | `accessible` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 28 | `accident` | review_required | нет | 2 | 0 | 0 | accident: независимая защита нашла 2 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 29 | `accidentally` | review_required | нет | 1 | 0 | 0 | accidentally: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 30 | `accommodate` | review_required | нет | 4 | 0 | 0 | accommodate: независимая защита нашла 4 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 31 | `accommodation` | review_required | нет | 6 | 0 | 0 | accommodation: независимая защита нашла 6 конкретных редакторских проблем среди 7 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 32 | `accompany` | review_required | нет | 2 | 0 | 0 | accompany: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 33 | `accomplish` | review_required | нет | 3 | 0 | 0 | accomplish: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 34 | `accomplishment` | review_required | нет | 3 | 0 | 0 | accomplishment: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 35 | `accordance` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 36 | `according to` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 37 | `accordingly` | review_required | нет | 2 | 0 | 0 | accordingly: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 38 | `account` | review_required | нет | 3 | 0 | 0 | account: независимая защита нашла 3 конкретных редакторских проблем среди 11 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 39 | `accountability` | review_required | нет | 2 | 0 | 0 | accountability: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 40 | `accountable` | review_required | нет | 3 | 0 | 0 | accountable: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_002/stage_10.json` |
| 41 | `accountant` | review_required | нет | 2 | 0 | 0 | accountant: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 42 | `accumulate` | review_required | нет | 2 | 0 | 0 | accumulate: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 43 | `accumulation` | review_required | нет | 2 | 0 | 0 | accumulation: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 44 | `accuracy` | review_required | нет | 1 | 0 | 0 | accuracy: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 45 | `accurate` | review_required | нет | 2 | 0 | 0 | accurate: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 46 | `accurately` | review_required | нет | 1 | 0 | 0 | accurately: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 47 | `accusation` | review_required | нет | 2 | 0 | 0 | accusation: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 48 | `accuse` | review_required | нет | 1 | 0 | 0 | accuse: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 49 | `accused` | review_required | нет | 2 | 0 | 0 | accused: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 50 | `achieve` | review_required | нет | 1 | 0 | 0 | achieve: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 51 | `achievement` | review_required | нет | 3 | 0 | 0 | achievement: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 52 | `acid` | review_required | нет | 3 | 0 | 0 | acid: независимая защита нашла 3 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 53 | `acknowledge` | review_required | нет | 2 | 0 | 0 | acknowledge: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 54 | `acquire` | review_required | нет | 1 | 0 | 0 | acquire: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 55 | `acquisition` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 56 | `acre` | review_required | нет | 1 | 0 | 0 | acre: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 57 | `across` | review_required | нет | 1 | 0 | 0 | across: независимая защита нашла 1 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 58 | `act` | review_required | нет | 2 | 0 | 0 | act: независимая защита нашла 2 конкретных редакторских проблем среди 10 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 59 | `action` | review_required | нет | 2 | 0 | 0 | action: независимая защита нашла 2 конкретных редакторских проблем среди 10 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 60 | `activate` | review_required | нет | 4 | 0 | 0 | activate: независимая защита нашла 4 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_003/stage_10.json` |
| 61 | `activation` | review_required | нет | 1 | 0 | 0 | activation: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 0 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 62 | `active` | review_required | нет | 2 | 0 | 0 | active: независимая защита нашла 2 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 63 | `activist` | review_required | нет | 1 | 0 | 0 | activist: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 64 | `activity` | review_required | нет | 2 | 0 | 0 | activity: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 65 | `actor` | review_required | нет | 2 | 0 | 0 | actor: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 66 | `actress` | review_required | нет | 1 | 0 | 0 | actress: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 67 | `actual` | review_required | нет | 1 | 0 | 0 | actual: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 68 | `actually` | review_required | нет | 2 | 0 | 0 | actually: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 69 | `acute` | review_required | нет | 1 | 0 | 0 | acute: независимая защита нашла 1 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 70 | `ad` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 71 | `adapt` | review_required | нет | 3 | 0 | 0 | adapt: независимая защита нашла 3 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 72 | `adaptation` | review_required | нет | 1 | 0 | 0 | adaptation: независимая защита нашла 1 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 73 | `add` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 74 | `addiction` | review_required | нет | 1 | 0 | 0 | addiction: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 75 | `addition` | review_required | нет | 2 | 0 | 0 | addition: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 76 | `additional` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 77 | `additionally` | review_required | нет | 1 | 0 | 0 | additionally: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 0 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 78 | `address` | review_required | нет | 5 | 0 | 0 | address: независимая защита нашла 5 конкретных редакторских проблем среди 7 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 79 | `adequate` | review_required | нет | 2 | 0 | 0 | adequate: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 80 | `adequately` | review_required | нет | 1 | 0 | 0 | adequately: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 0 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_004/stage_10.json` |
| 81 | `adhere` | review_required | нет | 2 | 0 | 0 | adhere: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 82 | `adjacent` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 83 | `adjust` | review_required | нет | 3 | 0 | 0 | adjust: независимая защита нашла 3 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 84 | `adjustment` | review_required | нет | 1 | 0 | 0 | adjustment: независимая защита нашла 1 конкретных редакторских проблем среди 3 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 85 | `administer` | review_required | нет | 7 | 0 | 0 | administer: независимая защита нашла 7 конкретных редакторских проблем среди 7 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 86 | `administration` | review_required | нет | 3 | 0 | 0 | administration: независимая защита нашла 3 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 87 | `administrative` | review_required | нет | 1 | 0 | 0 | administrative: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 88 | `administrator` | review_required | нет | 2 | 0 | 0 | administrator: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 89 | `admire` | review_required | нет | 1 | 0 | 0 | admire: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 90 | `admission` | review_required | нет | 4 | 0 | 0 | admission: независимая защита нашла 4 конкретных редакторских проблем среди 8 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 91 | `admit` | review_required | нет | 2 | 0 | 0 | admit: независимая защита нашла 2 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 92 | `adolescent` | review_required | нет | 2 | 0 | 0 | adolescent: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 93 | `adopt` | review_required | нет | 2 | 0 | 0 | adopt: независимая защита нашла 2 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 94 | `adoption` | review_required | нет | 3 | 0 | 0 | adoption: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 95 | `adult` | review_required | нет | 3 | 0 | 0 | adult: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 96 | `advance` | review_required | нет | 15 | 0 | 0 | advance: независимая защита нашла 15 конкретных редакторских проблем среди 19 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 97 | `advanced` | review_required | нет | 2 | 0 | 0 | advanced: независимая защита нашла 2 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 98 | `advantage` | review_required | нет | 1 | 0 | 0 | advantage: независимая защита нашла 1 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 99 | `adventure` | review_required | нет | 4 | 0 | 0 | adventure: независимая защита нашла 4 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 100 | `adverse` | review_required | нет | 2 | 0 | 0 | adverse: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_005/stage_10.json` |
| 101 | `advertise` | review_required | нет | 2 | 0 | 0 | advertise: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 102 | `advertisement` | review_required | нет | 1 | 0 | 0 | advertisement: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 103 | `advertising` | review_required | нет | 1 | 0 | 0 | advertising: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 104 | `advice` | review_required | нет | 2 | 0 | 0 | advice: независимая защита нашла 2 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 105 | `advise` | review_required | нет | 2 | 0 | 0 | advise: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 106 | `advocate` | review_required | нет | 1 | 0 | 0 | advocate: независимая защита нашла 1 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 107 | `aesthetic` | review_required | нет | 1 | 0 | 0 | aesthetic: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 108 | `affair` | review_required | нет | 3 | 0 | 0 | affair: независимая защита нашла 3 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 109 | `affect` | review_required | нет | 1 | 0 | 0 | affect: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 110 | `affection` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 111 | `afford` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 112 | `affordable` | review_required | нет | 1 | 0 | 0 | affordable: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 113 | `afraid` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 114 | `after` | review_required | нет | 1 | 0 | 0 | after: независимая защита нашла 1 конкретных редакторских проблем среди 10 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 115 | `aftermath` | review_required | нет | 1 | 0 | 0 | aftermath: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 116 | `afternoon` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 117 | `afterwards` | review_required | нет | 1 | 0 | 0 | afterwards: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 118 | `again` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 119 | `against` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 120 | `age` | review_required | нет | 6 | 0 | 0 | age: независимая защита нашла 6 конкретных редакторских проблем среди 13 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_006/stage_10.json` |
| 121 | `aged` | review_required | нет | 3 | 0 | 0 | aged: независимая защита нашла 3 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 122 | `agency` | review_required | нет | 4 | 0 | 0 | agency: независимая защита нашла 4 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 123 | `agenda` | review_required | нет | 1 | 0 | 0 | agenda: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 124 | `agent` | review_required | нет | 2 | 0 | 0 | agent: независимая защита нашла 2 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 125 | `aggression` | review_required | нет | 1 | 0 | 0 | aggression: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 126 | `aggressive` | review_required | нет | 2 | 0 | 0 | aggressive: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 127 | `ago` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 128 | `agree` | review_required | нет | 3 | 0 | 0 | agree: независимая защита нашла 3 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 129 | `agreement` | review_required | нет | 2 | 0 | 0 | agreement: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 130 | `agricultural` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 131 | `agriculture` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 132 | `ah` | review_required | нет | 1 | 0 | 0 | ah: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 133 | `ahead` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 134 | `aid` | review_required | нет | 5 | 0 | 0 | aid: независимая защита нашла 5 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 135 | `aide` | review_required | нет | 1 | 0 | 0 | aide: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 136 | `AIDS` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 137 | `aim` | review_required | нет | 4 | 0 | 0 | aim: независимая защита нашла 4 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 138 | `air` | review_required | нет | 3 | 0 | 0 | air: независимая защита нашла 3 конкретных редакторских проблем среди 10 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 139 | `aircraft` | review_required | нет | 2 | 0 | 0 | aircraft: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 140 | `airline` | review_required | нет | 1 | 0 | 0 | airline: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_007/stage_10.json` |
| 141 | `airport` | review_required | нет | 1 | 0 | 0 | airport: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 142 | `alarm` | review_required | нет | 3 | 0 | 0 | alarm: независимая защита нашла 3 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 143 | `albeit` | review_required | нет | 1 | 0 | 0 | albeit: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 144 | `album` | review_required | нет | 3 | 0 | 0 | album: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 145 | `alcohol` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 146 | `alcoholic` | review_required | нет | 1 | 0 | 0 | alcoholic: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 147 | `alert` | review_required | нет | 7 | 0 | 0 | alert: независимая защита нашла 7 конкретных редакторских проблем среди 7 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 148 | `alien` | review_required | нет | 3 | 0 | 0 | alien: независимая защита нашла 3 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 149 | `align` | review_required | нет | 2 | 0 | 0 | align: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 150 | `alignment` | review_required | нет | 4 | 0 | 0 | alignment: независимая защита нашла 4 конкретных редакторских проблем среди 5 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 151 | `alike` | review_required | нет | 2 | 0 | 0 | alike: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 152 | `alive` | review_required | нет | 3 | 0 | 0 | alive: независимая защита нашла 3 конкретных редакторских проблем среди 7 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 153 | `all` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 154 | `all right` | review_required | нет | 3 | 0 | 0 | all right: независимая защита нашла 3 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 155 | `allegation` | review_required | нет | 2 | 0 | 0 | allegation: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 156 | `allege` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 157 | `allegedly` | review_required | нет | 1 | 0 | 0 | allegedly: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 158 | `alliance` | review_required | нет | 3 | 0 | 0 | alliance: независимая защита нашла 3 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 159 | `allocate` | review_required | нет | 2 | 0 | 0 | allocate: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 160 | `allocation` | review_required | нет | 3 | 0 | 0 | allocation: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_008/stage_10.json` |
| 161 | `allow` | review_required | нет | 1 | 0 | 0 | allow: независимая защита нашла 1 конкретных редакторских проблем среди 6 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 162 | `allowance` | review_required | нет | 6 | 0 | 0 | allowance: независимая защита нашла 6 конкретных редакторских проблем среди 9 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 163 | `ally` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 164 | `almost` | review_required | нет | 1 | 0 | 0 | almost: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 165 | `alone` | review_required | нет | 2 | 0 | 0 | alone: независимая защита нашла 2 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 166 | `along` | review_required | нет | 1 | 0 | 0 | along: независимая защита нашла 1 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 167 | `alongside` | review_required | нет | 3 | 0 | 0 | alongside: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 168 | `already` | review_required | нет | 1 | 0 | 0 | already: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 169 | `also` | review_required | нет | 1 | 0 | 0 | also: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 170 | `alter` | review_required | нет | 1 | 0 | 0 | alter: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 171 | `alternative` | review_required | нет | 1 | 0 | 0 | alternative: независимая защита нашла 1 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 172 | `although` | review_required | нет | 1 | 0 | 0 | although: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 173 | `altogether` | review_required | нет | 2 | 0 | 0 | altogether: независимая защита нашла 2 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 174 | `aluminium` | review_required | нет | 1 | 0 | 0 | aluminium: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 175 | `always` | review_required | нет | 1 | 0 | 0 | always: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 176 | `amateur` | review_required | нет | 2 | 0 | 0 | amateur: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 177 | `amazed` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 178 | `amazing` | review_required | нет | 1 | 0 | 0 | amazing: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 179 | `ambassador` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 180 | `ambition` | review_required | нет | 1 | 0 | 0 | ambition: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_009/stage_10.json` |
| 181 | `ambitious` | review_required | нет | 2 | 0 | 0 | ambitious: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 182 | `ambulance` | review_required | нет | 2 | 0 | 0 | ambulance: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 183 | `amend` | review_required | нет | 2 | 0 | 0 | amend: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 184 | `amendment` | review_required | нет | 1 | 0 | 0 | amendment: независимая защита нашла 1 конкретных редакторских проблем среди 2 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 185 | `amid` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 186 | `among` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 187 | `amount` | review_required | нет | 1 | 0 | 0 | amount: независимая защита нашла 1 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 188 | `amusing` | review_required | нет | 1 | 0 | 0 | amusing: независимая защита нашла 1 конкретных редакторских проблем среди 1 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 189 | `analogy` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 190 | `analyse` | review_required | нет | 3 | 0 | 0 | analyse: независимая защита нашла 3 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 191 | `analysis` | review_required | нет | 3 | 0 | 0 | analysis: независимая защита нашла 3 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 192 | `analyst` | review_required | нет | 2 | 0 | 0 | analyst: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 3 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 193 | `ancestor` | review_required | нет | 2 | 0 | 0 | ancestor: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 194 | `anchor` | review_required | нет | 5 | 0 | 0 | anchor: независимая защита нашла 5 конкретных редакторских проблем среди 8 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 195 | `ancient` | review_required | нет | 1 | 0 | 0 | ancient: независимая защита нашла 1 конкретных редакторских проблем среди 4 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 196 | `and` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 197 | `angel` | review_required | нет | 5 | 0 | 0 | angel: независимая защита нашла 5 конкретных редакторских проблем среди 5 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 198 | `anger` | review_required | нет | 2 | 0 | 0 | anger: независимая защита нашла 2 конкретных редакторских проблем среди 2 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 199 | `angle` | review_required | нет | 4 | 0 | 0 | angle: независимая защита нашла 4 конкретных редакторских проблем среди 7 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 200 | `angry` | review_required | нет | 2 | 0 | 0 | angry: независимая защита нашла 2 конкретных редакторских проблем среди 3 значений; evidence покрывает 4 источников, требуется review. | `dictionary_audit_cycles/live_strict_1000/batch_010/stage_10.json` |
| 201 | `animal` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 202 | `animation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 203 | `ankle` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 204 | `anniversary` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 205 | `announce` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 206 | `announcement` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 207 | `annoy` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 208 | `annoyed` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 209 | `annoying` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 210 | `annual` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 211 | `annually` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 212 | `anonymous` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 213 | `another` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 214 | `answer` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 215 | `anticipate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 216 | `anxiety` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 217 | `anxious` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 218 | `any` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 219 | `any more` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 220 | `anybody` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_011/stage_10.json` |
| 221 | `anyone` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 222 | `anything` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 223 | `anyway` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 224 | `anywhere` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 225 | `apart` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 226 | `apartment` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 227 | `apologize` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 228 | `apology` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 229 | `app` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 230 | `apparatus` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 231 | `apparent` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 232 | `apparently` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 233 | `appeal` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 234 | `appealing` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 235 | `appear` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 236 | `appearance` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 237 | `appetite` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 238 | `applaud` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 239 | `apple` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 240 | `applicable` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_012/stage_10.json` |
| 241 | `applicant` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 242 | `application` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 243 | `apply` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 244 | `appoint` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 245 | `appointment` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 246 | `appreciate` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 247 | `appreciation` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 248 | `approach` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 249 | `appropriate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 250 | `appropriately` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 251 | `approval` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 252 | `approve` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 253 | `approximately` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 254 | `April` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 255 | `arbitrary` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 256 | `architect` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 257 | `architectural` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 258 | `architecture` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 259 | `archive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 260 | `area` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_013/stage_10.json` |
| 261 | `arena` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 262 | `arguably` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 263 | `argue` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 264 | `argument` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 265 | `arise` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 266 | `arm` | принято без изменения | нет | 16 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 267 | `armed` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 268 | `arms` | принято без изменения | нет | 16 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 269 | `army` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 270 | `around` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 271 | `arrange` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 272 | `arrangement` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 273 | `array` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 274 | `arrest` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 275 | `arrival` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 276 | `arrive` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 277 | `arrow` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 278 | `art` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 279 | `article` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 280 | `articulate` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_014/stage_10.json` |
| 281 | `artificial` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 282 | `artist` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 283 | `artistic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 284 | `artwork` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 285 | `as` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 286 | `ash` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 287 | `ashamed` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 288 | `aside` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 289 | `ask` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 290 | `asleep` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 291 | `aspect` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 292 | `aspiration` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 293 | `aspire` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 294 | `assassination` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 295 | `assault` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 296 | `assemble` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 297 | `assembly` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 298 | `assert` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 299 | `assertion` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 300 | `assess` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_015/stage_10.json` |
| 301 | `assessment` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 302 | `asset` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 303 | `assign` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 304 | `assignment` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 305 | `assist` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 306 | `assistance` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 307 | `assistant` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 308 | `associate` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 309 | `associated` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 310 | `association` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 311 | `assume` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 312 | `assumption` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 313 | `assurance` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 314 | `assure` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 315 | `astonishing` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 316 | `asylum` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 317 | `at` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 318 | `athlete` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 319 | `atmosphere` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 320 | `atrocity` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_016/stage_10.json` |
| 321 | `attach` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 322 | `attachment` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 323 | `attack` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 324 | `attain` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 325 | `attempt` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 326 | `attend` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 327 | `attendance` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 328 | `attention` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 329 | `attitude` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 330 | `attorney` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 331 | `attract` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 332 | `attraction` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 333 | `attractive` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 334 | `attribute` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 335 | `auction` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 336 | `audience` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 337 | `audio` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 338 | `audit` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 339 | `August` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 340 | `aunt` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_017/stage_10.json` |
| 341 | `authentic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 342 | `author` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 343 | `authority` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 344 | `authorize` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 345 | `auto` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 346 | `automatic` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 347 | `automatically` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 348 | `autonomy` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 349 | `autumn` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 350 | `availability` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 351 | `available` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 352 | `average` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 353 | `avoid` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 354 | `await` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 355 | `award` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 356 | `aware` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 357 | `awareness` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 358 | `away` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 359 | `awful` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 360 | `awkward` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_018/stage_10.json` |
| 361 | `baby` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 362 | `back` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 363 | `backdrop` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 364 | `background` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 365 | `backing` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 366 | `backup` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 367 | `backwards` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 368 | `bacteria` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 369 | `bad` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 370 | `badge` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 371 | `badly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 372 | `bag` | принято без изменения | нет | 16 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 373 | `bail` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 374 | `bake` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 375 | `balance` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 376 | `balanced` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 377 | `ball` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 378 | `ballet` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 379 | `balloon` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 380 | `ballot` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_019/stage_10.json` |
| 381 | `ban` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 382 | `banana` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 383 | `band` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 384 | `bank1` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 385 | `bank2` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 386 | `bank3` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 387 | `banner` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 388 | `bar` | принято без изменения | нет | 14 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 389 | `bare` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 390 | `barely` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 391 | `bargain` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 392 | `barrel` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 393 | `barrier` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 394 | `base` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 395 | `baseball` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 396 | `based` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 397 | `basement` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 398 | `basic` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 399 | `basically` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 400 | `basis` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_020/stage_10.json` |
| 401 | `basket` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 402 | `basketball` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 403 | `bass` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 404 | `bat` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 405 | `bath` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 406 | `bathroom` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 407 | `battery` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 408 | `battle` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 409 | `battlefield` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 410 | `bay` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 411 | `be` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 412 | `beach` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 413 | `beam` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 414 | `bean` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 415 | `bear1` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 416 | `bear2` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 417 | `beast` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 418 | `beat` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 419 | `beautiful` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 420 | `beauty` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_021/stage_10.json` |
| 421 | `because` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 422 | `become` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 423 | `bed` | принято без изменения | нет | 15 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 424 | `bedroom` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 425 | `bee` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 426 | `beef` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 427 | `beer` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 428 | `before` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 429 | `beg` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 430 | `begin` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 431 | `beginning` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 432 | `behalf` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 433 | `behave` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 434 | `behaviour` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 435 | `behind` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 436 | `being` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 437 | `belief` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 438 | `believe` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 439 | `bell` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 440 | `belong` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_022/stage_10.json` |
| 441 | `beloved` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 442 | `below` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 443 | `belt` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 444 | `bench` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 445 | `benchmark` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 446 | `bend` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 447 | `beneath` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 448 | `beneficial` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 449 | `beneficiary` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 450 | `benefit` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 451 | `bent` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 452 | `beside` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 453 | `besides` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 454 | `best` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 455 | `bet` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 456 | `betray` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 457 | `better` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 458 | `between` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 459 | `beyond` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 460 | `bias` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_023/stage_10.json` |
| 461 | `bicycle` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 462 | `bid` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 463 | `big` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 464 | `bike` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 465 | `bill` | принято без изменения | нет | 15 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 466 | `billion` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 467 | `bin` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 468 | `bind` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 469 | `biography` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 470 | `biological` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 471 | `biology` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 472 | `bird` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 473 | `birth` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 474 | `birthday` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 475 | `biscuit` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 476 | `bishop` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 477 | `bit` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 478 | `bite` | принято без изменения | нет | 17 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 479 | `bitter` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 480 | `bizarre` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_024/stage_10.json` |
| 481 | `black` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 482 | `blade` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 483 | `blame` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 484 | `blank` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 485 | `blanket` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 486 | `blast` | принято без изменения | нет | 14 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 487 | `bleed` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 488 | `blend` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 489 | `bless` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 490 | `blessing` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 491 | `blind` | принято без изменения | нет | 13 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 492 | `block` | принято без изменения | нет | 19 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 493 | `blog` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 494 | `blonde` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 495 | `blood` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 496 | `blow` | принято без изменения | нет | 17 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 497 | `blue` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 498 | `board` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 499 | `boast` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 500 | `boat` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_025/stage_10.json` |
| 501 | `body` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 502 | `boil` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 503 | `bold` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 504 | `bomb` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 505 | `bombing` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 506 | `bond` | принято без изменения | нет | 15 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 507 | `bone` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 508 | `bonus` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 509 | `book` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 510 | `booking` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 511 | `boom` | принято без изменения | нет | 15 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 512 | `boost` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 513 | `boot` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 514 | `border` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 515 | `bored` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 516 | `boring` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 517 | `born` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 518 | `borrow` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 519 | `boss` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 520 | `both` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_026/stage_10.json` |
| 521 | `bother` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 522 | `bottle` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 523 | `bottom` | принято без изменения | нет | 17 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 524 | `bounce` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 525 | `bound` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 526 | `boundary` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 527 | `bow` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 528 | `bowl` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 529 | `box` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 530 | `boy` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 531 | `boyfriend` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 532 | `brain` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 533 | `branch` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 534 | `brand` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 535 | `brave` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 536 | `breach` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 537 | `bread` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 538 | `break` | принято без изменения | нет | 22 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 539 | `breakdown` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 540 | `breakfast` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_027/stage_10.json` |
| 541 | `breakthrough` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 542 | `breast` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 543 | `breath` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 544 | `breathe` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 545 | `breathing` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 546 | `breed` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 547 | `brick` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 548 | `bride` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 549 | `bridge` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 550 | `brief` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 551 | `briefly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 552 | `bright` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 553 | `brilliant` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 554 | `bring` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 555 | `broad` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 556 | `broadband` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 557 | `broadcast` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 558 | `broadcaster` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 559 | `broadly` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 560 | `broken` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_028/stage_10.json` |
| 561 | `brother` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 562 | `brown` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 563 | `browser` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 564 | `brush` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 565 | `brutal` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 566 | `bubble` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 567 | `buck` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 568 | `buddy` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 569 | `budget` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 570 | `buffer` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 571 | `bug` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 572 | `build` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 573 | `building` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 574 | `bulk` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 575 | `bullet` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 576 | `bunch` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 577 | `burden` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 578 | `bureaucracy` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 579 | `burial` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 580 | `burn` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_029/stage_10.json` |
| 581 | `burst` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 582 | `bury` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 583 | `bus` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 584 | `bush` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 585 | `business` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 586 | `businessman` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 587 | `busy` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 588 | `but` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 589 | `butter` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 590 | `button` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 591 | `buy` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 592 | `by` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 593 | `bye` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 594 | `cabin` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 595 | `cabinet` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 596 | `cable` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 597 | `cafe` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 598 | `cake` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 599 | `calculate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 600 | `calculation` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_030/stage_10.json` |
| 601 | `call` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 602 | `calm` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 603 | `camera` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 604 | `camp` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 605 | `campaign` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 606 | `camping` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 607 | `campus` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 608 | `can1` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 609 | `can2` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 610 | `canal` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 611 | `cancel` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 612 | `cancer` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 613 | `candidate` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 614 | `candle` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 615 | `cannot` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 616 | `canvas` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 617 | `cap` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 618 | `capability` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 619 | `capable` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 620 | `capacity` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_031/stage_10.json` |
| 621 | `capital` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 622 | `capitalism` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 623 | `capitalist` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 624 | `captain` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 625 | `capture` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 626 | `car` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 627 | `carbon` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 628 | `card` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 629 | `care` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 630 | `career` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 631 | `careful` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 632 | `carefully` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 633 | `careless` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 634 | `cargo` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 635 | `carpet` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 636 | `carriage` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 637 | `carrot` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 638 | `carry` | принято без изменения | нет | 15 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 639 | `cartoon` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 640 | `carve` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_032/stage_10.json` |
| 641 | `case` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 642 | `cash` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 643 | `casino` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 644 | `cast` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 645 | `castle` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 646 | `casual` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 647 | `casualty` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 648 | `cat` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 649 | `catalogue` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 650 | `catch` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 651 | `category` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 652 | `cater` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 653 | `cattle` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 654 | `cause` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 655 | `caution` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 656 | `cautious` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 657 | `cave` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 658 | `CD` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 659 | `cease` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 660 | `ceiling` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_033/stage_10.json` |
| 661 | `celebrate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 662 | `celebration` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 663 | `celebrity` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 664 | `cell` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 665 | `cemetery` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 666 | `cent` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 667 | `central` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 668 | `centre` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 669 | `century` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 670 | `ceremony` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 671 | `certain` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 672 | `certainly` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 673 | `certainty` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 674 | `certificate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 675 | `chain` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 676 | `chair` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 677 | `chairman` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 678 | `challenge` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 679 | `challenging` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 680 | `chamber` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_034/stage_10.json` |
| 681 | `champion` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 682 | `championship` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 683 | `chance` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 684 | `change` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 685 | `channel` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 686 | `chaos` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 687 | `chapter` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 688 | `character` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 689 | `characteristic` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 690 | `characterize` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 691 | `charge` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 692 | `charity` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 693 | `charm` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 694 | `charming` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 695 | `chart` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 696 | `charter` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 697 | `chase` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 698 | `chat` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 699 | `cheap` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 700 | `cheat` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_035/stage_10.json` |
| 701 | `check` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 702 | `cheek` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 703 | `cheer` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 704 | `cheerful` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 705 | `cheese` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 706 | `chef` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 707 | `chemical` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 708 | `chemistry` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 709 | `chest` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 710 | `chicken` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 711 | `chief` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 712 | `child` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 713 | `childhood` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 714 | `chip` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 715 | `chocolate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 716 | `choice` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 717 | `choir` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 718 | `choose` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 719 | `chop` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 720 | `chronic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_036/stage_10.json` |
| 721 | `chunk` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 722 | `church` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 723 | `cigarette` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 724 | `cinema` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 725 | `circle` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 726 | `circuit` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 727 | `circulate` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 728 | `circulation` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 729 | `circumstance` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 730 | `cite` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 731 | `citizen` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 732 | `citizenship` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 733 | `city` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 734 | `civic` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 735 | `civil` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 736 | `civilian` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 737 | `civilization` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 738 | `claim` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 739 | `clarify` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 740 | `clarity` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_037/stage_10.json` |
| 741 | `clash` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 742 | `class` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 743 | `classic` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 744 | `classical` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 745 | `classification` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 746 | `classify` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 747 | `classroom` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 748 | `clause` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 749 | `clean` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 750 | `clear` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 751 | `clearly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 752 | `clerk` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 753 | `clever` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 754 | `click` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 755 | `client` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 756 | `cliff` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 757 | `climate` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 758 | `climb` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 759 | `cling` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 760 | `clinic` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_038/stage_10.json` |
| 761 | `clinical` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 762 | `clip` | принято без изменения | нет | 17 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 763 | `clock` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 764 | `close` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 765 | `closed` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 766 | `closely` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 767 | `closure` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 768 | `cloth` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 769 | `clothes` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 770 | `clothing` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 771 | `cloud` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 772 | `club` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 773 | `clue` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 774 | `cluster` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 775 | `coach` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 776 | `coal` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 777 | `coalition` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 778 | `coast` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 779 | `coastal` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 780 | `coat` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_039/stage_10.json` |
| 781 | `cocktail` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 782 | `code` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 783 | `coffee` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 784 | `cognitive` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 785 | `coin` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 786 | `coincide` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 787 | `coincidence` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 788 | `cold` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 789 | `collaborate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 790 | `collaboration` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 791 | `collapse` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 792 | `colleague` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 793 | `collect` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 794 | `collection` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 795 | `collective` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 796 | `collector` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 797 | `college` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 798 | `collision` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 799 | `colonial` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 800 | `colony` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_040/stage_10.json` |
| 801 | `colour` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 802 | `coloured` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 803 | `colourful` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 804 | `column` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 805 | `columnist` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 806 | `combat` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 807 | `combination` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 808 | `combine` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 809 | `come` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 810 | `comedy` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 811 | `comfort` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 812 | `comfortable` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 813 | `comic` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 814 | `command` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 815 | `commander` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 816 | `commence` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 817 | `comment` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 818 | `commentary` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 819 | `commentator` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 820 | `commerce` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_041/stage_10.json` |
| 821 | `commercial` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 822 | `commission` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 823 | `commissioner` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 824 | `commit` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 825 | `commitment` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 826 | `committee` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 827 | `commodity` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 828 | `common` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 829 | `commonly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 830 | `communicate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 831 | `communication` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 832 | `communist` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 833 | `community` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 834 | `companion` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 835 | `company` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 836 | `comparable` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 837 | `comparative` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 838 | `compare` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 839 | `comparison` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 840 | `compassion` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_042/stage_10.json` |
| 841 | `compel` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 842 | `compelling` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 843 | `compensate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 844 | `compensation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 845 | `compete` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 846 | `competence` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 847 | `competent` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 848 | `competition` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 849 | `competitive` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 850 | `competitor` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 851 | `compile` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 852 | `complain` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 853 | `complaint` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 854 | `complement` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 855 | `complete` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 856 | `completely` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 857 | `completion` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 858 | `complex` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 859 | `complexity` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 860 | `compliance` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_043/stage_10.json` |
| 861 | `complicated` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 862 | `complication` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 863 | `comply` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 864 | `component` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 865 | `compose` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 866 | `composer` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 867 | `composition` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 868 | `compound` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 869 | `comprehensive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 870 | `comprise` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 871 | `compromise` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 872 | `compulsory` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 873 | `compute` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 874 | `computer` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 875 | `conceal` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 876 | `concede` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 877 | `conceive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 878 | `concentrate` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 879 | `concentration` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 880 | `concept` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_044/stage_10.json` |
| 881 | `conception` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 882 | `concern` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 883 | `concerned` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 884 | `concert` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 885 | `concession` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 886 | `conclude` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 887 | `conclusion` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 888 | `concrete` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 889 | `condemn` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 890 | `condition` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 891 | `conduct` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 892 | `confer` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 893 | `conference` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 894 | `confess` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 895 | `confession` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 896 | `confidence` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 897 | `confident` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 898 | `configuration` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 899 | `confine` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 900 | `confirm` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_045/stage_10.json` |
| 901 | `confirmation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 902 | `conflict` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 903 | `confront` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 904 | `confrontation` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 905 | `confuse` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 906 | `confused` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 907 | `confusing` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 908 | `confusion` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 909 | `congratulate` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 910 | `congregation` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 911 | `congressional` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 912 | `connect` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 913 | `connected` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 914 | `connection` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 915 | `conquer` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 916 | `conscience` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 917 | `conscious` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 918 | `consciousness` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 919 | `consecutive` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 920 | `consensus` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_046/stage_10.json` |
| 921 | `consent` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 922 | `consequence` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 923 | `consequently` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 924 | `conservation` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 925 | `conservative` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 926 | `conserve` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 927 | `consider` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 928 | `considerable` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 929 | `considerably` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 930 | `consideration` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 931 | `consist` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 932 | `consistency` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 933 | `consistent` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 934 | `consistently` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 935 | `consolidate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 936 | `conspiracy` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 937 | `constant` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 938 | `constantly` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 939 | `constituency` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 940 | `constitute` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_047/stage_10.json` |
| 941 | `constitution` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 942 | `constitutional` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 943 | `constraint` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 944 | `construct` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 945 | `construction` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 946 | `consult` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 947 | `consultant` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 948 | `consultation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 949 | `consume` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 950 | `consumer` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 951 | `consumption` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 952 | `contact` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 953 | `contain` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 954 | `container` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 955 | `contemplate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 956 | `contemporary` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 957 | `contempt` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 958 | `contend` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 959 | `contender` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 960 | `content` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_048/stage_10.json` |
| 961 | `contention` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 962 | `contest` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 963 | `context` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 964 | `continent` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 965 | `continually` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 966 | `continue` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 967 | `continuous` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 968 | `contract` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 969 | `contractor` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 970 | `contradiction` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 971 | `contrary` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 972 | `contrast` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 973 | `contribute` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 974 | `contribution` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 975 | `contributor` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 976 | `control` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 977 | `controversial` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 978 | `controversy` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 979 | `convenience` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 980 | `convenient` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_049/stage_10.json` |
| 981 | `convention` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 982 | `conventional` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 983 | `conversation` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 984 | `conversion` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 985 | `convert` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 986 | `convey` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 987 | `convict` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 988 | `conviction` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 989 | `convince` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 990 | `convinced` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 991 | `convincing` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 992 | `cook` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 993 | `cooker` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 994 | `cooking` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 995 | `cool` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 996 | `cooperate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 997 | `cooperative` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 998 | `coordinate` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 999 | `coordination` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 1000 | `coordinator` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_1000/batch_050/stage_10.json` |
| 1001 | `cop` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1002 | `cope` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1003 | `copper` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1004 | `copy` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1005 | `copyright` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1006 | `core` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1007 | `corner` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1008 | `corporate` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1009 | `corporation` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1010 | `correct` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1011 | `correction` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1012 | `correctly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1013 | `correlate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1014 | `correlation` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1015 | `correspond` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1016 | `correspondence` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1017 | `correspondent` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1018 | `corresponding` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1019 | `corridor` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1020 | `corrupt` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_001/stage_10.json` |
| 1021 | `corruption` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1022 | `cost` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1023 | `costly` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1024 | `costume` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1025 | `cottage` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1026 | `cotton` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1027 | `could` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1028 | `council` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1029 | `councillor` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1030 | `counselling` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1031 | `counsellor` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1032 | `count` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1033 | `counter` | принято без изменения | нет | 13 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1034 | `counterpart` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1035 | `countless` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1036 | `country` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1037 | `countryside` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1038 | `county` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1039 | `coup` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1040 | `couple` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_002/stage_10.json` |
| 1041 | `courage` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1042 | `course` | принято без изменения | нет | 14 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1043 | `court` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1044 | `courtesy` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1045 | `cousin` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1046 | `cover` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1047 | `coverage` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1048 | `covered` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1049 | `cow` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1050 | `crack` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1051 | `craft` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1052 | `crash` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1053 | `crawl` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1054 | `crazy` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1055 | `cream` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1056 | `create` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1057 | `creation` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1058 | `creative` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1059 | `creativity` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1060 | `creator` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_003/stage_10.json` |
| 1061 | `creature` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1062 | `credibility` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1063 | `credible` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1064 | `credit` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1065 | `creep` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1066 | `crew` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1067 | `crime` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1068 | `criminal` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1069 | `crisis` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1070 | `criterion` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1071 | `critic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1072 | `critical` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1073 | `critically` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1074 | `criticism` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1075 | `criticize` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1076 | `critique` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1077 | `crop` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1078 | `cross` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1079 | `crowd` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1080 | `crowded` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_004/stage_10.json` |
| 1081 | `crown` | принято без изменения | нет | 18 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1082 | `crucial` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1083 | `crude` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1084 | `cruel` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1085 | `cruise` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1086 | `crush` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1087 | `cry` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1088 | `crystal` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1089 | `cue` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1090 | `cult` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1091 | `cultivate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1092 | `cultural` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1093 | `culture` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1094 | `cup` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1095 | `cupboard` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1096 | `cure` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1097 | `curiosity` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1098 | `curious` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1099 | `curly` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1100 | `currency` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_005/stage_10.json` |
| 1101 | `current` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1102 | `currently` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1103 | `curriculum` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1104 | `curtain` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1105 | `curve` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1106 | `curved` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1107 | `custody` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1108 | `custom` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1109 | `customer` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1110 | `cut` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1111 | `cute` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1112 | `cutting` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1113 | `cycle` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1114 | `cynical` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1115 | `dad` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1116 | `daily` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1117 | `dairy` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1118 | `dam` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1119 | `damage` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1120 | `damaging` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_006/stage_10.json` |
| 1121 | `dance` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1122 | `dancer` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1123 | `dancing` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1124 | `danger` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1125 | `dangerous` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1126 | `dare` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1127 | `dark` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1128 | `darkness` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1129 | `data` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1130 | `database` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1131 | `date` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1132 | `daughter` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1133 | `dawn` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1134 | `day` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1135 | `dead` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1136 | `deadline` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1137 | `deadly` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1138 | `deal` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1139 | `dealer` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1140 | `dear` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_007/stage_10.json` |
| 1141 | `death` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1142 | `debate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1143 | `debris` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1144 | `debt` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1145 | `debut` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1146 | `decade` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1147 | `December` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1148 | `decent` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1149 | `decide` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1150 | `decision` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1151 | `decision-making` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1152 | `decisive` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1153 | `deck` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1154 | `declaration` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1155 | `declare` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1156 | `decline` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1157 | `decorate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1158 | `decoration` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1159 | `decrease` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1160 | `dedicated` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_008/stage_10.json` |
| 1161 | `dedication` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1162 | `deed` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1163 | `deem` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1164 | `deep` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1165 | `deeply` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1166 | `default` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1167 | `defeat` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1168 | `defect` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1169 | `defence` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1170 | `defend` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1171 | `defender` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1172 | `defensive` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1173 | `deficiency` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1174 | `deficit` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1175 | `define` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1176 | `definite` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1177 | `definitely` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1178 | `definition` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1179 | `defy` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1180 | `degree` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_009/stage_10.json` |
| 1181 | `delay` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1182 | `delegate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1183 | `delegation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1184 | `delete` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1185 | `deliberate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1186 | `deliberately` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1187 | `delicate` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1188 | `delicious` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1189 | `delight` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1190 | `delighted` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1191 | `deliver` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1192 | `delivery` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1193 | `demand` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1194 | `democracy` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1195 | `democratic` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1196 | `demon` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1197 | `demonstrate` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1198 | `demonstration` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1199 | `denial` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1200 | `denounce` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_010/stage_10.json` |
| 1201 | `dense` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1202 | `density` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1203 | `dentist` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1204 | `deny` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1205 | `depart` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1206 | `department` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1207 | `departure` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1208 | `depend` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1209 | `dependence` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1210 | `dependent` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1211 | `depict` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1212 | `deploy` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1213 | `deployment` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1214 | `deposit` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1215 | `depressed` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1216 | `depressing` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1217 | `depression` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1218 | `deprive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1219 | `depth` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1220 | `deputy` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_011/stage_10.json` |
| 1221 | `derive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1222 | `descend` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1223 | `descent` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1224 | `describe` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1225 | `description` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1226 | `desert` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1227 | `deserve` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1228 | `design` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1229 | `designate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1230 | `designer` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1231 | `desirable` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1232 | `desire` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1233 | `desk` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1234 | `desktop` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1235 | `desperate` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1236 | `desperately` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1237 | `despite` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1238 | `destination` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1239 | `destroy` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1240 | `destruction` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_012/stage_10.json` |
| 1241 | `destructive` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1242 | `detail` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1243 | `detailed` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1244 | `detain` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1245 | `detect` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1246 | `detection` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1247 | `detective` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1248 | `detention` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1249 | `deteriorate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1250 | `determination` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1251 | `determine` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1252 | `determined` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1253 | `devastate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1254 | `develop` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1255 | `development` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1256 | `device` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1257 | `devil` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1258 | `devise` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1259 | `devote` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1260 | `diagnose` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_013/stage_10.json` |
| 1261 | `diagnosis` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1262 | `diagram` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1263 | `dialogue` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1264 | `diamond` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1265 | `diary` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1266 | `dictate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1267 | `dictator` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1268 | `dictionary` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1269 | `die` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1270 | `diet` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1271 | `differ` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1272 | `difference` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1273 | `different` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1274 | `differentiate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1275 | `differently` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1276 | `difficult` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1277 | `difficulty` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1278 | `dig` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1279 | `digital` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1280 | `dignity` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_014/stage_10.json` |
| 1281 | `dilemma` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1282 | `dimension` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1283 | `diminish` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1284 | `dinner` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1285 | `dip` | принято без изменения | нет | 16 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1286 | `diplomat` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1287 | `diplomatic` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1288 | `direct` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1289 | `direction` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1290 | `directly` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1291 | `director` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1292 | `directory` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1293 | `dirt` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1294 | `dirty` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1295 | `disability` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1296 | `disabled` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1297 | `disadvantage` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1298 | `disagree` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1299 | `disagreement` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1300 | `disappear` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_015/stage_10.json` |
| 1301 | `disappoint` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1302 | `disappointed` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1303 | `disappointing` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1304 | `disappointment` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1305 | `disaster` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1306 | `disastrous` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1307 | `disc` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1308 | `discard` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1309 | `discharge` | принято без изменения | нет | 27 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1310 | `discipline` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1311 | `disclose` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1312 | `disclosure` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1313 | `discount` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1314 | `discourage` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1315 | `discourse` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1316 | `discover` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1317 | `discovery` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1318 | `discretion` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1319 | `discrimination` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1320 | `discuss` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_016/stage_10.json` |
| 1321 | `discussion` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1322 | `disease` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1323 | `dish` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1324 | `dishonest` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1325 | `disk` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1326 | `dislike` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1327 | `dismiss` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1328 | `dismissal` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1329 | `disorder` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1330 | `displace` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1331 | `display` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1332 | `disposal` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1333 | `dispose` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1334 | `dispute` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1335 | `disrupt` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1336 | `disruption` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1337 | `dissolve` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1338 | `distance` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1339 | `distant` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1340 | `distinct` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_017/stage_10.json` |
| 1341 | `distinction` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1342 | `distinctive` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1343 | `distinguish` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1344 | `distort` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1345 | `distract` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1346 | `distress` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1347 | `distribute` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1348 | `distribution` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1349 | `district` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1350 | `disturb` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1351 | `disturbing` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1352 | `dive` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1353 | `diverse` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1354 | `diversity` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1355 | `divert` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1356 | `divide` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1357 | `divine` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1358 | `division` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1359 | `divorce` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1360 | `divorced` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_018/stage_10.json` |
| 1361 | `do` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1362 | `doctor` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1363 | `doctrine` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1364 | `document` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1365 | `documentary` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1366 | `documentation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1367 | `dog` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1368 | `dollar` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1369 | `domain` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1370 | `domestic` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1371 | `dominance` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1372 | `dominant` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1373 | `dominate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1374 | `donate` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1375 | `donation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1376 | `donor` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1377 | `door` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1378 | `dose` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1379 | `dot` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1380 | `double` | принято без изменения | нет | 22 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_019/stage_10.json` |
| 1381 | `doubt` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1382 | `down` | принято без изменения | нет | 18 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1383 | `download` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1384 | `downstairs` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1385 | `downtown` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1386 | `downwards` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1387 | `dozen` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1388 | `draft` | принято без изменения | нет | 14 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1389 | `drag` | принято без изменения | нет | 17 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1390 | `drain` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1391 | `drama` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1392 | `dramatic` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1393 | `dramatically` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1394 | `draw` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1395 | `drawing` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1396 | `dream` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1397 | `dress` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1398 | `dressed` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1399 | `drift` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1400 | `drink` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_020/stage_10.json` |
| 1401 | `drive` | принято без изменения | нет | 20 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1402 | `driver` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1403 | `driving` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1404 | `drop` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1405 | `drought` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1406 | `drown` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1407 | `drug` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1408 | `drum` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1409 | `drunk` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1410 | `dry` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1411 | `dual` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1412 | `dub` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1413 | `due` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1414 | `dull` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1415 | `dumb` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1416 | `dump` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1417 | `duo` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1418 | `duration` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1419 | `during` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1420 | `dust` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_021/stage_10.json` |
| 1421 | `duty` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1422 | `DVD` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1423 | `dynamic` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1424 | `each` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1425 | `eager` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1426 | `ear` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1427 | `early` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1428 | `earn` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1429 | `earnings` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1430 | `earth` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1431 | `earthquake` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1432 | `ease` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1433 | `easily` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1434 | `east` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1435 | `eastern` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1436 | `easy` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1437 | `eat` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1438 | `echo` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1439 | `ecological` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1440 | `economic` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_022/stage_10.json` |
| 1441 | `economics` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1442 | `economist` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1443 | `economy` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1444 | `edge` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1445 | `edit` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1446 | `edition` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1447 | `editor` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1448 | `editorial` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1449 | `educate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1450 | `educated` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1451 | `education` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1452 | `educational` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1453 | `educator` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1454 | `effect` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1455 | `effective` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1456 | `effectively` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1457 | `effectiveness` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1458 | `efficiency` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1459 | `efficient` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1460 | `efficiently` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_023/stage_10.json` |
| 1461 | `effort` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1462 | `egg` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1463 | `ego` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1464 | `eight` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1465 | `eighteen` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1466 | `eighty` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1467 | `either` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1468 | `elaborate` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1469 | `elbow` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1470 | `elderly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1471 | `elect` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1472 | `election` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1473 | `electoral` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1474 | `electric` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1475 | `electrical` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1476 | `electricity` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1477 | `electronic` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1478 | `electronics` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1479 | `elegant` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1480 | `element` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_024/stage_10.json` |
| 1481 | `elementary` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1482 | `elephant` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1483 | `elevate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1484 | `eleven` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1485 | `eligible` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1486 | `eliminate` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1487 | `elite` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1488 | `else` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1489 | `elsewhere` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1490 | `email` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1491 | `embark` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1492 | `embarrassed` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1493 | `embarrassing` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1494 | `embarrassment` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1495 | `embassy` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1496 | `embed` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1497 | `embody` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1498 | `embrace` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1499 | `emerge` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1500 | `emergence` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_025/stage_10.json` |
| 1501 | `emergency` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1502 | `emission` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1503 | `emotion` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1504 | `emotional` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1505 | `emotionally` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1506 | `emphasis` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1507 | `emphasize` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1508 | `empire` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1509 | `empirical` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1510 | `employ` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1511 | `employee` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1512 | `employer` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1513 | `employment` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1514 | `empower` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1515 | `empty` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1516 | `enable` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1517 | `enact` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1518 | `encompass` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1519 | `encounter` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1520 | `encourage` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_026/stage_10.json` |
| 1521 | `encouragement` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1522 | `encouraging` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1523 | `end` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1524 | `endeavour` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1525 | `ending` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1526 | `endless` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1527 | `endorse` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1528 | `endorsement` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1529 | `endure` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1530 | `enemy` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1531 | `energy` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1532 | `enforce` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1533 | `enforcement` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1534 | `engage` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1535 | `engaged` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1536 | `engagement` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1537 | `engaging` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1538 | `engine` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1539 | `engineer` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1540 | `engineering` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_027/stage_10.json` |
| 1541 | `enhance` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1542 | `enjoy` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1543 | `enjoyable` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1544 | `enormous` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1545 | `enough` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1546 | `enquire` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1547 | `enquiry` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1548 | `enrich` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1549 | `enrol` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1550 | `ensue` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1551 | `ensure` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1552 | `enter` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1553 | `enterprise` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1554 | `entertain` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1555 | `entertaining` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1556 | `entertainment` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1557 | `enthusiasm` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1558 | `enthusiast` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1559 | `enthusiastic` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1560 | `entire` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_028/stage_10.json` |
| 1561 | `entirely` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1562 | `entitle` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1563 | `entity` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1564 | `entrance` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1565 | `entrepreneur` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1566 | `entry` | принято без изменения | нет | 15 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1567 | `envelope` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1568 | `environment` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1569 | `environmental` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1570 | `epidemic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1571 | `episode` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1572 | `equal` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1573 | `equality` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1574 | `equally` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1575 | `equation` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1576 | `equip` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1577 | `equipment` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1578 | `equivalent` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1579 | `era` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1580 | `erect` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_029/stage_10.json` |
| 1581 | `error` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1582 | `erupt` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1583 | `escalate` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1584 | `escape` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1585 | `especially` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1586 | `essay` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1587 | `essence` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1588 | `essential` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1589 | `essentially` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1590 | `establish` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1591 | `establishment` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1592 | `estate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1593 | `estimate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1594 | `eternal` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1595 | `ethic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1596 | `ethical` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1597 | `ethnic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1598 | `euro` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1599 | `evacuate` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1600 | `evaluate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_030/stage_10.json` |
| 1601 | `evaluation` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1602 | `even` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1603 | `evening` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1604 | `event` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1605 | `eventually` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1606 | `ever` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1607 | `every` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1608 | `everybody` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1609 | `everyday` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1610 | `everyone` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1611 | `everything` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1612 | `everywhere` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1613 | `evidence` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1614 | `evident` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1615 | `evil` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1616 | `evoke` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1617 | `evolution` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1618 | `evolutionary` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1619 | `evolve` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1620 | `exact` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_031/stage_10.json` |
| 1621 | `exactly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1622 | `exaggerate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1623 | `exam` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1624 | `examination` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1625 | `examine` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1626 | `example` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1627 | `exceed` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1628 | `excellence` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1629 | `excellent` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1630 | `except` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1631 | `exception` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1632 | `exceptional` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1633 | `excess` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1634 | `excessive` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1635 | `exchange` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1636 | `excited` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1637 | `excitement` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1638 | `exciting` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1639 | `exclude` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1640 | `exclusion` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_032/stage_10.json` |
| 1641 | `exclusive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1642 | `exclusively` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1643 | `excuse` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1644 | `execute` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1645 | `execution` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1646 | `executive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1647 | `exercise` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1648 | `exert` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1649 | `exhibit` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1650 | `exhibition` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1651 | `exile` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1652 | `exist` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1653 | `existence` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1654 | `exit` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1655 | `exotic` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1656 | `expand` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1657 | `expansion` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1658 | `expect` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1659 | `expectation` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1660 | `expected` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_033/stage_10.json` |
| 1661 | `expedition` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1662 | `expenditure` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1663 | `expense` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1664 | `expensive` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1665 | `experience` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1666 | `experienced` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1667 | `experiment` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1668 | `experimental` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1669 | `expert` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1670 | `expertise` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1671 | `expire` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1672 | `explain` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1673 | `explanation` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1674 | `explicit` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1675 | `explicitly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1676 | `explode` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1677 | `exploit` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1678 | `exploitation` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1679 | `exploration` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1680 | `explore` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_034/stage_10.json` |
| 1681 | `explosion` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1682 | `explosive` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1683 | `export` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1684 | `expose` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1685 | `exposure` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1686 | `express` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1687 | `expression` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1688 | `extend` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1689 | `extension` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1690 | `extensive` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1691 | `extensively` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1692 | `extent` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1693 | `external` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1694 | `extra` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1695 | `extract` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1696 | `extraordinary` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1697 | `extreme` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1698 | `extremely` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1699 | `extremist` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1700 | `eye` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_035/stage_10.json` |
| 1701 | `fabric` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1702 | `fabulous` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1703 | `face` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1704 | `facilitate` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1705 | `facility` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1706 | `fact` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1707 | `faction` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1708 | `factor` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1709 | `factory` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1710 | `faculty` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1711 | `fade` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1712 | `fail` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1713 | `failed` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1714 | `failure` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1715 | `fair` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1716 | `fairly` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1717 | `fairness` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1718 | `faith` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1719 | `fake` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1720 | `fall` | принято без изменения | нет | 22 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_036/stage_10.json` |
| 1721 | `false` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1722 | `fame` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1723 | `familiar` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1724 | `family` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1725 | `famous` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1726 | `fan` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1727 | `fancy` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1728 | `fantastic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1729 | `fantasy` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1730 | `far` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1731 | `fare` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1732 | `farm` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1733 | `farmer` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1734 | `farming` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1735 | `fascinating` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1736 | `fashion` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1737 | `fashionable` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1738 | `fast` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1739 | `fasten` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1740 | `fat` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_037/stage_10.json` |
| 1741 | `fatal` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1742 | `fate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1743 | `father` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1744 | `fault` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1745 | `favour` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1746 | `favourable` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1747 | `favourite` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1748 | `fear` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1749 | `feat` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1750 | `feather` | принято без изменения | нет | 13 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1751 | `feature` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1752 | `February` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1753 | `federal` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1754 | `fee` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1755 | `feed` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1756 | `feedback` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1757 | `feel` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1758 | `feeling` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1759 | `fellow` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1760 | `female` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_038/stage_10.json` |
| 1761 | `feminist` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1762 | `fence` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1763 | `festival` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1764 | `fever` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1765 | `few` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1766 | `fibre` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1767 | `fiction` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1768 | `field` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1769 | `fierce` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1770 | `fifteen` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1771 | `fifth` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1772 | `fifty` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1773 | `fight` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1774 | `fighting` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1775 | `figure` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1776 | `file` | принято без изменения | нет | 14 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1777 | `fill` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1778 | `film` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1779 | `film-maker` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1780 | `filter` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_039/stage_10.json` |
| 1781 | `final` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1782 | `finally` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1783 | `finance` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1784 | `financial` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1785 | `find` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1786 | `finding` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1787 | `fine` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1788 | `finger` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1789 | `finish` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1790 | `fire` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1791 | `firearm` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1792 | `firefighter` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1793 | `firework` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1794 | `firm` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1795 | `firmly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1796 | `first` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1797 | `firstly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1798 | `fish` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1799 | `fishing` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1800 | `fit` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_040/stage_10.json` |
| 1801 | `fitness` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1802 | `five` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1803 | `fix` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1804 | `fixed` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1805 | `fixture` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1806 | `flag` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1807 | `flame` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1808 | `flash` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1809 | `flat` | принято без изменения | нет | 25 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1810 | `flavour` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1811 | `flaw` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1812 | `flawed` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1813 | `flee` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1814 | `fleet` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1815 | `flesh` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1816 | `flexibility` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1817 | `flexible` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1818 | `flight` | принято без изменения | нет | 12 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1819 | `float` | принято без изменения | нет | 20 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1820 | `flood` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_041/stage_10.json` |
| 1821 | `floor` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1822 | `flour` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1823 | `flourish` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1824 | `flow` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1825 | `flower` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1826 | `flu` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1827 | `fluid` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1828 | `fly1` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1829 | `fly2` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1830 | `fly3` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1831 | `flying` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1832 | `focus` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1833 | `fold` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1834 | `folding` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1835 | `folk` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1836 | `follow` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1837 | `following` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1838 | `fond` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1839 | `food` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1840 | `fool` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_042/stage_10.json` |
| 1841 | `foot` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1842 | `footage` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1843 | `football` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1844 | `for` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1845 | `forbid` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1846 | `force` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1847 | `forecast` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1848 | `foreign` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1849 | `foreigner` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1850 | `forest` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1851 | `forever` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1852 | `forge` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1853 | `forget` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1854 | `forgive` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1855 | `fork` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1856 | `form` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1857 | `formal` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1858 | `format` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1859 | `formation` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1860 | `former` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_043/stage_10.json` |
| 1861 | `formerly` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1862 | `formula` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1863 | `formulate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1864 | `forth` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1865 | `forthcoming` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1866 | `fortunate` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1867 | `fortunately` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1868 | `fortune` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1869 | `forty` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1870 | `forum` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1871 | `forward` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1872 | `fossil` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1873 | `foster` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1874 | `found` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1875 | `foundation` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1876 | `founder` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1877 | `four` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1878 | `fourteen` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1879 | `fourth` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1880 | `fraction` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_044/stage_10.json` |
| 1881 | `fragile` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1882 | `fragment` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1883 | `frame` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1884 | `framework` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1885 | `franchise` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1886 | `frankly` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1887 | `fraud` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1888 | `free` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1889 | `freedom` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1890 | `freely` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1891 | `freeze` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1892 | `frequency` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1893 | `frequent` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1894 | `frequently` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1895 | `fresh` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1896 | `Friday` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1897 | `fridge` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1898 | `friend` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1899 | `friendly` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1900 | `friendship` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_045/stage_10.json` |
| 1901 | `frighten` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1902 | `frightened` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1903 | `frightening` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1904 | `frog` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1905 | `from` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1906 | `front` | принято без изменения | нет | 11 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1907 | `frozen` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1908 | `fruit` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1909 | `frustrated` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1910 | `frustrating` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1911 | `frustration` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1912 | `fry` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1913 | `fuel` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1914 | `fulfil` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1915 | `full` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1916 | `full-time` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1917 | `fully` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1918 | `fun` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1919 | `function` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1920 | `functional` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_046/stage_10.json` |
| 1921 | `fund` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1922 | `fundamental` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1923 | `fundamentally` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1924 | `funding` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1925 | `fundraising` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1926 | `funeral` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1927 | `funny` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1928 | `fur` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1929 | `furious` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1930 | `furniture` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1931 | `further` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1932 | `furthermore` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1933 | `future` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1934 | `gain` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1935 | `gallery` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1936 | `gallon` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1937 | `gambling` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1938 | `game` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1939 | `gaming` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1940 | `gang` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_047/stage_10.json` |
| 1941 | `gap` | принято без изменения | нет | 8 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1942 | `garage` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1943 | `garden` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1944 | `gas` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1945 | `gate` | принято без изменения | нет | 10 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1946 | `gather` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1947 | `gathering` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1948 | `gay` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1949 | `gaze` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1950 | `gear` | принято без изменения | нет | 9 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1951 | `gender` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1952 | `gene` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1953 | `general` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1954 | `generally` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1955 | `generate` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1956 | `generation` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1957 | `generic` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1958 | `generous` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1959 | `genetic` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1960 | `genius` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_048/stage_10.json` |
| 1961 | `genocide` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1962 | `genre` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1963 | `gentle` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1964 | `gentleman` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1965 | `genuine` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1966 | `genuinely` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1967 | `geography` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1968 | `gesture` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1969 | `get` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1970 | `ghost` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1971 | `giant` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1972 | `gift` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1973 | `gig` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1974 | `girl` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1975 | `girlfriend` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1976 | `give` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1977 | `glad` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1978 | `glance` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1979 | `glass` | принято без изменения | нет | 14 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1980 | `glimpse` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_049/stage_10.json` |
| 1981 | `global` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1982 | `globalization` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1983 | `globe` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1984 | `glorious` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1985 | `glory` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1986 | `glove` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1987 | `go` | принято без изменения | нет | 7 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1988 | `goal` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1989 | `god` | принято без изменения | нет | 4 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1990 | `gold` | принято без изменения | нет | 6 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1991 | `golden` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1992 | `golf` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1993 | `good` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1994 | `goodbye` | принято без изменения | нет | 2 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1995 | `goodness` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1996 | `goods` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1997 | `gorgeous` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1998 | `govern` | принято без изменения | нет | 5 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 1999 | `governance` | принято без изменения | нет | 1 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 2000 | `government` | принято без изменения | нет | 3 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_2000/batch_050/stage_10.json` |
| 2001 | `governor` | review_required | нет | 8 | 0 | 8 | Независимая защита governor: stage06 содержит 3 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 0 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2002 | `grab` | review_required | нет | 4 | 0 | 4 | Независимая защита grab: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2003 | `grace` | review_required | нет | 9 | 0 | 9 | Независимая защита grace: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 7 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2004 | `grade` | review_required | нет | 4 | 0 | 4 | Независимая защита grade: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2005 | `gradually` | review_required | нет | 1 | 0 | 1 | Независимая защита gradually: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2006 | `graduate` | review_required | нет | 6 | 0 | 6 | Независимая защита graduate: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2007 | `grain` | review_required | нет | 10 | 0 | 10 | Независимая защита grain: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 1 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2008 | `grand` | review_required | нет | 11 | 0 | 11 | Независимая защита grand: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 1 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2009 | `grandfather` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2010 | `grandmother` | review_required | нет | 1 | 0 | 1 | Независимая защита grandmother: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2011 | `grandparent` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2012 | `grant` | review_required | нет | 8 | 0 | 8 | Независимая защита grant: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 2 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2013 | `graphic` | review_required | нет | 1 | 0 | 1 | Независимая защита graphic: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2014 | `graphics` | review_required | нет | 1 | 0 | 1 | Независимая защита graphics: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2015 | `grasp` | review_required | нет | 3 | 0 | 3 | Независимая защита grasp: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 4 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2016 | `grass` | review_required | нет | 14 | 0 | 14 | Независимая защита grass: stage06 содержит 4 найденных локаторов, stage08 проверил 16 значений, stage09 проверил 3 примеров; пустых значений 14, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 14 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2017 | `grateful` | review_required | нет | 2 | 0 | 2 | Независимая защита grateful: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2018 | `grave` | review_required | нет | 10 | 0 | 10 | Независимая защита grave: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 0 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2019 | `gravity` | review_required | нет | 5 | 0 | 5 | Независимая защита gravity: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2020 | `great` | review_required | нет | 5 | 0 | 5 | Независимая защита great: stage06 содержит 4 найденных локаторов, stage08 проверил 15 значений, stage09 проверил 16 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_001/stage_10.json` |
| 2021 | `greatly` | review_required | нет | 2 | 0 | 2 | Независимая защита greatly: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2022 | `green` | review_required | нет | 15 | 0 | 15 | Независимая защита green: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 4 примеров; пустых значений 15, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 15 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2023 | `greenhouse` | review_required | нет | 1 | 0 | 1 | Независимая защита greenhouse: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2024 | `greet` | review_required | нет | 4 | 0 | 4 | Независимая защита greet: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2025 | `grey` | review_required | нет | 10 | 0 | 10 | Независимая защита grey: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 2 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2026 | `grid` | review_required | нет | 4 | 0 | 4 | Независимая защита grid: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2027 | `grief` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2028 | `grin` | review_required | нет | 1 | 0 | 1 | Независимая защита grin: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2029 | `grind` | review_required | нет | 15 | 0 | 15 | Независимая защита grind: stage06 содержит 4 найденных локаторов, stage08 проверил 16 значений, stage09 проверил 1 примеров; пустых значений 15, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 15 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2030 | `grip` | review_required | нет | 10 | 0 | 10 | Независимая защита grip: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 4 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2031 | `grocery` | review_required | нет | 2 | 0 | 2 | Независимая защита grocery: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2032 | `gross` | review_required | нет | 9 | 0 | 9 | Независимая защита gross: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 9 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2033 | `ground` | review_required | нет | 15 | 0 | 15 | Независимая защита ground: stage06 содержит 4 найденных локаторов, stage08 проверил 22 значений, stage09 проверил 10 примеров; пустых значений 15, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 15 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2034 | `group` | review_required | нет | 8 | 0 | 8 | Независимая защита group: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 1 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2035 | `grow` | review_required | нет | 3 | 0 | 3 | Независимая защита grow: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2036 | `growth` | review_required | нет | 6 | 0 | 6 | Независимая защита growth: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2037 | `guarantee` | review_required | нет | 7 | 0 | 7 | Независимая защита guarantee: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 0 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2038 | `guard` | review_required | нет | 9 | 0 | 9 | Независимая защита guard: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 7 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2039 | `guerrilla` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2040 | `guess` | review_required | нет | 2 | 0 | 2 | Независимая защита guess: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_002/stage_10.json` |
| 2041 | `guest` | review_required | нет | 2 | 0 | 2 | Независимая защита guest: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2042 | `guidance` | review_required | нет | 1 | 0 | 1 | Независимая защита guidance: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2043 | `guide` | review_required | нет | 12 | 0 | 12 | Независимая защита guide: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 0 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2044 | `guideline` | review_required | нет | 2 | 0 | 2 | Независимая защита guideline: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2045 | `guilt` | review_required | нет | 3 | 0 | 3 | Независимая защита guilt: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2046 | `guilty` | review_required | нет | 2 | 0 | 2 | Независимая защита guilty: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2047 | `guitar` | review_required | нет | 1 | 0 | 1 | Независимая защита guitar: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2048 | `gun` | review_required | нет | 11 | 0 | 11 | Независимая защита gun: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 4 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2049 | `gut` | review_required | нет | 10 | 0 | 10 | Независимая защита gut: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 3 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2050 | `guy` | review_required | нет | 6 | 0 | 6 | Независимая защита guy: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2051 | `gym` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2052 | `habit` | review_required | нет | 4 | 0 | 4 | Независимая защита habit: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 7 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2053 | `habitat` | review_required | нет | 1 | 0 | 1 | Независимая защита habitat: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2054 | `hail` | review_required | нет | 5 | 0 | 5 | Независимая защита hail: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 3 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2055 | `hair` | review_required | нет | 4 | 0 | 4 | Независимая защита hair: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2056 | `half` | review_required | нет | 9 | 0 | 9 | Независимая защита half: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 5 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2057 | `halfway` | review_required | нет | 3 | 0 | 3 | Независимая защита halfway: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2058 | `hall` | review_required | нет | 7 | 0 | 7 | Независимая защита hall: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 3 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2059 | `halt` | review_required | нет | 6 | 0 | 6 | Независимая защита halt: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2060 | `hand` | review_required | нет | 11 | 0 | 11 | Независимая защита hand: stage06 содержит 4 найденных локаторов, stage08 проверил 25 значений, stage09 проверил 24 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_003/stage_10.json` |
| 2061 | `handful` | review_required | нет | 2 | 0 | 2 | Независимая защита handful: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2062 | `handle` | review_required | нет | 7 | 0 | 7 | Независимая защита handle: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 3 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2063 | `handling` | review_required | нет | 2 | 0 | 2 | Независимая защита handling: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2064 | `handy` | review_required | нет | 4 | 0 | 4 | Независимая защита handy: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2065 | `hang` | review_required | нет | 6 | 0 | 6 | Независимая защита hang: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 7 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2066 | `happen` | review_required | нет | 2 | 0 | 2 | Независимая защита happen: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2067 | `happily` | review_required | нет | 3 | 0 | 3 | Независимая защита happily: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2068 | `happiness` | review_required | нет | 1 | 0 | 1 | Независимая защита happiness: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2069 | `happy` | review_required | нет | 2 | 0 | 2 | Независимая защита happy: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 7 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2070 | `harassment` | review_required | нет | 1 | 0 | 1 | Независимая защита harassment: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2071 | `harbour` | review_required | нет | 5 | 0 | 5 | Независимая защита harbour: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2072 | `hard` | review_required | нет | 11 | 0 | 11 | Независимая защита hard: stage06 содержит 4 найденных локаторов, stage08 проверил 26 значений, stage09 проверил 20 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2073 | `hardly` | review_required | нет | 2 | 0 | 2 | Независимая защита hardly: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2074 | `hardware` | review_required | нет | 3 | 0 | 3 | Независимая защита hardware: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2075 | `harm` | review_required | нет | 1 | 0 | 1 | Независимая защита harm: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 5 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2076 | `harmful` | review_required | нет | 1 | 0 | 1 | Независимая защита harmful: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2077 | `harmony` | review_required | нет | 1 | 0 | 1 | Независимая защита harmony: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2078 | `harsh` | review_required | нет | 3 | 0 | 3 | Независимая защита harsh: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2079 | `harvest` | review_required | нет | 6 | 0 | 6 | Независимая защита harvest: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2080 | `hat` | review_required | нет | 1 | 0 | 1 | Независимая защита hat: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_004/stage_10.json` |
| 2081 | `hate` | review_required | нет | 3 | 0 | 3 | Независимая защита hate: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2082 | `hatred` | review_required | нет | 1 | 0 | 1 | Независимая защита hatred: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2083 | `haunt` | review_required | нет | 6 | 0 | 6 | Независимая защита haunt: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2084 | `have` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2085 | `have to` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2086 | `hazard` | review_required | нет | 4 | 0 | 4 | Независимая защита hazard: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 4 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2087 | `he` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2088 | `head` | review_required | нет | 24 | 0 | 24 | Независимая защита head: stage06 содержит 4 найденных локаторов, stage08 проверил 40 значений, stage09 проверил 23 примеров; пустых значений 24, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 24 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2089 | `headache` | review_required | нет | 1 | 0 | 1 | Независимая защита headache: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2090 | `headline` | review_required | нет | 5 | 0 | 5 | Независимая защита headline: stage06 содержит 3 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2091 | `headquarters` | review_required | нет | 3 | 0 | 3 | Независимая защита headquarters: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2092 | `heal` | review_required | нет | 4 | 0 | 4 | Независимая защита heal: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2093 | `health` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2094 | `healthcare` | review_required | нет | 1 | 0 | 1 | Независимая защита healthcare: stage06 содержит 0 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2095 | `healthy` | review_required | нет | 5 | 0 | 5 | Независимая защита healthy: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2096 | `hear` | review_required | нет | 4 | 0 | 4 | Независимая защита hear: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2097 | `hearing` | review_required | нет | 3 | 0 | 3 | Независимая защита hearing: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 4 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2098 | `heart` | review_required | нет | 1 | 0 | 1 | Независимая защита heart: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 21 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2099 | `heat` | review_required | нет | 13 | 0 | 13 | Независимая защита heat: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 1 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2100 | `heating` | review_required | нет | 4 | 0 | 4 | Независимая защита heating: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_005/stage_10.json` |
| 2101 | `heaven` | review_required | нет | 2 | 0 | 2 | Независимая защита heaven: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2102 | `heavily` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2103 | `heavy` | review_required | нет | 17 | 0 | 17 | Независимая защита heavy: stage06 содержит 4 найденных локаторов, stage08 проверил 27 значений, stage09 проверил 16 примеров; пустых значений 17, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 17 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2104 | `heel` | review_required | нет | 12 | 0 | 12 | Независимая защита heel: stage06 содержит 4 найденных локаторов, stage08 проверил 15 значений, stage09 проверил 4 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2105 | `height` | review_required | нет | 1 | 0 | 1 | Независимая защита height: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2106 | `heighten` | review_required | нет | 2 | 0 | 2 | Независимая защита heighten: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2107 | `helicopter` | review_required | нет | 2 | 0 | 2 | Независимая защита helicopter: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2108 | `hell` | review_required | нет | 1 | 0 | 1 | Независимая защита hell: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2109 | `hello` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2110 | `helmet` | review_required | нет | 2 | 0 | 2 | Независимая защита helmet: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2111 | `help` | review_required | нет | 2 | 0 | 2 | Независимая защита help: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 14 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2112 | `helpful` | review_required | нет | 1 | 0 | 1 | Независимая защита helpful: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2113 | `hence` | review_required | нет | 2 | 0 | 2 | Независимая защита hence: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2114 | `her` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2115 | `herb` | review_required | нет | 1 | 0 | 1 | Независимая защита herb: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2116 | `here` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2117 | `heritage` | review_required | нет | 1 | 0 | 1 | Независимая защита heritage: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2118 | `hero` | review_required | нет | 3 | 0 | 3 | Независимая защита hero: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2119 | `hers` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2120 | `herself` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_006/stage_10.json` |
| 2121 | `hesitate` | review_required | нет | 1 | 0 | 1 | Независимая защита hesitate: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2122 | `hey` | review_required | нет | 1 | 0 | 1 | Независимая защита hey: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2123 | `hi` | review_required | нет | 2 | 0 | 2 | Независимая защита hi: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2124 | `hidden` | review_required | нет | 1 | 0 | 1 | Независимая защита hidden: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2125 | `hide` | review_required | нет | 3 | 0 | 3 | Независимая защита hide: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2126 | `hierarchy` | review_required | нет | 2 | 0 | 2 | Независимая защита hierarchy: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2127 | `high` | review_required | нет | 13 | 0 | 13 | Независимая защита high: stage06 содержит 4 найденных локаторов, stage08 проверил 26 значений, stage09 проверил 19 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2128 | `high-profile` | review_required | нет | 1 | 0 | 1 | Независимая защита high-profile: stage06 содержит 0 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2129 | `highlight` | review_required | нет | 4 | 0 | 4 | Независимая защита highlight: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2130 | `highly` | review_required | нет | 2 | 0 | 2 | Независимая защита highly: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2131 | `highway` | review_required | нет | 3 | 0 | 3 | Независимая защита highway: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2132 | `hilarious` | review_required | нет | 1 | 0 | 1 | Независимая защита hilarious: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2133 | `hill` | review_required | нет | 4 | 0 | 4 | Независимая защита hill: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2134 | `him` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2135 | `himself` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2136 | `hint` | review_required | нет | 1 | 0 | 1 | Независимая защита hint: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 5 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2137 | `hip` | review_required | нет | 4 | 0 | 4 | Независимая защита hip: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2138 | `hire` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2139 | `his` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2140 | `historian` | review_required | нет | 1 | 0 | 1 | Независимая защита historian: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_007/stage_10.json` |
| 2141 | `historic` | review_required | нет | 1 | 0 | 1 | Независимая защита historic: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2142 | `historical` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2143 | `history` | review_required | нет | 1 | 0 | 1 | Независимая защита history: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2144 | `hit` | review_required | нет | 5 | 0 | 5 | Независимая защита hit: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 10 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2145 | `hobby` | review_required | нет | 3 | 0 | 3 | Независимая защита hobby: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2146 | `hockey` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2147 | `hold` | review_required | нет | 12 | 0 | 12 | Независимая защита hold: stage06 содержит 4 найденных локаторов, stage08 проверил 22 значений, stage09 проверил 28 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2148 | `hole` | review_required | нет | 13 | 0 | 13 | Независимая защита hole: stage06 содержит 4 найденных локаторов, stage08 проверил 16 значений, stage09 проверил 3 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2149 | `holiday` | review_required | нет | 3 | 0 | 3 | Независимая защита holiday: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 5 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2150 | `hollow` | review_required | нет | 9 | 0 | 9 | Независимая защита hollow: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 2 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2151 | `holy` | review_required | нет | 2 | 0 | 2 | Независимая защита holy: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2152 | `home` | review_required | нет | 16 | 0 | 16 | Независимая защита home: stage06 содержит 4 найденных локаторов, stage08 проверил 21 значений, stage09 проверил 10 примеров; пустых значений 16, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 16 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2153 | `homeland` | review_required | нет | 1 | 0 | 1 | Независимая защита homeland: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2154 | `homeless` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2155 | `homework` | review_required | нет | 3 | 0 | 3 | Независимая защита homework: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2156 | `honest` | review_required | нет | 2 | 0 | 2 | Независимая защита honest: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2157 | `honesty` | review_required | нет | 2 | 0 | 2 | Независимая защита honesty: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2158 | `honour` | review_required | нет | 9 | 0 | 9 | Независимая защита honour: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 9 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2159 | `hook` | review_required | нет | 14 | 0 | 14 | Независимая защита hook: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 0 примеров; пустых значений 14, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 14 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2160 | `hope` | review_required | нет | 1 | 0 | 1 | Независимая защита hope: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 8 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_008/stage_10.json` |
| 2161 | `hopeful` | review_required | нет | 1 | 0 | 1 | Независимая защита hopeful: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2162 | `hopefully` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2163 | `horizon` | review_required | нет | 2 | 0 | 2 | Независимая защита horizon: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2164 | `horn` | review_required | нет | 11 | 0 | 11 | Независимая защита horn: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 1 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2165 | `horrible` | review_required | нет | 2 | 0 | 2 | Независимая защита horrible: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2166 | `horror` | review_required | нет | 2 | 0 | 2 | Независимая защита horror: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2167 | `horse` | review_required | нет | 6 | 0 | 6 | Независимая защита horse: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 5 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2168 | `hospital` | review_required | нет | 2 | 0 | 2 | Независимая защита hospital: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2169 | `host` | review_required | нет | 4 | 0 | 4 | Независимая защита host: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2170 | `hostage` | review_required | нет | 2 | 0 | 2 | Независимая защита hostage: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2171 | `hostile` | review_required | нет | 1 | 0 | 1 | Независимая защита hostile: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2172 | `hostility` | review_required | нет | 2 | 0 | 2 | Независимая защита hostility: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2173 | `hot` | review_required | нет | 14 | 0 | 14 | Независимая защита hot: stage06 содержит 4 найденных локаторов, stage08 проверил 18 значений, stage09 проверил 6 примеров; пустых значений 14, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 14 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2174 | `hotel` | review_required | нет | 1 | 0 | 1 | Независимая защита hotel: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2175 | `hour` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2176 | `house` | review_required | нет | 11 | 0 | 11 | Независимая защита house: stage06 содержит 4 найденных локаторов, stage08 проверил 15 значений, stage09 проверил 17 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2177 | `house` | review_required | нет | 7 | 0 | 7 | Независимая защита house: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 0 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2178 | `household` | review_required | нет | 4 | 0 | 4 | Независимая защита household: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2179 | `housing` | review_required | нет | 7 | 0 | 7 | Независимая защита housing: stage06 содержит 3 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 2 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2180 | `how` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_009/stage_10.json` |
| 2181 | `however` | review_required | нет | 2 | 0 | 2 | Независимая защита however: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2182 | `huge` | review_required | нет | 1 | 0 | 1 | Независимая защита huge: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2183 | `human` | review_required | нет | 1 | 0 | 1 | Независимая защита human: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 4 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2184 | `humanitarian` | review_required | нет | 4 | 0 | 4 | Независимая защита humanitarian: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2185 | `humanity` | review_required | нет | 5 | 0 | 5 | Независимая защита humanity: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2186 | `humble` | review_required | нет | 2 | 0 | 2 | Независимая защита humble: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2187 | `humorous` | review_required | нет | 2 | 0 | 2 | Независимая защита humorous: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2188 | `humour` | review_required | нет | 2 | 0 | 2 | Независимая защита humour: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 5 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2189 | `hundred` | review_required | нет | 1 | 0 | 1 | Независимая защита hundred: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2190 | `hunger` | review_required | нет | 5 | 0 | 5 | Независимая защита hunger: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2191 | `hungry` | review_required | нет | 3 | 0 | 3 | Независимая защита hungry: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2192 | `hunt` | review_required | нет | 4 | 0 | 4 | Независимая защита hunt: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 5 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2193 | `hunting` | review_required | нет | 2 | 0 | 2 | Независимая защита hunting: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2194 | `hurricane` | review_required | нет | 2 | 0 | 2 | Независимая защита hurricane: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2195 | `hurry` | review_required | нет | 1 | 0 | 1 | Независимая защита hurry: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 9 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2196 | `hurt` | review_required | нет | 5 | 0 | 5 | Независимая защита hurt: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2197 | `husband` | review_required | нет | 2 | 0 | 2 | Независимая защита husband: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2198 | `hydrogen` | review_required | нет | 1 | 0 | 1 | Независимая защита hydrogen: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2199 | `hypothesis` | review_required | нет | 1 | 0 | 1 | Независимая защита hypothesis: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2200 | `I` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_010/stage_10.json` |
| 2201 | `ice` | review_required | нет | 3 | 0 | 3 | Независимая защита ice: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2202 | `ice cream` | review_required | нет | 1 | 0 | 1 | Независимая защита ice cream: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2203 | `icon` | review_required | нет | 1 | 0 | 1 | Независимая защита icon: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2204 | `ID` | review_required | нет | 1 | 0 | 1 | Независимая защита ID: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2205 | `idea` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2206 | `ideal` | review_required | нет | 3 | 0 | 3 | Независимая защита ideal: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2207 | `identical` | review_required | нет | 1 | 0 | 1 | Независимая защита identical: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2208 | `identification` | review_required | нет | 3 | 0 | 3 | Независимая защита identification: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2209 | `identify` | review_required | нет | 2 | 0 | 2 | Независимая защита identify: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2210 | `identity` | review_required | нет | 4 | 0 | 4 | Независимая защита identity: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2211 | `ideological` | review_required | нет | 1 | 0 | 1 | Независимая защита ideological: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2212 | `ideology` | review_required | нет | 1 | 0 | 1 | Независимая защита ideology: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2213 | `idiot` | review_required | нет | 1 | 0 | 1 | Независимая защита idiot: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2214 | `if` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2215 | `ignorance` | review_required | нет | 1 | 0 | 1 | Независимая защита ignorance: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2216 | `ignore` | review_required | нет | 2 | 0 | 2 | Независимая защита ignore: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2217 | `ill` | review_required | нет | 1 | 0 | 1 | Независимая защита ill: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 11 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2218 | `illegal` | review_required | нет | 1 | 0 | 1 | Независимая защита illegal: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2219 | `illness` | review_required | нет | 1 | 0 | 1 | Независимая защита illness: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2220 | `illusion` | review_required | нет | 1 | 0 | 1 | Независимая защита illusion: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_011/stage_10.json` |
| 2221 | `illustrate` | review_required | нет | 2 | 0 | 2 | Независимая защита illustrate: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2222 | `illustration` | review_required | нет | 3 | 0 | 3 | Независимая защита illustration: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2223 | `image` | review_required | нет | 10 | 0 | 10 | Независимая защита image: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 4 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2224 | `imagery` | review_required | нет | 3 | 0 | 3 | Независимая защита imagery: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2225 | `imaginary` | review_required | нет | 2 | 0 | 2 | Независимая защита imaginary: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2226 | `imagination` | review_required | нет | 3 | 0 | 3 | Независимая защита imagination: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2227 | `imagine` | review_required | нет | 3 | 0 | 3 | Независимая защита imagine: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2228 | `immediate` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2229 | `immediately` | review_required | нет | 2 | 0 | 2 | Независимая защита immediately: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2230 | `immense` | review_required | нет | 3 | 0 | 3 | Независимая защита immense: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2231 | `immigrant` | review_required | нет | 3 | 0 | 3 | Независимая защита immigrant: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2232 | `immigration` | review_required | нет | 1 | 0 | 1 | Независимая защита immigration: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2233 | `imminent` | review_required | нет | 1 | 0 | 1 | Независимая защита imminent: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2234 | `immune` | review_required | нет | 3 | 0 | 3 | Независимая защита immune: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2235 | `impact` | review_required | нет | 6 | 0 | 6 | Независимая защита impact: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2236 | `impatient` | review_required | нет | 3 | 0 | 3 | Независимая защита impatient: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2237 | `implement` | review_required | нет | 3 | 0 | 3 | Независимая защита implement: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2238 | `implementation` | review_required | нет | 1 | 0 | 1 | Независимая защита implementation: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2239 | `implication` | review_required | нет | 2 | 0 | 2 | Независимая защита implication: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2240 | `imply` | review_required | нет | 1 | 0 | 1 | Независимая защита imply: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_012/stage_10.json` |
| 2241 | `import` | review_required | нет | 3 | 0 | 3 | Независимая защита import: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 6 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2242 | `importance` | review_required | нет | 1 | 0 | 1 | Независимая защита importance: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2243 | `important` | review_required | нет | 1 | 0 | 1 | Независимая защита important: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2244 | `impose` | review_required | нет | 4 | 0 | 4 | Независимая защита impose: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2245 | `impossible` | review_required | нет | 3 | 0 | 3 | Независимая защита impossible: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2246 | `impress` | review_required | нет | 5 | 0 | 5 | Независимая защита impress: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 4 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2247 | `impressed` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2248 | `impression` | review_required | нет | 5 | 0 | 5 | Независимая защита impression: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 5 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2249 | `impressive` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2250 | `imprison` | review_required | нет | 1 | 0 | 1 | Независимая защита imprison: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2251 | `imprisonment` | review_required | нет | 1 | 0 | 1 | Независимая защита imprisonment: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2252 | `improve` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2253 | `improvement` | review_required | нет | 4 | 0 | 4 | Независимая защита improvement: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2254 | `in` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2255 | `inability` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2256 | `inadequate` | review_required | нет | 1 | 0 | 1 | Независимая защита inadequate: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2257 | `inappropriate` | review_required | нет | 1 | 0 | 1 | Независимая защита inappropriate: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2258 | `incentive` | review_required | нет | 1 | 0 | 1 | Независимая защита incentive: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2259 | `inch` | review_required | нет | 2 | 0 | 2 | Независимая защита inch: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2260 | `incidence` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_013/stage_10.json` |
| 2261 | `incident` | review_required | нет | 5 | 0 | 5 | Независимая защита incident: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2262 | `inclined` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2263 | `include` | review_required | нет | 2 | 0 | 2 | Независимая защита include: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2264 | `included` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2265 | `including` | review_required | нет | 1 | 0 | 1 | Независимая защита including: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2266 | `inclusion` | review_required | нет | 2 | 0 | 2 | Независимая защита inclusion: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2267 | `income` | review_required | нет | 1 | 0 | 1 | Независимая защита income: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2268 | `incorporate` | review_required | нет | 5 | 0 | 5 | Независимая защита incorporate: stage06 содержит 3 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2269 | `incorrect` | review_required | нет | 2 | 0 | 2 | Независимая защита incorrect: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2270 | `increase` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2271 | `increasingly` | review_required | нет | 1 | 0 | 1 | Независимая защита increasingly: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2272 | `incredible` | review_required | нет | 1 | 0 | 1 | Независимая защита incredible: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2273 | `incredibly` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2274 | `incur` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2275 | `indeed` | review_required | нет | 1 | 0 | 1 | Независимая защита indeed: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 4 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2276 | `independence` | review_required | нет | 1 | 0 | 1 | Независимая защита independence: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2277 | `independent` | review_required | нет | 1 | 0 | 1 | Независимая защита independent: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 4 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2278 | `index` | review_required | нет | 6 | 0 | 6 | Независимая защита index: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 3 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2279 | `indicate` | review_required | нет | 4 | 0 | 4 | Независимая защита indicate: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2280 | `indication` | review_required | нет | 4 | 0 | 4 | Независимая защита indication: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_014/stage_10.json` |
| 2281 | `indicator` | review_required | нет | 3 | 0 | 3 | Независимая защита indicator: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2282 | `indictment` | review_required | нет | 1 | 0 | 1 | Независимая защита indictment: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2283 | `indigenous` | review_required | нет | 2 | 0 | 2 | Независимая защита indigenous: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2284 | `indirect` | review_required | нет | 1 | 0 | 1 | Независимая защита indirect: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 9 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2285 | `individual` | review_required | нет | 1 | 0 | 1 | Независимая защита individual: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 6 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2286 | `indoor` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2287 | `indoors` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2288 | `induce` | review_required | нет | 2 | 0 | 2 | Независимая защита induce: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2289 | `indulge` | review_required | нет | 1 | 0 | 1 | Независимая защита indulge: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 5 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2290 | `industrial` | review_required | нет | 3 | 0 | 3 | Независимая защита industrial: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 13 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2291 | `industry` | review_required | нет | 3 | 0 | 3 | Независимая защита industry: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2292 | `inequality` | review_required | нет | 5 | 0 | 5 | Независимая защита inequality: stage06 содержит 3 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2293 | `inevitable` | review_required | нет | 1 | 0 | 1 | Независимая защита inevitable: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2294 | `inevitably` | review_required | нет | 1 | 0 | 1 | Независимая защита inevitably: stage06 содержит 0 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2295 | `infamous` | review_required | нет | 3 | 0 | 3 | Независимая защита infamous: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2296 | `infant` | review_required | нет | 3 | 0 | 3 | Независимая защита infant: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2297 | `infect` | review_required | нет | 1 | 0 | 1 | Независимая защита infect: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2298 | `infection` | review_required | нет | 3 | 0 | 3 | Независимая защита infection: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2299 | `infer` | review_required | нет | 2 | 0 | 2 | Независимая защита infer: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2300 | `inflation` | review_required | нет | 2 | 0 | 2 | Независимая защита inflation: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_015/stage_10.json` |
| 2301 | `inflict` | review_required | нет | 2 | 0 | 2 | Независимая защита inflict: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2302 | `influence` | review_required | нет | 1 | 0 | 1 | Независимая защита influence: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 6 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2303 | `influential` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2304 | `info` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2305 | `inform` | review_required | нет | 2 | 0 | 2 | Независимая защита inform: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2306 | `informal` | review_required | нет | 1 | 0 | 1 | Независимая защита informal: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2307 | `information` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2308 | `infrastructure` | review_required | нет | 1 | 0 | 1 | Независимая защита infrastructure: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2309 | `ingredient` | review_required | нет | 1 | 0 | 1 | Независимая защита ingredient: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2310 | `inhabitant` | review_required | нет | 1 | 0 | 1 | Независимая защита inhabitant: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2311 | `inherent` | review_required | нет | 1 | 0 | 1 | Независимая защита inherent: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2312 | `inherit` | review_required | нет | 3 | 0 | 3 | Независимая защита inherit: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2313 | `inhibit` | review_required | нет | 3 | 0 | 3 | Независимая защита inhibit: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2314 | `initial` | review_required | нет | 3 | 0 | 3 | Независимая защита initial: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 4 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2315 | `initially` | review_required | нет | 1 | 0 | 1 | Независимая защита initially: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2316 | `initiate` | review_required | нет | 4 | 0 | 4 | Независимая защита initiate: stage06 содержит 3 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2317 | `initiative` | review_required | нет | 3 | 0 | 3 | Независимая защита initiative: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2318 | `inject` | review_required | нет | 3 | 0 | 3 | Независимая защита inject: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2319 | `injection` | review_required | нет | 3 | 0 | 3 | Независимая защита injection: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2320 | `injure` | review_required | нет | 2 | 0 | 2 | Независимая защита injure: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_016/stage_10.json` |
| 2321 | `injured` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2322 | `injury` | review_required | нет | 2 | 0 | 2 | Независимая защита injury: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2323 | `injustice` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2324 | `ink` | review_required | нет | 5 | 0 | 5 | Независимая защита ink: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2325 | `inmate` | review_required | нет | 2 | 0 | 2 | Независимая защита inmate: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2326 | `inner` | review_required | нет | 1 | 0 | 1 | Независимая защита inner: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2327 | `innocent` | review_required | нет | 5 | 0 | 5 | Независимая защита innocent: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 3 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2328 | `innovation` | review_required | нет | 1 | 0 | 1 | Независимая защита innovation: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2329 | `innovative` | review_required | нет | 1 | 0 | 1 | Независимая защита innovative: stage06 содержит 0 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2330 | `input` | review_required | нет | 4 | 0 | 4 | Независимая защита input: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2331 | `inquiry` | review_required | нет | 2 | 0 | 2 | Независимая защита inquiry: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2332 | `insect` | review_required | нет | 2 | 0 | 2 | Независимая защита insect: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2333 | `insert` | review_required | нет | 3 | 0 | 3 | Независимая защита insert: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2334 | `insertion` | review_required | нет | 6 | 0 | 6 | Независимая защита insertion: stage06 содержит 3 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2335 | `inside` | review_required | нет | 7 | 0 | 7 | Независимая защита inside: stage06 содержит 4 найденных локаторов, stage08 проверил 15 значений, stage09 проверил 8 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2336 | `insider` | review_required | нет | 2 | 0 | 2 | Независимая защита insider: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2337 | `insight` | review_required | нет | 1 | 0 | 1 | Независимая защита insight: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2338 | `insist` | review_required | нет | 1 | 0 | 1 | Независимая защита insist: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2339 | `inspect` | review_required | нет | 2 | 0 | 2 | Независимая защита inspect: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2340 | `inspection` | review_required | нет | 2 | 0 | 2 | Независимая защита inspection: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_017/stage_10.json` |
| 2341 | `inspector` | review_required | нет | 4 | 0 | 4 | Независимая защита inspector: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2342 | `inspiration` | review_required | нет | 2 | 0 | 2 | Независимая защита inspiration: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2343 | `inspire` | review_required | нет | 4 | 0 | 4 | Независимая защита inspire: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2344 | `install` | review_required | нет | 2 | 0 | 2 | Независимая защита install: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2345 | `installation` | review_required | нет | 3 | 0 | 3 | Независимая защита installation: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2346 | `instance` | review_required | нет | 1 | 0 | 1 | Независимая защита instance: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2347 | `instant` | review_required | нет | 2 | 0 | 2 | Независимая защита instant: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 8 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2348 | `instantly` | review_required | нет | 1 | 0 | 1 | Независимая защита instantly: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2349 | `instead` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2350 | `instinct` | review_required | нет | 2 | 0 | 2 | Независимая защита instinct: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2351 | `institute` | review_required | нет | 8 | 0 | 8 | Независимая защита institute: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 0 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2352 | `institution` | review_required | нет | 7 | 0 | 7 | Независимая защита institution: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 1 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2353 | `institutional` | review_required | нет | 1 | 0 | 1 | Независимая защита institutional: stage06 содержит 0 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2354 | `instruct` | review_required | нет | 6 | 0 | 6 | Независимая защита instruct: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2355 | `instruction` | review_required | нет | 5 | 0 | 5 | Независимая защита instruction: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2356 | `instructor` | review_required | нет | 3 | 0 | 3 | Независимая защита instructor: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2357 | `instrument` | review_required | нет | 4 | 0 | 4 | Независимая защита instrument: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 10 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2358 | `instrumental` | review_required | нет | 1 | 0 | 1 | Независимая защита instrumental: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2359 | `insufficient` | review_required | нет | 1 | 0 | 1 | Независимая защита insufficient: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2360 | `insult` | review_required | нет | 2 | 0 | 2 | Независимая защита insult: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_018/stage_10.json` |
| 2361 | `insurance` | review_required | нет | 2 | 0 | 2 | Независимая защита insurance: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2362 | `intact` | review_required | нет | 2 | 0 | 2 | Независимая защита intact: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2363 | `intake` | review_required | нет | 7 | 0 | 7 | Независимая защита intake: stage06 содержит 3 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 1 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2364 | `integral` | review_required | нет | 4 | 0 | 4 | Независимая защита integral: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2365 | `integrate` | review_required | нет | 6 | 0 | 6 | Независимая защита integrate: stage06 содержит 3 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2366 | `integrated` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2367 | `integration` | review_required | нет | 1 | 0 | 1 | Независимая защита integration: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2368 | `integrity` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2369 | `intellectual` | review_required | нет | 4 | 0 | 4 | Независимая защита intellectual: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2370 | `intelligence` | review_required | нет | 5 | 0 | 5 | Независимая защита intelligence: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2371 | `intelligent` | review_required | нет | 2 | 0 | 2 | Независимая защита intelligent: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2372 | `intend` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2373 | `intended` | review_required | нет | 1 | 0 | 1 | Независимая защита intended: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2374 | `intense` | review_required | нет | 1 | 0 | 1 | Независимая защита intense: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 5 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2375 | `intensify` | review_required | нет | 1 | 0 | 1 | Независимая защита intensify: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2376 | `intensity` | review_required | нет | 2 | 0 | 2 | Независимая защита intensity: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2377 | `intensive` | review_required | нет | 2 | 0 | 2 | Независимая защита intensive: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2378 | `intent` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2379 | `intention` | review_required | нет | 1 | 0 | 1 | Независимая защита intention: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2380 | `interact` | review_required | нет | 1 | 0 | 1 | Независимая защита interact: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_019/stage_10.json` |
| 2381 | `interaction` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2382 | `interactive` | review_required | нет | 1 | 0 | 1 | Независимая защита interactive: stage06 содержит 1 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2383 | `interest` | review_required | нет | 4 | 0 | 4 | Независимая защита interest: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 14 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2384 | `interested` | review_required | нет | 2 | 0 | 2 | Независимая защита interested: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2385 | `interesting` | review_required | нет | 2 | 0 | 2 | Независимая защита interesting: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2386 | `interface` | review_required | нет | 3 | 0 | 3 | Независимая защита interface: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2387 | `interfere` | review_required | нет | 5 | 0 | 5 | Независимая защита interfere: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 6 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2388 | `interference` | review_required | нет | 1 | 0 | 1 | Независимая защита interference: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2389 | `interim` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2390 | `interior` | review_required | нет | 5 | 0 | 5 | Независимая защита interior: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2391 | `intermediate` | review_required | нет | 2 | 0 | 2 | Независимая защита intermediate: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2392 | `internal` | review_required | нет | 3 | 0 | 3 | Независимая защита internal: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 5 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2393 | `international` | review_required | нет | 2 | 0 | 2 | Независимая защита international: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2394 | `internet` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2395 | `interpret` | review_required | нет | 2 | 0 | 2 | Независимая защита interpret: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2396 | `interpretation` | review_required | нет | 2 | 0 | 2 | Независимая защита interpretation: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2397 | `interrupt` | review_required | нет | 2 | 0 | 2 | Независимая защита interrupt: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2398 | `interval` | review_required | нет | 3 | 0 | 3 | Независимая защита interval: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2399 | `intervene` | review_required | нет | 3 | 0 | 3 | Независимая защита intervene: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2400 | `intervention` | review_required | нет | 2 | 0 | 2 | Независимая защита intervention: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_020/stage_10.json` |
| 2401 | `interview` | review_required | нет | 3 | 0 | 3 | Независимая защита interview: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2402 | `intimate` | review_required | нет | 6 | 0 | 6 | Независимая защита intimate: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 5 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2403 | `into` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2404 | `intriguing` | review_required | нет | 3 | 0 | 3 | Независимая защита intriguing: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2405 | `introduce` | review_required | нет | 4 | 0 | 4 | Независимая защита introduce: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2406 | `introduction` | review_required | нет | 6 | 0 | 6 | Независимая защита introduction: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2407 | `invade` | review_required | нет | 3 | 0 | 3 | Независимая защита invade: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2408 | `invasion` | review_required | нет | 3 | 0 | 3 | Независимая защита invasion: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2409 | `invent` | review_required | нет | 2 | 0 | 2 | Независимая защита invent: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2410 | `invention` | review_required | нет | 4 | 0 | 4 | Независимая защита invention: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2411 | `invest` | review_required | нет | 4 | 0 | 4 | Независимая защита invest: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2412 | `investigate` | review_required | нет | 2 | 0 | 2 | Независимая защита investigate: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2413 | `investigation` | review_required | нет | 2 | 0 | 2 | Независимая защита investigation: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2414 | `investigator` | review_required | нет | 2 | 0 | 2 | Независимая защита investigator: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2415 | `investment` | review_required | нет | 6 | 0 | 6 | Независимая защита investment: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 3 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2416 | `investor` | review_required | нет | 1 | 0 | 1 | Независимая защита investor: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2417 | `invisible` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2418 | `invitation` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2419 | `invite` | review_required | нет | 3 | 0 | 3 | Независимая защита invite: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2420 | `invoke` | review_required | нет | 3 | 0 | 3 | Независимая защита invoke: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_021/stage_10.json` |
| 2421 | `involve` | review_required | нет | 5 | 0 | 5 | Независимая защита involve: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2422 | `involved` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2423 | `involvement` | review_required | нет | 3 | 0 | 3 | Независимая защита involvement: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2424 | `iron` | review_required | нет | 9 | 0 | 9 | Независимая защита iron: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 4 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2425 | `ironic` | review_required | нет | 1 | 0 | 1 | Независимая защита ironic: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2426 | `ironically` | review_required | нет | 1 | 0 | 1 | Независимая защита ironically: stage06 содержит 0 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2427 | `irony` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2428 | `irrelevant` | review_required | нет | 1 | 0 | 1 | Независимая защита irrelevant: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2429 | `island` | review_required | нет | 4 | 0 | 4 | Независимая защита island: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2430 | `isolate` | review_required | нет | 2 | 0 | 2 | Независимая защита isolate: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2431 | `isolated` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2432 | `isolation` | review_required | нет | 1 | 0 | 1 | Независимая защита isolation: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2433 | `issue` | review_required | нет | 9 | 0 | 9 | Независимая защита issue: stage06 содержит 4 найденных локаторов, stage08 проверил 17 значений, stage09 проверил 16 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2434 | `IT` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2435 | `it` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2436 | `item` | review_required | нет | 3 | 0 | 3 | Независимая защита item: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2437 | `its` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2438 | `itself` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2439 | `jacket` | review_required | нет | 5 | 0 | 5 | Независимая защита jacket: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 4 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2440 | `jail` | review_required | нет | 2 | 0 | 2 | Независимая защита jail: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_022/stage_10.json` |
| 2441 | `jam` | review_required | нет | 11 | 0 | 11 | Независимая защита jam: stage06 содержит 4 найденных локаторов, stage08 проверил 15 значений, stage09 проверил 5 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2442 | `January` | review_required | нет | 2 | 0 | 2 | Независимая защита January: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2443 | `jazz` | review_required | нет | 8 | 0 | 8 | Независимая защита jazz: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 2 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2444 | `jeans` | review_required | нет | 1 | 0 | 1 | Независимая защита jeans: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2445 | `jet` | review_required | нет | 8 | 0 | 8 | Независимая защита jet: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 2 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2446 | `jewellery` | review_required | нет | 1 | 0 | 1 | Независимая защита jewellery: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2447 | `job` | review_required | нет | 2 | 0 | 2 | Независимая защита job: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2448 | `join` | review_required | нет | 1 | 0 | 1 | Независимая защита join: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 9 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2449 | `joint` | review_required | нет | 10 | 0 | 10 | Независимая защита joint: stage06 содержит 4 найденных локаторов, stage08 проверил 16 значений, stage09 проверил 16 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2450 | `joke` | review_required | нет | 4 | 0 | 4 | Независимая защита joke: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2451 | `journal` | review_required | нет | 3 | 0 | 3 | Независимая защита journal: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2452 | `journalism` | review_required | нет | 2 | 0 | 2 | Независимая защита journalism: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2453 | `journalist` | review_required | нет | 2 | 0 | 2 | Независимая защита journalist: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2454 | `journey` | review_required | нет | 3 | 0 | 3 | Независимая защита journey: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2455 | `joy` | review_required | нет | 2 | 0 | 2 | Независимая защита joy: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2456 | `judge` | review_required | нет | 4 | 0 | 4 | Независимая защита judge: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 4 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2457 | `judgement` | review_required | нет | 1 | 0 | 1 | Независимая защита judgement: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 8 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2458 | `judicial` | review_required | нет | 2 | 0 | 2 | Независимая защита judicial: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2459 | `juice` | review_required | нет | 3 | 0 | 3 | Независимая защита juice: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2460 | `July` | review_required | нет | 2 | 0 | 2 | Независимая защита July: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_023/stage_10.json` |
| 2461 | `jump` | review_required | нет | 12 | 0 | 12 | Независимая защита jump: stage06 содержит 4 найденных локаторов, stage08 проверил 29 значений, stage09 проверил 37 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2462 | `junction` | review_required | нет | 5 | 0 | 5 | Независимая защита junction: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2463 | `June` | review_required | нет | 2 | 0 | 2 | Независимая защита June: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2464 | `junior` | review_required | нет | 5 | 0 | 5 | Независимая защита junior: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 5 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2465 | `jurisdiction` | review_required | нет | 2 | 0 | 2 | Независимая защита jurisdiction: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2466 | `jury` | review_required | нет | 1 | 0 | 1 | Независимая защита jury: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 5 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2467 | `just` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2468 | `justice` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2469 | `justification` | review_required | нет | 3 | 0 | 3 | Независимая защита justification: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2470 | `justify` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2471 | `keen` | review_required | нет | 7 | 0 | 7 | Независимая защита keen: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 13 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2472 | `keep` | review_required | нет | 7 | 0 | 7 | Независимая защита keep: stage06 содержит 4 найденных локаторов, stage08 проверил 25 значений, stage09 проверил 28 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2473 | `key` | review_required | нет | 19 | 0 | 19 | Независимая защита key: stage06 содержит 4 найденных локаторов, stage08 проверил 27 значений, stage09 проверил 12 примеров; пустых значений 19, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 19 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2474 | `keyboard` | review_required | нет | 3 | 0 | 3 | Независимая защита keyboard: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2475 | `kick` | review_required | нет | 13 | 0 | 13 | Независимая защита kick: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 11 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2476 | `kid` | review_required | нет | 5 | 0 | 5 | Независимая защита kid: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2477 | `kidnap` | review_required | нет | 2 | 0 | 2 | Независимая защита kidnap: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2478 | `kidney` | review_required | нет | 4 | 0 | 4 | Независимая защита kidney: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2479 | `kill` | review_required | нет | 13 | 0 | 13 | Независимая защита kill: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 9 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2480 | `killing` | review_required | нет | 7 | 0 | 7 | Независимая защита killing: stage06 содержит 3 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 0 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_024/stage_10.json` |
| 2481 | `kilometre` | review_required | нет | 1 | 0 | 1 | Независимая защита kilometre: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2482 | `kind` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2483 | `king` | review_required | нет | 6 | 0 | 6 | Независимая защита king: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 5 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2484 | `kingdom` | review_required | нет | 2 | 0 | 2 | Независимая защита kingdom: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2485 | `kiss` | review_required | нет | 2 | 0 | 2 | Независимая защита kiss: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 6 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2486 | `kit` | review_required | нет | 5 | 0 | 5 | Независимая защита kit: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2487 | `kitchen` | review_required | нет | 1 | 0 | 1 | Независимая защита kitchen: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2488 | `knee` | review_required | нет | 8 | 0 | 8 | Независимая защита knee: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 1 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2489 | `knife` | review_required | нет | 5 | 0 | 5 | Независимая защита knife: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2490 | `knock` | review_required | нет | 6 | 0 | 6 | Независимая защита knock: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 5 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2491 | `know` | review_required | нет | 1 | 0 | 1 | Независимая защита know: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 8 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2492 | `knowledge` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2493 | `lab` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2494 | `label` | review_required | нет | 8 | 0 | 8 | Независимая защита label: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 0 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2495 | `laboratory` | review_required | нет | 2 | 0 | 2 | Независимая защита laboratory: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2496 | `labour` | review_required | нет | 6 | 0 | 6 | Независимая защита labour: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 16 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2497 | `lack` | review_required | нет | 1 | 0 | 1 | Независимая защита lack: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 6 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2498 | `lad` | review_required | нет | 2 | 0 | 2 | Независимая защита lad: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2499 | `ladder` | review_required | нет | 3 | 0 | 3 | Независимая защита ladder: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2500 | `lady` | review_required | нет | 3 | 0 | 3 | Независимая защита lady: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 9 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_025/stage_10.json` |
| 2501 | `lake` | review_required | нет | 1 | 0 | 1 | Независимая защита lake: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2502 | `lamp` | review_required | нет | 5 | 0 | 5 | Независимая защита lamp: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2503 | `land` | review_required | нет | 10 | 0 | 10 | Независимая защита land: stage06 содержит 4 найденных локаторов, stage08 проверил 17 значений, stage09 проверил 13 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2504 | `landing` | review_required | нет | 4 | 0 | 4 | Независимая защита landing: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 4 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2505 | `landlord` | review_required | нет | 3 | 0 | 3 | Независимая защита landlord: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2506 | `landmark` | review_required | нет | 4 | 0 | 4 | Независимая защита landmark: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2507 | `landscape` | review_required | нет | 1 | 0 | 1 | Независимая защита landscape: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2508 | `lane` | review_required | нет | 8 | 0 | 8 | Независимая защита lane: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 3 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2509 | `language` | review_required | нет | 1 | 0 | 1 | Независимая защита language: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2510 | `lap` | review_required | нет | 15 | 0 | 15 | Независимая защита lap: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 5 примеров; пустых значений 15, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 15 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2511 | `laptop` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2512 | `large` | review_required | нет | 6 | 0 | 6 | Независимая защита large: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 13 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2513 | `large-scale` | review_required | нет | 2 | 0 | 2 | Независимая защита large-scale: stage06 содержит 2 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2514 | `largely` | review_required | нет | 2 | 0 | 2 | Независимая защита largely: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2515 | `laser` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2516 | `last` | review_required | нет | 6 | 0 | 6 | Независимая защита last: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 8 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2517 | `late` | review_required | нет | 1 | 0 | 1 | Независимая защита late: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 8 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2518 | `lately` | review_required | нет | 1 | 0 | 1 | Независимая защита lately: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2519 | `later` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2520 | `latest` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_026/stage_10.json` |
| 2521 | `latter` | review_required | нет | 1 | 0 | 1 | Независимая защита latter: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2522 | `laugh` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2523 | `laughter` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2524 | `launch` | review_required | нет | 3 | 0 | 3 | Независимая защита launch: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 11 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2525 | `law` | review_required | нет | 2 | 0 | 2 | Независимая защита law: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 18 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2526 | `lawn` | review_required | нет | 2 | 0 | 2 | Независимая защита lawn: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2527 | `lawsuit` | review_required | нет | 1 | 0 | 1 | Независимая защита lawsuit: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2528 | `lawyer` | review_required | нет | 1 | 0 | 1 | Независимая защита lawyer: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2529 | `lay` | review_required | нет | 19 | 0 | 19 | Независимая защита lay: stage06 содержит 4 найденных локаторов, stage08 проверил 28 значений, stage09 проверил 23 примеров; пустых значений 19, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 19 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2530 | `layer` | review_required | нет | 6 | 0 | 6 | Независимая защита layer: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2531 | `layout` | review_required | нет | 3 | 0 | 3 | Независимая защита layout: stage06 содержит 3 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2532 | `lazy` | review_required | нет | 1 | 0 | 1 | Независимая защита lazy: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2533 | `lead` | review_required | нет | 26 | 0 | 26 | Независимая защита lead: stage06 содержит 4 найденных локаторов, stage08 проверил 39 значений, stage09 проверил 26 примеров; пустых значений 26, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 26 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2534 | `leader` | review_required | нет | 13 | 0 | 13 | Независимая защита leader: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 1 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2535 | `leadership` | review_required | нет | 1 | 0 | 1 | Независимая защита leadership: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2536 | `leading` | review_required | нет | 3 | 0 | 3 | Независимая защита leading: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 7 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2537 | `leaf` | review_required | нет | 7 | 0 | 7 | Независимая защита leaf: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 4 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2538 | `leaflet` | review_required | нет | 2 | 0 | 2 | Независимая защита leaflet: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2539 | `league` | review_required | нет | 1 | 0 | 1 | Независимая защита league: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2540 | `leak` | review_required | нет | 4 | 0 | 4 | Независимая защита leak: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_027/stage_10.json` |
| 2541 | `lean` | review_required | нет | 5 | 0 | 5 | Независимая защита lean: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 4 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2542 | `leap` | review_required | нет | 4 | 0 | 4 | Независимая защита leap: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 4 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2543 | `learn` | review_required | нет | 2 | 0 | 2 | Независимая защита learn: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2544 | `learning` | review_required | нет | 2 | 0 | 2 | Независимая защита learning: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2545 | `least` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2546 | `leather` | review_required | нет | 7 | 0 | 7 | Независимая защита leather: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 3 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2547 | `leave` | review_required | нет | 1 | 0 | 1 | Независимая защита leave: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 10 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2548 | `lecture` | review_required | нет | 1 | 0 | 1 | Независимая защита lecture: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2549 | `left` | review_required | нет | 3 | 0 | 3 | Независимая защита left: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2550 | `leg` | review_required | нет | 10 | 0 | 10 | Независимая защита leg: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 6 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2551 | `legacy` | review_required | нет | 1 | 0 | 1 | Независимая защита legacy: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2552 | `legal` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2553 | `legend` | review_required | нет | 3 | 0 | 3 | Независимая защита legend: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2554 | `legendary` | review_required | нет | 2 | 0 | 2 | Независимая защита legendary: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2555 | `legislation` | review_required | нет | 1 | 0 | 1 | Независимая защита legislation: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2556 | `legislative` | review_required | нет | 1 | 0 | 1 | Независимая защита legislative: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2557 | `legislature` | review_required | нет | 2 | 0 | 2 | Независимая защита legislature: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2558 | `legitimate` | review_required | нет | 4 | 0 | 4 | Независимая защита legitimate: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2559 | `leisure` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2560 | `lemon` | review_required | нет | 5 | 0 | 5 | Независимая защита lemon: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_028/stage_10.json` |
| 2561 | `lend` | review_required | нет | 1 | 0 | 1 | Независимая защита lend: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2562 | `length` | review_required | нет | 3 | 0 | 3 | Независимая защита length: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 10 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2563 | `lengthy` | review_required | нет | 2 | 0 | 2 | Независимая защита lengthy: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2564 | `lens` | review_required | нет | 2 | 0 | 2 | Независимая защита lens: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2565 | `lesbian` | review_required | нет | 3 | 0 | 3 | Независимая защита lesbian: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2566 | `less` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2567 | `lesser` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2568 | `lesson` | review_required | нет | 3 | 0 | 3 | Независимая защита lesson: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2569 | `let` | review_required | нет | 2 | 0 | 2 | Независимая защита let: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 25 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2570 | `lethal` | review_required | нет | 1 | 0 | 1 | Независимая защита lethal: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2571 | `letter` | review_required | нет | 5 | 0 | 5 | Независимая защита letter: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 15 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2572 | `level` | review_required | нет | 6 | 0 | 6 | Независимая защита level: stage06 содержит 4 найденных локаторов, stage08 проверил 16 значений, stage09 проверил 16 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2573 | `liable` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2574 | `liberal` | review_required | нет | 6 | 0 | 6 | Независимая защита liberal: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 3 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2575 | `liberation` | review_required | нет | 2 | 0 | 2 | Независимая защита liberation: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2576 | `liberty` | review_required | нет | 2 | 0 | 2 | Независимая защита liberty: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 6 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2577 | `library` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2578 | `licence` | review_required | нет | 1 | 0 | 1 | Независимая защита licence: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2579 | `license` | review_required | нет | 2 | 0 | 2 | Независимая защита license: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2580 | `lie` | review_required | нет | 4 | 0 | 4 | Независимая защита lie: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 24 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_029/stage_10.json` |
| 2581 | `life` | review_required | нет | 3 | 0 | 3 | Независимая защита life: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 17 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2582 | `lifelong` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2583 | `lifestyle` | review_required | нет | 1 | 0 | 1 | Независимая защита lifestyle: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2584 | `lifetime` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2585 | `lift` | review_required | нет | 18 | 0 | 18 | Независимая защита lift: stage06 содержит 4 найденных локаторов, stage08 проверил 21 значений, stage09 проверил 6 примеров; пустых значений 18, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 18 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2586 | `light` | review_required | нет | 15 | 0 | 15 | Независимая защита light: stage06 содержит 4 найденных локаторов, stage08 проверил 32 значений, stage09 проверил 30 примеров; пустых значений 15, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 15 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2587 | `lighting` | review_required | нет | 2 | 0 | 2 | Независимая защита lighting: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2588 | `like` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2589 | `likelihood` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2590 | `likely` | review_required | нет | 4 | 0 | 4 | Независимая защита likely: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2591 | `likewise` | review_required | нет | 2 | 0 | 2 | Независимая защита likewise: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2592 | `limb` | review_required | нет | 7 | 0 | 7 | Независимая защита limb: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 1 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2593 | `limit` | review_required | нет | 5 | 0 | 5 | Независимая защита limit: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 8 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2594 | `limitation` | review_required | нет | 2 | 0 | 2 | Независимая защита limitation: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2595 | `limited` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2596 | `line` | review_required | нет | 13 | 0 | 13 | Независимая защита line: stage06 содержит 4 найденных локаторов, stage08 проверил 33 значений, stage09 проверил 33 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2597 | `line-up` | review_required | нет | 3 | 0 | 3 | Независимая защита line-up: stage06 содержит 2 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2598 | `linear` | review_required | нет | 1 | 0 | 1 | Независимая защита linear: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2599 | `linger` | review_required | нет | 4 | 0 | 4 | Независимая защита linger: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2600 | `link` | review_required | нет | 8 | 0 | 8 | Независимая защита link: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 3 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_030/stage_10.json` |
| 2601 | `lion` | review_required | нет | 3 | 0 | 3 | Независимая защита lion: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2602 | `lip` | review_required | нет | 6 | 0 | 6 | Независимая защита lip: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 8 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2603 | `liquid` | review_required | нет | 7 | 0 | 7 | Независимая защита liquid: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 1 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2604 | `list` | review_required | нет | 6 | 0 | 6 | Независимая защита list: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 5 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2605 | `listen` | review_required | нет | 2 | 0 | 2 | Независимая защита listen: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2606 | `listener` | review_required | нет | 1 | 0 | 1 | Независимая защита listener: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2607 | `listing` | review_required | нет | 1 | 0 | 1 | Независимая защита listing: stage06 содержит 0 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2608 | `literacy` | review_required | нет | 1 | 0 | 1 | Независимая защита literacy: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2609 | `literally` | review_required | нет | 2 | 0 | 2 | Независимая защита literally: stage06 содержит 0 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2610 | `literary` | review_required | нет | 1 | 0 | 1 | Независимая защита literary: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2611 | `literature` | review_required | нет | 1 | 0 | 1 | Независимая защита literature: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2612 | `litre` | review_required | нет | 1 | 0 | 1 | Независимая защита litre: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2613 | `litter` | review_required | нет | 7 | 0 | 7 | Независимая защита litter: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 0 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2614 | `little` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2615 | `live` | review_required | нет | 1 | 0 | 1 | Независимая защита live: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 8 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2616 | `live` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2617 | `live` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2618 | `lively` | review_required | нет | 5 | 0 | 5 | Независимая защита lively: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2619 | `liver` | review_required | нет | 3 | 0 | 3 | Независимая защита liver: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2620 | `living` | review_required | нет | 2 | 0 | 2 | Независимая защита living: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 7 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_031/stage_10.json` |
| 2621 | `load` | review_required | нет | 12 | 0 | 12 | Независимая защита load: stage06 содержит 4 найденных локаторов, stage08 проверил 18 значений, stage09 проверил 8 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2622 | `loan` | review_required | нет | 3 | 0 | 3 | Независимая защита loan: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2623 | `lobby` | review_required | нет | 5 | 0 | 5 | Независимая защита lobby: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2624 | `local` | review_required | нет | 7 | 0 | 7 | Независимая защита local: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 13 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2625 | `locate` | review_required | нет | 2 | 0 | 2 | Независимая защита locate: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2626 | `located` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2627 | `location` | review_required | нет | 6 | 0 | 6 | Независимая защита location: stage06 содержит 3 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2628 | `lock` | review_required | нет | 10 | 0 | 10 | Независимая защита lock: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 5 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2629 | `log` | review_required | нет | 4 | 0 | 4 | Независимая защита log: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2630 | `logic` | review_required | нет | 1 | 0 | 1 | Независимая защита logic: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2631 | `logical` | review_required | нет | 2 | 0 | 2 | Независимая защита logical: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2632 | `logo` | review_required | нет | 2 | 0 | 2 | Независимая защита logo: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2633 | `lonely` | review_required | нет | 1 | 0 | 1 | Независимая защита lonely: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2634 | `long` | review_required | нет | 10 | 0 | 10 | Независимая защита long: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 24 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2635 | `long-standing` | review_required | нет | 1 | 0 | 1 | Независимая защита long-standing: stage06 содержит 2 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2636 | `long-term` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2637 | `long-time` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2638 | `look` | review_required | нет | 1 | 0 | 1 | Независимая защита look: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 20 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2639 | `loom` | review_required | нет | 4 | 0 | 4 | Независимая защита loom: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2640 | `loop` | review_required | нет | 10 | 0 | 10 | Независимая защита loop: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 2 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_032/stage_10.json` |
| 2641 | `loose` | review_required | нет | 12 | 0 | 12 | Независимая защита loose: stage06 содержит 4 найденных локаторов, stage08 проверил 18 значений, stage09 проверил 10 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2642 | `lord` | review_required | нет | 3 | 0 | 3 | Независимая защита lord: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 17 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2643 | `lorry` | review_required | нет | 3 | 0 | 3 | Независимая защита lorry: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2644 | `lose` | review_required | нет | 3 | 0 | 3 | Независимая защита lose: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 15 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2645 | `loss` | review_required | нет | 3 | 0 | 3 | Независимая защита loss: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 8 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2646 | `lost` | review_required | нет | 1 | 0 | 1 | Независимая защита lost: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2647 | `lot` | review_required | нет | 9 | 0 | 9 | Независимая защита lot: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 8 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2648 | `lottery` | review_required | нет | 1 | 0 | 1 | Независимая защита lottery: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2649 | `loud` | review_required | нет | 6 | 0 | 6 | Независимая защита loud: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2650 | `loudly` | review_required | нет | 2 | 0 | 2 | Независимая защита loudly: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2651 | `love` | review_required | нет | 4 | 0 | 4 | Независимая защита love: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 10 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2652 | `lovely` | review_required | нет | 3 | 0 | 3 | Независимая защита lovely: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2653 | `low` | review_required | нет | 12 | 0 | 12 | Независимая защита low: stage06 содержит 4 найденных локаторов, stage08 проверил 25 значений, stage09 проверил 20 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2654 | `lower` | review_required | нет | 7 | 0 | 7 | Независимая защита lower: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 11 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2655 | `loyal` | review_required | нет | 1 | 0 | 1 | Независимая защита loyal: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2656 | `loyalty` | review_required | нет | 1 | 0 | 1 | Независимая защита loyalty: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2657 | `luck` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2658 | `lucky` | review_required | нет | 2 | 0 | 2 | Независимая защита lucky: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2659 | `lunch` | review_required | нет | 2 | 0 | 2 | Независимая защита lunch: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2660 | `lung` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_033/stage_10.json` |
| 2661 | `luxury` | review_required | нет | 1 | 0 | 1 | Независимая защита luxury: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2662 | `lyric` | review_required | нет | 1 | 0 | 1 | Независимая защита lyric: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2663 | `machine` | review_required | нет | 9 | 0 | 9 | Независимая защита machine: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 5 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2664 | `machinery` | review_required | нет | 5 | 0 | 5 | Независимая защита machinery: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2665 | `mad` | review_required | нет | 5 | 0 | 5 | Независимая защита mad: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 6 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2666 | `magazine` | review_required | нет | 6 | 0 | 6 | Независимая защита magazine: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2667 | `magic` | review_required | нет | 3 | 0 | 3 | Независимая защита magic: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2668 | `magical` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2669 | `magistrate` | review_required | нет | 2 | 0 | 2 | Независимая защита magistrate: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2670 | `magnetic` | review_required | нет | 1 | 0 | 1 | Независимая защита magnetic: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2671 | `magnificent` | review_required | нет | 2 | 0 | 2 | Независимая защита magnificent: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2672 | `magnitude` | review_required | нет | 1 | 0 | 1 | Независимая защита magnitude: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2673 | `mail` | review_required | нет | 7 | 0 | 7 | Независимая защита mail: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 1 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2674 | `main` | review_required | нет | 6 | 0 | 6 | Независимая защита main: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 4 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2675 | `mainland` | review_required | нет | 3 | 0 | 3 | Независимая защита mainland: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2676 | `mainly` | review_required | нет | 2 | 0 | 2 | Независимая защита mainly: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2677 | `mainstream` | review_required | нет | 1 | 0 | 1 | Независимая защита mainstream: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2678 | `maintain` | review_required | нет | 2 | 0 | 2 | Независимая защита maintain: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2679 | `maintenance` | review_required | нет | 5 | 0 | 5 | Независимая защита maintenance: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2680 | `major` | review_required | нет | 8 | 0 | 8 | Независимая защита major: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 3 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_034/stage_10.json` |
| 2681 | `majority` | review_required | нет | 1 | 0 | 1 | Независимая защита majority: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 6 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2682 | `make` | review_required | нет | 16 | 0 | 16 | Независимая защита make: stage06 содержит 4 найденных локаторов, stage08 проверил 27 значений, stage09 проверил 26 примеров; пустых значений 16, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 16 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2683 | `make-up` | review_required | нет | 4 | 0 | 4 | Независимая защита make-up: stage06 содержит 3 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 3 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2684 | `making` | review_required | нет | 5 | 0 | 5 | Независимая защита making: stage06 содержит 3 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 2 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2685 | `male` | review_required | нет | 2 | 0 | 2 | Независимая защита male: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 10 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2686 | `mall` | review_required | нет | 1 | 0 | 1 | Независимая защита mall: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2687 | `man` | review_required | нет | 13 | 0 | 13 | Независимая защита man: stage06 содержит 4 найденных локаторов, stage08 проверил 17 значений, stage09 проверил 21 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2688 | `manage` | review_required | нет | 2 | 0 | 2 | Независимая защита manage: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2689 | `management` | review_required | нет | 3 | 0 | 3 | Независимая защита management: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2690 | `manager` | review_required | нет | 3 | 0 | 3 | Независимая защита manager: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2691 | `mandate` | review_required | нет | 3 | 0 | 3 | Независимая защита mandate: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2692 | `mandatory` | review_required | нет | 2 | 0 | 2 | Независимая защита mandatory: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2693 | `manifest` | review_required | нет | 8 | 0 | 8 | Независимая защита manifest: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 0 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2694 | `manipulate` | review_required | нет | 2 | 0 | 2 | Независимая защита manipulate: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2695 | `manipulation` | review_required | нет | 2 | 0 | 2 | Независимая защита manipulation: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2696 | `manner` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2697 | `manufacture` | review_required | нет | 4 | 0 | 4 | Независимая защита manufacture: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2698 | `manufacturing` | review_required | нет | 2 | 0 | 2 | Независимая защита manufacturing: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2699 | `manuscript` | review_required | нет | 2 | 0 | 2 | Независимая защита manuscript: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2700 | `many` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_035/stage_10.json` |
| 2701 | `map` | review_required | нет | 4 | 0 | 4 | Независимая защита map: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2702 | `marathon` | review_required | нет | 1 | 0 | 1 | Независимая защита marathon: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2703 | `March` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2704 | `march` | review_required | нет | 1 | 0 | 1 | Независимая защита march: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 10 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2705 | `margin` | review_required | нет | 6 | 0 | 6 | Независимая защита margin: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 2 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2706 | `marginal` | review_required | нет | 4 | 0 | 4 | Независимая защита marginal: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2707 | `marine` | review_required | нет | 5 | 0 | 5 | Независимая защита marine: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2708 | `mark` | review_required | нет | 25 | 0 | 25 | Независимая защита mark: stage06 содержит 4 найденных локаторов, stage08 проверил 33 значений, stage09 проверил 10 примеров; пустых значений 25, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 25 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2709 | `marker` | review_required | нет | 7 | 0 | 7 | Независимая защита marker: stage06 содержит 3 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 0 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2710 | `market` | review_required | нет | 5 | 0 | 5 | Независимая защита market: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 9 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2711 | `marketing` | review_required | нет | 3 | 0 | 3 | Независимая защита marketing: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2712 | `marketplace` | review_required | нет | 1 | 0 | 1 | Независимая защита marketplace: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2713 | `marriage` | review_required | нет | 4 | 0 | 4 | Независимая защита marriage: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 7 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2714 | `married` | review_required | нет | 2 | 0 | 2 | Независимая защита married: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2715 | `marry` | review_required | нет | 2 | 0 | 2 | Независимая защита marry: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2716 | `martial` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2717 | `mask` | review_required | нет | 9 | 0 | 9 | Независимая защита mask: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 1 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2718 | `mass` | review_required | нет | 6 | 0 | 6 | Независимая защита mass: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 5 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2719 | `massacre` | review_required | нет | 1 | 0 | 1 | Независимая защита massacre: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2720 | `massive` | review_required | нет | 4 | 0 | 4 | Независимая защита massive: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_036/stage_10.json` |
| 2721 | `master` | review_required | нет | 13 | 0 | 13 | Независимая защита master: stage06 содержит 4 найденных локаторов, stage08 проверил 17 значений, stage09 проверил 8 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2722 | `match1` | review_required | нет | 7 | 0 | 7 | Независимая защита match1: stage06 содержит 0 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 9 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2723 | `match2` | review_required | нет | 7 | 0 | 7 | Независимая защита match2: stage06 содержит 0 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 9 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2724 | `matching` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2725 | `mate` | review_required | нет | 12 | 0 | 12 | Независимая защита mate: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 2 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2726 | `material` | review_required | нет | 3 | 0 | 3 | Независимая защита material: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 5 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2727 | `mathematical` | review_required | нет | 1 | 0 | 1 | Независимая защита mathematical: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2728 | `mathematics` | review_required | нет | 1 | 0 | 1 | Независимая защита mathematics: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2729 | `maths` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2730 | `matter` | review_required | нет | 8 | 0 | 8 | Независимая защита matter: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 11 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2731 | `mature` | review_required | нет | 6 | 0 | 6 | Независимая защита mature: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2732 | `maximize` | review_required | нет | 2 | 0 | 2 | Независимая защита maximize: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2733 | `maximum` | review_required | нет | 2 | 0 | 2 | Независимая защита maximum: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2734 | `May` | review_required | нет | 7 | 0 | 7 | Независимая защита May: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 0 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2735 | `may` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2736 | `maybe` | review_required | нет | 1 | 0 | 1 | Независимая защита maybe: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2737 | `mayor` | review_required | нет | 1 | 0 | 1 | Независимая защита mayor: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2738 | `me` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2739 | `meal` | review_required | нет | 5 | 0 | 5 | Независимая защита meal: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2740 | `mean1` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_037/stage_10.json` |
| 2741 | `mean2` | review_required | нет | 1 | 0 | 1 | Независимая защита mean2: stage06 содержит 0 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2742 | `mean3` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2743 | `meaning` | review_required | нет | 1 | 0 | 1 | Независимая защита meaning: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2744 | `meaningful` | review_required | нет | 1 | 0 | 1 | Независимая защита meaningful: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2745 | `means` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2746 | `meantime` | review_required | нет | 2 | 0 | 2 | Независимая защита meantime: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2747 | `meanwhile` | review_required | нет | 1 | 0 | 1 | Независимая защита meanwhile: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2748 | `measure` | review_required | нет | 10 | 0 | 10 | Независимая защита measure: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 16 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2749 | `measurement` | review_required | нет | 3 | 0 | 3 | Независимая защита measurement: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2750 | `meat` | review_required | нет | 2 | 0 | 2 | Независимая защита meat: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2751 | `mechanic` | review_required | нет | 2 | 0 | 2 | Независимая защита mechanic: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2752 | `mechanical` | review_required | нет | 3 | 0 | 3 | Независимая защита mechanical: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2753 | `mechanism` | review_required | нет | 3 | 0 | 3 | Независимая защита mechanism: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2754 | `medal` | review_required | нет | 1 | 0 | 1 | Независимая защита medal: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2755 | `media` | review_required | нет | 2 | 0 | 2 | Независимая защита media: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2756 | `medical` | review_required | нет | 1 | 0 | 1 | Независимая защита medical: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 10 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2757 | `medication` | review_required | нет | 1 | 0 | 1 | Независимая защита medication: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2758 | `medicine` | review_required | нет | 2 | 0 | 2 | Независимая защита medicine: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2759 | `medieval` | review_required | нет | 1 | 0 | 1 | Независимая защита medieval: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2760 | `meditation` | review_required | нет | 2 | 0 | 2 | Независимая защита meditation: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_038/stage_10.json` |
| 2761 | `medium` | review_required | нет | 7 | 0 | 7 | Независимая защита medium: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 4 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2762 | `meet` | review_required | нет | 6 | 0 | 6 | Независимая защита meet: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 10 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2763 | `meeting` | review_required | нет | 5 | 0 | 5 | Независимая защита meeting: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 3 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2764 | `melody` | review_required | нет | 2 | 0 | 2 | Независимая защита melody: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2765 | `melt` | review_required | нет | 8 | 0 | 8 | Независимая защита melt: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 2 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2766 | `member` | review_required | нет | 1 | 0 | 1 | Независимая защита member: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 6 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2767 | `membership` | review_required | нет | 3 | 0 | 3 | Независимая защита membership: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2768 | `memo` | review_required | нет | 1 | 0 | 1 | Независимая защита memo: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2769 | `memoir` | review_required | нет | 3 | 0 | 3 | Независимая защита memoir: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2770 | `memorable` | review_required | нет | 2 | 0 | 2 | Независимая защита memorable: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2771 | `memorial` | review_required | нет | 7 | 0 | 7 | Независимая защита memorial: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 1 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2772 | `memory` | review_required | нет | 2 | 0 | 2 | Независимая защита memory: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 5 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2773 | `mental` | review_required | нет | 2 | 0 | 2 | Независимая защита mental: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 10 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2774 | `mention` | review_required | нет | 1 | 0 | 1 | Независимая защита mention: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2775 | `mentor` | review_required | нет | 1 | 0 | 1 | Независимая защита mentor: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2776 | `menu` | review_required | нет | 2 | 0 | 2 | Независимая защита menu: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2777 | `merchant` | review_required | нет | 4 | 0 | 4 | Независимая защита merchant: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 3 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2778 | `mercy` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2779 | `mere` | review_required | нет | 1 | 0 | 1 | Независимая защита mere: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2780 | `merely` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_039/stage_10.json` |
| 2781 | `merge` | review_required | нет | 2 | 0 | 2 | Независимая защита merge: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2782 | `merger` | review_required | нет | 2 | 0 | 2 | Независимая защита merger: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2783 | `merit` | review_required | нет | 2 | 0 | 2 | Независимая защита merit: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2784 | `mess` | review_required | нет | 9 | 0 | 9 | Независимая защита mess: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 7 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2785 | `message` | review_required | нет | 4 | 0 | 4 | Независимая защита message: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 4 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2786 | `metal` | review_required | нет | 8 | 0 | 8 | Независимая защита metal: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 1 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2787 | `metaphor` | review_required | нет | 1 | 0 | 1 | Независимая защита metaphor: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2788 | `method` | review_required | нет | 4 | 0 | 4 | Независимая защита method: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2789 | `methodology` | review_required | нет | 1 | 0 | 1 | Независимая защита methodology: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2790 | `metre` | review_required | нет | 2 | 0 | 2 | Независимая защита metre: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2791 | `middle` | review_required | нет | 5 | 0 | 5 | Независимая защита middle: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 6 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2792 | `midnight` | review_required | нет | 2 | 0 | 2 | Независимая защита midnight: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2793 | `midst` | review_required | нет | 1 | 0 | 1 | Независимая защита midst: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2794 | `might` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2795 | `migration` | review_required | нет | 2 | 0 | 2 | Независимая защита migration: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2796 | `mild` | review_required | нет | 3 | 0 | 3 | Независимая защита mild: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2797 | `mile` | review_required | нет | 3 | 0 | 3 | Независимая защита mile: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 4 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2798 | `militant` | review_required | нет | 2 | 0 | 2 | Независимая защита militant: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2799 | `military` | review_required | нет | 2 | 0 | 2 | Независимая защита military: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 14 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2800 | `militia` | review_required | нет | 2 | 0 | 2 | Независимая защита militia: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_040/stage_10.json` |
| 2801 | `milk` | review_required | нет | 9 | 0 | 9 | Независимая защита milk: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 0 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2802 | `mill` | review_required | нет | 17 | 0 | 17 | Независимая защита mill: stage06 содержит 4 найденных локаторов, stage08 проверил 18 значений, stage09 проверил 1 примеров; пустых значений 17, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 17 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2803 | `million` | review_required | нет | 1 | 0 | 1 | Независимая защита million: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2804 | `mind` | review_required | нет | 1 | 0 | 1 | Независимая защита mind: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 30 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2805 | `mine1` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2806 | `mine2` | review_required | нет | 10 | 0 | 10 | Независимая защита mine2: stage06 содержит 0 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 1 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2807 | `miner` | review_required | нет | 1 | 0 | 1 | Независимая защита miner: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2808 | `mineral` | review_required | нет | 5 | 0 | 5 | Независимая защита mineral: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 1 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2809 | `minimal` | review_required | нет | 2 | 0 | 2 | Независимая защита minimal: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2810 | `minimize` | review_required | нет | 2 | 0 | 2 | Независимая защита minimize: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2811 | `minimum` | review_required | нет | 1 | 0 | 1 | Независимая защита minimum: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2812 | `mining` | review_required | нет | 2 | 0 | 2 | Независимая защита mining: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 5 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2813 | `minister` | review_required | нет | 4 | 0 | 4 | Независимая защита minister: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2814 | `ministry` | review_required | нет | 3 | 0 | 3 | Независимая защита ministry: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2815 | `minor` | review_required | нет | 7 | 0 | 7 | Независимая защита minor: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 4 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2816 | `minority` | review_required | нет | 2 | 0 | 2 | Независимая защита minority: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2817 | `minute` | review_required | нет | 4 | 0 | 4 | Независимая защита minute: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 4 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2818 | `minute` | review_required | нет | 3 | 0 | 3 | Независимая защита minute: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2819 | `miracle` | review_required | нет | 1 | 0 | 1 | Независимая защита miracle: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2820 | `mirror` | review_required | нет | 3 | 0 | 3 | Независимая защита mirror: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_041/stage_10.json` |
| 2821 | `miserable` | review_required | нет | 4 | 0 | 4 | Независимая защита miserable: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2822 | `misery` | review_required | нет | 4 | 0 | 4 | Независимая защита misery: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2823 | `misleading` | review_required | нет | 1 | 0 | 1 | Независимая защита misleading: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2824 | `miss` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2825 | `missile` | review_required | нет | 4 | 0 | 4 | Независимая защита missile: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2826 | `missing` | review_required | нет | 1 | 0 | 1 | Независимая защита missing: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2827 | `mission` | review_required | нет | 11 | 0 | 11 | Независимая защита mission: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 1 примеров; пустых значений 11, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 11 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2828 | `mistake` | review_required | нет | 1 | 0 | 1 | Независимая защита mistake: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2829 | `mix` | review_required | нет | 6 | 0 | 6 | Независимая защита mix: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 5 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2830 | `mixed` | review_required | нет | 2 | 0 | 2 | Независимая защита mixed: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 5 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2831 | `mixture` | review_required | нет | 2 | 0 | 2 | Независимая защита mixture: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2832 | `mob` | review_required | нет | 5 | 0 | 5 | Независимая защита mob: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2833 | `mobile` | review_required | нет | 2 | 0 | 2 | Независимая защита mobile: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2834 | `mobility` | review_required | нет | 2 | 0 | 2 | Независимая защита mobility: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2835 | `mobilize` | review_required | нет | 3 | 0 | 3 | Независимая защита mobilize: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2836 | `mode` | review_required | нет | 3 | 0 | 3 | Независимая защита mode: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2837 | `model` | review_required | нет | 10 | 0 | 10 | Независимая защита model: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 2 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2838 | `moderate` | review_required | нет | 5 | 0 | 5 | Независимая защита moderate: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 3 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2839 | `modern` | review_required | нет | 2 | 0 | 2 | Независимая защита modern: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2840 | `modest` | review_required | нет | 2 | 0 | 2 | Независимая защита modest: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_042/stage_10.json` |
| 2841 | `modification` | review_required | нет | 3 | 0 | 3 | Независимая защита modification: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2842 | `modify` | review_required | нет | 4 | 0 | 4 | Независимая защита modify: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2843 | `moment` | review_required | нет | 1 | 0 | 1 | Независимая защита moment: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 7 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2844 | `momentum` | review_required | нет | 1 | 0 | 1 | Независимая защита momentum: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2845 | `Monday` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2846 | `money` | review_required | нет | 1 | 0 | 1 | Независимая защита money: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 5 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2847 | `monitor` | review_required | нет | 12 | 0 | 12 | Независимая защита monitor: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 1 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2848 | `monk` | review_required | нет | 1 | 0 | 1 | Независимая защита monk: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2849 | `monkey` | review_required | нет | 10 | 0 | 10 | Независимая защита monkey: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 0 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2850 | `monopoly` | review_required | нет | 1 | 0 | 1 | Независимая защита monopoly: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2851 | `monster` | review_required | нет | 4 | 0 | 4 | Независимая защита monster: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2852 | `month` | review_required | нет | 2 | 0 | 2 | Независимая защита month: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2853 | `monthly` | review_required | нет | 3 | 0 | 3 | Независимая защита monthly: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2854 | `monument` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2855 | `mood` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2856 | `moon` | review_required | нет | 6 | 0 | 6 | Независимая защита moon: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 1 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2857 | `moral` | review_required | нет | 3 | 0 | 3 | Независимая защита moral: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 5 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2858 | `morality` | review_required | нет | 4 | 0 | 4 | Независимая защита morality: stage06 содержит 3 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2859 | `more` | review_required | нет | 3 | 0 | 3 | Независимая защита more: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 6 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2860 | `moreover` | review_required | нет | 1 | 0 | 1 | Независимая защита moreover: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_043/stage_10.json` |
| 2861 | `morning` | review_required | нет | 1 | 0 | 1 | Независимая защита morning: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 5 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2862 | `mortgage` | review_required | нет | 3 | 0 | 3 | Независимая защита mortgage: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2863 | `mosque` | review_required | нет | 1 | 0 | 1 | Независимая защита mosque: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2864 | `most` | review_required | нет | 3 | 0 | 3 | Независимая защита most: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 5 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2865 | `mostly` | review_required | нет | 1 | 0 | 1 | Независимая защита mostly: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2866 | `mother` | review_required | нет | 5 | 0 | 5 | Независимая защита mother: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 3 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2867 | `motion` | review_required | нет | 7 | 0 | 7 | Независимая защита motion: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 4 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2868 | `motivate` | review_required | нет | 3 | 0 | 3 | Независимая защита motivate: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2869 | `motivation` | review_required | нет | 2 | 0 | 2 | Независимая защита motivation: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2870 | `motive` | review_required | нет | 3 | 0 | 3 | Независимая защита motive: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2871 | `motor` | review_required | нет | 7 | 0 | 7 | Независимая защита motor: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 1 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2872 | `motorcycle` | review_required | нет | 2 | 0 | 2 | Независимая защита motorcycle: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2873 | `motorist` | review_required | нет | 1 | 0 | 1 | Независимая защита motorist: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2874 | `mount` | review_required | нет | 12 | 0 | 12 | Независимая защита mount: stage06 содержит 4 найденных локаторов, stage08 проверил 17 значений, stage09 проверил 8 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2875 | `mountain` | review_required | нет | 6 | 0 | 6 | Независимая защита mountain: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 0 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2876 | `mouse` | review_required | нет | 3 | 0 | 3 | Независимая защита mouse: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2877 | `mouth` | review_required | нет | 17 | 0 | 17 | Независимая защита mouth: stage06 содержит 4 найденных локаторов, stage08 проверил 18 значений, stage09 проверил 2 примеров; пустых значений 17, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 17 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2878 | `move` | review_required | нет | 9 | 0 | 9 | Независимая защита move: stage06 содержит 4 найденных локаторов, stage08 проверил 17 значений, stage09 проверил 15 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2879 | `movement` | review_required | нет | 10 | 0 | 10 | Независимая защита movement: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 1 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2880 | `movie` | review_required | нет | 2 | 0 | 2 | Независимая защита movie: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_044/stage_10.json` |
| 2881 | `moving` | review_required | нет | 2 | 0 | 2 | Независимая защита moving: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2882 | `much` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2883 | `mud` | review_required | нет | 1 | 0 | 1 | Независимая защита mud: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2884 | `multiple` | review_required | нет | 2 | 0 | 2 | Независимая защита multiple: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2885 | `multiply` | review_required | нет | 3 | 0 | 3 | Независимая защита multiply: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2886 | `mum` | review_required | нет | 2 | 0 | 2 | Независимая защита mum: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 3 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2887 | `municipal` | review_required | нет | 1 | 0 | 1 | Независимая защита municipal: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2888 | `murder` | review_required | нет | 3 | 0 | 3 | Независимая защита murder: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2889 | `muscle` | review_required | нет | 1 | 0 | 1 | Независимая защита muscle: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2890 | `museum` | review_required | нет | 1 | 0 | 1 | Независимая защита museum: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2891 | `music` | review_required | нет | 2 | 0 | 2 | Независимая защита music: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2892 | `musical` | review_required | нет | 1 | 0 | 1 | Независимая защита musical: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2893 | `musician` | review_required | нет | 2 | 0 | 2 | Независимая защита musician: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2894 | `must` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2895 | `mutual` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2896 | `my` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2897 | `myself` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2898 | `mysterious` | review_required | нет | 1 | 0 | 1 | Независимая защита mysterious: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2899 | `mystery` | review_required | нет | 1 | 0 | 1 | Независимая защита mystery: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 4 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2900 | `myth` | review_required | нет | 3 | 0 | 3 | Независимая защита myth: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_045/stage_10.json` |
| 2901 | `nail` | review_required | нет | 4 | 0 | 4 | Независимая защита nail: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 6 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2902 | `naked` | review_required | нет | 3 | 0 | 3 | Независимая защита naked: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 4 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2903 | `name` | review_required | нет | 5 | 0 | 5 | Независимая защита name: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 20 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2904 | `namely` | review_required | нет | 1 | 0 | 1 | Независимая защита namely: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2905 | `narrative` | review_required | нет | 4 | 0 | 4 | Независимая защита narrative: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2906 | `narrow` | review_required | нет | 1 | 0 | 1 | Независимая защита narrow: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 11 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2907 | `nasty` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2908 | `nation` | review_required | нет | 3 | 0 | 3 | Независимая защита nation: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2909 | `national` | review_required | нет | 1 | 0 | 1 | Независимая защита national: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 14 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2910 | `nationwide` | review_required | нет | 2 | 0 | 2 | Независимая защита nationwide: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2911 | `native` | review_required | нет | 7 | 0 | 7 | Независимая защита native: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 5 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2912 | `natural` | review_required | нет | 4 | 0 | 4 | Независимая защита natural: stage06 содержит 4 найденных локаторов, stage08 проверил 15 значений, stage09 проверил 25 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2913 | `naturally` | review_required | нет | 4 | 0 | 4 | Независимая защита naturally: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2914 | `nature` | review_required | нет | 1 | 0 | 1 | Независимая защита nature: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 11 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2915 | `naval` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2916 | `navigation` | review_required | нет | 2 | 0 | 2 | Независимая защита navigation: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2917 | `near` | review_required | нет | 3 | 0 | 3 | Независимая защита near: stage06 содержит 4 найденных локаторов, stage08 проверил 14 значений, stage09 проверил 24 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2918 | `nearby` | review_required | нет | 2 | 0 | 2 | Независимая защита nearby: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2919 | `nearly` | review_required | нет | 1 | 0 | 1 | Независимая защита nearly: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2920 | `neat` | review_required | нет | 4 | 0 | 4 | Независимая защита neat: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 6 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_046/stage_10.json` |
| 2921 | `necessarily` | review_required | нет | 2 | 0 | 2 | Независимая защита necessarily: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2922 | `necessary` | review_required | нет | 4 | 0 | 4 | Независимая защита necessary: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 1 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2923 | `necessity` | review_required | нет | 2 | 0 | 2 | Независимая защита necessity: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 4 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2924 | `neck` | review_required | нет | 12 | 0 | 12 | Независимая защита neck: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 2 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2925 | `need` | review_required | нет | 2 | 0 | 2 | Независимая защита need: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 12 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2926 | `needle` | review_required | нет | 17 | 0 | 17 | Независимая защита needle: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 5 примеров; пустых значений 17, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 17 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2927 | `negative` | review_required | нет | 12 | 0 | 12 | Независимая защита negative: stage06 содержит 4 найденных локаторов, stage08 проверил 16 значений, stage09 проверил 10 примеров; пустых значений 12, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2928 | `neglect` | review_required | нет | 2 | 0 | 2 | Независимая защита neglect: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 5 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2929 | `negotiate` | review_required | нет | 3 | 0 | 3 | Независимая защита negotiate: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2930 | `negotiation` | review_required | нет | 2 | 0 | 2 | Независимая защита negotiation: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2931 | `neighbour` | review_required | нет | 3 | 0 | 3 | Независимая защита neighbour: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 3 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2932 | `neighbourhood` | review_required | нет | 2 | 0 | 2 | Независимая защита neighbourhood: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 5 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2933 | `neighbouring` | review_required | нет | 1 | 0 | 1 | Независимая защита neighbouring: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2934 | `neither` | review_required | нет | 1 | 0 | 1 | Независимая защита neither: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 3 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2935 | `nerve` | review_required | нет | 2 | 0 | 2 | Независимая защита nerve: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 8 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2936 | `nervous` | review_required | нет | 1 | 0 | 1 | Независимая защита nervous: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 4 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2937 | `nest` | review_required | нет | 6 | 0 | 6 | Независимая защита nest: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 2 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2938 | `net` | review_required | нет | 13 | 0 | 13 | Независимая защита net: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 0 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2939 | `network` | review_required | нет | 10 | 0 | 10 | Независимая защита network: stage06 содержит 4 найденных локаторов, stage08 проверил 10 значений, stage09 проверил 0 примеров; пустых значений 10, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2940 | `neutral` | review_required | нет | 8 | 0 | 8 | Независимая защита neutral: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 3 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_047/stage_10.json` |
| 2941 | `never` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2942 | `nevertheless` | review_required | нет | 2 | 0 | 2 | Независимая защита nevertheless: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2943 | `new` | review_required | нет | 3 | 0 | 3 | Независимая защита new: stage06 содержит 4 найденных локаторов, stage08 проверил 11 значений, stage09 проверил 13 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2944 | `newly` | review_required | нет | 2 | 0 | 2 | Независимая защита newly: stage06 содержит 3 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2945 | `news` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2946 | `newsletter` | review_required | нет | 1 | 0 | 1 | Независимая защита newsletter: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2947 | `newspaper` | review_required | нет | 2 | 0 | 2 | Независимая защита newspaper: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2948 | `next` | review_required | нет | 2 | 0 | 2 | Независимая защита next: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 10 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2949 | `next to` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2950 | `nice` | review_required | нет | 6 | 0 | 6 | Независимая защита nice: stage06 содержит 4 найденных локаторов, stage08 проверил 12 значений, stage09 проверил 17 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2951 | `niche` | review_required | нет | 4 | 0 | 4 | Независимая защита niche: stage06 содержит 3 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2952 | `night` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2953 | `nightmare` | review_required | нет | 3 | 0 | 3 | Независимая защита nightmare: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2954 | `nine` | review_required | нет | 4 | 0 | 4 | Независимая защита nine: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2955 | `nineteen` | review_required | нет | 1 | 0 | 1 | Независимая защита nineteen: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2956 | `ninety` | review_required | нет | 1 | 0 | 1 | Независимая защита ninety: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2957 | `no` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2958 | `no one` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2959 | `noble` | review_required | нет | 8 | 0 | 8 | Независимая защита noble: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 0 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2960 | `nobody` | review_required | нет | 2 | 0 | 2 | Независимая защита nobody: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_048/stage_10.json` |
| 2961 | `nod` | review_required | нет | 4 | 0 | 4 | Независимая защита nod: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 4 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2962 | `noise` | review_required | нет | 4 | 0 | 4 | Независимая защита noise: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 3 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2963 | `noisy` | review_required | нет | 3 | 0 | 3 | Независимая защита noisy: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2964 | `nominate` | review_required | нет | 4 | 0 | 4 | Независимая защита nominate: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2965 | `nomination` | review_required | нет | 3 | 0 | 3 | Независимая защита nomination: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2966 | `nominee` | review_required | нет | 1 | 0 | 1 | Независимая защита nominee: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2967 | `non-profit` | review_required | нет | 1 | 0 | 1 | Независимая защита non-profit: stage06 содержит 0 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2968 | `none` | review_required | нет | 1 | 0 | 1 | Независимая защита none: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 2 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2969 | `nonetheless` | review_required | нет | 1 | 0 | 1 | Независимая защита nonetheless: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2970 | `nonsense` | review_required | нет | 3 | 0 | 3 | Независимая защита nonsense: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2971 | `noon` | review_required | нет | 3 | 0 | 3 | Независимая защита noon: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2972 | `nor` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2973 | `norm` | review_required | нет | 2 | 0 | 2 | Независимая защита norm: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2974 | `normal` | review_required | нет | 9 | 0 | 9 | Независимая защита normal: stage06 содержит 4 найденных локаторов, stage08 проверил 9 значений, stage09 проверил 0 примеров; пустых значений 9, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2975 | `normally` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2976 | `north` | review_required | нет | 6 | 0 | 6 | Независимая защита north: stage06 содержит 4 найденных локаторов, stage08 проверил 7 значений, stage09 проверил 3 примеров; пустых значений 6, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2977 | `northern` | review_required | нет | 3 | 0 | 3 | Независимая защита northern: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 0 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2978 | `nose` | review_required | нет | 8 | 0 | 8 | Независимая защита nose: stage06 содержит 4 найденных локаторов, stage08 проверил 13 значений, stage09 проверил 8 примеров; пустых значений 8, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2979 | `not` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2980 | `notable` | review_required | нет | 5 | 0 | 5 | Независимая защита notable: stage06 содержит 3 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_049/stage_10.json` |
| 2981 | `notably` | review_required | нет | 2 | 0 | 2 | Независимая защита notably: stage06 содержит 3 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2982 | `note` | review_required | нет | 13 | 0 | 13 | Независимая защита note: stage06 содержит 4 найденных локаторов, stage08 проверил 23 значений, stage09 проверил 14 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2983 | `notebook` | review_required | нет | 2 | 0 | 2 | Независимая защита notebook: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2984 | `nothing` | review_required | нет | 3 | 0 | 3 | Независимая защита nothing: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 9 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2985 | `notice` | review_required | нет | 5 | 0 | 5 | Независимая защита notice: stage06 содержит 4 найденных локаторов, stage08 проверил 8 значений, stage09 проверил 6 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2986 | `notify` | review_required | нет | 4 | 0 | 4 | Независимая защита notify: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 0 примеров; пустых значений 4, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2987 | `notion` | review_required | нет | 3 | 0 | 3 | Независимая защита notion: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 2 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2988 | `notorious` | review_required | нет | 1 | 0 | 1 | Независимая защита notorious: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 1 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2989 | `novel` | review_required | нет | 3 | 0 | 3 | Независимая защита novel: stage06 содержит 4 найденных локаторов, stage08 проверил 4 значений, stage09 проверил 1 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2990 | `novelist` | review_required | нет | 1 | 0 | 1 | Независимая защита novelist: stage06 содержит 3 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2991 | `November` | review_required | нет | 2 | 0 | 2 | Независимая защита November: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2992 | `now` | review_required | нет | 3 | 0 | 3 | Независимая защита now: stage06 содержит 4 найденных локаторов, stage08 проверил 6 значений, stage09 проверил 8 примеров; пустых значений 3, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2993 | `nowadays` | review_required | нет | 2 | 0 | 2 | Независимая защита nowadays: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 0 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2994 | `nowhere` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2995 | `nuclear` | review_required | нет | 1 | 0 | 1 | Независимая защита nuclear: stage06 содержит 4 найденных локаторов, stage08 проверил 2 значений, stage09 проверил 15 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2996 | `number` | review_required | нет | 7 | 0 | 7 | Независимая защита number: stage06 содержит 4 найденных локаторов, stage08 проверил 17 значений, stage09 проверил 13 примеров; пустых значений 7, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2997 | `numerous` | review_required | нет | 1 | 0 | 1 | Независимая защита numerous: stage06 содержит 4 найденных локаторов, stage08 проверил 1 значений, stage09 проверил 0 примеров; пустых значений 1, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2998 | `nurse` | review_required | нет | 13 | 0 | 13 | Независимая защита nurse: stage06 содержит 4 найденных локаторов, stage08 проверил 19 значений, stage09 проверил 7 примеров; пустых значений 13, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 2999 | `nursery` | review_required | нет | 5 | 0 | 5 | Независимая защита nursery: stage06 содержит 4 найденных локаторов, stage08 проверил 5 значений, stage09 проверил 0 примеров; пустых значений 5, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 3000 | `nursing` | review_required | нет | 2 | 0 | 2 | Независимая защита nursing: stage06 содержит 4 найденных локаторов, stage08 проверил 3 значений, stage09 проверил 1 примеров; пустых значений 2, сгенерированных примеров 0. Требуется ручная оценка учебного примера.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_3000/batch_050/stage_10.json` |
| 3001 | `nut` | принято без изменения | нет | 7 | 7 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3002 | `nutrition` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3003 | `o'clock` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3004 | `obesity` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3005 | `obey` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3006 | `object` | принято без изменения | нет | 4 | 4 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3007 | `objection` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3008 | `objective` | принято без изменения | нет | 5 | 5 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3009 | `obligation` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3010 | `oblige` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3011 | `observation` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3012 | `observe` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3013 | `observer` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3014 | `obsess` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3015 | `obsession` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3016 | `obstacle` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3017 | `obtain` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3018 | `obvious` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3019 | `obviously` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3020 | `occasion` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_001/stage_10.json` |
| 3021 | `occasional` | review_required | нет | 1 | 1 | 0 | occasional: роль 09 отметила 1 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3022 | `occasionally` | review_required | нет | 1 | 1 | 0 | occasionally: роль 09 отметила 1 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3023 | `occupation` | review_required | нет | 3 | 3 | 0 | occupation: роль 09 отметила 3 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3024 | `occupy` | review_required | нет | 3 | 3 | 0 | occupy: роль 09 отметила 3 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3025 | `occur` | review_required | нет | 2 | 2 | 0 | occur: роль 09 отметила 2 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3026 | `occurrence` | review_required | нет | 1 | 1 | 0 | occurrence: роль 09 отметила 1 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3027 | `ocean` | review_required | нет | 1 | 1 | 0 | ocean: роль 09 отметила 1 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3028 | `October` | review_required | нет | 2 | 2 | 0 | October: роль 09 отметила 2 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3029 | `odd` | review_required | нет | 2 | 2 | 0 | odd: роль 09 отметила 2 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3030 | `odds` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3031 | `of` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3032 | `off` | review_required | нет | 6 | 0 | 6 | off: роль 09 отметила 0 generated candidate(s) и 6 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3033 | `offence` | review_required | нет | 2 | 2 | 0 | offence: роль 09 отметила 2 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3034 | `offend` | review_required | нет | 1 | 1 | 0 | offend: роль 09 отметила 1 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3035 | `offender` | review_required | нет | 1 | 1 | 0 | offender: роль 09 отметила 1 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3036 | `offensive` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3037 | `offer` | review_required | нет | 4 | 0 | 4 | offer: роль 09 отметила 0 generated candidate(s) и 4 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3038 | `offering` | review_required | нет | 4 | 3 | 1 | offering: роль 09 отметила 3 generated candidate(s) и 1 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3039 | `office` | review_required | нет | 1 | 0 | 1 | office: роль 09 отметила 0 generated candidate(s) и 1 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3040 | `officer` | review_required | нет | 3 | 3 | 0 | officer: роль 09 отметила 3 generated candidate(s) и 0 no-candidate case(s); требуется независимое подтверждение точного значения перед публикацией. | `dictionary_audit_cycles/live_strict_5000/batch_002/stage_10.json` |
| 3041 | `official` | review_required | нет | 2 | 2 | 0 | official: 2 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3042 | `offspring` | review_required | нет | 2 | 2 | 0 | offspring: 2 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3043 | `often` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3044 | `oh` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3045 | `oil` | review_required | нет | 5 | 5 | 0 | oil: 5 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3046 | `OK` | review_required | нет | 4 | 4 | 0 | OK: 4 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3047 | `old` | review_required | нет | 4 | 0 | 4 | old: 0 generated examples are present, but 4 meanings remain without a safe source-backed or generated example; role 10 requires human review before acceptance.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3048 | `old-fashioned` | review_required | нет | 2 | 0 | 2 | old-fashioned: 0 generated examples are present, but 2 meanings remain without a safe source-backed or generated example; role 10 requires human review before acceptance.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3049 | `on` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3050 | `once` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3051 | `one` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3052 | `ongoing` | review_required | нет | 1 | 1 | 0 | ongoing: 1 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3053 | `onion` | review_required | нет | 3 | 3 | 0 | onion: 3 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3054 | `online` | review_required | нет | 2 | 2 | 0 | online: 2 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3055 | `only` | review_required | нет | 1 | 1 | 0 | only: 1 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3056 | `onto` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3057 | `open` | review_required | нет | 4 | 4 | 0 | open: 4 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3058 | `opening` | review_required | нет | 11 | 11 | 0 | opening: 11 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3059 | `openly` | review_required | нет | 2 | 2 | 0 | openly: 2 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3060 | `opera` | review_required | нет | 2 | 2 | 0 | opera: 2 newly generated example(s) require independent semantic review against the exact translation and part of speech before acceptance. | `dictionary_audit_cycles/live_strict_5000/batch_003/stage_10.json` |
| 3061 | `operate` | принято без изменения | нет | 5 | 5 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3062 | `operation` | принято без изменения | нет | 7 | 7 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3063 | `operational` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3064 | `operator` | принято без изменения | нет | 4 | 4 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3065 | `opinion` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3066 | `opponent` | review_required | нет | 3 | 3 | 0 | Opponent examples were reviewed for noun and adjective senses; one adjective formulation remains potentially context-dependent. | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3067 | `opportunity` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3068 | `oppose` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3069 | `opposed` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3070 | `opposite` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3071 | `opposition` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3072 | `opt` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3073 | `optical` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3074 | `optimism` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3075 | `optimistic` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3076 | `option` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3077 | `or` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3078 | `oral` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3079 | `orange` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3080 | `orchestra` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_004/stage_10.json` |
| 3081 | `order` | принято без изменения | нет | 11 | 11 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3082 | `ordinary` | review_required | нет | 8 | 7 | 1 | Role 10 проверил слово ordinary: 9 meaning checks, 7 generated examples and 1 no-candidate cases; no-candidate evidence требует review before any dictionary change.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3083 | `organ` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3084 | `organic` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3085 | `organization` | принято без изменения | нет | 6 | 6 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3086 | `organizational` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3087 | `organize` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3088 | `organized` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3089 | `organizer` | review_required | нет | 2 | 1 | 1 | Role 10 проверил слово organizer: 2 meaning checks, 1 generated examples and 1 no-candidate cases; no-candidate evidence требует review before any dictionary change.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3090 | `orientation` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3091 | `origin` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3092 | `original` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3093 | `originally` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3094 | `originate` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3095 | `other` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3096 | `otherwise` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3097 | `ought` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3098 | `our` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3099 | `ours` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3100 | `ourselves` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_005/stage_10.json` |
| 3101 | `out` | review_required | нет | 7 | 1 | 6 | out: проверено 15 значений; 1 generated candidates и 6 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3102 | `outbreak` | review_required | нет | 4 | 3 | 1 | outbreak: проверено 5 значений; 3 generated candidates и 1 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3103 | `outcome` | review_required | нет | 1 | 1 | 0 | outcome: проверено 1 значений; 1 generated candidates и 0 unresolved meanings требуют независимой редакторской проверки точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3104 | `outdoor` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3105 | `outdoors` | review_required | нет | 1 | 1 | 0 | outdoors: проверено 2 значений; 1 generated candidates и 0 unresolved meanings требуют независимой редакторской проверки точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3106 | `outer` | review_required | нет | 3 | 1 | 2 | outer: проверено 5 значений; 1 generated candidates и 2 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3107 | `outfit` | review_required | нет | 5 | 2 | 3 | outfit: проверено 8 значений; 2 generated candidates и 3 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3108 | `outing` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3109 | `outlet` | review_required | нет | 4 | 4 | 0 | outlet: проверено 6 значений; 4 generated candidates и 0 unresolved meanings требуют независимой редакторской проверки точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3110 | `outline` | review_required | нет | 6 | 5 | 1 | outline: проверено 7 значений; 5 generated candidates и 1 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3111 | `outlook` | review_required | нет | 5 | 4 | 1 | outlook: проверено 6 значений; 4 generated candidates и 1 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3112 | `output` | review_required | нет | 3 | 2 | 1 | output: проверено 4 значений; 2 generated candidates и 1 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3113 | `outrage` | review_required | нет | 4 | 2 | 2 | outrage: проверено 7 значений; 2 generated candidates и 2 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3114 | `outside` | review_required | нет | 10 | 2 | 8 | outside: проверено 21 значений; 2 generated candidates и 8 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3115 | `outsider` | review_required | нет | 4 | 4 | 0 | outsider: проверено 4 значений; 4 generated candidates и 0 unresolved meanings требуют независимой редакторской проверки точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3116 | `outstanding` | review_required | нет | 1 | 0 | 1 | outstanding: проверено 4 значений; 0 generated candidates и 1 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3117 | `oven` | review_required | нет | 1 | 1 | 0 | oven: проверено 1 значений; 1 generated candidates и 0 unresolved meanings требуют независимой редакторской проверки точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3118 | `over` | review_required | нет | 7 | 0 | 7 | over: проверено 21 значений; 0 generated candidates и 7 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3119 | `overall` | review_required | нет | 4 | 4 | 0 | overall: проверено 6 значений; 4 generated candidates и 0 unresolved meanings требуют независимой редакторской проверки точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3120 | `overcome` | review_required | нет | 1 | 0 | 1 | overcome: проверено 3 значений; 0 generated candidates и 1 unresolved meanings требуют независимой редакторской проверки точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_006/stage_10.json` |
| 3121 | `overlook` | review_required | нет | 3 | 3 | 0 | generated example for the figurative evil-eye sense is not idiomatic and must be replaced or sourced | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3122 | `overly` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3123 | `overnight` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3124 | `overseas` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3125 | `oversee` | review_required | нет | 3 | 3 | 0 | generated examples conflate oversee with spying and accidentally seeing; meanings need source confirmation | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3126 | `overturn` | review_required | нет | 3 | 3 | 0 | noun example “a major overturn” is unnatural for the claimed defeat sense | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3127 | `overwhelm` | принято без изменения | нет | 6 | 6 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3128 | `overwhelming` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3129 | `owe` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3130 | `own` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3131 | `owner` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3132 | `ownership` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3133 | `oxygen` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3134 | `pace` | review_required | нет | 8 | 8 | 0 | generated examples for horse gait and floor platform need lexical confirmation; one uses pace where a technical term may be required | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3135 | `pack` | review_required | нет | 22 | 22 | 0 | several rare senses (property security, pack stone, wet-sheet treatment) need source-backed or specialist review | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3136 | `package` | принято без изменения | нет | 7 | 7 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3137 | `packet` | review_required | нет | 4 | 4 | 0 | “a packet of people” is not a natural collocation for the claimed group sense | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3138 | `pad` | review_required | нет | 13 | 13 | 0 | examples for primer/padding senses may conflate pad, pad out, and apply; review required | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3139 | `page` | review_required | нет | 9 | 9 | 0 | the haircut example likely needs “pageboy” rather than bare page | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3140 | `pain` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_007/stage_10.json` |
| 3141 | `painful` | принято без изменения | нет | 0 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3142 | `paint` | принято без изменения | нет | 0 | 4 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3143 | `painter` | принято без изменения | нет | 0 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3144 | `painting` | принято без изменения | нет | 1 | 4 | 1 | проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3145 | `pair` | review_required | нет | 3 | 6 | 3 | Несколько generated examples для pair требуют review: «pair table» не является естественным английским сочетанием, а «pair of workers» неочевидно соответствует словарному значению; автоматически принимать нельзя.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3146 | `palace` | принято без изменения | нет | 1 | 2 | 1 | проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3147 | `pale` | принято без изменения | нет | 6 | 4 | 6 | проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3148 | `palm` | review_required | нет | 5 | 3 | 5 | Generated example для palm (#5) переводит palmed как «погладила ладонью», хотя значение может быть «спрятала/провела рукой»; требуется сверка с источником.; проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3149 | `pan` | review_required | нет | 12 | 3 | 12 | Generated example для pan (#9) про счастливое лицо не демонстрирует значение слова pan; пример отклонён до уточнения смысла.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3150 | `panel` | принято без изменения | нет | 13 | 4 | 13 | проверить 13 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3151 | `panic` | принято без изменения | нет | 3 | 2 | 3 | проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3152 | `pants` | принято без изменения | нет | 1 | 1 | 1 | проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3153 | `paper` | review_required | нет | 8 | 5 | 8 | Generated example для paper (#14) «paper office» звучит неестественно и не подтверждает значение; требуется редакторская проверка.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3154 | `parade` | принято без изменения | нет | 5 | 3 | 5 | проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3155 | `paragraph` | принято без изменения | нет | 3 | 1 | 3 | проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3156 | `parallel` | принято без изменения | нет | 6 | 3 | 6 | проверить 6 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3157 | `parameter` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3158 | `parent` | принято без изменения | нет | 5 | 1 | 5 | проверить 5 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3159 | `parental` | принято без изменения | нет | 1 | 1 | 1 | проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3160 | `parish` | принято без изменения | нет | 1 | 2 | 1 | проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_008/stage_10.json` |
| 3161 | `park` | review_required | нет | 7 | 3 | 4 | park: независимая защита нашла 3 сгенерированных примеров и 4 значений без кандидата; требуется ручная проверка точного соответствия.; проверить 4 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3162 | `parking` | review_required | нет | 1 | 1 | 0 | parking: независимая защита нашла 1 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3163 | `parliament` | review_required | нет | 2 | 2 | 0 | parliament: независимая защита нашла 2 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3164 | `parliamentary` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3165 | `part` | review_required | нет | 7 | 6 | 1 | part: независимая защита нашла 6 сгенерированных примеров и 1 значений без кандидата; требуется ручная проверка точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3166 | `part-time` | review_required | нет | 1 | 1 | 0 | part-time: независимая защита нашла 1 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3167 | `partial` | review_required | нет | 2 | 2 | 0 | partial: независимая защита нашла 2 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3168 | `partially` | review_required | нет | 1 | 1 | 0 | partially: независимая защита нашла 1 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3169 | `participant` | review_required | нет | 1 | 1 | 0 | participant: независимая защита нашла 1 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3170 | `participate` | review_required | нет | 4 | 4 | 0 | participate: независимая защита нашла 4 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3171 | `participation` | review_required | нет | 1 | 1 | 0 | participation: независимая защита нашла 1 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3172 | `particular` | review_required | нет | 2 | 2 | 0 | particular: независимая защита нашла 2 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3173 | `particularly` | review_required | нет | 3 | 3 | 0 | particularly: независимая защита нашла 3 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3174 | `partly` | review_required | нет | 2 | 2 | 0 | partly: независимая защита нашла 2 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3175 | `partner` | review_required | нет | 7 | 5 | 2 | partner: независимая защита нашла 5 сгенерированных примеров и 2 значений без кандидата; требуется ручная проверка точного соответствия.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3176 | `partnership` | review_required | нет | 2 | 2 | 0 | partnership: независимая защита нашла 2 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3177 | `party` | review_required | нет | 2 | 2 | 0 | party: независимая защита нашла 2 сгенерированных примеров и 0 значений без кандидата; требуется ручная проверка точного соответствия. | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3178 | `pass` | review_required | нет | 31 | 10 | 21 | pass: независимая защита нашла 10 сгенерированных примеров и 21 значений без кандидата; требуется ручная проверка точного соответствия.; проверить 21 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3179 | `passage` | review_required | нет | 12 | 3 | 9 | passage: независимая защита нашла 3 сгенерированных примеров и 9 значений без кандидата; требуется ручная проверка точного соответствия.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3180 | `passenger` | review_required | нет | 3 | 2 | 1 | passenger: независимая защита нашла 2 сгенерированных примеров и 1 значений без кандидата; требуется ручная проверка точного соответствия.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_009/stage_10.json` |
| 3181 | `passing` | review_required | нет | 4 | 3 | 1 | Role 10 reviewed 3 generated and 1 unresolved example checks for passing; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3182 | `passion` | review_required | нет | 5 | 3 | 2 | Role 10 reviewed 3 generated and 2 unresolved example checks for passion; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3183 | `passionate` | review_required | нет | 2 | 2 | 0 | Role 10 reviewed 2 generated and 0 unresolved example checks for passionate; each candidate must be confirmed against the exact meaning and POS before dataset insertion. | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3184 | `passive` | review_required | нет | 4 | 2 | 2 | Role 10 reviewed 2 generated and 2 unresolved example checks for passive; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3185 | `passport` | review_required | нет | 2 | 1 | 1 | Role 10 reviewed 1 generated and 1 unresolved example checks for passport; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3186 | `password` | review_required | нет | 1 | 1 | 0 | Role 10 reviewed 1 generated and 0 unresolved example checks for password; each candidate must be confirmed against the exact meaning and POS before dataset insertion. | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3187 | `past` | review_required | нет | 2 | 1 | 1 | Role 10 reviewed 1 generated and 1 unresolved example checks for past; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3188 | `pastor` | review_required | нет | 3 | 1 | 2 | Role 10 reviewed 1 generated and 2 unresolved example checks for pastor; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3189 | `patch` | review_required | нет | 8 | 5 | 3 | Role 10 reviewed 5 generated and 3 unresolved example checks for patch; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 3 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3190 | `patent` | review_required | нет | 9 | 0 | 9 | Role 10 reviewed 0 generated and 9 unresolved example checks for patent; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3191 | `path` | review_required | нет | 4 | 2 | 2 | Role 10 reviewed 2 generated and 2 unresolved example checks for path; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3192 | `pathway` | review_required | нет | 2 | 1 | 1 | Role 10 reviewed 1 generated and 1 unresolved example checks for pathway; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3193 | `patience` | review_required | нет | 1 | 1 | 0 | Role 10 reviewed 1 generated and 0 unresolved example checks for patience; each candidate must be confirmed against the exact meaning and POS before dataset insertion. | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3194 | `patient` | review_required | нет | 2 | 2 | 0 | Role 10 reviewed 2 generated and 0 unresolved example checks for patient; each candidate must be confirmed against the exact meaning and POS before dataset insertion. | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3195 | `patrol` | review_required | нет | 4 | 2 | 2 | Role 10 reviewed 2 generated and 2 unresolved example checks for patrol; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3196 | `patron` | review_required | нет | 3 | 2 | 1 | Role 10 reviewed 2 generated and 1 unresolved example checks for patron; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3197 | `pattern` | review_required | нет | 11 | 4 | 7 | Role 10 reviewed 4 generated and 7 unresolved example checks for pattern; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3198 | `pause` | review_required | нет | 4 | 2 | 2 | Role 10 reviewed 2 generated and 2 unresolved example checks for pause; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3199 | `pay` | review_required | нет | 4 | 3 | 1 | Role 10 reviewed 3 generated and 1 unresolved example checks for pay; each candidate must be confirmed against the exact meaning and POS before dataset insertion.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3200 | `payment` | review_required | нет | 1 | 1 | 0 | Role 10 reviewed 1 generated and 0 unresolved example checks for payment; each candidate must be confirmed against the exact meaning and POS before dataset insertion. | `dictionary_audit_cycles/live_strict_5000/batch_010/stage_10.json` |
| 3201 | `peace` | review_required | нет | 1 | 1 | 0 | peace: независимая проверка выявила 1 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3202 | `peaceful` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3203 | `peak` | review_required | нет | 8 | 7 | 1 | peak: независимая проверка выявила 7 сгенерированных и 1 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3204 | `peasant` | review_required | нет | 1 | 1 | 0 | peasant: независимая проверка выявила 1 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3205 | `peculiar` | review_required | нет | 2 | 2 | 0 | peculiar: независимая проверка выявила 2 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3206 | `peer` | review_required | нет | 3 | 3 | 0 | peer: независимая проверка выявила 3 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3207 | `pen` | review_required | нет | 8 | 8 | 0 | pen: независимая проверка выявила 8 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3208 | `penalty` | review_required | нет | 2 | 2 | 0 | penalty: независимая проверка выявила 2 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3209 | `pencil` | review_required | нет | 4 | 4 | 0 | pencil: независимая проверка выявила 4 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3210 | `penny` | review_required | нет | 2 | 2 | 0 | penny: независимая проверка выявила 2 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3211 | `pension` | review_required | нет | 3 | 3 | 0 | pension: независимая проверка выявила 3 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3212 | `people` | review_required | нет | 7 | 7 | 0 | people: независимая проверка выявила 7 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3213 | `pepper` | review_required | нет | 8 | 8 | 0 | pepper: независимая проверка выявила 8 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3214 | `per` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3215 | `per cent` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3216 | `perceive` | review_required | нет | 2 | 2 | 0 | perceive: независимая проверка выявила 2 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3217 | `percentage` | review_required | нет | 2 | 2 | 0 | percentage: независимая проверка выявила 2 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3218 | `perception` | review_required | нет | 4 | 4 | 0 | perception: независимая проверка выявила 4 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3219 | `perfect` | review_required | нет | 7 | 7 | 0 | perfect: независимая проверка выявила 7 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3220 | `perfectly` | review_required | нет | 2 | 2 | 0 | perfectly: независимая проверка выявила 2 сгенерированных и 0 оставленных без примера значений; требуется подтверждение точного соответствия каждого примера. | `dictionary_audit_cycles/live_strict_5000/batch_011/stage_10.json` |
| 3221 | `perform` | принято без изменения | нет | 4 | 4 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3222 | `performance` | review_required | нет | 8 | 8 | 0 | Некоторые сгенерированные значения performance требуют сверки с частотным учебным употреблением, особенно производительность и трюки. | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3223 | `perhaps` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3224 | `period` | review_required | нет | 6 | 6 | 0 | Риторическое и специализированное значения period требуют дополнительной проверки контекста перед включением. | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3225 | `permanent` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3226 | `permanently` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3227 | `permission` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3228 | `permit` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3229 | `persist` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3230 | `persistent` | review_required | нет | 3 | 3 | 0 | Примеры для ботанического и биологического употребления persistent узкоспециализированы; оставить на review. | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3231 | `person` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3232 | `personal` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3233 | `personality` | принято без изменения | нет | 4 | 4 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3234 | `personally` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3235 | `personnel` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3236 | `perspective` | принято без изменения | нет | 3 | 3 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3237 | `persuade` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3238 | `pet` | review_required | нет | 5 | 5 | 0 | Фраза про взаимное petting может быть устаревшей или двусмысленной для учащегося. | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3239 | `petition` | review_required | нет | 5 | 5 | 0 | Часть юридических употреблений petition требует проверки регистра и контекста. | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3240 | `petrol` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_012/stage_10.json` |
| 3241 | `phase` | review_required | нет | 4 | 4 | 0 | phase: independently checked 5 meanings; 4 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3242 | `phenomenon` | review_required | нет | 2 | 2 | 0 | phenomenon: independently checked 3 meanings; 2 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3243 | `philosopher` | review_required | нет | 1 | 1 | 0 | philosopher: independently checked 2 meanings; 1 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3244 | `philosophical` | review_required | нет | 1 | 1 | 0 | philosophical: independently checked 1 meanings; 1 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3245 | `philosophy` | review_required | нет | 2 | 2 | 0 | philosophy: independently checked 2 meanings; 2 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3246 | `phone` | review_required | нет | 2 | 2 | 0 | phone: independently checked 2 meanings; 2 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3247 | `photo` | review_required | нет | 1 | 1 | 0 | photo: independently checked 1 meanings; 1 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3248 | `photograph` | review_required | нет | 2 | 2 | 0 | photograph: independently checked 3 meanings; 2 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3249 | `photographer` | review_required | нет | 1 | 1 | 0 | photographer: independently checked 1 meanings; 1 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3250 | `photography` | review_required | нет | 1 | 1 | 0 | photography: independently checked 1 meanings; 1 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3251 | `phrase` | review_required | нет | 4 | 2 | 2 | phrase: independently checked 6 meanings; 2 generated candidates and 2 no-candidate cases require semantic review before any dataset change.; проверить 2 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3252 | `physical` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3253 | `physician` | review_required | нет | 2 | 1 | 1 | physician: independently checked 2 meanings; 1 generated candidates and 1 no-candidate cases require semantic review before any dataset change.; проверить 1 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3254 | `physics` | review_required | нет | 1 | 1 | 0 | physics: independently checked 1 meanings; 1 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3255 | `piano` | review_required | нет | 2 | 2 | 0 | piano: independently checked 2 meanings; 2 generated candidates and 0 no-candidate cases require semantic review before any dataset change. | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3256 | `pick` | review_required | нет | 12 | 0 | 12 | pick: independently checked 19 meanings; 0 generated candidates and 12 no-candidate cases require semantic review before any dataset change.; проверить 12 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3257 | `picture` | review_required | нет | 8 | 0 | 8 | picture: independently checked 11 meanings; 0 generated candidates and 8 no-candidate cases require semantic review before any dataset change.; проверить 8 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3258 | `piece` | review_required | нет | 7 | 0 | 7 | piece: independently checked 16 meanings; 0 generated candidates and 7 no-candidate cases require semantic review before any dataset change.; проверить 7 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3259 | `pig` | review_required | нет | 10 | 0 | 10 | pig: independently checked 11 meanings; 0 generated candidates and 10 no-candidate cases require semantic review before any dataset change.; проверить 10 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3260 | `pile` | review_required | нет | 9 | 0 | 9 | pile: independently checked 14 meanings; 0 generated candidates and 9 no-candidate cases require semantic review before any dataset change.; проверить 9 значений без примера | `dictionary_audit_cycles/live_strict_5000/batch_013/stage_10.json` |
| 3261 | `pill` | принято без изменения | нет | 9 | 9 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3262 | `pilot` | принято без изменения | нет | 7 | 7 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3263 | `pin` | review_required | нет | 12 | 12 | 0 | В 12 generated_example слова pin десять примеров согласованы, но пример значения 9 («The mechanic used a punch to make a pinhole») употребляет punch и pinhole, а не pin как пробойник; требуется исправление или подтверждение POS/смысла перед принятием. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3264 | `pink` | review_required | нет | 8 | 8 | 0 | В 8 generated_example слова pink пример значения 2 («A pink carnation bloomed…») использует pink как прилагательное, тогда как перевод требует существительное «гвоздика»; пример значения 9 также описывает декоративную прорезку, а не прямое прокалывание, поэтому нужна редакторская проверка. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3265 | `pioneer` | принято без изменения | нет | 6 | 6 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3266 | `pipe` | review_required | нет | 19 | 19 | 0 | Проверены 19 generated_example слова pipe. Нужна проверка значения 5 (неестественное breathing pipes), 8 (pipe как бочка в искусственном контексте), 9 (smoking damaged his pipe смешивает трубку и голос) и 14 (piped concert не обязательно «по радио»); остальные примеры соответствуют своим POS и переводам. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3267 | `pipeline` | принято без изменения | нет | 2 | 2 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3268 | `pirate` | принято без изменения | нет | 5 | 5 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3269 | `pit` | review_required | нет | 12 | 12 | 0 | В 12 generated_example слова pit большинство значений подтверждено, но «The puppy slept in a warm pit» неестественно смешивает койку с ямой, а «They pitted the potatoes…» требует подтверждения редкого значения складывания в яму; нужна проверка. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3270 | `pitch` | review_required | нет | 20 | 20 | 0 | В 20 generated_example слова pitch пример значения 8 описывает sales pitch/презентацию, тогда как перевод дан как «партия товара»; это прямое расхождение sense/translation. Остальные примеры проверены по POS и контексту. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3271 | `pity` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3272 | `place` | review_required | нет | 9 | 9 | 0 | В 9 generated_example слова place пример значения 4 («the town’s main place») неестественен как английское название площади и требует замены на естественный контекст; остальные восемь примеров соответствуют указанным глагольным и noun senses. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3273 | `placement` | принято без изменения | нет | 1 | 1 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3274 | `plain` | принято без изменения | нет | 9 | 9 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3275 | `plan` | принято без изменения | нет | 7 | 7 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3276 | `plane` | review_required | нет | 15 | 15 | 0 | Проверены 15 generated_example слова plane. Пример значения 15 («planed off the rough edge») описывает строгание, а не «выколачивать форму»; пример значения 16 («planed the site») двусмысленен между выравниванием и мензульной съёмкой; требуется редакторское исправление. Остальные примеры согласованы. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3277 | `planet` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3278 | `planning` | принято без изменения | нет | 0 | 0 | 0 | дополнительный анализ не назначен | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3279 | `plant` | review_required | нет | 15 | 15 | 0 | В 15 generated_example слова plant выявлены три несоответствия: #2 описывает отдельное wheat plant вместо урожая, #3 использует planted gun (причастие), а не noun «подброшенная улика», #4 содержит неестественное plant pose для «поза, позиция». Остальные примеры требуют принятия только после исправления этих случаев. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3280 | `plastic` | review_required | нет | 4 | 4 | 0 | В 4 generated_example слова plastic пример значения 9 («The material’s plastic…») неестественен для noun «пластичность» и требует проверки; остальные значения plastic переданы с согласованными POS и переводами. | `dictionary_audit_cycles/live_strict_5000/batch_014/stage_10.json` |
| 3281 | `plate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3282 | `platform` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3283 | `play` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3284 | `player` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3285 | `plea` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3286 | `plead` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3287 | `pleasant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3288 | `please` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3289 | `pleased` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3290 | `pleasure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3291 | `pledge` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3292 | `plenty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3293 | `plot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3294 | `plug` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3295 | `plunge` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3296 | `plus` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3297 | `pocket` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3298 | `poem` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3299 | `poet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3300 | `poetry` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3301 | `point` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3302 | `pointed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3303 | `poison` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3304 | `poisonous` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3305 | `pole` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3306 | `police` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3307 | `policeman` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3308 | `policy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3309 | `polite` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3310 | `political` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3311 | `politician` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3312 | `politics` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3313 | `poll` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3314 | `pollution` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3315 | `pond` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3316 | `pool` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3317 | `poor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3318 | `pop` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3319 | `popular` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3320 | `popularity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3321 | `population` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3322 | `port` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3323 | `portfolio` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3324 | `portion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3325 | `portrait` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3326 | `portray` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3327 | `pose` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3328 | `position` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3329 | `positive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3330 | `possess` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3331 | `possession` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3332 | `possibility` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3333 | `possible` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3334 | `possibly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3335 | `post` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3336 | `post-war` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3337 | `poster` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3338 | `postpone` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3339 | `pot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3340 | `potato` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3341 | `potential` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3342 | `potentially` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3343 | `pound` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3344 | `pour` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3345 | `poverty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3346 | `powder` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3347 | `power` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3348 | `powerful` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3349 | `practical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3350 | `practice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3351 | `practise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3352 | `practitioner` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3353 | `praise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3354 | `pray` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3355 | `prayer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3356 | `preach` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3357 | `precede` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3358 | `precedent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3359 | `precious` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3360 | `precise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3361 | `precisely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3362 | `precision` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3363 | `predator` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3364 | `predecessor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3365 | `predict` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3366 | `predictable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3367 | `prediction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3368 | `predominantly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3369 | `prefer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3370 | `preference` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3371 | `pregnancy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3372 | `pregnant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3373 | `prejudice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3374 | `preliminary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3375 | `premier` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3376 | `premise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3377 | `premium` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3378 | `preparation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3379 | `prepare` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3380 | `prepared` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3381 | `prescribe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3382 | `prescription` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3383 | `presence` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3384 | `present` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3385 | `presentation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3386 | `presently` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3387 | `preservation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3388 | `preserve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3389 | `preside` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3390 | `presidency` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3391 | `president` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3392 | `presidential` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3393 | `press` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3394 | `pressure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3395 | `prestigious` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3396 | `presumably` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3397 | `presume` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3398 | `pretend` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3399 | `pretty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3400 | `prevail` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3401 | `prevalence` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3402 | `prevent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3403 | `prevention` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3404 | `previous` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3405 | `previously` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3406 | `prey` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3407 | `price` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3408 | `pride` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3409 | `priest` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3410 | `primarily` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3411 | `primary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3412 | `prime` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3413 | `prince` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3414 | `princess` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3415 | `principal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3416 | `principle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3417 | `print` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3418 | `printer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3419 | `printing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3420 | `prior` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3421 | `priority` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3422 | `prison` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3423 | `prisoner` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3424 | `privacy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3425 | `private` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3426 | `privatization` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3427 | `privilege` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3428 | `prize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3429 | `probability` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3430 | `probable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3431 | `probably` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3432 | `probe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3433 | `problem` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3434 | `problematic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3435 | `procedure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3436 | `proceed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3437 | `proceeding` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3438 | `proceeds` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3439 | `process` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3440 | `processing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3441 | `processor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3442 | `proclaim` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3443 | `produce` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3444 | `producer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3445 | `product` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3446 | `production` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3447 | `productive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3448 | `productivity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3449 | `profession` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3450 | `professional` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3451 | `professor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3452 | `profile` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3453 | `profit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3454 | `profitable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3455 | `profound` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3456 | `program` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3457 | `programme` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3458 | `programming` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3459 | `progress` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3460 | `progressive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3461 | `prohibit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3462 | `project` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3463 | `projection` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3464 | `prominent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3465 | `promise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3466 | `promising` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3467 | `promote` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3468 | `promotion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3469 | `prompt` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3470 | `pronounce` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3471 | `pronounced` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3472 | `proof` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3473 | `propaganda` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3474 | `proper` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3475 | `properly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3476 | `property` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3477 | `proportion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3478 | `proposal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3479 | `propose` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3480 | `proposition` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3481 | `prosecute` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3482 | `prosecution` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3483 | `prosecutor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3484 | `prospect` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3485 | `prospective` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3486 | `prosperity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3487 | `protect` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3488 | `protection` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3489 | `protective` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3490 | `protein` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3491 | `protest` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3492 | `protester` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3493 | `protocol` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3494 | `proud` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3495 | `prove` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3496 | `provide` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3497 | `province` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3498 | `provincial` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3499 | `provision` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3500 | `provoke` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3501 | `psychiatric` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3502 | `psychological` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3503 | `psychologist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3504 | `psychology` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3505 | `pub` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3506 | `public` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3507 | `publication` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3508 | `publicity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3509 | `publish` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3510 | `publishing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3511 | `pull` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3512 | `pulse` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3513 | `pump` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3514 | `punch` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3515 | `punish` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3516 | `punishment` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3517 | `punk` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3518 | `pupil` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3519 | `purchase` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3520 | `pure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3521 | `purely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3522 | `purple` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3523 | `purpose` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3524 | `pursue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3525 | `pursuit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3526 | `push` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3527 | `put` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3528 | `puzzle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3529 | `qualification` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3530 | `qualified` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3531 | `qualify` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3532 | `quality` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3533 | `quantity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3534 | `quarter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3535 | `queen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3536 | `query` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3537 | `quest` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3538 | `question` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3539 | `questionnaire` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3540 | `queue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3541 | `quick` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3542 | `quickly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3543 | `quiet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3544 | `quietly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3545 | `quit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3546 | `quite` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3547 | `quota` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3548 | `quotation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3549 | `quote` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3550 | `race` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3551 | `racial` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3552 | `racing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3553 | `racism` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3554 | `racist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3555 | `radar` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3556 | `radiation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3557 | `radical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3558 | `radio` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3559 | `rage` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3560 | `raid` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3561 | `rail` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3562 | `railway` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3563 | `rain` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3564 | `raise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3565 | `rally` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3566 | `random` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3567 | `range` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3568 | `rank` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3569 | `ranking` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3570 | `rape` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3571 | `rapid` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3572 | `rapidly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3573 | `rare` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3574 | `rarely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3575 | `rat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3576 | `rate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3577 | `rather` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3578 | `rating` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3579 | `ratio` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3580 | `rational` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3581 | `raw` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3582 | `ray` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3583 | `reach` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3584 | `react` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3585 | `reaction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3586 | `read` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3587 | `reader` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3588 | `readily` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3589 | `reading` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3590 | `ready` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3591 | `real` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3592 | `realistic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3593 | `reality` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3594 | `realization` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3595 | `realize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3596 | `really` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3597 | `realm` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3598 | `rear` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3599 | `reason` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3600 | `reasonable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3601 | `reasonably` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3602 | `reasoning` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3603 | `reassure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3604 | `rebel` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3605 | `rebellion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3606 | `rebuild` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3607 | `recall` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3608 | `receipt` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3609 | `receive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3610 | `receiver` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3611 | `recent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3612 | `recently` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3613 | `reception` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3614 | `recession` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3615 | `recipe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3616 | `recipient` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3617 | `reckon` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3618 | `recognition` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3619 | `recognize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3620 | `recommend` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3621 | `recommendation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3622 | `reconstruction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3623 | `record` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3624 | `recording` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3625 | `recount` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3626 | `recover` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3627 | `recovery` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3628 | `recruit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3629 | `recruitment` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3630 | `recycle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3631 | `red` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3632 | `reduce` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3633 | `reduction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3634 | `refer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3635 | `referee` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3636 | `reference` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3637 | `referendum` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3638 | `reflect` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3639 | `reflection` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3640 | `reform` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3641 | `refuge` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3642 | `refugee` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3643 | `refusal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3644 | `refuse` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3645 | `regain` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3646 | `regard` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3647 | `regardless` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3648 | `regime` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3649 | `region` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3650 | `regional` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3651 | `register` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3652 | `registration` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3653 | `regret` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3654 | `regular` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3655 | `regularly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3656 | `regulate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3657 | `regulation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3658 | `regulator` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3659 | `regulatory` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3660 | `rehabilitation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3661 | `reign` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3662 | `reinforce` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3663 | `reject` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3664 | `rejection` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3665 | `relate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3666 | `related` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3667 | `relation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3668 | `relationship` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3669 | `relative` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3670 | `relatively` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3671 | `relax` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3672 | `relaxed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3673 | `relaxing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3674 | `release` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3675 | `relevance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3676 | `relevant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3677 | `reliability` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3678 | `reliable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3679 | `relief` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3680 | `relieve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3681 | `relieved` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3682 | `religion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3683 | `religious` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3684 | `reluctant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3685 | `rely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3686 | `remain` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3687 | `remainder` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3688 | `remains` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3689 | `remark` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3690 | `remarkable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3691 | `remarkably` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3692 | `remedy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3693 | `remember` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3694 | `remind` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3695 | `reminder` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3696 | `remote` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3697 | `removal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3698 | `remove` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3699 | `render` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3700 | `renew` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3701 | `renowned` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3702 | `rent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3703 | `rental` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3704 | `repair` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3705 | `repeat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3706 | `repeated` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3707 | `replace` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3708 | `replacement` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3709 | `reply` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3710 | `report` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3711 | `reportedly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3712 | `reporter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3713 | `reporting` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3714 | `represent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3715 | `representation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3716 | `representative` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3717 | `reproduce` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3718 | `reproduction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3719 | `republic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3720 | `reputation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3721 | `request` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3722 | `require` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3723 | `requirement` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3724 | `rescue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3725 | `research` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3726 | `researcher` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3727 | `resemble` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3728 | `reservation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3729 | `reserve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3730 | `reside` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3731 | `residence` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3732 | `resident` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3733 | `residential` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3734 | `residue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3735 | `resign` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3736 | `resignation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3737 | `resist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3738 | `resistance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3739 | `resolution` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3740 | `resolve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3741 | `resort` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3742 | `resource` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3743 | `respect` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3744 | `respective` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3745 | `respectively` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3746 | `respond` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3747 | `response` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3748 | `responsibility` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3749 | `responsible` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3750 | `rest` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3751 | `restaurant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3752 | `restoration` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3753 | `restore` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3754 | `restraint` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3755 | `restrict` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3756 | `restriction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3757 | `result` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3758 | `resume` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3759 | `retail` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3760 | `retain` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3761 | `retire` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3762 | `retired` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3763 | `retirement` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3764 | `retreat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3765 | `retrieve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3766 | `return` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3767 | `reveal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3768 | `revelation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3769 | `revenge` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3770 | `revenue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3771 | `reverse` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3772 | `review` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3773 | `revise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3774 | `revision` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3775 | `revival` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3776 | `revive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3777 | `revolution` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3778 | `revolutionary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3779 | `reward` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3780 | `rhetoric` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3781 | `rhythm` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3782 | `rice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3783 | `rich` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3784 | `rid` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3785 | `ride` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3786 | `ridiculous` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3787 | `rifle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3788 | `right` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3789 | `ring` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3790 | `riot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3791 | `rip` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3792 | `rise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3793 | `risk` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3794 | `risky` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3795 | `ritual` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3796 | `rival` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3797 | `river` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3798 | `road` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3799 | `rob` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3800 | `robbery` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3801 | `robot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3802 | `robust` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3803 | `rock` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3804 | `rocket` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3805 | `rod` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3806 | `role` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3807 | `roll` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3808 | `romance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3809 | `romantic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3810 | `roof` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3811 | `room` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3812 | `root` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3813 | `rope` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3814 | `rose` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3815 | `rotate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3816 | `rotation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3817 | `rough` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3818 | `roughly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3819 | `round` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3820 | `route` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3821 | `routine` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3822 | `row1` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3823 | `row2` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3824 | `row3` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3825 | `royal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3826 | `rub` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3827 | `rubber` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3828 | `rubbish` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3829 | `rude` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3830 | `rugby` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3831 | `ruin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3832 | `rule` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3833 | `ruling` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3834 | `rumour` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3835 | `run` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3836 | `runner` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3837 | `running` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3838 | `rural` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3839 | `rush` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3840 | `sack` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3841 | `sacred` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3842 | `sacrifice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3843 | `sad` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3844 | `sadly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3845 | `safe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3846 | `safety` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3847 | `sail` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3848 | `sailing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3849 | `sailor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3850 | `saint` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3851 | `sake` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3852 | `salad` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3853 | `salary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3854 | `sale` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3855 | `salt` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3856 | `same` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3857 | `sample` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3858 | `sanction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3859 | `sand` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3860 | `sandwich` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3861 | `satellite` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3862 | `satisfaction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3863 | `satisfied` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3864 | `satisfy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3865 | `Saturday` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3866 | `sauce` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3867 | `save` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3868 | `saving` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3869 | `say` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3870 | `scale` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3871 | `scan` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3872 | `scandal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3873 | `scare` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3874 | `scared` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3875 | `scary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3876 | `scattered` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3877 | `scenario` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3878 | `scene` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3879 | `sceptical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3880 | `schedule` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3881 | `scheme` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3882 | `scholar` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3883 | `scholarship` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3884 | `school` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3885 | `science` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3886 | `scientific` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3887 | `scientist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3888 | `scope` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3889 | `score` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3890 | `scratch` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3891 | `scream` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3892 | `screen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3893 | `screening` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3894 | `screw` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3895 | `script` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3896 | `scrutiny` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3897 | `sculpture` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3898 | `sea` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3899 | `seal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3900 | `search` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3901 | `season` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3902 | `seat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3903 | `second` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3904 | `secondary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3905 | `secondly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3906 | `secret` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3907 | `secretary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3908 | `section` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3909 | `sector` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3910 | `secular` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3911 | `secure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3912 | `security` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3913 | `see` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3914 | `seed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3915 | `seek` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3916 | `seeker` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3917 | `seem` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3918 | `seemingly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3919 | `segment` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3920 | `seize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3921 | `seldom` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3922 | `select` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3923 | `selection` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3924 | `selective` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3925 | `self` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3926 | `sell` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3927 | `seminar` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3928 | `senator` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3929 | `send` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3930 | `senior` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3931 | `sensation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3932 | `sense` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3933 | `sensible` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3934 | `sensitive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3935 | `sensitivity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3936 | `sentence` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3937 | `sentiment` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3938 | `separate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3939 | `separation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3940 | `September` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3941 | `sequence` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3942 | `serial` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3943 | `series` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3944 | `serious` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3945 | `seriously` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3946 | `servant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3947 | `serve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3948 | `service` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3949 | `session` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3950 | `set` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3951 | `set-up` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3952 | `setting` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3953 | `settle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3954 | `settlement` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3955 | `settler` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3956 | `seven` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3957 | `seventeen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3958 | `seventy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3959 | `several` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3960 | `severe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3961 | `severely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3962 | `sex` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3963 | `sexual` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3964 | `sexuality` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3965 | `sexy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3966 | `shade` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3967 | `shadow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3968 | `shake` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3969 | `shall` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3970 | `shallow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3971 | `shame` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3972 | `shape` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3973 | `shaped` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3974 | `share` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3975 | `shareholder` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3976 | `sharp` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3977 | `shatter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3978 | `she` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3979 | `shed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3980 | `sheep` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3981 | `sheer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3982 | `sheet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3983 | `shelf` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3984 | `shell` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3985 | `shelter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3986 | `shift` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3987 | `shine` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3988 | `shiny` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3989 | `ship` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3990 | `shipping` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3991 | `shirt` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3992 | `shock` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3993 | `shocked` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3994 | `shocking` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3995 | `shoe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3996 | `shoot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3997 | `shooting` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3998 | `shop` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 3999 | `shopping` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4000 | `shore` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4001 | `short` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4002 | `short-term` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4003 | `shortage` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4004 | `shortly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4005 | `shot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4006 | `should` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4007 | `shoulder` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4008 | `shout` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4009 | `show` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4010 | `shower` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4011 | `shrink` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4012 | `shrug` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4013 | `shut` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4014 | `shy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4015 | `sibling` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4016 | `sick` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4017 | `side` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4018 | `sigh` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4019 | `sight` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4020 | `sign` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4021 | `signal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4022 | `signature` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4023 | `significance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4024 | `significant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4025 | `significantly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4026 | `silence` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4027 | `silent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4028 | `silk` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4029 | `silly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4030 | `silver` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4031 | `similar` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4032 | `similarity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4033 | `similarly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4034 | `simple` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4035 | `simply` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4036 | `simulate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4037 | `simulation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4038 | `simultaneously` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4039 | `sin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4040 | `since` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4041 | `sincere` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4042 | `sing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4043 | `singer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4044 | `singing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4045 | `single` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4046 | `sink` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4047 | `sir` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4048 | `sister` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4049 | `sit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4050 | `site` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4051 | `situated` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4052 | `situation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4053 | `six` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4054 | `sixteen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4055 | `sixty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4056 | `size` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4057 | `sketch` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4058 | `ski` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4059 | `skiing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4060 | `skill` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4061 | `skilled` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4062 | `skin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4063 | `skip` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4064 | `skirt` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4065 | `skull` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4066 | `sky` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4067 | `slam` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4068 | `slap` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4069 | `slash` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4070 | `slave` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4071 | `slavery` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4072 | `sleep` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4073 | `slice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4074 | `slide` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4075 | `slight` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4076 | `slightly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4077 | `slip` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4078 | `slogan` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4079 | `slope` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4080 | `slot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4081 | `slow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4082 | `slowly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4083 | `small` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4084 | `smart` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4085 | `smartphone` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4086 | `smash` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4087 | `smell` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4088 | `smile` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4089 | `smoke` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4090 | `smoking` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4091 | `smooth` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4092 | `snake` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4093 | `snap` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4094 | `snow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4095 | `so` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4096 | `so-called` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4097 | `soak` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4098 | `soap` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4099 | `soar` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4100 | `soccer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4101 | `social` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4102 | `socialist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4103 | `society` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4104 | `sock` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4105 | `soft` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4106 | `software` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4107 | `soil` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4108 | `solar` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4109 | `soldier` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4110 | `sole` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4111 | `solely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4112 | `solicitor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4113 | `solid` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4114 | `solidarity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4115 | `solo` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4116 | `solution` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4117 | `solve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4118 | `some` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4119 | `somebody` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4120 | `somehow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4121 | `someone` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4122 | `something` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4123 | `sometime` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4124 | `sometimes` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4125 | `somewhat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4126 | `somewhere` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4127 | `son` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4128 | `song` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4129 | `soon` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4130 | `sophisticated` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4131 | `sorry` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4132 | `sort` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4133 | `soul` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4134 | `sound1` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4135 | `sound2` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4136 | `sound3` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4137 | `sound4` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4138 | `soup` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4139 | `source` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4140 | `south` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4141 | `southern` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4142 | `sovereignty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4143 | `space` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4144 | `spam` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4145 | `span` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4146 | `spare` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4147 | `spark` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4148 | `speak` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4149 | `speaker` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4150 | `special` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4151 | `specialist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4152 | `specialize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4153 | `specialized` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4154 | `species` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4155 | `specific` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4156 | `specifically` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4157 | `specification` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4158 | `specify` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4159 | `specimen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4160 | `spectacle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4161 | `spectacular` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4162 | `spectator` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4163 | `spectrum` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4164 | `speculate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4165 | `speculation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4166 | `speech` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4167 | `speed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4168 | `spell` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4169 | `spelling` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4170 | `spend` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4171 | `spending` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4172 | `sphere` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4173 | `spice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4174 | `spicy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4175 | `spider` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4176 | `spill` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4177 | `spin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4178 | `spine` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4179 | `spirit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4180 | `spiritual` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4181 | `spite` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4182 | `split` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4183 | `spoil` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4184 | `spoken` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4185 | `spokesman` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4186 | `spokesperson` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4187 | `spokeswoman` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4188 | `sponsor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4189 | `sponsorship` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4190 | `spoon` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4191 | `sport` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4192 | `sporting` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4193 | `spot` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4194 | `spotlight` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4195 | `spouse` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4196 | `spread` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4197 | `spring` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4198 | `spy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4199 | `squad` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4200 | `square` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4201 | `squeeze` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4202 | `stab` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4203 | `stability` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4204 | `stabilize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4205 | `stable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4206 | `stadium` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4207 | `staff` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4208 | `stage` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4209 | `stair` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4210 | `stake` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4211 | `stall` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4212 | `stamp` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4213 | `stance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4214 | `stand` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4215 | `standard` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4216 | `standing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4217 | `star` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4218 | `stare` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4219 | `stark` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4220 | `start` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4221 | `starve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4222 | `state` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4223 | `statement` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4224 | `station` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4225 | `statistic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4226 | `statistical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4227 | `statue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4228 | `status` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4229 | `stay` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4230 | `steadily` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4231 | `steady` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4232 | `steal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4233 | `steam` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4234 | `steel` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4235 | `steep` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4236 | `steer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4237 | `stem` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4238 | `step` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4239 | `stereotype` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4240 | `stick` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4241 | `sticky` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4242 | `stiff` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4243 | `still` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4244 | `stimulate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4245 | `stimulus` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4246 | `stir` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4247 | `stock` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4248 | `stomach` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4249 | `stone` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4250 | `stop` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4251 | `storage` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4252 | `store` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4253 | `storm` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4254 | `story` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4255 | `straight` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4256 | `straightforward` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4257 | `strain` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4258 | `strand` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4259 | `strange` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4260 | `stranger` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4261 | `strategic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4262 | `strategy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4263 | `stream` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4264 | `street` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4265 | `strength` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4266 | `strengthen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4267 | `stress` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4268 | `stretch` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4269 | `strict` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4270 | `strictly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4271 | `strike` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4272 | `striking` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4273 | `string` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4274 | `strip` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4275 | `strive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4276 | `stroke` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4277 | `strong` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4278 | `strongly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4279 | `structural` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4280 | `structure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4281 | `struggle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4282 | `student` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4283 | `studio` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4284 | `study` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4285 | `stuff` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4286 | `stumble` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4287 | `stun` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4288 | `stunning` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4289 | `stupid` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4290 | `style` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4291 | `subject` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4292 | `submission` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4293 | `submit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4294 | `subscriber` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4295 | `subscription` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4296 | `subsequent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4297 | `subsequently` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4298 | `subsidy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4299 | `substance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4300 | `substantial` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4301 | `substantially` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4302 | `substitute` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4303 | `substitution` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4304 | `subtle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4305 | `suburb` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4306 | `suburban` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4307 | `succeed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4308 | `success` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4309 | `successful` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4310 | `successfully` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4311 | `succession` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4312 | `successive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4313 | `successor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4314 | `such` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4315 | `suck` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4316 | `sudden` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4317 | `suddenly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4318 | `sue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4319 | `suffer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4320 | `suffering` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4321 | `sufficient` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4322 | `sufficiently` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4323 | `sugar` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4324 | `suggest` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4325 | `suggestion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4326 | `suicide` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4327 | `suit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4328 | `suitable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4329 | `suite` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4330 | `sum` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4331 | `summarize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4332 | `summary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4333 | `summer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4334 | `summit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4335 | `sun` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4336 | `Sunday` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4337 | `super` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4338 | `superb` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4339 | `superior` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4340 | `supermarket` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4341 | `supervise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4342 | `supervision` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4343 | `supervisor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4344 | `supplement` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4345 | `supply` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4346 | `support` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4347 | `supporter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4348 | `supportive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4349 | `suppose` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4350 | `supposedly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4351 | `suppress` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4352 | `supreme` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4353 | `sure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4354 | `surely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4355 | `surface` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4356 | `surge` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4357 | `surgeon` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4358 | `surgery` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4359 | `surgical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4360 | `surplus` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4361 | `surprise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4362 | `surprised` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4363 | `surprising` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4364 | `surrender` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4365 | `surround` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4366 | `surrounding` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4367 | `surveillance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4368 | `survey` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4369 | `survival` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4370 | `survive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4371 | `survivor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4372 | `suspect` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4373 | `suspend` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4374 | `suspension` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4375 | `suspicion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4376 | `suspicious` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4377 | `sustain` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4378 | `sustainable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4379 | `swallow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4380 | `swear` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4381 | `sweater` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4382 | `sweep` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4383 | `sweet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4384 | `swim` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4385 | `swimming` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4386 | `swing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4387 | `switch` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4388 | `sword` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4389 | `symbol` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4390 | `symbolic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4391 | `sympathetic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4392 | `sympathy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4393 | `symptom` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4394 | `syndrome` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4395 | `synthesis` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4396 | `system` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4397 | `systematic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4398 | `T-shirt` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4399 | `table` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4400 | `tablet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4401 | `tackle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4402 | `tactic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4403 | `tactical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4404 | `tag` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4405 | `tail` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4406 | `take` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4407 | `tale` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4408 | `talent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4409 | `talented` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4410 | `talk` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4411 | `tall` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4412 | `tank` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4413 | `tap` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4414 | `tape` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4415 | `target` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4416 | `task` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4417 | `taste` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4418 | `tax` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4419 | `taxi` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4420 | `taxpayer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4421 | `tea` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4422 | `teach` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4423 | `teacher` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4424 | `teaching` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4425 | `team` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4426 | `tear1` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4427 | `tear2` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4428 | `technical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4429 | `technique` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4430 | `technological` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4431 | `technology` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4432 | `teenage` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4433 | `teenager` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4434 | `teens` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4435 | `telephone` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4436 | `television` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4437 | `tell` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4438 | `temperature` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4439 | `temple` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4440 | `temporarily` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4441 | `temporary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4442 | `tempt` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4443 | `ten` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4444 | `tenant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4445 | `tend` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4446 | `tendency` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4447 | `tender` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4448 | `tennis` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4449 | `tension` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4450 | `tent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4451 | `tenure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4452 | `term` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4453 | `terminal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4454 | `terminate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4455 | `terms` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4456 | `terrain` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4457 | `terrible` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4458 | `terribly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4459 | `terrific` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4460 | `terrify` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4461 | `territory` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4462 | `terror` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4463 | `terrorism` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4464 | `terrorist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4465 | `test` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4466 | `testify` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4467 | `testimony` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4468 | `testing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4469 | `text` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4470 | `textbook` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4471 | `texture` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4472 | `than` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4473 | `thank` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4474 | `thankfully` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4475 | `thanks` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4476 | `that` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4477 | `the` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4478 | `theatre` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4479 | `theatrical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4480 | `theft` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4481 | `their` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4482 | `theirs` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4483 | `them` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4484 | `theme` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4485 | `themselves` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4486 | `then` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4487 | `theology` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4488 | `theoretical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4489 | `theory` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4490 | `therapist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4491 | `therapy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4492 | `there` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4493 | `thereafter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4494 | `thereby` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4495 | `therefore` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4496 | `thesis` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4497 | `they` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4498 | `thick` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4499 | `thief` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4500 | `thin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4501 | `thing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4502 | `think` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4503 | `thinking` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4504 | `third` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4505 | `thirsty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4506 | `thirteen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4507 | `thirty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4508 | `this` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4509 | `thorough` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4510 | `thoroughly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4511 | `though` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4512 | `thought` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4513 | `thought-provoking` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4514 | `thoughtful` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4515 | `thousand` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4516 | `thread` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4517 | `threat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4518 | `threaten` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4519 | `three` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4520 | `threshold` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4521 | `thrilled` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4522 | `thrive` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4523 | `throat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4524 | `through` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4525 | `throughout` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4526 | `throw` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4527 | `thumb` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4528 | `Thursday` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4529 | `thus` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4530 | `ticket` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4531 | `tide` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4532 | `tidy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4533 | `tie` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4534 | `tight` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4535 | `tighten` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4536 | `till` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4537 | `timber` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4538 | `time` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4539 | `timely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4540 | `timing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4541 | `tin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4542 | `tiny` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4543 | `tip` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4544 | `tired` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4545 | `tissue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4546 | `title` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4547 | `to` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4548 | `tobacco` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4549 | `today` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4550 | `toe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4551 | `together` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4552 | `toilet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4553 | `tolerance` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4554 | `tolerate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4555 | `toll` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4556 | `tomato` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4557 | `tomorrow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4558 | `ton` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4559 | `tone` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4560 | `tongue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4561 | `tonight` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4562 | `tonne` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4563 | `too` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4564 | `tool` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4565 | `tooth` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4566 | `top` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4567 | `topic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4568 | `torture` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4569 | `toss` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4570 | `total` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4571 | `totally` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4572 | `touch` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4573 | `tough` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4574 | `tour` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4575 | `tourism` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4576 | `tourist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4577 | `tournament` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4578 | `towards` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4579 | `towel` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4580 | `tower` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4581 | `town` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4582 | `toxic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4583 | `toy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4584 | `trace` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4585 | `track` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4586 | `trade` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4587 | `trademark` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4588 | `trading` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4589 | `tradition` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4590 | `traditional` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4591 | `traffic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4592 | `tragedy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4593 | `tragic` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4594 | `trail` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4595 | `trailer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4596 | `train` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4597 | `trainer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4598 | `training` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4599 | `trait` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4600 | `transaction` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4601 | `transcript` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4602 | `transfer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4603 | `transform` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4604 | `transformation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4605 | `transit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4606 | `transition` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4607 | `translate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4608 | `translation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4609 | `transmission` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4610 | `transmit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4611 | `transparency` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4612 | `transparent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4613 | `transport` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4614 | `transportation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4615 | `trap` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4616 | `trauma` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4617 | `travel` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4618 | `traveller` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4619 | `treasure` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4620 | `treat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4621 | `treatment` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4622 | `treaty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4623 | `tree` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4624 | `tremendous` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4625 | `trend` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4626 | `trial` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4627 | `tribal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4628 | `tribe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4629 | `tribunal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4630 | `tribute` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4631 | `trick` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4632 | `trigger` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4633 | `trillion` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4634 | `trio` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4635 | `trip` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4636 | `triumph` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4637 | `troop` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4638 | `trophy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4639 | `tropical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4640 | `trouble` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4641 | `troubled` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4642 | `trousers` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4643 | `truck` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4644 | `true` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4645 | `truly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4646 | `trust` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4647 | `trustee` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4648 | `truth` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4649 | `try` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4650 | `tsunami` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4651 | `tube` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4652 | `Tuesday` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4653 | `tuition` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4654 | `tune` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4655 | `tunnel` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4656 | `turn` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4657 | `turnout` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4658 | `turnover` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4659 | `TV` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4660 | `twelve` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4661 | `twenty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4662 | `twice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4663 | `twin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4664 | `twist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4665 | `two` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4666 | `type` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4667 | `typical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4668 | `typically` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4669 | `tyre` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4670 | `ugly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4671 | `ultimate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4672 | `ultimately` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4673 | `umbrella` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4674 | `unable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4675 | `unacceptable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4676 | `uncertainty` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4677 | `uncle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4678 | `uncomfortable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4679 | `unconscious` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4680 | `under` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4681 | `undergo` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4682 | `undergraduate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4683 | `underground` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4684 | `underlying` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4685 | `undermine` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4686 | `understand` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4687 | `understanding` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4688 | `undertake` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4689 | `underwear` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4690 | `undoubtedly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4691 | `unemployed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4692 | `unemployment` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4693 | `unexpected` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4694 | `unfair` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4695 | `unfold` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4696 | `unfortunate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4697 | `unfortunately` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4698 | `unhappy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4699 | `uniform` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4700 | `unify` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4701 | `union` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4702 | `unique` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4703 | `unit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4704 | `unite` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4705 | `united` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4706 | `unity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4707 | `universal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4708 | `universe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4709 | `university` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4710 | `unknown` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4711 | `unless` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4712 | `unlike` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4713 | `unlikely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4714 | `unnecessary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4715 | `unpleasant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4716 | `unprecedented` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4717 | `until` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4718 | `unusual` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4719 | `unveil` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4720 | `up` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4721 | `upcoming` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4722 | `update` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4723 | `upgrade` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4724 | `uphold` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4725 | `upon` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4726 | `upper` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4727 | `upset` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4728 | `upstairs` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4729 | `upwards` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4730 | `urban` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4731 | `urge` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4732 | `urgent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4733 | `us` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4734 | `usage` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4735 | `use` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4736 | `use` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4737 | `used` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4738 | `used to` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4739 | `useful` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4740 | `useless` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4741 | `user` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4742 | `usual` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4743 | `usually` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4744 | `utility` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4745 | `utilize` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4746 | `utterly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4747 | `vacation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4748 | `vacuum` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4749 | `vague` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4750 | `valid` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4751 | `validity` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4752 | `valley` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4753 | `valuable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4754 | `value` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4755 | `van` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4756 | `vanish` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4757 | `variable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4758 | `variation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4759 | `varied` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4760 | `variety` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4761 | `various` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4762 | `vary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4763 | `vast` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4764 | `vegetable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4765 | `vehicle` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4766 | `vein` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4767 | `venture` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4768 | `venue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4769 | `verbal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4770 | `verdict` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4771 | `verify` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4772 | `verse` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4773 | `version` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4774 | `versus` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4775 | `vertical` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4776 | `very` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4777 | `vessel` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4778 | `veteran` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4779 | `via` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4780 | `viable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4781 | `vibrant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4782 | `vice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4783 | `vicious` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4784 | `victim` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4785 | `victory` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4786 | `video` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4787 | `view` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4788 | `viewer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4789 | `viewpoint` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4790 | `village` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4791 | `villager` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4792 | `violate` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4793 | `violation` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4794 | `violence` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4795 | `violent` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4796 | `virtual` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4797 | `virtue` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4798 | `virus` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4799 | `visa` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4800 | `visible` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4801 | `vision` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4802 | `visit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4803 | `visitor` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4804 | `visual` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4805 | `vital` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4806 | `vitamin` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4807 | `vocal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4808 | `voice` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4809 | `volume` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4810 | `voluntary` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4811 | `volunteer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4812 | `vote` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4813 | `voting` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4814 | `vow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4815 | `vulnerability` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4816 | `vulnerable` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4817 | `wage` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4818 | `wait` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4819 | `waiter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4820 | `wake` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4821 | `walk` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4822 | `wall` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4823 | `wander` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4824 | `want` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4825 | `war` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4826 | `ward` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4827 | `warehouse` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4828 | `warfare` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4829 | `warm` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4830 | `warming` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4831 | `warn` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4832 | `warning` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4833 | `warrant` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4834 | `warrior` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4835 | `wash` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4836 | `washing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4837 | `waste` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4838 | `watch` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4839 | `water` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4840 | `wave` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4841 | `way` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4842 | `we` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4843 | `weak` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4844 | `weaken` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4845 | `weakness` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4846 | `wealth` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4847 | `wealthy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4848 | `weapon` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4849 | `wear` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4850 | `weather` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4851 | `weave` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4852 | `web` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4853 | `website` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4854 | `wedding` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4855 | `Wednesday` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4856 | `weed` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4857 | `week` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4858 | `weekend` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4859 | `weekly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4860 | `weigh` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4861 | `weight` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4862 | `weird` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4863 | `welcome` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4864 | `welfare` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4865 | `well1` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4866 | `well2` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4867 | `well-being` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4868 | `west` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4869 | `western` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4870 | `wet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4871 | `what` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4872 | `whatever` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4873 | `whatsoever` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4874 | `wheat` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4875 | `wheel` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4876 | `when` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4877 | `whenever` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4878 | `where` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4879 | `whereas` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4880 | `whereby` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4881 | `wherever` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4882 | `whether` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4883 | `which` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4884 | `while` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4885 | `whilst` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4886 | `whip` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4887 | `whisper` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4888 | `white` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4889 | `who` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4890 | `whoever` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4891 | `whole` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4892 | `wholly` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4893 | `whom` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4894 | `whose` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4895 | `why` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4896 | `wide` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4897 | `widely` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4898 | `widen` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4899 | `widespread` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4900 | `widow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4901 | `width` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4902 | `wife` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4903 | `wild` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4904 | `wildlife` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4905 | `will` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4906 | `willing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4907 | `willingness` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4908 | `win` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4909 | `wind1` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4910 | `wind2` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4911 | `window` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4912 | `wine` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4913 | `wing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4914 | `winner` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4915 | `winter` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4916 | `wipe` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4917 | `wire` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4918 | `wisdom` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4919 | `wise` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4920 | `wish` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4921 | `wit` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4922 | `with` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4923 | `withdraw` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4924 | `withdrawal` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4925 | `within` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4926 | `without` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4927 | `witness` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4928 | `woman` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4929 | `wonder` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4930 | `wonderful` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4931 | `wood` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4932 | `wooden` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4933 | `wool` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4934 | `word` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4935 | `work` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4936 | `worker` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4937 | `workforce` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4938 | `working` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4939 | `workout` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4940 | `workplace` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4941 | `workshop` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4942 | `world` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4943 | `worldwide` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4944 | `worm` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4945 | `worried` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4946 | `worry` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4947 | `worse` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4948 | `worship` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4949 | `worst` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4950 | `worth` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4951 | `worthwhile` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4952 | `worthy` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4953 | `would` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4954 | `wound` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4955 | `wow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4956 | `wrap` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4957 | `wrist` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4958 | `write` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4959 | `writer` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4960 | `writing` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4961 | `written` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4962 | `wrong` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4963 | `yard` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4964 | `yeah` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4965 | `year` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4966 | `yell` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4967 | `yellow` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4968 | `yes` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4969 | `yesterday` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4970 | `yet` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4971 | `yield` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4972 | `you` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4973 | `young` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4974 | `youngster` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4975 | `your` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4976 | `yours` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4977 | `yourself` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4978 | `youth` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4979 | `zero` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
| 4980 | `zone` | не обработано новым пятиагентным циклом | нет | — | — | — | нужен полный цикл 06–10 | `—` |
