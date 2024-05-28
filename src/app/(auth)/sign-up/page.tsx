'use client'
import React, { useEffect, useState } from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm} from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/router'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const page = () => {
    const[username, setUsername] = useState('')
    const [usernameMessage, setUernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounceUsername = useDebounceValue(username, 500)
    const { toast } = useToast()
    const router = useRouter(); 

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues:{
        username: '',
        email:'',
        password:''
      }
    })
    useEffect(()=>{
      const checkUsernameUnique = async ()=>{
        if(debounceUsername){
          setIsCheckingUsername(true)
          setUernameMessage('')
          try{
            const response = await axios.get(`/api/check-username-unique?username=$`)
            setUernameMessage(response.data.message)
          }catch(error)
          {
             const axiosError = error as AxiosError<ApiResponse>
             axiosError.response?.data.message ?? "Error checking username" 
          }
          finally{
            setIsCheckingUsername(false)
          }
        }
      }
      checkUsernameUnique()
    },[debounceUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>)=>{
      setIsSubmitting(true)
      try {
        const response = await axios.post<ApiResponse>('/api/sign-up',data)
        toast({
          title:'Success',
          description:response.data.message
        })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } catch (error) {
        console.error("Error in Signup of user", error)
        const axiosError = error as AxiosError<ApiResponse>
        let errorMessase = axiosError.response?.data.message
        toast({
          title:"SignUp faild",
          description:errorMessase,
          variant:"destructive"
        })
        setIsSubmitting(false) 
      }
  }
    return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
      <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
        join Mystry Message
      </h1>
      <p className='mb-4'>Sign Up to Start your anonymous adventure</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" 
                {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  setUsername(e.target.value)
                }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type='password' placeholder ="password" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting}>SignUp
        {
          isSubmitting ?(
            <>
            <Loader2  className=' "mr-2 h-4 w-4 animate-spin'/>Please wait
            </>
          ):('signup')
        }
        </Button>
        </form>
        </Form>
        <div className='text-center'>
        <p>
          Already a member?{' '}
          <Link  href= "sign-in" className='text-blue-600 hover:text-blue-800' > Sign in</Link>
        </p>
        </div>
      </div>
    </div>
  )
}

export default page