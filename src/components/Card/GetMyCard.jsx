import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateCard from "./CreateCard";
import QRCodeGenerator from "./QRCodeGenerator";
import { Badge, CheckCircle, ExternalLink, Plus } from "lucide-react";
import Active from "./Active";

function GetMyCard({ role }) {
  const { userId } = useParams(); // assumes route like /card/:userId
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateCardForm, setIsCreateCardForm] = useState(false);
  const [cardUrl, setcardUrl] = useState();
  const [activeTab, setActiveTab] = useState("card");

  console.log("user card ", userId);


  let url;
  if (role === "admin") {
    console.log("this is admin");

    url = `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/card`
  }
  else {
    console.log("this is user");

    url = `${import.meta.env.VITE_API_URL}/api/user/card`
  }

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        console.log(response);

        if (response.status === 404) {
          setCard(null);
        } else if (!response.ok) {
          throw new Error("Failed to fetch card");
        } else {
          const data = await response.json();
          setCard(data.data.card);
          setcardUrl(`https://thryvoo.com/b/${data.data.card.slug}`)
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [userId]);
  console.log(card);

  const handleCreateCard = () => {
    // Navigate to card creation page or open modal
    setIsCreateCardForm(true);
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  console.log("card ", card);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border rounded-sm p-4 ">
          <div className="p-8">
            {card ? (
              <div className="text-center space-y-6">
                {/* Success Header */}


                {/* Card Details */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{card.name}</h2>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white
                     py-2 text-lg font-medium"
                    size="lg"
                  >
                    <a href={`/card/${card._id}`}>View Business Card</a>
                  </button>

                  <button
                    asChild
                    variant="outline"
                    className="w-full border-blue-600 rounded-sm text-blue-600
                     hover:bg-blue-50 py-2 text-lg font-medium"
                    size="lg"
                  >
                    <a href={cardUrl} className="flex items-center rounded-sm justify-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Visit Business Profile
                    </a>
                  </button>
                </div>

                {/* QR Code Section */}
                <div className="pt-4 border-t border-gray-200">
                  <QRCodeGenerator url={cardUrl} />
                </div>

                {activeTab && (<Active card={{
                  _id: card._id,
                  status: card.status,
                  expireAt: card.expire
                }} />)}
              </div>
            ) : (
              <div className="text-center space-y-6">
                {/* No Card Header */}
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">No Card Found</h1>
                  <p className="text-gray-600 text-lg">Looks like this user hasn't created a business card yet.</p>
                </div>

                {/* Create Card button */}
                <button
                  onClick={handleCreateCard}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Business Card
                </button>

                {/* Create Card Form */}
                {isCreateCardForm && (
                  <CreateCard
                    userId={userId}
                    onClose={() => setIsCreateCardForm(false)}
                    onSubmit={(newCard) => {
                      setCard(newCard); // Update the card state with the newly created card
                      if (newCard.slug) {
                        setcardUrl(`https://thryvoo.com/b/${newCard.slug}`);
                      }
                      setIsCreateCardForm(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}

export default GetMyCard;
