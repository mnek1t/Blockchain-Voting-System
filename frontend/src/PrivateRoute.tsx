import { JSX, useEffect, useState } from "react";
import { getMe } from "./api/auth/blockhain-api-service";
import { Navigate } from "react-router-dom";
import { AuthUserDataResponse } from "./types";
import { AuthContext } from "./AuthContext";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
interface PrivateRouteProps {
    children: JSX.Element;
    requiredRoles: string[];
  }

const PrivateRoute = ({ children, requiredRoles }: PrivateRouteProps) => {
    const [user, setUser] = useState<AuthUserDataResponse | null>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getMe()
        .then(data => {
            console.log(data);
            setUser(data);
        })
        .catch(err => {
            console.log(err);
            setUser(null);
        })      
        .finally(() => {
            setLoading(false)
        })  
    }, [])
    if (loading) return  <LoadingSpinner innertText='test' loading={true}/>;
    if (!user) return <Navigate to="/" replace />;

    if (!requiredRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

    return (
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    );
    
};

export default PrivateRoute;