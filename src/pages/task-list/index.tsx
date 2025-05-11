import { addRule, removeRule, rule, updateRule, getSignalList, getRegionOptions, getCameraIndexes, addSignal, openSignal, closeSignal, updateSignal, taskDetailPage,cleanSimilarImages } from '@/services/ant-design-pro/api';
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
  ProFormInstance,
  ProFormDatePicker,
  ProFormCheckbox
} from '@ant-design/pro-components';
import {
  FileTextOutlined,ClearOutlined, DownloadOutlined
} from '@ant-design/icons';
import '@umijs/max';
import { Button, Drawer, Input, message,Tag, Typography, Form, Modal, Image, FloatButton } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
// 导入 useNavigate
import { useNavigate } from 'react-router-dom'; 
import ReactJson from 'react-json-view';
import { pinyin } from 'pinyin-pro';
import moment from 'moment';
import { request } from '@umijs/max';

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
const getSignalSelectOptions = async () => {
  const res = await getSignalList();
  return (res.data || []).map((item) => ({
    value: item.id,
    label: item.name,
  }));
}


const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const historyActionRef = useRef<ActionType>();
  const hisotryFormRef = useRef<ProFormInstance>();
  const [createFormRef] = Form.useForm<FormValueType>(); // 使用 useForm 钩子并指定表单值类型
  const [currentRow, setCurrentRow] = useState<API.SignalListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.TaskListItem[]>([]);
  const [openCaptureModal, handlerOpenCaptureModal] = useState<boolean>(false);
  // 新增状态，用于区分是新建还是编辑操作
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [downloadOptionsModal, setDownloadOptionsModal] = useState<boolean>(false);
  const [downloadBtnLoading, setDownloadBtnLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<any>(null);
  const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([]);
  const [cameraIndexes, setCameraIndexes] = useState<{ value: string; label: string }[]>([]);
  const [isJsonModalLoading, setIsJsonModalLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRegionOptions = async () => {
      try {
        const res = await getRegionOptions();
        const options = (res.data || []).map((item) => ({
          value: item.indexCode,
          label: item.pathName,
        }));
        setRegionOptions(options);
      } catch (error) {
        console.error('获取区域选项失败:', error);
      }
    };

    const fetchCameraIndexCodeOptions = async () => {
      try {
        const res = await getCameraIndexes();
        const options = (res.data || []).map((item) => ({
          value: item.indexCode,
          label: item.indexCode,
        }));
        setCameraIndexes(options);
      } catch (error) {
        console.error('获取设备Id列表失败:', error);
      }
    }

    fetchRegionOptions();
    fetchCameraIndexCodeOptions();
  }, []);

  // 获取 navigate 方法
  const navigate = useNavigate(); 


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

  const columns: ProColumns<API.TaskListItem>[] = [
    {
      title: '设备名称',
      dataIndex: 'cameraName',
       // 为搜索输入框添加多选模式
      fieldProps: {
        mode: 'multiple',
      },
      // render: (dom, entity) => {
      //   return dom + `(${entity.cameraIndexCode})`;
      // },
    },
    {
      title: '设备ID',
      dataIndex: 'cameraIndexCode',
      valueType:'select',
        // 为搜索输入框添加多选模式
      fieldProps: {
        mode: 'multiple',
        showSearch: true, // 显示搜索框
        options: cameraIndexes,
      },
    },
    {
      title: '所在区域',
      dataIndex: 'regionIndexCode',
      valueType: 'select',
      search: {
         // 自定义搜索参数，让搜索时传递 ID
        transform: (value) => {
          return {
            // 假设后端接收的参数名为 signalId
            regionIndexCode: value, 
          };
        },
      },
      // 让下拉框支持搜索输入
      fieldProps: {
        mode: 'multiple',
        showSearch: true, // 显示搜索框
        options: regionOptions,
        filterOption: (input, option) => {
          // 输入处理（去除空格+转小写）
          const processedInput = input.trim().toLowerCase();
          // 原始中文匹配
          if (option.label.includes(processedInput)) return true;
          const match = pinyin(option.label)
          if (match.includes(processedInput)) return true;
        }
      },
    },
    {
      title: '任务ID',
      dataIndex: 'taskId',
      hideInForm: true,
      fieldProps: {
        mode: 'multiple',
      }
    },
    {
      title: '通路',
      dataIndex: 'signalId',
      request: getSignalSelectOptions,
      valueType: 'select',
      search: {
         // 自定义搜索参数，让搜索时传递 ID
        transform: (value) => {
          return {
            // 假设后端接收的参数名为 signalId
            signalId: value, 
          };
        },
      },
      fieldProps: {
        mode: 'multiple',
      }
    },    
    {
      title: '原始图片',
      dataIndex: 'frameImagePath',
      hideInForm: true,
      hideInSearch: true,
      render: (dom, entity) => {
        if (entity.frameImagePath) {
          return (
            <Image
              src={`/assets/${entity.frameImagePath}`}
              alt={`${entity.frameImagePath}`}
              style={{ maxWidth: '100px', maxHeight: '100px' }} // 可根据需求调整样式
            />
          );
        }
        return '-';
      }
    },
    {
      title: '打标类型',
      dataIndex: 'labels',
      hideInForm: true,
      valueType: 'select',
      // hideInSearch: true,
      valueEnum: {
        'hook': {
          text: 'hook',
        }
      },
      fieldProps: {
        mode: 'multiple', // 设置为多选模式
      },
      render: (dom, entity) => {
        if (entity.labelTypes !== undefined) {
          const labelTypeArray = entity.labelTypes.split(","); 
          if (labelTypeArray.length === 0) {
            return <Tag color="blue">无</Tag>;
          }
          return labelTypeArray.map((labelType) => {
            return (
              <Tag color="blue" key={labelType}>
                {labelType}
              </Tag>
            );
          });
        }
        return "-";
      }
    },
    {
      title: '打标信息',
      dataIndex: 'labelInfo',
      hideInForm: true,
      hideInSearch: true,
      render: (dom, entity) => {
        const isLoading = false;
        return (
          <>
            {entity.labelImagePath && (
              <Image
                src={`/assets/${entity.labelImagePath}`}
                alt={`${entity.labelImagePath}`}
                style={{ maxWidth: '100px', maxHeight: '100px' }} 
              />
            )}
            {entity.labelJsonPath && (
              <Button
                type="primary"
                size='small'
                icon={<FileTextOutlined />}
                onClick={() => {
                  setCurrentRow(entity);
                  setShowJsonModal(true);
                  setIsJsonModalLoading(true);
                  if (entity.labelJsonPath) {
                    fetch(`/assets/${entity.labelJsonPath}`)
                      .then((response) => response.json())
                      .then((data) => {
                        setJsonData(data);
                        setIsJsonModalLoading(false);
                      })
                      .catch((error) => {
                        message.error('Error fetching JSON data:', error)
                        console.error('Error fetching JSON data:', error);
                      });
                  }
                  
                }}
                loading={isLoading}
              >
                查看JSON
              </Button>
            )}
          </>
        );
      }
    },
    {
      title: '采集时间',
      // sorter: true,
      dataIndex: 'frameTimeMs',
      valueType: 'dateTime',
      // valueType: 'dateTimeRange',
      search: false,
      fieldProps: {
        mode: 'multiple',
      }
      // search: {
      //   transform: (value) => {
      //     if (value) {
      //       return {
      //         frameStartTimeMs: value[0]?.valueOf(),
      //         frameEndTimeMs: value[1]?.valueOf(),
      //       };
      //     }
      //     return {};
      //   },
      // }
    },
    {
      title: '采集时间',
      dataIndex: 'frameTimeSearc',
      // valueType: 'dateTime',
      valueType: 'dateTimeRange',
      hideInForm: true,
      // hideInSearch: true,
      hideInTable: true,
      fieldProps: {
        style: {
          width: 'auto',
          minWidth: 400, // 最小宽度
          maxWidth: '100%', // 最大宽度不超过容器
        },

      },
      search: {
        transform: (value) => {
          if (value) {
            console.log(value)
            return {
              frameStartMs: moment(value[0])?.valueOf(),
              frameEndMs: moment(value[1])?.valueOf(),
            };
          }
          return {};
        },
        
      },
      
    },

    {
      title: '打标时间',
      // sorter: true,
      dataIndex: 'labelTimeMs',
      valueType: 'dateTime',
      search: false,
    },
  ];



  return (
    <PageContainer>
      {/* <FloatButton badge={{ count: 12 }} icon={<DownloadOutlined />} /> */}

      <ProTable<API.TaskListItem, API.PageParams>
        actionRef={actionRef}
        formRef={formRef} // 添加 formRef 引用
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          // <Button
          //            type="primary"
          //            key="primary"
          //            color="danger"
          //            variant="outlined"
          //            onClick={() => {
          //              handleModalOpen(true);
          //            }}
          //          >
          //            <ClearOutlined /> 清理相似图片
          //          </Button>,
          <Button
            type="primary"
            key="primary"
            // color="danger"
            variant="outlined"
            loading={downloadBtnLoading}
            onClick={ () => {
              setDownloadOptionsModal(true)
            }}
          >
            <DownloadOutlined /> 下载
        </Button>
        ]}
        request={taskDetailPage}
        columns={columns}

        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title="清理文件夹"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const id = currentRow?.id
          const response = await cleanSimilarImages(value.folder);
          console.log(response)
          if (response.success) {
            handleModalOpen(false);
            message.success(`清理完成！删除记录 ${response.data.deletedRecordsCount} 条，清理图片 ${response.data.similarImagesCount} 张`);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error('清理失败，请重试！');
          }
        }}
      >
      <ProFormText
          rules={[
            {
              required: true,
              message: '文件夹路径必填',
            },
          ]}
          width="md"
          name="folder"
          label="文件夹路径"
        />
      </ModalForm>
      <ModalForm
        title="下载选项"
        open={downloadOptionsModal}
        onOpenChange={setDownloadOptionsModal}
        onFinish={async (value) => {
          setDownloadBtnLoading(true);
          const tableParams = formRef.current?.getFieldsValue();
          // 2. 手动转换 frameTimeSearc（如果存在）
          if (tableParams?.frameTimeSearc) {
            tableParams.frameStartMs = moment(tableParams.frameTimeSearc[0])?.valueOf();
            tableParams.frameEndMs = moment(tableParams.frameTimeSearc[1])?.valueOf();
            delete tableParams.frameTimeSearc; // 移除原始参数
          }
          // 将数组转换为对象格式
          const downloadOptions = {
            frameImage: value.downloadOptions?.includes('frameImage') || false,
            labelImage: value.downloadOptions?.includes('labelImage') || false,
            labelJson: value.downloadOptions?.includes('labelJson') || false
          };
          const data = {
            page: {...tableParams},
            options: downloadOptions,

          }
          console.log('post data', data)
          const response = await request('/api/tasks/download', {
            method: 'POST',
            data: data
          });
          if (response.success) {
            setDownloadOptionsModal(false);
            message.success("开始下载...请耐心等候")
            // 启动轮询
            const pollInterval = setInterval(async () => {
              const statusResponse = await request(`/api/tasks/download/status`, {
                method: 'GET',
                params: {
                  'downloadId': response.data.downloadId,
                },
              });
              if (statusResponse.data.status === 1) {
                setDownloadBtnLoading(false);
                message.destroy();
                message.success('压缩包生成完毕. 开始下载!');
                clearInterval(pollInterval);
                // 创建隐藏的iframe触发下载
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = "/assets" + statusResponse.data.filepath;
                document.body.appendChild(iframe);
                // 清理iframe
                setTimeout(() => {
                  document.body.removeChild(iframe);
                }, 5000);
              } else if (statusResponse.data.status === 2) {
                setDownloadBtnLoading(false);
                clearInterval(pollInterval);
                message.destroy();
                message.error('压缩包生成失败');
              }
            }, 3000); // 每3秒轮询一次

            // 组件卸载时清理定时器
            return () => clearInterval(pollInterval);
          } else {
            message.error('下载任务生成失败，请重试！' + response.msg);
            setDownloadBtnLoading(false);
          }
        }}
      >
        <ProFormCheckbox.Group name="downloadOptions" options={[
                {
                  label: '原始图片',
                  value: 'frameImage',
                },
                {
                  label: '打标图片',
                  value: 'labelImage',
                },
                {
                  label: '打标JSON',
                  value: 'labelJson',
                },
              ]}
              rules={[
                {
                  required: true,
                  message: '请选择至少一个选项',
                },
              ]}
              initialValue={['frameImage']}
              />
      </ModalForm>
      <Modal
        title="查看JSON"
        open={showJsonModal}
        onClose={() => {
          setShowJsonModal(false)
          setJsonData(null)
        }}
        onCancel={() => {
          setShowJsonModal(false)
          setJsonData(null)
        }}
        footer={null}
        loading={isJsonModalLoading}
      >
        <ReactJson 
          src={jsonData}
          name={false} // 隐藏root节点名称

          displayDataTypes={false} // 隐藏数据类型
          displayObjectSize={false} // 隐藏对象大小
          theme="monokai"
          // iconStyle="circle"
          // indentWidth={2}
          collapseStringsAfterLength={200} // 长字符串折叠
          collapsed={2}
          style={{
            backgroundColor: '#1e1e1e', // 暗色背景
            padding: '16px',
            borderRadius: '4px',
            maxHeight: '60vh',
            overflow: 'auto',
            wordBreak: 'break-word' // 防止文本溢出
          }}

        >
        </ReactJson>
      </Modal>
    </PageContainer>
  );
};
export default TableList;
