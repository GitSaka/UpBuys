import api from './api';

export const createPost = async (postData) => {
  try {
    const response = await api.post('/feed/create', postData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du post ❌", error);
    throw error;
  }
};

export const toggleLike = async (postId, userId) => {
  const res = await api.post('/feed/like', { postId, userId });
  return res.data;
};

export const saveFan = (data) => {
  localStorage.setItem("fanData", JSON.stringify(data));
};

export const getFan = () => {
  return JSON.parse(localStorage.getItem("fanData"));
};

export const getAuthToken = () => {

  // 1️⃣ Vérifie fan
  const fanData = JSON.parse(localStorage.getItem("fanData"));
  if (fanData?.token) return fanData.token;

  // 2️⃣ Vérifie admin
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) return adminToken;

  return null;
};

export const logoutFan = () => {
  localStorage.removeItem("fanData");
};

// getCoachPosts
export const getCoachPosts = async (coachId) => {
  try {
    const response = await api.get(`/feed/${coachId}`);
    return response.data.data; // On récupère le tableau de posts
  } catch (error) {
    console.error("Erreur de récupération de l'Empire ❌", error);
    throw error;
  }
};


// src/services/feedService.js

export const addComment = async (postId, fanId, author, text) => {
  try {
    // 🚀 L'APPEL API : On envoie les 4 infos vitales
    const response = await api.post('/feed/comment', { 
      postId, 
      fanId, 
      author, 
      text 
    });
    
    return response.data; // Renvoie { success: true, comment: { ... } }
  } catch (error) {
    console.error("Erreur lors de l'envoi du commentaire ❌", error);
    throw error;
  }
};