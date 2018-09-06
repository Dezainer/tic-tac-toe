import React from 'react'
import Slot from './components/slot'
import './match.css'

export default class Match extends React.Component {

	state = {
		matrix: [
			['O', 'O', 'O'],
			['O', 'X', null],
			[null, 'X', 'X']
		]
	}

	componentDidMount() {
		let ws = new WebSocket('ws://localhost:3000?id=asd')
		ws.onmessage = e => this.handleData(JSON.parse(e.data))
	}

	handleData(data) {
		data.error
			? this.handleError(data.errorData)
			: this.handleSuccess(data)
	}

	handleError(error) {
		console.log('error')
		console.dir(error, { depth: null })
	}

	handleSuccess(data) {
		console.log('success')
		console.log(data)
	}

	getMatrix() {
		return this.state.matrix.map((row, i) => row.map((symbol, j) => (
			<Slot 
				key={ i + j }
				i={ i }
				j={ j }
				symbol={ symbol }
			/>
		)))
	}
	
	render() {
		return (
			<main>
				<div className="matrix">
					{ this.getMatrix() }
				</div>
			</main>
		)
	}
}