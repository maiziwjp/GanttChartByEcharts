import { action, observable, runInAction } from 'mobx';
import requestData from '../Data/response';
import health from '../Data/handleData';

class DrugStore {
  //药物图表
  @observable echartsData = {};
  @observable echartParams = {}; // 保存药物图表的查询参数
  @observable echartsEnd = 0;

  // 获取药物图表数据
  @action
  async getEchart(params) {
    let data = await new Promise((resolve, reject)=>{
        resolve(requestData);
    }).then(res => {
      let resDate = res.data;
        let dataInfo = resDate.drugInfo;
        if (dataInfo.length === 0) {
          return null;
        }
        for (let i = 0; i < dataInfo.length - 1; i++) {
          let first = dataInfo[i];
          let sen = dataInfo[i + 1];
          if (first.drugName === sen.drugName && first.drugStopDtime === sen.drugStopDtime && first.drugStartDtime > sen.drugStartDtime) {
            dataInfo[i] = sen;
            dataInfo[i + 1] = first;
            i++;
          }
        }
        for (let i = 0; i < dataInfo.length; i++) {
          dataInfo[i].startTime = dataInfo[i].drugStartDtime;
          dataInfo[i].endTime = dataInfo[i].drugStopDtime;
          dataInfo[i].days = dataInfo[i].drugUsingDays ? dataInfo[i].drugUsingDays : '~';
          dataInfo[i].dose = dataInfo[i].drugPerDose ? dataInfo[i].drugPerDose : '~';
          dataInfo[i].doseUnit = dataInfo[i].drugDoseUnit ? dataInfo[i].drugDoseUnit : '~';
          dataInfo[i].frequency = dataInfo[i].drugUsingFreq ? dataInfo[i].drugUsingFreq : '~';
          dataInfo[i].frequencyEn = dataInfo[i].drugUsingFreq ? dataInfo[i].drugUsingFreq : '~';
          dataInfo[i].relName = dataInfo[i].drugName ? dataInfo[i].drugName : '~';
          dataInfo[i].name = dataInfo[i].drugStdName ? dataInfo[i].drugStdName : '~';
          dataInfo[i].remarks = dataInfo[i].notes ? dataInfo[i].notes : '~';
          dataInfo[i].route = dataInfo[i].drugRouteName ? dataInfo[i].drugRouteName : '~';
          dataInfo[i].routeEn = dataInfo[i].drugRouteName ? dataInfo[i].drugRouteName : '~';
          dataInfo[i].specification = dataInfo[i].spec ? dataInfo[i].spec : '~';
          dataInfo[i].totalAmount = dataInfo[i].drugTotalDose ? dataInfo[i].drugTotalDose : '~';
          dataInfo[i].totalAmountUnit = dataInfo[i].drugTotalUnit ? dataInfo[i].drugTotalUnit : '~';
          dataInfo[i].flag = !dataInfo[i].status ? 3  : dataInfo[i].medicineTypeCode == 1 ? 1 : 2; // 1: 在用西药 2: 在用中药 3:停用
          dataInfo[i].medicineTypeCode = dataInfo[i].medicineTypeCode;
        }
        resDate.drugInfo = dataInfo;
        return resDate;
    });
    runInAction(() => {
      this.echartParams = params;
      this.echartsData = health.drugArrangementData(data, params.status);
    })
  }

  //向上滑动药物图表
  @action drugScrollUp() {
    this.echartsData = health.drugScrollUp();
    this.echartsEnd = this.echartsData.dataZoom[1].endValue;
  }

  //向下滑动药物图表
  @action drugScrollDown() {
    this.echartsData = health.drugScrollDown();
  }
}

const Drug = new DrugStore();

export default {Drug}