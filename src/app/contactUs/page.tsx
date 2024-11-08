import ChatComponent from '@/components/ChatComponent';
import MessesNavBar from '@/components/MessesNavBar';
import React from 'react';

const page = () => {
    return (
        <div>
            <MessesNavBar></MessesNavBar>
            <ChatComponent></ChatComponent>
        </div>
    );
};

export default page;