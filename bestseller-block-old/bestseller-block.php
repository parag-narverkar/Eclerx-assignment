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

function bestseller_block_assets() {

    // Enqueue frontend styles
    wp_enqueue_style(
        'bestseller-block-frontend',
        plugins_url('build/style-index.css', __FILE__),false, '1.0', 'all' );
}
add_action('enqueue_block_assets', 'bestseller_block_assets');

