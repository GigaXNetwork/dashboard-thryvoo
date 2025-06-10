import { useState } from "react";
import TopNav from "../Common/TopNav";
import Theme from "./Theme";
import { useParams } from "react-router";
import BasicData from "./BasicData";
import Social from "./Social";
import Meta from "./Meta";
import { useCard } from "../../Context/CardContext";


function Items({role}) {
  const { cardData, loading, error } = useCard()
  console.log("card data", cardData, loading, error);

  const { cardId } = useParams();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({}); // ✅ Added formData state

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // ✅ Example submit logic — replace with your own
    console.log("Form submitted:", formData);
    // Redirect to dashboard or show confirmation
  };

  return (
    <div className="mt-10">


      <div className="flex flex-wrap gap-4">
        {/* Left: Step content */}
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
      </div>
    </div>
  );
}

export default Items;
