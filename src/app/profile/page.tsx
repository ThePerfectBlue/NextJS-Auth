"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Profile = () => {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const [verifyMessage, setVerifyMessage] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

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

  const getUserDetails = async () => {
    try {
      const res = await axios.post("/api/users/profile");
      console.log(res.data.data);
      setData(res.data.data._id);
      if (!res.data.data.isVerified) {
        setVerifyMessage(true);
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {verifyMessage && (
        <div
          className="rounded-lg bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-10"
          role="alert"
        >
          <p className="font-bold">Verify Email</p>
          <p>Please verify using the link sent to your registered email</p>
        </div>
      )}
      <h1 className="mb-10 text-3xl font-bold text-gray-600">Profile Page</h1>
      <h2 className="pb-2">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link
            className="text-blue-500"
            title="Profile"
            href={`/profile/${data}`}
            target="_blank"
          >
            {data}
          </Link>
        )}
      </h2>
      <hr />
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
