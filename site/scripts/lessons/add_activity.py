"""Agrega actividades a una lección existente.
spec = {'lesson': 'testing/01-que-es-testing', 'ts': 'path.ts' (bloque que se agrega al final del .ts de la lección),
        'ts_types': ['ClassifyItem:Classify'],
        'activities': [ {mismo formato que newlesson, + 'after': 'FnName' opcional (si no, al final)} ]}
"""
import importlib.util, os, re, sys
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
NO_AD={'Quiz','Order'}
def fn_code(a):
    aid=a['id']
    props='\n'.join(f'        {k}={{{v}}}' for k,v in a['props'].items())
    lit='\n'.join(f'        {k}="{v}"' for k,v in a.get('literal',{}).items())
    extra='' if a['component'] in NO_AD else f"\n        alreadyDone={{isDone('{aid}')}}"
    body=f"      <{a['component']}\n{props}"+(f'\n{lit}' if lit else '')+extra+f"\n        onSolved={{() => markDone('{aid}')}}\n      />"
    code=f"      <CodeBlock language=\"{a.get('code_lang','ts')}\">{{{a['code']}}}</CodeBlock>\n" if a.get('code') else ''
    for k in ('title','kind','goal','consigna'):
        assert '"' not in a[k], (k,a[k])
    return '\n'.join([f"export function {a['fn']}() {{",
      f"  const {{isDone, markDone}} = useLessonProgress(LESSON_SLUG, ['{aid}']);",'  return (','    <Activity',
      f'      title="{a["title"]}"',f'      kind="{a["kind"]}"',f'      goal="{a["goal"]}"',f"      done={{isDone('{aid}')}}",
      f'      consigna="{a["consigna"]}"','    >',code+body,'    </Activity>','  );','}',''])
def main(p):
    sp=importlib.util.spec_from_file_location('s',p); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m); spec=m.spec
    mdx_p=f"{SITE}/docs/01-foundations/{spec['lesson']}.mdx"; ts_p=f"{SITE}/src/content/lessons/{os.path.basename(spec['lesson'])}.ts"
    ts=open(ts_p).read().rstrip('\n')+'\n\n'+open(spec['ts']).read().strip('\n')+'\n'
    for t in spec.get('ts_types',[]):
        n,c=t.split(':'); line=f"import type {{{n}}} from '@site/src/components/{c}';"
        if not re.search(r"import type \{[^}]*\b"+n+r"\b[^}]*\} from '@site/src/components/"+c+"'",ts):
            ts=line+'\n'+ts
    open(ts_p,'w').write(ts)
    mdx=open(mdx_p).read()
    names=[]
    for a in spec['activities']:
        for v in list(a['props'].values())+([a['code']] if a.get('code') else []):
            if re.fullmatch(r'[A-Z_][A-Z0-9_]*',v) and v not in names: names.append(v)
    mm=re.search(r"import \{([^}]*)\} from '(@site/src/content/lessons/[^']+)';",mdx)
    cur=[n.strip() for n in mm.group(1).replace('\n',',').split(',') if n.strip()]
    for n in names:
        if n not in cur: cur.append(n)
    mdx=mdx[:mm.start()]+'import {\n'+''.join(f'  {n},\n' for n in cur)+f"}} from '{mm.group(2)}';"+mdx[mm.end():]
    for a in spec['activities']:
        c=a['component']; imp=f"import {c} from '@site/src/components/{c}';\n"
        if imp not in mdx: mdx=mdx.replace("import Activity from '@site/src/components/Activity';\n","import Activity from '@site/src/components/Activity';\n"+imp,1)
        if a.get('code') and "import CodeBlock from '@theme/CodeBlock';" not in mdx:
            mdx=mdx.replace("import {useLessonProgress}","import CodeBlock from '@theme/CodeBlock';\nimport {useLessonProgress}",1)
        # function before ## Conceptos (or first ## heading after functions)
        k=mdx.index('\n## Conceptos') if '\n## Conceptos' in mdx else [x.start() for x in re.finditer(r'^export function ',mdx,re.M)][-1]
        if '\n## Conceptos' not in mdx:
            j=mdx.index('\n}\n',k)+3; mdx=mdx[:j]+'\n'+fn_code(a)+mdx[j:]
        else:
            last=[x.start() for x in re.finditer(r'^export function ',mdx[:k],re.M)][-1]; j=mdx.index('\n}\n',last)+3
            mdx=mdx[:j]+'\n'+fn_code(a)+mdx[j:]
        tag=f"<{a['fn']} />\n"
        if a.get('after'):
            t=f"<{a['after']} />\n"; assert t in mdx; mdx=mdx.replace(t,t+'\n'+tag,1)
        else:
            tags=list(re.finditer(r'^<\w+Activity />\n',mdx,re.M)); e=tags[-1].end(); mdx=mdx[:e]+'\n'+tag+mdx[e:]
    k=mdx.index('## Práctica'); n=len(re.findall(r'^<\w+Activity />',mdx[k:],re.M))
    mdx=mdx[:k]+re.sub(r'(Estos son los |^Son )(\d+)( ejercicios)',lambda q:f'{q.group(1)}{n}{q.group(3)}',mdx[k:],count=1,flags=re.M)
    open(mdx_p,'w').write(mdx); print('ok',mdx_p,n,'actividades')
if __name__=='__main__': main(sys.argv[1])
