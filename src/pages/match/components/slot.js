import React from 'react'

export default class Slot extends React.Component {

	handleClick() {
		if(this.props.symbol) return
	}

	render() {
		return (
			<div 
				className={ `slot ${ !this.props.symbol ? 'empty' : '' }` }
				onClick={ () => this.handleClick() }
			>
				<div className={ `symbol ${ this.props.symbol }` }/>
			</div>
		)
	}
}