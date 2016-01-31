import React from 'react';
import i18next from 'i18next';
import LanStore from '../stores/LanStore.es6';

export default class Message extends React.Component {

	static t(k){
		return i18next.t(k)
	}

	componentDidMount() {
		this.unsubscribe = LanStore.listen(this.changeLanguage.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	changeLanguage(lan){
		this.forceUpdate()
	}


	render(){
		let w=i18next.t(this.props.k,this.props);
		
		return <span className={this.props.className}>{w}</span>		
	}
}

