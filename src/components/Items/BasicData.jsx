import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useCard } from "../../Context/CardContext";


export default function BasicData({ handleNext, handleBack, cardId, role }) {
    const [apperror, setError] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const { cardData, setCardData, error, loading } = useCard();
    console.log(cardId);
    


    const categories = [
        "Restaurants",
        "Retail",
        "Healthcare",
        "Real Estate",
        "Education",
        "Banking",
        "E-commerce",
        "Hotels"
    ];

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        bio: "",
        addressLine: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        category: "",
        logo: null,
        photo: null,
    });

    useEffect(() => {
        if (cardData) {
            setFormData((prev) => ({
                ...prev,
                name: cardData.name || "",
                phone: cardData.phone || "",
                email: cardData.email || "",
                bio: cardData.bio || "",
                addressLine: cardData.addressLine || "",
                city: cardData.city || "",
                state: cardData.state || "",
                country: cardData.country || "",
                pinCode: cardData.pinCode || "",
                category: cardData.category || "",
                logo: cardData.logo || null,
                photo: cardData.photo || null,
            }));

            if (cardData.logo && typeof cardData.logo === "string") {
                setLogoPreview(cardData.logo.startsWith('http') ? cardData.logo : `${import.meta.env.VITE_API_URL}/${cardData.logo}`);
            }
            if (cardData.photo && typeof cardData.photo === "string") {
                setPhotoPreview(cardData.photo.startsWith('http') ? cardData.photo : `${import.meta.env.VITE_API_URL}/${cardData.photo}`);
            }
        }
    }, [cardData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            if (name === "logo") setLogoPreview(previewURL);
            if (name === "photo") setPhotoPreview(previewURL);
            setFormData((prev) => ({ ...prev, [name]: file }));
        }
    };

    const handleSubmit = async () => {
        setError(null);
        const authToken = Cookies.get("authToken");

        // Validate PIN code
        if (!/^[1-9][0-9]{5}$/.test(formData.pinCode)) {
            setError("Please enter a valid 6-digit PIN code (starting with 1-9)");
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                data.append(key, value);
            }
        });

        let url;
        if (role === "admin") {
            url = `${import.meta.env.VITE_API_URL}/api/admin/card/${cardId}/basic`;
        } else {
            url = `${import.meta.env.VITE_API_URL}/api/user/card/${cardId}/basic`;
        }

        try {
            const response = await fetch(url, {
                method: "PATCH",
                body: data,
                headers: {
                    Authorization: authToken || "",
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update basic data");
            }

            const result = await response.json();
            setCardData((prev) => ({
                ...prev,
                ...formData,
            }));
            handleNext();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-4">
            {/* Logo Upload */}
            <FileUpload
                label="Upload Logo"
                name="logo"
                preview={logoPreview}
                handleFileChange={handleFileChange}
                previewClass="h-24 w-24 rounded-full object-cover border"
            />

            {/* Profile Photo Upload */}
            <FileUpload
                label="Upload Profile Photo"
                name="photo"
                preview={photoPreview}
                handleFileChange={handleFileChange}
                previewClass="w-full rounded object-cover border"
            />

            {/* Text Inputs */}
            <TextInput label="Full Name" name="name" value={formData.name} handleChange={handleChange} placeholder="John Doe" />
            <TextInput label="Phone" name="phone" value={formData.phone} handleChange={handleChange} placeholder="+1 234 567 890" />
            <TextInput label="Email" name="email" value={formData.email} handleChange={handleChange} placeholder="john@example.com" />
            
            {/* Category Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 w-full border px-4 py-2 rounded-md"
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <TextArea label="Bio" name="bio" value={formData.bio} handleChange={handleChange} placeholder="Write a short bio..." />
            
            {/* Address Fields */}
           
            <TextInput label="Address Line" name="addressLine" value={formData.addressLine} handleChange={handleChange} placeholder="Apartment, studio, or floor" />
            <div className="grid grid-cols-2 gap-4">
                <TextInput label="City" name="city" value={formData.city} handleChange={handleChange} placeholder="City" />
                <TextInput label="State" name="state" value={formData.state} handleChange={handleChange} placeholder="State" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <TextInput label="Country" name="country" value={formData.country} handleChange={handleChange} placeholder="Country" />
                <TextInput 
                    label="PIN Code" 
                    name="pinCode" 
                    value={formData.pinCode} 
                    handleChange={handleChange} 
                    placeholder="6-digit code" 
                    pattern="[1-9][0-9]{5}"
                    title="6-digit PIN code starting with 1-9"
                />
            </div>

            {/* Error */}
            {apperror && <p className="text-red-500 text-sm">{apperror}</p>}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                <button type="button" className="text-gray-600 hover:underline" onClick={handleBack}>
                    Back
                </button>
                <button
                    type="button"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={handleSubmit}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// Reusable Components (keep these the same as before)
function FileUpload({ label, name, preview, handleFileChange, previewClass }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {preview && (
                <div className="mt-2 flex justify-start">
                    <img src={preview} alt={`${name} Preview`} className={previewClass} />
                </div>
            )}
            <input
                type="file"
                name={name}
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 w-full border px-4 py-2 rounded-md"
            />
        </div>
    );
}

function TextInput({ label, name, value, handleChange, placeholder, pattern, title }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                className="mt-1 w-full border px-4 py-2 rounded-md"
                placeholder={placeholder}
                pattern={pattern}
                title={title}
            />
        </div>
    );
}

function TextArea({ label, name, value, handleChange, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full border px-4 py-2 rounded-md"
                placeholder={placeholder}
            />
        </div>
    );
}