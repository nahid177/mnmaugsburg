// create-model.tsx

import InfoForm from "@/components/CreateInfomation/InfoForm";
import AdminLayout from "../AdminLayout";

const AddInformationPage: React.FC = () => {
  return (
    <AdminLayout>
         <div className="min-h-screen bg-gray-100 p-8">
      <InfoForm />
    </div> 
    </AdminLayout>
  
  );
};

export default AddInformationPage;
