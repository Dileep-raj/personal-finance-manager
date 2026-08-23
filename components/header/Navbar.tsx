"use client"

import { logout } from "@/lib/actions/login"
import { LogOutIcon } from "lucide-react"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav>
      <div className="flex flex-row justify-between items-center h-16 shadow">
        <div className="flex items-center gap-2 p-4">
          <Link href="/dashboard" >Dashboard</Link>
        </div>
        <div className="m-4">
          <button type="submit" onClick={logout}
            className="gap-2 flex w-full items-center justify-center px-3 py-1.5 text-sm/6 font-semibold shadow-xs bg-blue-500 hover:bg-blue-400 mx-auto rounded text-white cursor-pointer m-3">
            <LogOutIcon className="w-5 h-5" />
            <span >Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
