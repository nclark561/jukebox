"use client";
import { createContext, useEffect, useState } from "react";
export const QueueContext = createContext(undefined);
export const QueueProvider = ({ children }) => { 

    const [queue, setQueue] = useState<{song:string}[]>([{song:"kale"}])
    console.log(queue, "this should be kale")
  return (
    <QueueContext.Provider value={{setQueue}}>
      {children}
    </QueueContext.Provider>
  );
};
