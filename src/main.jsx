import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CategoryProvider } from './contexts/CategoryContext'
import { ProductProvider } from './contexts/ProductContext'
import { UserProvider } from './contexts/UserContext'
import { ContactProvider } from './contexts/ContactContext'
import { CartProvider } from './contexts/CartContext'
import { CouponProvider } from './contexts/CouponContext'
import { OrderProvider } from './contexts/OrderContext'
import { ShippingProvider } from './contexts/ShippingContext'
import router from './router/index.jsx'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <UserProvider>
              <ContactProvider>
                <CartProvider>
                  <CouponProvider>
                    <OrderProvider>
                      <ShippingProvider>
                        <RouterProvider router={router} />
                        {/* Global Toaster */}
                        <Toaster
                          position="top-right"
                          toastOptions={{
                            duration: 4000,
                            style: {
                              background: '#363636',
                              color: '#fff',
                            },
                            success: {
                              duration: 3000,
                              theme: {
                                primary: 'green',
                                secondary: 'black',
                              },
                            },
                            error: {
                              duration: 5000,
                            },
                          }}
                        />
                      </ShippingProvider>
                    </OrderProvider>
                  </CouponProvider>
                </CartProvider>
              </ContactProvider>
            </UserProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)