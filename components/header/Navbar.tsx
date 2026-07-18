"use client"

import { logout } from "@/lib/actions/login"

const Navbar = () => {
  return (
    <nav>
      <div className="flex flex-row justify-between items-center h-16 shadow">
        <div></div>
        <div className="m-4">
          <button type="submit" onClick={logout} className="px-2 py-1 rounded bg-slate-300 cursor-pointer logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
