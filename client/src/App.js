import "./App.css";
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Registration from './pages/Registration';
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helper/AuthContext";
import Profile from "./pages/Profile";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "", 
    id: 0, 
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
      accessToken: localStorage.getItem('accessToken'),
        },
      })
      .then((response) =>{
        if (response.data.error)  {
          setAuthState({...authState, status: false});
        }else{
          setAuthState({
            username: response.data.username, 
            id: response.data.id, 
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({username: "", id: 0, status: false});
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> login</Link>
                  <Link to="/registration"> Registration</Link>            
                </>
              ) : (
                <>
                  <Link to="/"> Homepage</Link>
                  <Link to="/createpost"> Create A Post</Link>                
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1> {authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button> }
            </div>
          </div>
          <Routes>
            <Route path= "/" exact Component={Home}/>
            <Route path= "/createpost" exact Component={CreatePost}/>
            <Route path= "/post/:id" exact Component={Post}/>
            <Route path= "/registration" exact Component={Registration}/>
            <Route path= "/login" exact Component={Login}/>
            <Route path= "/profile/:id" exact Component={Profile}/>
            <Route path= "/changepassword" exact Component={ChangePassword}/>
            <Route path= "*" exact Component={PageNotFound}/>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;