import { useState, useEffect } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

const Edit = (props) => {
    const { attributes, setAttributes } = props;
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");

    // Fetch categories on component mount
    useEffect(() => {
        fetch(
            "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/categories?rows=15&catSetId=PW&api_key=7fqge2qgxcdrwqbcgeywwdj2"
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.data && Array.isArray(result.data.categories)) {
                    setCategories(result.data.categories);
                } else {
                    console.error("Categories array not found in response.");
                }
                setLoadingCategories(false);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setLoadingCategories(false);
            });
    }, []);

    // Fetch books whenever selected category or sort order changes
    useEffect(() => {
        if (attributes.selectedCategory) {
            fetchBooks(attributes.selectedCategory, sortOrder);
        }
    }, [attributes.selectedCategory, sortOrder]);

    const fetchBooks = (catUri, sortOrder = "desc") => {
        setLoadingBooks(true);
        fetch(
            `https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/works/views/uk-list-display?catUri=${encodeURIComponent(
                catUri
            )}&sort=weeklySales&dir=${sortOrder}&api_key=7fqge2qgxcdrwqbcgeywwdj2`
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.data && Array.isArray(result.data.works)) {
                    setBooks(result.data.works);
                } else {
                    console.error("Books array not found in response.");
                    setBooks([]);
                }
                setLoadingBooks(false);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setBooks([]);
                setLoadingBooks(false);
            });
    };

    const categoryOptions = categories.map((item) => ({
        label: item.menuText,
        value: item.catUri,
    }));

    const bookOptions = books.map((book) => ({
        label: book.title,
        value: book.workId,
    }));

    const selectedBook = books.find(
        (book) => book.workId === parseInt(attributes.selectedBook)
    );

    const handleBookChange = (selectedBook) => {
        const book = books.find((b) => b.workId === parseInt(selectedBook));
        const coverUrl = book?.coverUrls?.large?.coverUrl || '';
        setAttributes({ selectedBook, selectedBookCover: coverUrl });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Category and Books Settings" initialOpen={true}>
                    {loadingCategories ? (
                        <p>Loading categories...</p>
                    ) : (
                        <SelectControl
                            label="Select a Genre"
                            value={attributes.selectedCategory || ""}
                            options={[{ label: "Select a category", value: "" }, ...categoryOptions]}
                            onChange={(selectedCategory) => {
                                setAttributes({ selectedCategory });
                                const selectedCatUri = categories.find(
                                    (cat) => cat.catUri === selectedCategory
                                )?.catUri;
                                if (selectedCatUri) {
                                    fetchBooks(selectedCatUri, sortOrder);
                                }
                            }}
                        />
                    )}
                    {attributes.selectedCategory && loadingBooks ? (
                        <p>Loading books...</p>
                    ) : attributes.selectedCategory ? (
                        <SelectControl
                            label="Select a Book"
                            value={attributes.selectedBook || ""}
                            options={[{ label: "Select a book", value: "" }, ...bookOptions]}
                            onChange={handleBookChange}
                        />
                    ) : null}
                    <SelectControl
                        label="Sort Order"
                        value={sortOrder}
                        options={[
                            { label: "Descending (Most Sales First)", value: "desc" },
                            { label: "Ascending (Least Sales First)", value: "asc" },
                        ]}
                        onChange={(newSortOrder) => {
                            setSortOrder(newSortOrder);
                            if (attributes.selectedCategory) {
                                fetchBooks(attributes.selectedCategory, newSortOrder);
                            }
                        }}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Display selected genre and book in the editor */}
            <div>
                <h3>Selected Options</h3>
                <p>
                    <strong>Genre:</strong>{" "}
                    {attributes.selectedCategory
                        ? categories.find(
                              (cat) => cat.catUri === attributes.selectedCategory
                          )?.menuText || "Unknown"
                        : "None"}
                </p>
                {selectedBook ? (
                    <div>
                        <p>
                            <strong>Book:</strong> {selectedBook.title}
                        </p>
                        <img
                            src={selectedBook.coverUrls?.large?.coverUrl || ""}
                            alt={selectedBook.title}
                            style={{ maxWidth: "200px", height: "auto" }}
                        />
                    </div>
                ) : (
                    <p>No book selected</p>
                )}
            </div>
        </>
    );
};

export default Edit;
