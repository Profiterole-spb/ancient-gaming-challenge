import {useParams} from "react-router-dom";
import Test1 from "../tasks/test1/Test1.jsx";
import Test2 from "../tasks/test2/Test2.jsx";
import Test3 from "../tasks/test3/Test3.jsx";

export default function Game() {
  const {title} = useParams();
  return (<>
    <header className={"bg-blue-400"}>
      <a href="/" className={"p-1 text-blue-50"}>Back to lobby</a>
    </header>
    <main>
      {title==='test1' && <Test1/>}
      {title==='test2' && <Test2/>}
      {title==='test3' && <Test3/>}
    </main>
  </>)
}
