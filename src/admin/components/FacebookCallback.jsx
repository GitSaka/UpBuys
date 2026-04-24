import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacebookCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); // Sauvegarde token localement
      navigate("/admin/dashboard"); // Redirection vers dashboard
    } else {
      alert("Erreur lors du login Facebook");
    }
  }, [navigate]);

  return <div>Connexion en cours...</div>;
};

export default FacebookCallback;
