import drugEcharts from "../Echarts/drugEcharts";

let health = {
  // 处理药物数据，将其赋值给Echarts
  drugArrangementData: (data, status) => {
    if (!data) {
      return false;
    }
    let judgePosition = function (time, xAxis) {
      for (let j = 0; j < xAxis.length - 1; j++) {
        if (xAxis[j] >= time && xAxis[j + 1] < time) {
          return j;
        }
      }
      if (time === xAxis[xAxis.length - 1]) {
        return xAxis.length - 1;
      }
      return -1;
    };
    // 计算当前月份
    let date = new Date();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let todayMonth = date.getFullYear() + "/" + month;
    // 提取yAxis药物名称
    let yAxis = data.yAxis;
    let newYAxis = [];
    for (let i = 0; i < yAxis.length; i++) {
      let index = yAxis[i].indexOf("#");
      newYAxis.push(yAxis[i].slice(0, index));
    }
    let xAxis = data.xAxis;
    let xMoveYear = data.xMoveYear;
    // 处理x轴数据
    if (xMoveYear[1].length < xMoveYear[0].length) {
      xMoveYear[1] = xMoveYear[0].slice(0, 5) + xMoveYear[1];
    }
    let drugInfo = data.drugInfo;
    // 处理每一条药品信息
    let handleData = [];
    if (status === 1) {
      // 默认显示一个月的
      for (let i = 0; i < drugInfo.length; i++) {
        let item = drugInfo[i];
        let row = newYAxis.indexOf(drugInfo[i].name);
        let colStart = judgePosition(drugInfo[i].endTime, xAxis);
        let colEnd = judgePosition(drugInfo[i].startTime, xAxis);
        let startPer = drugInfo[i].endTime
          ? 1 -
            (new Date(xAxis[colStart]) - new Date(drugInfo[i].endTime)) /
              86400000 /
              31
          : 1 / 31;
        let endPer = drugInfo[i].startTime
          ? 1 -
            (new Date(xAxis[colEnd]) - new Date(drugInfo[i].startTime)) /
              86400000 /
              31
          : 1 / 31;
        item.value = [
          row,
          colStart,
          colEnd,
          startPer,
          endPer,
          0,
          0,
          status,
          drugInfo[i].flag,
        ];
        handleData.push(item);
      }
    }
    // 合并药品名称一样并且用药开始时间和结束时间一致的数据
    for (let i = 0; i < handleData.length; i++) {
      let item = handleData[i];
      for (let j = 0; j < handleData.length; j++) {
        let comItem = handleData[j];
        if (
          handleData[i] &&
          i != j &&
          comItem.name == item.name &&
          comItem.startTime == item.startTime &&
          comItem.endTime == item.endTime
        ) {
          handleData[i].value[5]++;
          handleData[i].route = handleData[i].route + ";" + comItem.route;
          handleData[i].routeEn = handleData[i].routeEn + ";" + comItem.routeEn;
          handleData[i].frequency =
            handleData[i].frequency + ";" + comItem.frequency;
          handleData[i].dose = handleData[i].dose + ";" + comItem.dose;
          handleData[i].doseUnit =
            handleData[i].doseUnit + ";" + comItem.doseUnit;
          handleData[i].drugDays = handleData[i].days + ";" + comItem.days;
          handleData[i].totalAmount =
            handleData[i].totalAmount + ";" + comItem.totalAmount;
          handleData[i].totalAmountUnit =
            handleData[i].totalAmountUnit + ";" + comItem.totalAmountUnit;
          handleData.splice(j, 1);
          j--;
        }
      }
    }
    // 将处理后的数据给echarts赋值做配置
    drugEcharts.xAxis.data = xMoveYear ? xMoveYear : xAxis;
    drugEcharts.yAxis.data = yAxis;
    if (window.innerWidth > 1439) {
      // 分辨率高的x轴显示12格
      // 计算x轴间隔，默认12格
      let dataZoomX = (14 / (xAxis ? xAxis.length : 14)) * 100;
      if (xAxis && xAxis.length >= 14) {
        let start = 0;
        if (xAxis.indexOf(todayMonth) > -1) {
          start = (xAxis.indexOf(todayMonth) / xAxis.length) * 100;
        }
        drugEcharts.dataZoom[0].start = start;
        drugEcharts.dataZoom[0].end = dataZoomX + start;
        drugEcharts.dataZoom[0].show = true;
      } else {
        drugEcharts.dataZoom[0].show = false;
        drugEcharts.dataZoom[0].start = 0;
        drugEcharts.dataZoom[0].end = 100;
        if (xAxis.length < 3) {
          for (let i = 0; i < 3 - xAxis.length; i++) {
            drugEcharts.xAxis.data = drugEcharts.xAxis.data.concat([" "]);
          }
        }
      }
    } else {
      // 分辨率低的x轴显示8格
      // 计算x轴间隔，默认12格
      let dataZoomX = (10 / (xAxis ? xAxis.length : 10)) * 100;
      if (xAxis && xAxis.length >= 10) {
        let start = 0;
        if (xAxis.indexOf(todayMonth) > -1) {
          start = (xAxis.indexOf(todayMonth) / xAxis.length) * 100;
        }
        drugEcharts.dataZoom[0].start = start;
        drugEcharts.dataZoom[0].end = dataZoomX + start;
        drugEcharts.dataZoom[0].show = true;
      } else {
        drugEcharts.dataZoom[0].show = false;
        drugEcharts.dataZoom[0].start = 0;
        drugEcharts.dataZoom[0].end = 100;
        if (xAxis.length < 3) {
          for (let i = 0; i < 3 - xAxis.length; i++) {
            drugEcharts.xAxis.data = drugEcharts.xAxis.data.concat([" "]);
          }
        }
      }
    }
    if (yAxis && yAxis.length < 9) {
      drugEcharts.dataZoom[1].show = false;
      for (let i = 0; i < 9 - yAxis.length; i++) {
        drugEcharts.yAxis.data = drugEcharts.yAxis.data.concat([" "]);
      }
    } else {
      drugEcharts.dataZoom[1].show = true;
      drugEcharts.dataZoom[1].startValue = 0;
      drugEcharts.dataZoom[1].endValue = 8;
    }
    drugEcharts.series[0].data = handleData;
    return drugEcharts;
  },
  // 药物视图中滚轮事件（向上滑动）
  drugScrollUp: () => {
    if (drugEcharts.dataZoom[1].startValue > 1) {
      drugEcharts.dataZoom[1].startValue -= 1;
      drugEcharts.dataZoom[1].endValue -= 1;
    } else if (drugEcharts.dataZoom[1].startValue == 1) {
      drugEcharts.dataZoom[1].startValue -= 1;
      drugEcharts.dataZoom[1].endValue -= 1;
    }
    return drugEcharts;
  },
  // 药物视图中滚轮事件（向下滑动）
  drugScrollDown: () => {
    if (drugEcharts.yAxis.data.length - drugEcharts.dataZoom[1].endValue > 2) {
      drugEcharts.dataZoom[1].startValue += 1;
      drugEcharts.dataZoom[1].endValue += 1;
    } else if (
      drugEcharts.dataZoom[1].endValue <
      drugEcharts.yAxis.data.length - 1
    ) {
      drugEcharts.dataZoom[1].startValue += 1;
      drugEcharts.dataZoom[1].endValue += 1;
    }
    return drugEcharts;
  },
};

export default health;
