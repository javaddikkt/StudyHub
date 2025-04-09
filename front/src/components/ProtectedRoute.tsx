import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem("token");
    return token ? <>{children}</> : <Navigate to="/login" replace />;
};

