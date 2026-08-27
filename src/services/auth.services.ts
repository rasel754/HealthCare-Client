import { httpClient } from "../lib/axios/httpClient";


const getDoctores = async () => {
    const doctor = await httpClient.get("/doctors");
    return doctor
}