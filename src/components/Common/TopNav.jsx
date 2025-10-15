import { Link } from "react-router-dom";

const TopNav = ({ Maintitle,title, buttonTitle, navLinks }) => {
  return (
    <div className="flex items-center justify-between  px-6 py-4 rounded-md shadow-sm">
      {/* Left Side - Title and Breadcrumb */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">{Maintitle}</h1>
        <div className="h-6 border-l border-gray-300"></div>

        <div className="flex items-center text-sm text-gray-500 gap-1">
          {navLinks.map((link, index) =>
            link.path === "/" ? (
              <Link
                to={link.path}
                key={index}
                className="text-sm text-gray-500 hover:text-gray-800 transition flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
                  />
                </svg> -
              </Link>
            ) : (
              <Link
                to={link.path}
                key={index}
                className="text-sm text-gray-500 hover:text-gray-800 transition"
              >
                {link.label} -
              </Link> 
            ) 
          ) }
          <span className="hover:text-gray-800 transition"> {title}</span>
        </div>
      </div>

      {/* Right Side - Button */}
      {typeof buttonTitle === "string" && (

        <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {buttonTitle}
        </button>
      )}

    </div>
  );
};

export default TopNav;
