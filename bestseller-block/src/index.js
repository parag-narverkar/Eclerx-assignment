import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('my-block/category-book-selector', {
    title: 'Bestseller Block',
    category: 'widgets',
    icon: 'book',
    attributes: {
        selectedCategory: {
            type: 'string',
            default: '',
        },
        selectedBook: {
            type: 'string',
            default: '',
        },
        selectedBookCover: {
            type: 'string',
            default: '',
        },
    },
    edit: Edit,
    save: ({ attributes }) => {
        const { selectedCategory, selectedBookCover } = attributes;

        // Render selected category and book cover image
        return (
            <div>
                <p><strong>Selected Genre:</strong> {selectedCategory || 'None'}</p>
                {selectedBookCover ? (
                    <img
                        src={selectedBookCover}
                        alt="Selected Book Cover"
                        style={{ maxWidth: '200px', height: 'auto' }}
                    />
                ) : (
                    <p><strong>No book cover selected.</strong></p>
                )}
            </div>
        );
    },
});
