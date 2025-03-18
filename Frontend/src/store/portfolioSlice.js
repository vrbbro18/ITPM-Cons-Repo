import { createSlice } from "@reduxjs/toolkit";
import portfolio1 from "../assets/img/portfolio-1.jpg";
import portfolio2 from "../assets/img/portfolio-2.jpg";
import portfolio3 from "../assets/img/portfolio-3.jpg";
import portfolio4 from "../assets/img/portfolio-4.jpg";
import portfolio5 from "../assets/img/portfolio-5.jpg";
import portfolio6 from "../assets/img/portfolio-6.jpg";
const categories = [
  {
    name: "All",
    img: portfolio1,
  },
  {
    name: "Construction",
    img: portfolio2,
  },
  {
    name: "Renovation",
    img: portfolio3,
  },
];
const projects = [
  {
    name: "Project name 1",
    address: "Street, New York, USA",
    img: portfolio1,
  },
  {
    name: "Project name 2",
    address: "Street, New York, USA 2",
    img: portfolio2,
  },
  {
    name: "Project name 3",
    address: "Street, New York, USA 3",
    img: portfolio3,
  },
  {
    name: "Project name 4",
    address: "Street, New York, USA 3",
    img: portfolio4,
  },
  {
    name: "Project name 5",
    address: "Street, New York, USA 3",
    img: portfolio5,
  },
  {
    name: "Project name 6",
    address: "Street, New York, USA 3",
    img: portfolio6,
  },
];

const portfolioSlice = createSlice({
  name:"portfolio",
  initialState: {
    category: categories,
    project: projects
  },
  
})

export default portfolioSlice;
