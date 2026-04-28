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
            className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-xl border border-gray-200"
             >

             <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
            </div>  

            {uiState.error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {uiState.error}
                </div>
            )}
           <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        </div>

            <button 
            type="submit" 
            disabled={uiState.isLoading}
            className="w-full flex justify-center bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-all duration-200"
            >
            {uiState.isLoading ? 'Authenticating':"Login"}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-slate-500">
                Don't have an account?{" "}
                <a href="/signup" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                  Sign up here
                </a>
              </span>
            </div>

        </form>
        </div>
    )
}