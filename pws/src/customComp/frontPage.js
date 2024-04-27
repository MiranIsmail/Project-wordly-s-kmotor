import "./frontPage.css";

function FrontPage() {
  return (
    <div className="frontPage">
      <div className="upperdiv">
        <h1>Enter the part of the word you know</h1>
      </div>
      <div className="middlediv">
        <div className="word">
          <input type="text" placeholder="W" maxLength={1} />
          <input type="text" placeholder="O" maxLength={1} />
          <input type="text" placeholder="R" maxLength={1} />
          <input type="text" placeholder="D" maxLength={1} />
          <input type="text" placeholder="S" maxLength={1} />
        </div>
        <div className="letters">
          <input
            type="text"
            placeholder="Enter the letters to exclude like 'abc' "
          />
          <input type="text" placeholder="Enter the letters to include 'abc'" />
        </div>
        <button>Submit</button>
      </div>
      <div className="lowerdiv"></div>
    </div>
  );
}

export default FrontPage;
