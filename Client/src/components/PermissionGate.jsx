import { useAuth } from '../context/AuthContext';

function PermissionGate({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return children;
  }

  return fallback;
}

export default PermissionGate;

