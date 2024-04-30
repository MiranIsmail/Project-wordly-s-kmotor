import Navbar from './customComp/navbar.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutPage from './pages/about.js';
import FrontPage from './pages/frontPage';

function App() {
  const title = 'Welcome to the new blog';
  const likes = 50;
  // const person = { name: 'yoshi', age: 30 };
  const link = "http://www.google.com";

  console.log(link);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<FrontPage />}></Route>
            <Route path="/about" element={<AboutPage />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
