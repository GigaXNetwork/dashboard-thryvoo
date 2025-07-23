
import { VscSymbolKeyword } from "react-icons/vsc";
import UpdateNameModal from '../Form/NameChange';
import { useState } from 'react';
import UpdateAddressForm from '../Form/UpdateAddressForm';
import UpdatePhoneForm from '../Modals/UpdatePhoneForm';
import AccountSettingsCard from './AccountSettingsCard';
import PersonalInformationCard from './PersonalInformationCard';
import AddressModal from '../Modals/AddressModal';
import ChangePhotoModal from "./ChangePhotoModel";


const Me = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPhotoUpload, setIsPhotoUpload] = useState(false);
    const [isAddressForm, setIsAddressForm] = useState(false);
    const [isPhoneForm, setIsPhoneForm] = useState(false);
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

                {/* account information */}
                <PersonalInformationCard
                    setIsModalOpen={setIsModalOpen}
                    setIsAddressForm={setIsAddressForm}
                    setIsPhotoUpload={setIsPhotoUpload}
                    setIsPhoneForm={setIsPhoneForm}
                />

                <AccountSettingsCard />


                {/* social media tabs */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">

                    <div className="bg-white shadow-md rounded-lg p-6 w-full my-5 divide-y py-4 divide-gray-200">
                        <div className="flex items-center gap-4 mb-4 ">
                            <VscSymbolKeyword className="text-purple-500 text-xl" />
                            <h2 className="text-base font-semibold">Account Control</h2>
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

            {isPhotoUpload && (
                <ChangePhotoModal onClose={() => setIsPhotoUpload(false)} />
            )}
            {isAddressForm && (
                <AddressModal onClose={() => setIsAddressForm(false)} />
            )}
        </div>

    );
};

export default Me;

