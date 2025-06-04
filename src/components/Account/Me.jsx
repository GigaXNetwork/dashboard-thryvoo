import React, { useEffect } from 'react';
import { FaInstagram, FaUser, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import TopNav from '../Common/TopNav';
import { FaIdCard } from 'react-icons/fa';
import { IoShareSocialOutline } from "react-icons/io5";
import { VscSymbolKeyword } from "react-icons/vsc";
import { ChevronRight, Facebook } from "lucide-react";
import { FcGoogle } from 'react-icons/fc';
import UpdateNameModal from '../Form/NameChange';
import { useState } from 'react';
import { useUser } from '../../Context/ContextApt';
import UpdateAddressForm from '../Form/UpdateAddressForm';
import UpdatePhoneForm from '../Form/UpdatePhoneForm';


const Me = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddressForm, setIsAddressForm] = useState(false);
    const [isPhoneForm, setIsPhoneForm] = useState(false);

    const { 
        userData,  // User data fetched from API
        loading,   // Loading state
        error      // Error state
      } = useUser();

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
   
    return (
        
        <div className="relative mt-10">
            {isModalOpen && (
                <UpdateNameModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(data) => {
                        console.log("Updated data:", data);
                        setIsModalOpen(false);
                    }}
                />
            )}

            {isAddressForm && (
                <UpdateAddressForm
                    onClose={() => setIsAddressForm(false)}
                    onSubmit={(data) => {
                        setIsAddressForm(false);
                    }}
                />
            )}

            {isPhoneForm && (
                <UpdatePhoneForm
                    onClose={() => setIsPhoneForm(false)}
                    onSubmit={(data) => {
                        setIsPhoneForm(false);
                    }}
                />
            )}

            <div className="user-content min-h-28 max-w-screen-lg mx-auto">
                <TopNav
                    Maintitle="Menu"
                    title="Menu"
                    navLinks={[{ label: "home", path: "/" }]}
                />


                {/* account information */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">
                    <div className="flex items-center gap-4 mb-4 ">
                        <FaIdCard className="text-purple-500 text-xl" />
                        <h2 className="text-base font-semibold">Personal information</h2>
                    </div>
                    <p className="text-sm text-gray-500 divide-y py-4 divide-gray-200">
                        The information provided below will reflect on your invoices
                    </p>

                    <div className="divide-y divide-gray-200">
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center  gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Name</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">{userData.user.name}</span>
                            </div>
                            <div className="pl-4" onClick={() => setIsModalOpen(true)}>
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center  gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Address</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">{userData.user.address}</span>
                            </div>
                            <div className="pl-4" onClick={() => setIsAddressForm(true)}>
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center  gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Phone</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">{userData.user.phone}</span>
                            </div>
                            <div className="pl-4">
                                <ChevronRight className="w-5 h-5 text-primary" onClick={() => setIsPhoneForm(true)} />
                            </div>
                        </div>
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Company</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">-</span>
                            </div>
                            <div className="pl-4">
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>


                {/* account setting */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">
                    <div className="flex items-center gap-4 mb-4 ">
                        <FaUser className="text-purple-500 text-xl" />
                        <h2 className="text-base font-semibold">Account settings</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Email</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">debashishmeher955@gmail.com</span>
                            </div>
                            <div className="pl-4">
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center  gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Change password</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">.....................</span>
                            </div>
                            <div className="pl-4">
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center  gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Two-Factor Authentication</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">Disable</span>
                            </div>
                            <div className="pl-4">
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px]">Member since</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">
                                    2024-03-20 20:36</span>
                            </div>
                            <div className="pl-4">
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* account setting */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">
                    <div className="flex items-center gap-4 mb-4 ">
                        <IoShareSocialOutline className="text-purple-500 text-xl" />
                        <h2 className="text-base font-semibold">Google Login</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center  gap-4 flex-wrap">
                                <span className="text-gray-600 flex-1 basis-[100px] flex gap-2 items-center"><FcGoogle className=" text-2xl w-10 h-10 rounded-full p-2 shadow-lg" /> Google</span>
                                <span className="text-gray-800 font-medium flex-1 basis-[100px]">Enabled</span>
                            </div>
                            <div className="pl-4">
                                <button className='flex items-center gap-2 bg-violet-600 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-violet-700 transition'>Unlink</button>
                            </div>
                        </div>

                    </div>
                </div>


                {/* social media tabs */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">

                    {/* table head */}
                    <div className="flex items-center gap-4 mb-4 ">
                        <IoShareSocialOutline className="text-purple-500 text-xl" />
                        <h2 className="text-base font-semibold">social media</h2>
                    </div>

                    {/* body */}
                    <div className="divide-y divide-gray-200">

                        {/* face book */}
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                                <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 flex-1 basis-[100px]">
                                    <Facebook className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Enter a value..."
                                        className="bg-transparent focus:outline-none text-gray-700 w-full"
                                    />
                                </div>

                                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm">
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* whatsapp */}
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                                <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 flex-1 basis-[100px]">
                                    <FaWhatsapp className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Enter a value..."
                                        className="bg-transparent focus:outline-none text-gray-700 w-full"
                                    />
                                </div>

                                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm">
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* instagram */}
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                                <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 flex-1 basis-[100px]">
                                    <FaInstagram className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Enter a value..."
                                        className="bg-transparent focus:outline-none text-gray-700 w-full"
                                    />
                                </div>

                                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm">
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* youtube */}
                        <div className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-muted transition-colors">
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                                <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 flex-1 basis-[100px]">
                                    <FaYoutube className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Enter a value..."
                                        className="bg-transparent focus:outline-none text-gray-700 w-full"
                                    />
                                </div>

                                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm">
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* meta setting */}
                        <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">
                            <div className="flex items-center gap-4 mb-4 ">
                                <VscSymbolKeyword className="text-purple-500 text-xl" />
                                <h2 className="text-base font-semibold">meta data</h2>
                            </div>


                            <div className="divide-y divide-gray-200">
                                {/* Meta data field */}
                                <div className="flex flex-col gap-2 px-2">
                                    <label htmlFor="metadata" className="text-base font-semibold py-2">Meta keywords</label>
                                    <p className="text-sm text-gray-500 divide-y py-2 divide-gray-200">
                                        The information provided below will reflect on your invoices
                                    </p>
                                    <textarea
                                        id="metadata"
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        placeholder="Enter metadata here..."
                                        rows={4}
                                    />
                                    <button className="self-start bg-violet-600 text-white font-semibold text-sm px-4 py-2 my-2 rounded-md hover:bg-violet-700 transition">
                                        Submit
                                    </button>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {/* Meta data field */}
                                <div className="flex flex-col gap-2 px-2">
                                    <label htmlFor="metadata" className="text-sm text-gray-700 font-medium py-2">Meta description</label>
                                    <textarea
                                        id="metadata"
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        placeholder="Enter metadata here..."
                                        rows={4}
                                    />
                                    <button className="self-start bg-violet-600 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">
                            <div className="flex items-center gap-4 mb-4 ">
                                <VscSymbolKeyword className="text-purple-500 text-xl" />
                                <h2 className="text-base font-semibold">meta data</h2>
                            </div>
                            <div className="divide-y divide-gray-200"></div>
                            <p className="text-sm text-gray-500 divide-y py-4 divide-gray-200">
                                The information provided below will reflect on your invoices
                            </p>
                            <button className="self-start bg-violet-600 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                delete account
                            </button>
                        </div>
                    </div>

                </div>
            </div>



        </div>

    );
};

export default Me;

