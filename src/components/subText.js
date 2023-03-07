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


export function SubText(props){
  
  let { state } = useLocation()
  let [id, setId] = useState(0);
  const [imagePost, setPostsImage] = useState(0);
  
  
  const [{ data, loading, error }, refetch] = useAxios(
    'http://localhost:4000/data/' + state.id
  )
  
  
    const dataRender = data?.map((post, index) => 
      <div key={index} className="Post">
      <div>
        <span>id: {post.id} </span>
        <span>time: {post.time}</span>
        <p className="thereadName">Your name: {(post.name == "") ? "Anon" : post.name}</p>
        {checkSubImageAndPut(state.id, post.id)}
      </div>
        <p className="threadData Your-post">Your post:<br /> {post.text}</p> 
      </div>);
    return ( 
      <>
      <HeaderSite />
      <SendPosted id={state.id} dataFrom={data} refetchForm={refetch} />
      <div className="Post">
        <div className="">
          <span>id: {state.id} </span>
          <span>time: {state.time}</span>
          <p className="thereadName">thread: {(state.name == "") ? "none" : state.name}</p>
          {checkImageAndPut(state.id)}
        </div>
        <p className="flex-row Your-post">Your post:<br /> {state.text}</p> 
      </div>
      {dataRender}
      </>
    );
}