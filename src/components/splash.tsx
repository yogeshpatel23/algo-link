"use client";
import { initAccount } from "@/store/accountSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Splash = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => {
        dispatch(initAccount(data.accounts));
      });
    setIsLoading(false);
    return () => {};
  }, []);

  return isLoading ? <div>Loading</div> : null;
};

export default Splash;
