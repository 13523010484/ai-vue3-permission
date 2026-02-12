import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/index.vue'
import { BaseLayout } from '../layout'
import DepartmentQuery from '../views/department/query.vue'
import DepartmentPending from '../views/department/pending.vue'
import DepartmentReviewed from '../views/department/reviewed.vue'
import PostQuery from '../views/post/query.vue'
import PostPending from '../views/post/pending.vue'
import PostReviewed from '../views/post/reviewed.vue'
import UserAdminQuery from '../views/userAdmin/query.vue'
import UserAdminPending from '../views/userAdmin/pending.vue'
import UserAdminReviewed from '../views/userAdmin/reviewed.vue'
import UserOperatorQuery from '../views/userOperator/query.vue'
import UserOperatorPending from '../views/userOperator/pending.vue'
import UserOperatorReviewed from '../views/userOperator/reviewed.vue'
import ParticipantSpotTraderQuery from '../views/participant/spotTrader/query.vue'
import ParticipantSpotTraderPending from '../views/participant/spotTrader/pending.vue'
import ParticipantSpotTraderReviewed from '../views/participant/spotTrader/reviewed.vue'
import ParticipantTraderFundQuery from '../views/participant/traderFundAccount/query.vue'
import ParticipantTraderFundPending from '../views/participant/traderFundAccount/pending.vue'
import ParticipantTraderFundReviewed from '../views/participant/traderFundAccount/reviewed.vue'
import ParticipantOnlineNewTraderQuery from '../views/participant/onlineSigning/newTrader/query.vue'
import ParticipantOnlineNewTraderPending from '../views/participant/onlineSigning/newTrader/pending.vue'
import ParticipantOnlineNewTraderReviewed from '../views/participant/onlineSigning/newTrader/reviewed.vue'
import ParticipantOnlineTraderChangeQuery from '../views/participant/onlineSigning/traderChange/query.vue'
import ParticipantOnlineTraderChangePending from '../views/participant/onlineSigning/traderChange/pending.vue'
import ParticipantOnlineTraderChangeReviewed from '../views/participant/onlineSigning/traderChange/reviewed.vue'
import ParticipantOnlineNewTraderFundQuery from '../views/participant/onlineSigning/newTraderFundAccount/query.vue'
import ParticipantOnlineNewTraderFundPending from '../views/participant/onlineSigning/newTraderFundAccount/pending.vue'
import ParticipantOnlineNewTraderFundReviewed from '../views/participant/onlineSigning/newTraderFundAccount/reviewed.vue'
import ParticipantOnlineTerminateTraderFundQuery from '../views/participant/onlineSigning/terminateTraderFundAccount/query.vue'
import ParticipantOnlineTerminateTraderFundPending from '../views/participant/onlineSigning/terminateTraderFundAccount/pending.vue'
import ParticipantOnlineTerminateTraderFundReviewed from '../views/participant/onlineSigning/terminateTraderFundAccount/reviewed.vue'
import ParticipantOnlineCancelTraderQuery from '../views/participant/onlineSigning/cancelTrader/query.vue'
import ParticipantOnlineCancelTraderPending from '../views/participant/onlineSigning/cancelTrader/pending.vue'
import ParticipantOnlineCancelTraderReviewed from '../views/participant/onlineSigning/cancelTrader/reviewed.vue'
import ParticipantSpotPlatformQuery from '../views/participant/spotPlatform/query.vue'
import ParticipantSpotPlatformPending from '../views/participant/spotPlatform/pending.vue'
import ParticipantSpotPlatformReviewed from '../views/participant/spotPlatform/reviewed.vue'
import ParticipantSpotPlatformFundQuery from '../views/participant/spotPlatformFundAccount/query.vue'
import ParticipantSpotPlatformFundPending from '../views/participant/spotPlatformFundAccount/pending.vue'
import ParticipantSpotPlatformFundReviewed from '../views/participant/spotPlatformFundAccount/reviewed.vue'
import ParticipantSpotClearingMemberQuery from '../views/participant/spotClearingMember/query.vue'
import ParticipantSpotClearingMemberPending from '../views/participant/spotClearingMember/pending.vue'
import ParticipantSpotClearingMemberReviewed from '../views/participant/spotClearingMember/reviewed.vue'
import ParticipantSpotSettlementAccountQuery from '../views/participant/spotSettlementAccount/query.vue'
import ParticipantSpotSettlementAccountPending from '../views/participant/spotSettlementAccount/pending.vue'
import ParticipantSpotSettlementAccountReviewed from '../views/participant/spotSettlementAccount/reviewed.vue'
import ParticipantSpotClearingProductQuery from '../views/participant/spotClearingProduct/query.vue'
import ParticipantSpotClearingProductPending from '../views/participant/spotClearingProduct/pending.vue'
import ParticipantSpotClearingProductReviewed from '../views/participant/spotClearingProduct/reviewed.vue'
import ParticipantCertificateQuery from '../views/participant/participantCertificate/query.vue'
import ParticipantCertificatePending from '../views/participant/participantCertificate/pending.vue'
import ParticipantCertificateReviewed from '../views/participant/participantCertificate/reviewed.vue'
import ParticipantWarehouseOrgQuery from '../views/participant/warehouseOrg/query.vue'
import ParticipantWarehouseOrgPending from '../views/participant/warehouseOrg/pending.vue'
import ParticipantWarehouseOrgReviewed from '../views/participant/warehouseOrg/reviewed.vue'
import ParticipantWarehouseAreaQuery from '../views/participant/warehouseArea/query.vue'
import ParticipantWarehouseAreaPending from '../views/participant/warehouseArea/pending.vue'
import ParticipantWarehouseAreaReviewed from '../views/participant/warehouseArea/reviewed.vue'
import ParticipantWarehouseAreaStorageQuery from '../views/participant/warehouseAreaStorageRelation/query.vue'
import ParticipantWarehouseAreaStoragePending from '../views/participant/warehouseAreaStorageRelation/pending.vue'
import ParticipantWarehouseAreaStorageReviewed from '../views/participant/warehouseAreaStorageRelation/reviewed.vue'

const managementRoutes = [
  { path: 'department/query', component: DepartmentQuery },
  { path: 'department/pending', component: DepartmentPending },
  { path: 'department/reviewed', component: DepartmentReviewed },
  { path: 'post/query', component: PostQuery },
  { path: 'post/pending', component: PostPending },
  { path: 'post/reviewed', component: PostReviewed },
  { path: 'userAdmin/query', component: UserAdminQuery },
  { path: 'userAdmin/pending', component: UserAdminPending },
  { path: 'userAdmin/reviewed', component: UserAdminReviewed },
  { path: 'userOperator/query', component: UserOperatorQuery },
  { path: 'userOperator/pending', component: UserOperatorPending },
  { path: 'userOperator/reviewed', component: UserOperatorReviewed },
]

const participantRoutes = [
  { path: 'participant/spotTrader/query', component: ParticipantSpotTraderQuery },
  { path: 'participant/spotTrader/pending', component: ParticipantSpotTraderPending },
  { path: 'participant/spotTrader/reviewed', component: ParticipantSpotTraderReviewed },
  { path: 'participant/traderFundAccount/query', component: ParticipantTraderFundQuery },
  { path: 'participant/traderFundAccount/pending', component: ParticipantTraderFundPending },
  { path: 'participant/traderFundAccount/reviewed', component: ParticipantTraderFundReviewed },
  { path: 'participant/onlineSigning/newTrader/query', component: ParticipantOnlineNewTraderQuery },
  { path: 'participant/onlineSigning/newTrader/pending', component: ParticipantOnlineNewTraderPending },
  { path: 'participant/onlineSigning/newTrader/reviewed', component: ParticipantOnlineNewTraderReviewed },
  { path: 'participant/onlineSigning/traderChange/query', component: ParticipantOnlineTraderChangeQuery },
  { path: 'participant/onlineSigning/traderChange/pending', component: ParticipantOnlineTraderChangePending },
  { path: 'participant/onlineSigning/traderChange/reviewed', component: ParticipantOnlineTraderChangeReviewed },
  {
    path: 'participant/onlineSigning/newTraderFundAccount/query',
    component: ParticipantOnlineNewTraderFundQuery,
  },
  {
    path: 'participant/onlineSigning/newTraderFundAccount/pending',
    component: ParticipantOnlineNewTraderFundPending,
  },
  {
    path: 'participant/onlineSigning/newTraderFundAccount/reviewed',
    component: ParticipantOnlineNewTraderFundReviewed,
  },
  {
    path: 'participant/onlineSigning/terminateTraderFundAccount/query',
    component: ParticipantOnlineTerminateTraderFundQuery,
  },
  {
    path: 'participant/onlineSigning/terminateTraderFundAccount/pending',
    component: ParticipantOnlineTerminateTraderFundPending,
  },
  {
    path: 'participant/onlineSigning/terminateTraderFundAccount/reviewed',
    component: ParticipantOnlineTerminateTraderFundReviewed,
  },
  { path: 'participant/onlineSigning/cancelTrader/query', component: ParticipantOnlineCancelTraderQuery },
  { path: 'participant/onlineSigning/cancelTrader/pending', component: ParticipantOnlineCancelTraderPending },
  { path: 'participant/onlineSigning/cancelTrader/reviewed', component: ParticipantOnlineCancelTraderReviewed },
  { path: 'participant/spotPlatform/query', component: ParticipantSpotPlatformQuery },
  { path: 'participant/spotPlatform/pending', component: ParticipantSpotPlatformPending },
  { path: 'participant/spotPlatform/reviewed', component: ParticipantSpotPlatformReviewed },
  { path: 'participant/spotPlatformFundAccount/query', component: ParticipantSpotPlatformFundQuery },
  { path: 'participant/spotPlatformFundAccount/pending', component: ParticipantSpotPlatformFundPending },
  { path: 'participant/spotPlatformFundAccount/reviewed', component: ParticipantSpotPlatformFundReviewed },
  { path: 'participant/spotClearingMember/query', component: ParticipantSpotClearingMemberQuery },
  { path: 'participant/spotClearingMember/pending', component: ParticipantSpotClearingMemberPending },
  { path: 'participant/spotClearingMember/reviewed', component: ParticipantSpotClearingMemberReviewed },
  { path: 'participant/spotSettlementAccount/query', component: ParticipantSpotSettlementAccountQuery },
  { path: 'participant/spotSettlementAccount/pending', component: ParticipantSpotSettlementAccountPending },
  { path: 'participant/spotSettlementAccount/reviewed', component: ParticipantSpotSettlementAccountReviewed },
  { path: 'participant/spotClearingProduct/query', component: ParticipantSpotClearingProductQuery },
  { path: 'participant/spotClearingProduct/pending', component: ParticipantSpotClearingProductPending },
  { path: 'participant/spotClearingProduct/reviewed', component: ParticipantSpotClearingProductReviewed },
  { path: 'participant/participantCertificate/query', component: ParticipantCertificateQuery },
  { path: 'participant/participantCertificate/pending', component: ParticipantCertificatePending },
  { path: 'participant/participantCertificate/reviewed', component: ParticipantCertificateReviewed },
  { path: 'participant/warehouseOrg/query', component: ParticipantWarehouseOrgQuery },
  { path: 'participant/warehouseOrg/pending', component: ParticipantWarehouseOrgPending },
  { path: 'participant/warehouseOrg/reviewed', component: ParticipantWarehouseOrgReviewed },
  { path: 'participant/warehouseArea/query', component: ParticipantWarehouseAreaQuery },
  { path: 'participant/warehouseArea/pending', component: ParticipantWarehouseAreaPending },
  { path: 'participant/warehouseArea/reviewed', component: ParticipantWarehouseAreaReviewed },
  { path: 'participant/warehouseAreaStorageRelation/query', component: ParticipantWarehouseAreaStorageQuery },
  { path: 'participant/warehouseAreaStorageRelation/pending', component: ParticipantWarehouseAreaStoragePending },
  { path: 'participant/warehouseAreaStorageRelation/reviewed', component: ParticipantWarehouseAreaStorageReviewed },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: BaseLayout,
      redirect: '/department/query',
      children: [
        {
          path: 'departmentManagement',
          redirect: '/department/query',
        },
        {
          path: 'departmentManagement/query',
          component: DepartmentQuery,
        },
        {
          path: 'departmentManagement/pending',
          component: DepartmentPending,
        },
        {
          path: 'departmentManagement/reviewed',
          component: DepartmentReviewed,
        },
        ...managementRoutes,
        ...participantRoutes,
      ],
    },
  ],
})

export default router


