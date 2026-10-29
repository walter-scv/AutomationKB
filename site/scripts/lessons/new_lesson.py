"""Genera una lección nueva (.mdx) a partir de un spec en Python.

spec = {
  'track': 'git', 'file': '32a-ramas-remotas', 'title': '...', 'position': 32.5,
  'slug': 'foundations-ramas-remotas', 'intro': '...', 'theory': 'path.md' (desde ## Conceptos hasta antes de ## Práctica),
  'activities': [
     {'fn': 'XActivity', 'id': 'x', 'title': '...', 'kind': '...', 'goal': '...', 'consigna': '...',
      'component': 'DecisionPath', 'props': {'startId': 'X_START', ...}, 'literal': {'promptSymbol': '>'},
      'code': 'X_CODE' (opcional: CodeBlock antes del componente), 'code_lang': 'ts'}
  ],
}
"""
import importlib.util
import os
import sys

SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
NO_ALREADY_DONE = {'Quiz', 'Order'}


def build(spec):
    acts = spec['activities']
    comps = []
    for a in acts:
        if a['component'] not in comps:
            comps.append(a['component'])
    names = []
    for a in acts:
        for v in a['props'].values():
            if v not in names:
                names.append(v)
        if a.get('code') and a['code'] not in names:
            names.append(a['code'])
    uses_code = any(a.get('code') for a in acts) or spec.get('intro_code')
    if spec.get('intro_code') and spec['intro_code'] not in names:
        names.append(spec['intro_code'])
    lines = ['---', f'title: "{spec["title"]}"', f'sidebar_position: {spec["position"]}', '---', '',
             "import Activity from '@site/src/components/Activity';"]
    for c in comps:
        lines.append(f"import {c} from '@site/src/components/{c}';")
    if uses_code:
        lines.append("import CodeBlock from '@theme/CodeBlock';")
    lines.append("import {useLessonProgress} from '@site/src/hooks/useLessonProgress';")
    lines.append('import {')
    lines += [f'  {n},' for n in names]
    lines.append(f"}} from '@site/src/content/lessons/{spec['file']}';")
    lines += ['', f"export const LESSON_SLUG = '{spec['slug']}';", '']
    for a in acts:
        aid = a['id']
        props = '\n'.join(f'        {k}={{{v}}}' for k, v in a['props'].items())
        lit = '\n'.join(f'        {k}="{v}"' for k, v in a.get('literal', {}).items())
        extra = ''
        if a['component'] not in NO_ALREADY_DONE:
            extra = f"\n        alreadyDone={{isDone('{aid}')}}"
        body = f"      <{a['component']}\n{props}" + (f'\n{lit}' if lit else '') + extra + \
               f"\n        onSolved={{() => markDone('{aid}')}}\n      />"
        code = ''
        if a.get('code'):
            code = f"      <CodeBlock language=\"{a.get('code_lang', 'ts')}\">{{{a['code']}}}</CodeBlock>\n"
        lines += [
            f"export function {a['fn']}() {{",
            f"  const {{isDone, markDone}} = useLessonProgress(LESSON_SLUG, ['{aid}']);",
            '  return (',
            '    <Activity',
            f'      title="{a["title"]}"',
            f'      kind="{a["kind"]}"',
            f'      goal="{a["goal"]}"',
            f"      done={{isDone('{aid}')}}",
            f'      consigna="{a["consigna"]}"',
            '    >',
            code + body,
            '    </Activity>',
            '  );',
            '}',
            '',
        ]
    lines.append(spec['intro'].strip())
    lines.append('')
    lines.append(open(spec['theory']).read().strip())
    lines += ['', '## Práctica', '',
              f"Estos son los {len(acts)} ejercicios de práctica de la entrada, en orden. Cada uno es "
              "independiente y tiene su propia consigna; cada bloque avisa cuando está resuelto.", '']
    for a in acts:
        lines += [f"<{a['fn']} />", '']
    out = '\n'.join(lines).rstrip() + '\n'
    path = f"{SITE}/docs/01-foundations/{spec['track']}/{spec['file']}.mdx"
    open(path, 'w').write(out)
    print('ok', path)


if __name__ == '__main__':
    p = sys.argv[1]
    sp = importlib.util.spec_from_file_location('spec', p)
    m = importlib.util.module_from_spec(sp)
    sp.loader.exec_module(m)
    build(m.spec)
