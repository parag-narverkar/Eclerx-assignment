<?php
// src/render.php

function render_bestsellers_block($attributes) {
    $selectedBookTitle = isset($attributes['selectedBookTitle']) ? $attributes['selectedBookTitle'] : '';
    $selectedBookId = isset($attributes['selectedBookId']) ? $attributes['selectedBookId'] : '';
    $selectedBookCover = isset($attributes['selectedBookCover']) ? $attributes['selectedBookCover'] : '';
    $selectedBookAuthors = isset($attributes['selectedBookAuthors']) ? $attributes['selectedBookAuthors'] : [];
    $selectedBookAmazonLink = isset($attributes['selectedBookAmazonLink']) ? $attributes['selectedBookAmazonLink'] : '';
    $blockTitle = isset($attributes['blockTitle']) ? $attributes['blockTitle'] : 'Bestsellers';

    ob_start();
    ?>
    <div class="bestsellers-container">
        <h2 class="bestsellers-title"><?php echo esc_html($blockTitle); ?></h2>
        <?php if ($selectedBookTitle): ?>
            <div class="book-details">
                <img src="<?php echo esc_url($selectedBookCover); ?>" alt="<?php echo esc_attr($selectedBookTitle); ?>" />
                <p id="<?php echo esc_html($selectedBookId);?>"><?php echo esc_html($selectedBookTitle); ?></p>
                <p><?php echo esc_html(implode(', ', $selectedBookAuthors)); ?></p>
                <?php if ($selectedBookAmazonLink): ?>
                    <p class="amazon-button">
                        <a href="<?php echo esc_url($selectedBookAmazonLink); ?>" target="_blank" rel="noopener noreferrer">
                            Buy from Amazon
                        </a>
                    </p>
                <?php else: ?>
                    <p>No Amazon link available</p>
                <?php endif; ?>
            </div>
        <?php else: ?>
            <p>No book selected</p>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
