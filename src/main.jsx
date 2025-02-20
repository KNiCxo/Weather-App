import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'; 

// Import the pages
import MainView from './main-view/MainView.jsx'
import ListView from './list-view/ListView.jsx';

// Import global styling
import './index.css';

const router = createBrowserRouter([
  {
    // Main page
    path: '/',
    element: <MainView></MainView>
  },
  {
    //List View page
    path: '/list',
    element: <ListView></ListView>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}></RouterProvider>
)