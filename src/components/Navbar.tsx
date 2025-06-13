import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  UserOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { Menu, Switch } from "antd";
import type { MenuProps, MenuTheme } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/",
    label: "Inicio",
    icon: <HomeOutlined />
  },
  {
    key: "profile",
    label: "Mi Perfil",
    icon: <UserOutlined />,
    children: [
      { key: "edit", label: "Editar Perfil" },
      { key: "settings", label: "Configuraciones" },
      { key: "logout", label: "Cerrar Sesión" },
    ],
  },
  {
    key: "/events",
    label: "Eventos",
    icon: <AppstoreOutlined />,
    children: [
      { key: "upcoming", label: "Próximos Eventos" },
      { key: "past", label: "Eventos Pasados" },
    ],
  },
  {
    key: "/daily-summary",
    label: "Resumen Diario",
    icon: <FileTextOutlined />,
  },
  {
    key: "/about-us",
    label: "Acerca de",
    icon: <InfoCircleOutlined />,
  },
];

const AppMenu: React.FC = () => {
  const [theme, setTheme] = useState<MenuTheme>("dark");
  const [current, setCurrent] = useState("profile");

  const changeTheme = (value: boolean) => {
    setTheme(value ? "dark" : "light");

    if (value) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme === "dark" ? "dark" : "light");
      document.body.setAttribute("data-theme", savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div style={{ width: 300 }}>
      <Switch
        checked={theme === "dark"}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
        style={{ marginBottom: 16 }}
      />
      <Menu
        theme={theme}
        onClick={onClick}
        style={{ width: "100%" }}
        defaultOpenKeys={["profile"]}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default AppMenu;
