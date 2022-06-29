import { getConnection } from '$lib/utils/getConnection';

export async function get({ params }) {
	// `params.id` comes from [id].js
	const id = params;

	const connection = getConnection();

	connection.socket?.emit('join room', id);

	if (id) {
		return {
			body: { id }
		};
	}

	return {
		status: 404
	};
}
