import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Courses } from "./pages/Courses";
import { CourseDetails } from "./pages/CourseDetails";
import { EnrollmentRequests } from "./pages/EnrollmentRequests";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
                path="/courses"
                element={
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/courses/:id"
                element={
                    <ProtectedRoute>
                        <CourseDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/requests"
                element={
                    <ProtectedRoute>
                        <EnrollmentRequests />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
);

export default App;