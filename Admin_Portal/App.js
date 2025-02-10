import "./App.css";
import { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Components/login";
import Home from "./Components/home";
import Inventory from "./Components/inventory";
import Reports from "./Components/reports";
import Manageusers from "./Components/manageusers";
import Myaccount from "./Components/myaccount";
import Error from "./Components/error";
import ResolutionCenter from "./Components/customerSupport";
// import PrivateRoute from './Components/private';
import GeneratePDF from "./Components/new";
import Categories from "./Components/categories";
import Subcategories from "./Components/managesubcategories";
import ManageJobs from "./Components/managejobs";
import UserPage from "./Components/userModal";
import JobPage from "./Components/jobModal";
import ManageBids from "./Components/manageBids";
import ManageAdmins from "./Components/manageadmins";
import PrivateRoute from "./PrivateRoute";
import Cookies from "js-cookie";

function App() {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
  }, []);
  const isAuthenticated = Cookies.get("token");
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
        </Route>
        <PrivateRoute path="/manage-bids" component={ManageBids} />
        <PrivateRoute path="/manage-jobs" component={ManageJobs} />
        <PrivateRoute path="/dashboard" component={Home} />
        <PrivateRoute path="/inventory" component={Inventory} />
        <PrivateRoute path="/categories" component={Categories} />
        <PrivateRoute path="/subcategories" component={Subcategories} />
        <PrivateRoute path="/reports" component={Reports} />
        <PrivateRoute path="/manage-users" component={Manageusers} />
        <PrivateRoute path="/manage-admins" component={ManageAdmins} />
        <PrivateRoute path="/my-accounts" component={Myaccount} />
        <PrivateRoute path="/customer-support" component={ResolutionCenter} />
        <PrivateRoute path="/generate" component={GeneratePDF} />
        <PrivateRoute path="/404" component={Error} />
        <PrivateRoute path="/userModal" component={UserPage} />
        <PrivateRoute path="/jobModal" component={JobPage} />
      </Switch>
    </div>
  );
}

export default App;
