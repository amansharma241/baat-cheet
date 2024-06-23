import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import ChatPage from './Components/ChatPage';
import Navbar from './Components/Navbar';



const App = () => {
    return (
        <Router>
            
                <Navbar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
           
        </Router>
    );
};

export default App;
