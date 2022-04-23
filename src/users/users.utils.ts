export const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const parseUsername = (username: unknown): string => {
	if (!username || !isString(username)) {
		throw new Error('Incorrect or missing username ' + username);
	}

	if (username.length < 5) {
		throw new Error('Username must be at least 5 characters');
	}
	return username;
};

const parseEmail = (email: unknown): string => {
	const regex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email || !isString(email) || !regex.test(email)) {
		throw new Error('Missing or invalid email ' + email);
	}
	return email;
};

export const parsePassword = (password: unknown): string => {
	if (!password || !isString(password)) {
		throw new Error('Incorrect or missing password ' + password);
	}
	if (password.length < 6) {
		throw new Error('Password must be at least 6 characters');
	}
	return password;
};

const toNewUser = ({
	username,
	email,
	password,
}: {
	username: unknown;
	email: unknown;
	password: unknown;
}) => {
	return {
		username: parseUsername(username),
		email: parseEmail(email),
		password: parsePassword(password),
	};
};

const throwError = (error: unknown) => {
	let errorMessage = 'Something went wrong. ';
	if (error instanceof Error) {
		errorMessage += 'Error: ' + error.message;
	}
	return {
		success: false,
		message: errorMessage
	};
};

export { toNewUser, throwError };
