import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from './pages/ProductPage';
import ProductT from './components/ProductT';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Products from './components/Products';
import DashboardView from './components/DashboardView';
import Messages from "./components/Messages";
import { ErrorContextProvider } from './contexts/ErrorContext';
import { ToastProvider } from './Contexts/ToastContext';
import MyToast from './components/Toast';
import Categories from './components/Categories';
import LoginForm from './components/LoginFom';
import RegisterForm from './components/Registerform'
import { AuthProvider } from './contexts/userSessionContext';
import LoginRequiredLayout from './Layouts/LoginRequiredLayout';
import RefreshLayout from './Layouts/RefreshLayout';
import Logout from './Layouts/LogoutLayout';
import { MessagesProvider } from './contexts/MessagesContext';
import MessageToast from './components/MessageToast';
import MessagesLayout from './Layouts/MessagesLayout';
import ProductsPage from './pages/Productspage';
import SearchLayout from './Layouts/searchLayout';
import { SearchProvider } from './contexts/SearchContext';

const App = () => {
  return (
  <BrowserRouter>
    <ErrorContextProvider>
        <ToastProvider>
              <MyToast />
              <AuthProvider>
                <MessagesProvider>
                  <SearchProvider>
                  <MessageToast/>
                    <Routes>
                      <Route element={<SearchLayout/>}>
                          <Route path='/' element={<HomePage/>} />
                          <Route path='/login' element={<LoginForm/>} />
                          <Route path='/register' element={<RegisterForm/>} />
                          <Route path='/product' element={<ProductPage />} />
                          <Route path='/products' element={<ProductsPage />} />
                          <Route path='/product1' element={<ProductT />} />
                          <Route path='/view-product/:id' element={<ProductPage />} />
                          <Route path='/categoryy/:id' element={<CategoryPage />} />
                          <Route path='/*' element={<NotFoundPage />} />
                      </Route>
                      <Route element={<RefreshLayout/>}>
                          <Route element={<LoginRequiredLayout/>}>
                            
                              <Route element={<MessagesLayout/>}>
                                <Route
                                    path="/admin"
                                    element={<DashboardPage />}
                                >
                                    <Route index element={<DashboardView />} />
                                    <Route path='dashboard' element={<DashboardView />} />
                                    <Route path='messages' element={<Messages />} />
                                    <Route path='product' element={<Products />} />
                                    <Route path='categories' element={<Categories />} />
                                </Route>
                              </Route>
                            
                            <Route path='/logout' element={<Logout/>}/>
                          </Route>
                        </Route>
                    </Routes>
                  </SearchProvider>
                  </MessagesProvider>
              </AuthProvider>
        </ToastProvider>
    </ErrorContextProvider>
  </BrowserRouter>
    
  )
}

export default App