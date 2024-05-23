import "./frontPage.css";
import React, { useRef, useState } from "react";

function FrontPage() {
  const [data, setData] = useState(null);
  const letter1 = useRef();
  const letter2 = useRef();
  const letter3 = useRef();
  const letter4 = useRef();
  const letter5 = useRef();
  const lettersToExclude = useRef();
  const lettersToInclude = useRef();

  const resetLetters = () => {
    letter1.current.value = "";
    letter2.current.value = "";
    letter3.current.value = "";
    letter4.current.value = "";
    letter5.current.value = "";
    lettersToExclude.current.value = "";
    lettersToInclude.current.value = "";
  };


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
    if (lettersToExclude.current.value === "") {
      lettersToExclude.current.value = "£";
    }
    if (lettersToInclude.current.value === "") {
      lettersToInclude.current.value = letter1.current.value;
    }
    const word =
      letter1.current.value +
      letter2.current.value +
      letter3.current.value +
      letter4.current.value +
      letter5.current.value;
    const exclude = lettersToExclude.current.value;
    const include = lettersToInclude.current.value;
    fetch(
      `http://localhost:8000/word/?word=${word}&exclude=${exclude}&include=${include}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        // Revett characters to default if = _
        if (letter1.current.value === "_") {
          letter1.current.value = "";
        }
        if (letter2.current.value === "_") {
          letter2.current.value = "";
        }
        if (letter3.current.value === "_") {
          letter3.current.value = "";
        }
        if (letter4.current.value === "_") {
          letter4.current.value = "";
        }
        if (letter5.current.value === "_") {
          letter5.current.value = "";
        }
        if (lettersToExclude.current.value === "£") {
          lettersToExclude.current.value = "";
        }
        if (lettersToInclude.current.value === letter1.current.value) {
          lettersToInclude.current.value = "";
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="frontPage">
      <div className="upperdiv">
        <div>
          <h1>Enter the part of the word you know</h1>
        </div>
        {data && <h5>Words that match your criteria:</h5>}
        <div
          className="wordlist" /*TEMPORARY FIX THIS SHOULD BE MUCH MORE USER FRIENDLY!!!!*/
        >
          {data &&
            data.exists.map((item, index) => (
              <div key={index}>{item}</div>
            ))}{" "}
        </div>
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
          <input //RIGHT NOW WE DO ONLY ONE LETTER// THIS SHOULD BE FIXED TO HAVE MORE LETTERS// DO IT AFTER ASSIGMENT !!!!!!!
            type="text"
            placeholder="Enter a letter to exclude"
            maxLength={50}
            ref={lettersToExclude}
          />
          <input
            type="text"
            placeholder="Enter a letter to include"
            maxLength={50}
            ref={lettersToInclude}
          />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div className="lowerdiv"></div>
    </div>
  );
}

export default FrontPage;
