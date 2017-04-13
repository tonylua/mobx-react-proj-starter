module.exports = (app, prefix)=>{
  app.post(`${prefix}/some/other/path`, function(req, res) {
    res.json({ hello: 'world!' });
  });
}