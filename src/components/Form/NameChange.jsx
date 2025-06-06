import React, { useState } from "react";
import Cookies from "js-cookie";
import { useUser } from "../../Context/ContextApt";

export default function UpdateNameModal({ onClose, onSubmit }) {
    const { userData,setUserData, loading, error } = useUser();
    const [name, setName] = useState(userData?.user.name || "");


    const handleSubmit = async (e) => {
        e.preventDefault();
        const accountToken = Cookies.get("accountToken");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/account/upadateprofile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${accountToken}`, // Optional: if your server expects it in the header
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                }),
            });

            if (!response.ok) throw new Error("Failed to update name");

            const result = await response.json();
            setUserData((prev) => ({
                ...prev,
                user: {
                  ...prev.user,
                  name: result.data.name, 
                },
              }));

            if (onSubmit) onSubmit({ name });
        } catch (err) {
            console.error("Error updating name:", err.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[9999]">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Update Your Name</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-xl font-bold">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500 block mb-1">Your name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-purple-600 hover:underline font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
