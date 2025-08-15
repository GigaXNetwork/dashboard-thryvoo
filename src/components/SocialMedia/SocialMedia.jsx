import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import {
    FaSpinner,
    FaExclamationTriangle,
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaYoutube,
    FaTiktok,
    FaGlobe,
    FaPercentage,
    FaTag,
    FaCalendarAlt,
    FaShoppingCart,
    FaGift
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import CreateSocialMedia from "./CreateSocialMedia";

const SocialMedia = () => {
    const [socialMediaList, setSocialMediaList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);


    useEffect(() => {
        const fetchSocialMedia = async () => {
            const token = Cookies.get('authToken');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/social-media`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch social media");
                }
                const data = await response.json();
                setSocialMediaList(data.data.socialMedia);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSocialMedia();
    }, []);

    const handleCreateSuccess = (newMedia) => {
        setSocialMediaList(prev => [...prev, newMedia]);
        setShowCreateModal(false);
    };

    const getPlatformIcon = (mediaType) => {
        const platform = mediaType.toLowerCase();
        switch (platform) {
            case 'facebook': return <FaFacebook className="text-blue-600 text-2xl" />;
            case 'instagram': return <FaInstagram className="text-pink-600 text-2xl" />;
            case 'twitter': return <FaTwitter className="text-blue-400 text-2xl" />;
            case 'linkedin': return <FaLinkedin className="text-blue-700 text-2xl" />;
            case 'youtube': return <FaYoutube className="text-red-600 text-2xl" />;
            case 'tiktok': return <FaTiktok className="text-black text-2xl" />;
            default: return <FaGlobe className="text-gray-600 text-2xl" />;
        }
    };



    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Social Media Offers</h1>
                    <p className="text-gray-600">Exclusive discounts from your favorite platforms</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
                >
                    + Create Coupon
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-2" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {socialMediaList.length > 0 ? (
                        socialMediaList.map((media) => (
                            <div
                                key={media._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-gray-100 rounded-lg mr-4">
                                                {getPlatformIcon(media.mediaType)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800 capitalize">
                                                    {media.mediaType.toLowerCase()}
                                                </h3>
                                                <a
                                                    href={media.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline text-sm"
                                                >
                                                    Visit Page
                                                </a>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="rounded-lg p-3 mb-4 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border border-yellow-200 shadow-sm">
                                        <h4 className="text-xs font-semibold text-yellow-800 mb-1 flex items-center tracking-wide">
                                            <FaTag className="mr-2 text-yellow-700" /> DISCOUNT OFFER
                                        </h4>
                                        <p className="text-2xl font-bold text-yellow-900 text-center">
                                            100 coins
                                        </p>
                                    </div>


                                    {media.conditions && media.conditions.length > 0 && (
                                        <div className="mb-5">
                                            <div className="flex items-center mb-3">
                                                <div className="w-4 h-0.5 bg-gray-300 mr-3"></div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">TERMS & CONDITIONS</h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {media.conditions.map((condition, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 border border-gray-200">
                                                                <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                                                            </div>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-800 leading-tight">
                                                            {condition}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-500 italic flex items-center my-2">
                                        <span className="text-yellow-500 mr-1">★</span>
                                        This reward is set by Thryvoo
                                    </p>

                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 font-medium">
                                        Follow For Updates
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaGlobe className="text-5xl mx-auto" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-600 mb-2">No Social Media Accounts Found</h3>
                            <p className="text-gray-500">Connect your social media accounts to view offers</p>
                            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-colors duration-300">
                                Connect Account
                            </button>
                        </div>
                    )}
                </div>
            )}


            {showCreateModal && (
                <CreateSocialMedia
                    onClose={() => setShowCreateModal(false)}
                    onCreateSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
};

export default SocialMedia;