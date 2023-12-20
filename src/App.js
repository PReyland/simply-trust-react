import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useCallback, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Offcanvas, Button, Form, InputGroup, Container } from 'react-bootstrap';

import AdminTrustsList from './components/AdminTrustsList';
import AdminTrust from './components/AdminTrust';



function App() {
  return (
    <div className="App">
<Container>
<BrowserRouter>
      <Routes>
        <Route path="/admin/trust" element={<AdminTrustsList />} />
        <Route path="/admin/trust/:id*" element={<AdminTrust />} />
      </Routes>
    </BrowserRouter>
</Container>

    </div>
  );
}

export default App;
