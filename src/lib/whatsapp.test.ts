import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, normalizeWhatsAppNumber, trekEnquiryMessage, generalEnquiryMessage } from "@/lib/whatsapp";

const trek = { name: "Kedarkantha Trek", state: "Uttarakhand" as const, durationDays: 6 };
const TEST_NUMBER = "910000000000"; // test-only dummy

describe("whatsapp", () => {
  it("normalizes numbers to digits", () => {
    expect(normalizeWhatsAppNumber("+91 00000-00000")).toBe(TEST_NUMBER);
    expect(normalizeWhatsAppNumber("")).toBeNull();
    expect(normalizeWhatsAppNumber("123")).toBeNull();
  });
  it("does not build a link when the number is missing", () => {
    const link = buildWhatsAppLink("hi", null);
    expect(link.configured).toBe(false);
    expect(link.href).toBeNull();
  });
  it("encodes the message into an official wa.me link", () => {
    const link = buildWhatsAppLink("Hi! A & B\nnext", TEST_NUMBER);
    expect(link.href).toBe(`https://wa.me/${TEST_NUMBER}?text=Hi!%20A%20%26%20B%0Anext`);
  });
  it("omits unselected fields and asks about availability", () => {
    const msg = trekEnquiryMessage({ trek });
    expect(msg).toContain("Trek: Kedarkantha Trek");
    expect(msg).toContain("Destination: Uttarakhand");
    expect(msg).toContain("Duration: 6 days / 5 nights");
    expect(msg).not.toMatch(/Preferred date|participants|Selected package|\[|undefined|null|NaN/);
    expect(msg).toContain("upcoming available dates");
  });
  it("includes selections when provided", () => {
    const msg = trekEnquiryMessage({ trek, pkg: { name: "Group departure" }, preferredDate: "2026-12-20", participants: 3 });
    expect(msg).toContain("Selected package: Group departure");
    expect(msg).toContain("Preferred date: 20 December 2026");
    expect(msg).toContain("Number of participants: 3");
  });
  it("drops invalid dates", () => {
    expect(trekEnquiryMessage({ trek, preferredDate: "2026-02-31" })).not.toContain("Preferred date");
  });
  it("has a general enquiry message", () => {
    expect(generalEnquiryMessage()).toMatch(/plan a Himalayan trekking experience/);
  });
});

import { planningEnquiryMessage } from "@/lib/whatsapp";
describe("planning enquiry", () => {
  it("falls back to the general message", () => {
    expect(planningEnquiryMessage({})).toBe(generalEnquiryMessage());
  });
  it("adds only chosen preferences", () => {
    const msg = planningEnquiryMessage({ region: "Uttarakhand", groupSize: "2 people" });
    expect(msg).toContain("Region: Uttarakhand");
    expect(msg).toContain("Group size: 2 people");
    expect(msg).not.toContain("When:");
  });
});
