import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import attributes from './attributes';

registerBlockType('my-block/category-book-selector', {
    title: 'Bestseller Block',
    category: 'widgets',
    icon: 'book',
    attributes,
    edit: Edit,
    save: Save,
});
