"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import UserTable from "./UserTable";
import EditUser from "./EditUser";

type AllUsers = {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [allUsers, setAllUsers] = useState<AllUsers[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<AllUsers[] | undefined>(
    []
  );
  const [editUser, setEditUser] = useState<AllUsers[]>([]);
  const [showEdit, setShowEdit] = useState(false);

  // fetching Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const allUsers = await axios.get(
          `https://reqres.in/api/users?page=${pageNumber}`
        );
        setAllUsers(allUsers.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [pageNumber]);

  // handle user details during login
  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentToken") || "null" // fetching token from local storage
    );

    if (!currentUser) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      setUser(currentUser);
    }
  }, []);

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentToken"); // removing token
    navigate("/"); // redirecting to login
    toast.success("Logged out");
  };

  // handling filters of the users table
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const query = e.target.value.toLowerCase();
    setQuery(query);

    setFilteredUsers(
      allUsers?.filter((user: AllUsers) =>
        (["first_name", "last_name", "email"] as Array<keyof AllUsers>).some(
          (key) => user[key].toString().toLowerCase().includes(query)
        )
      )
    );
  };


  return (
    <div className="min-h-screen bg-grad flex">
      {showEdit && (
        <EditUser
          setEditUser={setEditUser}
          editUser={editUser}
          setAllUsers={setAllUsers}
          setShowEdit={setShowEdit}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 relative p-6 pb-0">
        {/* Navbar */}
        <nav className="flex h-[50px] text-black fixed z-[900] inset-0 justify-between gap-5 items-center nav-grad p-4 shadow-md">
          <h1 className="tracking-wider text-2xl">EMPLOYWISE</h1>
          <div className="flex gap-2 items-center">
            <h2 className="text-md hidden md:block font-semibold">
              Welcome, {user?.name || "User"}!
            </h2>
            <div
              onClick={() => setShowUserDetails(!showUserDetails)}
              className="p-2 rounded-full cursor-pointer bg-gray-300"
            >
              {" "}
              <User color="black" />
            </div>
            {showUserDetails && (
              <div className="p-4 flex flex-col z-[1000] absolute gap-2 right-2 shadow-2xl top-16 bg-white rounded-md">
                <button
                  onClick={handleLogout}
                  className="bg-yellow-400 cursor-pointer text-white px-4 py-2 rounded hover:bg-yellow-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="mt-10 w-full max-w-[90vw] text-black md:p-6 rounded-lg">
          <div className="relative md:w-[80%] w-[95%] items-center flex gap-6">
            <input
              onChange={(e) => handleFilter(e)}
              value={query}
              placeholder="Search by Firstname, Lastname and Email"
              className="h-[40px] w-full md:ml-6 pl-3 rounded-md border border-gray-300 focus:outline-none"
              type="text"
            />
          </div>
          <div className="md:p-6 pt-4">
            <h2 className="text-2xl font-bold mb-4">User Data Table</h2>
            {loading ? (
              <p className="text-xl text-black">Loading</p>
            ) : query !== "" && filteredUsers?.length === 0 ? (
              <p className="text-xl text-black">No Match Found</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <UserTable
                    allUsers={allUsers}
                    setShowEdit={setShowEdit}
                    setAllUsers={setAllUsers}
                    setEditUser={setEditUser}
                    query = {query}
                    filteredUsers = {filteredUsers}
                  />
                </div>
                <div className="w-full items-center justify-center gap-3 my-4 flex">
                  <span
                    className="p-1 bg-gray-500 rounded-full cursor-pointer"
                    onClick={() => pageNumber === 2 && setPageNumber(1)}
                  >
                    <ChevronLeft />
                  </span>
                  <span className="text-xl">{pageNumber}</span>
                  <span
                    className="p-1 bg-gray-500 rounded-full cursor-pointer"
                    onClick={() => pageNumber < 2 && setPageNumber(2)}
                  >
                    <ChevronRight />
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
