import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { AbstractName } from "../../../src/adap-b04/names/AbstractName";

describe("advanced tests", () => {
    it("asString", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        expect(n.asString()).toBe("oss.cs.fau.de");
        n = new StringName("oss.cs.fau.de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    
        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        expect(n.asString()).toBe("oss#cs#fau#de");
        n = new StringName("oss#cs#fau#de", "#");
        expect(n.asString()).toBe("oss#cs#fau#de");
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        expect(n.asString()).toBe("oss.cs.fau.de");
        n = new StringName("oss\\.cs.fau\\.de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        expect(n.asString("#")).toBe("oss.cs#fau.de");
        n = new StringName("oss\\.cs.fau\\.de");
        expect(n.asString("#")).toBe("oss.cs#fau.de");
    
        n = new StringArrayName(["oss#cs", "fau#de"]);
        expect(n.asString("#")).toBe("oss#cs#fau#de");
        n = new StringName("oss#cs.fau#de");
        expect(n.asString("#")).toBe("oss#cs#fau#de");
    
        n = new StringArrayName(["", ""]);
        expect(n.asString()).toBe(".");
        n = new StringName(".");
        expect(n.asString()).toBe(".");
    
        n = new StringArrayName(["fau.de"], "#");
        expect(n.asString()).toBe("fau.de");
        n = new StringName("fau.de", "#");
        expect(n.asString()).toBe("fau.de");
    });

    it("asDataString", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        expect(n.asDataString()).toBe("oss.cs.fau.de");
        n = new StringName("oss.cs.fau.de");
        expect(n.asDataString()).toBe("oss.cs.fau.de");

        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        expect(n.asDataString()).toBe("oss.cs.fau.de");
        n = new StringName("oss#cs#fau#de", "#");
        expect(n.asDataString()).toBe("oss.cs.fau.de");

        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
        n = new StringName("oss\\.cs.fau\\.de");
        expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");

        n = new StringArrayName(["", ""]);
        expect(n.asDataString()).toBe(".");
        n = new StringName(".");
        expect(n.asDataString()).toBe(".");
    
        n = new StringArrayName(["fau.de"], "#");
        expect(n.asDataString()).toBe("fau\\.de");
        n = new StringName("fau.de", "#");
        expect(n.asDataString()).toBe("fau\\.de");
    })

    it("getDelimiterCharacter", ()=> {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        expect(n.getDelimiterCharacter()).toBe(".");
        n = new StringName("oss.cs.fau.de");
        expect(n.getDelimiterCharacter()).toBe(".");

        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        expect(n.getDelimiterCharacter()).toBe("#");
        n = new StringName("oss#cs#fau#de", "#");
        expect(n.getDelimiterCharacter()).toBe("#");
    })

    it("getNoComponents", ()=> {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        expect(n.getNoComponents()).toBe(4);
        n = new StringName("oss.cs.fau.de");
        expect(n.getNoComponents()).toBe(4);
    
        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        expect(n.getNoComponents()).toBe(4);
        n = new StringName("oss#cs#fau#de", "#");
        expect(n.getNoComponents()).toBe(4);
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        expect(n.getNoComponents()).toBe(2);
        n = new StringName("oss\\.cs.fau\\.de");
        expect(n.getNoComponents()).toBe(2);
    
        n = new StringArrayName(["oss#cs", "fau#de"]);
        expect(n.getNoComponents()).toBe(2);
        n = new StringName("oss#cs.fau#de");
        expect(n.getNoComponents()).toBe(2);
    
        n = new StringArrayName(["", ""]);
        expect(n.getNoComponents()).toBe(2);
        n = new StringName(".");
        expect(n.getNoComponents()).toBe(2);
    
        n = new StringArrayName(["fau.de"], "#");
        expect(n.getNoComponents()).toBe(1);
        n = new StringName("fau.de", "#");
        expect(n.getNoComponents()).toBe(1);
    })

    it("getComponent", ()=> {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        expect(n.getComponent(0)).toBe("oss");
        expect(n.getComponent(3)).toBe("de");
        n = new StringName("oss.cs.fau.de");
        expect(n.getComponent(0)).toBe("oss");
        expect(n.getComponent(3)).toBe("de");
    
        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        expect(n.getComponent(0)).toBe("oss");
        expect(n.getComponent(3)).toBe("de");
        n = new StringName("oss#cs#fau#de", "#");
        expect(n.getComponent(0)).toBe("oss");
        expect(n.getComponent(3)).toBe("de");
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        expect(n.getComponent(0)).toBe("oss\\.cs");
        expect(n.getComponent(1)).toBe("fau\\.de");
        n = new StringName("oss\\.cs.fau\\.de");
        expect(n.getComponent(0)).toBe("oss\\.cs");
        expect(n.getComponent(1)).toBe("fau\\.de");
    
        n = new StringArrayName(["oss#cs", "fau#de"]);
        expect(n.getComponent(0)).toBe("oss#cs");
        expect(n.getComponent(1)).toBe("fau#de");
        n = new StringName("oss#cs.fau#de");
        expect(n.getComponent(0)).toBe("oss#cs");
        expect(n.getComponent(1)).toBe("fau#de");
    
        n = new StringArrayName(["", ""]);
        expect(n.getComponent(0)).toBe("");
        expect(n.getComponent(1)).toBe("");
        n = new StringName(".");
        expect(n.getComponent(0)).toBe("");
        expect(n.getComponent(1)).toBe("");
    
        n = new StringArrayName(["fau.de"], "#");
        expect(n.getComponent(0)).toBe("fau.de");
        n = new StringName("fau.de", "#");
        expect(n.getComponent(0)).toBe("fau.de");
    })

    it("setComponent", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n.setComponent(0, "foo")
        expect(n.getComponent(0)).toBe("foo");
        expect(n.getComponent(3)).toBe("de");
        n = new StringName("oss.cs.fau.de");
        n.setComponent(0, "foo")
        expect(n.getComponent(0)).toBe("foo");
        expect(n.getComponent(3)).toBe("de");
    
        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        n.setComponent(0, "foo")
        expect(n.getComponent(0)).toBe("foo");
        expect(n.getComponent(3)).toBe("de");
        n = new StringName("oss#cs#fau#de", "#");
        n.setComponent(0, "foo")
        expect(n.getComponent(0)).toBe("foo");
        expect(n.getComponent(3)).toBe("de");
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        n.setComponent(0, "foo\\.bar")
        expect(n.getComponent(0)).toBe("foo\\.bar");
        expect(n.getComponent(1)).toBe("fau\\.de");
        n = new StringName("oss\\.cs.fau\\.de");
        n.setComponent(0, "foo\\.bar")
        expect(n.getComponent(0)).toBe("foo\\.bar");
        expect(n.getComponent(1)).toBe("fau\\.de");
    
        n = new StringArrayName(["oss#cs", "fau#de"]);
        n.setComponent(0,"foo#bar");
        expect(n.getComponent(0)).toBe("foo#bar");
        expect(n.getComponent(1)).toBe("fau#de");
        n = new StringName("oss#cs.fau#de");
        n.setComponent(0,"foo#bar");
        expect(n.getComponent(0)).toBe("foo#bar");
        expect(n.getComponent(1)).toBe("fau#de");
    
        n = new StringArrayName([""]);
        n.setComponent(0,"foo#bar");
        expect(n.getComponent(0)).toBe("foo#bar");
        n = new StringName("");
        n.setComponent(0,"foo#bar");
        expect(n.getComponent(0)).toBe("foo#bar");
    })

    it("insert", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n.insert(0, "foo");
        expect(n.asDataString()).toBe("foo.oss.cs.fau.de");
        n.insert(1, "bar");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de");
        n.insert(6, "baz");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de.baz");
        n = new StringName("oss.cs.fau.de");
        n.insert(0, "foo");
        expect(n.asDataString()).toBe("foo.oss.cs.fau.de");
        n.insert(1, "bar");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de");
        n.insert(6, "baz");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de.baz");
    
        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        n.insert(0, "foo");
        expect(n.asDataString()).toBe("foo.oss.cs.fau.de");
        n.insert(1, "bar");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de");
        n.insert(6, "baz");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de.baz");
        n = new StringName("oss#cs#fau#de", "#");
        n.insert(0, "foo");
        expect(n.asDataString()).toBe("foo.oss.cs.fau.de");
        n.insert(1, "bar");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de");
        n.insert(6, "baz");
        expect(n.asDataString()).toBe("foo.bar.oss.cs.fau.de.baz");
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        n.insert(1, "foo\\.bar")
        expect(n.asDataString()).toBe("oss\\.cs.foo\\.bar.fau\\.de");
        n = new StringName("oss\\.cs.fau\\.de");
        n.insert(1, "foo\\.bar")
        expect(n.asDataString()).toBe("oss\\.cs.foo\\.bar.fau\\.de");
    
        n = new StringArrayName(["oss#cs", "fau#de"]);
        n.insert(1, "foo#bar")
        expect(n.asDataString()).toBe("oss#cs.foo#bar.fau#de");
        n = new StringName("oss#cs.fau#de");
        n.insert(1, "foo#bar")
        expect(n.asDataString()).toBe("oss#cs.foo#bar.fau#de");
    
        n = new StringArrayName([""]);
        n.insert(0, "fau")
        expect(n.asDataString()).toBe("fau.");
        n = new StringArrayName([""]);
        n.insert(1, "fau")
        expect(n.asDataString()).toBe(".fau");
        n = new StringName("");
        n.insert(0, "fau")
        expect(n.asDataString()).toBe("fau.");
        n = new StringName("");
        n.insert(1, "fau")
        expect(n.asDataString()).toBe(".fau");
    })

    it("append", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n.append("foo");
        expect(n.asDataString()).toBe("oss.cs.fau.de.foo");
        n = new StringName("oss.cs.fau.de");
        n.append("foo");
        expect(n.asDataString()).toBe("oss.cs.fau.de.foo");

        n= new StringArrayName(["oss", "cs", "fau", "de"]);
        n.append("");
        expect(n.asDataString()).toBe("oss.cs.fau.de.");
        n = new StringName("oss.cs.fau.de");
        n.append("");
        expect(n.asDataString()).toBe("oss.cs.fau.de.");
    
        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        n.append("foo");
        expect(n.asDataString()).toBe("oss.cs.fau.de.foo");
        n = new StringName("oss#cs#fau#de", "#");
        n.append("foo");
        expect(n.asDataString()).toBe("oss.cs.fau.de.foo");
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        n.append("foo\\.bar");
        expect(n.asDataString()).toBe("oss\\.cs.fau\\.de.foo\\.bar");
        n = new StringName("oss\\.cs.fau\\.de");
        n.append("foo\\.bar");
        expect(n.asDataString()).toBe("oss\\.cs.fau\\.de.foo\\.bar");
    
        n = new StringArrayName([""]);
        n.append("fau");
        expect(n.asDataString()).toBe(".fau");
        n = new StringName("");
        n.append("fau");
        expect(n.asDataString()).toBe(".fau");
    })

    it("remove", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n.remove(0)
        expect(n.asDataString()).toBe("cs.fau.de");
        n = new StringName("oss.cs.fau.de");
        n.remove(0)
        expect(n.asDataString()).toBe("cs.fau.de");
    
        n = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        n.remove(0)
        expect(n.asDataString()).toBe("cs.fau.de");
        n = new StringName("oss#cs#fau#de", "#");
        n.remove(0)
        expect(n.asDataString()).toBe("cs.fau.de");
    
        n = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        n.remove(0)
        expect(n.asDataString()).toBe("fau\\.de");
        n = new StringName("oss\\.cs.fau\\.de");
        n.remove(0)
        expect(n.asDataString()).toBe("fau\\.de");
    
        n = new StringArrayName(["oss#cs", "fau#de"]);
        n.remove(0)
        expect(n.asDataString()).toBe("fau#de");
        n = new StringName("oss#cs.fau#de");
        n.remove(0)
        expect(n.asDataString()).toBe("fau#de");

        n = new StringArrayName(["", ""]);
        n.remove(0);
        expect(n.asDataString()).toBe("");
        n = new StringName(".");
        n.remove(0);
        expect(n.asDataString()).toBe("");
    })

    it("concat", () => {
        let n1: Name = new StringArrayName(["oss", "cs"]);
        let n2: Name = new StringName("fau.de");
        n1.concat(n2)
        expect(n1.asDataString()).toBe("oss.cs.fau.de");
    
        n1 = new StringArrayName(["oss", "cs"], "#");
        n2 = new StringName("fau#de", "#");
        n1.concat(n2)
        expect(n1.asDataString()).toBe("oss.cs.fau.de");
    
        n1 = new StringArrayName(["oss\\.cs", "fau\\.de"]);
        n2 = new StringName("foo\\.bar.baz\\.bat");
        n1.concat(n2)
        expect(n1.asDataString()).toBe("oss\\.cs.fau\\.de.foo\\.bar.baz\\.bat");
    
        n1 = new StringArrayName([""]);
        n2 = new StringName("");
        n1.concat(n2)
        expect(n1.asDataString()).toBe(".");
    

        n1 = new StringArrayName(["oss.cs"], "#");
        n2 = new StringName("fau.de", "#");
        n1.concat(n2)
        expect(n1.asDataString()).toBe("oss\\.cs.fau\\.de");
    });
})