// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { Simulate } from 'react-dom/test-utils';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {})
    }
  });
}

/* ============ 设备接口 start ============= */

/** 获取设备列表 GET /api/camera/page */
export async function cameras(options?: { [key: string]: any }) {
  console.log("query cameras", options)
  return request<API.CameraList>('/api/camera/page', {
    method: 'GET',
    params: {
      ...options,
    },
  //  ...(options || {}),
  });
}
/** 绑定通路 */
export async function bindSignal(cameraIds: number[],signalId?:number) {
  return request<Boolean>('/api/camera/bind', {
    method: 'POST',
    data:{
      signalId: signalId,
      cameraIds: cameraIds
    }
  });
}

export async function getCameraIndexes() {
  return request<Boolean>('/api/camera/indexes', {
    method: 'GET'
  });
}

/** 查看图像 */
export async function viewImage(indexCode:string) {
  return request<String>('/api/camera/view', {
    method: 'POST',
    data:{
      indexCode: indexCode
    }
  });
}

/* ============ 设备接口 end============= */

/* ============ 通路接口 start ============= */

/** 获取设备列表 GET /api/signal/list */
export async function getSignalList(options?: { [key: string]: any }) {
  return request<API.SignalListItem>('/api/signal/list', {
    method: 'GET',
   ...(options || {}),
  });
}

export async function getSignalPage(options?: { [key: string]: any }) {
  return request<API.SignalListItem>('/api/signal/page', {
    method: 'GET',
    params: {
     ...options,
    },
   ...(options || {}),
  });
}

export async function addSignal(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/signal/create', {
    method: 'POST',
    data:{
      ...(options || {}),
    }
  });
}

export async function updateSignal(id: number, options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/signal/update', {
    method: 'POST',
    data:{
      id: id,
      ...(options || {}),
    }
  });
}

export async function openSignal(options?: { [key: string]: any }) {
  return request<Boolean>('/api/signal/open', {
    method: 'POST',
    data:{
      ...(options || {}),
    }
  });
}

export async function closeSignal(id: number) {
  return request<Boolean>('/api/signal/close', {
    method: 'POST',
    data:{
      id: id
    }
  });
}

export async function tasks(options?: { [key: string]: any }) {
  return request<API.TaskListItem>('/api/signal/tasks', {
    method: 'GET',
    params: {
     ...(options || {}),
    },
    ...(options || {}),
  });
  
}


export async function taskDetailPage(options?: { [key: string]: any }) {
  return request<API.TaskDetailListItem>('/api/tasks/page', {
    method: 'GET',
    params: {
     ...(options || {}),
    },
    ...(options || {}),
  });
  
}


export async function cleanSimilarImages(options?: { [key: string]: any }) {
  return request<API.CleanupSimilarImagesResponse>('/api/algo/task/cleanup', {
    method: 'POST',
    data:{
      ...(options || {}),
    }
  });

}

export async function getCleaningState() {
  return request('/api/algo/task/cleanup/state', {
    method: 'GET',
  });
}
/* ============ 通路接口 end============= */



/* ============ 区域接口 start ============= */

/** 获取设备列表 GET /api/region/options */
export async function getRegionOptions(options?: { [key: string]: any }) {
  return request<API.RegionListItem>('/api/region/options', {
    method: 'GET',
    params: {
      ...options,
    },
  //  ...(options || {}),
  });
}
/* ============ 区域接口 end============= */