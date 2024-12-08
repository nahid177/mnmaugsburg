"use client";
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/admin/AdminLayout';

const InputPage = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Using useRouter for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, details }),
      });

      const data = await res.json();
      if (data.success) {
        // Redirect using router.push after successful form submission
        router.push('/admin/policy/GetPage');
      } else {
        setError(data.error || 'Failed to create category');
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
       <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Add New Category</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-gray-700 font-semibold mb-2">Details</label>
          <textarea
            id="details"
            name="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
   
  );
};

export default InputPage;
