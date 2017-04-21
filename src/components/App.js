import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Link } from 'react-router-dom';
import { observable } from 'mobx';
import { Provider, observer, inject } from 'mobx-react';

import NotFound from './NotFound';
import store from '../stores';
import styles from './App.less';
import img1 from '../images/1.jpg';

const App = observer(() => 
  <Provider store={store}>
  	<Router ref={store.AppState.initRouter}>
  	<div className={styles.app}>
  	  {
  	  	store.AppState.requesting ? <div className={styles.loading}>loading...</div> : null
  	  }
	  <header>
	    <time>app is running {store.AppState.run_time}s</time>
	    <ul>
			<li><NavLink exact to="/" activeClassName={styles.current}>main</NavLink></li>
			<li><NavLink exact to="/cities" activeClassName={styles.current}>cities</NavLink></li>
			<li><NavLink to="/somewhere" activeClassName={styles.current}>somewhere</NavLink></li>
	    </ul>
	  </header>
	  <div className={styles.mainbox}>
		  <Switch>
		    {/*demo Components*/}
			<Route exact path="/" 
				render={({match})=><div>{`main page: ${match.url}`}</div>} />
			<Route exact path="/cities" component={Cities} />
			
			{/*required Components*/}
			<Route path="/msg" component={NotFound} />
			<Route component={NotFound} />
		  </Switch>
	  </div>
	  <footer>
	    <img className={styles['app-img']} src={img1} />
	    <Link to="/" data-tooltip="~back to main~" className={"tooltip " + styles.tooltip}>back to main</Link>
	  </footer>
	</div>
  </Router>
</Provider>
);

const Cities = inject('store')(observer(
	class Cities extends Component {
		componentDidMount() {
			const {getAll} = this.props.store.CityState;
			getAll();
		}
		render() {
			let {selected, changeCity, cityInfo, cities} = this.props.store.CityState;
			return <div>
				<h2>cities:</h2>
				{
					cities && cities.length 
						? <ul>{
							cities.map((city,idx)=>(
								<City key={idx} data={city} changeCity={changeCity} />
							))
						}</ul>
						: null
				}
				{selected
					? <p>selected: {cityInfo}</p>
					: null}
			</div>;
		}
	}
));

const City = ({data, changeCity}) => (
	<li><a href="javascript:;" onClick={e=>changeCity(data)}>{data.name}</a></li>
);

export default App;