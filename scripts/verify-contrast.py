import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def luminance(color):
    values = [int(color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    values = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values]
    return sum(v * w for v, w in zip(values, [.2126, .7152, .0722]))

def contrast(a, b):
    lo, hi = sorted([luminance(a), luminance(b)])
    return (hi + .05) / (lo + .05)

pairs = [
    ('body', '#17252b', '#f2f5f5', 4.5),
    ('secondary', '#5d6b70', '#f2f5f5', 4.5),
    ('primary button', '#ffffff', '#075f53', 4.5),
    ('game selected label', '#075f53', '#e9f5f2', 4.5),
    ('lesson selected label', '#214fb4', '#edf3ff', 4.5),
    ('theme selected label', '#ad4a1c', '#fff2e9', 4.5),
    ('control border', '#7b8f89', '#ffffff', 3),
    ('focus', '#087b69', '#ffffff', 3),
]
catalog = json.loads((ROOT / 'prototypes/catalog.json').read_text(encoding='utf8'))
for t in catalog['themes'].values():
    pairs.extend([(t['id'] + ' title', t['ink'], t['bg'], 4.5), (t['id'] + ' card', t['ink'], t['panel'], 4.5), (t['id'] + ' secondary', t['muted'], t['panel'], 4.5)])
results = [dict(name=n, ratio=round(contrast(a, b), 2), minimum=m, passed=contrast(a, b) >= m) for n, a, b, m in pairs]
(ROOT / 'docs/verification/contrast.json').write_text(json.dumps(results, indent=2), encoding='utf8')
assert all(r['passed'] for r in results), results
print(json.dumps({'color_pairs': len(results), 'passed': True}))
