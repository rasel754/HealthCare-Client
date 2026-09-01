import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getDoctores } from "./_actions";
import DoctorList from "@/src/components/modules/consultation/doctorList";

export const dynamic = "force-dynamic";

const ConsultationPage = async()=>{
    const queryClient =new QueryClient();

    await queryClient.prefetchQuery({
        queryKey:['doctors'],
        queryFn: getDoctores
    })
    return (
       <HydrationBoundary state={dehydrate(queryClient)}>
         <DoctorList/>
       </HydrationBoundary>
    );
}

export default ConsultationPage;