"use client";

import axios from "axios";
import Link from "next/link";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VerifyEmailPage = () => {
  //   const router = useRouter();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      const res = await axios.post("/api/users/verifyEmail", { token });

      if (res.data.status === 200) {
        setVerified(true);
      }
      if (res.data.status === 400) {
        setVerified(true);
        window.alert("User already verified");
      }
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    setError(false);
    const urlToken = window.location.href.split("=")[1];
    setToken(urlToken || "");
    // const { query } = router;
    // const urlToken = query.token
  }, []);

  useEffect(() => {
    setError(false);
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-2">
      <h1 className="mb-10 text-3xl font-bold text-gray-800">Verify Email</h1>
      <h2 className="p-2 rounded-lg bg-gray-800 text-white">
        {token ? `${token}` : "No token"}
      </h2>
      {verified && (
        <div className="py-2 flex flex-col my-4 items-center justify-center">
          <h2 className="text-green-700 text-xl">Verified!</h2>
          <Link
            className="mx-10 p-2 border border-gray-300 rounded-lg my-2 focus:outline-gray-600 "
            href="/login"
          >
            Login
          </Link>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
