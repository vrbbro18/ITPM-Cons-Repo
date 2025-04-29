import { createSlice } from "@reduxjs/toolkit";
import portfolio1 from "../assets/img/portfolio-1.jpg";
import portfolio2 from "../assets/img/portfolio-2.jpg";
import portfolio3 from "../assets/img/portfolio-3.jpg";
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
];

const portfolioSlice = createSlice({
  name:"portfolio",
  initialState: {
    category: categories,
    project: projects
  },
  
})

export default portfolioSlice;
