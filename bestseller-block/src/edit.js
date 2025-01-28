import React, { useState, useEffect } from '@wordpress/element';
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
        errorCategories: null,
        errorBooks: null,
        sortOrder: "desc",
    });

    const updateState = (updates) => setState((prevState) => ({ ...prevState, ...updates }));

    // Fetch categories on mount
    useEffect(() => {
        fetch("https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/categories?rows=15&catSetId=PW&api_key=7fqge2qgxcdrwqbcgeywwdj2")
            .then((response) => response.json())
            .then((result) => {
                if (result.data?.categories) {
                    updateState({ categories: result.data.categories, loadingCategories: false });
                } else {
                    updateState({ loadingCategories: false, errorCategories: "Failed to load categories" });
                }
            })
            .catch((error) => {
                updateState({ loadingCategories: false, errorCategories: "Error fetching categories" });
            });
    }, []);

    // Fetch books when category or sort order changes
    useEffect(() => {
        if (attributes.selectedCategory) {
            fetchBooks(attributes.selectedCategory, state.sortOrder);
        }
    }, [attributes.selectedCategory, state.sortOrder]);

    // Fetch books based on selected category and sort order
    const fetchBooks = (catUri, sortOrder = "desc") => {
        updateState({ loadingBooks: true });
        fetch(`https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/works/views/uk-list-display?catUri=${encodeURIComponent(catUri)}&sort=weeklySales&dir=${sortOrder}&api_key=7fqge2qgxcdrwqbcgeywwdj2`)
            .then((response) => response.json())
            .then((result) => {
                if (result.data?.works) {
                    updateState({ books: result.data.works, loadingBooks: false });
                } else {
                    updateState({ books: [], loadingBooks: false, errorBooks: "No books found for this category" });
                }
            })
            .catch((error) => {
                updateState({ books: [], loadingBooks: false, errorBooks: "Error fetching books" });
            });
    };

    // Handle book selection change
    const handleBookChange = (selectedBook) => {
        const book = state.books.find((b) => b.workId === parseInt(selectedBook));
        const coverUrl = book?.coverUrls?.large?.coverUrl || '';
        const amazonLink = book?.affiliateLinks?.find((link) => link.affiliateType === "amazon")?.url;
        const authors = book?.authors?.map((author) => author.authorDisplay) || [];

        setAttributes({
            selectedBookId: selectedBook,
            selectedBookTitle: book?.title || '',
            selectedBookCover: coverUrl,
            selectedBookAmazonLink: amazonLink || '',
            selectedBookAuthors: authors,
        });
    };

    // Category options for the select control
    const categoryOptions = state.categories.map((item) => ({
        label: item.menuText,
        value: item.catUri,
    }));

    // Book options for the select control
    const bookOptions = state.books.map((book) => ({
        value: book.workId,
        label: book.title,
        
    }));

    return (
        <>
            <InspectorControls>
                <PanelBody title="Category and Books Settings" initialOpen={true}>
                    {state.loadingCategories ? (
                        <p>Loading categories...</p>
                    ) : state.errorCategories ? (
                        <p>{state.errorCategories}</p>
                    ) : (
                        <SelectControl
                            label="Select a Genre"
                            value={attributes.selectedCategory || ""}
                            options={[{ label: "Select a category", value: "" }, ...categoryOptions]}
                            onChange={(selectedCategory) => {
                                setAttributes({ selectedCategory });
                                fetchBooks(selectedCategory, state.sortOrder);
                            }}
                        />
                    )}

                    {attributes.selectedCategory && state.loadingBooks ? (
                        <p>Loading books...</p>
                    ) : attributes.selectedCategory && state.errorBooks ? (
                        <p>{state.errorBooks}</p>
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
                        value={state.sortOrder}
                        options={[ 
                            { label: "Descending (Most Sales First)", value: "desc" }, 
                            { label: "Ascending (Least Sales First)", value: "asc" },
                        ]}
                        onChange={(newSortOrder) => {
                            updateState({ sortOrder: newSortOrder });
                            if (attributes.selectedCategory) {
                                fetchBooks(attributes.selectedCategory, newSortOrder);
                            }
                        }}
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
                    </div>
                ) : (
                    <p>No book selected</p>
                )}
            </div>
        </>
    );
};

export default Edit;
