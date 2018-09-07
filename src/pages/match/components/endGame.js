import React from 'react'

const EndGame = props => (
	<div className={`end-game ${
		props.symbol
	} ${ 
		props.active ? 'active' : '' 
	}`}>
		<h2>{ props.won ? winnerMessage : looserMessage }</h2>
	</div>
)

const winnerMessage = 'VOCÊ GANHOU'
const looserMessage = 'VOCÊ PERDEU'

export default EndGame