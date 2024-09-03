import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

//pages
import Starter from "../pages/Pages/Starter/Starter";
import Maintenance from "../pages/Pages/Maintenance/Maintenance";
import ComingSoon from "../pages/Pages/ComingSoon/ComingSoon";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import RegistrationTwo from "../pages/Authentication/RegistrationStep02";
import ConfirmOtp from "../pages/Authentication/ConfirmOtp";
import RoleAndPermission from "../pages/Pages/RoleAndPermission/RoleAndPermission";
import CustomerManagement from "../pages/Pages/User Mangement/CustomerManagement";
import StaffManagement from "../pages/Pages/User Mangement/StaffManagement";
import ProductManagement from "../pages/Pages/ProductManagement/ProductManagement";
import CategoryManagement from "../pages/Pages/CategoryManagement/CategoryManagement";
import AddProduct from "../pages/Pages/ProductManagement/AddProduct";
import UpdateProduct from "../pages/Pages/ProductManagement/UpdateProduct";
import GalleryManagement from "../pages/Pages/GalleryManagement/GalleryManagemnt";
import BranchManagement from "../pages/Pages/BranchManagement/BranchManagement";
import ServiceManagement from "../pages/Pages/ServiceManagement/ServiceManagement";
import InquiryManagement from "../pages/Pages/InquiryManagement/InquiryManagement";
import OffersManagement from "../pages/Pages/OffersManagement/OffersManagement";
import DeliveryOrderManagement from "../pages/Pages/OrderManagement/DeliveryOrderManagement";
import DingingOrderManagement from "../pages/Pages/OrderManagement/DingingOrderManagement";
import ViewProductDetails from "../pages/Pages/ProductManagement/ViewProductDetails";
import ReservationManagement from "../pages/Pages/ReservationManagement/ReservationManagement";
import OrderDetail from "../pages/Pages/OrderManagement/OrderDetail";
import CreateDiningOrder from "../pages/Pages/OrderManagement/CreateDiningOrder";
import ReportManagement from "../pages/Pages/ReportManagement/ReportManagement";
import PaymentManagement from "../pages/Pages/PaymentManagement/PaymentManagement";
import ReservationPaymentManagement from "../pages/Pages/PaymentManagement/ReservationPaymentManagement";

const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },

  //Pages
  { path: "/pages-starter", component: <Starter /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },

  { path: "/staff-management", component: <StaffManagement /> },

  { path: "/customer-management", component: <CustomerManagement /> },

  { path: "/role-permission-management", component: <RoleAndPermission /> },

  { path: "/product-management", component: <ProductManagement /> },

  { path: "/add-new-product", component: <AddProduct /> },

  { path: "/update-product", component: <UpdateProduct /> },

  { path: "/view-product", component: <ViewProductDetails /> },

  { path: "/reservation-management", component: <ReservationManagement /> },

  { path: "/category-management", component: <CategoryManagement /> },

  { path: "/gallery-management", component: <GalleryManagement /> },

  { path: "/branch-management", component: <BranchManagement /> },

  { path: "/service-management", component: <ServiceManagement /> },

  { path: "/offer-management", component: <OffersManagement /> },

  { path: "/inquiry-management", component: <InquiryManagement /> },

  {
    path: "/delivery-order-management",
    component: <DeliveryOrderManagement />,
  },

  { path: "/dinging-order-management", component: <DingingOrderManagement /> },

  { path: "/order-detail", component: <OrderDetail /> },

  { path: "/place-dining-order", component: <CreateDiningOrder /> },

  { path: "/payment-management", component: <PaymentManagement /> },

  {
    path: "/reservation-payment-management",
    component: <ReservationPaymentManagement />,
  },

  { path: "/report-management", component: <ReportManagement /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/confirm-otp", component: <ConfirmOtp /> },
  { path: "/register", component: <Register /> },

  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-coming-soon", component: <ComingSoon /> },

  { path: "/login-next-step", component: <RegistrationTwo /> },
];

export { authProtectedRoutes, publicRoutes };
