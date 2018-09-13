import React from 'react'

const NicknameInput = props => (
	<div className="X">
		<input 
			autoFocus
			placeholder="Nickname" 
			value={ props.value } 
			onChange={ e => props.onChange(e.target.value) } 
		/>
		<button onClick={ props.onSubmit }>Iniciar</button>
	</div>
)

export default NicknameInput