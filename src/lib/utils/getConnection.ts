import { browser } from '$app/env';
import { Connection as MakeConnection } from '../Connection';

export const getConnection = ({ url }: { url: string }) => {
	if (browser) return new MakeConnection(url);
	else return null;
};
