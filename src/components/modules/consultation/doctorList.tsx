"use client"
import { useQuery } from "@tanstack/react-query";
import { getDoctores } from "@/src/app/(commonLayout)/consultation/_actions";

const DoctorList =() =>{
    const {data}=useQuery({
        queryKey:['doctors'],
        queryFn: ()=>getDoctores()
    })
    console.log(data)
    return (


        <div>
            <ul>
                {data?.map((doctor:any)=>{
                    return (
                        <li key={doctor.id}>
                            {doctor.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default DoctorList;