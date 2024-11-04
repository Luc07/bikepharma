'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBicycle } from "react-icons/fa";

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <div className="navbar bg-base-300 flex justify-center items-center gap-5">
      <div className='ml-5'>
        <span className='text-[25px] font-black flex items-center gap-5'><FaBicycle size={50}/> BikePharma</span>
      </div>
      <div className="">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href="/dashboard"
              className={`${
                currentPath === '/dashboard' ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/locacoes"
              className={`${
                currentPath === '/locacoes' ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              Locações
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}