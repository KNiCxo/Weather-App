import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'; 

import MainView from './main-view/MainView.jsx'
import ListView from './list-view/ListView.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainView></MainView>
  },
  {
    path: '/list',
    element: <ListView></ListView>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}></RouterProvider>
)