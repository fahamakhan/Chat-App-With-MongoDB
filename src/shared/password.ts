import { hash, compare } from 'bcrypt';

export async function hashPassword(password: string): Promise<string>{
	const passwordHash = await (new Promise<string>((resolve, reject) => {
		hash(password, 10, (err, hash) => {
			if(err) reject(err);
			else resolve(hash);
		});
	}));
	return passwordHash;
}

/**
* Return boolean if plain text string matches bcrypt hash
*/
export async function checkPassword(password: string, passwordHash: string): Promise<boolean>{
	const isMatch = await (new Promise<boolean>((resolve, reject) => {
		compare(password, passwordHash, (err, res) => {
			if(err) reject(err);
			else resolve(res)
		});
	}));
	return isMatch;
}
