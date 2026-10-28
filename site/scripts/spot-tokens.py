"""Muestra, para cada ronda de SpotToken, la palabra a la que apunta targetIndex.
Uso: python3 site/scripts/spot-tokens.py [archivo.ts]   (sin argumento: todas las lecciones)"""
import glob, os, re, sys
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'content', 'lessons')
files = sys.argv[1:] or sorted(glob.glob(os.path.join(base, '*.ts')))
pat = re.compile(r"""line:\s*(['"])((?:\\.|(?!\1).)*)\1,\s*targetIndex:\s*(\d+)""")
for f in files:
    for m in pat.finditer(open(f).read()):
        line = m.group(2).replace("\\'", "'").replace('\\"', '"')
        toks = line.split()
        i = int(m.group(3))
        tok = toks[i] if i < len(toks) else '<<FUERA DE RANGO>>'
        print(f'{os.path.basename(f)}: [{i}] {tok:<28} | {line[:70]}')
