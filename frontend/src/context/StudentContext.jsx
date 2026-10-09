import { createContext, useContext, useState } from "react";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const toggleSaveEvent = (eventId) => {
    setSavedEvents((currentSavedEvents) => {
      if (currentSavedEvents.includes(eventId)) {
        return currentSavedEvents.filter((id) => id !== eventId);
      }

      return [...currentSavedEvents, eventId];
    });
  };

  const registerForEvent = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      return false;
    }

    setRegisteredEvents((currentRegisteredEvents) => [
      ...currentRegisteredEvents,
      eventId,
    ]);

    return true;
  };

  return (
    <StudentContext.Provider value={{
      savedEvents,
      registeredEvents,
      toggleSaveEvent,
      registerForEvent,
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error("useStudent must be used inside StudentProvider");
  }

  return context;
}
