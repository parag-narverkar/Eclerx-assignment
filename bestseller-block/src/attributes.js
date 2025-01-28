const attributes = {
    selectedCategory: { type: 'string', default: '' },
    selectedBookId: { type: 'string', default: '' },
    selectedBookTitle: { type: 'string', default: '' },
    selectedBookCover: { type: 'string', default: '' },
    selectedBookAmazonLink: { type: 'string', default: '' },
    selectedBookAuthors: { type: 'array', default: [] },
    blockTitle: { type: 'string', default: 'Bestsellers' },
};

export default attributes;
