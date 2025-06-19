import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Dispatch, SetStateAction } from "react";

type UserProfile = {
  name: string;
  email?: string;
};

type UserContextType = {
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedName = localStorage.getItem("userName");

    if (cachedName) {
      setUserProfile({ name: cachedName });
    }

    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener perfil");
        }

        const data = await response.json();
        setUserProfile(data);

        if (data?.name) {
          localStorage.setItem("userName", data.name);
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de <UserProvider>");
  }
  return context;
};
