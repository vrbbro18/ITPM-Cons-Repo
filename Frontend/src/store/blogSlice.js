import { createSlice } from "@reduxjs/toolkit";
import blog1 from "../assets/img/blog-1.jpg";
import blog2 from "../assets/img/blog-2.jpg";
import blog3 from "../assets/img/blog-3.jpg";
import user from "../assets/img/user.jpg";


  const blogs = [
    {
      id: '001',
      username: "Ali Raza",
      date: "04 Feb 2021",
      img: blog1,
      title: "What are our basic rules for work?",
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo esse, voluptatem temporibus beatae dolorem, modi perferendis sapiente quaerat tenetur non consequatur assumenda dignissimos placeat rerum rem accusamus? Amet, quaerat libero!'
    },
    {
      id: '002',
      username: "Tayyab Arshad",
      date: "14 Feb 2023",
      img: blog2,
      title: "is Study importand or not?",
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo esse, voluptatem temporibus beatae dolorem, modi perferendis sapiente quaerat tenetur non consequatur assumenda dignissimos placeat rerum rem accusamus? Amet, quaerat libero!'
    },
    {
      id: '003',
      username: "Saran Zafar",
      date: "23 Jan 2024",
      img: blog3,
      title: "Need of worker if required",
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo esse, voluptatem temporibus beatae dolorem, modi perferendis sapiente quaerat tenetur non consequatur assumenda dignissimos placeat rerum rem accusamus? Amet, quaerat libero!'
    },
    
  ];
  
  const blogSlice = createSlice({
    name:'blogs',
    initialState: blogs,
    reducers:{
      getSingleBlog: (state, action)=>{
        const singleBlog = blogs.filter(blog=>blog.id===action.payload)
        return singleBlog;
    }}
  })

  export default blogSlice;
  export const blogsAction = blogSlice.actions