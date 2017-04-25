# mobx-react-proj-starter 

> mobx+react+react_router_4+webpack2+mock_api

## scripts

- dev
    + `npm start` - hot reload & start devServer (http://127.0.0.1:8080)
    + `npm run mock` - start a mock api server
    + `npm run build` - build to /dist
- prod
    + `npm run preview` - start a server under /dist(http://127.0.0.1:8080)

## mock api

```json
{
    errcode: random(0, 1), // 0 - valid, not 0 - invalid 
    errmsg: ':)', // message
    result: any // business logic
}
```

```json
{
    errcode: random(0, 1),
    errmsg: ':)',
    result: {
        route: '/some/where', //optional - auto route after response
        routeDelay: 3000, //optional
        buttons: [ //optional - render buttons in /msg
            {route, label, style?},
            ...
        ]
    }
}
```

```javascript
import requestUtil from '../utils/request';

requestUtil.get('/cities').then(result=>{
    //result in response
});

requestUtil.post('/cities', data).then(result=>{
    //result in response
});
```

## Troubleshooting

### Error: dyld: Library not loaded

When running `npm start`, you get this error...

```
Module build failed: Error: dyld: Library not loaded: /usr/local/opt/libpng/lib/libpng16.16.dylib
  Referenced from: /path/to/front-end-stack/node_modules/mozjpeg/vendor/cjpeg
  Reason: image not found
```

To fix it, run `brew install libpng` ... [ref](https://raw.githubusercontent.com/choonchernlim/front-end-stack/master/README.md)