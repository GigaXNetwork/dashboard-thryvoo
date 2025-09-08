import { useState } from "react";
import { useParams } from "react-router";
import BasicData from "./BasicData";
import Social from "./Social";
import Meta from "./Meta";
import { useCard } from "../../Context/CardContext";
import ProfileBanner from "./Pofilebanner";
import BasicDataSec from "./BasicDataSec";
import UpdateFieldModal from "./Modal/BasicModal";
import AddressSec from "./AddressSec";
import AddressModal from "./Modal/AddressModal";
import SocialSec from "./SocialSec";
import UpdateSocialModal from "./Modal/SocialModal";
import UpdateMetaModal from "./Modal/MetaModal";
import MetaDataSec from "./MetaDataSec";
import CategorySec from "./CategorySec";
import UpdateCategoryModal from "./Modal/CategoryModal";
import BrochuresSec from "./BrochuresSec";
import UploadBrochureModal from "./Modal/UploadBrochureModal";


function Items({ role }) {
  const { cardData, setCardData, loading, error } = useCard();
  const { cardId } = useParams();
  // Instead of multiple states → use one
  const [modalField, setModalField] = useState(null);
  const [modalSocialField, setModalSocialField] = useState(null);
  const [addressModal, setAddressModal] = useState(null);
  const [metaField, setMetaField] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [brochureModal, setBrochureModal] = useState(false);

  const handleOpenModal = (field, label) => {
    setModalField({ field, label });
  };
  const handleOpenSocialModal = (field, label) => {
    setModalSocialField({ field, label });
  };
  const handleOpenMetaModal = (field, label) => {
    setMetaField({ field, label });
  };

  const handleCloseModal = () => {
    setModalField(null);
    setModalSocialField(null);
    setAddressModal(null);
    setMetaField(null);
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({}); // ✅ Added formData state

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (updated) => {
    setCardData((prev) => ({
      ...prev,
      ...updated,
    }));
  }

  const onSocialSubmit = (updated) => {
    setCardData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        ...updated, // merge updated socials inside
      },
    }));
  };


  return (
    <div className="relative my-10 max-w-screen-lg mx-auto">

      <ProfileBanner logo={cardData?.logo} photo={cardData?.photo} />
      <BasicDataSec cardData={cardData} openModal={handleOpenModal} />
      <CategorySec cardData={cardData} openModal={() => setCategoryModal(true)} />
      <AddressSec cardData={cardData} openModal={() => setAddressModal(true)} />
      <SocialSec cardData={cardData} openModal={handleOpenSocialModal} />
      <MetaDataSec cardData={cardData} openModal={handleOpenMetaModal} />
      <BrochuresSec cardData={cardData} openModal={() => setBrochureModal(true)} />


      {modalField && (
        <UpdateFieldModal
          field={modalField.field}
          label={modalField.label}
          cardData={cardData}
          cardId={cardData?._id}
          role={role}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}

      {addressModal && (
        <AddressModal
          cardData={cardData}
          cardId={cardId}
          role={role}
          onClose={() => setAddressModal(false)}
          onSubmit={onSubmit}
        />
      )}

      {modalSocialField && (
        <UpdateSocialModal
          field={modalSocialField.field}
          label={modalSocialField.label}
          cardData={cardData}
          cardId={cardData?._id}
          role={role}
          onClose={handleCloseModal}
          onSubmit={onSocialSubmit}
        />
      )}

      {metaField && (
        <UpdateMetaModal
          field={metaField.field}
          label={metaField.label}
          cardData={cardData}
          cardId={cardData?._id}
          role={role}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}


      {categoryModal && (
        <UpdateCategoryModal
          cardData={cardData}
          cardId={cardId}
          role={role}
          onClose={() => setCategoryModal(false)}
          onSubmit={onSubmit}
        />
      )}

      {brochureModal && (
        <UploadBrochureModal
          cardData={cardData}
          cardId={cardId}
          role={role}
          onClose={() => setBrochureModal(false)}
          onSubmit={onSubmit}
        />
      )}

      {/* <div className="flex flex-wrap gap-4">

        <div className="min-h-screen flex flex-1 basis-auto items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">
                {step === 1 && "Set up your profile"}
                {step === 2 && "You're all set!"}
                {step === 3 && "You're all set!"}
                {step === 4 && "You're all set!"}
              </h2>
              <p className="text-sm text-gray-500 mt-2">Step {step} of 4</p>
            </div>



            {step === 1 && (
              <BasicData
                handleBack={handleBack}
                handleNext={handleNext}
                handleChange={handleChange}
                cardId={cardId}
                role={role}
              />
            )}

            {step === 2 && (
              <Social
                handleBack={handleBack}
                handleNext={handleNext}
                handleChange={handleChange}
                cardId={cardId}
                role={role}
              />
            )}

            {step === 3 && (
              <Meta
                handleBack={handleBack}
                handleNext={handleNext}
                handleChange={handleChange}
                cardId={cardId}
                role={role}
              />
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-2xl font-semibold mb-4 text-green-600">🎉 Your card is created successfully!</h2>
                <p className="mb-6 text-gray-700">You can now view or share your digital card.</p>
                <a
                  href={`/card`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Card
                </a>
              </div>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Items;
