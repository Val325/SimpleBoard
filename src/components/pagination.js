import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import '../styles/tailwindS.css';


export function PaginationPages({ postsPerPage, totalPosts, paginate }) {
	const pageNumbers = [];
	
	
	for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++){
		pageNumbers.push(i);
	}
return (
	<div>
		<ul className="flex flex-row ml-8 p-4">
            {pageNumbers.map((number) => (
            	<Link to={`/thread/${number}`}>
	               <div key={number} onClick={() => paginate(number)} className="Pagination-page">
	               		{number}
	               </div>
               </Link>
            ))}
         </ul>
	</div>
);
}  