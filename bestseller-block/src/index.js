import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import attributes from './attributes'; // Import attributes

registerBlockType('my-block/category-book-selector', {
    title: 'Bestseller Block',
    category: 'widgets',
    icon: 'book',
    attributes, // Include attributes
    edit: Edit,
    save: () => null, // Use server-side rendering; no static save function
    supports: {
        html: false, // Disable raw HTML editing for dynamic blocks
    },
    render_callback: 'render_bestsellers_block', // Specify the PHP callback
});
