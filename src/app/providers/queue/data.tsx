"use client";
import { createContext, useEffect, useState } from "react";
export const QueueContext = createContext(undefined);
export const QueueProvider = ({ children }: {children: React.ReactNode}) => { 

    const [queue, setQueue] = useState<{song:string}[]>([{song:"kale"}])
  return (
    <QueueContext.Provider value={{setQueue}}>
      {children}
    </QueueContext.Provider>
  );
};
