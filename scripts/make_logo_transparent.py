#!/usr/bin/env python3
"""Flood-remove white/light matte outside logo shapes (opaque PNG → transparent PNG)."""

import collections
import os
import shutil
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
site_root = os.path.dirname(script_dir)

try:
    from PIL import Image  # noqa: E402
except ImportError:
    sys.exit("Requires Pillow: pip3 install Pillow")


def is_near_white(r: int, g: int, b: int, thresh: float = 246.0) -> bool:
    """True for flat white/grey-ish matte pixels (outside logo strokes)."""
    avg = (r + g + b) / 3.0
    spread = max(r, g, b) - min(r, g, b)
    return avg >= thresh or (avg >= 242 and spread < 35)


def main() -> None:
    src = os.path.join(site_root, "assets", "alam-group-logo.png")
    bak = os.path.join(site_root, "assets", "alam-group-logo.orig.png")
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    px = list(img.getdata())
    mask_bg = [False] * len(px)

    def idx(x: int, y: int) -> int:
        return y * w + x

    q: collections.deque[tuple[int, int]] = collections.deque()
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for sx, sy in seeds:
        ii = idx(sx, sy)
        r, g, b, _ = px[ii]
        if is_near_white(r, g, b) and not mask_bg[ii]:
            mask_bg[ii] = True
            q.append((sx, sy))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            ii = idx(nx, ny)
            if mask_bg[ii]:
                continue
            r, g, b, _ = px[ii]
            if not is_near_white(r, g, b):
                continue
            mask_bg[ii] = True
            q.append((nx, ny))

    out_pixels = []
    for i, (r, g, b, a) in enumerate(px):
        if mask_bg[i]:
            out_pixels.append((r, g, b, 0))
        else:
            out_pixels.append((r, g, b, a))

    # Second pass: internal white pockets (triangle negative space), not reachable from borders
    refined = []
    for (r, g, b, a) in out_pixels:
        spread = max(r, g, b) - min(r, g, b)
        if (
            a > 0
            and ((r + g + b) >= 759)
            and spread <= 14
            and max(r, g, b) >= 252
        ):
            refined.append((r, g, b, 0))
        else:
            refined.append((r, g, b, a))

    img_new = img.copy()
    img_new.putdata(refined)

    if not os.path.isfile(bak):
        shutil.copy2(src, bak)

    img_new.save(src, "PNG", optimize=True)


if __name__ == "__main__":
    main()
    print("PNG updated with transparent matte (backup: assets/alam-group-logo.orig.png)")
