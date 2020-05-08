'use strict'

import React from 'react'
import * as echarts from 'echarts'
import drugEcharts from "./drugEcharts";

class ChartLineAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.newProps = this.props;
    this.chart = null;
    this.chartId = this.props.chartId;
    this.props.onRef(this)
  }
  componentDidMount() {
    this.initChart(this.props)
  }
  componentWillReceiveProps(newProps) {
    this.newProps = newProps;
    this.chart.clear();
    this.chartId = newProps.chartId;
    this.chart.setOption(newProps.options);
    this.initChart(newProps)
  }
  componentWillUpdate() {
    this.chart.clear()
  }
  shouldComponentUpdate() {
    return false
  }
  resizeChart = (height) => {
    this.initChart(this.newProps, height)
  }
  getElementToPageTop = (el) => {
    if(el.offsetParent) {
      return this.getElementToPageTop(el.offsetParent) + el.offsetTop
    }
    return el.offsetTop
  }
  initChart(props, height) {
    let chartDom = document.getElementById(`${this.chartId}`);
    let tip = this.props.tip;
    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
    let resizeChart = function () {
      if(chartDom){
        chartDom.style.height = window.innerHeight - 120 + 'px';
        chartDom.style.width = window.innerWidth - props.width + 'px';
      }
    };
    //设置容器高宽
    resizeChart();
    if (chartDom) {
      const chart = echarts.init(chartDom);
      chart.setOption(props.options);
      chart.on('mouseover', function (params) {
        if( params.componentType === 'yAxis' ){
          let offsetX = params.event.event.offsetX;
          let offsetY = params.event.event.offsetY;
          let xAxisTip = document.querySelector(`.${tip}`);
          xAxisTip.innerText = params.value.split('#')[0];
          xAxisTip.style.left = offsetX +  'px';
          xAxisTip.style.top = offsetY + 10 + 'px';
          xAxisTip.style.display = 'block';
        }
      });
      chart.on('mousemove', function (params) {
        if( params.componentType === 'yAxis' ){
          let offsetX = params.event.event.offsetX;
          let offsetY = params.event.event.offsetY;
          let xAxisTip = document.querySelector(`.${tip}`);
          xAxisTip.innerText = params.value.split('#')[0];
          xAxisTip.style.left = offsetX + 30 +  'px';
          xAxisTip.style.top = offsetY + 10 + 'px';
          xAxisTip.style.display = 'block';
        }
      });
      chart.on('mouseout', function (params) {
        let xAxisTip = document.querySelector(`.${tip}`);
        xAxisTip.style.display = 'none';
      });
      chart.on('datazoom', function (params) {
        if (params.dataZoomId.indexOf('1') === -1) {
          drugEcharts.dataZoom[0].start = params.start;
          drugEcharts.dataZoom[0].end = params.end;
        }
      })
      this.chart = chart;
      chart.resize();
      window.addEventListener('resize', () => {
        resizeChart();
        chart.resize()
      }, false)
    }
  }

  render() {
    return (
      <div id={this.props.chartId}></div>
    )
  }
}

export default ChartLineAnalysis
