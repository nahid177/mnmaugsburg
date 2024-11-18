import { useEffect, useState } from "react";

interface Category {
  _id: string;
  title: string;
  details: string;
}

const PolicyGet = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/policy");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          setError(data.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching policy data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="  flex flex-col  bg-gray-50 ">
      

      {loading && (
        <div className="text-lg text-gray-500 font-medium">Loading...</div>
      )}
      {error && (
        <div className="text-lg text-red-500 font-medium">{error}</div>
      )}

      {!loading && !error && (
        <div className="  xl:w-[500px] lg:w-[400px] md:w-[300px] w-[280px] p-2">
            
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 p-6"
            >
                <h2 className="text-center font-bold">Policy</h2>
              <h2 className="text-xl font-bold text-gray-800 mb-4 break-words">
                {category.title}
              </h2>
              <p className="text-gray-600 text-sm leading-6 break-words">
                {category.details}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyGet;
