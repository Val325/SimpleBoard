//Here are utils
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

export function checkImageAndPut(id) {
      try{
          const path = require("../../server/uploads/"+ String(id) + ".jpg")
          return  <a href={require("../../server/uploads/"+ String(id) + ".jpg")}>
          <img src={path} width={100} height={100} />
          </a> 
      }
      catch(err){
        return <span></span>
      }
}

export function checkImageAndPutMAINpost(id, currentpage, ind, obj) {
    //Function for main post, not for subPost
    //obj = { id: post.id, name: post.name, text: post.text }
      try{
          return <a href={require("../../server/uploads/"+ String(id) + ".jpg")}>
          <img src={require("../../server/uploads/"+ String(id) + ".jpg")} width={100} height={100} />
          <Link to={`/b/thread/${currentpage}/${ind}`} state={obj}>to thread</Link>
          </a>
      }
      catch(err){
        console.log(err)
        return <Link to={`/b/thread/${currentpage}/${ind}`} state={obj}>to thread</Link>
        
      }
}

export function checkSubImageAndPut(id, indexFunc) {
      try{
          const path = require("../../server/uploads/"+ String(id) + "/"
           + String(indexFunc) + ".jpg")
          return  <a href={require("../../server/uploads/"+ String(id) + "/" + String(indexFunc) + ".jpg")}>
          <img src={path} width={100} height={100} />
          </a> 
      }
      catch(err){
        return <span></span>
      }
}

