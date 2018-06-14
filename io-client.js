import socketIo from 'socket.io-client';
const jq = require('node-jq')

export const io = (monitorClient, store) => {
	const sessionClient = socketIo('http://127.0.0.1:7079', { path: '/io3'});

	sessionClient.on('connect', function() {
		 sessionClient.emit('room', 'redux-backend:monitor');
	});

	monitorClient.on('history:fetch-state', (data) => {
		// console.log(`fetching state for ${data.label}`, history[data.label]);
		console.log(`fetching state for ${data.label}`);
		monitorClient.emit('history:fetch-state', store.history[data.label]);
	})
	monitorClient.on('history:clear', (data) => {
		store.history = {};
		console.log(`clearing history`, store);
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

		const label = `${data.timestamp};[BE] ${data.action.type}`;
		store.history[label] = data;
		monitorClient.emit('backend:state', {labels: Object.keys(store.history), ...data});
			
	});
};

