class HotRenderer {
  constructor() {
    this.serverBundle = null;
    this.clientManifest = null;
    this.clientPage = null;
    this.callbackList = [];
  }

  addListener(callback) {
    if (typeof callback === 'function') {
      callback(this.serverBundle, this.clientManifest, this.clientPage);
      this.callbackList.push(callback);
    }
  }

  dispatch() {
    this.callbackList.forEach((cb) => {
      if (typeof cb === 'function') cb(this.serverBundle, this.clientManifest, this.clientPage);
    });
  }

  update(serverBundle, clientManifest, clientPage) {
    this.serverBundle = serverBundle;
    this.clientManifest = clientManifest;
    this.clientPage = clientPage;
    this.dispatch();
  }
}

module.exports = HotRenderer;
