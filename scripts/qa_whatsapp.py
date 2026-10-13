"""Checks WhatsApp links when a (dummy) number is configured at build time.

Build with:  NEXT_PUBLIC_WHATSAPP_NUMBER=910000000000 npm run build && npm start -- -p 3100
Then run:    python3 scripts/qa_whatsapp.py
"""
import re
import urllib.parse
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3100"
NUM = "910000000000"  # test-only dummy number
fails = []


def check(cond, msg):
    print(("ok: " if cond else "FAIL: ") + msg)
    if not cond:
        fails.append(msg)


def text_of(href):
    return urllib.parse.unquote(href.split("text=")[1])


with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto(BASE + "/treks/kedarkantha-trek", wait_until="networkidle")
    aside = pg.locator("aside[aria-label='Enquire about this trek']")
    href = aside.locator("a:has-text('Enquire on WhatsApp')").get_attribute("href")
    check(href.startswith(f"https://wa.me/{NUM}?text="), f"official click-to-chat url ({href[:40]}…)")
    msg = text_of(href)
    check(
        "Selected package: Group departure" in msg and "Preferred date" not in msg and "upcoming available dates" in msg,
        "default message omits unselected fields",
    )
    pg.click("#package label:has-text('Private / custom group')")
    aside.locator("input[type=date]").fill("2027-03-02")
    aside.locator("select").last.select_option("2")
    href = aside.locator("a:has-text('Enquire on WhatsApp')").get_attribute("href")
    msg = text_of(href)
    check(
        all(x in msg for x in ["Private / custom group", "Preferred date: 2 March 2027", "Number of participants: 2"]),
        "selections flow into message",
    )
    hero = pg.locator("section[aria-labelledby='trek-title'] a[href^='https://wa.me']").get_attribute("href")
    check(hero == href, "hero CTA uses the same selections")
    check(not re.search(r"\[|undefined|null|NaN", msg), "no placeholders in message")
    check(pg.locator("a[href^='https://wa.me']").first.get_attribute("target") == "_blank", "opens in new tab")

    pg.goto(BASE + "/", wait_until="networkidle")
    gen = [text_of(h) for h in pg.eval_on_selector_all("a[href^='https://wa.me']", "e => e.map(x => x.href)")]
    check(len(gen) >= 2 and all("plan a Himalayan trekking experience" in m for m in gen), f"homepage general enquiry links ({len(gen)})")
    pg.evaluate("window.scrollTo(0, 1500)")
    pg.wait_for_timeout(700)
    check(pg.locator("a[aria-label^='Chat with us on WhatsApp']").is_visible(), "floating WhatsApp button appears after scroll")
    pg.goto(BASE + "/treks/triund-trek")
    pg.evaluate("window.scrollTo(0, 1500)")
    pg.wait_for_timeout(700)
    check(pg.locator("a[aria-label^='Chat with us on WhatsApp']").count() == 0, "floating button hidden on trek pages")

    pg.goto(BASE + "/contact", wait_until="networkidle")
    pg.locator("main select").nth(0).select_option("Uttarakhand")
    pg.locator("main select").nth(2).select_option("2 people")
    m = text_of(pg.locator("a:has-text('Continue on WhatsApp')").get_attribute("href"))
    check("Region: Uttarakhand" in m and "Group size: 2 people" in m and "When:" not in m, "contact planner message")
    b.close()

print("SUMMARY:", "ALL PASSED" if not fails else fails)
