import React from 'react';
import AdminLayout from '../../AdminLayout';
import ManageInformationLayout from './ManageInformationLayout';

const page = () => {
    return (
        <div>
            <AdminLayout>
                <ManageInformationLayout>
                    hi
                </ManageInformationLayout>
            </AdminLayout>
        </div>
    );
};

export default page;