import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import { dateFormatter } from "@/utils/common-utils";
const UserDetail = observer((props) => {
  const { user } = props;
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <PanelBox>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <div className="panelCont">
            <table className="tb_data">
              <tbody className="tb_data_detail">
                {user ? (
                  <>
                    <tr>
                      <th>ID</th>
                      <td>{user.memberId ? user.memberId : "-"}</td>
                      <th>Name</th>
                      <td>{user.memberName ? user.memberName : "-"}</td>
                    </tr>

                    <tr>
                      <th>Contact</th>
                      <td>{user.contact ? user.contact : "-"}</td>
                      <th>E-mail</th>
                      <td>{user.email ? user.email : "-"}</td>
                    </tr>
                    {/* <tr>
                  <th>승인여부</th>
                  <td>
                  {userDetail.enabled ? (
                    <span class="state_ico state_02">승인</span>
                    ) : (
                      <span class="state_ico state_04">승인 대기</span>
                      )}
                      </td>
                    </tr> */}
                    <tr>
                      <th>Created</th>
                      <td>
                        {user.created_at ? dateFormatter(user.created_at) : "-"}
                      </td>
                      <th>Last Login</th>
                      <td>
                        {user.logined_at ? dateFormatter(user.logined_at) : "-"}
                      </td>
                    </tr>
                  </>
                ) : (
                  <LabelContainer>
                    <p>No Detail Info</p>
                  </LabelContainer>
                )}
              </tbody>
            </table>
          </div>
        </CTabPanel>
      </div>
    </PanelBox>
  );
});
export default UserDetail;
