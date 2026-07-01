import { createContext, useState, useContext } from 'react';

export const RoleContext = createContext();

export const ROLES = {
  EMPLOYEE: 'Employee',
  FINANCE_MANAGER: 'Finance Manager',
};

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.EMPLOYEE);

  const toggleRole = () => {
    setRole((prevRole) => 
      prevRole === ROLES.EMPLOYEE ? ROLES.FINANCE_MANAGER : ROLES.EMPLOYEE
    );
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
