import { createContext, useContext, useState, useCallback } from "react";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback(
    (message, duration = 4000) => {
      const id = Date.now() + Math.random();
      setAlerts((prev) => [...prev, { id, message }]);
      if (duration) setTimeout(() => dismissAlert(id), duration);
    },
    [dismissAlert],
  );

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-4 rounded-xl border bg-amber-500/10 border-amber-500/30 backdrop-blur-xl shadow-2xl">
            <FaExclamationCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <p className="flex-1 text-sm text-white">{alert.message}</p>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-white/40 hover:text-white transition-all flex-shrink-0"
              type="button">
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};
