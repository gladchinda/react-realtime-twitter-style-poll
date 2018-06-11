import React from 'react';

const ChoosePersona = props => {

	const { people = [], count = 5, onSelected = f => f } = props;

	const choosePersona = id => evt => onSelected(id);

	const randomPeople = count => people => {

		let i = 0;
		const selected = [];

		count = Math.max(0, Math.min(count, people.length));

		while (i < count) {
			const index = Math.floor(Math.random() * people.length);
			if (selected.includes(index)) continue;
			++i && selected.push(index);
		}

		return selected.map(index => {
			const { id, name } = people[index];

			return <button key={index} className="btn btn-secondary mx-1 my-2 px-4 text-center font-weight-bold button--persona" onClick={choosePersona(id)}>{name}</button>
		});

	};

	return (
		<div className="position-absolute w-100 h-100 px-3 pb-5 d-flex flex-wrap align-items-center align-content-center justify-content-center absolute--full-height">
			<span className="h3 text-dark text-center py-3 w-100 font-weight-bold">Choose your Persona</span>
			{ randomPeople(count)(people) }
		</div>
	);
};

export default ChoosePersona;
