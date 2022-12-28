import React from 'react';
import {Link} from 'react-router-dom';

function Sidemenu(props) {
    return (
    <>
        <div id='sidemenu'>
            <div id='mainlogo'>
                <img id='image_aieyeflow' src='/images/logo_aieye.png' alt='image_aieyeflow' />
            </div>
            <Link to='/'><h1>모니터링</h1></Link>
            <Link to='/enroll'><h1>모니터링 등록</h1></Link>
            <Link to='/create'><h1>디플로이먼트 생성</h1></Link>
            <Link to='/delete'><h1>디플로이먼트 삭제</h1></Link>
            <Link to='/logviewer'><h1>파드 로그</h1></Link>
        </div>
    </>
    );
}

export {Sidemenu};