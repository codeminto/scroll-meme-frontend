
import { createContext, useContext, useEffect, useState, } from "react";
import { Database } from "@tableland/sdk";
import { providers } from "ethers";
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
const tableName = "my_table_11155111_1437";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import axiosHelper from "../helpers/axiosHelper";
const TablelandContext = createContext(null);

export const TablelandProvider = ({ children }) => {
    const { ready, authenticated, user } = usePrivy();
    const { wallets } = useWallets();
    const wallet = wallets[0]
    const chainId = wallet?.chainId?.split(":")[1];

    const [userHistory, setUserHistory] = useState({ isTableAvailable: true, isTableCreated: false, history: [] })
    const [userTable, setUserTable] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const checkTableExists = async () => {
        const userAddress = user?.wallet?.address;
        console.log(" userAddress", userAddress)
        if (!userAddress) {
            toast.error("Please connect with wallet!")
        }
        try {
            const { data } = await axiosHelper(`/tableland?address=${userAddress}&networkId=${chainId}`)
            console.log("data->>>>>>> ", data)
            if (!data) {
                setUserTable({});
                return
            }
            setUserTable({
                ...data
            })
        } catch (error) {
            console.log("ERERE", error)
        }
    }
    useEffect(() => {
        console.log("TABLELAND: ", { chainId })
        if (chainId) {
            checkTableExists()
        }
    }, [chainId])
    const createTable = async () => {
        try {
            // Connect to provider from browser and get accounts
            const provider = new providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            // Pass the signer to the Database
            const signer = provider.getSigner();
            const db = new Database({ signer });
            // This is the table's `prefix`--a custom table value prefixed as part of the table's name
            const prefix = "meme_table";
            const { meta: create } = await db
                .prepare(`CREATE TABLE ${prefix} (user_address text, f_id text, title text, tags text, uri text, uri_type text);`)
                .run();
            await create.txn?.wait();

            // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
            const tableName = create.txn?.names[0] ?? ""; // e.g., my_table_31337_2
            try {
                await axiosHelper(`/tableland`, 'POST', null,
                    {
                        "address": user?.wallet?.address,
                        "networkId": chainId,
                        "tableName": tableName
                    }
                )
                toast.success('Tableland table created successfully!')
            } catch (error) {
                toast.error('ERROR_WHILE_CREATING_USER_TABLE')
            }
            console.log({ tableName })
        } catch (error) {
            console.log("ERROR_WHILE_CREATING_USER_TABLE: ", error)
            toast.error('ERROR_WHILE_CREATING_USER_TABLE')
        }
    }
    const writeTable = async (payload) => {
        try {
            // setIsLoading(true);
            if (!userTable?.tableName) {
                console.log("NO_TABLE_EXISTS")
                return
            }
            console.log("PAYLOAD: ", payload)
            let { user_address, f_id, title, tags, uri, uri_type } = payload
            if (!user_address || !f_id || !title || !tags || !uri || !uri_type) {
                console.log("SEND_CORRECT_PAYLOAD")
                toast.error('SEND_CORRECT_PAYLOAD')
                return
            }
            const provider = new providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            // Pass the signer to the Database
            const signer = provider.getSigner();
            const db = new Database({ signer });
            // Insert a row into the table
            // const { meta: insert } = await db
            //     .prepare(`INSERT INTO ${userHistory?.table} (action, object) VALUES (?,?);`)
            //     .bind(action, object)
            //     .run();
            console.log("payload ==>>>>>>>>", { payload })
            const { meta: insert } = await db
                .prepare(`INSERT INTO ${userTable?.tableName} (user_address, f_id, title, tags, uri, uri_type) VALUES (?,?,?,?,?,?);`)
                .bind(user_address, f_id, title, tags, uri, uri_type)
                .run();
            console.log({ insert })
            // Wait for transaction finality
            await insert.txn?.wait();
        } catch (error) {
            console.log("WRITE TABLE ERROR: ", error)
            toast.error("WRITE TABLE ERROR")
        } finally {
            setIsLoading(false);
        }
    }

    const readTable = async () => {
        try {
            const userAddress = user?.wallet?.address;
            const { data } = await axiosHelper(`/tableland?address=${userAddress}&networkId=${chainId}`)

            if (!data?.tableName) {
                console.log("NO_TABLE_EXISTS")
                return
            }
            const provider = new providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            // Pass the signer to the Database
            const signer = provider.getSigner();
            const db = new Database({ signer });
            const { results } = await db.prepare(`SELECT * FROM ${data?.tableName};`).all();
            console.log(results);
            return results
        } catch (error) {
            console.log("READ TABLE ERROR: ", error)
            setUserHistory((prev) => ({
                ...prev,
                history: [],
                isTableCreated: false
            }))
            return []

        }
    }

    return (
        <TablelandContext.Provider
            value={{
                readTable,
                writeTable,
                userHistory,
                setUserHistory,
                isLoading,
                setIsLoading,
                createTable,
                userTable
            }}
        >
            {children}
        </TablelandContext.Provider>
    );
};

export const useTableland = () => {
    const context = useContext(TablelandContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};