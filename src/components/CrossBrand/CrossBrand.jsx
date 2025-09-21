import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Tag, Calendar, Star, ChevronDown, Clock, Users, DollarSign, ExternalLink } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const CrossBrand = () => {
  const [data, setData] = useState(null);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("authToken");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch data from API
  useEffect(() => {
    const fetchCrossBrandData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/api/cross-brand/store`, {
          headers: { 
            Authorization: `${token}`,
          },
          withCredentials: true,
        });
        
        setData(response.data);
        
        // Flatten all presets for filtering
        const allPresets = response.data.data.crossBrand.flatMap(
          brand => brand.presets.map(preset => ({
            ...preset,
            brandInfo: brand.card
          }))
        );
        
        setFilteredPromotions(allPresets);
      } catch (err) {
        console.error("Failed to fetch cross brand data:", err);
        setError("Failed to load promotions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrossBrandData();
  }, [API_URL, token]);

  // Filter promotions based on search and filters
  useEffect(() => {
    if (!data) return;

    let results = data.data.crossBrand.flatMap(
      brand => brand.presets.map(preset => ({
        ...preset,
        brandInfo: brand.card
      }))
    );

    // Filter by search term
    if (searchTerm) {
      results = results.filter(promo => 
        promo.presetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (promo.brandInfo.name && promo.brandInfo.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category (using preset type)
    if (selectedCategory !== "all") {
      results = results.filter(promo => promo.type === selectedCategory);
    }

    // Filter by location (using brand address)
    if (selectedLocation !== "all") {
      results = results.filter(promo => 
        promo.brandInfo.address && promo.brandInfo.address.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredPromotions(results);
  }, [searchTerm, selectedCategory, selectedLocation, data]);

  const categories = [
    { id: "all", name: "All Types" },
    { id: "cross", name: "Cross Promotions" },
    { id: "other", name: "Other Types" }
  ];

  const locations = [
    { id: "all", name: "All Locations" },
    { id: "meher", name: "Meher Pada" },
    // Add more locations based on your data
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "No expiration";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDiscountText = (promotion) => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountAmount}% off`;
    } else if (promotion.discountType === "fixed") {
      return `$${promotion.discountAmount} off`;
    } else {
      return promotion.discountAmount; // custom type
    }
  };

  const getStatusBadge = (promotion) => {
    const now = new Date();
    const expireDate = promotion.expireAt ? new Date(promotion.expireAt) : null;
    
    if (!promotion.isActive) {
      return { text: "Inactive", color: "bg-red-100 text-red-800" };
    }
    
    if (expireDate && expireDate < now) {
      return { text: "Expired", color: "bg-gray-100 text-gray-800" };
    }
    
    return { text: "Active", color: "bg-green-100 text-green-800" };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross Brand Promotions</h1>
          <p className="text-gray-600">Discover amazing collaborations between brands</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search promotions or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full md:w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {isLoading ? "Loading..." : `${filteredPromotions.length} promotion${filteredPromotions.length !== 1 ? 's' : ''} found`}
          </p>
          {(selectedCategory !== 'all' || selectedLocation !== 'all') && (
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Promotions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPromotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map(promotion => {
              const status = getStatusBadge(promotion);
              
              return (
                <div key={promotion._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Brand Header */}
                  <div className="p-4 bg-gray-50 border-b flex items-center gap-3">
                    {promotion.brandInfo.logo ? (
                      <img 
                        src={promotion.brandInfo.logo} 
                        alt={promotion.brandInfo.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {promotion.brandInfo.name ? promotion.brandInfo.name.charAt(0).toUpperCase() : 'B'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{promotion.brandInfo.name || "Unknown Brand"}</h3>
                      <p className="text-xs text-gray-500">{promotion.brandInfo.address || "No address"}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${status.color}`}>
                      {status.text}
                    </div>
                    
                    {/* Promotion Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{promotion.presetName}</h3>
                    
                    {/* Discount Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium">
                        {getDiscountText(promotion)}
                      </div>
                      {promotion.maxDiscount && (
                        <span className="text-sm text-gray-600">
                          up to ${promotion.maxDiscount}
                        </span>
                      )}
                    </div>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      {promotion.minPurchase && (
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Min: ${promotion.minPurchase}
                        </div>
                      )}
                      
                      {promotion.usageLimit && (
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          Limit: {promotion.usageLimit}
                        </div>
                      )}
                      
                      {promotion.day && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {promotion.day} days
                        </div>
                      )}
                    </div>
                    
                    {/* Conditions */}
                    {promotion.conditions && promotion.conditions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Conditions:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {promotion.conditions.map((condition, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Expiration */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      Expires: {formatDate(promotion.expireAt)}
                    </div>
                    
                    {/* Link */}
                    {promotion.link && (
                      <a 
                        href={promotion.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit offer
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No promotions found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLocation("all");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossBrand;