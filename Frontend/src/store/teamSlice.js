import { createSlice } from "@reduxjs/toolkit";
import team1 from "../assets/img/team-1.jpg";
import team2 from "../assets/img/team-2.jpg";
import team3 from "../assets/img/team-3.jpg";
import team4 from "../assets/img/team-4.jpg";

const teams = [
  {
    img: team1,
    nam: "Saran Zafar",
    position: "CEO & Chairman",
  },
  {
    img: team2,
    nam: "Bilal Ahmed",
    position: "Chairman",
  },
  {
    img: team3,
    nam: "Ayaz Shafaq",
    position: "Vice Chairman",
  },
  {
    img: team4,
    nam: "First Name",
    position: "CEO",
  },
];

const teamSlice = createSlice({
  name: 'teams',
  initialState: teams,
 
  
})

export default teamSlice;
