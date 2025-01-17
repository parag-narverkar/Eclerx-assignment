import { registerBlockType } from '@wordpress/blocks';
import BestSellerBlockEdit from './edit';

// Register the block
registerBlockType('bestseller/block', {
    title: 'Bestseller Block',
    category: 'widgets',  // Or any category you prefer
    icon: 'book',         // You can change the icon
    edit: BestSellerBlockEdit,
    save: () => {
        return null; // Dynamic block, no content to save in the editor
    },
});
