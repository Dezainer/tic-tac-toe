import React from 'react'

const Status = props => (
	<div className={ `status ${ props.symbol ? props.symbol : '' }` }>
		<h1>JOGO DA VELHA</h1>
		<h4>{ props.message }</h4>
	</div>
)

export default Status