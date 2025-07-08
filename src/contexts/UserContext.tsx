import {
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
  role?: string;
  preferences?: {
    theme?: 'light' | 'dark';
  };
};

type UserContextType = {
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
  isAdmin: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const isAdmin = userProfile?.role?.toLowerCase() === 'admin';

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('userTheme', newTheme);
    
    // Aplicar al DOM
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Actualizar preferencias del usuario si está logueado
    if (userProfile) {
      setUserProfile(prev => ({
        ...prev!,
        preferences: {
          ...prev?.preferences,
          theme: newTheme
        }
      }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedName = localStorage.getItem("userName");
    const cachedRole = localStorage.getItem("userRole");
    const cachedTheme = localStorage.getItem("userTheme") as 'light' | 'dark' || 'light';

    // SIEMPRE cargar tema del localStorage como base (persiste entre sesiones)
    setThemeState(cachedTheme);
    if (cachedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    if (cachedName) {
      setUserProfile({ 
        name: cachedName, 
        role: cachedRole || undefined,
        preferences: {
          theme: cachedTheme
        }
      });
    }

    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/auth/profile", {
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
        
        // MANTENER el tema actual del localStorage (continuidad de experiencia)
        // Las preferencias del usuario se sincronizan con el tema actual
        setUserProfile({
          ...data,
          preferences: {
            ...data.preferences,
            theme: cachedTheme  // Usar el tema que ya tenía el usuario
          }
        });

        if (data?.name) {
          localStorage.setItem("userName", data.name);
        }
        if (data?.role) {
          localStorage.setItem("userRole", data.role);
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, isAdmin, theme, setTheme }}>
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
