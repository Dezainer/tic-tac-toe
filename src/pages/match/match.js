import React from 'react'
import './match.css'

import Slot from './components/slot'
import EndScreen from './components/endScreen'
import Status from './components/status'

export default class Match extends React.Component {

	state = {
		symbol: 'X'
	}
	id = 'asd'

	componentDidMount() {
		this.ws = new WebSocket('ws://192.168.1.107:3000/cable')
		this.ws.onmessage = e => this.handleData(JSON.parse(e.data))
		// this.ws.onmessage = e => console.log(e.data)
		this.ws.onopen = () => this.subscribeChannel()
	}

	subscribeChannel() {
		const msg = {
			command: 'subscribe',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id,
				client: this.client
			})
		}
		this.ws.send(JSON.stringify(msg))
		this.startGame()
	}

	startGame() {
		const msg = {
			command: 'message',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id
			}),
			data: JSON.stringify({
				action: 'get_game'
			})
		}
		this.ws.send(JSON.stringify(msg))
	}

	restartGame() {
		this.ws.close()
		this.startGame()
	}

	handleData(data) {
		if (data.error) {
			console.log(data.errorData)
			return
		}

		if (data.type === 'confirm_subscription') {
			this.startGame()
			return
		}
		// console.log(data)
		const game = data.message
		this.setState({ ...game})
	}

	makePlay(i, j) {
		// this.ws.send(JSON.stringify({
		// 	id: this.id,
		// 	play: { i, j, symbol: this.state.symbol }
		// }))

		const msg = {
			command: 'message',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id
			}),
			data: JSON.stringify({
				action: 'make_play',
				play: { i, j, symbol: this.state.symbol }
			}),
		}
		this.ws.send(JSON.stringify(msg))
	}

	getMatrix() {
		let { plays, winner, symbol, turn } = this.state
		return plays.map((row, i) => row.map((item, j) => (
			<Slot
				key={ i + j }
				symbol={ item }
				blocked={ winner || turn != symbol }
				onClick={ () => this.makePlay(i, j) }
			/>
		)))
	}

	getEndScreenMessage() {
		if(this.state.winner == 'none')
				return 'EMPATE'

		if(this.state.winner == this.state.symbol)
			return 'VOCÊ GANHOU'

		return 'VOCÊ PERDEU'
	}

	getStatus() {
		// if(!this.state.game.isReadyToPlay)
		// 	return 'Aguardando adversário entrar na sala'

		if(this.state.turn == this.state.symbol)
			return 'Sua vez de jogar'

		return 'Aguardando a jogada do adversário'
	}

	render() {
		console.log(this.state)
		return this.state.plays
			? (
				<main>
					<EndScreen
						active={ this.state.winner }
						symbol={ this.state.symbol }
						message={ this.getEndScreenMessage() }
						onClick={ () => this.restartGame() }
					/>
					<div className="content">
						<Status
							symbol={ this.state.symbol }
							message={ this.getStatus() }
						/>
						<div className="matrix">
							{ this.getMatrix() }
						</div>
					</div>
				</main>
			)
			: null
	}
}