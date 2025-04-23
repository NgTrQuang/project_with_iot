import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import PrivateRoute from './route/PrivateRoute';
// import Footer from './layout/Footer/Footer';
import './main.css';
import { UserProvider } from './components/context/UserContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/account/Profile';
import PublicRoute from './route/PublicRoute';
import PaymentSuccess from './components/payments/PaymentSuccess';
import PaymentCancel from './components/payments/PaymentCancel';
import AboutUs from './components/contents/AboutUs';
import Contact from './components/contents/Contact';
import UsersElectricity from './components/admin/electricity/UsersElectricity';
import UserList from './components/admin/users/UserList';
import Water from './components/contents/Water';
import Settings from './components/Settings';
import Layout from './layout/Layout/Layout';
import Dashboard from './layout/Dashboard/Dashboard';
import Notifications from './components/Notifications';
import CreateUserForm from './components/admin/users/CreateUserForm';
import UpdateUserForm from './components/admin/users/UpdateUserForm';
import UserDetails from './components/admin/users/UserDetails';
import RestoreUser from './components/admin/users/RestoreUser';
import Successfully from './components/auth/Successfully';
import Error from './components/auth/Error';
import SolarEnergy from './components/SolarEnergy';
import Payments from './components/Payments';
import Invoices from './components/Invoices';
import Broadcasts from './components/Broadcasts';
import BusinessesElectricity from './components/admin/electricity/BusinessesElectricity';

// import AddressSelector from './components/users/AddressAll';

const App = () => {
  const [isNotification, setIsNotification] = useState(true);

  return (
    <UserProvider>
      <Router>
        <div className="App">
          {/* {isNotification && <Header/>}
          {isNotification && <Sidebar/>} */}
            <Routes>
              <Route path="/" element={<PrivateRoute component={Layout} />}>
                <Route index element={<Dashboard />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/electric" element={<UsersElectricity />} />
                <Route path="/electric-business" element={<BusinessesElectricity/>}/>
                <Route path="/water" element={<Water />} />
                <Route path='/solar-energy' element={<SolarEnergy/>}/>
                <Route path='/invoices' element={<Invoices/>}/>
                <Route path='/payments' element={<Payments/>}/>
                <Route path='/broadcasts' element={<Broadcasts/>}/>
                <Route path="/users" element={<UserList />} />
                <Route path="/view-user/:userId" element={<UserDetails />} />
                <Route path="/create-user" element={<CreateUserForm />} />
                <Route path="/update-user/:userId" element={<UpdateUserForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/list/deleted-user" element={<RestoreUser/>}/>
              </Route>
              <Route path="/login" element={<PublicRoute component={Login} />} />
              <Route path='/register' element={<PublicRoute component={Register}/>}/>
              <Route path='/successfully' element={<PublicRoute component={Successfully}/>}/>
              <Route path='/error' element={<PublicRoute component={Error}/>}/>
              {/* <Route path='/profile' element={<Profile/>}/> */}
              <Route path="/checkout/success" element={<PaymentSuccess setIsNotification={setIsNotification}/>} />
              <Route path="/checkout/cancel" element={<PaymentCancel setIsNotification={setIsNotification}/>} />
            </Routes>
          {/* {isNotification &&<Footer />} */}
        </div>
      </Router>   
    </UserProvider>
  );
}

export default App;
