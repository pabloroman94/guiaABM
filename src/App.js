// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreatePerson from './components/CreatePerson';
import ProtectedRoute from './components/ProtectedRoute';
import CreateCustomer from './components/CreateCustomer';
import CreateEntity from './components/CreateEntity';
import CreateCompany from './components/CreateCompany';
import TagTypeABM from './components/TagTypeABM';
import TagABM from './components/TagABM';
import AddressTypeABM from './components/AddressTypeABM';
import AddressABM from './components/AddressABM';
import UserTypeABM from './components/UserTypeABM';
import ContactTypeABM from './components/ContactTypeABM';
import ContactABM from './components/ContactABM';
import AlbumABM from './components/AlbumABM';
import PhotoABM from './components/PhotoABM';
import AttachmentABM from './components/AttachmentABM';
import EntityTagABM from './components/EntityTagABM';
import SocialNetworkABM from './components/SocialNetworkABM';




function App() {
  // Convertir isAuthenticated en una función que siempre verifique el localStorage
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-customer" element={<CreateCustomer />} />
        <Route path="/create-entity" element={<CreateEntity />} />
        <Route path="/TagTypeABM" element={<TagTypeABM />} />
        <Route path="/TagABM" element={<TagABM />} />
        <Route path="/AddressTypeABM" element={<AddressTypeABM />} />
        <Route path="/AddressABM" element={<AddressABM />} />
        <Route path="/UserTypeABM" element={<UserTypeABM />} />
        <Route path="/ContactTypeABM" element={<ContactTypeABM />} />
        <Route path="/ContactABM" element={<ContactABM />} />
        <Route path="/AlbumABM" element={<AlbumABM />} />
        <Route path="/PhotoABM" element={<PhotoABM />} />
        <Route path="/AttachmentABM" element={<AttachmentABM />} />
        <Route path="/EntityTagABM" element={<EntityTagABM />} />
        <Route path="/SocialNetworkABM" element={<SocialNetworkABM />} />

        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated()}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/create-person" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated()}>
              <CreatePerson />
            </ProtectedRoute>
          } 
        />

          <Route 
          path="/create-company" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated()}>
              <CreateCompany />
            </ProtectedRoute>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
