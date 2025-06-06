import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useCard } from "../../Context/CardContext";

export default function BasicData({ handleNext, handleBack, cardId, role }) {
    const [apperror, setError] = useState(null);
    const { cardData, setCardData, error, loading } = useCard()
    const [formData, setFormData] = useState({
        videoUrl: "",
        googleMap: "",
        googleRating: "",
        desc: "",
        keyword: "",
    });

    useEffect(() => {
        if (cardData) {
            setFormData((prev) => ({
                ...prev,
                videoUrl: cardData.videoUrl || "",
                googleMap: cardData.googleMap || "",
                googleRating: cardData.googleRating || "",
                desc: cardData.desc || "",
                keyword: cardData.keyword || "",
            }));
        }
    }, [cardData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async () => {
        setError(null);

        const authToken = Cookies.get("authToken");

        // Remove empty fields from formData
        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(
                ([_, value]) =>
                    value !== "" &&
                    value !== null &&
                    !(Array.isArray(value) && value.length === 0)
            )
        );
        console.log("social data", cleanedData);

        let url;
        if(role==="admin"){
            url=`${import.meta.env.VITE_API_URL}/api/admin/card/${cardId}/meta`
        }
        else{
            url=`${import.meta.env.VITE_API_URL}/api/user/card/${cardId}/meta`
        }

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken || "",
                },
                credentials: "include",
                body: JSON.stringify(cleanedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update theme");
            }

            const result = await response.json();
            setCardData((prev) => ({
                ...prev,
                ...cleanedData,
            }));
            handleNext();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-4">

            {/* Text Inputs */}
            <TextInput label="videoUrl" name="videoUrl" value={formData.videoUrl} handleChange={handleChange} placeholder="youtube embed video url" />
            <TextInput label="googleMap" name="googleMap" value={formData.googleMap} handleChange={handleChange} placeholder="google map place id" />
            <TextInput label="googleRating" name="googleRating" value={formData.googleRating} handleChange={handleChange} placeholder="google map place id" />
            <TextArea label="desc" name="desc" value={formData.desc} handleChange={handleChange} placeholder="Write a short desc..." />
            <TextArea label="keyword" name="keyword" value={formData.keyword} handleChange={handleChange} placeholder="Write a short keyword..." />

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
                    finish
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
