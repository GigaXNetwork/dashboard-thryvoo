
import { Link } from "react-router"

function MenuCard({id,title, logo, img}) {
console.log(logo, img);

  
  return (
    <Link to={`/card/${id}`} className="rounded-[10px] overflow-hidden transition duration-500 text-white relative">
        <img src={img} alt="food" className="object-cover w-full" />
      <div className="h-1/2 bg-gradient-to-t from-blue-500 to-purple-600 absolute bottom-0 w-full flex items-center flex-col border-t-2">
        <div className="transform -translate-y-[50px] flex items-center flex-col gap-1">
        <img src={logo} alt="logo" className="rounded-full h-[100px] w-[100px] border-2 border-white"/>
        <h2 className="text-center text-2xl font-bold">{title}</h2>
        </div>
      </div>
      
    </Link>
  )
}

export default MenuCard;