import { createContext, useContext, useEffect } from "react";
import useFetch from "./hooks/use-fetch";
import { getCurrentUser } from "./db/apiAuth";
import type { User } from "@supabase/supabase-js";

interface Context {
  children: React.ReactNode;
}

interface UrlContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const UrlContext = createContext<UrlContextType | null>(null);

const UrlProvider = ({ children }: Context) => {
  const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);
  const isAuthenticated = user?.role === "authenticated";
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error("UrlState must be used within UrlProvider");
  }
  return context;
};

export default UrlProvider;
