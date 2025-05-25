import { Column,Bar } from '@ant-design/plots';
import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { request } from '@umijs/max';
import { assign, last } from 'lodash';


function getChartXFieldName(targetName: string, classification:string, classificationParentName: string) {
  if (classificationParentName !== null && classificationParentName !== '') {
    return classificationParentName + "/" + classification + "/" + targetName
  }
  return classification + "/" + targetName
}


const ChartPannel: React.FC = () => {

  const [statisticData, setStatisticData] = useState<any>([]);
  // 新增数据获取逻辑
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request('/api/chart/statistic', { // 替换为实际接口地址
          method: 'GET'
        });
        if (res.success) {
          res.data.map((item:any)=>{
            item.statisticTypeName = item.statisticType === 'instance' ? '实例数量' : '图片数量'
            item.classificationParentName = item.classificationParentName === null ? item.classification : item.classificationParentName + "/" + item.classification
            item.chartXField = item.classificationParentName + " / " + item.targetName 
          })
          setStatisticData(res.data);
        }
      } catch (error) {
      }
    };

    fetchData();
  }, []);

  const barConfig = {
    data: [],
    xField: 'chartXField',
    yField: 'value',
    // seriesField: 'targetName',
    // colorField: 'targetName',
    // group: true,
    stack: true,
    sort: {
      reverse: true,
      by: 'y',
    },

    axis: {
      // y: { labelFormatter: '~s' },
      x: {
        labelAutoHide: false,
        labelAutoRotate: false,
        labelAutoEllipsis: false, // 新增配置：禁止文本截断
        transform: [
          
        ],
        labelSpacing: 4
      },
    },
  }

 const instanceBarConfig = {
  ...barConfig,
  data: statisticData.filter((item:any)=>item.statisticType === 'instance') || [],
    // data: statisticData,
  title: '实例统计',
 };
  const imageBarConfig = {
  ...barConfig,
  data: statisticData.filter((item:any)=>item.statisticType === 'image') || [],
  title: '图像统计',
 };
  return (
    <>
    <Bar {...instanceBarConfig} />
    <Bar {...imageBarConfig} />
    </>
    
   
  );
};

export default ChartPannel;

