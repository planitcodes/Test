#!/usr/bin/env python3
"""Regenerate the QR code embedded in teaser.html.

Usage:  python3 tools/make-qr.py https://your-real-site-url

Rewrites whatever sits between the <!--QR--> markers in teaser.html, so run
this again any time that URL changes.
"""
import re
import sys
import pathlib

import segno

URL = sys.argv[1] if len(sys.argv) > 1 else "https://savvyaviator.com"
TEASER = pathlib.Path(__file__).resolve().parent.parent / "teaser.html"

qr = segno.make(URL, error="m")
matrix = [[bool(c) for c in row] for row in qr.matrix]
n = len(matrix)

# One path of 1x1 squares — no external assets, scales cleanly, prints crisp.
d = "".join(
    f"M{x} {y}h1v1h-1z"
    for y, row in enumerate(matrix)
    for x, cell in enumerate(row)
    if cell
)
svg = (
    f'<svg class="qr" viewBox="0 0 {n} {n}" role="img" '
    f'aria-label="Scan to book a call" shape-rendering="crispEdges">'
    f'<rect width="{n}" height="{n}" fill="var(--paper)"/>'
    f'<path d="{d}" fill="var(--ink)"/></svg>'
)

html = TEASER.read_text()
new, count = re.subn(r"<!--QR-->.*?<!--/QR-->", f"<!--QR-->{svg}<!--/QR-->", html, flags=re.S)
if not count:
    sys.exit("error: no <!--QR--> ... <!--/QR--> markers found in teaser.html")
TEASER.write_text(new)
print(f"QR regenerated for {URL}  ({n}x{n} modules)")
