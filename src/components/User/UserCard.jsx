import { Link } from "react-router";

function UserCard({name, profile, email, id}) {
  return (
    <div className="w-full max-w-[300px] p-6 rounded-2xl shadow-lg text-center bg-white mx-auto">
      <img
        src={profile || "https://picsum.photos/200"}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover mx-auto mb-4 bg-black"
        loading="lazy"
        draggable={false}
      />
      <h2 className="text-xl font-semibold mb-1">{name}</h2>
      <p className="text-gray-500 mb-4 max-w-[250px] mx-auto break-words ">{email}</p>
      <Link to={`/user/${id}`}
        type="button"
        className="w-full block py-2 px-4 bg-indigo-600 text-white rounded-lg transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="Manage user"
      >
        Manage
      </Link>
    </div>
  );
}

export default UserCard;

