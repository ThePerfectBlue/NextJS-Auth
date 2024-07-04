"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Profile = () => {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      const res = await axios.post("/api/users/profile");
      console.log(res.data.data);
      setData(res.data.data._id);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="mb-10 text-3xl font-bold text-gray-800">Profile Page</h1>
      <h2 className="pb-2">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link
            className="text-blue-500"
            title="Profile"
            href={`/profile/${data}`}
          >
            {data}
          </Link>
        )}
      </h2>
      <hr />
      <button
        className="mx-10 p-2 border border-cyan-600 rounded-lg my-2 focus:outline-cyan-300  hover:bg-cyan-100"
        onClick={getUserDetails}
      >
        Get user details
      </button>
      <button
        className="mx-10 p-2 border border-red-400 rounded-lg my-2 focus:outline-red-600 hover:bg-red-100"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
