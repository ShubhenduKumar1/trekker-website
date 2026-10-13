import sys
from playwright.sync_api import sync_playwright
BASE="http://localhost:3100"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    for w,h in [(1440,900),(390,844)]:
        pg=b.new_page(viewport={"width":w,"height":h})
        for r,name in [("/","home"),("/treks","treks"),("/treks/kedarkantha-trek","detail")]:
            pg.goto(BASE+r,wait_until="networkidle")
            H=pg.evaluate("document.body.scrollHeight")
            for y in range(0,H,400): pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(80)
            pg.wait_for_timeout(1500); pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(600)
            pg.screenshot(path=f"/tmp/claude-0/shots/full-{name}-{w}.png",full_page=True)
    b.close()
