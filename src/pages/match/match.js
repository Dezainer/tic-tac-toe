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
		setTimeout(() => {
			this.setState(prevState => {
				prevState.matrix[1][2] = 'X'
				return { matrix: prevState.matrix }
			})
		}, 1000)
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