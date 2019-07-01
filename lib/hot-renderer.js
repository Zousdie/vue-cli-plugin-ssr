class HotRenderer {
  constructor() {
    this.serverBundle = null;
    this.clientManifest = null;
    this.callbackList = [];
  }

  addListener(callback) {
    if (typeof callback === 'function') {
      callback(this.serverBundle, this.clientManifest);
      this.callbackList.push(callback);
    }
  }

  dispatch() {
    this.callbackList.forEach((cb) => {
      if (typeof cb === 'function') cb(this.serverBundle, this.clientManifest);
    });
  }

  update(serverBundle, clientManifest) {
    this.serverBundle = serverBundle;
    this.clientManifest = clientManifest;
    this.dispatch();
  }
}

module.exports = HotRenderer;
