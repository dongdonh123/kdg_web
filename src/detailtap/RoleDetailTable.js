import '../css/detailtable/RoleDetail.css'

function RoleDetailTable({ RoleDetail }) {
    return (
      <div>
        <table className="DetailTable-RoleDetail">
            <tbody>
              <tr>
                <td className="label">역할ID</td>
                <td className="value">{RoleDetail.role_id ? RoleDetail.role_id : '-'}</td>
                <td className="label">역할코드</td>
                <td className="value">{RoleDetail.role_code ? RoleDetail.role_code : '-'}</td>
              </tr>
              <tr>
                <td className="label">역할명</td>
                <td className="value">{RoleDetail.role_name ? RoleDetail.role_name : '-'}</td>
                <td className="label">메타사용여부</td>
                <td className="value">{RoleDetail.meta_use_yn ? RoleDetail.meta_use_yn : '-'}</td>
              </tr>
              <tr>
                <td className="label">최초등록자</td>
                <td className="value">{RoleDetail.create_dt ? RoleDetail.create_dt : '-'}</td>
                <td className="label">최초등록일시</td>
                <td className="value">{RoleDetail.create_user ? RoleDetail.create_user : '-'}</td>
              </tr>
              <tr>
                <td className="label">최종변경자</td>
                <td className="value">{RoleDetail.modify_dt ? RoleDetail.modify_dt : '-'}</td>
                <td className="label">최종변경일시</td>
                <td className="value">{RoleDetail.modify_user ? RoleDetail.modify_user : '-'}</td>
              </tr>
            </tbody>
        </table> 
      </div>
    );
  }
  
  export default RoleDetailTable;

