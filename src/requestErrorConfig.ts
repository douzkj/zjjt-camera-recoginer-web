﻿import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 普通响应结构
interface CommonResponseStructure {
  code: number;
  data: any;
  msg: string;
}


// 分页响应结构
interface PaginationResponseStructure {
  code: number;
  data: {
    total: number;
    totalPage: number;
    items: any[];
  };
  msg: string;
}

// 与后端约定的响应数据格式
interface ResponseStructure  {
  success?: boolean;
  code: number;
  data: any;
  msg: string;
}



/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      console.log('errorThrower', res)
      const { success, data, code, msg } =
        res as unknown as ResponseStructure;
      if (!success) {
        // message.error(msg);
        // const error: any = new Error(msg);
        // error.name = 'BizError';
        // error.info = { code, msg, data };
        // throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const url = config?.url?.concat('?token = 123');
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      console.log('responseInterceptors', response)
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;
      // console.log('code', code, 'data', data, 'msg', msg)

      if (data?.code !== 200) {
        message.error('请求失败！' + data?.msg);
      }
      if (typeof data?.data === 'object' && data?.data !== null && 'items' in data?.data) {
        return {
          ...response,
          data: {
            success: data?.code === 200,
            data: data?.data.items || [],
            total: data?.data.total || 0,
            code: data?.code,
            msg: data?.msg,
          }
        }
      } else {
        return {
          ...response,
          data: {
            success: data?.code === 200,
            data: data?.data,
            code: data?.code,
            msg: data?.msg,
          }
        }
      }
    },
  ],
};