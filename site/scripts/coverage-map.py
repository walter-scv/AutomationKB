"""Mapa de cobertura: por lección, los ### de la teoría y las actividades (tipo, título, objetivo).
Uso: python3 site/scripts/coverage-map.py [filtro]"""
import sys
import re,glob,os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
for track in ['testing','programming','git']:
    for f in sorted(glob.glob(f'docs/01-foundations/{track}/*.mdx')):
        s=open(f).read()
        if '36-laboratorio' in f: continue
        if len(sys.argv)>1 and sys.argv[1] not in f: continue
        heads=re.findall(r'^### (.+)$',s,re.M)
        acts=[]
        for m in re.finditer(r'export function (\w+)\(\)[\s\S]*?title="([^"]+)"[\s\S]*?goal="([^"]+)"[\s\S]*?<(FindInCode|Classify|Quiz|Order|Compare|FillBlank|TypeAnswer|Match|CommandBuilder|MultiSelect|DecisionPath|SpotToken|Terminal)\b',s):
            acts.append((m.group(1),m.group(4),m.group(2),m.group(3)))
        order=re.findall(r'^<(\w+Activity) />$',s,re.M)
        byfn={a[0]:a for a in acts}
        print(f'\n## {os.path.basename(f)}')
        print('  TEORÍA: '+' | '.join(heads))
        for fn in order:
            a=byfn.get(fn)
            if a: print(f'  - [{a[1]}] {a[2]} :: {a[3][:150]}')
