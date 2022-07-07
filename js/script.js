"use strict";

import Memo from "./memo.js";
import Storage from "./storage.js";

const memoMap = new Map();
const container = document.querySelector(".wrap");
const memoTemplate = document.querySelector("template#memo");

function createMemo(top, left) {
  const node = memoTemplate.content.cloneNode(true).querySelector(".memo");
  const memo = new Memo(node, container, memoMap);
  memo.setPosition(top, left);
  memo.append();
}

window.addEventListener("load", function () {
  if (Storage.hasMemo()) {
    Storage.loadMemo().forEach((memoData) => {
      const node = memoTemplate.content.cloneNode(true).querySelector(".memo");
      const memo = Memo.create(memoData, node, container, memoMap);
      memo.append();
    });
  }

  container.addEventListener(
    "contextmenu",
    function (event) {
      event.preventDefault();
      createMemo(event.offsetY, event.offsetX);

      return false;
    },
    false
  );
});

window.addEventListener("unload", () => {
  const memoData = [];
  memoMap.forEach((memo) => {
    memoData.push(memo.serialize());
  });
  Storage.saveMemo(memoData);
});
