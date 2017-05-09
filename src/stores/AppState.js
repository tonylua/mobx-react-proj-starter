import { observable, action } from 'mobx';

//just demo, you can delete it
const init_time = new Date;
setInterval(()=>AppState.now_time=new Date, 1000);

let AppState = observable({
	//just demo, you can delete it
	now_time: new Date,
	get run_time() {
		return parseInt(.001 * (this.now_time.getTime() - init_time.getTime()))
	},

	//required, do not delete
	history: null,
	initRouter: action.bound(function(router) {
		if (router) {
			this.history = router.history;
			console.log('app init', this.history);
		}
	}),
	requesting: false,
	setRequesting: action.bound(function(bool) {
		this.requesting = bool;
	}),
});

export default AppState;