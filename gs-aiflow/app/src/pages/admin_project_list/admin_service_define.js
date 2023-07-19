import {React, useState} from "react";
import {QueryClient, QueryClientProvider} from 'react-query'
import {Route,Routes} from 'react-router-dom';
import { AdminProjectList } from "../../components/projects/admin_project_list";
import { AdminProjectDetail } from "../../components/projects/admin_project_detail";
const queryClient = new QueryClient();

function AdminServiceDefine(props) {
    const setPage = props.setPage
    const userID = props.userID;
    const [selectedProject, setSelectedProject] = useState({project_name : null, login_id : null});

    return (
        <> < div id = 'service_define_main' > 
    </div>

    <QueryClientProvider client={queryClient}>
        <div className="content_box" >
        <Routes>
            <Route path="" element={<AdminProjectList id={userID} setPage={setPage} setSelectedProject={[selectedProject, setSelectedProject]}/>}></Route>
        </Routes>
        </div>
        <div className="content_box">
        <Routes>
            <Route path="" element={<AdminProjectDetail id={userID} setSelectedProject={[selectedProject, setSelectedProject]}/>}></Route>
        </Routes>
        </div>

        </QueryClientProvider>
    </>
    
    );
}

export {
    AdminServiceDefine
};