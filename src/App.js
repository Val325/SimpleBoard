import React, { useState, useEffect } from "react";

//import './styles/styles.css';
import './styles/tailwindS.css';
import { SendText } from "./components/sendMsg.js";
import { HeaderSite } from "./components/header.js";
import { DataSend } from "./context/DataBaseContext.js";
import { Outlet, Link } from "react-router-dom";

function App() {
  

  
  return (
    <div>
    <HeaderSite />
      
    
      <main className="flex items-center flex-col" >

        
        <div className="flex flex-col grow">
          <img className="drop-shadow-2xl" width={550} height={550} className="m-12" src={require('./mainImage/mainImage.jpg')} />
          
          
                 <span className="text-lg font-semibold">Boards:</span><br />
                   <Link to={"b/thread/1"}>
                      <span className="text-lg ">/b</span>
                    </Link>            
          </div>
          
        
      </main>
      <div>
      <footer className="bg-teal-600 w-screen shadow-lg fixed bottom-0 left-0 right-0">
        <h1 className="pl-10 pt-2 text-3xl font-bold text-white">7chan</h1>
        <p className="pl-10 pb-5 text-3xl font-bold text-white">Tg admin is @garriMal</p>
      </footer>
    </div>
    </div>
  );
}  

export default App;
/*
<SendText/>
      */