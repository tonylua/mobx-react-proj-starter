import 'whatwg-fetch';
import Promise from 'native-promise-only';
import { delay, isObject, extend } from 'lodash';
import { mock_prefix } from '../../dev.server';
import AppState from '../stores/AppState';

export const isBadRequest = status=>(status>=400 && status<=600);
export const isValidCode = code=>{
	let c = parseInt(code); return (!isNaN(c)) && (c == 0)
};

export default {
	request: method=>(url, params, errCallback)=>{
		AppState.setRequesting(true);

		let reqUrl = `${mock_prefix}${url}`;
		// if (AppState.config) {
		// 	const rp = AppState.config.requests_proxy;
		// 	if (!isObject(rp)) return;
		// 	let re = null;
		// 	for (let k in rp) {
		// 		re = new RegExp(k);
		// 		if (re.test(url)) {
		// 			reqUrl = url.replace(re, rp[k]);
		// 			console.log(`request: ${url} --> ${reqUrl}`)
		// 			break;
		// 		}
		// 	}
		// }

		let reqObj = {
			method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: params ? JSON.stringify(params) : null,
			credentials: 'include'
		};
		if (reqObj.body === null) delete reqObj.body;
		const req = new Request(reqUrl, reqObj);

		const _err = (msg, res) => {
			if (typeof errCallback === 'function') 
				errCallback(msg, res);
			else
				AppState.history.push(`/msg/`, {
					message: `request failure ${msg ? ', '+msg : ''}`,
					response: res
				})
			AppState.setRequesting(false);
		};
		console.log(`[fetch] ${req.method} ${req.url}`);

		return fetch(req)
			.then(res=>{
				if (isBadRequest(res.status)) {
					let ex = `state: ${res.status}`;
					_err(ex, res);
					throw new Error(ex);
				}
				return res.json();
			}).then(json=>{
				let {errcode, errmsg, result} = json;
				if ('route' in result) {
					let {route} = result;
					delay(
						/^(https?\:)?\/{2}/.test(route)
							? ()=>location.href=route
							: ()=>AppState.history.push(route),
						'routeDelay' in result 
							? result.routeDelay 
							: 0
					);
				}
				if ('app_nav' in result && isObject(result.app_nav)) {
					AppState.setNav(result.app_nav);
				}
				if (!isValidCode(errcode)) {
					let ex = `bussiness logic wrong (${errcode} "${errmsg}")`;
					_err(ex, {result});
					throw new Error(ex);
				}
				AppState.setRequesting(false);
				return result;
			})/*.catch(ex=>{
				console.warn(ex.message);
				AppState.setRequesting(false);
			})*/;
	},
	get(...args) {
		return this.request('GET')(...args);
	},
	post(...args) {
		return this.request('POST')(...args);
	},
	sequence(reqPromises, autoMerge=true) {
		let results = [];
		return reqPromises.reduce(
			(promise, req)=>promise.then(
				()=>req.then(result=>results.push(result)).catch(ex=>Promise.reject(ex))
			), Promise.resolve()
		).then(
			()=>autoMerge
				? results.reduce((rst, curr)=>extend(rst, curr), {})
				: results
		);
	}
}