import {React, useState} from "react";
import {QueryClient, QueryClientProvider} from 'react-query'
import {Route,Routes,Router} from 'react-router-dom';
import { UserList } from "../../components/users/user_list";
const queryClient = new QueryClient();

function UserManagement(props) {
    const setPage = props.setPage
    const userID = props.userID

    return (
        <> < div id = 'service_define_main' > 
    </div>

    <QueryClientProvider client={queryClient}>
        <div className="content_box" style={{minHeight:'600px'}} >
        <Routes>
            <Route path="" element={<UserList userID={userID}/>}></Route>
        </Routes>
        </div>

        </QueryClientProvider>
    </>
    
    );
}

export {
    UserManagement
};