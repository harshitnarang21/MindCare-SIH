import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import ChatBot from "./components/ChatBot";
import Resources from "./components/Resources";
import BookingSystem from "./components/BookingSystem";
import PeerSupport from "./components/PeerSupport";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

export default function App(){
 return(
  <Router>
   <header className="nav">
     <h2>🧠 MindCare</h2>
     <nav>
       <Link to="/">Chat</Link>
       <Link to="/resources">Resources</Link>
       <Link to="/booking">Book</Link>
       <Link to="/peer">Peers</Link>
       <Link to="/admin">Admin</Link>
     </nav>
   </header>

   <main>
     <Routes>
       <Route path="/" element={<ChatBot/>}/>
       <Route path="/resources" element={<Resources/>}/>
       <Route path="/booking" element={<BookingSystem/>}/>
       <Route path="/peer" element={<PeerSupport/>}/>
       <Route path="/admin" element={<AdminDashboard/>}/>
     </Routes>
   </main>
  </Router>
 );
}
