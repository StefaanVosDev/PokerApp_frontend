import axios from "axios";
import Account from "../model/Account.ts";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function createAccount(account: Account) {
    const {data} = await axios.post<Account>('/api/accounts', {
        username: account.username,
        email: account.email,
        name: account.name,
        age: account.age,
        city: account.city,
        gender: account.gender.toUpperCase(),
    });
    return data;
}
