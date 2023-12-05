import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [person, setPerson] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const [newMessageFlag, setNewMessageFlag] = useState(false);

 

 const socket = useRef();
useEffect(() => {
  socket.current = io("https://127.0.0.1:1000;");
}, []);


  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        person,
        setPerson,
        socket,
        activeUsers,
        setActiveUsers,
        newMessageFlag,
        setNewMessageFlag
        
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
