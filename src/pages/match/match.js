import React from 'react'
import './match.css'

import Slot from './components/slot'
import EndScreen from './components/endScreen'
import Status from './components/status'

export default class Match extends React.Component {

	state = {
		client: ''
	}
	id = 'asd'

	componentDidMount() {
		this.ws = new WebSocket('ws://192.168.1.132:3000/cable')
		this.ws.onmessage = e => this.handleData(JSON.parse(e.data))
		// this.ws.onmessage = e => console.log(e.data)
		this.ws.onopen = () => this.subscribeChannel()
	}

	subscribeChannel() {
		const msg = {
			command: 'subscribe',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id
			})
		}
		this.ws.send(JSON.stringify(msg))
	}

	startGame() {
		const msg = {
			command: 'message',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id
			}),
			data: JSON.stringify({
				action: 'start_game',
				client: this.state.client
			})
		}
		this.ws.send(JSON.stringify(msg))
	}

	handleData(data) {
		if (!data.message || !data.message.game) {
			return
		}

		const { game } = data.message

		if (this.state.client && game.players[this.state.client]) {
			game.symbol = game.players[this.state.client]
		}
		this.setState({ ...game})
	}

	makePlay(i, j) {

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
		let { plays, winner, symbol, turn, ready } = this.state
		return plays.map((row, i) => row.map((item, j) => (
			<Slot
				key={ i + j }
				symbol={ item }
				blocked={ winner || turn != symbol || !ready }
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
		if(!this.state.ready)
			return 'Aguardando adversário entrar na sala'

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
						onClick={ () => this.startGame() }
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
			: (
				<div>
					<input placeholder="Nickname" value={this.state.client} onChange={e => this.setState({client: e.target.value})} />
					<button onClick={() => this.startGame()}>Iniciar</button>
				</div>
			)
	}
}