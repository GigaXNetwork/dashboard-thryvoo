// import { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router";
// import { useCard } from "../../Context/CardContext";
// import {
//   Settings,
//   User,
//   MapPin,
//   Share2,
//   Tag,
//   FileText,
//   Image,
//   Layers
// } from "lucide-react";

// import ProfileBanner from "./Pofilebanner";
// import BasicDataSec from "./BasicDataSec";
// import AddressSec from "./AddressSec";
// import SocialSec from "./SocialSec";
// import MetaDataSec from "./MetaDataSec";
// import CategorySec from "./CategorySec";
// import BrochuresSec from "./BrochuresSec";

// import UpdateFieldModal from "./Modal/BasicModal";
// import AddressModal from "./Modal/AddressModal";
// import UpdateSocialModal from "./Modal/SocialModal";
// import UpdateMetaModal from "./Modal/MetaModal";
// import UpdateCategoryModal from "./Modal/CategoryModal";
// import UploadBrochureModal from "./Modal/UploadBrochureModal";
// import UploadPhotoModal from "./Modal/PhotoModal";
// import UploadLogoModal from "./Modal/LogoModal";
// import GallerySec from "./GallerySec";
// import UploadGalleryModal from "./Modal/UploadGalleryModal";
// import { FaGlobe } from "react-icons/fa";

// function Items({ role }) {
//   const { cardData, setCardData } = useCard();
//   const { cardId } = useParams();

//   // State for modals
//   const [modalField, setModalField] = useState(null);
//   const [modalSocialField, setModalSocialField] = useState(null);
//   const [addressModal, setAddressModal] = useState(false);
//   const [metaField, setMetaField] = useState(null);
//   const [categoryModal, setCategoryModal] = useState(false);
//   const [brochureModal, setBrochureModal] = useState(false);
//   const [showLogoModal, setShowLogoModal] = useState(false);
//   const [showPhotoModal, setShowPhotoModal] = useState(false);
//   const [showGalleryModal, setShowGalleryModal] = useState(false);

//   // Refs for card content scrolling
//   const contentRef = useRef(null);

//   // Navigation items for sidebar
//   const navItems = [
//     { id: 'basic', icon: User, label: 'Basic Information', component: BasicDataSec },
//     { id: 'category', icon: Tag, label: 'Categories', component: CategorySec },
//     { id: 'address', icon: MapPin, label: 'Address', component: AddressSec },
//     { id: 'social', icon: Share2, label: 'Social Links', component: SocialSec },
//     { id: 'meta', icon: FaGlobe, label: 'Meta Information', component: MetaDataSec },
//     { id: 'brochures', icon: FileText, label: 'Brochures', component: BrochuresSec },
//     { id: 'gallery', icon: Image, label: 'Gallery', component: GallerySec },
//   ];

//   const [activeSection, setActiveSection] = useState('basic');
//   const ActiveComponent = navItems.find(item => item.id === activeSection)?.component;

//   // Auto-scroll to top on mobile when section changes
//   useEffect(() => {
//     if (contentRef.current && window.innerWidth < 1024) {
//       contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }, [activeSection]);



//   // Handlers
//   const handleSectionChange = (sectionId) => {
//     setActiveSection(sectionId);
//     if (window.innerWidth < 1024 && contentRef.current) {
//       setTimeout(() => {
//         contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
//       }, 100);
//     }
//   };

//   const handleOpenModal = (field, label) => setModalField({ field, label });
//   const handleOpenSocialModal = (field, label) => setModalSocialField({ field, label });
//   const handleOpenMetaModal = (field, label) => setMetaField({ field, label });
//   const handleCloseModal = () => {
//     setModalField(null);
//     setModalSocialField(null);
//     setMetaField(null);
//   };
//   const onSubmit = (updated) => {
//     setCardData((prev) => ({
//       ...prev,
//       ...updated,
//     }));
//   };
//   const onSocialSubmit = (updated) => {
//     setCardData((prev) => ({
//       ...prev,
//       social: {
//         ...prev.social,
//         ...updated,
//       },
//     }));
//   };

//   return (
//     <div className="h-full bg-gray-50/30 flex flex-col">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
//         {/* Header */}
//         {/* <div className="mb-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
//               <p className="text-gray-600 mt-2">Manage your business information and online presence</p>
//             </div>
//           </div>
//         </div> */}
//         <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//           <div className="flex flex-col lg:flex-row">
//             {/* Sidebar Navigation */}
//             <div className="lg:w-80 flex-shrink-0 border-r border-gray-200">
//               <div className="p-4">
//                 <nav className="space-y-1">
//                   {navItems.map((item) => {
//                     const Icon = item.icon;
//                     return (
//                       <button
//                         key={item.id}
//                         onClick={() => handleSectionChange(item.id)}
//                         className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-200 border border-blue-500/10 rounded-2xl ${activeSection === item.id
//                             ? 'text-blue-700 border-blue-600 bg-blue-50/50'
//                             : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50/50'
//                           }`}
//                       >
//                         <Icon className="w-5 h-5 flex-shrink-0" />
//                         <span className="font-medium">{item.label}</span>
//                       </button>
//                     );
//                   })}
//                 </nav>
//               </div>
//             </div>
//             {/* Main Content Area - Scrollable */}
//             <div className="flex-1 relative">
//               {/* Divider for mobile */}
//               <div className="lg:hidden border-t border-gray-200"></div>
//               {/* Scrollable content */}
//               <div
//                 ref={contentRef}
//                 className="
//                   h-full 
//                   max-h-[70vh] lg:max-h-[75vh] 
//                   overflow-y-auto 
//                   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
//                   px-6 py-6
//                 "
//                 style={{
//                   // Optional: force scroll only on card, not page.
//                   overscrollBehavior: "contain",
//                 }}
//               >
//                 {activeSection === 'basic' ? (
//                   <>
//                     <div className="flex items-start gap-6 mb-8">
//                       <div className="flex-shrink-0">
//                         <div className="relative">
//                           <img
//                             src={cardData?.photo}
//                             alt="Profile"
//                             className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
//                           />
//                           <button
//                             onClick={() => setShowPhotoModal(true)}
//                             className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
//                             title="Change profile photo"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                       <div className="flex-1">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
//                         <p className="text-gray-600 text-lg">Manage your business name, contact details, and basic information</p>
//                       </div>
//                     </div>
//                     <BasicDataSec
//                       cardData={cardData}
//                       openModal={handleOpenModal}
//                       isExpanded={true}
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <div className="mb-8">
//                       <h2 className="text-xl font-bold text-gray-500 mb-0 uppercase">
//                         {navItems.find(item => item.id === activeSection)?.label}
//                       </h2>
//                       <p className="text-gray-600 text-sm">
//                         {activeSection === 'category' && 'Manage your business categories and services'}
//                         {activeSection === 'address' && 'Update your business location and address details'}
//                         {activeSection === 'social' && 'Connect your social media profiles and links'}
//                         {activeSection === 'meta' && 'Optimize your SEO settings and meta information'}
//                         {activeSection === 'brochures' && 'Upload and manage your brochures and price lists'}
//                         {activeSection === 'gallery' && 'Manage your business photos and gallery'}
//                       </p>
//                     </div>
//                     {ActiveComponent && (
//                       <ActiveComponent
//                         cardData={cardData}
//                         setCardData={setCardData}
//                         openModal={
//                           activeSection === 'social' ? handleOpenSocialModal :
//                             activeSection === 'meta' ? handleOpenMetaModal :
//                               activeSection === 'category' ? () => setCategoryModal(true) :
//                                 activeSection === 'address' ? () => setAddressModal(true) :
//                                   activeSection === 'brochures' ? () => setBrochureModal(true) :
//                                     activeSection === 'gallery' ? () => setShowGalleryModal(true) :
//                                       () => { }
//                         }
//                         isExpanded={true}
//                       />
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Modals */}
//       {modalField && (
//         <UpdateFieldModal
//           field={modalField.field}
//           label={modalField.label}
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={handleCloseModal}
//           onSubmit={onSubmit}
//         />
//       )}
//       {addressModal && (
//         <AddressModal
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={() => setAddressModal(false)}
//           onSubmit={onSubmit}
//         />
//       )}
//       {modalSocialField && (
//         <UpdateSocialModal
//           field={modalSocialField.field}
//           label={modalSocialField.label}
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={handleCloseModal}
//           onSubmit={onSocialSubmit}
//         />
//       )}
//       {metaField && (
//         <UpdateMetaModal
//           field={metaField.field}
//           label={metaField.label}
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={handleCloseModal}
//           onSubmit={onSubmit}
//         />
//       )}
//       {categoryModal && (
//         <UpdateCategoryModal
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={() => setCategoryModal(false)}
//           onSubmit={onSubmit}
//         />
//       )}
//       {brochureModal && (
//         <UploadBrochureModal
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={() => setBrochureModal(false)}
//           onSubmit={onSubmit}
//         />
//       )}
//       {showLogoModal && (
//         <UploadLogoModal
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={() => setShowLogoModal(false)}
//           onSubmit={onSubmit}
//         />
//       )}
//       {showPhotoModal && (
//         <UploadPhotoModal
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={() => setShowPhotoModal(false)}
//           onSubmit={onSubmit}
//         />
//       )}
//       {showGalleryModal && (
//         <UploadGalleryModal
//           cardData={cardData}
//           cardId={cardId}
//           role={role}
//           onClose={() => setShowGalleryModal(false)}
//           onSubmit={onSubmit}
//         />
//       )}
//     </div>
//   );
// }

// export default Items;


import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { useCard } from "../../Context/CardContext";
import {
  Settings,
  User,
  MapPin,
  Share2,
  Tag,
  FileText,
  Image,
  Layers
} from "lucide-react";

import ProfileBanner from "./Pofilebanner";
import BasicDataSec from "./BasicDataSec";
import AddressSec from "./AddressSec";
import SocialSec from "./SocialSec";
import MetaDataSec from "./MetaDataSec";
import CategorySec from "./CategorySec";
import BrochuresSec from "./BrochuresSec";

import UpdateFieldModal from "./Modal/BasicModal";
import AddressModal from "./Modal/AddressModal";
import UpdateSocialModal from "./Modal/SocialModal";
import UpdateMetaModal from "./Modal/MetaModal";
import UpdateCategoryModal from "./Modal/CategoryModal";
import UploadBrochureModal from "./Modal/UploadBrochureModal";
import UploadPhotoModal from "./Modal/PhotoModal";
import UploadLogoModal from "./Modal/LogoModal";
import GallerySec from "./GallerySec";
import UploadGalleryModal from "./Modal/UploadGalleryModal";
import { FaGlobe } from "react-icons/fa";

function Items({ role }) {
  const { cardData, setCardData } = useCard();
  const { cardId } = useParams();

  // State for modals
  const [modalField, setModalField] = useState(null);
  const [modalSocialField, setModalSocialField] = useState(null);
  const [addressModal, setAddressModal] = useState(false);
  const [metaField, setMetaField] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [brochureModal, setBrochureModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Refs for card content scrolling
  const contentRef = useRef(null);

  // Navigation items for sidebar
  const navItems = [
    { id: 'basic', icon: User, label: 'Basic Information', component: BasicDataSec },
    { id: 'category', icon: Tag, label: 'Categories', component: CategorySec },
    { id: 'address', icon: MapPin, label: 'Address', component: AddressSec },
    { id: 'social', icon: Share2, label: 'Social Links', component: SocialSec },
    { id: 'meta', icon: FaGlobe, label: 'Meta Information', component: MetaDataSec },
    { id: 'brochures', icon: FileText, label: 'Price List / Brochures', component: BrochuresSec },
    { id: 'gallery', icon: Image, label: 'Gallery', component: GallerySec },
  ];

  const [activeSection, setActiveSection] = useState('basic');
  const ActiveComponent = navItems.find(item => item.id === activeSection)?.component;

  // Auto-scroll to top on mobile when section changes
  useEffect(() => {
    if (contentRef.current && window.innerWidth < 1024) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  // Handlers
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (window.innerWidth < 1024 && contentRef.current) {
      setTimeout(() => {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleOpenModal = (field, label) => setModalField({ field, label });
  const handleOpenSocialModal = (field, label) => setModalSocialField({ field, label });
  const handleOpenMetaModal = (field, label) => setMetaField({ field, label });
  const handleCloseModal = () => {
    setModalField(null);
    setModalSocialField(null);
    setMetaField(null);
  };

  const onSubmit = (updated) => {
    setCardData((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const onSocialSubmit = (updated) => {
    setCardData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        ...updated,
      },
    }));
  };

  return (
    <div className="h-full bg-gray-50/30 flex flex-col">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        {/* Profile Banner Section */}
        <div className="mb-6">
          <ProfileBanner
            logo={cardData?.logo}
            photo={cardData?.photo}
            onOpenLogoModal={() => setShowLogoModal(true)}
            onOpenPhotoModal={() => setShowPhotoModal(true)}
            logoAlt={`${cardData?.businessName || 'Business'} logo`}
            bannerAlt={`${cardData?.businessName || 'Business'} banner`}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <div className="lg:w-80 flex-shrink-0 border-r border-gray-200">
              <div className="p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSectionChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-200 border border-blue-500/10 rounded-2xl ${activeSection === item.id
                            ? 'text-blue-700 border-blue-600 bg-blue-50/50'
                            : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50/50'
                          }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 relative">
              {/* Divider for mobile */}
              <div className="lg:hidden border-t border-gray-200"></div>
              
              {/* Scrollable content */}
              <div
                ref={contentRef}
                className="
                  h-full 
                  max-h-[60vh] lg:max-h-[65vh] 
                  overflow-y-auto 
                  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
                  px-6 py-6
                "
                style={{
                  overscrollBehavior: "contain",
                }}
              >
                {activeSection === 'basic' ? (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                      <p className="text-gray-600 text-lg">Manage your business name, contact details, and basic information</p>
                    </div>
                    <BasicDataSec
                      cardData={cardData}
                      openModal={handleOpenModal}
                      isExpanded={true}
                    />
                  </>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-500 mb-0 uppercase">
                        {navItems.find(item => item.id === activeSection)?.label}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {activeSection === 'category' && 'Manage your business categories and services'}
                        {activeSection === 'address' && 'Update your business location and address details'}
                        {activeSection === 'social' && 'Connect your social media profiles and links'}
                        {activeSection === 'meta' && 'Optimize your SEO settings and meta information'}
                        {activeSection === 'brochures' && 'Upload and manage your brochures and price lists'}
                        {activeSection === 'gallery' && 'Manage your business photos and gallery'}
                      </p>
                    </div>
                    {ActiveComponent && (
                      <ActiveComponent
                        cardData={cardData}
                        setCardData={setCardData}
                        openModal={
                          activeSection === 'social' ? handleOpenSocialModal :
                            activeSection === 'meta' ? handleOpenMetaModal :
                              activeSection === 'category' ? () => setCategoryModal(true) :
                                activeSection === 'address' ? () => setAddressModal(true) :
                                  activeSection === 'brochures' ? () => setBrochureModal(true) :
                                    activeSection === 'gallery' ? () => setShowGalleryModal(true) :
                                      () => { }
                        }
                        isExpanded={true}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalField && (
        <UpdateFieldModal
          field={modalField.field}
          label={modalField.label}
          cardData={cardData}
          cardId={cardId}
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
          cardId={cardId}
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
          cardId={cardId}
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
      {showLogoModal && (
        <UploadLogoModal
          cardData={cardData}
          cardId={cardId}
          role={role}
          onClose={() => setShowLogoModal(false)}
          onSubmit={onSubmit}
        />
      )}
      {showPhotoModal && (
        <UploadPhotoModal
          cardData={cardData}
          cardId={cardId}
          role={role}
          onClose={() => setShowPhotoModal(false)}
          onSubmit={onSubmit}
        />
      )}
      {showGalleryModal && (
        <UploadGalleryModal
          cardData={cardData}
          cardId={cardId}
          role={role}
          onClose={() => setShowGalleryModal(false)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

export default Items;