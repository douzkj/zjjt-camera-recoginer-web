import React, { Children, useState, useRef, useEffect } from 'react';
import { Table, Card, Col, Tag, Typography, Divider, Progress, Statistic, Row } from 'antd';
import { Column,Bar } from '@ant-design/plots';
import { ProList } from '@ant-design/pro-components';
import { request } from '@umijs/max';


const preapredData = (items: any[]) => {
    let i = 0;
    const combinedTarge:any = {}
    items.map((item:any)=>{
        if (!(item.target in combinedTarge)) {
            combinedTarge[item.target] = {
            ...item,
            classificationPk: item.classificationParentName === null? item.classification : item.classificationParentName + "/" + item.classification,
        }
        }
        combinedTarge[item.target][item.statisticType + 'Value'] = item.value
    })
    return Object.values(combinedTarge)
}



// 新增合并计算方法
const calculateRowSpan = (key: string, index: number, record:any, dataSource: any[]) => {
    const firstIndex = dataSource.findIndex(d => 
                    d[key] === record[key]
    );
     return index === firstIndex ? { rowSpan: dataSource.filter(d => 
                    d[key] === record[key]
                ).length } : { rowSpan: 0 };
};



const ChartShow : React.FC = () => {
     const chartRefs = useRef<any>({});
     const [rawData, setRawData] = useState<any>([]);
     const [totalImages, setTotalImages] =useState<any>([]);
     const [totalInstaces, setTotalInstaces] =useState<any>([]);

  // 新增数据获取逻辑
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request('/api/statistic/chart', { // 替换为实际接口地址
          method: 'GET'
        });
        if (res.success) {
          setRawData(res.data.records);
          setTotalImages(res.data.numImages);
          setTotalInstaces(res.data.numInstances)
        }
      } catch (error) {
      }
    };

    fetchData();
  }, []);
    const data = preapredData(rawData)

    console.log(data)
    // 在组件外部计算全局最大值
    const globalMaxValue = Math.max(...data.map(item => Math.max(item.imageValue, item.instanceValue)));
    console.log('globalMaxValue', globalMaxValue)
    const instanceTotalValue = totalInstaces;
    const imageTotalValue = totalImages;

    const columns = [{
        dataIndex: 'classificationPk',
        key: 'classificationPk',
        title: '类目',
        colSpan: 2,
        render: (text, record) => record.classificationParentName || record.classification,
        onCell: (record, index) => {
            // 处理无父级分类的情况（如"人"）
                if (!record.classificationParentName) {
                    return {
                        rowSpan: 1,
                        colSpan: 2 // 合并两列
                    };
                }
                return calculateRowSpan('classificationParentName', index, record, data)
        }
    },
    {
        dataIndex: 'classification',
        key: 'classification',
        colSpan: 0,
        onCell: (_, index) => {
          // 合并子级分类相同项
          return {
            colSpan:  _.classificationParentName? 1 : 0,
            ... calculateRowSpan('classification', index, _, data)
          }
        }
    },
    { 
        key: 'targetName',
        title: '目标',
        dataIndex: 'targetName',
    },
    {
        // dataIndex: 'value',
        title: () => {
            return (
                <div>
                    <Typography.Text strong>数量</Typography.Text>
                    <Typography.Text type="secondary">（<Tag color='#1677ff'>实例数量({instanceTotalValue})</Tag>/ <Tag color='#d46b08'>图片数量({imageTotalValue})</Tag>）</Typography.Text>
                </div>
            )
        },
        // key: 'value',
        width: '60%',  // 设置固定列宽
        render: (_, index) => {
            return (
                <>
                <Progress 
            percent={(_.instanceValue / globalMaxValue) * 100}
            percentPosition={{ align: 'center', type: 'inner' }}
            strokeColor="#1677ff"
            strokeWidth={12}
            style={{ 
         margin: '2px 0',
        lineHeight: 0.8 
            }}
            format={(percent) => `${_.instanceValue}`}
        />
                <Progress 
            percent={(_.imageValue / globalMaxValue) * 100}
            percentPosition={{ align: 'center', type: 'inner' }}
            strokeColor="#d46b08"
            strokeWidth={12}
            style={{ 
                margin: '2px 0',
                lineHeight: 0.8 
            }}
            format={(percent) => `${_.imageValue}`}
        />
        
                </>
            
            )
            
        },
    }
]
    return (
        <>
         <Table 
                style={{
                    height: 400
                }}
                size='small'
                columns={columns}
                dataSource={data}
                // showHeader={false}
                expandable={{
                    showExpandColumn: false
                }}
                pagination={false} // 新增分页配置
                bordered
                />
        </>
    )
}
export  default ChartShow
