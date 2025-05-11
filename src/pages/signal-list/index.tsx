import { addRule, removeRule, rule, updateRule, getSignalList,getSignalPage, addSignal, openSignal, closeSignal, updateSignal, tasks } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps, ProFormColumnsType } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProCard,
  ProDescriptions,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormGroup,
  ProFormRadio,
  ProFormDigit,
  ProFormFieldSet,
  ProFormSwitch,
  ProFormDependency,
  ProFormInstance
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message,Tag, Typography, Form, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
// 导入 useNavigate
import { useNavigate } from 'react-router-dom'; 

const TYPE_SPECIAL = 'SPECIAL';
const TYPE_GENERAL = 'GENERAL';
const { Title } = Typography;


const SIGNAL_TYPE_VALUES_ENUM = {
  'SPECIAL': {
    text: '专项',
  },
  'GENERAL': {
    text: '通用',
  },
  
}

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.SignalListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addSignal({
      ...fields,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败, 请重试!');
    return false;
  }
};
const handleOpenSignal = async (fields: API.SignalListItem) => {
  try {
    await openSignal({
      ...fields,
    });
    message.success('开启成功');
    return true;
  } catch (error) {
    message.error('开启失败, 请重试!');
    return false;
  }
};

const handlerCloseSignal= async (id: number) => {
  try {
    await closeSignal(id);
    message.success('停止成功');
    return true;
  } catch (error) {
    message.error('停止失败, 请重试!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (id:number, fields: FormValueType) => {
  const hide = message.loading('编辑中');
  try {
    await updateSignal(id, {
      ...fields,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败, 请重试!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const historyActionRef = useRef<ActionType>();
  const hisotryFormRef = useRef<ProFormInstance>();
  const [createFormRef] = Form.useForm<FormValueType>(); // 使用 useForm 钩子并指定表单值类型
  const [currentRow, setCurrentRow] = useState<API.SignalListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [openCaptureModal, handlerOpenCaptureModal] = useState<boolean>(false);
  // 新增状态，用于区分是新建还是编辑操作
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const DEFAULT_GENERAL_STORAGE_PATH = '/data/zjjt_camera_recognizer/algo/dataset_raw/general'
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [hisotryFormInitialValues, setHistoryFormInitialValues] = useState({});

  // 获取 navigate 方法
  const navigate = useNavigate(); 

  const onTypeChange = (value) => {
    // 当切换为通用类型时设置默认路径
    if (value === TYPE_GENERAL) {
      setStoragePathGeneral()
    }
  }

  const setStoragePathGeneral = () => {
    createFormRef?.setFieldsValue({
      config: {
        frame: {
          storage: {
            frameStoragePath: DEFAULT_GENERAL_STORAGE_PATH
          }
        }
      }
    });
  }

  // type DataItem = {
  //   name: string;
  //   state: string;
  // };
  
  // const signalConfigColumns: ProFormColumnsType<DataItem>[] = [
  //  {

  //  }
  
  
  // ]

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.SignalListItem>[] = [
    {
      title: '通路ID',
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '通路名称',
      dataIndex: 'name',
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         setCurrentRow(entity);
      //         setShowDetail(true);
      //       }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
    },
    {
      title: '通路描述',
      dataIndex: 'description',
      hideInForm: true,
      valueType: 'textarea',
      hideInSearch: true
    },
    {
      title: '通道类型',
      dataIndex: 'type',
      hideInForm: true,
      valueEnum: SIGNAL_TYPE_VALUES_ENUM,
      renderText: (val: string) => {
        if (val === TYPE_SPECIAL) {
          return <Tag color='cyan'>专项</Tag>;
        }
        if (val === TYPE_GENERAL) {
          return <Tag color='green'>通用</Tag>;
        }
      },
    },
    {
      title: '设备数量',
      dataIndex: 'cameraCnt',
      hideInForm: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              navigate(`/camera?signalId=${entity.id}`); 
            }}
          >
            {dom}
          </a>
        );
      }
    },
    
    {
      title: '采集图像数量',
      dataIndex: 'frameImageCnt',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '打标信息（图片数量, JSON数量）',
      dataIndex: 'labelInfo',
      hideInForm: true,
      hideInSearch: true,
      render: (dom, entity) => {
        return `${entity.labelImageCnt ?? '-'}, ${entity?.labelJsonCnt ?? '-'}`
      }
    },

    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '采集中',
          status: 'Processing',
        },
      },
    },
    {
      title: '上次采集结束时间',
      sorter: true,
      dataIndex: 'latestClosedAtMs',
      valueType: 'dateTime',
      search: false,
      hideInTable: true
    },
    {
      title: '采集开始时间',
      // sorter: true,
      dataIndex: 'openedAtMs',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '采集结束时间',
      // sorter: true,
      dataIndex: 'closedAtMs',
      valueType: 'dateTime',
      search: false,

    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const buttonStyle = { marginRight: 1 }; // 设置按钮右侧边距为 8px
        const start_btn = <Button
          type="link"
          onClick={() => {
            handlerOpenCaptureModal(true);
            setCurrentRow(record);
          }}
          style={buttonStyle} // 应用样式
        >
          采集
        </Button>
        const stop_btn = <Button
            type="link"
            danger
            onClick={async () => {
              const ret = await handlerCloseSignal(record.id);
              if (ret) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            style={buttonStyle} // 应用样式  
          >
            停止采集
          </Button>
        const btns = []
        if (record.status === 0) {
          btns.push(start_btn) 
        }
        if (record.status === 1) {
          btns.push(stop_btn)
        }
        btns.push(
          <Button
            type="link"
            onClick={() => {
              handleModalOpen(true);
              setCurrentRow(record)
              setIsEditing(true); // 标记为编辑操作
            }}
            style={buttonStyle} // 应用样式
          >
            编辑
          </Button>,
           <Button
           type="link"
           onClick={() => {
             setIsHistoryModalVisible(true);
             setCurrentRow(record)
             historyActionRef.current?.reload()
           }}
           style={buttonStyle} // 应用样式
         >
           历史任务
         </Button>
        )
        
        return btns
      }
    },
  ];

  const historyTaskcolumns: ProColumns<API.TaskListItem>[] = [
    {
      title: '任务ID',
      dataIndex: 'taskId',
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         setCurrentRow(entity);
      //         setShowDetail(true);
      //       }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
    },
    {
      title: '通路ID',
      dataIndex: 'signalId',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '采集图像数量',
      dataIndex: 'frameImageCnt',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '打标信息（图片数量, JSON数量）',
      dataIndex: 'labelInfo',
      hideInForm: true,
      hideInSearch: true,
      render: (dom, entity) => {
        return `${entity.labelImageCnt ?? '-'}, ${entity?.labelJsonCnt ?? '-'}`
      }
    },

    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '采集中',
          status: 'Processing',
        },
      },
    },
    {
      title: '采集开始时间',
      // sorter: true,
      dataIndex: 'openedAtMs',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '采集结束时间',
      // sorter: true,
      dataIndex: 'closedAtMs',
      valueType: 'dateTime',
      search: false,
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.SignalListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getSignalPage}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <Modal
        title={`[${currentRow?.name}] 历史任务`}
        visible={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
        }}
        destroyOnClose
        footer={null}
        width={1200} // 增加宽度，可根据需求调整
        style={{
          maxHeight: '90vh', // 设置最大高度为视口高度的 90%
        }}
        bodyStyle={{
          maxHeight: '70vh', // 设置模态框内容区域的最大高度
          overflowY: 'auto' // 当内容超出高度时显示滚动条
        }}
      
      >
       <ProTable<API.TaskListItem, API.PageParams>
          actionRef={historyActionRef}
          columns={historyTaskcolumns}
          formRef={hisotryFormRef}
          request={ async (params) => {
            console.log('currentRow', currentRow, "params", params)
            return await tasks({"signalId": currentRow?.id, ...params})
          }}
          rowKey="id"
        />
      </Modal>
      <ModalForm
        title={'开始采集'}
        layout='horizontal'
        open={openCaptureModal}
        onOpenChange={handlerOpenCaptureModal}
        onFinish={async (value) => {
          const id = currentRow?.id
          const success = await handleOpenSignal({
            id: id,
            ...value
          });
          if (success) {
            handlerOpenCaptureModal(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      > 
      <ProFormRadio.Group
                  required
                  name='stopType'
                  label="停止方式" 
                  initialValue="handler"
                  width={"xs"}
                  options={[
                    {
                      label: '手动停止',
                      value: 'handler'
                    },
                    {
                      label: "自动停止",
                      value: "auto"
                    }
                  ]}
                />
                <ProFormDependency name={['stopType']}>
                  {({ stopType }) => {
                    // 仅在自动停止时显示采集时长输入框
                    return stopType === 'auto' ? (
                      <ProFormDigit
                        name="period"
                        width={"xs"}
                        rules={[
                          {
                            required: true,
                            message: '请输入',
                          },
                        ]}
                        label="采集时长（单位：时）"
                        tooltip="开始采集后多久自动结束"
                        min={0.1}
                      />
                    ) : null;
                  }}
              </ProFormDependency>
      </ModalForm>
      <ModalForm
        form={createFormRef}
        title={isEditing ? '编辑通路' : '新建通路'} // 根据操作类型设置标题
        layout='horizontal'
        open={createModalOpen}
        onOpenChange={(open) => {
          if (open) {
            if (isEditing && currentRow) {
              // 编辑时设置表单值
              console.log("row", currentRow)
              createFormRef.setFieldsValue(currentRow);
            } else {
              // 新建时重置表单
              console.log("新建时重置表单")
               // 确保表单已初始化后再调用 resetFields
               setTimeout(() => {
                createFormRef.resetFields();
                // 新建时如果默认类型是通用，设置默认存储路径
                const initialValues = createFormRef.getFieldsValue();
                if (initialValues.type === TYPE_GENERAL) {
                  setStoragePathGeneral()
                }
              }, 0);
              
            }
          } else {
            setIsEditing(false); 
            setCurrentRow(undefined);
          }
          handleModalOpen(open);
        }}
        onFinish={async (value) => {
          let success;
          if (isEditing) {
            success = await handleUpdate(currentRow.id, value as FormValueType);
          } else {
            success = await handleAdd(value as API.RuleListItem);
          }
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        initialValues={isEditing ? currentRow : {}} // 根据操作类型初始化表单值
        onValuesChange={(changedValues) => {
          if ('type' in changedValues) {
            onTypeChange(changedValues.type);
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '通路名称必填',
            },
          ]}
          width="md"
          name="name"
          label="通路名称"
        />
        <ProFormSelect 
          name="type"
          label="通路类型"
          width="md"
          valueEnum={SIGNAL_TYPE_VALUES_ENUM}
          initialValue={TYPE_SPECIAL}
          rules={[
            {
              required: true,
            },
          ]}
        />
         <ProFormTextArea width="md" name="description" label="通路描述" />
         <ProForm.Item
           label="通路配置"
         >
          <ProCard 
                bordered
                // style={{
                //   marginBlockEnd: 8,
                // }}
            > 
              <ProFormGroup name={['config', 'frame', 'storage']} label="存储配置">
                <ProFormText 
                  rules={[
                    {
                      required: true,
                      message: '存储路径必填',
                    },
                  ]}
                  name={['config', 'frame', 'storage', 'frameStoragePath']}
                  label="存储路径"
                />
 
                <ProFormRadio.Group
                  required
                  name={['config', 'frame', 'storage', 'frameImageSuffix']}
                  label="图片后缀" 
                  initialValue="jpg"
                  options={['jpg', 'png']}
                />
                
              </ProFormGroup>
              <ProFormGroup name={['config', 'frame', 'read']} label="读取配置">
                <ProFormDigit 
                required 
                name={['config', 'frame', 'read', 'frameIntervalSeconds']}
                label="读取间隔（秒）" 
                tooltip="多久读取一帧图片并保存"
                initialValue={5}
                width="xs"
                fieldProps={{ precision: 0 }}
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
                />
                <ProFormDigit 
                required 
                name={['config', 'frame', 'read', 'frameRetryTimes']}
                label="重试次数" 
                tooltip="单次帧读取失败后的重试次数"
                initialValue={3}
                width="xs"
                fieldProps={{ precision: 0 }}
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
                />
                <ProFormDigit 
                required 
                name={['config', 'frame', 'read', 'frameRetryInterval']}
                label="重试间隔（秒）" 
                tooltip="单次帧读取失败后延迟多久再读"
                initialValue={1}
                width="xs"
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
                
                />
                <ProFormDigit 
                  name={['config', 'frame', 'read', 'frameWindow']}
                  value={-1}
                  fieldProps={{
                    type: 'hidden',
                  }}
                />
                {/* <ProFormDigit 
                required 
                name="frame.read.frameWindow" 
                label="读取图片张数" 
                tooltip="读取图片张数，-1表示全部读取"
                initialValue={0}
                min={0}
                width="xs"
                fieldProps={{ 
                  precision: 0,
                  // 格式化函数，将值转换为显示的文本
                  formatter: (value) => {
                    if (value === 0) {
                      return '无限制';
                    }
                    return `${value}`;
                  },
                  // 解析函数，将显示的文本转换回实际的值
                  parser: (text) => {
                    if (text === '无限制') {
                      return 0;
                    }
                    return Number(text) || 0;
                  },
                }}
                /> */}
              
              </ProFormGroup>
              <ProFormGroup name={['config', 'algo']} label="算法配置">
                <ProFormSwitch
                    required
                    name={['config', 'algo', 'label', 'enabled']}
                    label="算法打标" 
                    initialValue={false}
                  />
              </ProFormGroup>
            </ProCard>
         </ProForm.Item>
      </ModalForm>
      {/* <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      /> */}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
