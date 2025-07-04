
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderFlow = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the actual order page
    navigate('/order', { replace: true });
  }, [navigate]);

  return null;
};

export default OrderFlow;
