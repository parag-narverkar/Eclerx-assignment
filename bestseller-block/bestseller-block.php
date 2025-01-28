<?php
/**
 * Plugin Name:       Bestseller Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.1
 * Author:            Parag Narvekar
 * Text Domain:       bestseller-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Include the render.php file
require_once plugin_dir_path(__FILE__) . 'src/render.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_bestseller_block_block_init() {
    register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_bestseller_block_block_init' );

// Enqueue frontend styles
function bestseller_block_assets() {
    wp_enqueue_style(
        'bestseller-block-frontend',
        plugins_url('build/style-index.css', __FILE__), false, '1.0', 'all'
    );
}
add_action('enqueue_block_assets', 'bestseller_block_assets');

// Register block with server-side rendering callback
function register_bestsellers_block() {
    register_block_type('my-block/category-book-selector', [
        'render_callback' => 'render_bestsellers_block', // Callback from render.php
        'attributes' => [
            'selectedCategory' => ['type' => 'string', 'default' => ''],
            'selectedBookId' => ['type' => 'string', 'default' => ''],
            'selectedBookTitle' => ['type' => 'string', 'default' => ''],
            'selectedBookCover' => ['type' => 'string', 'default' => ''],
            'selectedBookAuthors' => ['type' => 'array', 'default' => []],
            'selectedBookAmazonLink' => ['type' => 'string', 'default' => ''],
            'blockTitle' => ['type' => 'string', 'default' => 'Bestsellers'],
        ],
    ]);
}
add_action('init', 'register_bestsellers_block');
