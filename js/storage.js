const MEMO = "MEMO";

class Storage {
  static hasMemo() {
    return Boolean(Storage.loadMemo());
  }

  static saveMemo(data) {
    localStorage.setItem(MEMO, JSON.stringify(data));
  }

  static loadMemo() {
    return JSON.parse(localStorage.getItem(MEMO));
  }
}

export default Storage;
