import { isString } from '../users/users.utils';

const parseTitle = (title: unknown): string => {
	if (!title || !isString(title)) {
		throw new Error('Incorrect or missing title');
	}
	return title;
};

export const parseContent = (content: unknown): string => {
	if (!content || !isString(content)) {
		throw new Error('Invalid or missing content ' + content);
	}
	return content;
};

const parseImageUrl = (url: unknown): string => {
	if (!url || !isString(url)) {
		throw new Error('Invalid or missing image url ' + url);
	}
	return url;
};

const toNewPost = ({
	title,
	content,
	imageUrl,
}: {
	title: unknown;
	content: unknown;
	imageUrl: unknown;
}) => {
	return {
		title: parseTitle(title),
		content: parseContent(content),
		imageUrl: parseImageUrl(imageUrl),
	};
};

export { toNewPost };
