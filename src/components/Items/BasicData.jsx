import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useCard } from "../../Context/CardContext";


export default function BasicData({ handleNext, handleBack, cardId ,role}) {
    const [apperror, setError] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const { cardData, setCardData, error, loading } = useCard()

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        bio: "",
        address: "",
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
                address: cardData.address || "",
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

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                data.append(key, value);
            }
        });

        let url;
        if(role==="admin"){
            url=`${import.meta.env.VITE_API_URL}/api/admin/card/${cardId}/basic`
        }
        else{
            url=`${import.meta.env.VITE_API_URL}/api/user/card/${cardId}/basic`
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
                previewClass=" w-full rounded object-cover border"
            />

            {/* Text Inputs */}
            <TextInput label="Full Name" name="name" value={formData.name} handleChange={handleChange} placeholder="John Doe" />
            <TextInput label="Phone" name="phone" value={formData.phone} handleChange={handleChange} placeholder="+1 234 567 890" />
            <TextInput label="Email" name="email" value={formData.email} handleChange={handleChange} placeholder="john@example.com" />
            <TextArea label="Bio" name="bio" value={formData.bio} handleChange={handleChange} placeholder="Write a short bio..." />
            <TextInput label="Address" name="address" value={formData.address} handleChange={handleChange} placeholder="1234 Main St, City, Country" />

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

// Reusable Components
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

function TextInput({ label, name, value, handleChange, placeholder }) {
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
