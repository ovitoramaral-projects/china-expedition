#!/usr/bin/env python3
"""Build the zip to upload to the host (e.g. Cloudflare Pages "Upload assets").
Same files as the offline app, plus the local vouchers/, which this deploy copy's
service worker also caches so the vouchers open with no signal.
The zip is written outside the repo (vouchers never go into git).
Usage:  python3 tools/make-deploy.py /path/to/site.zip"""
import hashlib, json, os, re, subprocess, sys, zipfile
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out = os.path.abspath(sys.argv[1])
subprocess.check_call([sys.executable, "tools/build-sw.py"])
sw = open("sw.js").read()
files = json.loads(re.search(r"const FILES = (\[.*?\]);", sw, re.S).group(1))
vouchers = sorted("vouchers/" + f for f in os.listdir("vouchers")) if os.path.isdir("vouchers") else []
h = hashlib.sha1(sw.encode())
for v in vouchers:
    h.update(v.encode()); h.update(open(v, "rb").read())
sw = re.sub(r"const FILES = \[.*?\];", "const FILES = " + json.dumps(files + vouchers, indent=0) + ";", sw, flags=re.S)
sw = re.sub(r'const VERSION = "ce-[0-9a-f]+";', f'const VERSION = "ce-{h.hexdigest()[:10]}";', sw)
sw = sw.replace('res.ok && !e.request.url.includes("/vouchers/")', "res.ok")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for f in files[1:] + vouchers:
        if f != "sw.js": z.write(f)
    z.writestr("sw.js", sw)
print(f"{out}: {len(files) - 1 + len(vouchers)} files ({len(vouchers)} vouchers, cached offline)")
