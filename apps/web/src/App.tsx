import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Form from "./pages/Form";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/" element={<Form />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
