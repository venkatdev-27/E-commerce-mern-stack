import { useEffect, useState } from "react";
import GlobalLoader from "@/components/GlobalLoader.jsx";
import App from "./App";

const API_URL = import.meta.env.VITE_API_URL;

const MainApp = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GlobalLoader />;

  return <App />;
};

export default MainApp;
