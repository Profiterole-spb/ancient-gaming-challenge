import {useEffect, useRef} from "react";
import Experience from "./Experience.js";

export default function Test1() {
  const containerRef = useRef();
  useEffect(() => {
    const experience = new Experience()
    containerRef.current.appendChild(experience.view)
    return () => {experience.destroy(true)}
  }, [])
  return <div className={'canvas-wrapper'} ref={containerRef}></div>
}
