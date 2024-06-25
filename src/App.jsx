import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import ChatPage from './Components/ChatPage';

const App = () => {
    return (
        <Router>
                <Routes>
                    {/* <Navbar /> */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
        </Router>
    );
};

export default App;
