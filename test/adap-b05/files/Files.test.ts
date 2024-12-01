import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { Link } from "../../../src/adap-b05/files/Link";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";

function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
  it("test name checking", () => {
    let fs: RootNode = createFileSystem();
    let ls: Node = [...fs.findNodes("ls")][0];
    expect(ls.getFullName().isEqual(new StringName("/usr/bin/ls", '/')));
  });
});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch(er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex instanceof ServiceFailureException).toBeTruthy();
      expect(ex.hasTrigger()).toBeTruthy();
      let tx: Exception = ex.getTrigger();
      expect(tx instanceof InvalidStateException).toBeTruthy();
    }
    expect(threwException).toBeTruthy();
  });
});

describe("findNodes test", () => {
  it("basic file findNodes", () => {
      let n = new RootNode();
      let f = new File("file", n);
      expect(f.findNodes("file")).toStrictEqual(new Set<Node>([f]));
      expect(n.findNodes("file")).toStrictEqual(new Set<Node>([f]));
  });
  it("basic directory findNodes", () => {
      let n = new RootNode();
      let d = new Directory("directory", n);
      expect(d.findNodes("directory")).toStrictEqual(new Set<Node>([d]));
      expect(n.findNodes("directory")).toStrictEqual(new Set<Node>([d]));
  });
  it("directory findNodes", () => {
      let n = new RootNode();
      let d = new Directory("directory", n);
      let f1 = new File("file1", d);
      let f2 = new File("file2", d);
      expect(d.findNodes("file1")).toStrictEqual(new Set<Node>([f1]));
  });
  it("directory findNodes duplicate", () => {
      let n = new RootNode();
      let d = new Directory("directory", n);
      let f1 = new File("file", d);
      let f2 = new File("file", d);
      expect(d.findNodes("file")).toStrictEqual(new Set<Node>([f1, f2]));
  });
  it("directory findNodes tree", () => {
      let n = new RootNode();
      let d1 = new Directory("directory1", n);
      let f1 = new File("file1", d1);
      let f2 = new File("file2", d1);
      let d2 = new Directory("directory2", n);
      let f3 = new File("file3", d2);
      let f4 = new File("file4", d2);
      let d3 = new Directory("directory3", d2);
      let f5 = new File("file5", d3);
      let f6 = new File("file6", d3);
      expect(d2.findNodes("file6")).toStrictEqual(new Set<Node>([f6]));
      expect(n.findNodes("file6")).toStrictEqual(new Set<Node>([f6]));
  });
  it("directory findNodes tree2", () => {
      let n = new RootNode();
      let d1 = new Directory("directory1", n);
      let f1 = new File("file", d1);
      let d2 = new Directory("directory2", n);
      let f2 = new File("file", d2);
      let d3 = new Directory("directory3", d2);
      let f3 = new File("file", d3);
      expect(n.findNodes("file")).toStrictEqual(new Set<Node>([f1, f2, f3]));
  });
  it("link findNodes tree2", () => {
    let n = new RootNode();
    let d1 = new Directory("directory1", n);
    let f1 = new File("file1", d1);
    let d2 = new Directory("directory2", n);
    let f2 = new File("file2", d2);
    let d3 = new Directory("directory3", d2);
    let l1 = new Link("link", d3, d1);
    expect(n.findNodes("link")).toStrictEqual(new Set<Node>([]));
    expect(n.findNodes("directory1")).toStrictEqual(new Set<Node>([d1, l1]));
    expect(d3.findNodes("directory1")).toStrictEqual(new Set<Node>([l1]));
    expect(d3.findNodes("file1")).toStrictEqual(new Set<Node>([]));
  });
});
