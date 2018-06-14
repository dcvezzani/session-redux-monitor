import socketIo from 'socket.io-client';
const jq = require('node-jq')

let history = {};

export const io = (monitorClient) => {
	const sessionClient = socketIo('http://127.0.0.1:7079', { path: '/io3'});

	sessionClient.on('connect', function() {
		 sessionClient.emit('room', 'redux-backend:monitor');
	});

	monitorClient.on('history:fetch-state', (data) => {
		// console.log(`fetching state for ${data.label}`, history[data.label]);
		console.log(`fetching state for ${data.label}`);
		monitorClient.emit('history:fetch-state', history[data.label]);
	})
	monitorClient.on('history:clear', (data) => {
		history = {};
		console.log(`clearing history`, history);
	});

	sessionClient.on('backend:state', (data) => {
		// console.log('redux-backend:monitor:backend:state', data);

		// jq.run('{timestamp, type: .action.type}', data, { input: 'json', output: 'json' }).then((json) => {
		// 	console.log(json);
		// })
		// jq.run('{state}', data, { input: 'json', output: 'json' }).then((json) => {
		// 	console.log(json);
		// })

		// jq.run('{action}', data, { input: 'json', output: 'pretty' }).then((formattedAction) => {
		// 	console.log(formattedAction);
		// })
		// monitorClient.emit('backend:state', {...data, action: formattedAction});

		const label = `${data.timestamp};${data.action.type}`;
		history[label] = data;
		monitorClient.emit('backend:state', {labels: Object.keys(history), ...data});
			
	});
};

