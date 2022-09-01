package common

import (
	"bytes"
	"encoding/gob"
	"encoding/json"
	"errors"
	"fmt"
	"gmc_api_gateway/app/model"
	"log"
	"math"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"
)

func SearchNestedValue(obj interface{}, key string, uniq string) (interface{}, bool) {
	// log.Println("obj is ", obj)

	switch t := obj.(type) {
	case map[string]interface{}:
		if v, ok := t[key]; ok {
			if strings.Compare(InterfaceToString(v), uniq) == 0 {
				log.Printf("[#1] sfsdfs v is %s, uniq is %s, ok is %t", v, uniq, ok)
				return v, ok
			}
		}
		for _, v := range t {
			if result, ok := SearchNestedValue(v, key, uniq); ok {
				return result, ok
			}
		}
	case []interface{}:
		for _, v := range t {
			if result, ok := SearchNestedValue(v, key, uniq); ok {
				return result, ok
			}
		}
	}

	// key not found
	return nil, false
}

func CreateKeyValuePairs(m map[string]string) []string {
	var r []string
	for key, value := range m {
		val := key + "=" + "\"" + value + "\""
		r = append(r, val)
	}
	return r
}

func MakeSliceUnique(s []int) []int {
	keys := make(map[int]struct{})
	res := make([]int, 0)
	for _, val := range s {
		if _, ok := keys[val]; ok {
			continue
		} else {
			keys[val] = struct{}{}
			res = append(res, val)
		}
	}
	return res
}

func ArrStringtoBytes(i []string) []byte {
	buf := &bytes.Buffer{}
	gob.NewEncoder(buf).Encode(i)
	bs := buf.Bytes()
	return bs
}

func FindData(data string, findPath, findValue string) interface{} {

	// log.Println("FindPath is ", findPath)
	findPathCheck := strings.Compare(findPath, "") != 0
	if findPathCheck {
		// findkey 입력이 있을 경우
		data = Filter(data, findPath)
	} else {
		// findkey 가 "" 일 경우

	}

	// log.Println("findValue is ", findValue)
	findValueCheck := strings.Compare(findValue, "") != 0
	if findValueCheck {
		// findValue 입력이 있을 경우
		data = Finding(data, findValue)

	} else {
		// findValue 가 "" 일 경우
	}

	// log.Println("최종 data is : ", data)
	// fmt.Println("type:", reflect.ValueOf(data).Type())

	var x interface{}
	if err := json.Unmarshal([]byte(data), &x); err != nil {
		// fmt.Printf("Error : %s\n", err)
		x = data
		return x
	}

	return x
}

func FindDataStr(data string, findPath, findValue string) string {

	log.Println("FindPath is ", findPath)
	findPathCheck := strings.Compare(findPath, "") != 0
	if findPathCheck {
		// findPath 입력이 있을 경우
		data = Filter(data, findPath)
	} else {
		// findPath 가 "" 일 경우

	}

	log.Println("findValue is ", findValue)
	findValueCheck := strings.Compare(findValue, "") != 0
	if findValueCheck {
		// findValue 입력이 있을 경우
		data = Finding(data, findValue)

	} else {
		// findValue 가 "" 일 경우
	}

	log.Println("최종 data is : ", data)
	fmt.Println("type:", reflect.ValueOf(data).Type())

	return data
}

func FindDataArr(i interface{}, p, f, u string) (interface{}, error) {
	log.Println("[In #FindDataArr]")
	log.Println("[#1] Data is ", i)
	log.Println("[#2] find path string is ", p)
	log.Println("[#2] find key string is ", f)
	log.Println("[#3] uniq string is ", u)

	// var itemCheck bool
	var parse, data gjson.Result
	var arr []gjson.Result
	var result interface{}
	var results []interface{}
	ia := InterfaceToString(i)

	parse = gjson.Parse(ia)
	log.Println("[#4] Parse is ", parse)

	pathCheck := strings.Compare(p, "") != 0
	// itemCheck = len(parse.Get("items").Array()) > 0
	// log.Println("[#4] itemCheck is ", itemCheck)

	if pathCheck {
		data = parse.Get(p)
		log.Println("[#5] filter data is ", data)
	} else {
		data = parse
		log.Println("[#5] filter data is ", data)
	}

	len := len(data.Array())
	log.Println("[#6] len(data) is ", len)

	if len > 0 {
		// list
		arr = data.Array()
		log.Println("[#7-1] len > 0, list")
		for t, _ := range arr {

			dataInterface := StringToMapInterface(arr[t].String())

			if v, ok := SearchNestedValue(dataInterface, f, u); ok {
				fmt.Printf("Arr[%d] Found it ! \n", t)
				fmt.Printf("Unique is : %+v\n", v)
				fmt.Printf("data is %s\n", arr[t])
				err := json.Unmarshal([]byte(arr[t].String()), &result)
				if err != nil {
					fmt.Println("[!53] error")
				}
				results = append(results, result)
				fmt.Printf("[%d] result Data is %s", t, results)
			} else {
				fmt.Printf("Arr[%d] Key not found\n", t)
			}
		}

		if len == 1 {
			log.Println("[#7-2] len == 1, list")
			dataInterface := StringToInterface(arr[0].String())
			if v, ok := SearchNestedValue(dataInterface, f, u); ok {
				fmt.Println("Found it !")
				fmt.Printf("Unique is : %+v\n", v)
				return StringToInterface(arr[0].String()), nil
			} else {
				return nil, nil
			}
		}

		// list 출력
		return results, nil

	} else {
		return StringToInterface(data.String()), nil
	}
}

func FindDataArrStr(i interface{}, p, f, u string) (string, error) {
	log.Println("[In #FindDataArr]")
	log.Println("[#1] Data is ", i)
	log.Println("[#2] find path string is ", p)
	log.Println("[#2] find key string is ", f)
	log.Println("[#3] uniq string is ", u)

	// var itemCheck bool
	var parse, data gjson.Result
	var arr []gjson.Result
	var result interface{}
	var results []interface{}
	ia := InterfaceToString(i)

	parse = gjson.Parse(ia)
	log.Println("[#4] Parse is ", parse)

	pathCheck := strings.Compare(p, "") != 0
	// itemCheck = len(parse.Get("items").Array()) > 0
	// log.Println("[#4] itemCheck is ", itemCheck)

	if pathCheck {
		data = parse.Get(p)
		log.Println("[#5] filter data is ", data)
	} else {
		data = parse
		log.Println("[#5] filter data is ", data)
	}

	len := len(data.Array())
	log.Println("[#6] len(data) is ", len)

	if len > 0 {
		// list
		arr = data.Array()
		log.Println("[#7-1] len > 0, list")
		for t, _ := range arr {

			dataInterface := StringToMapInterface(arr[t].String())

			if v, ok := SearchNestedValue(dataInterface, f, u); ok {
				fmt.Printf("Arr[%d] Found it ! \n", t)
				fmt.Printf("Unique is : %+v\n", v)
				fmt.Printf("data is %s\n", arr[t])
				err := json.Unmarshal([]byte(arr[t].String()), &result)
				if err != nil {
					fmt.Println("[!53] error")
				}
				results = append(results, result)
				fmt.Printf("[%d] result Data is %s", t, results)
			} else {
				fmt.Printf("Arr[%d] Key not found\n", t)
			}
		}

		if len == 1 {
			log.Println("[#7-2] len == 1, list")
			dataInterface := StringToInterface(arr[0].String())
			if v, ok := SearchNestedValue(dataInterface, f, u); ok {
				fmt.Println("Found it !")
				fmt.Printf("Unique is : %+v\n", v)
				return arr[0].String(), nil
			} else {
				return "nil", nil
			}
		}

		// list 출력
		return InterfaceToString(results), nil

	} else {
		return data.String(), nil
	}
}
func FindDataArrStr2(i interface{}, p, f, u string) ([]string, error) {
	log.Println("[In #FindDataArr]")
	log.Println("[#1] Data is ", i)
	log.Println("[#2] find path string is ", p)
	log.Println("[#2] find key string is ", f)
	log.Println("[#3] uniq string is ", u)

	// var itemCheck bool
	var parse, data gjson.Result
	var arr []gjson.Result
	// var result interface{}
	var results []string
	ia := InterfaceToString(i)

	parse = gjson.Parse(ia)
	log.Println("[#4] Parse is ", parse)

	pathCheck := strings.Compare(p, "") != 0
	// itemCheck = len(parse.Get("items").Array()) > 0
	// log.Println("[#4] itemCheck is ", itemCheck)

	if pathCheck {
		data = parse.Get(p)
		log.Println("[#5] filter data is ", data)
	} else {
		data = parse
		log.Println("[#5] filter data is ", data)
	}

	len := len(data.Array())
	log.Println("[#6] len(data) is ", len)

	if len > 0 {
		// list
		arr = data.Array()
		log.Println("[#7-1] len > 0, list")
		for t, _ := range arr {

			dataInterface := StringToMapInterface(arr[t].String())

			if v, ok := SearchNestedValue(dataInterface, f, u); ok {
				fmt.Printf("Arr[%d] Found it ! \n", t)
				fmt.Printf("Unique is : %+v\n", v)
				fmt.Printf("data is %s\n", arr[t])
				// err := json.Unmarshal([]byte(arr[t].String()), &result)
				// if err != nil {
				// 	fmt.Println("[!53] error")
				// }
				results = append(results, arr[t].String())
				fmt.Printf("[%d] result Data is %s", t, results)
			} else {
				fmt.Printf("Arr[%d] Key not found\n", t)
			}
		}

		if len == 1 {
			log.Println("[#7-2] len == 1, list")
			dataInterface := StringToInterface(arr[0].String())
			if v, ok := SearchNestedValue(dataInterface, f, u); ok {
				fmt.Println("Found it !")
				fmt.Printf("Unique is : %+v\n", v)
				fmt.Printf("data is %s\n", arr[0])
				results = append(results, arr[0].String())
				return results, nil
			} else {
				return nil, nil
			}
		}

		// list 출력
		return results, nil
		// return strings.Join(results, ","), nil

	} else {
		results = append(results, data.String())
		return results, nil
	}
}
func Filter(i string, path string) string {
	parse := gjson.Parse(i)
	Dat := parse.Get(path)
	// Arr := parse.Get(path).Array()
	len := len(parse.Get(path).Array())

	if len > 0 {
		// list
		// log.Printf("[#36] Arr is %+v\n", Arr)
		// err3 := json.Unmarshal([]byte(Arr[0].String()), &x)
		// if err3 != nil {
		// 	fmt.Printf("Error : %s\n", err3)
		// }
		// fmt.Println("[#35] is ", x)
		return Dat.String()
	} else {
		return Dat.String()
	}
}

func Finding(i string, find string) string {
	parse := gjson.Parse(i)
	Dat := parse
	Arr := parse.Array()
	len := len(parse.Array())
	ReturnVal := ""

	if len > 0 {
		// list
		for n, _ := range Arr {
			ReturnVal = Arr[n].Get(find).String()
		}
	} else {
		// not list
		ReturnVal = Dat.Get(find).String()
	}

	return ReturnVal
}

func Typeof(v interface{}) string {
	return reflect.TypeOf(v).String()
}

func StringToInterface(i string) interface{} {
	var x interface{}
	if err := json.Unmarshal([]byte(i), &x); err != nil {
		fmt.Printf("Error : %s\n", err)
	}
	return x
}

func Transcode(in, out interface{}) {
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(in)
	json.NewDecoder(buf).Decode(out)
}

func InterfaceToString(i interface{}) string {
	str := fmt.Sprintf("%v", i)
	return str
}

func StringToMapInterface(i string) map[string]interface{} {
	x := make(map[string]interface{})
	if err := json.Unmarshal([]byte(i), &x); err != nil {
		fmt.Printf("Error : %s\n", err)
	}
	return x
}

func InterfaceToTime(i interface{}) time.Time {
	createTime := InterfaceToString(i)
	timer, _ := time.Parse(time.RFC3339, createTime)
	return timer
}

func InterfaceToArray(i interface{}) []string {
	str := reflect.ValueOf(i)
	var x []string
	for j := 0; j < str.Len(); j++ {
		data := InterfaceToString(str.Index(j))
		x = append(x, data)
	}
	return x
}

func InterfaceOfLen(t interface{}) int {

	return reflect.ValueOf(t).Len()
}

func GetModelRelatedList(params model.PARAMS) (interface{}, error) {

	data, err := DataRequest(params)
	if err != nil {
		return "", err
	}

	origName := InterfaceToString(FindData(data, "metadata", "name"))
	origUid := InterfaceToString(FindData(data, "metadata", "uid"))

	switch strings.ToLower(params.Kind) {
	case "services":
		params.Kind = "endpoints"
		params.Name = origName

		endPointData, _ := DataRequest(params)
		// if err != nil {
		// 	return nil, err
		// }
		fmt.Println("########################endPointData", endPointData)

		fmt.Println("sdfsdfdsfdfs", Filter(endPointData, "subsets.#.addresses"))

		var Pods []model.SERVICEPOD
		var PodNameList []string
		if Filter(endPointData, "subsets.#.addresses") != "" {
			PodData := FindingArray(Filter(endPointData, "subsets.#.addresses"))[0].Array()
			for i, _ := range PodData {
				Pod := model.SERVICEPOD{
					Ip:       (gjson.Get(PodData[i].String(), "ip")).String(),
					NodeName: (gjson.Get(PodData[i].String(), "nodeName")).String(),
					Name:     (gjson.Get(PodData[i].String(), "targetRef.name")).String(),
				}
				Pods = append(Pods, Pod)
				PodNameList = append(PodNameList, (gjson.Get(PodData[i].String(), "targetRef.name")).String())
			}
		}
		fmt.Println("########################PodNameList", PodNameList)
		// log.Printf("# pod list확인 ", podRefer)
		params.Kind = "pods"
		params.Name = ""
		podsData, err := DataRequest(params)
		if err != nil {
			return nil, err
		}
		var workloadList []model.WorkloadInfo
		for i := range PodNameList {
			podData, err := FindDataArrStr2(podsData, "items", "name", PodNameList[i])
			if err != nil {
				return nil, err
			}

			if InterfaceToString(FindData(podData[0], "metadata.ownerReferences", "kind")) == "ReplicaSet" {
				params.Kind = "replicasets"
				params.Name = InterfaceToString(FindData(podData[0], "metadata.ownerReferences", "name"))

				repliData, err := DataRequest(params)
				if err != nil {
					return nil, err
				}
				workloadInfo := model.WorkloadInfo{
					Name:        InterfaceToString(FindData(repliData, "metadata.ownerReferences", "name")),
					Kind:        InterfaceToString(FindData(repliData, "metadata.ownerReferences", "kind")),
					ReplicaName: InterfaceToString(FindData(podData[0], "metadata.ownerReferences", "name")),
				}
				workloadList = append(workloadList, workloadInfo)
			} else {
				workloadInfo := model.WorkloadInfo{
					Name: InterfaceToString(FindData(podData[0], "metadata.ownerReferences", "name")),
					Kind: InterfaceToString(FindData(podData[0], "metadata.ownerReferences", "kind")),
				}
				workloadList = append(workloadList, workloadInfo)
			}

		}
		services := model.SERVICELISTS{
			Pods:      Pods,
			Workloads: workloadList,
		}
		return services, nil

	case "deployments":
		fmt.Printf("[#####]origUid : %s\n", origUid)
		params.Kind = "replicasets"
		params.Name = ""

		replsData, err := DataRequest(params)
		if err != nil {
			return nil, err
		}

		replData, err := FindDataArrStr2(replsData, "items", "uid", origUid)
		if err != nil {
			return nil, err
		}
		var replicaNameList []string
		for n := range replData {
			replicaName := InterfaceToString(FindData(replData[n], "metadata", "name"))
			replicaNameList = append(replicaNameList, replicaName)
		}
		// replicaName := InterfaceToString(FindData(replData[0], "metadata", "name"))
		// fmt.Printf("[####replicaName : %s\n", replicaName)
		params.Kind = "pods"
		params.Name = ""
		podsData, err := DataRequest(params)
		if err != nil {
			return nil, err
		}
		var podDataList []string
		for r := range replicaNameList {
			podData, err := FindDataArrStr2(podsData, "items", "name", replicaNameList[r])
			if err != nil {
				return nil, err
			}
			for p := range podData {
				// fmt.Printf("[##]podData :%s\n", podData)
				podDataList = append(podDataList, podData[p])
			}
		}

		// splits := strings.Split(podData, ",")
		var Pods []model.DEPLOYMENTPOD
		var PodNames []string

		for x, _ := range podDataList {
			containerStatusesData := FindData(podDataList[x], "status", "containerStatuses.0.restartCount")
			fmt.Printf("##containerStatusesData :%+v\n", containerStatusesData)

			if InterfaceToString(FindData(podDataList[x], "status", "phase")) == "Running" {
				PodNames = append(PodNames, InterfaceToString(FindData(podDataList[x], "metadata", "name")))
			}
			podList := model.DEPLOYMENTPOD{
				Name:         InterfaceToString(FindData(podDataList[x], "metadata", "name")),
				Status:       InterfaceToString(FindData(podDataList[x], "status", "phase")),
				Node:         InterfaceToString(FindData(podDataList[x], "status", "hostIP")),
				PodIP:        InterfaceToString(FindData(podDataList[x], "status", "podIP")),
				RestartCount: InterfaceToInt(containerStatusesData),
			}
			Pods = append(Pods, podList)
		}

		params.Kind = "endpoints"
		params.Name = ""

		svcsData, err := DataRequest(params)
		var Svcs model.DEPLOYMENTSVC
		if err != nil {
			return nil, err
		}
		for p, _ := range PodNames {
			svcData, err := FindDataArrStr2(svcsData, "items", "name", PodNames[p])
			if err != nil {
				return nil, err
			}
			fmt.Printf("[##]svcData :%+v\n", svcData)
			// fmt.Printf("[##]svcDataName :%s\n", InterfaceToString(FindData(svcData[0], "metadata", "name")))
			if len(svcData) > 0 {
				svcList := model.DEPLOYMENTSVC{
					Name: InterfaceToString(FindData(svcData[0], "metadata", "name")),
					Port: FindData(svcData[0], "subsets", "ports"),
					// ClusterIP: InterfaceToString(FindData(svcData[0], "spec", "clusterIP")),
					// Type:      InterfaceToString(FindData(svcData[0], "spec", "type")),
				}
				Svcs = svcList
			}
		}
		deployments := model.DEPLOYMENTLISTS{
			Pods:     Pods,
			Services: Svcs,
			// ReplicaName: replicaNameList,
		}
		return deployments, nil
	case "jobs":
		OnwerRefer := model.OnwerReferInfo{
			Kind: InterfaceToString(FindData(data, "metadata", "ownerReferences.0.kind")),
			Name: InterfaceToString(FindData(data, "metadata", "ownerReferences.0.name")),
		}
		jobName := InterfaceToString(FindData(data, "metadata", "name"))
		params.Kind = "pods"
		params.Name = ""

		// uid := InterfaceToString(FindData(data, "metadata", "uid"))
		// log.Println("PARAMS.NAEMData12 : ", params.Name)
		// log.Println("jobName Data12 : ", jobName)
		// log.Println("uid Data12 : ", uid)
		podsData, err := DataRequest(params)
		if err != nil {
			return nil, err
		}
		// var podDataList []string
		podData, err := FindDataArrStr2(podsData, "items", "name", jobName)
		if err != nil {
			return nil, err
		}
		fmt.Printf("podData : %s", podData)
		var PodsInfo []model.ReferPodList
		for i := range podData {
			PodData := model.ReferPodList{
				Name:     InterfaceToString(FindData(podData[i], "metadata", "name")),
				NodeName: InterfaceToString(FindData(podData[i], "spec", "nodeName")),
				Status:   InterfaceToString(FindData(podData[i], "status", "phase")),
				HostIP:   InterfaceToString(FindData(podData[i], "status", "hostIP")),
				PodIP:    InterfaceToString(FindData(podData[i], "status", "podIP")),
			}
			PodsInfo = append(PodsInfo, PodData)
		}

		// PodData := model.ReferPodList{}
		// PodsData := podRefer
		// // log.Printf("# pod list확인 ", podRefer)
		// Transcode(PodsData, &PodsInfo)
		// log.Printf("# job list확인22 ", PodsInfo)
		fmt.Println("[########]tesdfsdef")
		fmt.Printf("[########]OnwerRefer : %+v", OnwerRefer)
		ReferDataJob := model.ReferDataJob{
			ReferPodList: PodsInfo,
		}
		ReferDataJob.OnwerReferInfo = OnwerRefer
		return ReferDataJob, nil

	case "cronjobs":
		params.Kind = "jobs"
		params.Name = ""
		cronjobName := InterfaceToString(FindData(data, "metadata", "name"))
		uid := InterfaceToString(FindData(data, "metadata", "uid"))
		log.Println("uid : ", uid)
		log.Println("PARAMS.NAEMData12 : ", params.Name)
		log.Println("jobName Data12 : ", cronjobName)
		jobData, err := DataRequest(params)
		if err != nil {
			return nil, err
		}
		jobRefer, err := FindDataArrStr2(jobData, "items", "name", cronjobName)
		log.Printf("[###123]jobData", jobData)
		if err != nil {
			return nil, err
		}
		log.Println("jobRefer Data12 : ", jobRefer)

		// params.Kind = "events"
		// params.Name = ""
		// test := InterfaceToString(FindData(jobData, "metadata", "name"))
		// log.Println("[#11test Data12 : ", test)
		var JobsInfo []model.JOBList
		for i := range jobRefer {
			job := model.JOBList{
				Name: InterfaceToString(FindData(jobRefer[i], "metadata", "name")),
				// Conditions:  InterfaceToString(FindData(jobRefer[i], "status", "conditions")),
				CompletionTime: InterfaceToTime(FindData(jobRefer[i], "status", "completionTime")),
				StartTime:      InterfaceToTime(FindData(jobRefer[i], "status", "startTime")),
				Succeeded:      InterfaceToInt(FindData(jobRefer[i], "status", "succeeded")),
			}
			JobsInfo = append(JobsInfo, job)
		}
		// JobData := jobRefer
		// log.Printf("# job list확인 ", jobRefer)
		// Transcode(JobData, &JobsInfo)
		// log.Printf("# job list확인22 ", JobsInfo)

		ReferData := model.ReferCronJob{
			JOBList: JobsInfo,
		}

		return &ReferData, nil
	case "pods":
		uid := InterfaceToString(FindData(data, "metadata", "uid"))
		kind := InterfaceToString(FindData(data, "metadata.ownerReferences.0", "kind"))

		// log.Println("PARAMS.NAEMData12 : ", params.Name)
		// log.Println("labels Data12 : ", labelApp)
		// log.Println("#44podName: ", podName)
		// log.Println("##55selectLable : ", selectLable)
		// log.Println("uid data : ", uid)
		// log.Println("kind data : ", kind)
		var WorkloadInfo interface{}
		// tmpWorkloadInfo := FindData(data, "metadata", "ownerReferences.0")

		// var repliuid string
		if kind == "ReplicaSet" {
			params.Kind = "replicasets"
			params.Name = InterfaceToString(FindData(data, "metadata.ownerReferences.0", "name"))

			repliData, err := DataRequest(params)
			if err != nil {
				return nil, err
			}

			// repliRefer, err := FindDataArrStr2(repliData, "items", "name", labelApp)
			// log.Printf("[###123]deployData", repliData)
			// log.Println("DeployRefer Data12 : ", repliRefer)
			// repliuid = InterfaceToString(FindDataStr(repliRefer[0], "metadata.ownerReferences.0", "uid"))

			// if err != nil {
			// 	return nil, err
			// }

			// log.Println("[#4]deplyName ", repliuid)

			// params.Kind = "deployments"

			// params.Name = ""
			// workloadData, err := DataRequest(params)
			// if err != nil {
			// 	return nil, err
			// }
			// log.Println("deploydata Data132 : ", workloadData)
			// workloadRefer, err := FindDataArrStr2(workloadData, "items", "uid", repliuid)
			// if err != nil {
			// 	return nil, err
			// }

			workloadInfo := model.WorkloadInfo{
				Name:        InterfaceToString(FindData(repliData, "metadata.ownerReferences.0", "name")),
				Kind:        InterfaceToString(FindData(repliData, "metadata.ownerReferences.0", "kind")),
				ReplicaName: InterfaceToString(FindData(data, "metadata.ownerReferences.0", "name")),
			}

			WorkloadInfo = workloadInfo
		} else {
			// WorkloadInfo = FindData(data, "metadata", "ownerReferences")
			workloadInfo := model.WorkloadInfo{
				Name: InterfaceToString(FindData(data, "metadata.ownerReferences", "name")),
				Kind: InterfaceToString(FindData(data, "metadata.ownerReferences", "kind")),
			}
			WorkloadInfo = workloadInfo
		}
		if err != nil {
			return nil, err
		}
		params.Kind = "endpoints"
		params.Name = ""
		serviceData, err := DataRequest(params)
		log.Printf("[#222]", serviceData)
		if err != nil {
			return nil, err
		}
		serviceRefer, err := FindDataArr(serviceData, "items", "uid", uid)
		log.Println("[#33 service refer] : ", serviceRefer)
		if err != nil {
			return nil, err
		}
		var ServiceInfo []model.ServiceInfo
		ServiceData := serviceRefer
		Transcode(ServiceData, &ServiceInfo)

		log.Printf("[#222]", serviceData)

		ReferData := model.ReferDataDeploy{
			WorkloadInfo: WorkloadInfo,
			ServiceInfo:  ServiceInfo,
		}
		return &ReferData, nil

	case "daemonsets":
		daemonsetName := params.Name
		params.Kind = "pods"
		params.Name = ""
		podsData, err := DataRequest(params)
		if err != nil {
			return nil, err
		}
		fmt.Printf("[##]podsData :%s\n", podsData)
		podData, err := FindDataArrStr2(podsData, "items", "name", daemonsetName)
		if err != nil {
			return nil, err
		}
		fmt.Printf("[##]podData :%s\n", podData)

		// splits := strings.Split(podData, ",")
		var Pods []model.DEPLOYMENTPOD
		// var RestartCnt int
		var PodNames []string
		// if podData != [] {
		for x, _ := range podData {
			// containerStatuses := FindData(podData[x], "status.containerStatuses.#", "restartCount")

			// fmt.Printf("##restartCnt :%d\n", RestartCnt)

			containerStatusesData := FindData(podData[x], "status", "containerStatuses.0.restartCount")

			fmt.Printf("##containerStatusesData :%+v\n", containerStatusesData)

			if InterfaceToString(FindData(podData[x], "status", "phase")) == "Running" {
				PodNames = append(PodNames, InterfaceToString(FindData(podData[x], "metadata", "name")))
			}

			podList := model.DEPLOYMENTPOD{
				Name:         InterfaceToString(FindData(podData[x], "metadata", "name")),
				Status:       InterfaceToString(FindData(podData[x], "status", "phase")),
				Node:         InterfaceToString(FindData(podData[x], "status", "hostIP")),
				PodIP:        InterfaceToString(FindData(podData[x], "status", "podIP")),
				RestartCount: InterfaceToInt(containerStatusesData),
			}
			Pods = append(Pods, podList)
		}
		// }

		params.Kind = "endpoints"
		params.Name = ""

		svcsData, err := DataRequest(params)
		var Svcs model.DEPLOYMENTSVC
		if err != nil {
			return nil, err
		}
		for p, _ := range PodNames {
			svcData, err := FindDataArrStr2(svcsData, "items", "name", PodNames[p])
			if err != nil {
				return nil, err
			}
			fmt.Printf("[##]svcData :%+v\n", svcData)
			// fmt.Printf("[##]svcDataName :%s\n", InterfaceToString(FindData(svcData[0], "metadata", "name")))
			if len(svcData) > 0 {
				svcList := model.DEPLOYMENTSVC{
					Name: InterfaceToString(FindData(svcData[0], "metadata", "name")),
					Port: FindData(svcData[0], "subsets", "ports"),
					// ClusterIP: InterfaceToString(FindData(svcData[0], "spec", "clusterIP")),
					// Type:      InterfaceToString(FindData(svcData[0], "spec", "type")),

				}
				Svcs = svcList

			}
		}
		deployments := model.DEPLOYMENTLISTS{
			Pods:     Pods,
			Services: Svcs,
			// ReplicaName: replicaName,
		}
		return deployments, nil
	}
	return nil, errors.New("")

}
func FindingLen(i string) int {
	parse := gjson.Parse(i)
	len := len(parse.Array())

	return len
}
func FindingLen2(i []gjson.Result) int {

	len := len(i)

	return len
}
func FindingArray(i string) []gjson.Result {
	parse := gjson.Parse(i)
	array := parse.Array()

	return array
}
func InterfaceToInt(i interface{}) int {
	str := InterfaceToString(i)
	v, _ := strconv.Atoi(str)
	return v
}
func InterfaceToFloat(i interface{}) float64 {
	str := InterfaceToString(i)
	v, _ := strconv.ParseFloat(str, 64)
	return v
}

func StringToInt(i string) int {
	v, _ := strconv.Atoi(i)
	return v
}

func FindDataLabelKey(i interface{}, p, f, u string) ([]string, error) {
	// log.Println("[In #FindDataArr]")
	// log.Println("[#1] Data is ", i)
	// log.Println("[#2] find path string is ", p)
	// log.Println("[#2] find key string is ", f)
	// log.Println("[#3] uniq string is ", u)

	// var itemCheck bool
	var parse, data gjson.Result
	var arr []gjson.Result
	// var result interface{}
	var result1 []string
	// var result2 []string
	ia := InterfaceToString(i)

	parse = gjson.Parse(ia)
	// log.Println("[#4] Parse is ", parse)

	pathCheck := strings.Compare(p, "") != 0
	// itemCheck = len(parse.Get("items").Array()) > 0
	// log.Println("[#4] itemCheck is ", itemCheck)

	if pathCheck {
		data = parse.Get(p)
		// log.Println("[#5] filter data is ", data)
	} else {
		data = parse
		// log.Println("[#5] filter data is ", data)
	}

	len := len(data.Array())
	// log.Println("[#6] len(data) is ", len)

	if len > 0 {
		// list
		arr = data.Array()
		// log.Println("[#7-1] len > 0, list")
		for t, _ := range arr {
			masterCheck := strings.Contains(arr[t].String(), "node-role.kubernetes.io/master")
			if masterCheck {
				strVal, _ := sjson.Set(arr[t].String(), "nodeType", "master")
				result1 = append(result1, strVal)
			} else {
				strVal, _ := sjson.Set(arr[t].String(), "nodeType", "worker")
				result1 = append(result1, strVal)
			}
		}
	} else if len == 1 {
		masterCheck := strings.Contains(data.String(), "node-role.kubernetes.io/master")
		if masterCheck {
			strVal, _ := sjson.Set(data.String(), "nodeType", "master")
			result1 = append(result1, strVal)
		} else {
			strVal, _ := sjson.Set(data.String(), "nodeType", "worker")
			result1 = append(result1, strVal)
		}
	}
	// list 출력
	return result1, nil
	// return strings.Join(results, ","), nil

}
func Duration(f float64) time.Duration {
	return time.Duration(f * 1e9)
}
func FillStruct(data map[string]interface{}, result interface{}) {
	t := reflect.ValueOf(result).Elem()
	for k, v := range data {
		val := t.FieldByName(k)
		val.Set(reflect.ValueOf(v))
	}
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}
func ToFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}
func ListSlice(list []map[string]interface{}, num int) []map[string]interface{} {
	var result []map[string]interface{}
	if len(list) > num {
		result = list[:num]
	} else {
		result = list
	}
	return result
}
