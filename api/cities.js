const { random } = require('lodash');

module.exports = (app, prefix)=>{
  app.get(`${prefix}/cities`, function(req, res) {
    res.json({
      errcode: random(0, 1),
      errmsg: ':)',
      result: [
        {id:0, name: 'London'},
        {id:1, name: 'Tokyo'},
        {id:2, name: 'Canberra'}
      ]
      // result: {
      //   route: '/',
      //   routeDelay: 60000,
      //   buttons: [
      //     {route: '/cities', label: '城', style: 'aaa'}
      //   ]
      // }
    });
  });
}