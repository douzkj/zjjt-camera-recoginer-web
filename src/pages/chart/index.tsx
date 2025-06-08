import React, { Children, useState, useRef, useEffect } from 'react';
import { Table, Card, Col, Tag, Typography, Divider, Progress, Statistic, Row } from 'antd';
import { Column,Bar } from '@ant-design/plots';
import { ProList } from '@ant-design/pro-components';
import { request } from '@umijs/max';


const rawData = [
        {
            "target": "people_helmet",
            "targetName": "建筑工人（戴安全帽）",
            "classification": "人",
            "classificationParentName": null,
            // "classificationParentName":  "人",
            "statisticType": "instance",
            "value": 473
        },
        {
            "target": "people_helmet",
            "targetName": "建筑工人（戴安全帽）",
            "classification": "人",
          "classificationParentName": null,
            // "classificationParentName":  "人",
            "statisticType": "image",
            "value": 265
        },
        {
            "target": "people_no_helmet",
            "targetName": "建筑工人（不带安全帽）",
            "classification": "人",
          "classificationParentName": null,
            // "classificationParentName":  "人",
            "statisticType": "instance",
            "value": 135
        },
        {
            "target": "people_no_helmet",
            "targetName": "建筑工人（不带安全帽）",
            "classification": "人",
"classificationParentName": null,
            // "classificationParentName":  "人",
            "statisticType": "image",
            "value": 113
        },
        {
            "target": "pc_slab",
            "targetName": "预制叠合板",
            "classification": "装配式建筑结构构件",
           "classificationParentName": null,
            // "classificationParentName":  "装配式建筑结构构件",
            "statisticType": "instance",
            "value": 3940
        },
        {
            "target": "pc_slab",
            "targetName": "预制叠合板",
            "classification": "装配式建筑结构构件",
           "classificationParentName": null,
            // "classificationParentName":  "装配式建筑结构构件",
            "statisticType": "image",
            "value": 59
        },
        {
            "target": "hook",
            "targetName": "吊钩",
            "classification": "建筑起重机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 281
        },
        {
            "target": "hook",
            "targetName": "吊钩",
            "classification": "建筑起重机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 260
        },
        {
            "target": "tower_crane",
            "targetName": "塔式起重机",
            "classification": "建筑起重机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 1085
        },
        {
            "target": "tower_crane",
            "targetName": "塔式起重机",
            "classification": "建筑起重机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 612
        },
        {
            "target": "crane_truck",
            "targetName": "汽车/轮胎/履带式起重机",
            "classification": "建筑起重机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 424
        },
        {
            "target": "crane_truck",
            "targetName": "汽车/轮胎/履带式起重机",
            "classification": "建筑起重机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 361
        },
        {
            "target": "excavator",
            "targetName": "单斗挖掘机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 1246
        },
        {
            "target": "excavator",
            "targetName": "单斗挖掘机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 728
        },
        {
            "target": "dozer",
            "targetName": "推土机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 0
        },
        {
            "target": "dozer",
            "targetName": "推土机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 0
        },
        {
            "target": "wheel_loader",
            "targetName": "轮式装载机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 183
        },
        {
            "target": "wheel_loader",
            "targetName": "轮式装载机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 156
        },
        {
            "target": "roller",
            "targetName": "静作用/振动压路机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 7
        },
        {
            "target": "roller",
            "targetName": "静作用/振动压路机",
            "classification": "土方石机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 6
        },
        {
            "target": "truck",
            "targetName": "载货汽车/挂车",
            "classification": "运输机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 3714
        },
        {
            "target": "truck",
            "targetName": "载货汽车/挂车",
            "classification": "运输机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 2774
        },
        {
            "target": "pickup",
            "targetName": "皮卡车",
            "classification": "运输机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 58
        },
        {
            "target": "pickup",
            "targetName": "皮卡车",
            "classification": "运输机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 55
        },
        {
            "target": "mixer_truck",
            "targetName": "混凝土搅拌运输车",
            "classification": "混凝土机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 995
        },
        {
            "target": "mixer_truck",
            "targetName": "混凝土搅拌运输车",
            "classification": "混凝土机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 667
        },
        {
            "target": "concrete_pump_truck",
            "targetName": "混凝土泵车",
            "classification": "混凝土机械",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 68
        },
        {
            "target": "concrete_pump_truck",
            "targetName": "混凝土泵车",
            "classification": "混凝土机械",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 57
        },
        {
            "target": "car",
            "targetName": "轿车",
            "classification": "乘用车",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 1375
        },
        {
            "target": "car",
            "targetName": "轿车",
            "classification": "乘用车",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 679
        },
        {
            "target": "suv",
            "targetName": "运动型乘用车",
            "classification": "乘用车",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 1040
        },
        {
            "target": "suv",
            "targetName": "运动型乘用车",
            "classification": "乘用车",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 549
        },
        {
            "target": "mpv",
            "targetName": "多用途面包车",
            "classification": "乘用车",
            "classificationParentName": "建筑机械",
            "statisticType": "instance",
            "value": 378
        },
        {
            "target": "mpv",
            "targetName": "多用途面包车",
            "classification": "乘用车",
            "classificationParentName": "建筑机械",
            "statisticType": "image",
            "value": 317
        }
    ];

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



// 统一合并计算方法
const calCellSpan = (item: any, index: number, arr: any[]) => {

};

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
  // 新增数据获取逻辑
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request('/api/chart/statistic', { // 替换为实际接口地址
          method: 'GET'
        });
        if (res.success) {
          setRawData(res.data);
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
                    <Typography.Text type="secondary">（<Tag color='#1677ff'>实例数量</Tag>/ <Tag color='#d46b08'>图片数量</Tag>）</Typography.Text>
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