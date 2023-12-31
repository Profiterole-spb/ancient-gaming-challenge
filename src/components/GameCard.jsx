import {Link} from "react-router-dom";

export default function GameCard({title = 'Title', href = '/'}) {
  return <Link to={href} className={"p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 hover:bg-blue-300 hover:text-blue-50 hover:cursor-pointer" }>
    <div>{title}</div>
  </Link>
}
