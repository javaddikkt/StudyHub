import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseList from './components/courses/CourseList.tsx';
import CourseDetails from './components/courses/CourseDetails.tsx';
import Registration from "./components/auth/Registration.tsx";
import Login from "./components/auth/Login.tsx";
import InvitationsList  from "./components/invitations/InvitationsList.tsx";
import CourseCreation from "./components/courses/CourseCreation.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/invitations" element={<InvitationsList />} />
                <Route path="/createCourse" element={<CourseCreation />} />
            </Routes>
        </Router>
    );
}

export default App;
