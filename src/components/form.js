import axios from "axios"
import React, { useState } from "react";
import useAxios from 'axios-hooks'
import FormData from 'form-data'
import { HeaderSite } from "./header.js";
import { useLocation } from 'react-router-dom';
import '../styles/tailwindS.css';

export function SendPosted(props) {
  const [id, setId] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  
  const [{ data, loading, error }, refetch] = useAxios(
    'http://localhost:4000/data'
  )

  const handleChangeName = (event) => {
    setName(event.target.value)
  }
  const handleChangeText = (event) => {
    setText(event.target.value)
  }

  

  const fileSend = (event) => {
    const formData = new FormData(); 
    formData.append('my-image-inner', event.target.files[0], event.target.files[0].name);
    setImage(formData);
  }
  
  const handleSubmit = async(event) => {
    
    event.preventDefault();
    

    
    
    axios
      .post("http://localhost:4000/imageDataPost/", image, {
         headers: {
          'Content-Type': `multipart/form-data; boundary=${data.getBoundary}`,
        },
        }).then(() => console.log("success"))
        .catch(err => console.log(err));


    
    axios
      .post("http://localhost:4000/data/" + props.id, {
        dataText: text,
        dataName: name,
        id:id,
      })
      .then(() => {
      })
      .catch(err => {
        console.error(err);
      })
      setTimeout(() => {
        let downloadData = document.querySelector(".Form-submit");  
        downloadData.addEventListener("Click", refetch)
        window.location.reload();
      }, 1500);
    }
  
  return (
    
        <div className="flex justify-center">
          <form action={"/data/" + props.id} method="post" encType="multipart/form-data" className="Form">
            <input type="text" name="name" placeholder="Thread" className="m-2" value={name} onChange={handleChangeName}/><br />
            <textarea className="postAnon inputs" rows="4" cols="50" placeholder="your message" name="textData" value={text} onChange={handleChangeText}></textarea><br />
            <input type="file" name="my-image-inner" className="Form-file" onChange={fileSend} /><br />
            <input type="submit" value="Отправить " className="Form-submit"  onClick={handleSubmit}/><br />
          </form>
        </div>
    
  );
}  
