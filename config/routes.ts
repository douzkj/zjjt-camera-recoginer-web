import { WifiOutlined } from '@ant-design/icons';

export default [
  // {
  //   path: '/user',
  //   layout: false,
  //   routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  // },
  // { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { name: '设备列表', icon: 'camera', path: '/camera', component: './camera-list' },
  { name: '通道列表', icon:'wifi', path: '/signal', component: './signal-list' },
  { name: '采集记录', icon:'hdd', path: '/task', component: './task-list' },

  { path: '/', redirect: '/camera' },
  { path: '*', layout: false, component: './404' },
];
