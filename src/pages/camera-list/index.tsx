import { addRule, removeRule, rule, updateRule, cameras, getSignalList, getRegionOptions, bindSignal, viewImage } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormInstance,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message, Image, Modal } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { pinyin } from 'pinyin-pro';
// 导入 useLocation 钩子
import { useLocation } from 'react-router-dom'; 


/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({
      ...fields,
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
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



const unbindSignal = async (selectedRows: API.CameraListItem[]) => {
  const hide = message.loading('正在解绑');
  if (!selectedRows) return true;
  try {
    await bindSignal(selectedRows.map((row) => row.id), null);
    hide();
    message.success('解绑成功');
    return true;
  } catch (error) {
    hide();
    console.log(error);
    message.error('解绑失败，请重试. err: ' + error);
    return false;
  }
}

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
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [bindSignalModalOpen, handleBindSignalModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [currentRow, setCurrentRow] = useState<API.CameraListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.CameraListItem[]>([]);
  const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([]);
  const [viewRtspImage, setViewRtspImage] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [viewBtnLoading, setViewBtnLoading] = useState<boolean>(false); // 新增加载状态
  const [viewImageModalOpen, handelViewImageModalOpen] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState({});
  const location = useLocation();


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

    fetchRegionOptions();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    console.log("searchParams", searchParams)
    if (searchParams.size > 0) {
      const initiFormValues = Object.fromEntries(searchParams);
      const numberSeriaFields = ['signalId'];
      numberSeriaFields.forEach((field) => {
        if (initiFormValues[field] !== undefined) {
          let k = parseInt(initiFormValues[field]);
          if (!isNaN(k)) {  
            initiFormValues[field] = k;
          } else {
            delete initiFormValues[field];
          }
        }
      });
      setInitialValues(initiFormValues);
      formRef.current?.setFieldsValue(initiFormValues);
      formRef.current?.submit();
    }
  }, [location.search]);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.CameraListItem>[] = [
    {
      title: '设备ID',
      dataIndex: 'indexCode',
      // tip: 'The rule name is the unique key',
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
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '所在区域',
      dataIndex: 'regionPathName',
      valueType: 'select',
      // valueEnum: regionOptions, 
      // request: async () => {
      //   const res = await getRegionOptions();
      //   return (res.data || []).map((item) => ({
      //     value: item.indexCode,
      //     label: item.pathName,
      //   }));
      // },
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
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      search: false,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '已上线',
          status: 'Success',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '最新更新时间',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      search: false,
      // renderFormItem: (item, { defaultRender, ...rest }, form) => {
      //   const status = form.getFieldValue('status');
      //   if (`${status}` === '0') {
      //     return false;
      //   }
      //   if (`${status}` === '3') {
      //     return <Input {...rest} placeholder={'请输入异常原因！'} />;
      //   }
      //   return defaultRender(item);
      // },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          // loading={viewBtnLoading}
          onClick={async () => {
            if (viewBtnLoading) return;
            setViewBtnLoading(true);
            try {
              handelViewImageModalOpen(true);
              const res = await viewImage(record.indexCode);
              if (res.code === 200) {
                setImageBase64(res.data);
                setViewRtspImage(true);
              }
            } catch (error) {
              message.error('查看图像失败，请重试');
              console.error('查看图像失败:', error);
            } finally {
              setViewBtnLoading(false); // 加载结束
            }
          }}
        >
          查看图像
        </a>,
        // <a key="subscribeAlert" href="https://procomponents.ant.design/">
        //   订阅警报
        // </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.CameraListItem, API.PageParams>
        actionRef={actionRef}
        formRef={formRef}
        form={{ initialValues }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
 
        ]}
        request={cameras}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            console.log("selectedRows:", selectedRows)
            setSelectedRows(selectedRows);
          },
        }}
      />
      {/* {viewRtspImage && (
        <div>
          <Button onClick={() => setViewRtspImage(false)}>关闭图像</Button>
          <Image src={imageBase64} alt="Camera Image" />
        </div>
      )} */}

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            danger
            onClick={async () => {
              await unbindSignal(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            解绑通路
          </Button>
          <Button 
            type="primary"
            onClick={async () => {
              handleBindSignalModalOpen(true);
            }
          }
          >分配通路</Button>
        </FooterToolbar>
      )}
      <Modal
      title="查看图像"
      open={viewImageModalOpen}
      loading={viewBtnLoading}
      onCancel={() => {
        handelViewImageModalOpen(false);
        setImageBase64('');
      }}
      footer={null}
      >
        {viewBtnLoading ? (
          // 加载时显示加载信息
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span>正在加载图片，请稍候...</span>
          </div>
        ) : (
          // 加载完成显示图片
          <Image src={`data:image/jpg;base64,${imageBase64}`} alt="Camera Image" style={{ width: '100%' }} />
        )}
      </Modal>
      <ModalForm
        title={'新建规则'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>

      <ModalForm
        title={'绑定通路'}
        width="400px"
        open={bindSignalModalOpen}
        onOpenChange={handleBindSignalModalOpen}
        onFinish={async (value) => {
          const success = await bindSignal(selectedRowsState.map((row) => row.id), value?.signalId);
          if (success) {
            message.success('绑定成功');
            setSelectedRows([]);
            handleBindSignalModalOpen(false);
            actionRef.current?.reloadAndRest?.();
          } else {
            message.error('绑定失败');
          }
        }}
      >
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '通路名',
            },
          ]}
          width="md"
          request={getSignalSelectOptions}
          name="signalId"
        />
      </ModalForm>

      <UpdateForm
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
      />

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
