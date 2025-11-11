import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import About from "../pages/general/About";
import UserLogin from "../pages/auth/user/UserLogin";
import UserRegister from "../pages/auth/user/UserRegister";
import UserForgotPassword from "../pages/auth/user/UserForgotPassword";
import UserResetPassword from "../pages/auth/user/UserResetPassword";
import PrivacyPolicy from "../pages/general/PrivacyPolicy";
import TermsAndConditions from "../pages/general/TermsAndConditions";
import AdminLogin from "../pages/auth/admin/AdminLogin";
import AdminForgotPassword from "../pages/auth/admin/AdminForgotPassword";
import AdminResetPassword from "../pages/auth/admin/AdminResetPassword";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import AdminOrders from "../pages/dashboard/admin/AdminOrders";
import AdminProducts from "../pages/dashboard/admin/AdminProducts";
import AdminAddProduct from "../pages/dashboard/admin/AdminAddProduct";
import AdminCategories from "../pages/dashboard/admin/AdminCategories";
import AdminUsers from "../pages/dashboard/admin/AdminUsers";
import AdminContact from "../pages/dashboard/admin/AdminContact";
import AdminSettings from "../pages/dashboard/admin/AdminSettings";
import ErrorPage from "../pages/general/ErrorPage";
import Home from "../pages/general/Home";
import ProtectedRoute from "../components/admin/auth/ProductedRoute";
import AdminEditProduct from "../pages/dashboard/admin/AdminEditProduct";
import AdminViewProduct from "../pages/dashboard/admin/AdminViewProduct";
import Contact from "../pages/general/Contact";
import ComboProduct from "../pages/general/ComboProduct";
import ProductDetails from "../pages/general/ProductDetails";
import Cart from "../pages/general/Cart";
import Checkout from "../pages/general/Checkout";
import Categories from "../pages/general/Categories";
import CategoryProducts from "../pages/CategoryProducts/CategoryProducts";
import Products from "../pages/general/Products";
import OrderSuccess from "../pages/general/OrderSuccess";
import UserOrders from "../pages/dashboard/user/UserOrders";
import OrderDetails from "../pages/dashboard/admin/OrderDetails";
import AdminCoupons from "../pages/dashboard/admin/AdminCoupons";
import AdminRatings from "../pages/dashboard/admin/AdminRatings";
import CancellationAndRefundPolicy from "../pages/general/CancellationAndRefundPolicy";
import ShippingAndDeliveryPolicy from "../pages/general/ShippingAndDeliveryPolicy";
import ContactUsPolicy from "../pages/general/ContactUsPolicy";
import SearchResults from "../pages/general/SearchResults";


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'products',
                element: <Products />,
            },
            {
                path: 'product-details/:id',
                element: <ProductDetails />,
            },
            {
            path: 'search',
            element: <SearchResults />,
            },
            {
                path: 'combo-products',
                element: <ComboProduct />,
            },
            {
                path: 'cart',
                element: <Cart />,
            },
            {
                path: 'checkout',
                element: <Checkout />,
            },
            {
                path: 'order-success',
                element: <OrderSuccess />,
            },
            {
                path: 'orders',
                element: <UserOrders />,
            },
            {
                path: 'contact',
                element: <Contact />,
            },
            {
                path: 'login',
                element: <UserLogin />,
            },
            {
                path: 'register',
                element: <UserRegister />,
            },
            {
                path: 'forgot-password',
                element: <UserForgotPassword />,
            },
            {
                path: 'reset-password',
                element: <UserResetPassword />,
            },
            {
                path: 'privacy',
                element: <PrivacyPolicy />,
            },
            {
                path: 'terms',
                element: <TermsAndConditions />,
            },
            {
                path: 'shipping',
                element: <ShippingAndDeliveryPolicy />,
            },
            {
                path: 'cancellation',
                element: <CancellationAndRefundPolicy />,
            },
            {
                path: 'contact-us',
                element: <ContactUsPolicy />,
            },
            {
                path: 'categories',
                element: <Categories />,
            },
            {
                path: 'category/:categoryId',
                element: <CategoryProducts />,
            },
        ],
    },
    {
        path: '/admin/login',
        element: <AdminLogin />,
    },
    {
        path: '/admin/forgot-password',
        element: <AdminForgotPassword />,
    },
    {
        path: '/admin/reset-password',
        element: <AdminResetPassword />,
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
            {
                path: 'products',
                children: [
                    {
                        index: true,
                        element: <AdminProducts />,
                    },
                    {
                        path: 'add',
                        element: <AdminAddProduct />,
                    },
                    {
                        path: 'edit/:id',
                        element: <AdminEditProduct />,
                    },
                    {
                        path: 'view/:id',
                        element: <AdminViewProduct />,
                    },
                ],
            },
            {
                path: 'categories',
                element: <AdminCategories />,
            },
            {
                path: 'orders',
                element: <AdminOrders />,
            },
            {
                path: '/admin/orders/:id',
                element: <OrderDetails />,
            },
            {
                path: 'users',
                element: <AdminUsers />,
            },
            {
                path: 'contact',
                element: <AdminContact />,
            },
            {
                path: 'review',
                element: <AdminRatings />,
            },
            {
                path: 'coupons',
                element: <AdminCoupons />,
            },
            {
                path: 'settings',
                element: <AdminSettings />,
            },
        ],
    }
]);

export default router;