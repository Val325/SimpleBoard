import axios from "axios"
import { PaginationPages } from "./pagination.js"
import React, { useState } from "react";
import useAxios from 'axios-hooks'
import FormData from 'form-data'
import { Outlet, Link } from "react-router-dom";
import { HeaderSite } from "./header.js";
import { checkImageAndPutMAINpost} from "./functions.js";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import '../styles/tailwindS.css';

export function SendText(props){

  //
  //Main data
  //
  const location = useLocation()
  const [id, setId] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [auth, authSet] = useState(false);



  const [{ data, loading, error }, refetch] = useAxios(
    'http://localhost:4000/data'
  )

  const [{ sessionData, sessionloading, sessionerror }, sessionrefetch] = useAxios(
    'http://localhost:4000/sessionData'
  )
  //
  //Pagination
  //

  const [Posts, setPosts] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data?.slice(indexOfFirstPost, indexOfLastPost);

  //
  //
  //

 
  const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

  const handleChangeName = (event) => {
    setName(event.target.value)
  }

  const handleChangeText = (event) => {
    setText(event.target.value)
  }
  
  useEffect(() => {

    fetch("http://localhost:4000/sessionData")
      .then(res => res.json())
      .then(
        (result) => {
          authSet(result.auth)
        })


      }, [])

  useEffect(() => {

    //Get from URL id 
    let url = location.pathname;
    let urlParts = url.split('/');
    let id = urlParts[urlParts.length - 1];
    console.log(id)

     
    if (!id) {
      id = 1;
    }

    paginate(id)
      }, [location])

  const fileSend = (event) => {
    const formData = new FormData(); 
    formData.append('my-image-file', event.target.files[0], event.target.files[0].name);
    setImage(formData);
  }

  const handleSubmit = async(event) => {
    event.preventDefault();

    console.log(id)
    
    axios.post("http://localhost:4000/imageData",image, {
       headers: {
          'Content-Type': `multipart/form-data; boundary=${data.getBoundary}`,
       }
      }).then(() => console.log("success"))
      .catch(err => console.log(err));

    axios
      .post("http://localhost:4000/data", {
        id: id,
        dataText: text,
        dataName: name
      })
      .then(() => {
     //   console.log("data sended")
      })
      .catch(err => {
        console.error(err);
      })
      
      
      if (loading) return console.log("loading...");
      if (error) return console.log("error"); 
      
      //Update page
      
      
      
      setTimeout(() => {
        let downloadData = document.querySelector(".Form-submit");  
        downloadData.addEventListener("Click", refetch)
        
        window.location.reload();
        
      }, 1500);
      
        
        
      
      
    }
    const SendDeletePost = (idDelete) => {
      fetch('http://localhost:4000/deleteThread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: idDelete
        })
      })
    }


    const dataRender = currentPosts?.map((post, index) => 
        <div key={index} className="Post">
        <div>
          <span>id: {post.id} </span>
          <span>time: {post.time}</span>
          
          
          <p className="thereadName">Your name: {(post.name == "") ? "Anon" : ""}</p>
          {checkImageAndPutMAINpost(post.id, currentPage, index, { id: post.id, name: post.name, text: post.text, time: post.time})}
        </div>
          <p className="threadData Your-post">Your post:<br /> {post.text}</p>
          {(auth == true) &&  <button onClick={() => SendDeletePost(post.id)} className="Form-submit justify-self-end">Delete user</button>}
        </div>
        );
    
    return ( 
      
      <div>
      <HeaderSite />
        <div className="flex justify-center">
          <form action="/data" method="post" encType="multipart/form-data" className="Form">
            <input type="text" name="name" placeholder="Thread" className="m-2" value={name} onChange={handleChangeName}/><br />
            <textarea className="m-2" rows="4" cols="50" placeholder="your message" name="textData" value={text} onChange={handleChangeText}></textarea><br />
            <label className="Form-label" for="file">Upload file, all types convet to jpg</label>
            <input type="file" className="Form-file" name="file" onChange={fileSend}  /><br />
            <input type="submit" value="Отправить " className="Form-submit"  onClick={handleSubmit}  /><br />
          </form>
      </div>
        
        {dataRender}
        {
         <PaginationPages
            postsPerPage={postsPerPage}
            totalPosts={data?.length}
            paginate={paginate}/>
        }
        
      </div>
      
    );
}

