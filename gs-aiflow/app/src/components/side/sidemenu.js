import React from 'react';
import {Link} from 'react-router-dom';

function Sidemenu(props) {
    return (
    <>
        <div id='sidemenu'>
            <div id='mainlogo'>
                <img id='image_aieyeflow' src='/images/logo_aieye.png' alt='image_aieyeflow' />
            </div>
            <Link to='/'><div className='nav__link'><h1>모니터링</h1></div></Link>
            <Link to='/enroll'><div className='nav__link'><h1>모니터링 등록</h1></div></Link>
            <Link to='/create'><div className='nav__link'><h1>디플로이먼트 생성</h1></div></Link>
            <Link to='/delete'><div className='nav__link'><h1>디플로이먼트 삭제</h1></div></Link>
            <Link to='/logviewer'><div className='nav__link'><h1>파드 로그</h1></div></Link>
            <Link to='/service_define'><div className='nav__link'><h1>프로젝트 모니터링</h1></div></Link>
        </div>
    </>
    );
}

export {Sidemenu};