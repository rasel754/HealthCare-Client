import { httpClient } from "@/src/lib/axios/httpClient";

export const getDoctores = async () =>{
    const doctor = await httpClient.get("/doctors");
    return doctor;
}