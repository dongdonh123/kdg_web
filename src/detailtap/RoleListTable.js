import '../css/detailtable/RoleList.css'

function RoleListTable({ roleList, relUserRoleList}) {

  const isRoleChecked = (roleId) => {
    return relUserRoleList.some(item => item.role_id === roleId);
  };

    return (
      <div>
        <div className="DetailTable-RoleList" >
          <table className ="MainTable">
            <thead className="TableHeader">
              <tr>
                <th className="col1"></th>
                <th className="col2">역할코드</th>
                <th className="col3">역할명</th>
              </tr>
            </thead>
            <tbody className="TableBody-ctn2">
              {roleList.map((role) => (
                <tr key={role.role_id}>
                  <td className="col1"><input type='checkbox'disabled checked={isRoleChecked(role.role_id)}  /></td> 
                  <td className="col2">{role.role_code}</td>
                  <td className="col3">{role.role_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default RoleListTable;

