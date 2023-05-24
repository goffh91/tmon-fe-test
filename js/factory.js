import Memo from "./memo.js";

class MemoFactory {
  constructor(container, template) {
    this.memoMap = new Map();
    this.container = container;
    this.template = template;
  }

  toData() {
    return Array.from(this.memoMap.values()).map((memo) => memo.serialize());
  }

  create(data) {
    const node = this.template.cloneNode(true).querySelector(".memo");
    if (data) {
      Memo.create(data, node, this);
    } else {
      new Memo(node, this);
    }
  }

  createAt(top, left) {
    const node = this.template.cloneNode(true).querySelector(".memo");
    const memo = new Memo(node, this);
    memo.setPosition(top, left);
  }

  add(memo) {
    this.memoMap.set(memo.id, memo);
    memo.setZIndex(this.memoMap.size + 1);
    this.container.appendChild(memo.node);
  }

  remove(id) {
    this.container.removeChild(this.memoMap.get(id));
    this.memoMap.delete(this.id);
  }
}

export default MemoFactory;
