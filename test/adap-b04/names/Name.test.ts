import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
  it("test insert array", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
  it("test escape and delimiter boundary conditions array", () => {
    let n: Name = new StringArrayName(["oss.cs.fau.de"], '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Preconditions", () => {
  it("illegal constructor", () => {
    expect(() => new StringName("oss.cs.fau.de", "##")).toThrow(IllegalArgumentException);
    expect(() => new StringArrayName(["oss"], "##")).toThrow(IllegalArgumentException);
    expect(() => new StringArrayName([])).toThrow(IllegalArgumentException);
  });
  it("illegal delimiter in asString", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.asString("##")).toThrow(IllegalArgumentException);
    n = new StringArrayName(["oss","cs", "fau", "de"]);
    expect(() => n.asString("##")).toThrow(IllegalArgumentException);
  });
  it("illegal concat", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de", "#");
    expect(() => n.concat(n2)).toThrow(IllegalArgumentException);

    n = new StringArrayName(["oss","cs", "fau", "de"]);
    n2 = new StringArrayName(["oss","cs", "fau", "de"], "#");
    expect(() => n.concat(n2)).toThrow(IllegalArgumentException);
  });
  it("illegal getComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(4)).toThrow(IllegalArgumentException);

    n = new StringArrayName(["oss","cs", "fau", "de"]);
    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(4)).toThrow(IllegalArgumentException);
  });
  it("illegal setComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(-1, "foo")).toThrow(IllegalArgumentException);
    expect(() => n.setComponent(4, "foo")).toThrow(IllegalArgumentException);

    n = new StringArrayName(["oss","cs", "fau", "de"]);
    expect(() => n.setComponent(-1, "foo")).toThrow(IllegalArgumentException);
    expect(() => n.setComponent(4, "foo")).toThrow(IllegalArgumentException);
  });
  it("illegal insert", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(-1, "foo")).toThrow(IllegalArgumentException);
    expect(() => n.insert(5, "foo")).toThrow(IllegalArgumentException);

    n = new StringArrayName(["oss","cs", "fau", "de"]);
    expect(() => n.insert(-1, "foo")).toThrow(IllegalArgumentException);
    expect(() => n.insert(5, "foo")).toThrow(IllegalArgumentException);
  });
  it("illegal remove", () => {
    let n: Name = new StringName("oss");
    expect(() => n.remove(-1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(0)).toThrow(IllegalArgumentException);

    n = new StringArrayName(["oss"]);
    expect(() => n.remove(-1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(0)).toThrow(IllegalArgumentException);
  });
});