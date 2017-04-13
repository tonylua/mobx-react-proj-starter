module.exports = (app, prefix)=>{
  app.get(`${prefix}/some/path`, function(req, res) {
    res.json({
    	custom: 'response',
    	img1: '/images/mobx.png',
    	img2: '/images/notexist.gif',
    });
  });
}