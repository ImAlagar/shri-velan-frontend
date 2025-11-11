// components/ProtectedOrderSuccess.jsx
import { Navigate, useLocation } from "react-router-dom";
import OrderSuccess from "../../pages/general/OrderSuccess";

const ProtectedOrderSuccess = () => {
  const location = useLocation();
  
  const fromCheckout = location.state?.fromCheckout === true;
  
  if (!fromCheckout) {
    return <Navigate to="/" replace />;
  }
  
  return <OrderSuccess />;
};

export default ProtectedOrderSuccess;