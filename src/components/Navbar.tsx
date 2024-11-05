// src/components/Navbar.tsx
import React from 'react';

const Navbar = () => {
  return (
    <div className="flex items- gap-10 mt-9">
            <div className="rounded-r-3xl w-[900px] h-16 bg-sky-600 flex items-center justify-center text-white font-semibold text-2xl">
          ENDOSCOPIC PRACTICE
        </div> {/* Dark Blue with Text */}
      {/* Colored blocks */}
      <div className="flex space-x-10">
        <div className="w-[130px] h-14 bg-sky-500 rounded-r-3xl"></div> {/* Medium Blue */}
        <div className="w-[130px] h-14 bg-sky-400 rounded-r-3xl" ></div> {/* Medium Light Blue */}
        <div className="w-[630px] h-14 bg-sky-200 rounded-r-3xl"></div> {/* Light Blue */}

    
      </div>
    </div>
  );
};

export default Navbar;
