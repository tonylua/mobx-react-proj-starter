import { observable, action, runInAction } from 'mobx';
import requestUtil from '../utils/request';

export default observable({
	cities: [],
	selected: null,
	get cityInfo() {
		return this.selected ? `[${this.selected.id}] ${this.selected.name}` : 'none';
	},
	getAll: action.bound(function() {
		requestUtil.get('/cities').then(rst=>{
			runInAction(
				()=>this.cities=rst
			)
		});
	}),
	changeCity: action.bound(function(city) {
		this.selected = city;
	})
});