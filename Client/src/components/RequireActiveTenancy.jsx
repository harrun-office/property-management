
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireActiveTenancy = ({ children }) => {
    const { user, isTenant } = useAuth();

    if (isTenant && !user?.hasActiveTenancy) {
        // Redirect inactive tenants to the homepage to browse properties as a regular user
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RequireActiveTenancy;
