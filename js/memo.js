class Memo {
  constructor(node, factory) {
    this.node = node;
    this.id = new Date().getTime();
    this.position = { top: 0, left: 0 };
    this.size = { width: 200, height: 100 };
    this.zIndex = 0;

    this.node.setAttribute("data-id", this.id);
    this.header = this.node.querySelector(".header");
    this._applyMoveHeader();

    this.textArea = this.node.querySelector(".textarea");
    this.setSize(this.size.width, this.size.height);
    this.text = this.textArea.innerText;
    this._bindTextArea();

    this._applySizeBtn();
    this._applyCloseBtn();

    this.factory = factory;
    this.factory.add(this);
  }

  static create(data, node, factory) {
    const { id, text, zIndex, position, size } = JSON.parse(data);
    const memo = new Memo(node, factory);
    memo.id = id;
    memo.setText(text);
    memo.setZIndex(zIndex);
    memo.setPosition(position.top, position.left);
    memo.setSize(size.width, size.height);
    return memo;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      text: this.text,
      zIndex: this.zIndex,
      position: this.position,
      size: this.size,
    });
  }

  setPosition(top, left) {
    this.node.style.top = `${top}px`;
    this.node.style.left = `${left}px`;
    this.position = { top, left };
  }

  setSize(width, height) {
    this.textArea.style.width = `${width}px`;
    this.textArea.style.height = `${height}px`;
    this.size = { width, height };
  }

  setZIndex(zIndex) {
    this.zIndex = zIndex;
    this.node.style.zIndex = zIndex;
  }

  setText(text) {
    this.text = text;
    this.textArea.innerText = text;
  }

  _active() {
    const prevZIndex = this.zIndex;
    this.factory.memoMap.forEach((memo) => {
      if (memo.id === this.id) {
        this.setZIndex(this.factory.memoMap.size);
      } else {
        if (memo.zIndex > prevZIndex) {
          memo.setZIndex(memo.zIndex - 1);
        }
      }
    });
  }

  _bindTextArea() {
    const textAreaChanged = (e) => {
      this.text = this.textArea.innerText;
    };
    this.textArea.addEventListener("keyup", textAreaChanged);
    this.textArea.addEventListener("paste", textAreaChanged);
    this.textArea.addEventListener("cut", textAreaChanged);
    this.textArea.addEventListener("delete", textAreaChanged);
  }

  _applyMoveHeader() {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    this.header.addEventListener("mousedown", (e) => {
      e = e || window.event;
      e.preventDefault();
      this._active();
      pos3 = e.clientX;
      pos4 = e.clientY;
      this.factory.container.onmousemove = elementDrag;
      this.factory.container.onmouseup = closeDragElement;
    });

    const elementDrag = (e) => {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      this.setPosition(this.node.offsetTop - pos2, this.node.offsetLeft - pos1);
    };

    const closeDragElement = () => {
      this.factory.container.onmouseup = null;
      this.factory.container.onmousemove = null;
    };
  }

  _applySizeBtn() {
    let top = 0,
      left = 0;

    const sizeBtn = this.node.querySelector(".btn_size");
    sizeBtn.addEventListener("mousedown", (e) => {
      e = e || window.event;
      e.preventDefault();
      const rect = this.textArea.getBoundingClientRect();
      top = rect.top;
      left = rect.left;
      this.factory.container.onmousemove = elementDrag;
      this.factory.container.onmouseup = closeDragElement;
    });

    const elementDrag = (e) => {
      e = e || window.event;
      e.preventDefault();
      const width = e.clientX - left;
      const height = e.clientY - top;
      this.setSize(width, height);
    };

    const closeDragElement = () => {
      this.factory.container.onmouseup = null;
      this.factory.container.onmousemove = null;
    };
  }

  _applyCloseBtn() {
    const closeBtn = this.node.querySelector(".btn_close");
    closeBtn.addEventListener("click", (event) => {
      this.remove();
    });
  }
}

export default Memo;
