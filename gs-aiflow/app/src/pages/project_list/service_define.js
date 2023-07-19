import {React, useState} from "react";
import {QueryClient, QueryClientProvider} from 'react-query'
import {Route,Routes} from 'react-router-dom';
import { ProjectList } from "../../components/projects/project_list";
import { ProjectDetail } from "../../components/projects/project_detail";
const queryClient = new QueryClient();

function ServiceDefine(props) {
    const setPage = props.setPage
    const userID = props.userID;
    const [selectedProject, setSelectedProject] = useState("");

    return (
        <> < div id = 'service_define_main' > 
    </div>

    <QueryClientProvider client={queryClient}>
        <div className="content_box" >
        <Routes>
            <Route path="" element={<ProjectList id={userID} setPage={setPage} setSelectedProject={[selectedProject, setSelectedProject]}/>}></Route>
        </Routes>
        </div>
        <div className="content_box">
        <Routes>
            <Route path="" element={<ProjectDetail id={userID} setSelectedProject={[selectedProject, setSelectedProject]}/>}></Route>
        </Routes>
        </div>

        </QueryClientProvider>
    </>
    
    );
}

export {
    ServiceDefine
};