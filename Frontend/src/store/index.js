import { configureStore } from "@reduxjs/toolkit";
import servicesSlice   from "./servicesSlice"
import portfolioSlice from "./portfolioSlice";
import teamSlice from "./teamSlice";
import blogSlice from "./blogSlice";



const mySiteStore = configureStore({
  reducer: {
    services: servicesSlice.reducer,
    portfolio: portfolioSlice.reducer,
    teams: teamSlice.reducer,
    blogs: blogSlice.reducer
  }
})

export default mySiteStore