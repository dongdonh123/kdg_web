import React, { useEffect, useState } from 'react';
import '../css/content-ctn3.css';


function Resetdata() {

  return (
    <div>
      <div className="메뉴명">
        <div>데이터리셋</div>
      </div>
      <div className="메인컨텐츠">
        <div className="왼쪽트리">
          <div className="이름">메뉴트리</div>
          <div className="메뉴트리컨텐츠"></div>
        </div>
        <div className="오른쪽정보">
          <div className="이름">메뉴정보</div>
          <div classNmae="메뉴정보컨텐츠"></div>  
        </div>

      </div>
      
      
    </div>
  );
}

export default Resetdata;