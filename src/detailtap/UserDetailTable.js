import '../css/detailtable/UserDetail.css'

function UserDetailTable({ UserDetail }) {
    return (
      <div>
        <table className="DetailTable-UserDetail">
            <tbody>
              <tr>
                <td className="label">고유번호</td>
                <td className="value">{UserDetail.user_id ? UserDetail.user_id : '-'}</td>
                <td className="label">이름</td>
                <td className="value">{UserDetail.user_name ? UserDetail.user_name : '-'}</td>
              </tr>
              <tr>
                <td className="label">아이디</td>
                <td className="value">{UserDetail.user_account_id ? UserDetail.user_account_id : '-'}</td>
                <td className="label">패스워드오류횟수</td>
                <td className="value">{UserDetail.user_passwd_fail_cnt ? UserDetail.user_passwd_fail_cnt : '-'}</td>
              </tr>
              <tr>
                <td className="label">사용여부</td>
                <td className="value">{UserDetail.user_use_yn ? UserDetail.user_use_yn : '-'}</td>
                <td className="label">부서</td>
                <td className="value">{UserDetail.user_department ? UserDetail.user_department : '-'}</td>
              </tr>
              <tr>
                <td className="label">사용자구분</td>
                <td className="value">{UserDetail.user_category ? UserDetail.user_category : '-'}</td>
                <td className="label"></td>
                <td className="value"></td>
              </tr>
              <tr>
                <td className="label">핸드폰</td>
                <td className="value">{UserDetail.user_phon_no ? UserDetail.user_phon_no : '-'}</td>
                <td className="label">이메일</td>
                <td className="value">{UserDetail.user_email ? UserDetail.user_email : '-'}</td>
              </tr>
              <tr>
                <td className="label">최초등록자</td>
                <td className="value">{UserDetail.create_dt ? UserDetail.create_dt : '-'}</td>
                <td className="label">최초등록일시</td>
                <td className="value">{UserDetail.create_user ? UserDetail.create_user : '-'}</td>
              </tr>
              <tr>
                <td className="label">최종변경자</td>
                <td className="value">{UserDetail.modify_dt ? UserDetail.modify_dt : '-'}</td>
                <td className="label">최종변경일시</td>
                <td className="value">{UserDetail.modify_user ? UserDetail.modify_user : '-'}</td>
              </tr>
            </tbody>
        </table> 
      </div>
    );
  }
  
  export default UserDetailTable;

