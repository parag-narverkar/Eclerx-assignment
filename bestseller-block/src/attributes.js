const attributes = {
    selectedCategory: {
        type: 'string',
        default: '',
    },
    selectedBookId: { // Save the work ID
        type: 'string',
        default: '',
    },
    selectedBookTitle: { // Save the book title
        type: 'string',
        default: '',
    },
    selectedBookCover: {
        type: 'string',
        default: '',
    },
    selectedBookAuthors: {
        type: 'array',
        default: [],
    },
    selectedBookAmazonLink: {
        type: 'string',
        default: '',
    },
    blockTitle: {
        type: 'string',
        default: 'Bestsellers',
    },
    additionalImage: {
        type: 'string',
        default: '',
    },
};

export default attributes;
