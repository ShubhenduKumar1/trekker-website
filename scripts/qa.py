"""Browser QA: overflow, console errors, bad text, core interactions. Usage: python3 scripts/qa.py [base_url]"""
import sys, json, re
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3100"
SHOTS = "/tmp/claude-0/shots"
ROUTES = ["/", "/treks", "/treks/kedarkantha-trek", "/treks/triund-trek", "/destinations/himachal-pradesh",
          "/destinations/uttarakhand", "/about", "/contact", "/privacy", "/terms", "/cancellation-policy", "/treks/does-not-exist"]
WIDTHS = [320, 390, 768, 1024, 1440, 1680]
problems = []
def bad(msg): problems.append(msg); print("FAIL:", msg)
def ok(msg): print("ok:", msg)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    # 1. Overflow, console errors, junk text on every route/width
    for w in WIDTHS:
        ctx = b.new_context(viewport={"width": w, "height": 900})
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "images.unsplash.com" not in m.text and "Failed to load resource" not in m.text else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        for r in ROUTES:
            page.goto(BASE + r, wait_until="networkidle")
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)"); page.wait_for_timeout(250)
            sw = page.evaluate("document.documentElement.scrollWidth"); iw = page.evaluate("window.innerWidth")
            if sw > iw: bad(f"overflow {r} @{w}: {sw}>{iw}")
            text = page.inner_text("body")
            for junk in ["undefined", "NaN", "[object Object]"]:
                if re.search(rf"\b{re.escape(junk)}\b", text): bad(f"'{junk}' on {r} @{w}")
            if re.search(r"\bnull\b", text): bad(f"'null' on {r} @{w}")
        if errors: bad(f"console errors @{w}: {errors[:5]}")
        else: ok(f"no console errors, overflow or junk text @{w}px across {len(ROUTES)} routes")
        ctx.close()

    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    # 2. 404
    resp = page.goto(BASE + "/treks/does-not-exist")
    (ok if resp.status == 404 and "doesn’t lead anywhere" in page.content() else bad)("invalid slug -> 404 page")
    # 3. Titles
    page.goto(BASE + "/treks/kedarkantha-trek"); t = page.title()
    (ok if "Kedarkantha" in t else bad)(f"trek title: {t}")
    page.goto(BASE + "/destinations/uttarakhand"); t = page.title()
    (ok if "Uttarakhand" in t else bad)(f"destination title: {t}")

    # 4. Filters
    page.goto(BASE + "/treks?state=uttarakhand", wait_until="networkidle")
    n = page.locator("main ul.grid > li").count()
    (ok if n == 3 else bad)(f"state=uttarakhand shows {n} treks")
    page.locator("label[for='desk-difficulty-Easy']").click(force=True) if False else page.click("#desk-difficulty-Easy")
    page.wait_for_url(re.compile(r"difficulty=easy")); page.wait_for_timeout(300)
    names = page.locator("main ul.grid > li h3").all_inner_texts()
    (ok if names == ["Dayara Bugyal Trek"] else bad)(f"uttarakhand+easy -> {names}")
    page.click("text=Reset filters"); page.wait_for_timeout(500)
    n = page.locator("main ul.grid > li").count()
    (ok if n == 6 and page.url.endswith("/treks") else bad)(f"reset -> {n} treks, url {page.url}")
    page.fill("#trek-search", "manali"); page.wait_for_timeout(700)
    names = page.locator("main ul.grid > li h3").all_inner_texts()
    (ok if set(names) == {"Hampta Pass Trek", "Bhrigu Lake Trek"} and "q=manali" in page.url else bad)(f"search manali -> {names} url {page.url}")
    page.fill("#trek-search", "zzzz"); page.wait_for_timeout(700)
    (ok if page.locator("text=No treks match these filters").is_visible() else bad)("empty state shown")
    page.fill("#trek-search", ""); page.wait_for_timeout(700)
    page.select_option("#trek-sort", "duration-asc"); page.wait_for_timeout(500)
    names = page.locator("main ul.grid > li h3").all_inner_texts()
    (ok if names[0] == "Triund Trek" and "sort=duration-asc" in page.url else bad)(f"sort duration asc -> {names[:2]}")
    page.select_option("#trek-sort", "duration-desc"); page.wait_for_timeout(500)
    names = page.locator("main ul.grid > li h3").all_inner_texts()
    (ok if names[-1] == "Triund Trek" else bad)(f"sort duration desc -> last {names[-1]}")
    page.click("#desk-season-Winter"); page.click("#desk-duration-long"); page.wait_for_timeout(500)
    names = page.locator("main ul.grid > li h3").all_inner_texts()
    (ok if set(names) == {"Kedarkantha Trek", "Dayara Bugyal Trek", "Brahmatal Trek"} else bad)(f"winter+6d -> {names}")
    # Filters use history.replaceState (no history spam), so Back returns to the previous page.
    page.go_back(); page.wait_for_timeout(500)
    (ok if "/treks" not in page.url else bad)(f"back leaves the explorer ({page.url})")
    page.go_forward(); page.wait_for_timeout(800)
    n = page.locator("main ul.grid > li").count()
    (ok if "duration=long" in page.url and n == 3 else bad)(f"forward restores filtered state from URL ({n} treks)")
    # card -> detail
    page.goto(BASE + "/treks", wait_until="networkidle")
    page.click("main ul.grid > li >> text=Hampta Pass Trek"); page.wait_for_url(re.compile("/treks/hampta-pass-trek"))
    ok("card opens correct detail page")

    # 5. Itinerary accordion
    page.goto(BASE + "/treks/hampta-pass-trek", wait_until="networkidle")
    days = page.locator("#itinerary ol > li")
    (ok if days.count() == 5 else bad)(f"hampta itinerary has {days.count()} days (expect 5)")
    btns = page.locator("#itinerary ol > li button[aria-expanded]")
    first, second = btns.nth(0).get_attribute("aria-expanded"), btns.nth(1).get_attribute("aria-expanded")
    (ok if (first, second) == ("true", "false") else bad)(f"initial day states {first},{second}")
    btns.nth(1).focus(); page.keyboard.press("Enter"); page.wait_for_timeout(300)
    (ok if btns.nth(1).get_attribute("aria-expanded") == "true" else bad)("keyboard Enter expands day 2")
    page.click("text=Expand all days"); page.wait_for_timeout(300)
    (ok if all(btns.nth(i).get_attribute("aria-expanded") == "true" for i in range(5)) else bad)("expand all")
    page.click("text=Collapse all days"); page.wait_for_timeout(300)
    (ok if all(btns.nth(i).get_attribute("aria-expanded") == "false" for i in range(5)) else bad)("collapse all")
    page.goto(BASE + "/treks/triund-trek")
    (ok if page.locator("#itinerary ol > li").count() == 2 else bad)("triund itinerary has 2 days")

    # 6. Package selection updates panel + message
    page.goto(BASE + "/treks/kedarkantha-trek", wait_until="networkidle")
    panel = page.locator("aside[aria-label='Enquire about this trek']")
    page.click("#package label:has-text('Private / custom group')"); page.wait_for_timeout(200)
    (ok if "Private / custom group" in panel.inner_text() else bad)("package selection updates sticky panel")
    panel.locator("input[type=date]").fill("2027-01-15")
    panel.locator("select").last.select_option("4")
    panel.locator("summary").click()
    msg = panel.locator("pre").inner_text()
    expected = ["Trek: Kedarkantha Trek", "Destination: Uttarakhand", "Duration: 6 days / 5 nights",
                "Selected package: Private / custom group", "Preferred date: 15 January 2027", "Number of participants: 4"]
    missing = [e for e in expected if e not in msg]
    (ok if not missing else bad)(f"message preview contains selections {missing or ''}")
    # No-number production behaviour: enquiry buttons route to /contact, never a broken wa.me
    hrefs = page.eval_on_selector_all("a", "els => els.map(e => e.getAttribute('href'))")
    (ok if not any(h and "wa.me" in h for h in hrefs) else bad)("no wa.me links without a configured number")
    (ok if page.locator("aside a:has-text('Enquire on WhatsApp')").get_attribute("href") == "/contact" else bad)("unconfigured enquiry falls back to /contact")
    # FAQ
    faqbtn = page.locator("#faq button[aria-expanded]").first
    faqbtn.click(); page.wait_for_timeout(200)
    (ok if faqbtn.get_attribute("aria-expanded") == "true" else bad)("FAQ accordion opens")
    # Packing checklist
    page.locator("#packing input[type=checkbox]").first.check(force=True)
    (ok if "1 of" in page.locator("#packing").inner_text() else bad)("packing checklist counts")
    page.screenshot(path=f"{SHOTS}/detail-1440.png", full_page=False)
    ctx.close()

    # 7. Mobile nav + gallery + mobile booking bar
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
    page = ctx.new_page()
    page.goto(BASE + "/", wait_until="networkidle")
    page.screenshot(path=f"{SHOTS}/home-390.png")
    page.click("button[aria-label='Open menu']")
    (ok if page.locator("#mobile-menu").is_visible() else bad)("mobile menu opens")
    focused = page.evaluate("document.activeElement.textContent")
    (ok if "Home" in focused else bad)(f"focus moves into menu ({focused!r})")
    page.screenshot(path=f"{SHOTS}/menu-390.png")
    page.keyboard.press("Escape"); page.wait_for_timeout(500)
    (ok if page.locator("#mobile-menu").count() == 0 else bad)("Escape closes mobile menu")
    page.click("button[aria-label='Open menu']"); page.click("#mobile-menu >> text=Explore Treks")
    page.wait_for_url(re.compile("/treks$")); page.wait_for_timeout(500)
    (ok if page.locator("#mobile-menu").count() == 0 else bad)("menu closes after navigation")
    # mobile filter drawer
    page.click("button:has-text('Filters')")
    (ok if page.locator("dialog[open]").is_visible() else bad)("mobile filter drawer opens")
    page.click("#mob-state-himachal-pradesh"); page.wait_for_timeout(400)
    page.screenshot(path=f"{SHOTS}/drawer-390.png")
    page.click("dialog[open] >> text=/Show \\d+ treks/")
    n = page.locator("main ul.grid > li").count()
    (ok if n == 3 else bad)(f"mobile drawer filter -> {n} treks")
    # gallery lightbox
    page.goto(BASE + "/", wait_until="networkidle")
    g = page.locator("#gallery-title").scroll_into_view_if_needed()
    page.locator("button[aria-label^='View larger']").first.click(); page.wait_for_timeout(300)
    (ok if page.locator("dialog[open]").count() == 1 else bad)("lightbox opens")
    page.keyboard.press("ArrowRight"); page.wait_for_timeout(200)
    (ok if "2 /" in page.locator("dialog[open]").inner_text() else bad)("lightbox arrow key navigates")
    page.keyboard.press("Escape"); page.wait_for_timeout(300)
    act = page.evaluate("document.activeElement.getAttribute('aria-label')")
    (ok if page.locator("dialog[open]").count() == 0 and act and act.startswith("View larger") else bad)(f"Escape closes lightbox and restores focus ({act})")
    # mobile booking bar
    page.goto(BASE + "/treks/brahmatal-trek", wait_until="networkidle")
    bar = page.locator("div.fixed.bottom-0")
    (ok if bar.is_visible() else bad)("mobile booking bar visible")
    page.screenshot(path=f"{SHOTS}/detail-390.png")
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)"); page.wait_for_timeout(700)
    cls = bar.get_attribute("class")
    (ok if "translate-y-full" in cls else bad)("mobile bar hides over footer")
    ctx.close()

    # 8. Reduced motion: content visible immediately, no transforms pending
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    page = ctx.new_page(); page.goto(BASE + "/", wait_until="networkidle")
    for y in range(0, 12000, 600):
        page.evaluate(f"window.scrollTo(0,{y})"); page.wait_for_timeout(60)
    page.wait_for_timeout(400)
    hidden = page.evaluate("[...document.querySelectorAll('main [style]')].filter(e => getComputedStyle(e).opacity === '0').length")
    (ok if hidden == 0 else bad)(f"reduced motion: {hidden} elements hidden")
    anim = page.evaluate("getComputedStyle(document.querySelector('.rise')).animationName")
    (ok if anim == "none" else bad)(f"reduced motion disables CSS entrance ({anim})")
    page.screenshot(path=f"{SHOTS}/home-1440.png")
    page.goto(BASE + "/treks"); page.screenshot(path=f"{SHOTS}/treks-1440.png")
    ctx.close()
    b.close()

print("\nSUMMARY:", "ALL PASSED" if not problems else f"{len(problems)} problem(s)")
for pr in problems: print(" -", pr)
