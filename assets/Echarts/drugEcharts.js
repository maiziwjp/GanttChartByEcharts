import * as echarts from "echarts";
function resizefontSize() {
  let font =
    getComputedStyle(document.getElementsByTagName("html")[0]).fontSize - 2;
  return parseInt(font);
}
function renderItem(params, api) {
  var categoryIndex = api.value(0);
  var start = api.coord([0, categoryIndex]);
  var height = api.size([0, 1])[1] * 0.35;
  var width = api.size([0, 1])[0];
  let blockWidth = 0;
  let blockX = 0;
  if (api.value(2) - api.value(1) >= 1) {
    blockWidth =
      width * api.value(3) +
      width * (1 - api.value(4)) +
      width * (api.value(2) - api.value(1) - 1);
    blockX = width * api.value(1) + width * (1 - api.value(3));
  } else {
    blockWidth = width * (api.value(3) - api.value(4));
    blockX = width * api.value(1) + width * (1 - api.value(3));
  }
  let xPosition = start[0] + blockX;
  if (api.value(5) > 0) {
    var rectShape1 = echarts.graphic.clipRectByRect(
      {
        
        x: xPosition + 3,
        y: start[1] - height / 2 + 3,
        width: blockWidth,
        height: height + 1,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );
    var rectShape2 = echarts.graphic.clipRectByRect(
      {
        x: xPosition,
        y: start[1] - height / 2,
        width: blockWidth,
        height: height + 1,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );
    let style = { fill: "rgba(34,168,233,0.2)", stroke: "#22A8E9" };
    let styleEmphasis = { fill: "#22A8E9", stroke: "#22A8E9" };
    let textStyle = { fill: "#D2EDFA", stroke: "#22A8E9" };
    if (api.value(8) == 2) {
      style = { fill: "rgba(107,136,238,0.2)", stroke: "#6B88EE" };
      styleEmphasis = { fill: "#6B88EE", stroke: "#6B88EE" };
      textStyle = { fill: "#E1E7FB", stroke: "#6B88EE" };
    } else if (api.value(8) == 3) {
      style = { fill: "rgba(212,215,229,0.2)", stroke: "#D4D7E5" };
      styleEmphasis = { fill: "#D4D7E5", stroke: "#D4D7E5" };
      textStyle = { fill: "#F6F7F9", stroke: "#D4D7E5" };
    }
    return {
      type: "group",
      children: [
        {
          type: "rect",
          shape: rectShape1,
          style: api.style(style),
          styleEmphasis: api.style(styleEmphasis),
        },
        {
          type: "rect",
          shape: rectShape2,
          style: api.style(textStyle),
          styleEmphasis: api.style(styleEmphasis)
        }
      ],
    };
  } else {
    let style = { fill: "rgba(34,168,233,0.2)", stroke: "#22A8E9" };
    let styleEmphasis = { fill: "#22A8E9", stroke: "#22A8E9" };
    if (api.value(8) == 2) {
      style = { fill: "rgba(107,136,238,0.20)", stroke: "#6B88EE" };
      styleEmphasis = { fill: "#6B88EE", stroke: "#6B88EE" };
    } else if (api.value(8) == 3) {
      style = { fill: "rgba(212,215,229,0.20)", stroke: "#D4D7E5" };
      styleEmphasis = { fill: "#D4D7E5", stroke: "#D4D7E5" };
    }
    var rectShape = echarts.graphic.clipRectByRect(
      {
        x: xPosition,
        y: start[1] - height / 2,
        width: blockWidth,
        height: height + 1,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );
    return {
      type: "group",
      children: [
        {
          type: "rect",
          shape: rectShape,
          style: api.style(style),
          styleEmphasis: api.style(styleEmphasis),
        },
      ],
    };
  }
}

var option = {
  tooltip: {
    formatter: function (params) {
      let data = params.data;
      let repeatItem = "";
      let dose =
        data.dose && typeof data.dose == "string"
          ? data.dose.split(";")
          : [data.dose];
      let doseUnit = data.doseUnit ? data.doseUnit.split(";") : [data.doseUnit];
      let totalAmount =
        data.totalAmount && typeof data.totalAmount == "string"
          ? data.totalAmount.split(";")
          : [data.totalAmount];
      let totalAmountUnit = data.totalAmountUnit
        ? data.totalAmountUnit.split(";")
        : [data.totalAmountUnit];
      let route = data.route ? data.route.split(";") : [data.route];
      let drugName = data.drugName.split("、");
      let handleName = "";
      for (let i = 0; i < drugName.length; i) {
        if (i + 1 == drugName.length) {
          handleName += `<div>${drugName[i]}、</div>`;
          i = i + 2;
        } else {
          handleName += `<div>${drugName[i]}、${drugName[i + 1]}、</div>`;
          i = i + 2;
        }
      }
      let itemW = 34;
      if (data.medicineTypeCode != 1) {
        itemW = 50;
      }
      let nameDom = `<div style="padding-bottom: 6px; display: flex;">
                            <div style="width: ${itemW}px;">成分</div>
                            <div style="color: rgba(0,0,0,0.65);">${handleName}</div>
                         </div>`;
      for (let i = 0; i < dose.length; i++) {
        let prePart = ``;
        if (i === dose.length - 1) {
          prePart = `<div style='color: #333'>`;
        } else {
          //最后一种药物不需要显示下边框
          prePart = `<div style='border-bottom: 1px solid #e9e9e9;color: #333'>`;
        }
        let lastPart = `<div style="padding: 16px;color: #333">
                              <div style="font-size: 12px;">
                                ${
                                  dose.length > 1
                                    ? `<div style="display: inline-block; margin-right: 6px; padding: 0 2px;">
                                                        ${i + 1}/${dose.length}
                                                     </div>`
                                    : ""
                                }
                                
                                ${data.name}
                              </div>
                              <div style="font-size: 10px;color: #333;">
                              ${
                                data.medicineTypeCode != 1
                                  ? `<div style="padding-bottom: 6px;display:flex;">
                                                                <div style="width: ${itemW}px;">开方时间</div>
                                                                <span style="color: rgba(0,0,0,0.65)">
                                                                    ${data.startTime}
                                                                </span>
                                                              </div>`
                                  : `<div style="padding-bottom: 6px;display:flex;">
                                                                            <span style="color: rgba(0,0,0,0.65)">
                                                                                ${data.startTime}~${data.endTime}
                                                                            </span>
                                                                         </div>`
                              }
                                
                                <div style="padding-bottom: 6px;display:flex;">
                                  <div style="width: ${itemW}px;">天数</div>
                                  <span style="color: rgba(0,0,0,0.65)">${
                                    data.days
                                  }</span>
                                </div>
                                ${data.medicineTypeCode != 1 ? nameDom : ""}
                                <div style="padding-bottom: 6px;display:flex;">
                                  <div style="width: ${itemW}px;">剂量</div>
                                  <span style="color: rgba(0,0,0,0.65)">${
                                    dose[i]
                                  }${doseUnit[i]}</span>
                                </div>
                                <div style="padding-bottom: 6px;display:flex;">
                                  <div style="width: ${itemW}px;">用法</div>
                                  <span style="color: rgba(0,0,0,0.65)">${
                                    route[i]
                                  }</span>
                                </div>
                                <div style="display:flex;">
                                  <div style="width: ${itemW}px;">用量</div>
                                  <span style="color: rgba(0,0,0,0.65)">${
                                    totalAmount[i]
                                  }${totalAmountUnit[i]}</span>
                                </div>
                              </div>
                            </div></div>`;
        repeatItem += prePart + lastPart;
      }
      return `<div id="tip-ele" style='z-index: 100'>${repeatItem}</div>`;
    },
    borderColor: "#e9e9e9",
    borderWidth: 1,
    backgroundColor: "#fff",
    extraCssText:
      "box-shadow: 0 0 6px 0 rgba(0,0,0,0.30);max-height: 400px;overflow: scroll;",
    borderRadius: 0,
    padding: 0,
    textStyle: {
      color: "#333333",
    },
    confine: true,
    enterable: true,
  },
  grid: {
    top: "40",
    bottom: "20",
    left: 140,
    right: "30",
  },
  dataZoom: [
    {
      type: "slider",
      show: true,
      height: 20,
      xAxisIndex: [0],
      filterMode: "weakFilter",
      showDataShadow: false,
      zoomLock: true,
      handleSize: "0",
      bottom: "0",
      start: 0,
      end: 100,
      fillerColor: "rgba(0,0,0,0.3)",
      showDetail: false,
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      width: 20,
      zoomLock: true,
      handleSize: "0",
      right: "10px",
      startValue: 0,
      endValue: 8,
      throttle: 0,
      fillerColor: "rgba(0,0,0,0.3)",
      padding: 4,
      showDetail: false,
    },
    {
      type: "inside",
      yAxisIndex: [0],
      zoomLock: true,
      zoomOnMouseWheel: false,
      moveOnMouseWheel: true,
    },
  ],
  xAxis: {
    data: [],
    position: "top",
    // 坐标轴两边留白,min和max无效
    boundaryGap: false,
    interval: 0,
    splitLine: {
      show: true,
      lineStyle: {
        color: "#E5E5E5",
      },
    },
    type: "category",
    axisLine: {
      lineStyle: {
        color: "#b4b4b4",
      },
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: "#b4b4b4",
      },
      length: 3,
      show: false,
    },
    axisLabel: {
      color: "rgba(0,0,0,0.65)",
      fontSize: resizefontSize(),
      formatter: function (value, index) {
        if (index === 0) {
          return "";
        } else if (value.length > 5) {
          return `${value.slice(0, 4)}\n${value.slice(5)}`;
        } else {
          return value;
        }
      },
    },
  },
  yAxis: {
    data: [],
    inverse: true,
    interval: 0,
    axisLine: {
      lineStyle: {
        color: "#b4b4b4",
      },
    },
    axisLabel: {
      formatter: function (params) {
        if (params == " " || params === undefined) {
          return "{empty|###}";
        }
        let clientFlag = resizefontSize() === 12 ? 1 : 0; // 1: 大屏----0: 小屏
        let index = params.indexOf("#"); //分割药品名称和药品天数
        let num = params.slice(index + 1);
        let newParams = params.slice(0, index);
        let nameLen = newParams.length;
        let numLen = num.length;
        let senNameLen = 0;
        let newParamsName = "";
        let handleSen = function (splitNum, len) {
          let senLen = 0;
          let senLen1 = 0;
          switch (len) {
            case 6:
              senLen = 12;
              senLen1 = 13;
              break;
            case 8:
              senLen = 14;
              senLen1 = 15;
              break;
            case 12:
              senLen = 24;
              senLen1 = 26;
              break;
            case 14:
              senLen = 30;
              senLen1 = 32;
              break;
          }
          if (
            (nameLen < len && numLen < 5) ||
            (nameLen < len + 1 && numLen < 3)
          ) {
            // 判断是否一行能显示完
            return newParams;
          } else {
            senNameLen = nameLen - splitNum;
            if (
              (senNameLen < len && numLen < 5) ||
              (senNameLen < len + 1 && numLen < 3) ||
              senNameLen < 0
            ) {
              return (
                newParams.substring(0, splitNum) +
                "\n" +
                newParams.substring(splitNum)
              );
            } else {
              if (numLen < 3) {
                return (
                  newParams.substring(0, splitNum) +
                  "\n" +
                  newParams.substring(splitNum, senLen1) +
                  "..."
                );
              } else {
                return (
                  newParams.substring(0, splitNum) +
                  "\n" +
                  newParams.substring(splitNum, senLen) +
                  "..."
                );
              }
            }
          }
        };
        if (/.*[A-Z]+.*$/.test(newParams)) {
          if (clientFlag) {
            // 大屏
            newParamsName = handleSen(8, 6);
          } else {
            // 小屏
            newParamsName = handleSen(10, 8);
          }
        } else if (/.*[\u4e00-\u9fa5]+.*$/.test(newParams)) {
          // 药品名称为汉语
          if (clientFlag) {
            // 大屏
            newParamsName = handleSen(8, 6);
          } else {
            // 小屏
            newParamsName = handleSen(10, 8);
          }
        }
        return `{value|${newParamsName}}{param|(${num})}`;
      },
      color: "rgba(0,0,0,0.65)",
      fontSize: resizefontSize(),
      interval: 0,
      rich: {
        value: {
          align: "right",
          height: 16,
          lineHeight: 16,
          width: 120,
          fontSize: resizefontSize(),
        },
        param: {
          height: 16,
          lineHeight: 16,
          fontSize: resizefontSize(),
          color: "#36cebc",
        },
        empty: {
          width: 120,
          fontSize: 0,
          color: "rgba(0,0,0,0.0)",
        },
      },
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: "#b4b4b4",
      },
      length: 3,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#E5E5E5",
      },
    },
    triggerEvent: true,
  },
  series: [
    {
      type: "custom",
      renderItem: renderItem,
      itemStyle: {
        normal: {
          borderColor: "#22A8E9",
          borderWidth: 1,
          borderType: "solid",
          color: "rgba(34,168,233,0.20)",
        },
      },
      encode: {
        x: [1, 2],
        y: 0,
      },
      data: [],
    },
  ],
};
export default option;
