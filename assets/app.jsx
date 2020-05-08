import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import Echart from "./Echarts/index";
import "./index.less";
@inject("Drug")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      echartsStart: 0,
    };
    this.echartsTop = 0;
  }
  componentDidMount() {
    // 获取药物视图
    this.props.Drug.getEchart({
      status: 1,
    });
  }

  // 药物鼠标滚轮事件
  handleScroll = (e) => {
    let deltaY = e.deltaY;
    let handleFuntion = () => {
      if (deltaY <= 0) {
        // 向上滑动鼠标
        this.props.Drug.drugScrollUp();
        let echartsStart = this.props.Drug.echartsData.dataZoom[1].startValue;
        this.setState({
          echartsStart,
        });
      } else {
        // 向下滑动鼠标
        this.props.Drug.drugScrollDown();
        let echartsStart = this.props.Drug.echartsData.dataZoom[1].startValue;
        this.setState({
          echartsStart,
        });
      }
    };
    this.scrollTime = setTimeout(handleFuntion, 0);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    let drugCanvas = document.getElementById("rc-drug");
    if (drugCanvas) {
      let drugDiv = drugCanvas.getElementsByTagName("div")[0];
      drugDiv.onmousewheel = this.handleScroll;
      drugDiv.addEventListener("onmousewheel", this.handleScroll);
    }
    // 重新获取高度
    let echartRange = document.getElementById("drug-echarts");
    this.echartsTop = this.getElementToPageTop(echartRange);
    if (this.child) {
      this.child.resizeChart(this.echartsTop);
    }
  }

  getElementToPageTop = (el) => {
    if (el.offsetParent) {
      return this.getElementToPageTop(el.offsetParent) + el.offsetTop;
    }
    return el.offsetTop;
  };

  render() {
    const { echartsData } = this.props.Drug;
    return (
      <div>
        <div className="drug-chart">
          <div className="drug-content">
            <div className="drug-box">
              <div className="drug-chart-title">
                <div>
                  用药概况 <span>近6月</span>
                </div>
                <div className="durg-intro">
                  <div className="intro">
                    <div className="spot-use"></div>
                    <span>在用西药</span>
                  </div>
                  <div className="intro">
                    <div className="spot-use-two"></div>
                    <span>在用中药</span>
                  </div>
                  <div className="intro">
                    <div className="spot-use-no"></div>
                    <span>停用</span>
                  </div>
                </div>
              </div>
              <div className="chart-bar" id="drug-echarts">
                <div style={{ position: "relative", zIndex: 10 }}>
                  <div className="black-block" />
                  <Echart
                    options={echartsData}
                    height={0}
                    name="drug"
                    chartId={"rc-drug"}
                    tip="zz-x-axis-tip"
                    echartsTop={this.echartsTop}
                    onRef={(e) => (this.child = e)}
                  />
                  <div className={`zz-x-axis-tip`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
