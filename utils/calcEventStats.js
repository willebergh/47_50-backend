const calcEventStats = ({ activeTickets, ticketPrice }) => ({
	getStats: () => ({
		ticketsSold: activeTickets.length,
		grossIncome: activeTickets.length * ticketPrice,
		pricePool: (activeTickets.length * ticketPrice) / 2,
		uniqePlayers: new Set(activeTickets.map((x) => x.player)).length,
	}),
	getWinner: () => {
		const winnerIndex = Math.round(Math.random() * activeTickets.length);
		const winnerPlayer = activeTickets[winnerIndex].player;
		return winnerPlayer;
	},
});

module.exports = calcEventStats;
