export const getSavedBookIds = (): string[] => {
	const saved = localStorage.getItem('saved_books');
	return saved ? JSON.parse(saved) : [];
};

export const saveBookIds = (bookIdArr: string[]) => {
	if (bookIdArr.length) {
		localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
	} else {
		localStorage.removeItem('saved_books');
	}
};

export const removeBookId = (bookId: string) => {
	const saved = localStorage.getItem('saved_books');
	if (!saved) return false;
	const savedBookIds = JSON.parse(saved) as string[];
	const updatedSavedBookIds = savedBookIds.filter((id) => id !== bookId);
	localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));
	return true;
};
