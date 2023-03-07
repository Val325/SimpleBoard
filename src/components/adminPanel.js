import axios from "axios"
import React, { useState } from "react";
import useAxios from 'axios-hooks'
import FormData from 'form-data'
import { HeaderSite } from "./header.js";
import { SendPosted } from "./form.js";
import { useLocation } from 'react-router-dom';
import { useEffect} from "react";
import { checkSubImageAndPut, checkImageAndPut} from "./functions.js";
import '../styles/tailwindS.css';


export function AdminPanelReg(props){
  
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value)
  }
  const handleChangePass = (event) => {
    setPass(event.target.value)
  }
  

  const handleSubmit = async(event) => {
    event.preventDefault();

    axios
      .post("http://localhost:4000/adminData", {
        Email: email,
        Password: password,
      })
      .then(() => {
        console.log("dataAdmin sended")
      })
      .catch(err => {
        console.error(err);
      })
    
      //Update page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    }
 

    return ( 
      <>
      <HeaderSite />
      <div action={"/adminData"} className="flex justify-center">
          <form method="post" encType="multipart/form-data" className="Form">
            <div className="flex flex-col">
              <label for="uname"><b>Email</b>
              <input className="m-2 ml-9" type="email" placeholder="Enter Email" name="email" onChange={handleChangeEmail} required />
              </label>
              <label for="psw"><b>Password</b>
              <input className="m-2" type="password" placeholder="Enter Password" name="psw" onChange={handleChangePass} required />
              </label>
            </div>
            <input type="submit" value="Registation" className="Form-submit" onClick={handleSubmit}/><br /> 
          </form>
        </div>
      </>
    );
}

export function AdminPanelLog(props){
  
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [auth, setAuth] = useState(false);
 
  const [{ data, loading, error }, refetch] = useAxios(
    'http://localhost:4000/sessionData'
  )
  const handleChangeEmail = (event) => {
    setEmail(event.target.value)
  }
  const handleChangePass = (event) => {
    setPass(event.target.value)
  }
  

  const handleSubmit = async(event) => {
    event.preventDefault();
      console.log(data)
    axios
      .post("http://localhost:4000/adminLogData", {
        Email: email,
        Password: password,
      })
      .then(() => {
        console.log("dataAdmin sended")
      })
      .catch(err => {
        console.error(err);
      })
        
    

     
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    }

  const handleAuth = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:4000/sessionData", {
        auth: false,
      })
      .then(() => {
        console.log("dataAdmin sended")
      })
      .catch(err => {
        console.error(err);
      })
    
      //Update page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
  }
    return ( 
      <>
      <HeaderSite />
      <div action={"/adminLogData"} className="flex justify-center">
          <form method="post" encType="multipart/form-data" className="Form">
            <div className="flex flex-col">
              <label for="uname"><b>Email</b>
              <input className="m-2 ml-9" type="email" placeholder="Enter Email" name="email" onChange={handleChangeEmail} required />
              </label>
              <label for="psw"><b>Password</b>
              <input className="m-2" type="password" placeholder="Enter Password" name="psw" onChange={handleChangePass} required />
              </label>
            </div>
            <input type="submit" value="login" className="Form-submit" onClick={handleSubmit}/><br />
            {data?.auth && <input type="submit" value="log out" className="Form-submit" onClick={handleAuth}/>} 
          </form>
        </div>
      {data?.auth && <div>Вы вошли, куки существуют</div>}
      </>
    );
}