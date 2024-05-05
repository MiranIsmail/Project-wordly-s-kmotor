import "./frontPage.css";
import React, { useRef } from "react";

function FrontPage() {
  const letter1 = useRef();
  const letter2 = useRef();
  const letter3 = useRef();
  const letter4 = useRef();
  const letter5 = useRef();

  const handleSubmit = () => {
    if (letter1.current.value === "") {
      letter1.current.value = "_";
    }
    if (letter2.current.value === "") {
      letter2.current.value = "_";
    }
    if (letter3.current.value === "") {
      letter3.current.value = "_";
    }
    if (letter4.current.value === "") {
      letter4.current.value = "_";
    }
    if (letter5.current.value === "") {
      letter5.current.value = "_";
    }
    const word =
      letter1.current.value +
      letter2.current.value +
      letter3.current.value +
      letter4.current.value +
      letter5.current.value;
    fetch(`http://localhost:8000/word/?word=${word}`)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="frontPage">
      <div className="upperdiv">
        <h1>Enter the part of the word you know</h1>
      </div>
      <div className="middlediv">
        <div className="word">
          <input type="text" placeholder="W" maxLength={1} ref={letter1} />
          <input type="text" placeholder="O" maxLength={1} ref={letter2} />
          <input type="text" placeholder="R" maxLength={1} ref={letter3} />
          <input type="text" placeholder="D" maxLength={1} ref={letter4} />
          <input type="text" placeholder="S" maxLength={1} ref={letter5} />
        </div>
        <div className="letters">
          <input
            type="text"
            placeholder="Enter the letters to exclude like 'abc' "
          />
          <input type="text" placeholder="Enter the letters to include 'abc'" />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div className="lowerdiv"></div>
    </div>
  );
}

export default FrontPage;
