import React from 'react'
import './match.css'

import Slot from './components/slot'
import EndScreen from './components/endScreen'
import Status from './components/status'
import NicknameInput from './components/nicknameInput'

export default class Match extends React.Component {

	state = { nickname: '' }
	id = 'asd'
	ip = '192.168.1.132'

	componentDidMount() {
		this.createConnection()
	}

	createConnection() {
		this.ws = new WebSocket(`ws://${ this.ip }:3000/cable`)
		this.ws.onmessage = e => this.handleData(JSON.parse(e.data))
	}

	subscribeToChannel() {
		this.ws.send(JSON.stringify({
			command: 'subscribe',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id,
				client: this.state.nickname
			})
		}))
	}

	startGame() {
		this.ws.send(JSON.stringify({
			command: 'message',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id,
				client: this.state.nickname
			}),
			data: JSON.stringify({
				action: 'start_game',
			})
		}))
	}

	restartGame() {
		this.ws.close()
		this.createConnection()
	}

	handleData(data) {
		if (data.type === 'confirm_subscription')
			this.startGame()

		if (!data.message || !data.message.game)
			return

		let{ game } = data.message

		if (this.state.nickname && game.players[this.state.nickname])
			game.symbol = game.players[this.state.nickname]

		this.setState(game)
	}

	makePlay(i, j) {
		this.ws.send(JSON.stringify({
			command: 'message',
			identifier: JSON.stringify({
				channel: 'MatchChannel',
				id: this.id,
				client: this.state.nickname
			}),
			data: JSON.stringify({
				action: 'make_play',
				play: { i, j, symbol: this.state.symbol }
			}),
		}))
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

	getMatch() {
		return (
			<div>
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
			</div>
		)
	}

	getNicknameInput() {
		return (
			<NicknameInput
				value={ this.state.nickname }
				onChange={ nickname => this.setState({ nickname }) }
				onSubmit={ () => this.subscribeToChannel() }
			/>
		)
	}

	render() {
		return (
			<main>
				{ this.state.plays ? this.getMatch() : this.getNicknameInput() }
			</main>
		)
	}
}