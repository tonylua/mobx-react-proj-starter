import 'whatwg-fetch';
import { bind, delay } from 'lodash';
// import { resolve as PromiseResolve } from 'native-promise-only';
import { mock_prefix } from '../../dev.server';
import AppState from '../stores/AppState';

export const isBadRequest = status=>(status>=400 && status<=600);
export const isValidCode = code=>{ let c = parseInt(code); return (!isNaN(c)) && (c == 0) };

export default {
	request: method=>(url, params, errCallback)=>{
		AppState.setRequesting(true);

		const req = new Request(`${mock_prefix}${url}`, {
			method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: params ? JSON.stringify(params) : null,
			credentials: 'include'
		});
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
				if (!isValidCode(errcode)) {
					let ex = `bussiness logic wrong (${errcode} "${errmsg}")`;
					_err(ex, {result});
					throw new Error(ex);
				}
				AppState.setRequesting(false);
				return result;
			}).catch(ex=>{
				console.warn(ex.message);
			});
	},
	get(...args) {
		return this.request('GET')(...args).catch(err=>{});
	},
	post(...args) {
		return this.request('POST')(...args).catch(err=>{});
	},

}