import React from 'react'
import './match.css'

import Slot from './components/slot'
import EndGame from './components/endGame'

export default class Match extends React.Component {

	state = {
		game: {
			plays: [
				[null, null, null],
				[null, null, null],
				[null, null, null]
			]
		}
	}

	id = 'asd'

	componentDidMount() {
		this.ws = new WebSocket('ws://localhost:3000?id='+this.id)
		this.ws.onmessage = e => this.handleData(JSON.parse(e.data))
	}

	handleData(data) {
		data.error
			? this.handleError(data.errorData)
			: this.handleSuccess(data)
	}

	handleError(error) {
		console.log('error')
	}

	handleSuccess(data) {
		this.setState(data)
	}

	makePlay(i, j) {
		this.ws.send(JSON.stringify({
			id: this.id,
			play: { i, j, symbol: this.state.symbol }
		}))
	}

	getMatrix() {
		return this.state.game.plays.map((row, i) => row.map((symbol, j) => (
			<Slot 
				key={ i + j }
				i={ i }
				j={ j }
				symbol={ symbol }
				blocked={ this.state.winner }
				onClick={ () => this.makePlay(i, j) }
			/>
		)))
	}
	
	render() {
		return (
			<main>
				<EndGame
					active={ this.state.winner }
					symbol={ this.state.symbol }
					won={ this.state.winner == this.state.symbol }
				/>
				<div className="matrix">
					{ this.getMatrix() }
				</div>
			</main>
		)
	}
}