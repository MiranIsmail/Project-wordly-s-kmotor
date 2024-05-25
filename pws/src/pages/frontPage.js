import "./frontPage.css";
import React, { useRef, useState } from "react";
import { useAuth } from '../auth/authcontext';

function FrontPage() {
  const [data, setData] = useState(null);
  const letter1 = useRef();
  const letter2 = useRef();
  const letter3 = useRef();
  const letter4 = useRef();
  const letter5 = useRef();
  const lettersToExclude = useRef();
  const lettersToInclude = useRef();
  const { getToken } = useAuth();

  const [foundWordIndex, setIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const resetLetters = () => {
    letter1.current.value = "";
    letter2.current.value = "";
    letter3.current.value = "";
    letter4.current.value = "";
    letter5.current.value = "";
    lettersToExclude.current.value = "";
    lettersToInclude.current.value = "";
  };

  const selectFoundWord = (index) => {
    console.log(data.exists[index] + " - " + index);
    if (index === foundWordIndex) {
      setIndex(-1);
      return;
    }
    setIndex(index);
  }

  const sendWord = (wordIn) => {
    console.log("Correct word being sent - " + wordIn);
    // Asks the user if the word is correct with alert
    // If yes, send the word to the backend
    // If no, do nothing
    const confirmWord = window.confirm("Was "+ wordIn +" the correct word? The result will be stored.");
    console.log("Confirm word: " + confirmWord);
    if (confirmWord) {
      // Send the data to the server
      fetch('http://127.0.0.1:8000/correctWordGotten/?' + new URLSearchParams({
        word: wordIn, 
        tokenID: getToken()
      }), {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
      }).then(res => {
        console.log(res);
        if (!res.ok) {
          throw Error('Could not fetch the data for that resource');
        }
        return res.json();
      }).then(data => {
        console.log(data);
        if (data['success'] === 0) {
          alert(data['detail']);
        }
        else {
          alert("Data stored successfully");
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    }

  }


  const handleSubmit = () => {

    setIndex(-1);

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

    setLoading(true);

    fetch(
      `http://localhost:8000/word/?word=${word}&exclude=${exclude}&include=${include}&tokenID=${getToken()}`
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
        setLoading(false);
      })
      .catch(error => {console.error("Error:", error); setLoading(false);});
  };

  return (
    <div className="frontPage">
      <div className="upperdiv">
        <div>
          <h1>Enter the part of the word you know</h1>
        </div>
        {data && <h5>Words that match your criteria:</h5>}
        {!loading ? <div className="wordPart">
          <div className="wordlist"
            style={{ 
              width: "75%",
            }}
          >
            {data &&
              data.exists.map((item, index) => (
                <button
                  style={{ 
                    // background color is limegreen when choosen
                    background: index === foundWordIndex ? "limegreen " : "white",
                    color: index === foundWordIndex ? "white" : "black",
                  }}
                  onClick={() => {
                    selectFoundWord(index);
                  }}
                >
                  {item}
                </button>
              ))}{" "}
          </div>
          <div className="foundWordPart"
            style={{ 
              width: "25%",
            }}
          >
            {data && foundWordIndex === -1 &&
              <h3>Click on a word to see it</h3>
            }
            {data && foundWordIndex !== -1 && 
              <div className="contentWordPart">
                <h3>Correct word?</h3>
                <h2>{data.exists[foundWordIndex]}</h2>
                <button
                  onClick={() => {
                    sendWord(data.exists[foundWordIndex]);
                  }}
                >
                  Yes it is!
                </button>

              </div>
            }
          </div>
        </div>: <h1>Loading...</h1>}
      </div>
      <div className="middlediv">
        <div className="resetSearch">
          <button onClick={resetLetters}>Reset inputs</button>
        </div>
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
            placeholder="Excluded letters"
            maxLength={50}
            ref={lettersToExclude}
          />
          <input
            type="text"
            placeholder="Included letters"
            maxLength={50}
            ref={lettersToInclude}
          />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {/* <div className="lowerdiv"></div> */}
    </div>
  );
}

export default FrontPage;
