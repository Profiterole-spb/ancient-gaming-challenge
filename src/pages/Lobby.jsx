import GameCard from "../components/GameCard.jsx";

export default function Lobby() {
  return (<>
      <header className={"bg-blue-400"}>
        <h1 className={"p-3 text-blue-50"}>Technical test | Lobby</h1>
      </header>
      <main>
        <ul className={"mt-8"}>
          <li className={"p-2"}><GameCard title={'Test 1'} href={'/game?title=test1'}/></li>
          <li className={"p-2"}><GameCard title={'Test 2'} href={'/game?title=test2'}/></li>
          <li className={"p-2"}><GameCard title={'Test 3'} href={'/game?title=test2'}/></li>
        </ul>
      </main>
  </>
  )
}
