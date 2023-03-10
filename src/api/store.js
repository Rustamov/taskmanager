export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey) || {});
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );

  }

  setItems(values) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(values)
    );
  }

  removeItem(key) {
    const store = this.getItems()

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
