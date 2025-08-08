import { JSDOM } from "jsdom";
import { hyperstatic } from "../mod.js";

const dom = new JSDOM();

export const React = hyperstatic(new dom.window.Document());

export default React;
