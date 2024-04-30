import "./about.css";

function AboutPage() {
  return (
    <div className="home">
      <div className="home_header">
        <h1>About</h1>
      </div>
      <div className="home_content">
        <p>
          This is a very simple search motor for words that can be used to solve
          games like Wordle. It is a work in progress and we are adding new
          features. We are two unvieristy students and we are doing this project
          for fun.
        </p>
        <p className="p2"> We hope you enjoy it and welcome any feedback.</p>
      </div>
    </div>
  );
}

export default AboutPage;
