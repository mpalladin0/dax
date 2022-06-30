export async function get({ params }) {
	// `params.id` comes from [id].js
	const roomId = params.room;

	// const connection = getUser();
	// connection.socket?.emit('join room', roomId);

	if (roomId) {
		return {
			body: { roomId }
		};
	}

	return {
		status: 404
	};
}
