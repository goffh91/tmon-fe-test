"use strict";

import Memo from "./memo.js";
import MemoFactory from "./factory.js";
import Storage from "./storage.js";

const memoTemplate = document.querySelector("template#memo").content;
const container = document.querySelector(".wrap");
const factory = new MemoFactory(container, memoTemplate);

window.addEventListener("load", () => {
  if (Storage.hasMemo()) {
    Storage.loadMemo().forEach((memoData) => {
      factory.create(memoData);
    });
  }

  container.addEventListener(
    "contextmenu",
    (event) => {
      event.preventDefault();
      factory.createAt(event.offsetY, event.offsetX);

      return false;
    },
    false
  );
});

window.addEventListener("unload", () => {
  const memoData = factory.toData();
  Storage.saveMemo(memoData);
});

window.factory = factory;