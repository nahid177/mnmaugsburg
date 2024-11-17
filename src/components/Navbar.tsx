// src/components/Navbar.tsx
import React from 'react';

const Navbar = () => {
  return (
    <div className="flex items- xl:gap-10 lg:gap-10  md:gap-10 gap-2 mt-9">
            <div className="rounded-r-3xl xl:w-[900px] lg:w-[450px] md:w-[310px]   w-[220px] xl:h-16 lg:h-12 md:h-12 h-8 bg-sky-600 flex items-center justify-center text-white font-semibold xl:text-2xl lg::text-xl md:text-lg text-sm">
        MnM Augsburg
        </div> {/* Dark Blue with Text */}
      {/* Colored blocks */}
      <div className="flex xl:space-x-10 lg:space-x-10 md:space-x-10 space-x-1 ">
        <div className="xl:w-[130px] lg:w-[100px] md:w-[80px] sm:w-[50px] w-[35px]  xl:h-14 lg:h-12 md:h-12 h-8 bg-sky-500 rounded-r-3xl"></div> {/* Medium Blue */}
        <div className="xl:w-[130px] lg:w-[100px] md:w-[80px] sm:w-[50px] w-[35px] xl:h-14  lg:h-12  md:h-12  h-8  bg-sky-400 rounded-r-3xl" ></div> {/* Medium Light Blue */}
        <div className="xl:w-[630px] lg:w-[320px] md:w-[220px]  w-[110px] xl:h-14 lg:h-12 md:h-12 h-8 bg-sky-200 rounded-r-3xl"></div> {/* Light Blue */}

    
      </div>
    </div>
  );
};

export default Navbar;
