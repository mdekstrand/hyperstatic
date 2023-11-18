import { assertEquals, assertFalse, assertStrictEquals } from "std/assert/mod.ts";
import { describe, it } from "std/testing/bdd.ts";
import { parse } from "../spec.ts";

describe("spec parser", () => {
  it("should parse a name", () => {
    let spec = parse("div");
    assertEquals(spec.name, "div");
    assertFalse(spec.id);
    assertFalse(spec.classes);
  });

  it("should parse a name with an ID", () => {
    let spec = parse("section#31");
    assertEquals(spec.name, "section");
    assertStrictEquals(spec.id, "31");
    assertFalse(spec.classes);
  });

  it("should parse a name with a class", () => {
    let spec = parse("nav.silent");
    assertEquals(spec.name, "nav");
    assertFalse(spec.id);
    assertEquals(spec.classes, ["silent"]);
  });

  it("should parse multiple classes", () => {
    let spec = parse("form.login.auto");
    assertEquals(spec.name, "form");
    assertFalse(spec.id);
    assertEquals(spec.classes, ["login", "auto"]);
  });

  it("should parse a compound spec", () => {
    let spec = parse("main.blog.index#shell");
    assertEquals(spec.name, "main");
    assertEquals(spec.id, "shell");
    assertEquals(spec.classes, ["blog", "index"]);
  });
});
