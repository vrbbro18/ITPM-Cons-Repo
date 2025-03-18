import { createSlice } from "@reduxjs/toolkit";
import services1 from "../assets/img/service-1.jpg";
import services2 from "../assets/img/service-2.jpg";
import services3 from "../assets/img/service-3.jpg";
import services4 from "../assets/img/service-4.jpg";
import services5 from "../assets/img/service-5.jpg";
import services6 from "../assets/img/service-6.jpg";

const services = [
  {
    serviceImg: services1,
    title: "Web Design",
    logo: "fa-home",
    body: " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis beatae sint, labore obcaecati facilis quo soluta praesentium repudiandae dolor officia, iste repellat hic et earum architecto rem! Quisquam, laboriosam et?",
  },
  {
    serviceImg: services2,
    title: "Web Design 2",
    logo: "fa-drafting-compass",
    body: " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis beatae sint, labore obcaecati facilis quo soluta praesentium repudiandae dolor officia, iste repellat hic et earum architecto rem! Quisquam, laboriosam et?",
  },
  {
    serviceImg: services3,
    title: "Web Design 3",
    logo: "fa-palette ",
    body: " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis beatae sint, labore obcaecati facilis quo soluta praesentium repudiandae dolor officia, iste repellat hic et earum architecto rem! Quisquam, laboriosam et?",
  },
];
const servicesSlice = createSlice({
  name:"services",
  initialState: services,
  
})

export default servicesSlice;
