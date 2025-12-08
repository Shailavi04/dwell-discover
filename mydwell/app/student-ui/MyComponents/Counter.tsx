"use client";
import { useState } from "react";
const Counter = () => {
  console.log("Counter component");
  const [count, setCount] = useState(0);

  return (
    <button 
      onClick={() => setCount(count + 1)} 
      className="p-2 bg-blue-500 text-black rounded"
    >
      Clicked {count} times
    </button>
  );
}; export default Counter;