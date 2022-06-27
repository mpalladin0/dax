import { browser } from '$app/env';
import { Connection as MakeConnection } from '../Connection';

export const getConnection = (url?: string) => {
	if (browser)
		return new MakeConnection(url ?? 'https://dax.server.michaelpalladino.io') as MakeConnection;
	else throw new Error('Connection can only be used in browser');
};
