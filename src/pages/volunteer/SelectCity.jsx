import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SelectCity() {
  const navigate = useNavigate();
  useEffect(() => {
    const city = 'Shri Bhaini Sahib';
    localStorage.setItem('volunteer_city', city);
    localStorage.setItem('volunteer_city_is_default', 'true');
    // skip any UI, go straight to activity selection
    navigate('/volunteer/select-activity');
  }, []);
  // Render nothing while redirecting
  return null;
}

export default SelectCity;
