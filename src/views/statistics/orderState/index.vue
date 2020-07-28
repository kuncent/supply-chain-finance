<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="查询时间：">
            <el-date-picker
              v-model="createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="list"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column label="总子订单数" align="center">
          <template slot-scope="scope">{{scope.row.subOrderCount}}</template>
        </el-table-column>
        <el-table-column label="总父订单数" align="center">
          <template slot-scope="scope">{{scope.row.orderCount}}</template>
        </el-table-column>
        <el-table-column label="退款子订单数" align="center">
          <template slot-scope="scope">{{scope.row.refundCount}}</template>
        </el-table-column>
        <el-table-column label="待付款子订单数" align="center">
          <template slot-scope="scope">{{scope.row.unpayCount}}</template>
        </el-table-column>
        <el-table-column label="GMV" align="center">
          <template slot-scope="scope">{{scope.row.gvm}}</template>
        </el-table-column>
        <el-table-column label="销售额" align="center">
          <template slot-scope="scope">{{scope.row.sales}}</template>
        </el-table-column>
        <el-table-column label="实付金额" align="center">
          <template slot-scope="scope">{{scope.row.cost}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { fetchOrderStatList } from "@/api/statics";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  statDateGe: null,
  statDateLe: null
};
export default {
  name: "userList",
  components: { LogisticsDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: [],
      total: null,
      createTime: null,
      isSendGift: false,
      sendQuery: {
        id: null,
        amount: null,
        password: null
      }
    };
  },
  created() {
    this.listQuery.statDateGe = formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
    this.listQuery.statDateLe = formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
    this.createTime = [new Date(), new Date()];
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      if (!time) return
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    sendGiftConfim(row) {
      this.isSendGift = true;
      this.sendQuery.id = row.id;
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.statDateGe = formatDate(new Date(this.createTime[0]),"yyyy-MM-dd hh:mm:ss");
      this.listQuery.statDateLe = formatDate(new Date(this.createTime[0]),"yyyy-MM-dd hh:mm:ss");
      this.listQuery.pageNum = 1;
      this.searchStatus = this.listQuery.status;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleViewDelivery(id) {
      viewDelivery(id).then(response => {
        const list = response.data.list;
        this.viewDeliveryDilog = true;
        this.deliveryList = list;
        console.log(this.deliveryList);
      });
    },
    handleDeliveryOrder(index, row) {
      let listItem = this.covertOrder(row);
      this.$router.push({
        path: "/oms/deliverOrderList",
        query: { list: [listItem] }
      });
    },
    handleViewLogistics(index, row) {
      this.logisticsDialogVisible = true;
    },
    handleDeleteOrder(index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      this.list = [];
      fetchOrderStatList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list.push(response.data);
      });
    }
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


