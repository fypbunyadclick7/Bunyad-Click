import './App.css';
import { useEffect } from 'react';
import {Switch,Route} from 'react-router-dom';
import Roles from './Components/AUTH/roles';
import SignUp from './Components/AUTH/signup';
import SignIn from './Components/AUTH/signin';
import VerifyOTP from './Components/AUTH/verifyotp';
import ForgotPassword from './Components/ForgetPassword/forgetpassword';
import UpdatePassword from './Components/UpdatePassword/updatepassword';
import VerifyOTPs from './Components/ForgetPassword/verifyotps';
import Home from  './Pages/BuyerPages/home';
import BuyerProfile from  './Pages/BuyerPages/profile'
import SellerProfile from './Pages/SellerPages/profile';
import BuyerPostJob from './Pages/BuyerPages/postProject';
import ViewBuyerProjects from './Pages/BuyerPages/viewProjects';
import FindProjects from './Pages/SellerPages/findProjects';
import ViewBids from './Pages/BuyerPages/viewBids';
import Chat from './Pages/SellerPages/chat';

function App() {
  useEffect(()=>{
    document.body.style.overflowX="hidden";
  },[])
  return (
    <div className="App">
     <Switch>
     <Route exact path="/roles" component={Roles}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/" component={SignIn}/>
      <Route exact path="/verifyotp" component={VerifyOTP}/>
      <Route exact path="/forgotpassword" component={ForgotPassword}/>
      <Route exact path="/updatepassword" component={UpdatePassword}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/profile" component={BuyerProfile}/>
      <Route exact path="/verifyotps" component={VerifyOTPs}/>
      <Route exact path="/sellerhome" component={SellerProfile}/>
      <Route exact path="/buyerpostJob" component={BuyerPostJob}/>
      <Route exact path="/viewbuyerpostJob" component={ViewBuyerProjects}/>
      <Route exact path="/findprojects" component={FindProjects}/>
      <Route exact path="/viewBids/:jobId" component={ViewBids}/>
      <Route exact path="/chat" component={Chat}/>
      </Switch>
    </div>
  );
}

export default App;