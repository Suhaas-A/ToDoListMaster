import React from 'react'
import Login from './components/login'
import Register from './components/register'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/home'
import Test from './components/test'

function App() {
    const router = createBrowserRouter([
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Register />
        },
        {
            path: '/home',
            element: <Home />
        },
        {
            path: '/',
            element: <Test />
        }
    ])

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
