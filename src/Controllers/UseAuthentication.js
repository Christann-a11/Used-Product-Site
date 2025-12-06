// src/Controllers/UseAuthentication.js
import { useState, useEffect } from "react";

export const useAuthentication = () => {

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null && token !== "" && token !== "undefined";
  };

  const login = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return { isAuthenticated, login, logout };
};