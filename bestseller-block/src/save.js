import { RichText } from '@wordpress/block-editor';
import './style.scss';
import { ReactComponent as MyIcon } from './assets/logo.svg';

const Save = ({ attributes }) => {
    const {
        selectedBookId,
        selectedBookTitle,
        selectedBookCover,
        selectedBookAuthors,
        selectedBookAmazonLink,
        blockTitle,
        additionalImage, // Include the new attribute
    } = attributes;

    return (
        <div className="bestsellers-container">
            <RichText.Content
                tagName="h2"
                className="bestsellers-title"
                value={blockTitle || 'Bestsellers'}
            />

            {selectedBookId ? (
                <div className="book-details">
                    <img
                        src={selectedBookCover || ""}
                        alt={selectedBookTitle}
                    />
                    <p>{selectedBookTitle}</p>
                    {selectedBookAuthors.length > 0 ? (
                        <p>{selectedBookAuthors.join(", ")}</p>
                    ) : (
                        <p><strong>Author(s):</strong> Unknown</p>
                    )}

                    {selectedBookAmazonLink ? (
                        <p className="amazon-button">
                            <a
                                href={selectedBookAmazonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Buy from Amazon
                            </a>
                        </p>
                    ) : (
                        <p>No Amazon link available</p>
                    )}

                    {/* Render the additional image */}
                    {additionalImage && (
                        <div className="additional-image">
                            <img
                                src={additionalImage}
                                alt="Additional uploaded image"
                                style={{ marginTop: '10px', maxWidth: '100%' }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <p>No book selected</p>
            )}
            <div className="svg-icon">
                <MyIcon />
            </div>
        </div>
    );
};

export default Save;
