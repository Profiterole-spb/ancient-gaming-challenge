import {Link, useParams} from "react-router-dom";
import Test1 from "../tasks/test1/Test1.jsx";
import Test2 from "../tasks/test2/Test2.jsx";
import Test3 from "../tasks/test3/Test3.jsx";

export default function Game() {
  const {title} = useParams();
  return (<div className={"w-full h-full flex flex-col"}>
    <header className={"bg-blue-400"}>
      <Link to="/" className={"p-1 text-blue-50"}>Back to lobby</Link>
    </header>
    <main className={"content w-full flex-auto relative overflow-hidden"}>
      {title==='test1' && <Test1/>}
      {title==='test2' && <Test2/>}
      {title==='test3' && <Test3/>}
    </main>
  </div>)
}
