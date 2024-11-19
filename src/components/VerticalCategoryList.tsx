// src/components/VerticalCategoryList.tsx
import React, { useEffect, useState } from 'react';
import { InformationData } from '@/interfaces/InformationTypes';
import Link from 'next/link';

const VerticalCategoryList: React.FC = () => {
  const [data, setData] = useState<InformationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/client/createInfo');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || 'Failed to fetch data.');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className=" p-4 bg-white rounded-xl shadow-md xl:w-[550px] lg:w-[350px]  md:w-[350px] w-[280px] xl:mx-7 lg:mx-4 md:mx-3 ">
      <div className="flex flex-col gap-4">
        <h2 className='text-center font-bold'>Click Category</h2>
        {data.map((item) =>
          item.categories && item.categories.length > 0 ? (
            item.categories.map((category) => (
              <div key={category._id} className="bg-sky-200 border rounded-lg shadow-md p-4 hover:bg-sky-400 transition-all duration-300 ease-in-out">
                <Link href={`/showInformationPage/${item._id}/${category._id}`}>
                  <div className="block text-center break-words">
                    <div className="text-gray-700 xl:text-lg lg:text-lg md:text-lg text-sm font-semibold hover:text-white transition-colors duration-150 ease-in-out">
                      {category.name}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : null
        )}
      </div>
    </div>
  );
};

export default VerticalCategoryList;
