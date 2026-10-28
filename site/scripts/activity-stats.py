"""Distribución de tipos de actividad por track y repeticiones seguidas (aprendizajes 26 y 27 de CLAUDE.md).

Uso, desde la raíz del repo o desde site/:
    python3 site/scripts/activity-stats.py            # resumen de todos los tracks
    python3 site/scripts/activity-stats.py --lessons  # además, la secuencia de cada lección

Sale con código 1 si alguna lección tiene dos actividades seguidas de la misma familia.
"""
import glob
import os
import re
import sys
from collections import Counter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', '01-foundations')
COMPONENTS = (
    'FindInCode|Classify|SpotToken|Quiz|Order|Compare|FillBlank|TypeAnswer|'
    'Match|CommandBuilder|MultiSelect|DecisionPath|Terminal'
)
# Mecánicas que para el lector son "la misma actividad" (encontrar/clasificar el problema).
FAMILY = {'FindInCode': 'buscar-error', 'Classify': 'buscar-error', 'SpotToken': 'buscar-error'}
# El laboratorio es una demo de componentes, no una lección del temario.
SKIP = ('laboratorio',)


def lesson_sequence(path: str) -> list[str]:
    text = open(path, encoding='utf-8').read()
    components = {}
    for m in re.finditer(r'^export function (\w+)\(\)[\s\S]*?^\}\n', text, re.M):
        c = re.search(r'<(' + COMPONENTS + r')\b', m.group(0))
        components[m.group(1)] = c.group(1) if c else '?'
    if '## Práctica' not in text:
        return []
    practice = text[text.index('## Práctica'):]
    return [components.get(t, '?') for t in re.findall(r'^<(\w+Activity) />', practice, re.M)]


def main() -> int:
    show_lessons = '--lessons' in sys.argv
    repeated = 0
    for track in sorted(os.listdir(ROOT)):
        files = sorted(f for f in glob.glob(os.path.join(ROOT, track, '*.mdx')) if not any(s in f for s in SKIP))
        if not files:
            continue
        counts: Counter[str] = Counter()
        lines = []
        for f in files:
            seq = lesson_sequence(f)
            counts.update(seq)
            fam = [FAMILY.get(c, c) for c in seq]
            adjacent = any(fam[i] == fam[i - 1] for i in range(1, len(fam)))
            repeated += adjacent
            if show_lessons or adjacent:
                mark = '!!' if adjacent else '  '
                lines.append(f'  {mark} {os.path.basename(f):44} {" → ".join(seq)}')
        total = sum(counts.values())
        print(f'== {track}: {total} actividades en {len(files)} lecciones')
        for name, n in counts.most_common():
            print(f'   {name:15} {n:3}  {100 * n / total:5.1f}%')
        print('\n'.join(lines))
    print(f'\nLecciones con dos actividades seguidas de la misma familia: {repeated}')
    return 1 if repeated else 0


if __name__ == '__main__':
    sys.exit(main())
