import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function LogIn(){
    console.log('render');
    const { register,handleSubmit,reset,formState: {errors,isSubmitting}} = useForm();

    const loginSubmit = (e) =>{
        loginCheck(JSON.stringify(e));
        reset({"ID":"","Password":""})
    }

    function loginCheck(data){
        const config={"Content-Type": 'application/json'};
        axios.post('http://172.16.16.155:5000/api/loginCheck',data,config).then(response => {
            if(response['data']==="fail"){
                alert('fail')
            }else{
                alert('success')
            }
        })
    }

    return(
        <>
            <h3>Login Page edit..</h3>
            <div id="divLoginMain">
                <div id='divLogo'>
                    <img id='image_aieyeflow' src='/images/logo_aieye.png' alt='image_aieyeflow' />
                </div>
                <div id='divLogin'>
                    <form onSubmit={handleSubmit(loginSubmit)}>
                        <label>ID</label><br />
                        <input className='borderless' {...register("ID", {required:true})}/>
                        {errors.ID?.type==='required' && "ID required"}<br />

                        <label>Password</label><br />
                        <input className='borderless' type='password' {...register("Password", {required:true})}/>
                        {errors.Password?.type==='required' && 'password required'}<br />

                        <button disabled={isSubmitting} type="submit">login</button>
                    </form>
                </div>
            </div>
            <div>
                <label>
                    1. 사용자 등록,권한 ( 모니터링 등록, 모니터링 삭제, 파드 생성, 관련 이벤트생성, 파드삭제)<br />
                    3. cronjob<br />
                    5. https<br />
                    16. 디플로이먼트 그래프생성<br />
                    17. 각 노드가 있는 pc status(disk. cpu. gpu.) -> need to add metric server OR node allocate resource ..?<br />
                    18. task scheduler <br />
                    19. podlog 갱신 해제 -> 페이지 이동시 clearTime 작동해야하는데.. "link to" 사용해도 beforeunload 이벤트 발생안함<br />
                    20. nivo.rocks 대신 reactflow 사용하는게 좋아보임.<br />
                </label>
            </div>
        </>
    )
}

export {LogIn}