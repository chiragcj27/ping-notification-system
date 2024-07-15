import React from 'react';
import { FC } from 'react';
import RandomAvatar from '@/components/randomAvatar';

interface UserCardProps {
    userId: string;
    email: string;
    username: string; // Add username prop
    onClick: () => void;
}

const UserCard: FC<UserCardProps> = ({ userId, email, username, onClick }) => {
    return (
        <div className="p-4 border rounded shadow-md sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
                <RandomAvatar /> 
                <div className="ml-4">
                    <p className="font-bold">{username}</p>
                    <p>User ID: {userId}</p>
                    <p>Email: {email}</p>
                </div>
            </div>
            <button onClick={onClick} className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ping
            </button>
        </div>
    );
};

export default UserCard;
