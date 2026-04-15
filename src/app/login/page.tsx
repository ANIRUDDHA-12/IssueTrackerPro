"use client"
import {  useState } from "react"
import { loginUser } from "../actions/auth"

interface loginFormData {
    email:string,
    password:string
}

interface AuthUIState {
    isLoading:boolean,
    error:string | null
}

export default function  LoginFormData(){
    const [data,setData]=useState<loginFormData>({email :'',password:''})
    const [uiState,setUIState]=useState<AuthUIState>({isLoading:false,error:null})

    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        const {name,value}=e.target
        setData((prev=>({
            ...prev,
            [name]:value
        })))
    }

    async function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        setUIState({isLoading:true,error:null})
         
        const result = await loginUser(data.email,data.password)

        if(result?.error){
            setUIState({isLoading:false,error:result.error})
        }
    }

  

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
             <form onSubmit={handleSubmit}
            className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md border border-gray-200"
             >

             <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
            </div>  

            {uiState.error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {uiState.error}
                </div>
            )}
           <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-black"
              placeholder="you@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-black"
              placeholder="••••••••"
            />
          </div>
        </div>

            <button 
            type="submit" 
            disabled={uiState.isLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
            {uiState.isLoading ? 'Authenticating':"Login"}
            </button>

        </form>
        </div>
    )
}