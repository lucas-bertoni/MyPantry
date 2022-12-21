import React, { useEffect, useState, useLayoutEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Link } from "react-router-dom";
import Table from "./Table";
import fs from "fs";
import { gunzip } from "zlib";

interface Pantries {
  pantry_id: number;
  pantry_name: string;
}

const Pantry = () => {
  const [user_id, setUserID] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const auth = async () => {
      const url =
        process.env.NODE_ENV === "production"
          ? "http://localhost:4001/auth" // Change if actually deployed to real web server
          : "http://localhost:4001/auth";

      await axios
        .post(url, {}, { withCredentials: true })
        .then((axiosResponse: AxiosResponse) => {
          setUserID(axiosResponse.data.user_id);
          setEmail(axiosResponse.data.email);
        })
        .catch((axiosError: AxiosError) => {
          window.location.href = "/#/login";
        });
    };

    auth();
  }, []);

  const [pantries, setPantries] = useState<Pantries[]>([]);
  const [pantry_name, setPantryName] = useState("");
  const [updatePantryName, setUpdatePantryName] = useState("");

  const getPantries = async () => {
    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4004/${user_id}/getpantries` // Change if actually deployed to real web server
        : `http://localhost:4004/${user_id}/getpantries`;

    await axios
      .get(url, { params: { user_id: user_id } })
      .then((axiosResponse: AxiosResponse) => {
        setPantries(axiosResponse.data);
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error getting the pantries");
      });
  };
  useLayoutEffect(() => {
    getPantries();
  }, [user_id]);

  const addPantry = async (e: any) => {
    e.preventDefault();
    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4004/${user_id}/pantrycreated` // Change if actually deployed to real web server
        : `http://localhost:4004/${user_id}/pantrycreated`;

    await axios
      .post(url, { user_id: user_id, pantry_name: pantry_name })
      .then((axiosResponse: AxiosResponse) => {
        console.log(axiosResponse.data);

        getPantries();
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error adding the pantry");
      });

    setPantryName("");
  };

  const deletePantry = async (pantry_id: number) => {
    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4004/${user_id}/pantrydeleted` // Change if actually deployed to real web server
        : `http://localhost:4004/${user_id}/pantrydeleted`;

    await axios
      .post(url, { pantry_id: pantry_id })
      .then((axiosResponse: AxiosResponse) => {
        console.log(axiosResponse.data);
        getPantries();
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error deleting the pantry");
      });
  };
  const updatePantry = async (pantry_id: number, e: any) => {
    e.preventDefault();

    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4004/${user_id}/pantryupdated` // Change if actually deployed to real web server
        : `http://localhost:4004/${user_id}/pantryupdated`;

    await axios
      .post(url, { pantry_id: pantry_id, pantry_name: updatePantryName })
      .then((axiosResponse: AxiosResponse) => {
        console.log(axiosResponse.data);

        getPantries();
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error updating the pantry");
      });

    setUpdatePantryName("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Pantry</h1>
          <h1>{user_id}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Add Pantry</h5>

              <div className="form-group">
                <label htmlFor="pantry_name">Pantry Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="pantry_name"
                  placeholder="Enter pantry name"
                  value={pantry_name}
                  onChange={(e) => setPantryName(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => addPantry(e)}
              >
                Add Pantry
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pantries</h5>
              <div className="row">
                {pantries.map((pantry) => (
                  <div className="col">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{pantry.pantry_name}</h5>
                        <Link to={`/pantry/${pantry.pantry_id}`}>
                          <button type="button" className="btn btn-primary">
                            View Pantry
                          </button>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => deletePantry(pantry.pantry_id)}
                        >
                          Delete Pantry
                        </button>

                        <div className="form-group">
                          <label htmlFor="pantry_name">Pantry Name</label>
                          <input
                            type="updatePantryNameInput"
                            className="form-control"
                            id="updatePantryNameInput"
                            placeholder="Enter pantry name"
                            value={updatePantryName}
                            onChange={(e) =>
                              setUpdatePantryName(e.target.value)
                            }
                          />

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={(e) => updatePantry(pantry.pantry_id, e)}
                          >
                            Update Pantry
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pantry;
