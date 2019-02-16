module.exports = {
  init(app){
    const staticRoutes = require("../routes/static");
    app.use(staticRoutes);
  }
}

module.exports = {
  init(app){
    const marcoRoutes = require("../routes/marco");
    app.use(marcoRoutes);
  }
}