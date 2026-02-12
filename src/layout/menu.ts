import {
  Box,
  Briefcase,
  Coin,
  Connection,
  Document,
  OfficeBuilding,
  Setting,
  Tickets,
  User,
} from '@element-plus/icons-vue'

export type MenuItem = {
  key: string
  label: string
  path?: string
  children?: MenuItem[]
  icon?: any
}

const baseMenuTree: MenuItem[] = [
  {
    key: 'department',
    label: '部门管理',
    icon: OfficeBuilding,
    children: [
      { key: 'department-query', label: '查询', path: '/department/query' },
      { key: 'department-pending', label: '待复核', path: '/department/pending' },
      { key: 'department-reviewed', label: '已复核', path: '/department/reviewed' },
    ],
  },
  {
    key: 'post',
    label: '岗位管理',
    icon: Briefcase,
    children: [
      { key: 'post-query', label: '查询', path: '/post/query' },
      { key: 'post-pending', label: '待复核', path: '/post/pending' },
      { key: 'post-reviewed', label: '已复核', path: '/post/reviewed' },
    ],
  },
  {
    key: 'userAdmin',
    label: '用户管理员管理',
    icon: User,
    children: [
      { key: 'userAdmin-query', label: '查询', path: '/userAdmin/query' },
      { key: 'userAdmin-pending', label: '待复核', path: '/userAdmin/pending' },
      { key: 'userAdmin-reviewed', label: '已复核', path: '/userAdmin/reviewed' },
    ],
  },
  {
    key: 'userOperator',
    label: '用户操作员管理',
    icon: User,
    children: [
      { key: 'userOperator-query', label: '查询', path: '/userOperator/query' },
      { key: 'userOperator-pending', label: '待复核', path: '/userOperator/pending' },
      { key: 'userOperator-reviewed', label: '已复核', path: '/userOperator/reviewed' },
    ],
  },
  {
    key: 'participant',
    label: '参与者管理',
    icon: Tickets,
    children: [
      {
        key: 'participant-spotTrader',
        label: '现货交易商管理',
        icon: Coin,
        children: [
          { key: 'participant-spotTrader-query', label: '查询', path: '/participant/spotTrader/query' },
          { key: 'participant-spotTrader-pending', label: '待复核', path: '/participant/spotTrader/pending' },
          { key: 'participant-spotTrader-reviewed', label: '已复核', path: '/participant/spotTrader/reviewed' },
        ],
      },
      {
        key: 'participant-traderFundAccount',
        label: '交易商资金账号管理',
        icon: Coin,
        children: [
          { key: 'participant-traderFundAccount-query', label: '查询', path: '/participant/traderFundAccount/query' },
          { key: 'participant-traderFundAccount-pending', label: '待复核', path: '/participant/traderFundAccount/pending' },
          { key: 'participant-traderFundAccount-reviewed', label: '已复核', path: '/participant/traderFundAccount/reviewed' },
        ],
      },
      {
        key: 'participant-onlineSigning',
        label: '线上签约管理',
        icon: Document,
        children: [
          {
            key: 'participant-online-newTrader',
            label: '新增交易商',
            icon: Document,
            children: [
              { key: 'participant-online-newTrader-query', label: '查询', path: '/participant/onlineSigning/newTrader/query' },
              { key: 'participant-online-newTrader-pending', label: '待复核', path: '/participant/onlineSigning/newTrader/pending' },
              { key: 'participant-online-newTrader-reviewed', label: '已复核', path: '/participant/onlineSigning/newTrader/reviewed' },
            ],
          },
          {
            key: 'participant-online-traderChange',
            label: '交易商变更',
            icon: Document,
            children: [
              {
                key: 'participant-online-traderChange-query',
                label: '查询',
                path: '/participant/onlineSigning/traderChange/query',
              },
              {
                key: 'participant-online-traderChange-pending',
                label: '待复核',
                path: '/participant/onlineSigning/traderChange/pending',
              },
              {
                key: 'participant-online-traderChange-reviewed',
                label: '已复核',
                path: '/participant/onlineSigning/traderChange/reviewed',
              },
            ],
          },
          {
            key: 'participant-online-newTraderFundAccount',
            label: '新增交易商资金账号',
            icon: Document,
            children: [
              {
                key: 'participant-online-newTraderFundAccount-query',
                label: '查询',
                path: '/participant/onlineSigning/newTraderFundAccount/query',
              },
              {
                key: 'participant-online-newTraderFundAccount-pending',
                label: '待复核',
                path: '/participant/onlineSigning/newTraderFundAccount/pending',
              },
              {
                key: 'participant-online-newTraderFundAccount-reviewed',
                label: '已复核',
                path: '/participant/onlineSigning/newTraderFundAccount/reviewed',
              },
            ],
          },
          {
            key: 'participant-online-terminateTraderFundAccount',
            label: '解约交易商资金账号',
            icon: Document,
            children: [
              {
                key: 'participant-online-terminateTraderFundAccount-query',
                label: '查询',
                path: '/participant/onlineSigning/terminateTraderFundAccount/query',
              },
              {
                key: 'participant-online-terminateTraderFundAccount-pending',
                label: '待复核',
                path: '/participant/onlineSigning/terminateTraderFundAccount/pending',
              },
              {
                key: 'participant-online-terminateTraderFundAccount-reviewed',
                label: '已复核',
                path: '/participant/onlineSigning/terminateTraderFundAccount/reviewed',
              },
            ],
          },
          {
            key: 'participant-online-cancelTrader',
            label: '注销交易商',
            icon: Document,
            children: [
              { key: 'participant-online-cancelTrader-query', label: '查询', path: '/participant/onlineSigning/cancelTrader/query' },
              {
                key: 'participant-online-cancelTrader-pending',
                label: '待复核',
                path: '/participant/onlineSigning/cancelTrader/pending',
              },
              {
                key: 'participant-online-cancelTrader-reviewed',
                label: '已复核',
                path: '/participant/onlineSigning/cancelTrader/reviewed',
              },
            ],
          },
        ],
      },
      {
        key: 'participant-spotPlatform',
        label: '现货平台管理',
        icon: Setting,
        children: [
          { key: 'participant-spotPlatform-query', label: '查询', path: '/participant/spotPlatform/query' },
          { key: 'participant-spotPlatform-pending', label: '待复核', path: '/participant/spotPlatform/pending' },
          { key: 'participant-spotPlatform-reviewed', label: '已复核', path: '/participant/spotPlatform/reviewed' },
        ],
      },
      {
        key: 'participant-spotPlatformFundAccount',
        label: '现货平台资金账号管理',
        icon: Coin,
        children: [
          { key: 'participant-spotPlatformFundAccount-query', label: '查询', path: '/participant/spotPlatformFundAccount/query' },
          {
            key: 'participant-spotPlatformFundAccount-pending',
            label: '待复核',
            path: '/participant/spotPlatformFundAccount/pending',
          },
          {
            key: 'participant-spotPlatformFundAccount-reviewed',
            label: '已复核',
            path: '/participant/spotPlatformFundAccount/reviewed',
          },
        ],
      },
      {
        key: 'participant-spotClearingMember',
        label: '现货清算成员管理',
        icon: Connection,
        children: [
          { key: 'participant-spotClearingMember-query', label: '查询', path: '/participant/spotClearingMember/query' },
          {
            key: 'participant-spotClearingMember-pending',
            label: '待复核',
            path: '/participant/spotClearingMember/pending',
          },
          {
            key: 'participant-spotClearingMember-reviewed',
            label: '已复核',
            path: '/participant/spotClearingMember/reviewed',
          },
        ],
      },
      {
        key: 'participant-spotSettlementAccount',
        label: '现货结算账号管理',
        icon: Coin,
        children: [
          { key: 'participant-spotSettlementAccount-query', label: '查询', path: '/participant/spotSettlementAccount/query' },
          {
            key: 'participant-spotSettlementAccount-pending',
            label: '待复核',
            path: '/participant/spotSettlementAccount/pending',
          },
          {
            key: 'participant-spotSettlementAccount-reviewed',
            label: '已复核',
            path: '/participant/spotSettlementAccount/reviewed',
          },
        ],
      },
      {
        key: 'participant-spotClearingProduct',
        label: '现货清算产品管理',
        icon: Box,
        children: [
          { key: 'participant-spotClearingProduct-query', label: '查询', path: '/participant/spotClearingProduct/query' },
          {
            key: 'participant-spotClearingProduct-pending',
            label: '待复核',
            path: '/participant/spotClearingProduct/pending',
          },
          {
            key: 'participant-spotClearingProduct-reviewed',
            label: '已复核',
            path: '/participant/spotClearingProduct/reviewed',
          },
        ],
      },
      {
        key: 'participantCertificate',
        label: '参与者证书管理',
        icon: Document,
        children: [
          { key: 'participantCertificate-query', label: '查询', path: '/participant/participantCertificate/query' },
          { key: 'participantCertificate-pending', label: '待复核', path: '/participant/participantCertificate/pending' },
          { key: 'participantCertificate-reviewed', label: '已复核', path: '/participant/participantCertificate/reviewed' },
        ],
      },
      {
        key: 'participant-warehouseOrg',
        label: '仓储机构管理',
        icon: OfficeBuilding,
        children: [
          { key: 'participant-warehouseOrg-query', label: '查询', path: '/participant/warehouseOrg/query' },
          { key: 'participant-warehouseOrg-pending', label: '待复核', path: '/participant/warehouseOrg/pending' },
          { key: 'participant-warehouseOrg-reviewed', label: '已复核', path: '/participant/warehouseOrg/reviewed' },
        ],
      },
      {
        key: 'participant-warehouseArea',
        label: '库区管理',
        icon: OfficeBuilding,
        children: [
          { key: 'participant-warehouseArea-query', label: '查询', path: '/participant/warehouseArea/query' },
          { key: 'participant-warehouseArea-pending', label: '待复核', path: '/participant/warehouseArea/pending' },
          { key: 'participant-warehouseArea-reviewed', label: '已复核', path: '/participant/warehouseArea/reviewed' },
        ],
      },
      {
        key: 'participant-warehouseAreaStorageRelation',
        label: '库区存放关系管理',
        icon: OfficeBuilding,
        children: [
          {
            key: 'participant-warehouseAreaStorageRelation-query',
            label: '查询',
            path: '/participant/warehouseAreaStorageRelation/query',
          },
          {
            key: 'participant-warehouseAreaStorageRelation-pending',
            label: '待复核',
            path: '/participant/warehouseAreaStorageRelation/pending',
          },
          {
            key: 'participant-warehouseAreaStorageRelation-reviewed',
            label: '已复核',
            path: '/participant/warehouseAreaStorageRelation/reviewed',
          },
        ],
      },
    ],
  },
]

export const menuTree: MenuItem[] = baseMenuTree.filter((item) => item.key !== 'participant')

export const findMenuPath = (path: string) => {
  const trail: MenuItem[] = []
  const dfs = (items: MenuItem[]) => {
    for (const item of items) {
      trail.push(item)
      if (item.path === path) return true
      if (item.children && dfs(item.children)) return true
      trail.pop()
    }
    return false
  }
  return dfs(menuTree) ? [...trail] : null
}

export const getTabItems = (path: string) => {
  const trail = findMenuPath(path)
  if (!trail || trail.length < 2) return []
  const parent = trail[trail.length - 2]
  if (!parent || !parent.children) return []
  if (parent.children.every((item) => item.path)) return parent.children
  return []
}
