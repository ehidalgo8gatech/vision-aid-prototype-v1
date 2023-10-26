// This function gets called at build time

import React from "react";
import { useState } from "react";
import AddUserForm from "./components/AddUserForm";
import SearchBar from "./components/SearchBar";
import UserList from "./components/UserList";
import Navigation from "./navigation/Navigation";
import Router, { useRouter } from "next/router";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [choice, setChoice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOther, setSearchOther] = useState(false);

  const router = useRouter();
  const searchUsers = async (searchInput, choice, showOther) => {
    setSearchTerm(searchInput);
    setSearchOther(showOther);
    if (showOther) {
      try {
        const beneficiary = await fetch(
          "/api/beneficiary?otherParam=" + searchInput,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const beneficiaryJson = await beneficiary.json();
        setUsers(beneficiaryJson);
        setSearched(true);
        setChoice(choice);
        if (beneficiaryJson.length === 0 && choice === "register") {
          openUserPage("");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    } else {
      try {
        const beneficiary = await fetch(
          "/api/beneficiary?beneficiaryName=" + searchInput,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const beneficiaryJson = await beneficiary.json();
        setUsers(beneficiaryJson);
        setSearched(true);
        setChoice(choice);
        if (beneficiaryJson.length === 0 && choice === "register") {
          openUserPage(searchInput);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    }
  };

  const openUserPage = async (beneficiaryName) => {
    router.push(`/beneficiaryinformation?beneficiaryName=${beneficiaryName}`);
  };

  const goToRegisterBeneficiary = () => {
    if (searchOther) {
      openUserPage("");
    } else {
      openUserPage(searchTerm);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container">
        <h1 className="text-center mt-4 mb-4">Search / Register</h1>
        <div className="beneficiary-child-container">
          <SearchBar onSearch={searchUsers} />
          {users.length > 0 && choice === "search" && (
            <UserList users={users} />
          )}
          {users.length === 0 && searched && choice === "search" && (
            <div>
              <br />
              <p>
                No beneficiary matches your search term! Please try again or
                register a new beneficiary.
              </p>
            </div>
          )}
          {users.length > 0 && choice === "register" && (
            <div>
              <p>
                The beneficiary you are trying to register might already exist as displayed below.
                Would you still like to continue?
              </p>
              <button
                class="btn btn-success border-0 btn-block"
                onClick={() => goToRegisterBeneficiary()}
              >
                Continue
              </button>
              <br />
              <br />
              <UserList users={users} />
            </div>
          )}
          <br />
        </div>
      </div>
      <br />
    </div>
  );
}

export default HomePage;
