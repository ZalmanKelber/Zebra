const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api", "/user", "/posts", "/comments", "/auth/google"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    }));
};
