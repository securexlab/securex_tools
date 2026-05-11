from pathlib import Path
from esbuild import transform_sync
import sys
file = Path('src/pages/NepaliPatro.jsx')
text = file.read_text('utf-8')
lines = text.splitlines()
for i in range(1, len(lines)+1):
    prefix = '\n'.join(lines[:i])
    try:
        transform_sync(prefix, loader='jsx')
    except Exception as e:
        print('error at line', i)
        print(str(e))
        sys.exit(0)
print('no error')
