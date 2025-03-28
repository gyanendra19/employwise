import axios from 'axios';
import { X } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

type AllUsers = {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
    email: string;
  };

type EditUserProps = {
    setEditUser: (editUser: any) => void
    editUser: AllUsers[]
    setAllUsers: (allUsers: any) => void
    setShowEdit: (showEdit: boolean) => void
}

const EditUser = ({setEditUser, editUser, setAllUsers, setShowEdit}: EditUserProps) => {

    // updating details in the UI
      const changeUserDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditUser((prev: AllUsers[]) =>
          prev.map((user: AllUsers) => ({ ...user, [e.target.name]: e.target.value }))
        );
      };

      // updating the user details
      const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (!editUser || editUser.length === 0) return;
          const toastId = toast.loading("Processing..");
      
          try {
            const response = await axios.put(
              `https://reqres.in/api/users/${editUser[0].id}`,
              {
                first_name: editUser[0].first_name,
                last_name: editUser[0].last_name,
                email: editUser[0].email,
              }
            );
      
            if (response.status === 200) {
              setAllUsers((prevUsers: AllUsers[]) =>
                prevUsers
                  ? prevUsers.map((user) =>
                      user.id === editUser[0].id ? editUser[0] : user
                    )
                  : []
              );
              toast.success("User updated Successfully", { id: toastId });
            }
      
            setShowEdit(false);
          } catch (error) {
            toast.error("Error updating user", { id: toastId });
            console.error("Error updating user:", error);
          }
        };
    
  return (
    <div className="fixed z-[1000] w-full bg-black/20 h-full flex justify-center items-center">
          <div className="bg-white px-6 relative p-4 w-[90%] h-[35%] md:w-[40%] md:h-[40%] rounded-lg shadow-lg">
            <span
              onClick={() => setShowEdit(false)}
              className="absolute right-4 top-4 cursor-pointer"
            >
              <X />
            </span>
            <h1 className="py-5 text-2xl font-semibold">UPDATE USER</h1>
            <form
              onSubmit={updateUser}
              className="flex gap-5 flex-wrap"
              action=""
            >
              <input
                name="first_name"
                value={editUser[0].first_name}
                onChange={(e) => changeUserDetails(e)}
                className="border w-[45%] focus:outline-none border-gray-200 rounded-md h-[40px] p-2"
                type="text"
              />
              <input
                name="last_name"
                value={editUser[0].last_name}
                onChange={(e) => changeUserDetails(e)}
                className="border w-[45%] focus:outline-none border-gray-200 rounded-md h-[40px] p-2"
                type="text"
              />
              <input
                name="email"
                value={editUser[0].email}
                onChange={(e) => changeUserDetails(e)}
                className="border w-[65%] md:w-[45%] focus:outline-none border-gray-200 rounded-md h-[40px] p-2"
                type="text"
              />
              <button
                type="submit"
                className="px-4 cursor-pointer hover:bg-blue-600 text-white absolute bottom-4 right-4 md:bottom-6 md:right-8 py-1 bg-blue-500 rounded-md"
              >
                Update
              </button>
            </form>
          </div>
        </div>
  )
}

export default EditUser