import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

/** List of jokes. */
function JokeList({ numJokesToGet = 5 }) {
	const [jokes, setJokes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	/* get jokes if there are no jokes */
	useEffect(
		function componentDidMount() {
			async function getJokes() {
				// load jokes one at a time, adding not-yet-seen jokes
				let j = [...jokes];
				let seenJokes = new Set();
				try {
					while (j.length < numJokesToGet) {
						let res = await axios.get(
							'https://icanhazdadjoke.com',
							{
								headers: {
									Accept: 'application/json',
								},
							}
						);
						let { ...joke } = res.data;

						if (!seenJokes.has(joke.id)) {
							seenJokes.add(joke.id);
							j.push({ ...joke, votes: 0 });
						} else {
							console.log('duplicate found!');
						}
					}

					setJokes(j);
					setIsLoading(false);
				} catch (err) {
					console.error(err);
				}
			}

			if (jokes.length === 0) getJokes();
		},
		[jokes, numJokesToGet]
	);

	/* empty joke list, set to loading state, and then call getJokes */

	function generateNewJokes() {
		setJokes([]);
		setIsLoading(true);
	}

	/* change vote for this id by delta (+1 or -1) */

	function vote(id, delta) {
		setJokes((allJokes) =>
			allJokes.map((j) =>
				j.id === id ? { ...j, votes: j.votes + delta } : j
			)
		);
	}

	// let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
	if (isLoading) {
		return (
			<div className="loading">
				<i className="fas fa-4x fa-spinner fa-spin" />
			</div>
		);
	}

	const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

	return (
		<div className="JokeList">
			<button
				className="JokeList-getmore"
				onClick={generateNewJokes}
			>
				Get New Jokes
			</button>

			{sortedJokes.map(({ joke, id, votes }) => (
				<Joke
					text={joke}
					key={id}
					id={id}
					votes={votes}
					vote={vote}
				/>
			))}
		</div>
	);
}
export default JokeList;
