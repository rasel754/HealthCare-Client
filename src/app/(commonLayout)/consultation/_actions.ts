"use server";
import { httpClient } from "@/src/lib/axios/httpClient";


interface IDoctor {
    id: number;
    name: string;
    specialization: string;
    experience: number;
    rating: number;
}

export const getDoctores = async () => {
    const doctor = await httpClient.get<IDoctor[]>("/doctors");
    return doctor;
}