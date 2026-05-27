import Sidebar from "./SideBar";
import bg from "../assets/wallpaper12.png";

export default function Layout({ children }) {
  const isMobile =
  window.innerWidth <= 768;
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflowX:"hidden"
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          paddingLeft: isMobile? "0px":"70px",
          paddingBottom: isMobile? "70px":"0px",
          color: "white",
        }}
      >
        {children} 
      </div>
    </div>
  );
}