import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";

type AllUsers = {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
};

type UserTableProps = {
  allUsers: AllUsers[] | null;
  setShowEdit: (showEdit: boolean) => void;
  setAllUsers: (allUsers: any) => void;
  setEditUser: (editUser: AllUsers[]) => void;
  query: string
  filteredUsers: AllUsers[] | undefined
};

const UserTable = ({
  allUsers,
  setShowEdit,
  setAllUsers,
  setEditUser,
  query,
  filteredUsers
}: UserTableProps) => {

    // getting the user that is to be updated
  const handleEdit = (userId: string) => {
    if (allUsers) {
      const userToBeEdited = allUsers.filter((user) => user.id === userId); // filtering out by id
      setEditUser(userToBeEdited);
    }
  };

  // Deleting the user
  const deleteUser = async (userId: string) => {
    const toastId = toast.loading("Processing..");
    try {
      const response = await axios.delete(
        `https://reqres.in/api/users/${userId}`
      );

      if (response.status === 204) {
        setAllUsers((prevUsers: AllUsers[]) =>
          prevUsers
            ? prevUsers.filter((user: AllUsers) => user.id !== userId)
            : []
        );
        toast.success("User Deleted Successfully", { id: toastId });
      }
    } catch (error) {
      toast.error("Error Deleting User", { id: toastId });
      console.error("Error deleting user:", error);
    }
  };

  return (
    <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <tr>
          <th className="p-4 text-center">First Name</th>
          <th className="p-4 text-center">Last Name</th>
          <th className="p-4 text-center">Email</th>
          <th className="p-4 text-center">Profile Pic</th>
          <th className="p-4 text-center">Actions</th>
        </tr>
      </thead>

      {/* Body */}
      <tbody>
        {(query === '' ? allUsers ?? [] : filteredUsers ?? []).map((user, index) => (
          <tr
            key={user.id}
            className={`${
              index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
            } hover:bg-blue-50 transition`}
          >
            <td className="px-4 text-center text-gray-800">{user.first_name}</td>
            <td className="px-4 text-center text-gray-800">{user.last_name}</td>
            <td className="px-4 text-center text-gray-800">{user.email}</td>
            <td className="px-4 text-center">
              <img
                className="h-12 w-12 rounded-full mx-auto border-2 border-blue-400"
                src={user.avatar}
                alt="Profile"
              />
            </td>
            <td className="p-4 text-center">
              <button
                className="text-blue-500 cursor-pointer hover:text-blue-700 p-2 transition-all"
                onClick={() => {
                  setShowEdit(true);
                  handleEdit(user.id);
                }}
              >
                <Pencil size={20} />
              </button>
              <button
                className="text-red-500 cursor-pointer hover:text-red-700 p-2 transition-all"
                onClick={() => deleteUser(user.id)}
              >
                <Trash size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
