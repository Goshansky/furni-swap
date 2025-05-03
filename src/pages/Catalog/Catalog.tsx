import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Catalog.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import listingService, { Listing, ListingFilter } from "../../services/listing.service";
import ProductCard from "../../components/ProductCard/ProductCard";

const Catalog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || '';
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState("desc");
    const [listings, setListings] = useState<Listing[]>([]);
    const [categories, setCategories] = useState<string[]>([
        'Диваны и кресла', 'Столы и стулья', 'Шкафы и комоды', 'Кровати и матрасы', 'Другое'
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch listings when filters change
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setIsLoading(true);
                
                console.log("Applying filters:", {
                    category: selectedCategory,
                    minPrice,
                    maxPrice,
                    search: searchTerm
                });
                
                const filterParams: ListingFilter = {
                    page: 1,
                    limit: 20
                };
                
                if (selectedCategory) {
                    filterParams.category = selectedCategory;
                    
                    // Update URL query parameter for better sharing/bookmarking
                    if (selectedCategory) {
                        queryParams.set('category', selectedCategory);
                    } else {
                        queryParams.delete('category');
                    }
                    
                    const newSearch = queryParams.toString() 
                        ? `?${queryParams.toString()}` 
                        : '';
                    
                    // Update URL without reloading the page
                    window.history.replaceState(
                        {}, 
                        '', 
                        `${window.location.pathname}${newSearch}`
                    );
                }
                
                if (minPrice !== undefined) {
                    filterParams.minPrice = minPrice;
                }
                
                if (maxPrice !== undefined) {
                    filterParams.maxPrice = maxPrice;
                }
                
                if (searchTerm) {
                    filterParams.search = searchTerm;
                }
                
                console.log("Calling listingService with params:", filterParams);
                
                const response = await listingService.getListings(filterParams);
                
                if (response && response.listings) {
                    console.log(`Got ${response.listings.length} listings from API:`, response.listings);
                    setListings(response.listings);
                    setError(null);
                } else {
                    console.warn("No listings returned from API");
                    setListings([]);
                    setError('Не удалось загрузить объявления');
                }
            } catch (err) {
                console.error('Error fetching listings:', err);
                setError('Не удалось загрузить объявления');
                setListings([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Add a small delay to debounce frequent filter changes
        const debounceTimeout = setTimeout(() => {
            fetchListings();
        }, 300);
        
        return () => clearTimeout(debounceTimeout);
    }, [selectedCategory, minPrice, maxPrice, searchTerm]);

    // Apply client-side sorting (since API might not support it)
    const sortedListings = [...listings].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleMinPriceChange = (value: string) => {
        const parsedValue = value ? Number(value) : undefined;
        if (!value || !isNaN(parsedValue as number)) {
            setMinPrice(parsedValue);
        }
    };
    
    const handleMaxPriceChange = (value: string) => {
        const parsedValue = value ? Number(value) : undefined;
        if (!value || !isNaN(parsedValue as number)) {
            setMaxPrice(parsedValue);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // The search will be triggered by the useEffect
    };
    
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setSortOrder("desc");
    };

    return (
        <div>
            <Header />

            <div className={styles.catalogContainer}>
                <h1 className={styles.title}>Каталог товаров</h1>

                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className={styles.searchButton}>Поиск</button>
                </form>

                <div className={styles.filters}>
                    <select 
                        className={styles.filterButton} 
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value="">Все категории</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <div className={styles.priceFilter}>
                        <input
                            type="number"
                            placeholder="Мин. цена"
                            className={styles.priceInput}
                            value={minPrice || ''}
                            onChange={(e) => handleMinPriceChange(e.target.value)}
                        />
                        <span className={styles.priceSeparator}>-</span>
                        <input
                            type="number"
                            placeholder="Макс. цена"
                            className={styles.priceInput}
                            value={maxPrice || ''}
                            onChange={(e) => handleMaxPriceChange(e.target.value)}
                        />
                    </div>

                    <select 
                        className={styles.filterButton} 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">Сначала дешевые</option>
                        <option value="desc">Сначала дорогие</option>
                    </select>
                    
                    {(selectedCategory || minPrice !== undefined || maxPrice !== undefined || searchTerm) && (
                        <button 
                            className={styles.clearFilterButton}
                            onClick={clearFilters}
                        >
                            Сбросить фильтры
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Загрузка объявлений...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.productGrid}>
                        {sortedListings.length > 0 ? (
                            sortedListings.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    id={product.id}
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    location={product.location}
                                    imageUrl={product.mainImage}
                                    category={product.category}
                                />
                            ))
                        ) : (
                            <div className={styles.noProducts}>
                                Не найдено объявлений, соответствующих вашим критериям
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default Catalog;
