import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import FormControl from "@material-ui/core/FormControl";
import { certificationStore } from "@/store";
import { clusterStore } from "@/store";

const CreateAdvanced = observer((props) => {
  var { provider } = props;
  const [reRun, setReRun] = useState(false);

  const { loadTypeCredentialList, credential } = certificationStore;
  const { loadImageList, loadSpecList, vmImageList, vmSpecList, setVMBody } =
    clusterStore;

  const onChange = (e) => {
    const { value, name } = e.target;
    setVMBody(name, value);
  };

  useEffect(() => {
    loadTypeCredentialList(provider);
    loadImageList(provider);
    loadSpecList(provider);
    return () => {
      setReRun(false);
    };
  }, [reRun]);

  return (
    <>
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              VM Name
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="VM Name"
                className="form_fullWidth"
                name="name"
                onChange={onChange}
                // value={CredentialName}
              />
            </td>
          </tr>
          <tr>
            <th>
              Credential Select
              <span className="required">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="config" onChange={onChange}>
                  <option value={""}>Select Credential</option>
                  {credential?.map((list) => (
                    <option value={list.name}>{list.name}</option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>
          <tr>
            <th>
              OS Image Select
              <span className="required">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="image" onChange={onChange}>
                  <option value={""}>Select Image</option>
                  {vmImageList.map((list) => (
                    <option value={list.name}>{list.info}</option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>
          <tr>
            <th>
              Flavor Select
              <span className="required">*</span>
            </th>
            <td>
              <table className="tb_data_new">
                <tbody className="tb_data_nodeInfo">
                  <tr>
                    <th></th>
                    <th>이름</th>
                    <th>vCPU</th>
                    <th>클럭</th>
                    <th>메모리(MB)</th>
                  </tr>
                  {vmSpecList.map((list) => (
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="radio"
                          // type="checkbox"
                          name="flavor"
                          onChange={(e) => setVMBody("flavor", list.name)}
                          // value={selectClusters}
                        />
                      </td>
                      <td>{list.name}</td>
                      <td>{list.vcpu}</td>
                      <td>{list.clock}</td>
                      <td>{list.memory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <th>
              Disk Size(GiB)
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Disk size"
                className="form_fullWidth"
                name="disk"
                onChange={onChange}
                value="50"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});
export default CreateAdvanced;
