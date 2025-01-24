import React from 'react';
import { useState, useEffect } from '@wordpress/element';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import './style.scss';

const Edit = (props) => {
    const { attributes, setAttributes } = props;

    const [state, setState] = useState({
        categories: [],
        books: [],
        loadingCategories: true,
        loadingBooks: false,
    });

    const updateState = (updates) => setState((prevState) => ({ ...prevState, ...updates }));

    useEffect(() => {
        fetch(
            "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/categories?rows=15&catSetId=PW&api_key=7fqge2qgxcdrwqbcgeywwdj2"
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.data?.categories) {
                    updateState({ categories: result.data.categories, loadingCategories: false });
                } else {
                    console.error("Categories array not found in response.");
                    updateState({ loadingCategories: false });
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                updateState({ loadingCategories: false });
            });
    }, []);

    useEffect(() => {
        if (attributes.selectedCategory) {
            fetchBooks(attributes.selectedCategory, attributes.sortOrder);
        }
    }, [attributes.selectedCategory, attributes.sortOrder]);

    const fetchBooks = (catUri, sortOrder = "desc") => {
        updateState({ loadingBooks: true });
        fetch(
            `https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/works/views/uk-list-display?catUri=${encodeURIComponent(
                catUri
            )}&sort=weeklySales&dir=${sortOrder}&api_key=7fqge2qgxcdrwqbcgeywwdj2`
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.data?.works) {
                    updateState({ books: result.data.works, loadingBooks: false });
                } else {
                    console.error("Books array not found in response.");
                    updateState({ books: [], loadingBooks: false });
                }
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                updateState({ books: [], loadingBooks: false });
            });
    };

    const categoryOptions = state.categories.map((item) => ({
        label: item.menuText,
        value: item.catUri,
    }));

    const bookOptions = state.books.map((book) => ({
        label: book.title,
        value: book.workId,
    }));

    const handleBookChange = (selectedBookId) => {
        const book = state.books.find((b) => b.workId === parseInt(selectedBookId));
        const coverUrl = book?.coverUrls?.large?.coverUrl || '';
        const amazonLink = book?.affiliateLinks?.find((link) => link.affiliateType === "amazon")?.url;
        const authors = book?.authors?.map((author) => author.authorDisplay) || [];

        setAttributes({
            selectedBookId: book?.workId || '',
            selectedBookTitle: book?.title || '',
            selectedBookCover: coverUrl,
            selectedBookAmazonLink: amazonLink || '',
            selectedBookAuthors: authors,
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Category and Books Settings" initialOpen={true}>
                    {state.loadingCategories ? (
                        <p>Loading categories...</p>
                    ) : (
                        <SelectControl
                            label="Select a Genre"
                            value={attributes.selectedCategory || ""}
                            options={[{ label: "Select a category", value: "" }, ...categoryOptions]}
                            onChange={(selectedCategory) => {
                                setAttributes({ selectedCategory });
                                fetchBooks(selectedCategory, attributes.sortOrder);
                            }}
                        />
                    )}
                    {attributes.selectedCategory && state.loadingBooks ? (
                        <p>Loading books...</p>
                    ) : attributes.selectedCategory ? (
                        <SelectControl
                            label="Select a Book"
                            value={attributes.selectedBookId || ""}
                            options={[{ label: "Select a book", value: "" }, ...bookOptions]}
                            onChange={handleBookChange}
                        />
                    ) : null}
                    <SelectControl
                        label="Sort Order"
                        value={attributes.sortOrder}
                        options={[
                            { label: "Descending (Most Sales First)", value: "desc" },
                            { label: "Ascending (Least Sales First)", value: "asc" },
                        ]}
                        onChange={(newSortOrder) => setAttributes({ sortOrder: newSortOrder })}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="bestsellers-container">
                <RichText
                    tagName="h2"
                    className="bestsellers-title"
                    value={attributes.blockTitle || 'Bestsellers'}
                    onChange={(newTitle) => setAttributes({ blockTitle: newTitle })}
                    placeholder="Enter block title..."
                />
                {attributes.selectedBookId ? (
                    <div className="book-details">
                        <img
                            src={attributes.selectedBookCover || ""}
                            alt={attributes.selectedBookTitle}
                        />
                        
                        
                        <p>{attributes.selectedBookTitle}</p>
                        {attributes.selectedBookAuthors.length > 0 ? (
                            <p>{attributes.selectedBookAuthors.join(", ")}</p>
                        ) : (
                            <p><strong>Author(s):</strong> Unknown</p>
                        )}
                        {attributes.selectedBookAmazonLink ? (
                            <p className="amazon-button">
                                <a
                                    href={attributes.selectedBookAmazonLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Buy from Amazon 
                                </a>
                            </p>
                        ) : (
                            <p>No Amazon link available</p>
                        )}
                        <div className="additional-image">
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ additionalImage: media.url })}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary">
                                            {attributes.additionalImage ? 'Change Additional Image' : 'Upload Additional Image'}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>
                            {attributes.additionalImage && (
                                <img
                                    src={attributes.additionalImage}
                                    alt="Additional uploaded image"
                                    style={{ marginTop: '10px', maxWidth: '100%' }}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <p>No book selected</p>
                )}
            </div>
        </>
    );
};

export default Edit;
