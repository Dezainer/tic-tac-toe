import React from 'react'

const EndScreen = props => (
	<div className={`end-game ${
		props.symbol
	} ${ 
		props.active ? 'active' : '' 
	}`}>
		<h2>{ props.message }</h2>
		<button onClick={ props.onClick }>Jogar Novamente</button>
	</div>
)

export default EndScreen