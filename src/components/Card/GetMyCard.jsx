import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateCard from "./CreateCard";

function GetMyCard({role}) {
  const { userId } = useParams(); // assumes route like /card/:userId
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateCardForm, setIsCreateCardForm] = useState(false);

  let url;
  if(role==="admin"){
    url=`https://api.thryvoo.com/api/admin/user/${userId}/card`
  }
  else{
    url="https://api.thryvoo.com/api/user/card"
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white p-6 rounded-2xl shadow-md text-center">
        {card ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Card Found ✅</h2>
            <p className="mb-4 text-gray-600">Card ID: {card._id}</p>
            <a
              href={`/card/${card._id}`}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              View Card
            </a>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">No Card Found</h2>
            <p className="mb-4 text-gray-600">Looks like this user hasn't created a card yet.</p>
            <button
              onClick={handleCreateCard}
              className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Create Card
            </button>

            {isCreateCardForm && (
              <CreateCard
                userId={userId}
                onClose={() => setIsCreateCardForm(false)}
                onSubmit={(data) => {
                  console.log("Updated data:", data);
                  setIsCreateCardForm(false);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GetMyCard;
