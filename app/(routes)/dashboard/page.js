"use client";
import React, { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/clerk-react';

import { Button } from "../../../@/components/ui/button";
import { Card } from "../../../@/components/ui/card";
import { cn } from "@/lib/utils";
import { Settings, LucidePictureInPicture2, UserCircle, FilePenLineIcon, ActivityIcon, BookMarkedIcon, ExternalLinkIcon, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { HashLoader } from 'react-spinners'

import { usePathname } from 'next/navigation';
// import { SideBar } from "./sidebar/SideBar"


const routes = [
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
    color: "text-sky-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Appraisal Form",
    icon: FilePenLineIcon,
    href: "/appraisal-form",
    color: "text-sky-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Events",
    icon: ExternalLinkIcon,
    href: "/events",
    color: "text-sky-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Activities",
    icon: ActivityIcon,
    href: "/activities",
    color: "text-sky-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Publications",
    icon: BookMarkedIcon,
    href: "/publications",
    color: "text-sky-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Lectures",
    icon: LucidePictureInPicture2,
    href: "/lectures",
    color: "text-sky-500",
    bgColor: "bg-violet-500/10",
  },
];

const tools = routes;

const DashboardPage = () => {
  const { isLoaded, user } = useUser();
  const [userExists, setUserExists] = useState(false);
  
  const pathname = usePathname();
  
  const router = useRouter();

  useEffect(() => {
    const checkAndAddUser = async () => {
      if (isLoaded && user) {
        console.log('user: ', user.emailAddresses[0].emailAddress);
        try {
          // Check if user exists
          const res = await fetch(`/api/users/check?email=${user.emailAddresses[0].emailAddress}`);
          const data = await res.json();
          // console.log('data: ', data);
          setUserExists(data.exists);
          
          // Add user if not exists
          if (!data.exists) {
            const addUserRes = await fetch('/api/users/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.emailAddresses[0].emailAddress,
                fullName: user.fullName,
                // username: user.username,
              }),
            });
            const addUserData = await addUserRes.json();
            // console.log("added", addUserData);
          } 
          // else {
          //   console.log("exists");
          // }
          // console.log('done');
        } catch (error) {
          console.error('Error checking or adding user:', error);
        }
      }
    };

    checkAndAddUser();
  }, [isLoaded, user]); // Depend on isLoaded and user

  // Handle loading state
  if (!isLoaded) {
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
        <HashLoader color='#a8ccff'/>
      </div>
    );
  }

  return (
    <div>
      <header className='w-screen flex justify-end items-end p-3'>
        <UserButton className='h-5'/>
      </header>
      <main>
        <div>
          {/* Sidebar for medium and larger screens */}
          <div
              className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[100]"
              style={{
                background: "rgb(30, 30, 50)",
              }}
            >
              <div className='space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white'>
              <div className='px-3 py-2 flex-1'>
                  <a href="/dashboard" className='flex items-center pl-3 mb-14'>
                      <div className='relative w-8 h-8 mr-4'>
                          <img src="/logo_self_appraise.jpg" alt="logo" />
                      </div>
                      <h1 className={cn('text-xl')}>
                          Self Appraisal
                      </h1>
                  </a>
                  {/* links */}
                  <div className='space-y-1'>
                      {routes.map((route) => (
                          <a href={route.href} key={route.href} className={cn('text-md group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition', pathname  === route.href ? "text-white bg-white/10" : "text-zinc-400 ")}>
                              <div className=' flex items-center flex-1 '>
                                  <route.icon className={cn("h-6 w-6 mr-3 ", route.color)} />
                                  {route.label}
                              </div>
                          </a>
                      ))}
                  </div>
              </div>
          </div>
          {/* <SideBar  end /> */}
          </div>
          {/* Main content */}
          <main className="md:pl-72">
            {/* <NavBar /> */}
            {/* {children} */}
            <div className='w-full h-full flex flex-col justify-center items-center'>
              <h1 className='mb-2'>Sample table</h1>
              <SampleTable />
            </div>
          </main>
        </div>
        {/* <Dashboard /> */}
        {/* <h1>Hello <span className='bg-slate-900 text-white p-2 rounded-md'>{user.fullName || user.username}</span></h1>
        <p>Welcome to your dashboard.</p> */}
        {/* <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-slate-800">
          Create Imagination with A.I.
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Collaborate with AI and unleash your creativity
        </p>
      </div>

      <div className="px-4 md:px-20 lg:px-32 space-y-4 ">
        {tools.map((tool) => (
          <Card
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
            onClick={() => router.push(tool.href)}
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md ", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div> */}
      </main>
    </div>
  );
};

export default DashboardPage;



const SampleTable = () => {
  return (
<div className="overflow-x-auto max-w-[50vw]">
  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
    <thead className="ltr:text-left rtl:text-right">
      <tr>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Sr. no</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Faculty Name</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Role</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">View</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      <tr className="odd:bg-slate-50">
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">1</td>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Nency Makwana</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">System Analysis, Database Design</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700"><MoreHorizontal /></td>
      </tr>

      <tr className="odd:bg-slate-50">
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">2</td>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Atreyee Joshi</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">System Design, Database Design</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700"><MoreHorizontal /></td>
      </tr>

      <tr className="odd:bg-slate-50">
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">3</td>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Rohit Solanki</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">Back-end, Database Design, DBA</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700"><MoreHorizontal /></td>
      </tr>
      <tr className="odd:bg-slate-50">
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">4</td>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Prince Rupavatiya</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">Front end, UI/UX</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700"><MoreHorizontal /></td>
      </tr>
    </tbody>
  </table>
</div>
  )
}