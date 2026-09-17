import {
    Navigate,
    Outlet
} from "react-router-dom";

import { useAuth }
    from "../contexts/AuthContext";

const RoleRoute = ({
    roles
}) => {
    const { user } =
        useAuth();

    if (!roles.includes(user?.role)) {
        return (
            <Navigate
                to="/profile"
                replace
            />
        );
    }

    return <Outlet />;
};

export default RoleRoute;