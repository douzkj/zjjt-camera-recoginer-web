// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };



  type CameraListItem = {
    id?: number;
    indexCode?: string;
    name?: string;
    status?: number;
    regionPathName?: string;
    regionName?: string;
    regionIndexCode?: string;
    regionPath?: string;
    signalId?:number;
    signalName?:string;
    updatedAt?: string;
  };

  type CameraList = {
    data?: CameraListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };


  type TaskListItem = {
    id?: number;
    cameraIndexCode?: string;
    cameraName?: string;
    cameraAddr?: string;
    regionPathName?:string;
    regionIndexCode?:string;
    taskId?:string;
    signalId?:number;
    frameImagePath?:string;
    frameTimeMs?:number;
    labelImagePath?:string;
    labelJsonPath?:string;
    labelTypes?:string;
    labelTimeMs?:number;
  }

  type TaskList = {
    data?: TaskListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };


  type TaskDetailListItem = {
    id?: number;
    cameraName?: string;
    cameraIndexCode?: string;
    
  }

  type CleanupSimilarImagesResponse = {
    deletedRecordsCount?: number;
    similarImagesCount?: number;
  }


  type TaskDetailList = {
    data?: TaskDetailListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }



  type SignalListItem = {
    id?: number;
    name?: string;
    description?:string;
    cameraCnt?: number;
    latestClosedAtMs?:number;
    config?: object;
    openedAtMs?:number;
    closedAtMs?:number;
    status?: number;
    type?:string;
    frameImageCnt?:number;
    labelImageCnt?:number;
    labelJsonCnt?:number;
  }


  type SignalList = {
    data?: SignalListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type SignalConfig = {
    frame?: SignalFrameConfig;
    algo?: SignalAlgoConfig;
  }

  type SignalAlgoConfig = {
    label?: boolean;
  }
  type SignalFrameConfig = {
    storage?: SignalFrameStorageConfig;
    read?: SignalFrameReadConfig;
  }

  type SignalFrameStorageConfig = {
    frameStoragePath?:string;
    frameImageSuffix?:string = 'jpg'
  }
  type SignalFrameReadConfig = {
    frameIntervalSeconds?: number = 5;
    frameRetryTimes?: number = 3;
    frameRetryInterval?:number = 1;
    frameWindow?:number = -1;
  }


  type RegionListItem = {
    indexCode?: string;
    name?: string;
    pathName?: string;
    path?: string;
  }



}
