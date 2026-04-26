import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./store/slices/authThunks";

// --- LAYOUTS & GUARDS ---
import AdminLayout from "./admin/layout/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoutes"; // Pour les Fans (élèves)
import PublicRoute from "./components/PublicRoutes";
import { ProtectedAdminRoute } from "./admin/components/ProtectedRoute"; // Pour les Coachs
import { PublicAdminRoute } from "./admin/components/PublicRoute";

// --- PAGES PUBLIQUES (FRONTEND) ---
import HomeGeneral from "./pages/HomeGeneral"; // La Vitrine
import Home from "./pages/Profil";           // Le Profil/Capture du Coach
import FeedContainer from "./pages/FeedContainer";
import Shop from "./pages/Shop";
import CourseDetails from "./pages/CourseDetails";
import LearningArea from './pages/LearningArea';
import Checkout from "./pages/checkout";
import ChatLayout from "./pages/ChatLayout";

// --- ADMINISTRATION (COACH) ---
import AdminDashboard from "./admin/views/Dashboard";
import ManageCourses from "./admin/views/ProductList";
import CreateCourse from "./admin/views/CreateCours";
import EditCourse from "./admin/views/EditCourse";
import AdminSuccess from "./admin/views/AdminSuccess";
import Audience from "./admin/views/Audience";
import Settings from "./admin/auth/profil";
import AdminRegister from "./admin/auth/Register";
import AdminLogin from "./admin/auth/Login";
import FacebookCallback from "./admin/components/FacebookCallback";
import CategoryView from "./pages/CategoryView";
import SuccessPage from "./pages/SuccessPage";
import MyCourses from "./pages/MyCourses";
import UserProfile from "./pages/MyPofile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [token, dispatch]);

  return (
    <Routes>
      {/* 1. 🌍 ACCUEIL GÉNÉRAL (L'Académie) */}
      <Route path="/" element={<HomeGeneral />} />
      {/* <Route path="/savoir/metier" element={<HomeGeneral />} /> */}
      <Route path="/coach/category/:category" element={<CategoryView />} />

      {/* 2. 🔐 AUTHENTICATION ADMIN/COACH (PublicAdminRoute) */}
      <Route element={<PublicAdminRoute />}>
        <Route path="/admin/auth/register" element={<AdminRegister />} />
        <Route path="/admin/auth/login" element={<AdminLogin />} />
        {/* <Route path="/auth/facebook/callback" element={<FacebookCallback />} /> */}
      </Route>

      <Route
          path="/admin"
          element={
            <Navigate
              to={token ? "/admin/dashboard" : "/admin/auth/login"}
              replace
            />
          }
        />

      {/* 3. 👑 ESPACE ADMINISTRATION (ProtectedAdminRoute) */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          {/* <Route index element={<Navigate to="/admin/dashboard" replace />} /> */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/productlist" element={<ManageCourses />} />
          <Route path="/admin/courses/new" element={<CreateCourse />} />
          <Route path="/admin/edit-course/:id" element={<EditCourse />} />
          <Route path="/admin/success/:courseId" element={<AdminSuccess />} />
          <Route path="/admin/audiance" element={<Audience />} />
          <Route path="/admin/profile/:slug" element={<Settings />} />  
        </Route>
      </Route>

      {/* 4. 🎓 ESPACE APPRENTISSAGE (Élèves identifiés) */}
      <Route path="/formation/:courseId/:lessonId?" 
        element={
          
            <LearningArea />
          
        }
      />

    <Route path="/academie/:coursesId" element={<CourseDetails />} />
   
       

      {/* 5. 🏰 L'EMPIRE D'UN COACH (Route Dynamique - TOUJOURS À LA FIN) */}
      <Route path="/empire/profile/coach/:slug" element={<Home />} />
       
      <Route path="/empire/:slug/my-profile" 
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } 
          />
      
      {/* Sous-pages de l'Empire (Accessibles via le slug du coach) */}
      <Route path="/empire/:slug/feed" element={<FeedContainer />} />
      <Route path="/empire/:slug/shop" element={<Shop />} />
      <Route path="/empire/:slug/my-courses" element={
         <PrivateRoute>
            <MyCourses />
          </PrivateRoute>
        } />
      <Route path="/empire/:slug/chat" element={<ChatLayout />} />
      <Route path="/empire/checkout/:productId" 
      element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
      

      } />
       {/* --- ROUTE DE SUCCÈS POUR L'ÉLÈVE --- */}
      <Route path="/empire/success/:transactionId" element={<SuccessPage />} />
      {/* 404 / Sécurité */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;